import { baseModel } from '../baseModel';
export class ddsExport extends baseModel{
  public ardb_cd:string = localStorage.getItem('__ardb_cd');
  public agent_cd:string;
  public brn_cd: string;
  public agent_name:string;
  public machine_type:string;
  public block_cd:string;
}
