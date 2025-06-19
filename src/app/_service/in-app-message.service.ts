import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { mm_customer, td_def_trans_trf, td_rd_installment, tm_deposit,
  tm_depositall } from '../bank-resolver/Models';
import { LoanOpenDM } from '../bank-resolver/Models/loan/LoanOpenDM';
import { tm_loan_all } from '../bank-resolver/Models/loan/tm_loan_all';

@Injectable({
  providedIn: 'root'
})
export class InAppMessageService {
  private SubjectExample = new BehaviorSubject<string>(null);
  private isLoggedInShowHeader = new BehaviorSubject<boolean>(null);
  // private isLoggedInShowHeader = new BehaviorSubject<boolean>(false);

  private commonCustInfo = new BehaviorSubject<mm_customer>(null);
  private commonAcctInfo = new BehaviorSubject<tm_deposit>(null);
  private commonTmdepositAll = new BehaviorSubject<tm_depositall>(null);
  private commonTranInfo = new BehaviorSubject<td_def_trans_trf>(null);
  private commonLoanTranInfo = new BehaviorSubject<LoanOpenDM>(null);
  private commonAccountNumDtl = new BehaviorSubject<string>(null);
  private hideTitleOnHeader = new BehaviorSubject<boolean>(null);
  private commonShawdowBal = new BehaviorSubject<number>(null);
  private customerCodeForKyc = new BehaviorSubject<number>(null);
  private commonTmloanAll = new BehaviorSubject<tm_loan_all>(null);

  constructor() {


   }
  /* Below code is example code */
  sendSubjectExample(message: string) { this.SubjectExample.next(message); }
  getSubjectExample() { return this.SubjectExample.asObservable(); }

  sendisLoggedInShowHeader(message: boolean) { this.isLoggedInShowHeader.next(message); }
  getisLoggedInShowHeader() { return this.isLoggedInShowHeader.asObservable(); }

  sendCommonCustInfo(cust: mm_customer) { this.commonCustInfo.next(cust); }
  getCommonCustInfo() { return this.commonCustInfo.asObservable(); }

  sendCommonAcctInfo(acctDtl: tm_deposit) { this.commonAcctInfo.next(acctDtl); }
  getCommonAcctInfo() { return this.commonAcctInfo.asObservable(); }

  sendCommonTmDepositAll(acctDtl: tm_depositall) { this.commonTmdepositAll.next(acctDtl); }
  getCommonTmDepositAll() { return this.commonTmdepositAll.asObservable(); }

  sendCommonTransactionInfo(TranDtl: td_def_trans_trf) { this.commonTranInfo.next(TranDtl); }
  getCommonTransactionInfo() { return this.commonTranInfo.asObservable(); }

  sendCommonLoanTransactionInfo(loanOpenDm: LoanOpenDM) { this.commonLoanTranInfo.next(loanOpenDm); }
  getCommonLoanTransactionInfo() { return this.commonLoanTranInfo.asObservable(); }

  sendCommonAccountNum(AccountNum: string) { this.commonAccountNumDtl.next(AccountNum); }
  getCommonAccountNum() { return this.commonAccountNumDtl.asObservable(); }


  sendhideTitleOnHeader(hide: boolean) { this.hideTitleOnHeader.next(hide); }
  gethideTitleOnHeader() { return this.hideTitleOnHeader.asObservable(); }

  sendShdowBalance(shadowBal: number) { this.commonShawdowBal.next(shadowBal); }
  getShdowBalance() { return this.commonShawdowBal.asObservable(); }

  sendcustomerCodeForKyc(custCd: number) { this.customerCodeForKyc.next(custCd); }
  getcustomerCodeForKyc() { return this.customerCodeForKyc.asObservable(); }

  sendCommonTmLoanAll(acctDtl: tm_loan_all) { this.commonTmloanAll.next(acctDtl); }
  getCommonTmLoanAll() { return this.commonTmloanAll.asObservable(); }
}
