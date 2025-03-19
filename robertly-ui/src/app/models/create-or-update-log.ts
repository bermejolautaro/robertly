import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Exercise } from '@models/exercise.model';
import { CreateOrUpdateSerieFormGroup, createSerieFormGroup } from '@models/create-or-update-serie';
import { createOrUpdateLogFormValidator } from '@validators/create-or-update-log-validator';
import { User } from './user.model';
import { signal } from '@angular/core';

export type CreateOrUpdateLogFormGroup = FormGroup<{
  user: FormControl<string | User | null>;
  date: FormControl<string | null>;
  exercise: FormControl<string | Exercise | null>;
  series: FormArray<CreateOrUpdateSerieFormGroup>;
}>;

export function createLogFormGroup(): CreateOrUpdateLogFormGroup {
  return new FormGroup(
    {
      user: new FormControl<string | User | null>(null),
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

export function createLogFormSignal() {
  return {
    user: signal<User | null>(null),
    exercise: signal<Exercise | null>(null),
    date: signal(''),
    series: signal([
      signal({ serieId: null as number | null, reps: signal<number | null>(null), weightInKg: signal<number | null>(null) }),
      signal({ serieId: null as number | null, reps: signal<number | null>(null), weightInKg: signal<number | null>(null) }),
      signal({ serieId: null as number | null, reps: signal<number | null>(null), weightInKg: signal<number | null>(null) }),
      signal({ serieId: null as number | null, reps: signal<number | null>(null), weightInKg: signal<number | null>(null) }),
      signal({ serieId: null as number | null, reps: signal<number | null>(null), weightInKg: signal<number | null>(null) }),
    ]),
  };
}
