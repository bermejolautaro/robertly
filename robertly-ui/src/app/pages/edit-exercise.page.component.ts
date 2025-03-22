import { TitleCasePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, computed, inject, signal, effect, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmModalComponent } from '@components/confirm-modal.component';
import { TypeaheadComponent } from '@components/typeahead.component';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateExerciseRequest, ExerciseApiService, UpdateExerciseRequest } from '@services/exercises-api.service';
import { ToastService } from '@services/toast.service';
import { take, lastValueFrom } from 'rxjs';
import { Paths } from 'src/main';

@Component({
  selector: 'edit-exercise-page',
  templateUrl: './edit-exercise.page.component.html',
  styleUrl: './edit-exercise.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, NgbTypeaheadModule, TypeaheadComponent],
})
export class EditExercisePageComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(NgbModal);

  public readonly exerciseApiService = inject(ExerciseApiService);

  public readonly exerciseIdFromRoute = input<number | undefined>(undefined, { alias: 'id' });

  private readonly url = toSignal(this.route.url, { initialValue: [] });
  public readonly mode = computed(() => {
    return this.url().some(x => x.path === Paths.CREATE) ? 'create' : 'edit';
  });

  public readonly exercise = computed(() => {
    return this.exerciseApiService.exercises().find(x => x.exerciseId === this.exerciseIdFromRoute());
  });

  public readonly isSaveLoading = signal(false);
  public readonly titleCaseSelector = (x: string | null) => (!!x ? this.titleCasePipe.transform(x) : '');

  public readonly exerciseForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    muscleGroup: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
  });

  public constructor() {
    effect(() => {
      const exercise = this.exercise();

      if (exercise) {
        this.exerciseForm.patchValue({
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          type: exercise.type,
        });
      }
    });
  }

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
      const exercise = this.exercise();

      if (exercise?.exerciseId) {
        try {
          await lastValueFrom(this.exerciseApiService.deleteExercise(exercise.exerciseId));
          this.router.navigate([Paths.EXERCISES]);
        } catch (e) {
          const error = e as HttpErrorResponse;
          this.toastService.error(`${error.message}`);
        }
      }
    });
  }

  public async save(): Promise<void> {
    this.isSaveLoading.set(true);
    this.exerciseForm.disable();

    try {
      if (this.mode() === 'create') {
        const request: CreateExerciseRequest = {
          name: this.exerciseForm.value.name!.toLowerCase(),
          muscleGroup: this.exerciseForm.value.muscleGroup!.toLowerCase(),
          type: this.exerciseForm.value.type!.toLowerCase(),
        };

        await lastValueFrom(this.exerciseApiService.createExercise(request));
      } else {
        const request: UpdateExerciseRequest = {
          exerciseId: this.exercise()!.exerciseId!,
          name: this.exerciseForm.value.name!.toLowerCase(),
          muscleGroup: this.exerciseForm.value.muscleGroup!.toLowerCase(),
          type: this.exerciseForm.value.type!.toLowerCase(),
        };
        await lastValueFrom(this.exerciseApiService.updateExercise(request));
      }
    } catch (error) {
      this.toastService.error('An error ocurred while saving the exercise.');
    } finally {
      this.isSaveLoading.set(false);
      this.exerciseForm.enable();
      this.router.navigate([Paths.EXERCISES]);
    }
  }

  public cancel(): void {
    this.location.back();
  }
}
