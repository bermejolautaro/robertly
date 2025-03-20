import { TitleCasePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, computed, inject, signal, effect, input } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmModalComponent } from '@components/confirm-modal.component';
import { TypeaheadComponent } from '@components/typeahead.component';
import { Food } from '@models/food.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FoodsApiService } from '@services/foods-api.service';
import { ToastService } from '@services/toast.service';
import { parseNumber } from '@validators/parse-number';
import { take, lastValueFrom, of } from 'rxjs';
import { Paths } from 'src/main';
import { OnlyNumbersDirective } from '../directives/only-numbers.directive';

@Component({
  selector: 'edit-food-page',
  templateUrl: './edit-food.page.component.html',
  styleUrl: './edit-food.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TypeaheadComponent, OnlyNumbersDirective],
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

  public readonly foodFormSignal = {
    name: signal<string | null>(null),
    calories: signal<string | null>(null),
    protein: signal<string | null>(null),
    fat: signal<string | null>(null),
    unit: signal<string | null>(null),
    amount: signal<string | null>(null),
  };

  public readonly foodFormValue = computed(() => {
    const name = this.foodFormSignal.name();

    if (!name) {
      return null;
    }

    const fat = this.foodFormSignal.fat();
    const parsedFat = parseNumber(fat);

    const calories = this.foodFormSignal.calories();
    const parsedCalories = !!calories ? Number(calories) : null!;

    if (parsedCalories === null || parsedCalories === undefined) {
      return null;
    }

    const protein = this.foodFormSignal.protein();
    const parsedProtein = !!protein ? Number(protein) : null!;

    if (parsedProtein === null || parsedProtein === undefined) {
      return null;
    }

    const unit = this.foodFormSignal.unit();

    if (!unit) {
      return null;
    }

    const amount = this.foodFormSignal.amount();
    const parsedAmount = !!amount ? Number(amount) : null;

    if (!parsedAmount) {
      return null;
    }

    return {
      name: name,
      calories: parsedCalories,
      protein: parsedProtein,
      fat: parsedFat,
      unit: unit,
      amount: parsedAmount,
    };
  });

  public readonly foodFormEnabled = signal(true);

  public readonly foodFormValid = computed(() => {
    const foodFormValue = this.foodFormValue();

    if (!foodFormValue) {
      return false;
    }

    const { name, calories, protein, unit, fat, amount } = foodFormValue;

    return true;
  });

  public constructor() {
    effect(() => {
      const food = this.food.value();

      if (food) {
        this.foodFormSignal.name.set(food.name);
        this.foodFormSignal.calories.set(food.calories.toString());
        this.foodFormSignal.protein.set(food.protein.toString());
        this.foodFormSignal.fat.set(food.fat?.toString() ?? '');
        this.foodFormSignal.unit.set(food.unit);
        this.foodFormSignal.amount.set(food.amount.toString());
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
          this.router.navigate([Paths.FOODS]);
        } catch (e) {
          const error = e as HttpErrorResponse;
          this.toastService.error(`${error.message}`);
        }
      }
    });
  }

  public async save(): Promise<void> {
    const formValue = this.foodFormValue();

    if (!formValue || !this.foodFormValid()) {
      return;
    }

    this.isSaveLoading.set(true);
    this.foodFormEnabled.set(false);

    const food: Food = {
      foodId: this.food.value()?.foodId ?? null,
      name: formValue.name,
      calories: formValue.calories,
      protein: formValue.protein,
      fat: formValue.fat,
      unit: formValue.unit.toLowerCase() as 'g' | 'ml',
      amount: formValue.amount,
    };

    try {
      if (this.mode() === 'create') {
        await lastValueFrom(this.foodsApiService.createFood(food));
      } else {
        await lastValueFrom(this.foodsApiService.updateFood(food));
      }
    } catch (error) {
      this.toastService.error('An error occurred while saving this food.');
    } finally {
      this.isSaveLoading.set(false);
      this.foodFormEnabled.set(true);
      this.router.navigate([Paths.FOODS]);
    }
  }

  public cancel(): void {
    this.location.back();
  }
}
