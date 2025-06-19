import { baseModel } from '../baseModel';
export class tmtransDaily extends baseModel{
  public ardb_cd:string = localStorage.getItem('__ardb_cd');
  public agent_cd:string;
  public brn_cd: string;
  public acc_num: string;
  public tran_type: string;
  public paid_dt:any;
  public paid_amt:number;
  public created_by:string;
  public created_dt:any;	
  public modify_by:string;
  public modify_dt:any;
  public approve_by:string;	
  public approve_dt:any;
  public approval_status:any;
  public balance_amt:number;
  public trans_cd:number;
  public del_flag:string;
}