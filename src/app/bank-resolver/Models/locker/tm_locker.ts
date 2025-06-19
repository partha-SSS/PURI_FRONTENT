import { baseModel } from '../baseModel';
export class tm_locker extends baseModel{
  public ardb_cd:string = localStorage.getItem('__ardb_cd');
  public brn_cd: string; //--------------------
  public acc_type_cd: number;
  public acc_num: string;
  public cust_cd: number; //--------------------
  public key_no: string;
  public agreement_no: string;
  public agreement_dt: string;
  public locker_id: string;
  public ind_acc_type_cd: number;
  public ind_acc_num: string;
  public narration: string;
  public nominee_no: any;
  public rented_till: string;
  public acc_status: string;
  public approval_status: string;
  public name: string;
  public present_address: string;
  public occupation: string;
  public phone: string;
  public amt_recv: any;
  public trans_dt: any;
  public trans_cd: any;
  public created_by: any;
  public modified_by: any;
  public approved_by: any;
  public trans_mode: any;
  public cust_name:any;
  
}
