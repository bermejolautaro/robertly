import { ValidatorFn, Validators } from '@angular/forms';
import { CreateOrUpdateLogFormGroup } from '@models/create-or-update-log';

export const createOrUpdateLogFormValidator: ValidatorFn = control => {
  const typedControl = control as CreateOrUpdateLogFormGroup;
  const errorsMap: Map<string, Record<string, string>> = new Map();

  // const userRequiredErrors = Validators.required(typedControl.controls.user);
  // if (userRequiredErrors) {
  //   errorsMap.set('user', { ...errorsMap.get('user'), ...{ required: 'Username is required' } });
  // }

  const exerciseRequiredErrors = Validators.required(typedControl.controls.exercise);
  if (exerciseRequiredErrors) {
    errorsMap.set('exercise', { ...errorsMap.get('exercise'), ...{ exerciseRequired: 'Exercise is required' } });
  }

  // if (typedControl.controls.series.value.map(x => (x.reps ?? 0) > 0 && (x.weightInKg ?? 0) > 0).every(x => !x)) {
  //   errorsMap.set('series', { ...errorsMap.get('series'), ...{ allSeriesAreEmpty: 'Needs at least one serie' } });
  // }

  // if (typedControl.controls.series.value.some(x => !Number.isInteger(x.reps ?? 0))) {
  //   errorsMap.set('series', { ...errorsMap.get('series'), ...{ repsMustBeInteger: 'Reps needs to be whole numbers' } });
  // }

  const result: Record<string, Record<string, string>> = {};

  for (const [key, value] of errorsMap.entries()) {
    result[key] = value;
  }

  return result;
};
