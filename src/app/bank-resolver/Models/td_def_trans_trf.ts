import { baseModel } from './baseModel';

export class td_def_trans_trf extends baseModel {
  public ardb_cd:string = localStorage.getItem('__ardb_cd');
  public trans_dt?: Date;
  public trans_cd: number;
  public acc_type_cd: any;
  public acc_num: string;
  public trans_type: string;
  public trans_mode: string;
  public amount: number;
  public instrument_dt: Date;
  public instrument_num: number;
  public paid_to: string;
  public token_num: string;
  public approval_status: string;
  public approved_by: string;
  public approved_dt: Date;
  public particulars: string;
  public tr_acc_type_cd: number;
  public tr_acc_num: string;
  public voucher_dt: Date;
  public voucher_id: number;
  public trf_type: string;
  public tr_acc_cd: number;
  public acc_cd: any;
  public share_amt: number;
  public sum_assured: number;
  public paid_amt: number;
  public curr_prn_recov: number;
  public ovd_prn_recov: number;
  public curr_intt_recov: number;  
  public ovd_intt_recov: number;
  public remarks: string;
  public crop_cd: string;
  public activity_cd: string;
  public curr_intt_rate: number; 
  public ovd_intt_rate: number;
  public instl_no: number;
  public instl_start_dt: Date;
  public periodicity: number;
  public disb_id: number; //marker
  public comp_unit_no: number;
  public ongoing_unit_no: number;
  public mis_advance_recov: number;
  public adv_prn_recov:string;
  public audit_fees_recov: number;
  public sector_cd: string;
  public spl_prog_cd: string;
  public borrower_cr_cd: string;
  public intt_till_dt: Date;
  public acc_name: string;
  public brn_cd: string;
  public trf_type_desc: string;
  public created_by: string;
  public created_dt: Date;
  public modified_by: string;
  public modified_dt: Date;

  public cust_acc_type: string;
  public cust_acc_desc: string;
  public cust_acc_number: string;
  public cust_name: string;

  public gl_acc_code: string;
  public gl_acc_desc: string;

  public clr_bal: number;

  public TransDtAsString: string;
  public Balance: number; // used to show previous balance total

  public home_brn_cd:string;
  public intra_branch_trn:string;
  public del_flag:string;
  public penal_intt_recov:string;
  public agreement_no:string;
}
