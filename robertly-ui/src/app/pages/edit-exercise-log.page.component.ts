import { KeyValuePipe, NgClass, TitleCasePipe } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  Input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ExerciseLogDto } from '@models/exercise-log.model';
import { Exercise } from '@models/exercise.model';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
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
import { DayjsService as DayJsService } from '@services/dayjs.service';
import { CREATE_LOG_VALUE_CACHE_KEY } from '@models/constants';
import { ExerciseLogComponent } from '@components/exercise-log.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    NgClass,
  ],
})
export class EditExerciseLogPageComponent implements OnInit {
  public readonly exerciseLogService = inject(ExerciseLogService);

  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly dayJsService = inject(DayJsService);
  private readonly route = inject(ActivatedRoute);

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
      } else {
        this.initEditMode();
      }
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
        date: this.dayJsService.parseDate(x.date).format('YYYY-MM-DD'),
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

  public ngOnInit(): void {

  }

  public saveExerciseLog(): void {
    this.isLoading.set(true);
    if (this.mode === 'create') {
      this.createExerciseLog();
    } else {
      this.updateExerciseLog(this.originalValue()!);
    }
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
        exerciseLogDate: this.dayJsService.parseDate(this.createOrUpdateLogFormGroup.value.date!).format('YYYY-MM-DD'),
        series: (this.createOrUpdateLogFormGroup.value.series ?? [])
          .filter(x => !!x.reps && !!x.weightInKg)
          .map(x => ({
            exerciseLogId: x.exerciseLogId!,
            serieId: x.serieId!,
            reps: +x.reps!,
            weightInKg: +x.weightInKg!.toFixed(1),
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
        exerciseLogDate: this.dayJsService.parseDate(this.createOrUpdateLogFormGroup.value.date!).format('YYYY-MM-DD'),
        series: (this.createOrUpdateLogFormGroup.value.series ?? [])
          .filter(x => !!x.reps && !!x.weightInKg)
          .map(x => ({
            exerciseLogId: x.exerciseLogId!,
            serieId: x.serieId!,
            reps: +x.reps!,
            weightInKg: +x.weightInKg!.toFixed(1),
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
}
