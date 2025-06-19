import { BankConfigMst } from './BankConfigMst'

export class NewConfigRec {
  public bankname: string;
  public connstring: string;
  public module: string;
  public menu: string;
  public screen: string;
  public value: string;
  public active: string;
  public BankConfigMst: BankConfigMst;

  constructor() {
    this.active = 'Y';
    this.BankConfigMst = new BankConfigMst();
  }

}
