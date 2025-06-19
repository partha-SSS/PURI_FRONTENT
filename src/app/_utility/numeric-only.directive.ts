import { Directive, HostListener } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appNumericOnly]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NumericOnlyDirective,
      multi: true
    }
  ]
})
export class NumericOnlyDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && !/^[0-9]+$/.test(value)) {
      return { numericOnly: true };
    }
    return null;
  }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
  }
}
