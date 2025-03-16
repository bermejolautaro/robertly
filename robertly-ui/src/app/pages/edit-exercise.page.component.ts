import { TitleCasePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, computed, inject, signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmModalComponent } from '@components/confirm-modal.component';
import { TypeaheadComponent } from '@components/typeahead.component';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth.service';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { CreateExerciseRequest, ExerciseApiService, UpdateExerciseRequest } from '@services/exercises-api.service';
import { ToastService } from '@services/toast.service';
import { take, lastValueFrom } from 'rxjs';
import { Paths } from 'src/main';

@Component({
  selector: 'edit-exercise-page',
  templateUrl: 'edit-exercise.page.component.html',
  styles: `
    :host {
      --bs-body-bg: var(--light-bg);
      --bs-body-color: var(--font-color);
      --bs-tertiary-bg: var(--primary);
      --bs-border-width: 1px;
      --bs-border-color: rgba(255, 255, 255, 0.15);
    }

    .card {
      --bs-card-spacer-y: 0.5rem;
      --bs-card-spacer-x: 0.5rem;
    }

    .title {
      margin: 0;
    }

    .subtitle {
      font-size: 14px;
      opacity: 0.7;
    }

    .card {
      background-color: var(--bg);
      border: 1px solid rgb(255 255 255 / 10%);
    }

    .serie-label {
      font-size: 12px;
      color: rgb(255 255 255 / 75%);
      padding: 0 0.5rem;
    }

    .delete-button {
      background-color: rgb(48, 27, 35);
      --bs-btn-border-color: #6e363b;
      color: rgb(250, 137, 137);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, NgbTypeaheadModule, TypeaheadComponent],
})
export class EditExercisePageComponent {
  public readonly exerciseApiService = inject(ExerciseApiService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(NgbModal);

  public readonly authService = inject(AuthService);

  private readonly paramMap = toSignal(this.route.paramMap);
  private readonly exerciseId = computed(() => this.paramMap()?.get(Paths.ID));
  private readonly url = toSignal(this.route.url, { initialValue: [] });

  public readonly hasUnsavedChanges = signal(false);
  public readonly isSaveLoading = signal(false);
  public readonly mode = computed(() => (this.url().some(x => x.path === Paths.CREATE) ? 'create' : 'edit'));
  public readonly titleCaseSelector = (x: string | null) => (!!x ? this.titleCasePipe.transform(x) : '');

  public readonly exercise = computed(() => {
    const exerciseId = this.exerciseId();
    return this.exerciseApiService.exercises().find(x => x.exerciseId === Number(exerciseId));
  });

  #updateFormOnExerciseChange = effect(() => {
    const exercise = this.exercise();

    if (exercise) {
      this.exerciseForm.patchValue({
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        type: exercise.type,
      });
    }
  });

  public readonly exerciseForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    muscleGroup: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
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

    this.isSaveLoading.set(false);
    this.exerciseForm.enable();

    this.router.navigate([Paths.EXERCISES]);
  }

  public cancel(): void {
    this.location.back();
  }
}
