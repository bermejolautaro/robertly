import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { Exercise } from "@models/exercise.model";
import { CreateOrUpdateSerieFormGroup, createSerieFormGroup } from "@models/create-or-update-serie";
import { createOrUpdateLogFormValidator } from "@validators/create-or-update-log-validator";

export type CreateOrUpdateLogFormGroup = FormGroup<{
  user: FormControl<string | null>;
  userId: FormControl<string | null>;
  date: FormControl<string | null>;
  exercise: FormControl<string | Exercise | null>;
  series: FormArray<CreateOrUpdateSerieFormGroup>;
}>;

export function createLogFormGroup(): CreateOrUpdateLogFormGroup {
  return new FormGroup(
    {
      user: new FormControl(''),
      userId: new FormControl(''),
      exercise: new FormControl<string | Exercise | null>(null),
      date: new FormControl(''),
      series: new FormArray([
        createSerieFormGroup(),
        createSerieFormGroup(),
        createSerieFormGroup(),
        createSerieFormGroup(),
        createSerieFormGroup(),
      ]),
    },
    [createOrUpdateLogFormValidator]
  );
}