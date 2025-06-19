import { baseModel } from '../baseModel';

export class tm_loan_sanction extends baseModel {
  public ardb_cd:string = localStorage.getItem('__ardb_cd');
  public loan_id: string;
  public sanc_no: number;
  public sanc_dt: Date;
  public created_by: string;
  public created_dt: Date;
  public modified_by: string;
  public modified_dt: Date;
  public approval_status: string;
  public approved_by: string;
  public approved_dt: Date;
  public memo_no: string;
}
