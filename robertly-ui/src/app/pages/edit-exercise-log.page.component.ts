import { DecimalPipe, KeyValuePipe, Location, NgClass, TitleCasePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal, computed, effect, untracked } from '@angular/core';
import { ExerciseLogDto, Serie } from '@models/exercise-log.model';
import { Exercise } from '@models/exercise.model';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseLogService } from '@services/exercise-log.service';
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
import { CREATE_LOG_VALUE_CACHE_KEY } from '@models/constants';
import { ExerciseLogComponent } from '@components/exercise-log.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmModalComponent } from '@components/confirm-modal.component';
import { lastValueFrom, startWith, take } from 'rxjs';
import { Dayjs } from 'dayjs';
import { CreateOrUpdateSerieFormGroupValue } from '@models/create-or-update-serie';
import { User } from '@models/user.model';

import * as R from 'remeda';

@Component({
  selector: 'edit-exercise-log-page',
  templateUrl: 'edit-exercise-log.page.component.html',
  styleUrl: 'edit-exercise-log.page.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgbTypeaheadModule,
    TypeaheadComponent,
    ExerciseLogComponent,
    KeyValuePipe,
    DecimalPipe,
    NgClass,
  ],
})
export class EditExerciseLogPageComponent {
  public readonly exerciseLogService = inject(ExerciseLogService);

  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly dayjsService = inject(DayjsService);
  private readonly dayjs = this.dayjsService.instance;
  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(NgbModal);

  public originalValue = signal<ExerciseLogDto | null>(null);
  public isLoading = signal<boolean>(false);
  public saveButtonClicked = signal<boolean>(false);

  public paramMap = toSignal(this.route.paramMap);
  public exerciseLogId = computed(() => this.paramMap()?.get(Paths.LOGS_ID_PARAM));

  public url = toSignal(this.route.url, { initialValue: [] });
  public mode = computed(() => (this.url().some(x => x.path === Paths.LOGS_CREATE) ? 'create' : 'edit'));

  public createOrUpdateLogFormGroup = computed(() => {
    const mode = this.mode();
    const updateFormGroup = this.updateLogFormGroup();

    const logFromGroup = createLogFormGroup();

    if (mode === 'create') {
      const todayDate = this.dayjs().format('YYYY-MM-DD');
      logFromGroup.controls.date.patchValue(todayDate);

      return logFromGroup;
    }

    if (mode === 'edit') {
      return updateFormGroup;
    }

    return logFromGroup;
  });

  public hasUnsavedChanges = signal(false);

  public readonly exerciseSelector = (x: string | Exercise | null) =>
    typeof x === 'string' ? '' : this.titleCasePipe.transform(x?.name) ?? '';

  private updateLogFormGroup = signal(createLogFormGroup());

  public constructor() {
    effect(cleanUp => {
      const formGroup = this.createOrUpdateLogFormGroup();
      const originalValue = this.originalValue();

      untracked(() => {
        const subscription = formGroup.valueChanges.pipe(startWith(null)).subscribe(formValue => {
          if (!formValue) {
            this.hasUnsavedChanges.set(false);
            return;
          }

          const originalLog = { series: toSeries(originalValue?.series.map(x => ({ ...x, brzycki: null }))) ?? [] };
          const updatedLog = { series: toSeries(formValue.series) };

          this.hasUnsavedChanges.set(!R.isDeepEqual(originalLog, updatedLog));
        });

        cleanUp(() => subscription.unsubscribe());
      });
    });

    effect(() => {
      const saveButtonClicked = this.saveButtonClicked();
      const exerciseLogIdString = this.exerciseLogId();

      untracked(async () => {
        const mode = this.mode();
        const formGroup = this.createOrUpdateLogFormGroup();

        this.isLoading.set(true);

        if (saveButtonClicked) {
          const exercise = formGroup.value.exercise;
          const date = this.dayjsService.parseDate(formGroup.value.date!);
          const exerciseLog = this.originalValue();

          const user = this.authService.user();

          if (!user) {
            throw new Error('User cannot be null');
          }

          if (formGroup.valid && typeof exercise !== 'string' && !!exercise) {
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
            } else {
              const request = toUpdateExerciseLogRequest(exerciseLog?.id!, formGroup, user, exercise!, date);

              try {
                await lastValueFrom(this.exerciseLogApiService.updateExerciseLog(request));
                this.toastService.ok('Log updated successfully!');
              } catch (e) {
                this.toastService.error(`${e}`);
              }
            }
          }
        } else {
          const exerciseLogId = Number(exerciseLogIdString);

          if (!!exerciseLogId) {
            const exerciseLog = await lastValueFrom(this.exerciseLogApiService.getExerciseLogById(exerciseLogId));

            const formGroup = createLogFormGroup();

            this.originalValue.set(exerciseLog);
            formGroup.patchValue({
              exercise: exerciseLog.exercise,
              date: this.dayjsService.parseDate(exerciseLog.date).format('YYYY-MM-DD'),
              user: exerciseLog.user.name,
              series: exerciseLog.series.map(x => ({
                exerciseLogId: x.exerciseLogId,
                serieId: x.serieId,
                reps: x.reps,
                weightInKg: x.weightInKg,
              })),
            });

            this.updateLogFormGroup.set(formGroup);
          }
        }

        this.saveButtonClicked.set(false);
        this.isLoading.set(false);
      });
    });
  }

  public openDeleteModal(): void {
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
    const instance: ConfirmModalComponent = modalRef.componentInstance;

    instance.title = 'Delete Record';
    instance.subtitle = '<strong>Are you sure you want to delete this record?</strong>';
    instance.body =
      'This record will be permanently deleted. <span class="text-danger">This operation can not be undone.</span>';
    instance.okType = 'danger';

    modalRef.closed.pipe(take(1)).subscribe(() => {
      this.exerciseLogService.deleteLog$.next(this.originalValue()!);
    });
  }

  public cancel(): void {
    this.exerciseLogService.refreshLogs$.pipe(take(1)).subscribe(() => {
      this.location.back();
    });
    this.exerciseLogService.refreshLogs$.next();
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
      exerciseLogUsername: user?.name ?? formGroup.value.user!.toLocaleLowerCase(),
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
