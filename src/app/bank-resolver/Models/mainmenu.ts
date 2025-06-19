import { submenu } from './submenu'

export class mainmenu {
  public name: string  // UCIC
  public menu: submenu[] = [];
  public activeflag: string;
  constructor() {
    this.menu = [];
    this.name = '';
    this.activeflag = 'Y';
  }

}
