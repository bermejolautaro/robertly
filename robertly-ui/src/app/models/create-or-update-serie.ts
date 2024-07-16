import { FormGroup, FormControl } from "@angular/forms";

export type CreateOrUpdateSerieFormGroup = FormGroup<{
  serieId: FormControl<number | null>;
  exerciseLogId: FormControl<number | null>;
  reps: FormControl<number | null>;
  weightInKg: FormControl<number | null>;
}>;

export function createSerieFormGroup(): CreateOrUpdateSerieFormGroup {
  return new FormGroup({
    serieId: new FormControl(),
    exerciseLogId: new FormControl(),
    reps: new FormControl(),
    weightInKg: new FormControl(),
  });
}
