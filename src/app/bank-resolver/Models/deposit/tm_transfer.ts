import { baseModel } from '../baseModel';
export class tm_transfer extends baseModel{
  public ardb_cd:string = localStorage.getItem('__ardb_cd');
  public trf_dt: Date;
  public trf_cd: number;
  public trans_cd: number;
  public created_by: string;
  public created_dt: Date;
  public approval_status: string;
  public approved_by: string;
  public approved_dt: Date;
  public brn_cd: string;
}
