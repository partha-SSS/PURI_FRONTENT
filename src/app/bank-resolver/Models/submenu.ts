import { screenlist } from './screenlist'

export class submenu {
  public name: string; // TRANSACTION
  public menu: screenlist[] = []
  public activeflag: string;
  constructor() {
    this.menu = [];
    this.name = '';
    this.activeflag = 'Y';
  }

}
