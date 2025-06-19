import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { mm_acc_type, mm_customer, td_def_trans_trf, tm_deposit } from '.';
import { baseModel } from './baseModel';

export class TranApprovalVM {
  public td_def_trans_trf: td_def_trans_trf;
  public mm_acc_type: mm_acc_type;
  public tm_deposit: tm_deposit;
  public mm_customer: mm_customer;
  public loan: LoanOpenDM;
  public ardb_cd:string;

  TranApprovalVM(){
    this.mm_acc_type = new mm_acc_type();
    this.td_def_trans_trf = new td_def_trans_trf();
    this.tm_deposit = new tm_deposit()
    this.mm_customer = new mm_customer();
    this.loan = new LoanOpenDM();
    this.ardb_cd=localStorage.getItem('__ardb_cd')
  }
}
