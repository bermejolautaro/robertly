import { DecimalPipe, Location, SlicePipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
  untracked,
  linkedSignal,
  input,
  numberAttribute,
} from '@angular/core';
import { Serie } from '@models/exercise-log.model';
import { Exercise } from '@models/exercise.model';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TypeaheadComponent } from '@components/typeahead.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Paths } from 'src/main';
import { createLogFormSignal } from '@models/create-or-update-log';
import {
  CreateExerciseLogRequest,
  ExerciseLogApiService,
  UpdateExerciseLogRequest,
} from '@services/exercise-log-api.service';
import { ToastService } from '@services/toast.service';
import { AuthService } from '@services/auth.service';
import { DayjsService } from '@services/dayjs.service';
import { ExerciseApiService } from '@services/exercises-api.service';
import { CREATE_LOG_VALUE_CACHE_KEY } from '@models/constants';
import { ExerciseLogComponent } from '@components/exercise-log/exercise-log.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ConfirmModalComponent } from '@components/confirm-modal.component';
import { lastValueFrom, of, take } from 'rxjs';
import { CreateOrUpdateSerieFormGroupValue } from '@models/create-or-update-serie';
import { User } from '@models/user.model';

import * as R from 'remeda';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'edit-exercise-log-page',
  templateUrl: 'edit-exercise-log.page.component.html',
  styleUrl: 'edit-exercise-log.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgbTypeaheadModule,
    TypeaheadComponent,
    ExerciseLogComponent,
    DecimalPipe,
    SlicePipe,
  ],
})
export class EditExerciseLogPageComponent {
  public readonly exerciseLogId = input(null, { alias: 'id', transform: numberAttribute });
  public readonly authService = inject(AuthService);
  public readonly exerciseLogApiService = inject(ExerciseLogApiService);
  public readonly exerciseApiService = inject(ExerciseApiService);

  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly dayjsService = inject(DayjsService);
  private readonly dayjs = this.dayjsService.instance;
  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(NgbModal);

  public readonly isSaveLoading = signal(false);
  public readonly isLoading = linkedSignal(() => this.originalValue.isLoading());
  public readonly paramMap = toSignal(this.route.paramMap);

  public readonly url = toSignal(this.route.url, { initialValue: [] });
  public readonly mode = computed(() => (this.url().some(x => x.path === Paths.CREATE) ? 'create' : 'edit'));

  public readonly formSignal = createLogFormSignal();
  public readonly formValid = computed(() => {
    return true;
  });

  public readonly formValue = computed(() => ({
    user: this.formSignal.user(),
    exercise: this.formSignal.exercise(),
    date: this.formSignal.date(),
    series: this.formSignal.series(),
  }));

  public readonly formEnabled = signal(false);

  public readonly userSelector = (x: User | null) => x?.name ?? '';

  public readonly exerciseSelector = (x: Exercise | null) => this.titleCasePipe.transform(x?.name) ?? '';

  public readonly users = computed(() => {
    const user = this.authService.user()!;

    return [user, ...(user?.assignedUsers ?? [])];
  });

  public originalValue = rxResource({
    request: this.exerciseLogId,
    loader: ({ request: exerciseLogId }) => {
      if (!exerciseLogId) {
        return of(null);
      }

      return this.exerciseLogApiService.getExerciseLogById(exerciseLogId);
    },
  });

  readonly #onOriginalValueErrorNavigateToHome = effect(() => {
    if (this.originalValue.error()) {
      this.router.navigate([Paths.HOME]);
    }
  });

  readonly #onModeOrOriginalValueChangeTheUpdateForm = effect(() => {
    const mode = this.mode();
    const exerciseLog = this.originalValue.value();
    const { user } = untracked(() => ({ user: this.authService.user() }));

    if (mode === 'create') {
      untracked(() => {
        const todayDate = this.dayjs().format('YYYY-MM-DD');

        this.formSignal.date.set(todayDate);
        this.formSignal.user.set(user);
      });
    }

    if (mode === 'edit' && !!exerciseLog) {
      this.formSignal.exercise.set(exerciseLog.exercise);
      this.formSignal.date.set(this.dayjsService.parseDate(exerciseLog.date).format('YYYY-MM-DD'));
      this.formSignal.user.set(exerciseLog.user);
      this.formSignal.series.update(x => {
        for (let i = 0; i < x.length; i++) {
          x[i]?.set({
            serieId: exerciseLog.series[i]?.serieId ?? null,
            reps: signal(exerciseLog.series[i]?.reps ?? null),
            weightInKg: signal(exerciseLog.series[i]?.weightInKg ?? null),
          });
        }
        return x;
      });
    }
  });

  public hasUnsavedChanges = signal(false);

  readonly #onFormValueOrOriginalValueChangeThenUpdateHasUnsavedChanges = effect(() => {
    const formValue = this.formValue();

    if (!formValue.user) {
      this.hasUnsavedChanges.set(false);
      return;
    }

    const originalValue = this.originalValue.value();
    const mode = this.mode();

    const originalSeries =
      originalValue?.series.map(x => ({
        reps: x.reps,
        weightInKg: x.weightInKg,
        serieId: x.serieId,
      })) ?? [];

    const updatedSeries = formValue.series
      .map(serie => serie())
      .filter(x => !!x.reps() || !!x.weightInKg())
      .map(x => ({
        serieId: x.serieId,
        reps: x.reps(),
        weightInKg: x.weightInKg(),
      }));

    const result =
      (mode === 'edit' && !R.isDeepEqual(originalSeries, updatedSeries)) ||
      originalValue?.exercise.exerciseId !== formValue.exercise?.exerciseId ||
      originalValue?.user.userId !== formValue.user.userId ||
      this.dayjs(originalValue?.date).unix() !== this.dayjs(formValue.date).unix();

    this.hasUnsavedChanges.set(result);
  });

  public openDeleteModal(): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
    const instance: ConfirmModalComponent = modalRef.componentInstance;

    instance.configurate({
      title: 'Delete Record',
      subtitle: '<strong>Are you sure you want to delete this record?</strong>',
      body: 'This record will be permanently deleted. <span class="text-danger">This operation can not be undone.</span>',
      okType: 'danger',
    });

    modalRef.closed.pipe(take(1)).subscribe(async () => {
      const log = this.originalValue.value();

      if (log) {
        try {
          await lastValueFrom(this.exerciseLogApiService.deleteExerciseLog(log.id));
          this.toastService.ok('Log deleted successfully!');
          this.router.navigate([Paths.HOME]);
        } catch (e) {
          const error = e as HttpErrorResponse;
          this.toastService.error(`${error.message}`);
        }
      }
    });
  }

  public async save(): Promise<void> {
    const mode = this.mode();
    this.isSaveLoading.set(true);

    const user = this.formSignal.user();
    const exercise = this.formSignal.exercise();
    const date = this.dayjsService.parseDate(this.formSignal.date());

    if (!user) {
      throw new Error('User cannot be null');
    }

    if (this.formValid() && typeof exercise !== 'string' && !!exercise && typeof user !== 'string' && !!user) {
      this.formEnabled.set(true);

      if (mode === 'create') {
        const series: Serie[] = this.formSignal.series().map(x => {
          const serie = x();

          return {
            exerciseLogId: this.exerciseLogId(),
            serieId: serie.serieId,
            reps: serie.reps(),
            weightInKg: serie.weightInKg(),
            brzycki: 0,
          };
        });

        const seriesIdsToDelete = series
          .filter(x => !x.reps || !x.weightInKg)
          .filter(x => !!x.serieId)
          .map(x => x.serieId!);

        const request: CreateExerciseLogRequest = {
          seriesIdsToDelete,
          exerciseLog: {
            exerciseLogUsername: user?.name,
            exerciseLogUserId: user.userId,
            exerciseLogExerciseId: exercise.exerciseId ?? undefined,
            exerciseLogDate: date.format('YYYY-MM-DD'),
            series: series,
          },
        };
        try {
          const exerciseLogId = await lastValueFrom(this.exerciseLogApiService.createExerciseLog(request));
          localStorage.removeItem(CREATE_LOG_VALUE_CACHE_KEY);
          this.toastService.ok('Log created successfully!');
          this.router.navigate([Paths.EXERCISE_LOGS, Paths.EDIT, exerciseLogId]);
        } catch (e) {
          this.toastService.error(`${e}`);
        }
      }

      if (mode === 'edit') {
        const series: Serie[] = this.formSignal.series().map(x => {
          const serie = x();

          return {
            exerciseLogId: this.exerciseLogId(),
            serieId: serie.serieId,
            reps: serie.reps(),
            weightInKg: serie.weightInKg(),
            brzycki: 0,
          };
        });

        const seriesIdsToDelete = series
          .filter(x => !x.reps || !x.weightInKg)
          .filter(x => !!x.serieId)
          .map(x => x.serieId!);

        const request: UpdateExerciseLogRequest = {
          seriesIdsToDelete,
          id: this.exerciseLogId()!,
          exerciseLog: {
            exerciseLogUsername: user?.name,
            exerciseLogUserId: user.userId,
            exerciseLogExerciseId: exercise.exerciseId ?? undefined,
            exerciseLogDate: date.format('YYYY-MM-DD'),
            series: series,
          },
        };

        try {
          await lastValueFrom(this.exerciseLogApiService.updateExerciseLog(request));
          this.toastService.ok('Log updated successfully!');
          this.originalValue.reload();
        } catch (e) {
          const error = e as HttpErrorResponse;
          this.toastService.error(`${error.message}`);
        }
      }
    }

    this.isSaveLoading.set(false);
    this.formEnabled.set(false);
  }

  public cancel(): void {
    this.location.back();
  }
}

function toSerie(x: CreateOrUpdateSerieFormGroupValue): Serie {
  return {
    exerciseLogId: x.exerciseLogId!,
    serieId: x.serieId!,
    reps: +x.reps!,
    weightInKg: +x.weightInKg!.toFixed(1),
    brzycki: null,
  };
}

function toSeries(series: CreateOrUpdateSerieFormGroupValue[] | undefined): Serie[] {
  return (series ?? []).filter(x => !!x.reps && !!x.weightInKg).map(toSerie);
}
