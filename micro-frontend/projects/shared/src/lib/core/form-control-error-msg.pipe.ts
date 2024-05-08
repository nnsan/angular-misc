import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

const errorMessageMapping = new Map<string, string>([
  ['required', 'please input require file']
]);

@Pipe({
  name: 'formControlErrorMsg'
})
export class FormControlErrorMsgPipe implements PipeTransform {

  transform(control: FormControl<string | null> | any, errorMessageFn?: Function): string | void {
    if (control) {
      const errors = control.errors;
      let errorMsg: string | undefined = '';


      if (errorMessageFn && typeof errorMessageFn == 'function') {
        return errorMessageFn(errors);
      } else {
        for (let err of Object.keys(errors)) {
          if (err && errorMessageMapping.has(err)) {
            errorMsg = errorMessageMapping.get(err);
            break;
          }
        }

        return errorMsg;
      }
    }
  }
}
