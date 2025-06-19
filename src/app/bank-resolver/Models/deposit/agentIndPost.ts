import { baseModel } from '../baseModel';
export class agentIndPost extends baseModel{
    public ardb_cd:string = localStorage.getItem('__ardb_cd');
	public agent_cd:string;
    public brn_cd: string;
    public agent_name:string;
	public trans_dt:any;
	public trans_amt:number;
	public trans_type:string;
	public side_balance:number;
	public side_balance_dt:any;
	public approval_status:string;
	public approved_dt:any;
	public trans_cd:number;
	public del_flag:string;
	public user_id:string;
}