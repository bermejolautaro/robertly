export interface Food {
  foodId: string;
  name: string;
  calories: number;
  protein: number;
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
}
