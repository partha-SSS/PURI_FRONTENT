import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = this.el.nativeElement;
    
    // Use setTimeout to wait for the event cycle to complete
    setTimeout(() => {
      const start = input.selectionStart;
      const end = input.selectionEnd;

      input.value = input.value.toUpperCase();
      input.setSelectionRange(start, end);
    }, 0);
  }
}