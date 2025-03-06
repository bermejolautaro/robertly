import { ValidatorFn, Validators } from '@angular/forms';
import { CreateOrUpdateLogFormGroup } from '@models/create-or-update-log';

export const createOrUpdateLogFormValidator: ValidatorFn = control => {
  const typedControl = control as CreateOrUpdateLogFormGroup;
  const errorsMap: Map<string, Record<string, string>> = new Map();

  const exerciseRequiredErrors = Validators.required(typedControl.controls.exercise);
  if (exerciseRequiredErrors) {
    errorsMap.set('exercise', { ...errorsMap.get('exercise'), ...{ exerciseRequired: 'Exercise is required' } });
  }

  const result: Record<string, Record<string, string>> = {};

  for (const [key, value] of errorsMap.entries()) {
    result[key] = value;
  }

  return result;
};
