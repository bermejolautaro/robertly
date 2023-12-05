export interface ExerciseLog {
  date: string;
  name: string;
  type: string;
  user: string;
  weightKg: number | null;
  reps: number | null;
  serie: number | null;
}