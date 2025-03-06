import { DecimalPipe, KeyValuePipe, Location, SlicePipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
  untracked,
  linkedSignal,
} from '@angular/core';
import { ExerciseLogDto, Serie } from '@models/exercise-log.model';
import { Exercise } from '@models/exercise.model';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TypeaheadComponent } from '@components/typeahead.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Paths } from 'src/main';
import { createLogFormGroup, CreateOrUpdateLogFormGroup } from '@models/create-or-update-log';
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
import { Dayjs } from 'dayjs';
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
    KeyValuePipe,
    DecimalPipe,
    SlicePipe,
  ],
})
export class EditExerciseLogPageComponent {
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
  public readonly exerciseLogId = computed(() => this.paramMap()?.get(Paths.LOGS_ID_PARAM));

  public readonly url = toSignal(this.route.url, { initialValue: [] });
  public readonly mode = computed(() => (this.url().some(x => x.path === Paths.LOGS_CREATE) ? 'create' : 'edit'));

  public readonly formGroup = signal(createLogFormGroup());
  public readonly formGroupValue = toSignal(this.formGroup().valueChanges);

  public readonly userSelector = (x: string | User | null) => (typeof x === 'string' ? '' : x?.name ?? '');

  public readonly exerciseSelector = (x: string | Exercise | null) =>
    typeof x === 'string' ? '' : this.titleCasePipe.transform(x?.name) ?? '';

  public readonly users = computed(() => {
    const user = this.authService.user()!;

    return [user, ...(user?.assignedUsers ?? [])];
  });

  public originalValue = rxResource({
    request: this.exerciseLogId,
    loader: ({ request: exerciseLogIdString }) => {
      const exerciseLogId = Number(exerciseLogIdString);
      return !!exerciseLogId ? this.exerciseLogApiService.getExerciseLogById(exerciseLogId) : of(null);
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

        this.formGroup.update(formGroup => {
          formGroup.patchValue({
            date: todayDate,
            user: user?.name ?? '',
          });

          return formGroup;
        });
      });
    }

    if (mode === 'edit' && !!exerciseLog) {
      this.formGroup.update(form => {
        form.reset();
        form.patchValue({
          exercise: exerciseLog.exercise,
          date: this.dayjsService.parseDate(exerciseLog.date).format('YYYY-MM-DD'),
          user: exerciseLog.user,
          series: exerciseLog.series.map(x => ({
            exerciseLogId: x.exerciseLogId,
            serieId: x.serieId,
            reps: x.reps,
            weightInKg: x.weightInKg,
          })),
        });

        return form;
      });
    }
  });

  public hasUnsavedChanges = signal(false);

  readonly #onFormValueOrOriginalValueChangeThenUpdateHasUnsavedChanges = effect(() => {
    const formValue = this.formGroupValue();
    const originalValue = this.originalValue.value();
    const mode = this.mode();

    if (!formValue) {
      this.hasUnsavedChanges.set(false);
      return;
    }

    const originalLog = { series: toSeries(originalValue?.series.map(x => ({ ...x, brzycki: null }))) ?? [] };
    const updatedLog = { series: toSeries(formValue.series) };

    this.hasUnsavedChanges.set(mode === 'edit' && !R.isDeepEqual(originalLog, updatedLog));
  });

  public openDeleteModal(): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
    const instance: ConfirmModalComponent = modalRef.componentInstance;

    instance.title.set('Delete Record');
    instance.subtitle.set('<strong>Are you sure you want to delete this record?</strong>');
    instance.body.set(
      'This record will be permanently deleted. <span class="text-danger">This operation can not be undone.</span>'
    );
    instance.okType.set('danger');

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
    const formGroup = this.formGroup();

    this.isSaveLoading.set(true);

    const user = formGroup.value.user;
    const exercise = formGroup.value.exercise;
    const date = this.dayjsService.parseDate(formGroup.value.date!);
    const exerciseLog = this.originalValue.value();

    if (!user) {
      throw new Error('User cannot be null');
    }

    if (formGroup.valid && typeof exercise !== 'string' && !!exercise && typeof user !== 'string' && !!user) {
      formGroup.disable();

      if (mode === 'create') {
        const request = toCreateExerciseLogRequest(formGroup, user, exercise, date);

        try {
          const exerciseLogId = await lastValueFrom(this.exerciseLogApiService.createExerciseLog(request));
          localStorage.removeItem(CREATE_LOG_VALUE_CACHE_KEY);
          this.toastService.ok('Log created successfully!');
          this.router.navigate([Paths.LOGS, Paths.LOGS_EDIT, exerciseLogId]);
        } catch (e) {
          this.toastService.error(`${e}`);
        }
      }

      if (mode === 'edit') {
        const request = toUpdateExerciseLogRequest(exerciseLog?.id!, formGroup, user, exercise!, date);

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
    formGroup.enable();
  }

  public cancel(): void {
    this.location.back();
  }
}

function toCreateExerciseLogRequest(
  formGroup: CreateOrUpdateLogFormGroup,
  user: User,
  exercise: Exercise,
  date: Dayjs
): CreateExerciseLogRequest {
  return toCreateExerciseLogRequest2(
    user?.userId!,
    user?.name ?? formGroup.value.user!,
    exercise.exerciseId!,
    date,
    toSeries(formGroup.value.series)
  );
}

function toCreateExerciseLogRequest2(
  userId: number,
  username: string,
  exerciseId: number,
  date: Dayjs,
  series: Serie[]
): CreateExerciseLogRequest {
  return toUpdateExerciseLogRequest2(null!, userId, username, exerciseId, date, series);
}

function toUpdateExerciseLogRequest(
  exerciseLogId: number,
  formGroup: CreateOrUpdateLogFormGroup,
  user: User,
  exercise: Exercise,
  date: Dayjs
): UpdateExerciseLogRequest {
  return {
    id: exerciseLogId,
    exerciseLog: {
      exerciseLogUsername: user?.name,
      exerciseLogUserId: user.userId,
      exerciseLogExerciseId: exercise.exerciseId,
      exerciseLogDate: date.format('YYYY-MM-DD'),
      series: toSeries(formGroup.value.series),
    },
  };
}

function toUpdateExerciseLogRequest2(
  exerciseLog: ExerciseLogDto,
  userId: number,
  username: string,
  exerciseId: number,
  date: Dayjs,
  series: Serie[]
): UpdateExerciseLogRequest {
  return {
    id: exerciseLog?.id!,
    exerciseLog: {
      exerciseLogUsername: username.toLocaleLowerCase(),
      exerciseLogUserId: userId,
      exerciseLogExerciseId: exerciseId,
      exerciseLogDate: date.format('YYYY-MM-DD'),
      series: series,
    },
  };
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
