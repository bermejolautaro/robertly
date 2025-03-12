import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Food, FoodLog } from '@models/food.model';
import { PadStartPipe } from '@pipes/pad-start.pipe';
import { ParseToDatePipe } from '@pipes/parse-to-date.pipe';

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
  selector: 'app-foods-page',
  templateUrl: './foods.page.component.html',
  styles: `.log {
    background-color: var(--light-bg);
    color: var(--font-color);
    margin-bottom: 8px;
    border-radius: 5px;
    padding: 0.2rem 0.6rem 0.2rem 0.6rem;

    .title {
      font-size: 15px;
      font-weight: 600;
    }

    .hint {
      font-size: 12px;
      opacity: 0.8;
    }

    .series {
      display: grid;
      font-size: 12px;
      opacity: 0.8;
    }
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe, ParseToDatePipe, PadStartPipe],
})
export class FoodsPageComponent {
  public readonly foodLog = signal(data[0]);

  public navigateToEditLog(): void {}
}
