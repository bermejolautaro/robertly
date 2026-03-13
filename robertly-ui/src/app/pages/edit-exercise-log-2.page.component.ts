import { DecimalPipe, JsonPipe, Location, SlicePipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { Exercise } from '@models/exercise.model';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
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
  private readonly authService = inject(AuthService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly offlineQueueService = inject(OfflineQueueService);
  private readonly toastService = inject(ToastService);
  private readonly dayjs = inject(DAY_JS);

  public readonly form = new FormGroup({
    user: new FormControl<User | null>(null, Validators.required),
    exercise: new FormControl<Exercise | null>(null, Validators.required),
    date: new FormControl<string | null>(null, Validators.required),
    series: new FormArray(createEmptySeriesArray())
  });

  public readonly mode = signal<'create' | 'edit'>('create');
  public readonly exerciseLogId = signal<number | null>(null);
  public readonly isLoading = signal(true);
  public readonly isSaveLoading = signal(false);
  public readonly users = signal<User[]>([]);

  public readonly userSelector = (x: User | null) => x?.name ?? '';

  public readonly exerciseSelector = (x: Exercise | null) => this.titleCasePipe.transform(x?.name) ?? '';

  private initialValue = structuredClone(this.form.getRawValue());

  private formChanges = toSignal(this.form.valueChanges);


  public readonly hasUnsavedChanges = computed(() => {
    this.formChanges();
    const current = this.form.getRawValue();

    if (this.mode() === 'create') {
      return false;
    }

    return JSON.stringify(current) !== JSON.stringify(this.initialValue);
  });

  public markSaved(): void {
    this.initialValue = structuredClone(this.form.getRawValue());
  }

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
        date: this.dayjs().format('YYYY-MM-DD')
      });

      this.isLoading.set(false);
    }
  }

  private loadExerciseLog(): void {
    const exerciseLogId = this.exerciseLogId();

    if (!exerciseLogId) {
      return;
    }

    this.exerciseLogApiService.getExerciseLogById(exerciseLogId)
      .subscribe({
        next: log => {
          this.form.patchValue({
            user: log.user,
            exercise: log.exercise,
            date: this.dayjs(log.exerciseLogDate).format('YYYY-MM-DD')
          })

          log.series?.forEach((serie, i) => {
            const emptySerie = this.form.controls.series.at(i);

            if (emptySerie) {
              emptySerie.patchValue({
                serieId: serie.serieId,
                reps: serie.reps?.toString(),
                weightInKg: serie.weightInKg?.toString()
              })
            }
          });

          this.markSaved();

          this.isLoading.set(false);
        },
        error: () => this.router.navigate([Paths.HOME])
      })
  }

  public save(): void {
    if (this.form.invalid) return;

    this.isSaveLoading.set(true);

    const formValue = this.form.value;
    const date = this.dayjs(formValue.date).format('YYYY-MM-DD');

    const series = formValue.series?.map((s: any) => ({
      exerciseLogId: this.exerciseLogId(),
      serieId: s.serieId,
      reps: parseNumber(s.reps),
      weightInKg: parseNumber(s.weightInKg),
      brzycki: 0,
    })) ?? [];

    const seriesIdsToDelete = series
      .filter(x => (!x.reps || isNullOrUndefined(x.weightInKg)) && x.serieId)
      .map(x => x.serieId);

    if (this.mode() === 'create') {
      const request: CreateExerciseLogRequest = {
        seriesIdsToDelete,
        exerciseLog: {
          exerciseLogUserId: formValue.user!.userId,
          exerciseLogExerciseId: formValue.exercise!.exerciseId,
          exerciseLogDate: date,
          series: series,
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
          lastUpdatedAtUtc: null,
          createdByUserId: null,
          exercise: null,
          exerciseLogId: null,
          lastUpdatedByUserId: null,
          user: null,
        }
      };
      this.enqueueCreate(request);
    } else {
      const request: UpdateExerciseLogRequest = {
        id: this.exerciseLogId()!,
        seriesIdsToDelete,
        exerciseLog: {
          exerciseLogUserId: formValue.user!.userId,
          exerciseLogExerciseId: formValue.exercise!.exerciseId,
          exerciseLogDate: date,
          series,
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
          lastUpdatedAtUtc: null,
          createdByUserId: null,
          exercise: null,
          exerciseLogId: null,
          lastUpdatedByUserId: null,
          user: null,
        }
      };
      this.enqueueUpdate(request);
    }
  }

  private enqueueCreate(request: CreateExerciseLogRequest) {
    this.offlineQueueService.enqueue({
      id: crypto.randomUUID(),
      method: 'POST',
      endpoint: 'exercise-logs',
      payload: request,
      retries: 0,
      maxRetries: 3,
      optimisticType: 'exercise-log',
      userUuid: this.authService.userUuid()!,
      onActionDone: (id) => {
        this.isSaveLoading.set(false);
        this.router.navigate([Paths.EXERCISE_LOGS, Paths.EDIT, id]);
      },
    });

    this.toastService.ok('Log enqueued for creation successfully!');
  }

  private enqueueUpdate(request: UpdateExerciseLogRequest) {
    this.offlineQueueService.enqueue({
      id: crypto.randomUUID(),
      method: 'PUT',
      endpoint: `exercise-logs/${this.exerciseLogId()}`,
      payload: request,
      retries: 0,
      maxRetries: 3,
      optimisticType: 'exercise-log',
      userUuid: this.authService.userUuid()!,
      onActionDone: () => {
        this.isSaveLoading.set(false);
        this.loadExerciseLog();
      },
    });

    this.toastService.ok('Log enqueued for update successfully!');
  }

  public openDeleteModal(): void {
    if (!this.exerciseLogId) return;

    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });

    const instance: ConfirmModalComponent = modalRef.componentInstance;

    instance.configure({
      title: 'Delete Record',
      subtitle: '<strong>Are you sure you want to delete this record?</strong>',
      body: 'This record will be permanently deleted. <span class="text-danger">This operation can not be undone.</span>',
      okType: 'danger',
    });

    modalRef.closed.pipe(take(1)).subscribe(() => {
      this.exerciseLogApiService
        .deleteExerciseLog(this.exerciseLogId()!)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.toastService.ok('Log deleted successfully!');
            this.router.navigate([Paths.HOME]);
          },
          error: err => this.toastService.error(err.message)
        });
    });
  }

  public cancel(): void {
    this.location.back();
  }

}

function createEmptySeriesArray() {
  return Array.from({ length: 5 }).map(() =>
    new FormGroup({
      serieId: new FormControl<number | null>(null),
      reps: new FormControl<string | null>(null),
      weightInKg: new FormControl<string | null>(null)
    })
  );
}