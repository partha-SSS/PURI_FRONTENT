import { LoanOpenDM } from './../../Models/loan/LoanOpenDM';
import { tm_denomination_trans } from './../../Models/deposit/tm_denomination_trans';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InAppMessageService, RestService } from 'src/app/_service';
import { mm_acc_type, SystemValues, td_def_trans_trf } from '../../Models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Utils from 'src/app/_utility/utils';

@Component({
  selector: 'app-loan-transaction-details',
  templateUrl: './loan-transaction-details.component.html',
  styleUrls: ['./loan-transaction-details.component.css']
})
export class LoanTransactionDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  constructor(private frmBldr: FormBuilder, private svc: RestService,
              private msg: InAppMessageService, private modalService: BsModalService) {
    this.subscription = this.msg.getCommonLoanTransactionInfo().subscribe(
      res => {
        this.showDenominationDtl = false;
        this.totalOfDenomination = 0;
        if (null !== res) {
          this.loanOpenDm = res;
          this.setTransactionDtl();
        } else {
          if (undefined !== this.transactionDtlsFrm) {
            this.transactionDtlsFrm.reset();
          }
        }

      },
      err => { }
    );
  }
  modalRef: BsModalRef;
  subscription: Subscription;
  isLoading = false;
  show = false;
  showDenominationDtl = false;
  loanOpenDm: LoanOpenDM;
  transactionDtlsFrm: FormGroup;
  tmDenominationTransLst: tm_denomination_trans[] = [];
  totalOfDenomination = 0;
  sys = new SystemValues();

  ngOnInit(): void {
    this.show = true;
    this.transactionDtlsFrm = this.frmBldr.group({
      trans_dt: [''],
      trans_cd: [''],
      acc_type_cd: [''],
      party: [''],
      curr_prn: [''],
      ovd_prn: [''],
      curr_intt: [''],
      ovd_intt: [''],
      loan_id: [''],
      trans_type: [''],
      curr_prn_recov: [''],
      ovd_prn_recov: [''],
      curr_intt_recov: [''],
      ovd_intt_recov: [''],
      mis_advance_recov: [''],
      share_amt: [''],
      trf_type_desc: [''],
      tot_Prn: [''],
      share_holding: [''],
      audit_fees: [''],
      mis_adv: [''],
      amount: [''],
      intt_till_dt: [''],
      particulars: [''],
      activity_cd: [''],
      instrument_no: [''],
      voucher_id: [''],
      sum_assured: [''],
      audit_fees_recc: [''],
      approval_status: [''],
      acc_num: [''],
      trans_mode: [''],
      instrument_dt: [''],
      instrument_num: [''],
      paid_to: [''],
      token_num: [''],
      created_by: [''],
      created_dt: [''],
      modified_by: [''],
      modified_dt: [''],
      approved_by: [''],
      approved_dt: [''],
      tr_acc_type_cd: [''],
      tr_acc_num: [''],
      voucher_dt: [''],
      trf_type: [''],
      tr_acc_cd: [''],
      acc_cd: [''],
      paid_amt: [''],
      remarks: [''],
      crop_cd: [''],
      curr_intt_rate: [''],
      ovd_intt_rate: [''],
      instl_no: [''],
      instl_start_dt: [''],
      periodicity: [''],
      disb_id: [''],
      comp_unit_no: [''],
      ongoing_unit_no: [''],
      audit_fees_recov: [''],
      sector_cd: [''],
      spl_prog_cd: [''],
      borrower_cr_cd: [''],
      numbert_till_dt: [''],
      acc_name: [''],
      brn_cd: [''],
    });
  }

  setTransactionDtl(): void {
    ;
    this.showDenominationDtl = false;
    this.totalOfDenomination = 0;
    if (undefined !== this.loanOpenDm && Object.keys(this.loanOpenDm).length !== 0) {
      this.svc.addUpdDel<mm_acc_type[]>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          const accType = res.filter(e => e.acc_type_cd === this.loanOpenDm.tddeftrans.acc_type_cd)[0];

          this.transactionDtlsFrm.patchValue({
            trans_dt: this.loanOpenDm.tddeftrans.trans_dt.toString().substr(0, 10),
            trans_cd: this.loanOpenDm.tddeftrans.trans_cd,
            acc_type_cd: accType.acc_type_desc,
            party: this.loanOpenDm.tmloanall.cust_name,
            curr_prn: this.loanOpenDm.tmloanall.curr_prn,
            ovd_prn: this.loanOpenDm.tmloanall.ovd_prn,
            curr_intt: this.loanOpenDm.tmloanall.curr_intt,
            ovd_intt: this.loanOpenDm.tmloanall.ovd_intt,
            loan_id: this.loanOpenDm.tmloanall.loan_id,
            tot_Prn: this.loanOpenDm.tmloanall.curr_prn + this.loanOpenDm.tmloanall.ovd_prn,
            share_holding: this.loanOpenDm.tmloanall.tot_share_holding,
            audit_fees: this.loanOpenDm.tddeftrans.audit_fees_recov,
            mis_adv: this.loanOpenDm.tddeftrans.mis_advance_recov,
            intt_till_dt: this.loanOpenDm.tddeftrans.intt_till_dt,
            instrument_no: this.loanOpenDm.tddeftrans.instrument_num,
            audit_fees_recc: this.loanOpenDm.tddeftrans.audit_fees_recov,
            acc_num: this.loanOpenDm.tddeftrans.acc_num,
            // trans_type: this.loanOpenDm.tddeftrans.trans_type === 'R' ? 'Recovery' :
            //   this.loanOpenDm.tddeftrans.trans_type === 'D' ? 'Disbursement' :
            //     this.loanOpenDm.tddeftrans.trans_type === 'I' ? 'Interest Payment' : null,
            trans_mode: this.loanOpenDm.tddeftrans.trans_mode === 'R' ? 'Renewal' :
              this.loanOpenDm.tddeftrans.trans_mode === 'C' ? 'Close' :
                this.loanOpenDm.tddeftrans.trans_mode === 'I' ? 'Interest Payment' :
                  this.loanOpenDm.tddeftrans.trans_mode === 'W' ? 'Withdrawal Slip' :
                    this.loanOpenDm.tddeftrans.trans_mode === 'V' ? 'Voucher' :
                      this.loanOpenDm.tddeftrans.trans_mode === 'O' ? 'Open' :
                        this.loanOpenDm.tddeftrans.trans_mode === 'Q' ? 'Cheque' : null,
            amount: this.loanOpenDm.tddeftrans.amount,
            instrument_dt: this.loanOpenDm.tddeftrans.instrument_dt.toString() === '0001-01-01T00:00:00' ? null :
              this.loanOpenDm.tddeftrans.instrument_dt.toString().substr(0, 10),
            instrument_num: this.loanOpenDm.tddeftrans.instrument_num === 0 ? null :
              this.loanOpenDm.tddeftrans.instrument_num,
            paid_to: this.loanOpenDm.tddeftrans.paid_to,
            token_num: this.loanOpenDm.tddeftrans.token_num,
            approval_status: this.loanOpenDm.tddeftrans.approval_status === 'U' ? 'Un Approved' :
              this.loanOpenDm.tddeftrans.approval_status === 'A' ? 'Approved' : '',
            approved_by: this.loanOpenDm.tddeftrans.approved_by,
            approved_dt: this.loanOpenDm.tddeftrans.approved_dt.toString().substr(0, 10),
            particulars: this.loanOpenDm.tddeftrans.particulars,
            tr_acc_type_cd: this.loanOpenDm.tddeftrans.tr_acc_type_cd,
            tr_acc_num: this.loanOpenDm.tddeftrans.tr_acc_num,
            voucher_dt: this.loanOpenDm.tddeftrans.voucher_dt.toString().substr(0, 10),
            voucher_id: this.loanOpenDm.tddeftrans.voucher_id,
            trf_type: this.loanOpenDm.tddeftrans.trf_type === 'C' ? 'Cash' :
              this.loanOpenDm.tddeftrans.trf_type === 'T' ? 'Tranfer' : '',
            tr_acc_cd: this.loanOpenDm.tddeftrans.tr_acc_cd,
            acc_cd: this.loanOpenDm.tddeftrans.acc_cd,
            share_amt: this.loanOpenDm.tddeftrans.share_amt,
            sum_assured: this.loanOpenDm.tddeftrans.sum_assured,
            paid_amt: this.loanOpenDm.tddeftrans.paid_amt,
            curr_prn_recov: this.loanOpenDm.tddeftrans.curr_prn_recov,
            ovd_prn_recov: this.loanOpenDm.tddeftrans.ovd_prn_recov,
            curr_intt_recov: this.loanOpenDm.tddeftrans.curr_intt_recov,
            ovd_intt_recov: this.loanOpenDm.tddeftrans.ovd_intt_recov,
            remarks: this.loanOpenDm.tddeftrans.remarks,
            crop_cd: this.loanOpenDm.tddeftrans.crop_cd,
            activity_cd: this.loanOpenDm.tddeftrans.activity_cd,
            curr_numbert_rate: this.loanOpenDm.tddeftrans.curr_intt_rate,
            ovd_numbert_rate: this.loanOpenDm.tddeftrans.ovd_intt_rate,
            instl_no: this.loanOpenDm.tddeftrans.instl_no,
            instl_start_dt: this.loanOpenDm.tddeftrans.instl_start_dt.toString().substr(0, 10),
            periodicity: this.loanOpenDm.tddeftrans.periodicity,
            disb_id: this.loanOpenDm.tddeftrans.disb_id,
            comp_unit_no: this.loanOpenDm.tddeftrans.comp_unit_no,
            ongoing_unit_no: this.loanOpenDm.tddeftrans.ongoing_unit_no,
            mis_advance_recov: this.loanOpenDm.tddeftrans.mis_advance_recov,
            audit_fees_recov: this.loanOpenDm.tddeftrans.audit_fees_recov,
            sector_cd: this.loanOpenDm.tddeftrans.sector_cd,
            spl_prog_cd: this.loanOpenDm.tddeftrans.spl_prog_cd,
            borrower_cr_cd: this.loanOpenDm.tddeftrans.borrower_cr_cd,
            numbert_till_dt: this.loanOpenDm.tddeftrans.intt_till_dt,
            acc_name: this.loanOpenDm.tddeftrans.acc_name,
            brn_cd: this.loanOpenDm.tddeftrans.brn_cd,
          });
          this.getDenominationDtl();
        },
        err => { this.isLoading = false; }
      );
    } else { this.transactionDtlsFrm.reset(); }

  }

  private getDenominationDtl(): void {
    if (this.loanOpenDm.tddeftrans.trf_type === 'C') {
      let tmDenoTrf = new tm_denomination_trans();
      tmDenoTrf.brn_cd = this.sys.BranchCode;
      tmDenoTrf.trans_cd = this.loanOpenDm.tddeftrans.trans_cd;
      tmDenoTrf.trans_dt = Utils.convertStringToDt(this.loanOpenDm.tddeftrans.trans_dt.toString());
      this.svc.addUpdDel<any>('Common/GetDenominationDtls', tmDenoTrf).subscribe(
        res => {
          if (null !== res && Object.keys(res).length !== 0) {
            this.showDenominationDtl = true;
            this.tmDenominationTransLst = res;
            this.tmDenominationTransLst.forEach(element => {
              this.totalOfDenomination += element.total;
            });
          }
        },
        err => { }
      );
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
