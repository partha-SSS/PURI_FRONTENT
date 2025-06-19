export class p_gen_param {
  ardb_cd: string;
  brn_cd: string;
  cust_cd:string;
  acc_cd: number;
  from_dt: Date;
  to_dt: Date;
  trial_dt: Date;
  pl_acc_cd: number;
  gp_acc_cd: number;
  ad_from_acc_cd: number;
  ad_to_acc_cd: number;
  gs_acc_type_cd: number;
  ls_catg_cd: number;
  ls_cons_cd: number;
  // ad_acc_type_cd: number;
  ad_acc_type_cd: any;
  ad_prn_amt: number;
  adt_temp_dt: Date;
  as_intt_type: string;
  ai_period: number;
  ad_intt_rt: number;
  as_acc_num: string;
  ad_instl_amt: number;
  an_instl_no: number;
  an_intt_rate: number;
  adt_trans_dt: Date;
  ad_trans_cd: number;
  flag: string;
  gs_user_type: string;
  gs_user_id: string;
  user_acc_num:string;
  output: string;
  as_cust_name: string;
  as_locker_id:any;
  constructor(){
    this.ardb_cd = localStorage.getItem('__ardb_cd');
  }

}
