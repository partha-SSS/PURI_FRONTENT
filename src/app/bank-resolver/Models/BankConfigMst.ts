import { mainmenu, connstring } from './../Models';

export class BankConfigMst {
  public bankname: string;
  public connstring: connstring;
  public menu: mainmenu[] = [];
  constructor() {
    this.bankname = '';
    this.menu = [];
    // this.connstring = new connstring();
  }

}
