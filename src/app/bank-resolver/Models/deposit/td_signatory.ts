import { baseModel } from '../baseModel';
export class td_signatory extends baseModel{
  public ardb_cd:string = localStorage.getItem('__ardb_cd');
  public brn_cd: string;
  public acc_type_cd: number;
  public acc_num: string;
  public signatory_name: string;
  public cust_cd: number;

  td_signatory() {
    this.brn_cd = '';
    this.acc_type_cd = 0;
    this.acc_num = '';
    // this.signatory_name = '';
    this.cust_cd = 0;
  }

}
