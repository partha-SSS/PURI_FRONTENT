import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }
  showSuccess(message: string): void {
    // TODO need to use some equvalent mechanism
    // this.snackBar.open(message);
  }

  showError(message: string): void {
    // The second parameter is the text in the button.
    // In the third, we send in the css class for the snack bar.
    // TODO need to use some equvalent mechanism
    // this.snackBar.open(message, 'X', {panelClass: ['error']});
  }
}
