import { TitleCasePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, computed, inject, signal, effect, OnInit, input } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmModalComponent } from '@components/confirm-modal.component';
import { TypeaheadComponent } from '@components/typeahead.component';
import { Food } from '@models/food.model';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FoodsApiService } from '@services/foods-api.service';
import { ToastService } from '@services/toast.service';
import { take, lastValueFrom, of } from 'rxjs';
import { Paths } from 'src/main';

@Component({
  selector: 'edit-food-page',
  templateUrl: './edit-food.page.component.html',
  styleUrl: './edit-food.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, NgbTypeaheadModule, TypeaheadComponent],
})
export class EditFoodPageComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(NgbModal);

  public readonly foodsApiService = inject(FoodsApiService);

  public readonly foodIdFromRoute = input<number | undefined>(undefined, { alias: 'id' });

  private readonly url = toSignal(this.route.url, { initialValue: [] });
  public readonly mode = computed(() => {
    return this.url().some(x => x.path === Paths.CREATE) ? 'create' : 'edit';
  });

  public readonly food = rxResource({
    loader: () => {
      const foodId = this.foodIdFromRoute();

      if (foodId) {
        return this.foodsApiService.getFoodById(foodId);
      }

      return of(null);
    },
  });

  public readonly isSaveLoading = signal(false);
  public readonly titleCaseSelector = (x: string | null) => (!!x ? this.titleCasePipe.transform(x) : '');

  public readonly foodForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    calories: new FormControl<number | null>(null, [Validators.required]),
    protein: new FormControl<number | null>(null, [Validators.required]),
    fat: new FormControl<number | null>(null),
    unit: new FormControl('', [Validators.required]),
    amount: new FormControl<number | null>(null, [Validators.required]),
  });

  public constructor() {
    effect(() => {
      // When exercise change then update form
      const food = this.food.value();

      if (food) {
        this.foodForm.patchValue({
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          fat: food.fat,
          unit: food.unit,
          amount: food.amount,
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
      const food = this.food.value();

      if (food?.foodId) {
        try {
          await lastValueFrom(this.foodsApiService.deleteFood(food.foodId));
          this.router.navigate([Paths.EXERCISES]);
        } catch (e) {
          const error = e as HttpErrorResponse;
          this.toastService.error(`${error.message}`);
        }
      }
    });
  }

  public async save(): Promise<void> {
    if (this.foodForm.invalid) {
      return;
    }

    this.isSaveLoading.set(true);
    this.foodForm.disable();

    const food: Food = {
      foodId: this.food.value()?.foodId ?? null,
      name: this.foodForm.value.name!,
      calories: this.foodForm.value.calories!,
      protein: this.foodForm.value.protein!,
      fat: this.foodForm.value.fat!,
      unit: this.foodForm.value.unit!.toLowerCase() as 'g' | 'ml',
      amount: this.foodForm.value.amount!,
    };

    try {
      if (this.mode() === 'create') {
        await lastValueFrom(this.foodsApiService.createFood(food));
      } else {
        await lastValueFrom(this.foodsApiService.updateFood(food));
      }
    } catch (error) {
      this.toastService.error('An error occurred while saving the exercise.');
    } finally {
      this.isSaveLoading.set(false);
      this.foodForm.enable();
      this.router.navigate([Paths.FOODS]);
    }
  }

  public cancel(): void {
    this.location.back();
  }
}
