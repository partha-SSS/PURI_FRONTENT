export class LoanDetailsForSI {
  loan_id: number;
  acc_cd: number=11;
  party_cd: number;
  dr_acc_type: number;
  dr_acc_num: string;
  trf_flag: string;
  trf_dt: string; 
  created_by: string | null;
  created_dt: string | null;
  modified_by: string | null;
  modified_dt: string | null;
  min_bal: number;
}