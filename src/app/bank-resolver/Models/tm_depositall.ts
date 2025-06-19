import { baseModel } from './baseModel';

export class tm_depositall extends baseModel {
  constructor() {
    super();
    this.ShowClose = false;
    // this.ShowIntrestDtls = false;
  }
  public brn_cd: string;
  public acc_type_cd: number;
  public acc_num: string;
  public renew_id: number;
  public cust_cd: number;
  public intt_trf_type: string;
  public constitution_cd: number;
  public oprn_instr_cd: number;
  public opening_dt: Date;
  public prn_amt: number;
  public intt_amt: number;
  public dep_period: string;
  public instl_amt: number;
  public instl_no: number;
  public mat_dt: Date;
  public intt_rt: number;
  public tds_applicable: string;
  public last_intt_calc_dt: Date;
  public acc_close_dt: Date;
  public closing_prn_amt: number;
  public closing_intt_amt: number;
  public penal_amt: number;
  public ext_instl_tot: number;
  public mat_status: string;
  public acc_status: string;
  public curr_bal: number;
  public clr_bal: number;
  public standing_instr_flag: string;
  public cheque_facility_flag: string;
  public created_by: string;
  public created_dt: Date;
  public modified_by: string;
  public modified_dt: Date;
  public approval_status: string;
  public approved_by: string;
  public approved_dt: Date;
  public user_acc_num: string;
  public lock_mode: string;
  public loan_id: string;
  public cert_no: string;
  public bonus_amt: number;
  public penal_intt_rt: number;
  public bonus_intt_rt: number;
  public transfer_flag: string;
  public transfer_dt: Date;
  public agent_cd: string;
  public cust_type: string;
  public title: string;
  public first_name: string;
  public middle_name: string;
  public last_name: string;
  public cust_name: string;
  public guardian_name: string;
  public cust_dt: Date;
  public dt_of_birth: Date;
  public age: number;
  public sex: string;
  public marital_status: string;
  public catg_cd: number;
  public community: number;
  public caste: number;
  public permanent_address: string;
  public ward_no: number;
  public state: string;
  public dist: string;
  public pin: number;
  public vill_cd: string;
  public block_cd: string;
  public service_area_cd: string;
  public occupation: string;
  public phone: string;
  public present_address: string;
  public constitution_desc: string;
  public acc_cd: number;
  public intt_acc_cd: number;
  public intt_prov_acc_cd: number;

  /** Below prop is used for by common view please do not delete */
  public ShowClose: boolean;
  // public ShowIntrestDtls: boolean;
  public acc_type_desc: string;
  public lock_mode_desc: string;
  
  public ardb_cd:string;

}
