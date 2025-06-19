import { baseModel } from '../baseModel';

export class tm_loan_all extends baseModel {
  public ardb_cd:string = localStorage.getItem('__ardb_cd');
  public brn_cd: string;
  public party_cd: number;
  public acc_cd: number;
  public loan_id: string;
  public loan_acc_no: string;
  public prn_limit: number;
  public disb_amt: number;
  public disb_dt: Date;
  public curr_prn: number;
  public ovd_prn: number;
  public curr_intt: number;
  public ovd_intt: number;
  public pre_emi_intt: number;
  public other_charges: number;
  public curr_intt_rate: number;
  public ovd_intt_rate: number;
  public disb_status: string;
  public piriodicity: string;
  public tenure_month: number;
  public instl_start_dt: Date;
  public created_by: string;
  public approved_by: string;
  public created_dt: Date;
  public approved_dt: Date;
  public modified_by: string;
  public modified_dt: Date;
  public last_intt_calc_dt: Date;
  public ovd_trf_dt: Date;
  public approval_status: string;
  public cc_flag: string;
  public cheque_facility: string;
  public intt_calc_type: string;
  public emi_formula_no: number;
  public rep_sch_flag: string;
  public loan_close_dt: Date;
  public loan_status: string;
  public instl_amt: number;
  public instl_no: number;
  public activity_cd: string;
  public activity_dtls: string;
  public sector_cd: string;
  public fund_type: string;
  public comp_unit_no: number;
  public cust_name: string; // Extra
  public loan_acc_type: string; // Extra
  public tot_share_holding: number;
  public penal_intt:string;


  public joint_cust_name: string; // Extra
  public instalmentTypeDesc : string;
  public emiFormulaDesc : string;

  public joint_cust_code: number; // Extra
  public joint_cust_relation: string; // Extra

  public trans_cd: number; // Extra
  public trans_dt: Date; // Extra


}
