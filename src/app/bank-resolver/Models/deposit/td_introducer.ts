
import { baseModel } from '../baseModel';
export class td_introducer extends baseModel{

  public ardb_cd:string = localStorage.getItem('__ardb_cd');
  public brn_cd: string;
  public acc_type_cd: number;
  public acc_num: string;
  public srl_no  : number;
  public introducer_name : string;
  public introducer_acc_type : number;
  public introducer_acc_num : string;
  public introducer_acc_type_desc: string;
  public AccTypeDesc: string;
}
