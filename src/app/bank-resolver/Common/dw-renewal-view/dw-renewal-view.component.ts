import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InAppMessageService, RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { tm_deposit } from '../../Models';

@Component({
  selector: 'app-dw-renewal-view',
  templateUrl: './dw-renewal-view.component.html',
  styleUrls: ['./dw-renewal-view.component.css']
})
export class DwRenewalViewComponent implements OnInit, OnDestroy {

  constructor(private frmBldr: FormBuilder, private svc: RestService,
    private msg: InAppMessageService) {
    this.subscription = this.msg.getCommonAcctInfo().subscribe(
      res => {
        if (null !== res && undefined !== res &&
          res.cust_cd !== 0) {
          this.acctDtls = res;
          this.setAcctDetails();
        } else {
          if (undefined !== this.accDtlsFrm) {
            this.accDtlsFrm.reset();
          }
        }
      },
      err => { }
    );
   }
  subscription: Subscription;
  acctDtls: tm_deposit;
  isLoading = false;
  show = false;
  accDtlsFrm: FormGroup;

  ngOnInit(): void {
    this.accDtlsFrm = this.frmBldr.group({
      brn_cd: [''],
      acc_type_cd: [''],
      acc_num: [''],
      renew_id: [''],
      cust_cd: [''],
      intt_trf_type: [''],
      constitution_cd: [''],
      oprn_instr_cd: [''],
      opening_dt: [''],
      prn_amt: [''],
      intt_amt: [''],
      dep_period: [''],
      instl_amt: [''],
      instl_no: [''],
      mat_dt: [''],
      intt_rt: [''],
      tds_applicable: [''],
      last_intt_calc_dt: [''],
      acc_close_dt: [''],
      closing_prn_amt: [''],
      closing_intt_amt: [''],
      penal_amt: [''],
      ext_instl_tot: [''],
      mat_status: [''],
      acc_status: [''],
      curr_bal: [''],
      clr_bal: [''],
      standing_instr_flag: [''],
      cheque_facility_flag: [''],
      approval_status: [''],
      approved_by: [''],
      approved_dt: [''],
      user_acc_num: [''],
      lock_mode: [''],
      loan_id: [''],
      cert_no: [''],
      bonus_amt: [''],
      penal_intt_rt: [''],
      bonus_intt_rt: [''],
      transfer_flag: [''],
      transfer_dt: [''],
      agent_cd: [''],
    });
  }

  setAcctDetails(): void {
    if (Utils.ChkArrNotEmpty(this.acctDtls)) {
      this.accDtlsFrm.patchValue({
        brn_cd: this.acctDtls.brn_cd,
        acc_type_cd: this.acctDtls.acc_type_cd,
        acc_num: this.acctDtls.acc_num,
        renew_id: this.acctDtls.renew_id,
        cust_cd: this.acctDtls.cust_cd,
        intt_trf_type: this.acctDtls.intt_trf_type,
        constitution_cd: this.acctDtls.constitution_cd,
        oprn_instr_cd: this.acctDtls.oprn_instr_cd,
        opening_dt: this.acctDtls.opening_dt,
        prn_amt: this.acctDtls.prn_amt,
        intt_amt: this.acctDtls.intt_amt,
        dep_period: this.acctDtls.dep_period,
        instl_amt: this.acctDtls.instl_amt,
        instl_no: this.acctDtls.instl_no,
        mat_dt: this.acctDtls.mat_dt,
        intt_rt: this.acctDtls.intt_rt,
        tds_applicable: this.acctDtls.tds_applicable,
        last_intt_calc_dt: this.acctDtls.last_intt_calc_dt,
        acc_close_dt: this.acctDtls.acc_close_dt,
        closing_prn_amt: this.acctDtls.closing_prn_amt,
        closing_intt_amt: this.acctDtls.closing_intt_amt,
        penal_amt: this.acctDtls.penal_amt,
        ext_instl_tot: this.acctDtls.ext_instl_tot,
        mat_status: this.acctDtls.mat_status,
        acc_status: this.acctDtls.acc_status,
        curr_bal: this.acctDtls.curr_bal,
        clr_bal: this.acctDtls.clr_bal,
        standing_instr_flag: this.acctDtls.standing_instr_flag,
        cheque_facility_flag: this.acctDtls.cheque_facility_flag,
        approval_status: this.acctDtls.approval_status,
        approved_by: this.acctDtls.approved_by,
        approved_dt: this.acctDtls.approved_dt,
        user_acc_num: this.acctDtls.user_acc_num,
        lock_mode: this.acctDtls.lock_mode,
        loan_id: this.acctDtls.loan_id,
        cert_no: this.acctDtls.cert_no,
        bonus_amt: this.acctDtls.bonus_amt,
        penal_intt_rt: this.acctDtls.penal_intt_rt,
        bonus_intt_rt: this.acctDtls.bonus_intt_rt,
        transfer_flag: this.acctDtls.transfer_flag,
        transfer_dt: this.acctDtls.transfer_dt,
        agent_cd: this.acctDtls.agent_cd,
      });
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
