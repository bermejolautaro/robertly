import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TypeaheadComponent } from '@components/typeahead.component';
import { Exercise } from '@models/exercise.model';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseLogService } from '@services/exercise-log.service';
import { CreateExerciseRequest, ExerciseApiService, UpdateExerciseRequest } from '@services/exercises-api.service';

@Component({
  selector: 'app-exercises-page',
  templateUrl: './exercises.page.component.html',
  styles: ``,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, NgbModalModule, NgClass, FormsModule, ReactiveFormsModule, TypeaheadComponent],
})
export class ExercisesPageComponent implements OnInit {
  private readonly modalService = inject(NgbModal);
  public readonly exerciseLogService = inject(ExerciseLogService);
  public readonly exerciseApiService = inject(ExerciseApiService);

  public readonly exerciseForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    muscleGroup: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
  });

  public isUpdate: boolean = false;

  public constructor() {
    this.exerciseForm.controls.name.valueChanges.subscribe(x => {
      this.exerciseForm.controls.name.patchValue(x?.toLowerCase() ?? '', { emitEvent: false });
    });
  }

  public ngOnInit(): void {
    this.fetchAndUpdateExercises();
  }

  public open(content: TemplateRef<unknown>, exercise: Exercise | null): void {
    this.exerciseForm.reset();

    if (exercise) {
      this.exerciseForm.patchValue({
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        type: exercise.type,
      });
    }

    this.modalService.open(content, { centered: true }).result.then(
      () => {
        this.isUpdate = !!exercise;

        if (!exercise) {
          const request: CreateExerciseRequest = {
            name: this.exerciseForm.value.name!.toLowerCase(),
            muscleGroup: this.exerciseForm.value.muscleGroup!,
            type: this.exerciseForm.value.type!,
          };

          this.exerciseApiService.createExercise(request).subscribe({
            next: () => this.fetchAndUpdateExercises(),
          });
        } else {
          const request: UpdateExerciseRequest = {
            id: exercise.exerciseId!,
            name: this.exerciseForm.value.name!.toLowerCase(),
            muscleGroup: this.exerciseForm.value.muscleGroup!,
            type: this.exerciseForm.value.type!,
          };

          this.exerciseApiService.updateExercise(request).subscribe({
            next: () => this.fetchAndUpdateExercises(),
          });
        }
      },
      () => {}
    );
  }

  public close(modal: NgbModalRef): void {
    modal.close();
  }

  public deleteExercise(exercise: Exercise): void {
    this.exerciseApiService.deleteExercise(exercise.exerciseId!).subscribe({
      next: () => this.fetchAndUpdateExercises(),
    });
  }

  private fetchAndUpdateExercises(): void {
    this.exerciseLogService.updateExercises$.next([]);
    this.exerciseApiService.getExercises().subscribe(x => {
      this.exerciseLogService.updateExercises$.next(x);
    });
  }
}
