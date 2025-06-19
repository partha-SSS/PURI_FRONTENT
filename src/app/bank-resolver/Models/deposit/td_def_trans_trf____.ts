import { SystemValues } from "../SystemValues";

// tslint:disable-next-line: class-name
export class td_def_trans_trf___ {
  public sys:SystemValues;
  public ardb_cd:string;
  public trans_dt: Date;
  public trans_cd: number;
  public acc_type_cd: number;
  public acc_num: string;
  public trans_type: string;
  public trans_mode: string;
  public amount: number;
  public instrument_dt: Date;
  public instrument_num: number;
  public paid_to: string;
  public token_num: string;
  public created_by: string;
  public created_dt: Date;
  public modified_by: string;
  public modified_dt: Date;
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
  public acc_cd: number;
  public share_amt: number;
  public sum_assured: number;
  public paid_amt: number;
  public curr_prn_recov: number;
  public ovd_prn_recov: number;
  public curr_numbert_recov: number;
  public ovd_numbert_recov: number;
  public remarks: string;
  public crop_cd: string;
  public activity_cd: string;
  public curr_numbert_rate: number;
  public ovd_numbert_rate: number;
  public instl_no: number;
  public instl_start_dt: Date;
  public periodicity: number;
  public disb_id: number;
  public comp_unit_no: number;
  public ongoing_unit_no: number;
  public mis_advance_recov: number;
  public audit_fees_recov: number;
  public sector_cd: string;
  public spl_prog_cd: string;
  public borrower_cr_cd: string;
  public numbert_till_dt: Date;
  public acc_name: string;
  public brn_cd: string;


  td_def_trans_trf___(){
    this.ardb_cd=this.sys.ardbCD
  }


}
