import { Directive, HostListener } from '@angular/core';
@Directive({
  selector:"[ccCardHover]"
})
export class KeyoffDirective {

    constructor() { }
   
  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    // event.key === " " || 
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default behavior of the arrow keys
    }
    
  }
  
  }






