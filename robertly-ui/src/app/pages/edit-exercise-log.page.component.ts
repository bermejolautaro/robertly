import { DecimalPipe, KeyValuePipe, Location, NgClass, TitleCasePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal, WritableSignal } from '@angular/core';
import { ExerciseLogDto } from '@models/exercise-log.model';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmModalComponent } from '@components/confirm-modal.component';
import { take } from 'rxjs';

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

  public mode: 'edit' | 'create' = null!;
  public createOrUpdateLogFormGroup: CreateOrUpdateLogFormGroup = null!;
  public originalValue: WritableSignal<ExerciseLogDto | null> = signal(null)!;
  public isLoading: WritableSignal<boolean> = signal(false);

  public readonly exerciseSelector = (x: string | Exercise | null) =>
    typeof x === 'string' ? '' : this.titleCasePipe.transform(x?.name) ?? '';

  public constructor() {
    this.route.url.pipe(takeUntilDestroyed()).subscribe(url => {
      this.createOrUpdateLogFormGroup = createLogFormGroup();

      const isCreate = url.some(x => x.path === Paths.LOGS_CREATE);

      if (isCreate) {
        this.mode = 'create';
        const todayDate = this.dayjs().format('YYYY-MM-DD');
        this.createOrUpdateLogFormGroup.controls.date.patchValue(todayDate);
      } else {
        this.initEditMode();
      }
    });
  }

  public openDeleteModal(): void {
    this.modalService
      .open(ConfirmModalComponent, { centered: true })
      .closed.pipe(take(1))
      .subscribe(() => {
        this.exerciseLogService.deleteLog$.next(this.originalValue()!);
      });
  }

  public saveExerciseLog(): void {
    this.isLoading.set(true);
    if (this.mode === 'create') {
      this.createExerciseLog();
    } else {
      this.updateExerciseLog(this.originalValue()!);
    }
  }

  public cancel(): void {
    this.exerciseLogService.refreshLogs$.pipe(take(1)).subscribe(() => {
      this.location.back();
    });
    this.exerciseLogService.refreshLogs$.next();
  }

  private createExerciseLog(): void {
    if (this.createOrUpdateLogFormGroup.invalid) {
      return;
    }

    if (typeof this.createOrUpdateLogFormGroup.value.exercise === 'string') {
      return;
    }

    const user = this.authService.user();

    const request: CreateExerciseLogRequest = {
      exerciseLog: {
        exerciseLogUsername: user?.name ?? this.createOrUpdateLogFormGroup.value.user!.toLocaleLowerCase(),
        exerciseLogUserId: user?.userId,
        exerciseLogExerciseId: this.createOrUpdateLogFormGroup.value.exercise!.exerciseId,
        exerciseLogDate: this.dayjsService.parseDate(this.createOrUpdateLogFormGroup.value.date!).format('YYYY-MM-DD'),
        series: (this.createOrUpdateLogFormGroup.value.series ?? [])
          .filter(x => !!x.reps && !!x.weightInKg)
          .map(x => ({
            exerciseLogId: x.exerciseLogId!,
            serieId: x.serieId!,
            reps: +x.reps!,
            weightInKg: +x.weightInKg!.toFixed(1),
            brzycki: null
          })),
      },
    };

    this.exerciseLogApiService.createExerciseLog(request).subscribe({
      next: exerciseLogId => {
        this.createOrUpdateLogFormGroup.reset();
        localStorage.removeItem(CREATE_LOG_VALUE_CACHE_KEY);
        this.toastService.ok('Log created successfully!');
        this.router.navigate([Paths.LOGS, Paths.LOGS_EDIT, exerciseLogId]);
      },
      error: () => {
        this.toastService.error();
      },
    });
  }

  private updateExerciseLog(exerciseLog?: ExerciseLogDto): void {
    if (this.createOrUpdateLogFormGroup.invalid) {
      return;
    }

    if (typeof this.createOrUpdateLogFormGroup.value.exercise === 'string') {
      return;
    }

    const user = this.authService.user();

    const request: UpdateExerciseLogRequest = {
      id: exerciseLog?.id!,
      exerciseLog: {
        exerciseLogUsername: user?.name ?? this.createOrUpdateLogFormGroup.value.user!.toLocaleLowerCase(),
        exerciseLogUserId: user?.userId,
        exerciseLogExerciseId: this.createOrUpdateLogFormGroup.value.exercise!.exerciseId,
        exerciseLogDate: this.dayjsService.parseDate(this.createOrUpdateLogFormGroup.value.date!).format('YYYY-MM-DD'),
        series: (this.createOrUpdateLogFormGroup.value.series ?? [])
          .filter(x => !!x.reps && !!x.weightInKg)
          .map(x => ({
            exerciseLogId: x.exerciseLogId!,
            serieId: x.serieId!,
            reps: +x.reps!,
            weightInKg: +x.weightInKg!.toFixed(1),
            brzycki: null
          })),
      },
    };

    this.exerciseLogApiService.updateExerciseLog(request).subscribe({
      next: () => {
        this.createOrUpdateLogFormGroup.reset();
        this.toastService.ok('Log updated successfully!');
        this.initEditMode();
      },
      error: () => {
        this.toastService.error();
      },
    });
  }

  private initEditMode(): void {
    this.isLoading.set(true);
    const exerciseLogId = Number(this.route.snapshot.paramMap.get(Paths.LOGS_ID_PARAM));
    this.mode = 'edit';
    this.exerciseLogApiService.getExerciseLogById(exerciseLogId).subscribe(x => {
      this.originalValue.set(x);
      this.createOrUpdateLogFormGroup.reset();
      this.createOrUpdateLogFormGroup.patchValue({
        exercise: x.exercise,
        date: this.dayjsService.parseDate(x.date).format('YYYY-MM-DD'),
        user: x.user.name,
        series: x.series.map(x => ({
          exerciseLogId: x.exerciseLogId,
          serieId: x.serieId,
          reps: x.reps,
          weightInKg: x.weightInKg,
        })),
      });
      this.isLoading.set(false);
    });
  }
}
