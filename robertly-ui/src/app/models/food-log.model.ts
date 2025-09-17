import { Food } from './food.model';
import { User } from './user.model';

export interface FoodLog {
  foodLogId: number | null;
  date: string;
  amount: number;
  user: User | null;
  food: Food | null;
  quickAdd: boolean | null;
  description: string | null;
  calories: number | null;
  protein: number | null;
  fat: number | null;
}
