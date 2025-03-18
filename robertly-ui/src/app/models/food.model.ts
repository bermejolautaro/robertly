export interface Food {
  foodId: number | null;
  name: string;
  calories: number;
  protein: number;
  fat: number | null;
  unit: 'g' | 'ml';
  amount: number;
}
