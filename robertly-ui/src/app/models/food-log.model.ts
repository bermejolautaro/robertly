import { Food } from './food.model';
import { User } from './user.model';

export interface FoodLog {
  foodLogId: number | null;
  date: string;
  amount: number;
  user: User;
  food: Food;
}
