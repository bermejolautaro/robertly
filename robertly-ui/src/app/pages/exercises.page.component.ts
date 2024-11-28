import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TypeaheadComponent } from '@components/typeahead.component';
import { Exercise } from '@models/exercise.model';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CreateExerciseRequest, ExerciseApiService, UpdateExerciseRequest } from '@services/exercises-api.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-exercises-page',
  templateUrl: './exercises.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, NgbModalModule, FormsModule, ReactiveFormsModule, TypeaheadComponent],
})
export class ExercisesPageComponent implements OnInit {
  private readonly modalService = inject(NgbModal);
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

  public async ngOnInit(): Promise<void> {
    await this.exerciseApiService.fetchExercises();
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
      async () => {
        this.isUpdate = !!exercise;

        if (!exercise) {
          const request: CreateExerciseRequest = {
            name: this.exerciseForm.value.name!.toLowerCase(),
            muscleGroup: this.exerciseForm.value.muscleGroup!,
            type: this.exerciseForm.value.type!,
          };

          await lastValueFrom(this.exerciseApiService.createExercise(request));
        } else {
          const request: UpdateExerciseRequest = {
            id: exercise.exerciseId!,
            name: this.exerciseForm.value.name!.toLowerCase(),
            muscleGroup: this.exerciseForm.value.muscleGroup!,
            type: this.exerciseForm.value.type!,
          };
          await lastValueFrom(this.exerciseApiService.updateExercise(request));
        }

        await this.exerciseApiService.fetchExercises();
      },
      () => {}
    );
  }

  public async deleteExercise(exercise: Exercise): Promise<void> {
    await lastValueFrom(this.exerciseApiService.deleteExercise(exercise.exerciseId!));
    await this.exerciseApiService.fetchExercises();
  }

  public close(modal: NgbModalRef): void {
    modal.close();
  }
}
