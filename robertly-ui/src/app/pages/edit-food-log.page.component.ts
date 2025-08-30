import { TitleCasePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
  effect,
  input,
  untracked,
  linkedSignal,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmModalComponent } from '@components/confirm-modal.component';
import { TypeaheadComponent } from '@components/typeahead.component';
import { FoodLog } from '@models/food-log.model';
import { Food } from '@models/food.model';
import { User } from '@models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth.service';
import { FoodLogsApiService } from '@services/food-logs-api.service';
import { FoodsApiService } from '@services/foods-api.service';
import { ToastService } from '@services/toast.service';
import { take, lastValueFrom, of } from 'rxjs';
import { DAY_JS, Paths } from 'src/main';
import { OnlyNumbersDirective } from '../directives/only-numbers.directive';
import { DATE_FORMATS } from '@models/constants';

@Component({
  selector: 'edit-food-log-page',
  templateUrl: './edit-food-log.page.component.html',
  styleUrl: './edit-food-log.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TypeaheadComponent, OnlyNumbersDirective],
})
export class EditFoodLogPageComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly titleCasePipe = inject(TitleCasePipe);
  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(NgbModal);
  private readonly authService = inject(AuthService);

  private readonly dayjs = inject(DAY_JS);

  private readonly foodLogsApiService = inject(FoodLogsApiService);
  private readonly foodsApiService = inject(FoodsApiService);

  public readonly foodLogIdFromRoute = input<number | undefined>(undefined, { alias: 'id' });

  public readonly isLoading = linkedSignal(() => this.originalValue.isLoading() || this.foods.isLoading());

  private readonly url = toSignal(this.route.url, { initialValue: [] });
  public readonly mode = computed(() => {
    return this.url().some(x => x.path === Paths.CREATE) ? 'create' : 'edit';
  });

  public readonly foods = rxResource({
    stream: () => {
      return this.foodsApiService.getFoods();
    },
    defaultValue: [],
  });

  public readonly userSelector = (x: string | User | null) => (typeof x === 'string' ? '' : (x?.name ?? ''));

  public readonly foodSelector = (x: string | Food | null) =>
    typeof x === 'string' ? '' : (this.titleCasePipe.transform(x?.name) ?? '');

  public readonly users = computed(() => {
    const user = this.authService.user.value()!;

    return [user, ...(user?.assignedUsers ?? [])];
  });

  public readonly isSaveLoading = signal(false);
  public readonly titleCaseSelector = (x: string | null) => (!!x ? this.titleCasePipe.transform(x) : '');

  public originalValue = rxResource({
    params: this.foodLogIdFromRoute,
    stream: ({ params: foodLogId }) => {
      return !!foodLogId ? this.foodLogsApiService.getFoodLogById(foodLogId) : of(null);
    },
  });

  public readonly foodLogForm = {
    user: signal<User | null>(null),
    food: signal<Food | null>(null),
    date: signal<string | null>(null),
    amount: signal<string | null>(null),
  };

  public readonly foodLogFormValue = computed(() => {
    return this.foodLogForm;
  });

  public readonly foodLogFormValid = computed(() => true);

  public readonly foodLogFormEnabled = signal(true);

  public readonly amountPlaceholder = computed(() => {
    const food = this.foodLogForm.food();

    return !!food ? `Amount (${food.unit})` : 'Amount';
  });

  public constructor() {
    effect(() => {
      const mode = this.mode();
      const foodLog = this.originalValue.value();
      const user = untracked(() => this.authService.user.value());

      if (mode === 'create') {
        const todayDate = this.dayjs().format('YYYY-MM-DD');

        this.foodLogForm.date.set(todayDate);
        this.foodLogForm.user.set(user!);
      }

      if (mode === 'edit' && !!foodLog) {
        this.foodLogForm.date.set(this.dayjs(foodLog.date, [...DATE_FORMATS]).format('YYYY-MM-DD'));
        this.foodLogForm.food.set(foodLog.food);
        this.foodLogForm.user.set(foodLog.user);
        this.foodLogForm.amount.set(foodLog.amount.toString());
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
      const foodLog = this.originalValue.value();

      if (foodLog?.foodLogId) {
        try {
          await lastValueFrom(this.foodLogsApiService.deleteFoodLog(foodLog.foodLogId));
          this.router.navigate([Paths.FOOD_LOGS]);
        } catch (e) {
          const error = e as HttpErrorResponse;
          this.toastService.error(`${error.message}`);
        }
      }
    });
  }

  public async save(): Promise<void> {
    if (!this.foodLogFormValid()) {
      return;
    }

    const foodLog = this.originalValue.value();
    const user = this.foodLogForm.user();
    const food = this.foodLogForm.food();

    if (!this.foodLogFormValid() || !food || !user) {
      return;
    }

    this.isSaveLoading.set(true);
    this.foodLogFormEnabled.set(false);

    const foodLogRequest: FoodLog = {
      foodLogId: foodLog?.foodLogId ?? null,
      date: this.foodLogForm.date()!,
      user: user,
      food: food,
      amount: Number(this.foodLogForm.amount())!,
    };

    try {
      if (this.mode() === 'create') {
        await lastValueFrom(this.foodLogsApiService.createFoodLog(foodLogRequest));
      } else {
        await lastValueFrom(this.foodLogsApiService.updateFoodLog(foodLogRequest));
      }
    } catch (error) {
      this.toastService.error('An error ocurred while saving the log.');
    } finally {
      this.isSaveLoading.set(false);
      this.foodLogFormEnabled.set(true);
      this.router.navigate([Paths.FOOD_LOGS]);
    }
  }

  public cancel(): void {
    this.location.back();
  }
}
