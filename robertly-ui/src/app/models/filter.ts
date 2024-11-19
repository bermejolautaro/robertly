export interface Filter {
  userId: (number | null)[];
  exercisesIds: number[];
  types: string[];
  weights: number[];
}