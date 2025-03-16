import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FoodLogComponent } from '@components/food-log/food-log.component';
import { Food, FoodLog } from '@models/food.model';
import { PadStartPipe } from '@pipes/pad-start.pipe';
import { ParseToDatePipe } from '@pipes/parse-to-date.pipe';
import { FoodLogsApiService } from '@services/food-logs-api.service';
import { FoodsApiService } from '@services/foods-api.service';

const foods: Food[] = [
  {
    foodId: '123dqwsede21ew',
    name: 'pechuga de pollo',
    calories: 22.5,
    protein: 120,
    fat: 5,
    unit: 'g',
    amount: 100,
  },
];

const data: FoodLog[] = [
  {
    foodLogId: '123dqwsefgh69ew',
    foodId: '123dqwsede21ew',
    date: '2024/03/25',
    userId: '1enjdqwedniu21h3',
    meal: 'lunch',
    amount: 50,
    user: {
      assignedUsers: [],
      email: 'lautaro@bermejo.com',
      name: 'Lautaro Bermejo',
      userFirebaseUuid: 'asdsad',
      userId: 2,
    },
    food: {
      foodId: '123dqwsede21ew',
      name: 'pechuga de pollo',
      calories: 22.5,
      protein: 120,
      fat: 5,
      unit: 'g',
      amount: 100,
    },
  },
];

@Component({
  selector: 'app-food-logs-page',
  templateUrl: './food-logs.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FoodLogComponent],
})
export class FoodsPageComponent {
  private readonly foodsApiService = inject(FoodsApiService);
  private readonly foodLogsApiService = inject(FoodLogsApiService);

  public readonly foodLogs = rxResource({
    loader: () => this.foodLogsApiService.getFoodLogs(),
  });

  public readonly foods = rxResource({
    loader: () => this.foodsApiService.getFoods(),
  });

  public navigateToEditLog(): void {}
}
