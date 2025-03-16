import { User } from "./user.model";

export interface Food {
  foodId: string;
  name: string;
  calories: number;
  protein: number;
  fat: number | null;
  unit: 'g' | 'ml';
  amount: 100;
}

export interface FoodLog {
  foodLogId: string;
  userId: string;
  date: string;
  foodId: string;
  meal: 'breakfast' | 'lunch' | 'dinner',
  amount: number;
  user: User;
  food: Food;
}
