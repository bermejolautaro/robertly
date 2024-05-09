import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Food, FoodLog } from '@models/food.model';

const foods: Food[] = [
  {
    foodId: '123dqwsede21ew',
    name: 'pechuga de pollo',
    calories: 22.5,
    protein: 120,
    unit: 'g',
    amount: 100
  }
]

const data: FoodLog[] = [
  {
    foodLogId: '123dqwsefgh69ew',
    date: '2024/03/25',
    userId: '1enjdqwedniu21h3',
    meal: 'lunch',
    foodId: '123dqwsede21ew',
    amount: 50
  }
]

@Component({
  selector: 'app-foods-page',
  standalone: true,
  imports: [],
  templateUrl: './foods.page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodsPageComponent {

}
