import { TitleCasePipe, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
  effect,
  OnInit,
  input,
  untracked,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmModalComponent } from '@components/confirm-modal.component';
import { TypeaheadComponent } from '@components/typeahead.component';
import { FoodLog } from '@models/food-log.model';
import { Food } from '@models/food.model';
import { User } from '@models/user.model';
import { NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth.service';
import { parseDate } from '@services/dayjs.service';
import { FoodLogsApiService } from '@services/food-logs-api.service';
import { FoodsApiService } from '@services/foods-api.service';
import { ToastService } from '@services/toast.service';
import { take, lastValueFrom, of, map, startWith } from 'rxjs';
import { DAY_JS, Paths } from 'src/main';

@Component({
  selector: 'edit-food-log-page',
  templateUrl: './edit-food-log.page.component.html',
  styleUrl: './edit-food-log.page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, NgbTypeaheadModule, TypeaheadComponent],
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

  private readonly url = toSignal(this.route.url, { initialValue: [] });
  public readonly mode = computed(() => {
    return this.url().some(x => x.path === Paths.CREATE) ? 'create' : 'edit';
  });

  public readonly foods = rxResource({
    loader: () => {
      return this.foodsApiService.getFoods();
    },
    defaultValue: [],
  });

  public readonly userSelector = (x: string | User | null) => (typeof x === 'string' ? '' : (x?.name ?? ''));

  public readonly foodSelector = (x: string | Food | null) =>
    typeof x === 'string' ? '' : (this.titleCasePipe.transform(x?.name) ?? '');

  public readonly users = computed(() => {
    const user = this.authService.user()!;

    return [user, ...(user?.assignedUsers ?? [])];
  });

  public readonly isSaveLoading = signal(false);
  public readonly titleCaseSelector = (x: string | null) => (!!x ? this.titleCasePipe.transform(x) : '');

  public originalValue = rxResource({
    request: this.foodLogIdFromRoute,
    loader: ({ request: foodLogId }) => {
      return !!foodLogId ? this.foodLogsApiService.getFoodLogById(foodLogId) : of(null);
    },
  });

  public readonly foodLogForm = new FormGroup({
    user: new FormControl<string | User | null>(null),
    food: new FormControl<Food | null>(null),
    date: new FormControl('', Validators.required),
    amount: new FormControl<number | null>(null, Validators.required),
  });

  public readonly amountPlaceholder = toSignal(
    this.foodLogForm.controls.food.valueChanges.pipe(
      startWith(null),
      map((food: Food | null) => {
        return !!food ? `Amount (${food.unit})` : 'Amount';
      })
    )
  );

  public constructor() {
    effect(() => {
      const mode = this.mode();
      const foodLog = this.originalValue.value();
      const user = untracked(() => this.authService.user());

      if (mode === 'create') {
        const todayDate = this.dayjs().format('YYYY-MM-DD');

        this.foodLogForm.patchValue({
          date: todayDate,
          user: user?.name ?? '',
        });
      }

      if (mode === 'edit' && !!foodLog) {
        this.foodLogForm.reset();
        this.foodLogForm.patchValue({
          date: parseDate(foodLog.date).format('YYYY-MM-DD'),
          food: foodLog.food,
          user: foodLog.user,
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
      const foodLog = this.originalValue.value();

      if (foodLog?.foodLogId) {
        try {
          await lastValueFrom(this.foodLogsApiService.deleteFoodLog(foodLog.foodLogId));
          this.router.navigate([Paths.EXERCISES]);
        } catch (e) {
          const error = e as HttpErrorResponse;
          this.toastService.error(`${error.message}`);
        }
      }
    });
  }

  public async save(): Promise<void> {
    if (this.foodLogForm.invalid) {
      return;
    }

    const foodLog = this.originalValue.value();
    const user = this.foodLogForm.value.user;
    const food = this.foodLogForm.value.food;

    if (this.foodLogForm.invalid || typeof food === 'string' || !food || typeof user === 'string' || !user) {
      return;
    }

    this.isSaveLoading.set(true);
    this.foodLogForm.disable();

    const foodLogRequest: FoodLog = {
      foodLogId: foodLog?.foodLogId ?? null,
      date: this.foodLogForm.value.date!,
      user: user,
      food: food,
      amount: this.foodLogForm.value.amount!,
    };

    try {
      if (this.mode() === 'create') {
        await lastValueFrom(this.foodLogsApiService.createFoodLog(foodLogRequest));
      } else {
        await lastValueFrom(this.foodLogsApiService.updateFoodLog(foodLogRequest));
      }
    } catch (error) {
      this.toastService.error('An error occurred while saving the log.');
    } finally {
      this.isSaveLoading.set(false);
      this.foodLogForm.enable();
      this.router.navigate([Paths.FOODS]);
    }
  }

  public cancel(): void {
    this.location.back();
  }
}
