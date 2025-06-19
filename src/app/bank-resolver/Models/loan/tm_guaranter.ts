import { baseModel } from '../baseModel';

export class tm_guaranter extends baseModel {
  
  public loan_id: string;
  public acc_cd: number;
  public gua_type: string;
  public gua_id: string;
  public gua_name: string;
  public gua_add: string;
  public office_name: string;
  public share_acc_num: string;
  public share_type: number;
  public opening_dt: Date;
  public share_bal: number;
  public depart: string;
  public desig: string;
  public salary: number;
  public sec_58: string;
  public mobile: string;
  public srl_no: number;
  public ardb_cd:string = localStorage.getItem('__ardb_cd');
}
