import { Directive, Input, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appMatchAccountNumbers]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MatchAccountNumbersDirective),
      multi: true
    }
  ]
})
export class MatchAccountNumbersDirective implements Validator {
  @Input('appMatchAccountNumbers') matchAccountNumbers: string[] = [];

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control || !control.parent) {
      return null;
    }

    const accountNumber1 = control.parent.get(this.matchAccountNumbers[0]);
    const accountNumber2 = control.parent.get(this.matchAccountNumbers[1]);

    if (accountNumber1 && accountNumber2 && accountNumber1.value !== accountNumber2.value) {
      return { notSame: true };
    }

    return null;
  }
}
