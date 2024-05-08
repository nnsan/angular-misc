import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const egmConfigurationInSyncVariationAndJackpotValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  let isValid = false;
  const approvedGamesForm = control.get('address');

  if (approvedGamesForm?.get('street')?.value == 'san') {
    isValid = true;
  }

  return !isValid ? {egmConfigurationInSyncVariationAndJackpotValidation: {value: control.value}} : null;
};
