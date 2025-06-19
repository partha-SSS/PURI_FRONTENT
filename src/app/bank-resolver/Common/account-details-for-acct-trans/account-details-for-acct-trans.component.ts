import { td_rd_installment } from './../../Models/td_rd_installment';
import { tm_deposit } from './../../Models/tm_deposit';
import { tm_depositall } from './../../Models';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InAppMessageService, RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { mm_constitution } from '../../Models/deposit/mm_constitution';
import { mm_oprational_intr } from '../../Models/deposit/mm_oprational_intr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-account-details-for-acct-trans',
  templateUrl: './account-details-for-acct-trans.component.html',
  styleUrls: ['./account-details-for-acct-trans.component.css']
})
export class AccountDetailsForAcctTransComponent implements OnInit, OnDestroy {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  constructor(private frmBldr: FormBuilder, private svc: RestService,
    private msg: InAppMessageService, private modalService: BsModalService) {
    this.subscription = this.msg.getCommonTmDepositAll().subscribe(
      res => {
        if (null !== res && undefined !== res &&
          res.acc_cd !== 0) {
          this.acctDtls = res;
          this.setAcctDetails();
        } else {
          if (undefined !== this.accDtlsFrm) {
            this.accDtlsFrm.reset();
            this.showInterestForRd = false;
          }
        }
      },
      err => { }
    );
    this.subscription = this.msg.getShdowBalance().subscribe(
      res => {
        if (null !== res) {
          res = +res;
          res += this.ShadowBalance;
          this.accDtlsFrm.patchValue({
            shadow_bal: res
          });
        }
      },
      err => { }
    );
  }
  subscription: Subscription;
  acctDtls = new tm_depositall();
  isLoading = false;
  show = false;
  showInterestDtls = false;
  showInterestForRd = false;
  accDtlsFrm: FormGroup;
  ShadowBalance: number;
  constitutionList: mm_constitution[] = [];
  operationalInstrList: mm_oprational_intr[] = [];
  rdInstallements: td_rd_installment[] = [];
  modalRef: BsModalRef;
  ngOnInit(): void {
    this.show = true;
    this.resetFormData();
    this.getConstitutionList();
    this.getOperationalInstr();
  }

  getConstitutionList() {
    if (this.constitutionList.length > 0) {
      return;
    }

    this.constitutionList = [];
    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
      res => {
        this.constitutionList = Utils.ChkArrNotEmptyRetrnEmptyArr(res);
      },
      err => { // ;
      }
    );
  }

  openModal(template: TemplateRef<any>) {
    // this.getRdInstallament();
    this.msg.sendCommonAccountNum(this.acctDtls.acc_num);
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  getOperationalInstr() {
    if (this.operationalInstrList.length > 0) {
      return;
    }

    this.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
      res => {
        this.operationalInstrList = res;
      },
      err => { }
    );
  }
  private resetFormData(): void {
    this.showInterestForRd = false;
    this.accDtlsFrm = this.frmBldr.group({
      brn_cd: [''],
      acc_type_cd: [''],
      acc_num: [''],
      renew_id: [''],
      cust_cd: [''],
      intt_trf_type: [''],
      constitution_cd: [''],
      constitution_cd_desc: [''],
      oprn_instr_cd: [''],
      oprn_instr_cd_desc: [''],
      opening_dt: [''],
      prn_amt: [''],
      intt_amt: [''],
      mat_amt: [''],
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
      created_by: [''],
      created_dt: [''],
      modified_by: [''],
      modified_dt: [''],
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
      cust_type: [''],
      title: [''],
      first_name: [''],
      middle_name: [''],
      last_name: [''],
      cust_name: [''],
      guardian_name: [''],
      cust_dt: [''],
      dt_of_birth: [''],
      age: [''],
      sex: [''],
      marital_status: [''],
      catg_cd: [''],
      community: [''],
      caste: [''],
      permanent_address: [''],
      ward_no: [''],
      state: [''],
      dist: [''],
      pin: [''],
      vill_cd: [''],
      block_cd: [''],
      service_area_cd: [''],
      occupation: [''],
      phone: [''],
      present_address: [''],
      constitution_desc: [''],
      shadow_bal: [''],
      dep_period_y: [''],
      dep_period_m: [''],
      dep_period_d: [''],
    });
  }

  setAcctDetails(): void {
    if (undefined !== this.acctDtls && Object.keys(this.acctDtls).length !== 0) {
      this.resetFormData();
      this.getShadowBalance();
      if (this.acctDtls.acc_type_cd === 2
        || this.acctDtls.acc_type_cd === 3
        || this.acctDtls.acc_type_cd === 4
        || this.acctDtls.acc_type_cd === 5) {
        this.showInterestDtls = true;
        this.acctDtls.ShowClose = true;
      }
      if (this.acctDtls.acc_type_cd === 6) {
        this.showInterestForRd = true;
        this.acctDtls.ShowClose = true;
      }
      const constitution = this.constitutionList.filter(e => e.constitution_cd
        === this.acctDtls.constitution_cd)[0];
      const OprnInstrDesc = this.operationalInstrList.filter(e => e.oprn_cd
        === this.acctDtls.oprn_instr_cd)[0];

      let intrestType = '';
      if (this.acctDtls.intt_trf_type === 'O') {
        intrestType = 'On Maturity';
      } else if (this.acctDtls.intt_trf_type === 'H') {
        intrestType = 'Half Yearly';
      } else if (this.acctDtls.intt_trf_type === 'Q') {
        intrestType = 'Quarterly';
      } else if (this.acctDtls.intt_trf_type === 'M') {
        intrestType = 'Monthly';
      }

      this.accDtlsFrm.patchValue({
        brn_cd: this.acctDtls.brn_cd,
        acc_type_cd: this.acctDtls.acc_type_cd,
        acc_num: this.acctDtls.acc_num,
        renew_id: this.acctDtls.renew_id,
        cust_cd: this.acctDtls.cust_cd,
        cust_name: this.acctDtls.cust_name,
        intt_trf_type: intrestType,
        constitution_cd: this.acctDtls.constitution_cd,
        constitution_cd_desc:  (undefined !== constitution && null !== constitution
          && undefined !== constitution.constitution_desc && null !== constitution.constitution_desc) ?
        constitution.constitution_desc : null,
        oprn_instr_cd: this.acctDtls.oprn_instr_cd,
        oprn_instr_cd_desc: (undefined !== OprnInstrDesc && null !== OprnInstrDesc
          && undefined !== OprnInstrDesc.oprn_desc && null !== OprnInstrDesc.oprn_desc) ?
        OprnInstrDesc.oprn_desc : null,
        opening_dt: this.acctDtls.opening_dt.toString().substr(0, 10),
        prn_amt: this.acctDtls.prn_amt,
        intt_amt: this.acctDtls.intt_amt,
        mat_amt: this.acctDtls.prn_amt + this.acctDtls.intt_amt,
        dep_period_y: null === this.acctDtls.dep_period ? ''
          : (this.acctDtls.dep_period.split(';')[0].split('=')[1]),
        dep_period_m: null === this.acctDtls.dep_period ? ''
          : (this.acctDtls.dep_period.split(';')[1].split('=')[1]),
        dep_period_d: null === this.acctDtls.dep_period ? ''
          : (this.acctDtls.dep_period.split(';')[2].split('=')[1]),
        instl_amt: this.acctDtls.instl_amt,
        instl_no: this.acctDtls.instl_no,
        mat_dt: this.acctDtls.mat_dt.toString().substr(0, 10),
        intt_rt: this.acctDtls.intt_rt,
        tds_applicable: this.acctDtls.tds_applicable,
        last_intt_calc_dt: this.acctDtls.last_intt_calc_dt.toString().substr(0, 10),
        acc_close_dt: this.acctDtls.ShowClose ? Utils.getTodaysDtInCorrectFormat() : null,
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
    } else {
      this.accDtlsFrm.reset();
      this.showInterestForRd = false;
    }
  }

  getShadowBalance(): void {
    const tmDep = new tm_deposit();
    this.ShadowBalance = 0;
    tmDep.acc_type_cd = this.acctDtls.acc_type_cd;
    tmDep.brn_cd = this.acctDtls.brn_cd;
    tmDep.acc_num = this.acctDtls.acc_num;
    this.svc.addUpdDel<any>('Deposit/GetShadowBalance', tmDep).subscribe(
      res => {
        if (undefined !== res && null !== res && !isNaN(+res)) {
          this.ShadowBalance = res;
          this.accDtlsFrm.patchValue({
            shadow_bal: res
          });
        }
      },
      err => { this.isLoading = false; console.log(err); }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
