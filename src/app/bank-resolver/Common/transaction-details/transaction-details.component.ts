import { tm_denomination_trans } from './../../Models/deposit/tm_denomination_trans';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InAppMessageService, RestService } from 'src/app/_service';
import { mm_acc_type, SystemValues, td_def_trans_trf } from '../../Models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Utils from 'src/app/_utility/utils';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  constructor(private frmBldr: FormBuilder, private svc: RestService,
    private msg: InAppMessageService, private modalService: BsModalService) {
    this.subscription = this.msg.getCommonTransactionInfo().subscribe(
      res => {
        this.showDenominationDtl = false;
        this.showTransferDtl = false;
        this.totalOfDenomination = 0;
        if (null !== res) {
          this.transactionDtl = res;
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
  showTransferDtl = false;
  transactionDtl: td_def_trans_trf;
  transactionDtlsFrm: FormGroup;
  tmDenominationTransLst: tm_denomination_trans[] = [];
  tranferDetails: td_def_trans_trf[] = [];
  totalOfDenomination = 0;
  sys = new SystemValues();

  ngOnInit(): void {
    this.show = true;
    this.transactionDtlsFrm = this.frmBldr.group({
      trans_dt: [''],
      trans_cd: [''],
      acc_type_cd: [''],
      acc_num: [''],
      trans_type: [''],
      trans_mode: [''],
      amount: [''],
      instrument_dt: [''],
      instrument_num: [''],
      paid_to: [''],
      token_num: [''],
      created_by: [''],
      created_dt: [''],
      modified_by: [''],
      modified_dt: [''],
      approval_status: [''],
      approved_by: [''],
      approved_dt: [''],
      particulars: [''],
      tr_acc_type_cd: [''],
      tr_acc_num: [''],
      voucher_dt: [''],
      voucher_id: [''],
      trf_type: [''],
      tr_acc_cd: [''],
      acc_cd: [''],
      share_amt: [''],
      sum_assured: [''],
      paid_amt: [''],
      curr_prn_recov: [''],
      ovd_prn_recov: [''],
      curr_intt_recov: [''],
      ovd_intt_recov: [''],
      remarks: [''],
      crop_cd: [''],
      activity_cd: [''],
      curr_intt_rate: [''],
      ovd_intt_rate: [''],
      instl_no: [''],
      instl_start_dt: [''],
      periodicity: [''],
      disb_id: [''],
      comp_unit_no: [''],
      ongoing_unit_no: [''],
      mis_advance_recov: [''],
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
    this.showDenominationDtl = false;
    this.showTransferDtl = false;
    this.totalOfDenomination = 0;
    if (undefined !== this.transactionDtl && Object.keys(this.transactionDtl).length !== 0) {
      this.svc.addUpdDel<mm_acc_type[]>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          const accType = res.filter(e => e.acc_type_cd === this.transactionDtl.acc_type_cd)[0];

          this.transactionDtlsFrm.patchValue({
            trans_dt: this.transactionDtl.trans_dt.toString().substr(0, 10),
            trans_cd: this.transactionDtl.trans_cd,
            acc_type_cd: accType.acc_type_desc,
            acc_num: this.transactionDtl.acc_num,
            trans_type: this.transactionDtl.trans_type === 'D' ? 'Deposit' :
              this.transactionDtl.trans_type === 'W' ? 'Withdrawal' :
                this.transactionDtl.trans_type === 'I' ? 'Interest Payment' : null,
            trans_mode: this.transactionDtl.trans_mode === 'R' ? 'Renewal' :
              this.transactionDtl.trans_mode === 'C' ? 'Close' :
                this.transactionDtl.trans_mode === 'I' ? 'Interest Payment' :
                  this.transactionDtl.trans_mode === 'W' ? 'Withdrawal Slip' :
                    this.transactionDtl.trans_mode === 'V' ? 'Voucher' :
                      this.transactionDtl.trans_mode === 'O' ? 'Open' :
                        this.transactionDtl.trans_mode === 'Q' ? 'Cheque' : null,
            amount: this.transactionDtl.amount,
            instrument_dt: this.transactionDtl.instrument_dt.toString() === '0001-01-01T00:00:00' ? null :
              this.transactionDtl.instrument_dt.toString().substr(0, 10),
            instrument_num: this.transactionDtl.instrument_num === 0 ? null :
              this.transactionDtl.instrument_num,
            paid_to: this.transactionDtl.paid_to,
            token_num: this.transactionDtl.token_num,
            approval_status: this.transactionDtl.approval_status === 'U' ? 'Un Approved' :
              this.transactionDtl.approval_status === 'A' ? 'Approved' : '',
            approved_by: this.transactionDtl.approved_by,
            approved_dt: this.transactionDtl.approved_dt.toString().substr(0, 10),
            particulars: this.transactionDtl.particulars,
            tr_acc_type_cd: this.transactionDtl.tr_acc_type_cd,
            tr_acc_num: this.transactionDtl.tr_acc_num,
            voucher_dt: this.transactionDtl.voucher_dt.toString().substr(0, 10),
            voucher_id: this.transactionDtl.voucher_id,
            trf_type: this.transactionDtl.trf_type === 'C' ? 'Cash' :
              this.transactionDtl.trf_type === 'T' ? 'Tranfer' : '',
            tr_acc_cd: this.transactionDtl.tr_acc_cd,
            acc_cd: this.transactionDtl.acc_cd,
            share_amt: this.transactionDtl.share_amt,
            sum_assured: this.transactionDtl.sum_assured,
            paid_amt: this.transactionDtl.paid_amt,
            curr_prn_recov: this.transactionDtl.curr_prn_recov,
            ovd_prn_recov: this.transactionDtl.ovd_prn_recov,
            curr_numbert_recov: this.transactionDtl.curr_intt_recov,
            ovd_numbert_recov: this.transactionDtl.ovd_intt_recov,
            remarks: this.transactionDtl.remarks,
            crop_cd: this.transactionDtl.crop_cd,
            activity_cd: this.transactionDtl.activity_cd,
            curr_numbert_rate: this.transactionDtl.curr_intt_rate,
            ovd_numbert_rate: this.transactionDtl.ovd_intt_rate,
            instl_no: this.transactionDtl.instl_no,
            instl_start_dt: this.transactionDtl.instl_start_dt.toString().substr(0, 10),
            periodicity: this.transactionDtl.periodicity,
            disb_id: this.transactionDtl.disb_id,
            comp_unit_no: this.transactionDtl.comp_unit_no,
            ongoing_unit_no: this.transactionDtl.ongoing_unit_no,
            mis_advance_recov: this.transactionDtl.mis_advance_recov,
            audit_fees_recov: this.transactionDtl.audit_fees_recov,
            sector_cd: this.transactionDtl.sector_cd,
            spl_prog_cd: this.transactionDtl.spl_prog_cd,
            borrower_cr_cd: this.transactionDtl.borrower_cr_cd,
            numbert_till_dt: this.transactionDtl.intt_till_dt,
            acc_name: this.transactionDtl.acc_name,
            brn_cd: this.transactionDtl.brn_cd,
          });
          this.getDenominationDtl();
        },
        err => { this.isLoading = false; }
      );
    } else { this.transactionDtlsFrm.reset(); }

  }

  private getDenominationDtl(): void {
    if (this.transactionDtl.trf_type === 'C') {
      let tmDenoTrf = new tm_denomination_trans();
      tmDenoTrf.brn_cd = this.sys.BranchCode;
      tmDenoTrf.trans_cd = this.transactionDtl.trans_cd;
      tmDenoTrf.trans_dt = Utils.convertStringToDt(this.transactionDtl.trans_dt.toString());
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
    } else {
      let tdDefTranTransfr = new td_def_trans_trf();
      tdDefTranTransfr.brn_cd = this.sys.BranchCode;
      tdDefTranTransfr.trans_cd = this.transactionDtl.trans_cd;
      tdDefTranTransfr.trans_dt = Utils.convertStringToDt(this.transactionDtl.trans_dt.toString());
      // tdDefTranTransfr.trans_type = this.transactionDtl.trans_type;
      this.svc.addUpdDel<any>('Common/GetDepTransTrfwithChild', tdDefTranTransfr).subscribe(
        res => {
          debugger;
          if (null !== res && Object.keys(res).length !== 0) {
            this.tranferDetails = res;
            this.showTransferDtl = true;
            this.totalOfDenomination = 0;
            this.tranferDetails.forEach(e => {
              this.totalOfDenomination += (+e.amount);
            });
            // this.tmDenominationTransLst = res;
            // this.tmDenominationTransLst.forEach(element => {
            //   this.totalOfDenomination += element.total;
            // });
          }
        },
        err => { }
      );
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
