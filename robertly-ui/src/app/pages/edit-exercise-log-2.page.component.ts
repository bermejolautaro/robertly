import {
  DecimalPipe,
  JsonPipe,
  Location,
  SlicePipe,
  TitleCasePipe,
} from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { Exercise } from '@models/exercise.model';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { TypeaheadComponent } from '@components/typeahead.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DAY_JS, Paths } from 'src/main';
import {
  CreateExerciseLogRequest,
  ExerciseLogApiService,
  UpdateExerciseLogRequest,
} from '@services/exercise-log-api.service';
import { ToastService } from '@services/toast.service';
import { AuthService } from '@services/auth.service';
import { ExerciseApiService } from '@services/exercises-api.service';
import { ExerciseLogComponent } from '@components/exercise-log.component';
import { ConfirmModalComponent } from '@components/confirm-modal.component';
import { take } from 'rxjs';
import { User } from '@models/user.model';

import { OnlyNumbersDirective } from '../directives/only-numbers.directive';
import { parseNumber } from '@validators/parse-number';
import { OfflineQueueService } from '@services/offline-queue.service';
import { isNullOrUndefined } from '../functions/is-null-or-undefined';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExerciseLog } from '@models/exercise-log.model';
import { DatabaseService } from '@services/database.service';
import { tempId } from '../functions/temp-id';

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
    JsonPipe,
    OnlyNumbersDirective,
  ],
})
export class EditExerciseLogPage2Component {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly modalService = inject(NgbModal);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public readonly exerciseApiService = inject(ExerciseApiService);
  private readonly dbService = inject(DatabaseService);
  private readonly authService = inject(AuthService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly offlineQueueService = inject(OfflineQueueService);
  private readonly toastService = inject(ToastService);
  private readonly dayjs = inject(DAY_JS);

  public readonly form = new FormGroup({
    user: new FormControl<User | null>(null, Validators.required),
    exercise: new FormControl<Exercise | null>(null, Validators.required),
    date: new FormControl<string | null>(null, Validators.required),
    series: new FormArray(createEmptySeriesArray()),
  });

  public readonly mode = signal<'create' | 'edit'>('create');
  public readonly exerciseLogId = signal<number | null>(null);
  public readonly isLoading = signal(true);
  public readonly isSaveLoading = signal(false);
  public readonly users = signal<User[]>([]);

  public readonly userSelector = (x: User | null) => x?.name ?? '';

  public readonly exerciseSelector = (x: Exercise | null) =>
    this.titleCasePipe.transform(x?.name) ?? '';

  public recentlyUpdated = signal<ExerciseLog[]>([]);

  public initialValue = signal<ExerciseLog | null>(null);
  public initialFormValue = structuredClone(this.form.getRawValue());

  private formChanges = toSignal(this.form.valueChanges);

  public readonly hasUnsavedChanges = computed(() => {
    this.formChanges();
    const current = this.form.getRawValue();

    if (this.mode() === 'create') {
      return false;
    }

    return JSON.stringify(current) !== JSON.stringify(this.initialFormValue);
  });

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.exerciseLogId.set(id ? Number(id) : null);
    this.mode.set(this.exerciseLogId() ? 'edit' : 'create');

    const user = this.authService.user.value();

    if (!user) {
      throw new Error('No user');
    }

    this.users.set([user, ...(user?.assignedUsers ?? [])]);

    if (this.mode() === 'edit') {
      this.loadExerciseLog();
    } else {
      this.form.patchValue({
        user: this.authService.user.value(),
        date: this.dayjs().format('YYYY-MM-DD'),
      });

      this.isLoading.set(false);
    }
  }

  private async loadExerciseLog(): Promise<void> {
    const exerciseLogId = this.exerciseLogId();

    if (!exerciseLogId) {
      return;
    }

    try {
      // const logs = await this.exerciseLogApiService.getRecentlyUpdated();
      // this.recentlyUpdated.set(logs);
    } catch (e) {
      this.router.navigate([Paths.HOME]);
    }

    try {
      const log =
        await this.exerciseLogApiService.getExerciseLogById(exerciseLogId);

      if (!log || typeof log === 'string') {
        this.router.navigate([Paths.HOME]);
        return;
      }

      this.form.patchValue({
        user: log.user,
        exercise: log.exercise,
        date: this.dayjs(log.exerciseLogDate).format('YYYY-MM-DD'),
      });

      this.form.controls.series.controls.forEach((serieFormGroup, i) => {
        const serieFromDb = log.series?.at(i);

        if (serieFromDb) {
          serieFormGroup.patchValue({
            serieId: serieFromDb.serieId,
            reps: serieFromDb.reps?.toString(),
            weightInKg: serieFromDb.weightInKg?.toString(),
          });
        } else {
          serieFormGroup.reset();
        }
      });

      this.initialValue.set(log);
      this.initialFormValue = structuredClone(this.form.getRawValue());

      this.isLoading.set(false);
    } catch (e) {
      this.router.navigate([Paths.HOME]);
    }
  }

  public async save(): Promise<void> {
    if (this.form.invalid) return;

    this.isSaveLoading.set(true);

    const formValue = this.form.value;
    const date = this.dayjs(formValue.date).format('YYYY-MM-DD');

    const series =
      formValue.series?.map(s => ({
        exerciseLogId: this.exerciseLogId(),
        serieId: s.serieId ?? tempId(),
        reps: parseNumber(s.reps),
        weightInKg: parseNumber(s.weightInKg),
        brzycki: 0,
      })) ?? [];

    const seriesIdsToDelete = series
      .filter(
        x =>
          (!x.reps || isNullOrUndefined(x.weightInKg)) &&
          x.serieId &&
          x.serieId > 0
      )
      .map(x => x.serieId);

    const sanitizedSeries =
      series.filter(
        x => !isNullOrUndefined(x.reps) || !isNullOrUndefined(x.weightInKg)
      ) ?? [];

    this.form.controls.series.controls.forEach((serieFormGroup, i) => {
      const sanitizedSerie = sanitizedSeries?.at(i);

      if (sanitizedSerie) {
        serieFormGroup.patchValue({
          serieId: sanitizedSerie.serieId,
          reps: sanitizedSerie.reps?.toString(),
          weightInKg: sanitizedSerie.weightInKg?.toString(),
        });
      } else {
        serieFormGroup.reset();
      }
    });

    setTimeout(() => {
      this.isSaveLoading.set(false);
    }, 100);

    if (this.mode() === 'create') {
      const exercise =
        this.exerciseApiService
          .exercises()
          .find(x => x.exerciseId === formValue.exercise!.exerciseId) ?? null;

      const user =
        this.users().find(x => x.userId === formValue.user!.userId) ?? null;

      const request: CreateExerciseLogRequest = {
        seriesIdsToDelete,
        exerciseLog: {
          exerciseLogId: tempId(),
          exerciseLogUserId: formValue.user!.userId,
          exerciseLogExerciseId: formValue.exercise!.exerciseId,
          exerciseLogDate: date,
          series: sanitizedSeries,
          averageBrzycki: null,
          averageEpley: null,
          averageLander: null,
          averageLombardi: null,
          averageMayhew: null,
          averageOConner: null,
          averageWathan: null,
          totalReps: null,
          tonnage: null,
          averageReps: null,
          recentLogs: null,
          createdAtUtc: null,
          lastUpdatedAtUtc: new Date().toISOString(),
          deleted: false,
          syncStatus: 'pending',
          createdByUserId: null,
          exercise: exercise,
          lastUpdatedByUserId: null,
          user: user,
        },
      };

      await this.enqueueCreate(request);
    } else {
      const exerciseLogId = this.exerciseLogId();

      if (!exerciseLogId) {
        return;
      }

      const exercise =
        this.exerciseApiService
          .exercises()
          .find(x => x.exerciseId === formValue.exercise!.exerciseId) ?? null;

      const user =
        this.users().find(x => x.userId === formValue.user!.userId) ?? null;

      const request: UpdateExerciseLogRequest = {
        id: exerciseLogId,
        seriesIdsToDelete,
        exerciseLog: {
          exerciseLogId: exerciseLogId,
          exerciseLogUserId: formValue.user!.userId,
          exerciseLogExerciseId: formValue.exercise!.exerciseId,
          exerciseLogDate: date,
          series: sanitizedSeries,
          averageBrzycki: null,
          averageEpley: null,
          averageLander: null,
          averageLombardi: null,
          averageMayhew: null,
          averageOConner: null,
          averageWathan: null,
          totalReps: null,
          tonnage: null,
          averageReps: null,
          recentLogs: null,
          createdAtUtc: null,
          lastUpdatedAtUtc: new Date().toISOString(),
          deleted: false,
          syncStatus: 'pending',
          createdByUserId: null,
          exercise: exercise,
          lastUpdatedByUserId: null,
          user: user,
        },
      };

      await this.enqueueUpdate(request);
    }

    this.offlineQueueService.processQueue();
  }

  private async enqueueCreate(
    request: CreateExerciseLogRequest
  ): Promise<void> {
    await this.dbService.db?.exerciseLogs.put(request.exerciseLog);

    request.exerciseLog.series?.forEach(serie => {
      if ((serie.serieId ?? -1) < 0) {
        serie.serieId = null;
      }
    });

    this.offlineQueueService.enqueue({
      id: crypto.randomUUID(),
      method: 'POST',
      endpoint: 'exercise-logs',
      payload: request,
      retries: 0,
      maxRetries: 3,
      optimisticType: 'exercise-log',
      userUuid: this.authService.userUuid()!,
    });

    this.toastService.ok('Log enqueued for creation successfully!');
  }

  private async enqueueUpdate(
    request: UpdateExerciseLogRequest
  ): Promise<void> {
    await this.dbService.db?.exerciseLogs.put(request.exerciseLog);

    request.exerciseLog.series?.forEach(serie => {
      if ((serie.serieId ?? -1) < 0) {
        serie.serieId = null;
      }
    });

    this.offlineQueueService.enqueue({
      id: crypto.randomUUID(),
      method: 'PUT',
      endpoint: `exercise-logs/${this.exerciseLogId()}`,
      payload: request,
      retries: 0,
      maxRetries: 3,
      optimisticType: 'exercise-log',
      userUuid: this.authService.userUuid()!,
    });

    this.toastService.ok('Log enqueued for update successfully!');
  }

  public openDeleteModal(): void {
    if (!this.exerciseLogId) return;

    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
    });

    const instance: ConfirmModalComponent = modalRef.componentInstance;

    instance.configure({
      title: 'Delete Record',
      subtitle: '<strong>Are you sure you want to delete this record?</strong>',
      body: 'This record will be permanently deleted. <span class="text-danger">This operation can not be undone.</span>',
      okType: 'danger',
    });

    modalRef.closed.pipe(take(1)).subscribe(() => {
      const exerciseLogId = this.exerciseLogId() ?? -1;

      if (exerciseLogId > 0) {
        this.offlineQueueService.enqueue({
          id: crypto.randomUUID(),
          method: 'DELETE',
          endpoint: `exercise-logs/${this.exerciseLogId()}`,
          payload: exerciseLogId,
          retries: 0,
          maxRetries: 3,
          optimisticType: 'exercise-log',
          userUuid: this.authService.userUuid()!,
        });
      }

      this.dbService.db?.exerciseLogs.delete(exerciseLogId);

      this.toastService.ok('Log deleted successfully!');
      this.router.navigate([Paths.HOME]);
    });
  }

  public cancel(): void {
    this.location.back();
  }
}

function createEmptySeriesArray() {
  return Array.from({ length: 5 }).map(
    () =>
      new FormGroup({
        serieId: new FormControl<number | null>(null),
        reps: new FormControl<string | null>(null),
        weightInKg: new FormControl<string | null>(null),
      })
  );
}
