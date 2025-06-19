import { p_gen_param } from './../../Models/p_gen_param';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InAppMessageService, RestService } from 'src/app/_service';
import {
  MessageType, mm_customer, ShowMessage, td_def_trans_trf,
  mm_acc_type, tm_deposit, SystemValues, mm_category
} from '../../Models';
import { TranApprovalVM } from '../../Models/TranApprovalVM';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import Utils from 'src/app/_utility/utils';
import { mm_constitution } from '../../Models/deposit/mm_constitution';
import { mm_oprational_intr } from '../../Models/deposit/mm_oprational_intr';
import { tm_denomination_trans } from '../../Models/deposit/tm_denomination_trans';
import { AccOpenDM } from '../../Models/deposit/AccOpenDM';
import { td_accholder } from '../../Models/deposit/td_accholder';

@Component({
  selector: 'app-transactionapproval',
  templateUrl: './transactionapproval.component.html',
  styleUrls: ['./transactionapproval.component.css'],

})
export class TransactionapprovalComponent implements OnInit {
  constructor(private svc: RestService,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router, private frmBldr: FormBuilder) { }
  static accType: mm_acc_type[] = [];
  static categories: mm_category[] = [];
  @ViewChild('MakerChecker', { static: true }) MakerChecker: TemplateRef<any>;
  @ViewChild('lockApprove', { static: true }) lockApprove: TemplateRef<any>;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;
  selectedAccountType: number;
  selectedTransactionMode: string;
  vm: TranApprovalVM[] = [];
  filteredVm: TranApprovalVM[] = [];
  selectedVm: TranApprovalVM;
  selectedVm1: TranApprovalVM;
  selectedVm2: TranApprovalVM;
  selectedTransactionCd: number;
  isLoading = false;
  showMsg: ShowMessage;
  tdDepTrans = new td_def_trans_trf();
  tdDepTransGroup: any;
  custTitle: string;
  uniqueAccTypes: mm_acc_type[] = [];
  renewData: td_def_trans_trf[] = [];
  modalRef: BsModalRef;
  sys = new SystemValues();
  toFltrTrnCd = '';
  toFltrAccountTyp = '';
  refresh = false;
  trfDtls:boolean=false;
  custMstrFrm: FormGroup;
  accDtlsFrm: FormGroup;
  constitutionList: mm_constitution[] = [];
  operationalInstrList: mm_oprational_intr[] = [];
  selectedAcctDtls: tm_deposit;
  transactionDtlsFrm: FormGroup;
  renewDtlsFrm:FormGroup;
  showDenominationDtl = false;
  disabledApproved:boolean=true;
  // showTransferDtl = false;
  totalOfDenomination = 0;
  tranferDetails: td_def_trans_trf[] = [];
  tmDenominationTransLst: tm_denomination_trans[] = [];
  additionalInformation: AccOpenDM;
  fetchingAddInf = false;
  acctypcd:any;
  accnum:any;
  typeCd:any;
  createUser:any;
  logUser:any;
  kycForAllHolder:boolean=true;
  AllHolder:td_accholder[];
  acc_OWNER:any=null;
  joinHold:any=[];
  Totamount:any;
  lockApproveFlag:number=0;
  tempData:any=null;
  // cust: mm_customer;
  // tdDepTransRet: td_def_trans_trf[] = [];

  ngOnInit(): void {
    this.logUser=localStorage.getItem('itemUX');
    setTimeout(() => {
      this.getAcctTypeMaster();
      this.getCategoryMaster();
      this.getConstitutionList();
      this.getOperationalInstr();
    }, 150);
    this.resetCustFrom();
    this.resetAccDtlsFrmData();
    this.resetTransactionDtlsFrm();
    
  }

  private resetCustFrom(): void {
    this.custMstrFrm = this.frmBldr.group({
      brn_cd: [''],
      cust_cd: [''],
      cust_type: [''],
      title: [''],
      first_name: [''],
      middle_name: [''],
      last_name: [''],
      cust_name: [''],
      guardian_name: [''],
      cust_dt: [''],
      old_cust_cd: [''],
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
      block_cd: ['', { disabled: true }],
      service_area_cd: [''],
      occupation: [''],
      phone: [''],
      present_address: [''],
      farmer_type: [''],
      email: [''],
      monthly_income: [''],
      date_of_death: [''],
      sms_flag: [''],
      status: [''],
      pan: ['',],
      nominee: [''],
      nom_relation: [''],
      kyc_photo_type: [''],
      kyc_photo_no: [''],
      kyc_address_type: [''],
      kyc_address_no: [''],
      org_status: [''],
      org_reg_no: [''],
      catg_desc: ['']
    });
  }

  private resetTransactionDtlsFrm(): void {
    this.transactionDtlsFrm = this.frmBldr.group({
      trans_dt: [''],
      trans_cd: [''],
      acc_type_cd: [''],
      acc_num: [''],
      trans_type: [''],
      trans_mode: [''],
      amount: [''],
      tot_amount: [''],
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
    this.renewDtlsFrm = this.frmBldr.group({
      dep_period: [''],
      opening_dt: [''],
      mat_dt: [''],
      instl_no: [''],
      prn_amt: [''],
      curr_intt_recov: [''],
      intt_rt: [''],
      tot_amount: [''],
    });
  }

  private resetAccDtlsFrmData(): void {
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

  private setTransactionDtl(transactionDtl: td_def_trans_trf): void {
    console.log(transactionDtl);
    this.showDenominationDtl = false;
    // this.showTransferDtl = false;
    this.totalOfDenomination = 0;
    if (undefined !== transactionDtl && Object.keys(transactionDtl).length !== 0) {
      this.svc.addUpdDel<mm_acc_type[]>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          const accType = res.filter(e => e.acc_type_cd === transactionDtl.acc_type_cd)[0];
          
          this.transactionDtlsFrm.patchValue({
            trans_dt: transactionDtl.trans_dt.toString().substr(0, 10),
            trans_cd: transactionDtl.trans_cd,
            acc_type_cd: accType.acc_type_desc,
            acc_num: transactionDtl.acc_num,
            trans_type: transactionDtl.trans_type === 'D' ? 'Deposit' :
              transactionDtl.trans_type === 'W' ? 'Withdrawal' :
                transactionDtl.trans_type === 'I' ? 'Interest Payment' : null,
            trans_mode: transactionDtl.trans_mode === 'R' ? 'Renewal' :
              transactionDtl.trans_mode === 'C' ? 'Close' :
                transactionDtl.trans_mode === 'I' ? 'Interest Payment' :
                  transactionDtl.trans_mode === 'W' ? 'Withdrawal Slip' :
                    transactionDtl.trans_mode === 'V' ? 'Voucher' :
                      transactionDtl.trans_mode === 'O' ? 'Open' :
                        transactionDtl.trans_mode === 'Q' ? 'Cheque' : null,
            amount: transactionDtl.trans_mode!='R'?(transactionDtl.amount?transactionDtl.amount:transactionDtl.ovd_prn_recov):
            transactionDtl.acc_type_cd==4?transactionDtl.ovd_prn_recov:
            transactionDtl.acc_type_cd==2?transactionDtl.ovd_prn_recov:
            transactionDtl.acc_type_cd==5?transactionDtl.ovd_prn_recov:
            transactionDtl.ovd_prn_recov+transactionDtl.curr_intt_recov,//PARTHA

            instrument_dt: transactionDtl.instrument_dt.toString() === '01/01/0001 00:00' ? '' :
              transactionDtl.instrument_dt.toString().substr(0, 10),
            instrument_num: transactionDtl.instrument_num === 0 ? null :
              transactionDtl.instrument_num,
            paid_to: transactionDtl.paid_to,
            token_num: transactionDtl.token_num,
            approval_status: transactionDtl.approval_status === 'U' ? 'Unapproved' :
              transactionDtl.approval_status === 'A' ? 'Approved' : '',
            approved_by: transactionDtl.approved_by,
            approved_dt: transactionDtl.approved_dt.toString().substr(0, 10),
            particulars: transactionDtl.particulars,
            tr_acc_type_cd: transactionDtl.tr_acc_type_cd,
            tr_acc_num: transactionDtl.tr_acc_num,
            voucher_dt: transactionDtl.voucher_dt.toString().substr(0, 10),
            voucher_id: transactionDtl.voucher_id,
            trf_type: transactionDtl.trf_type === 'C' ? 'Cash' :
              transactionDtl.trf_type === 'T' ? 'Transfer' : '',
            tr_acc_cd: transactionDtl.tr_acc_cd,
            acc_cd: transactionDtl.acc_cd,
            share_amt: transactionDtl.share_amt,
            sum_assured: transactionDtl.sum_assured,
            paid_amt: transactionDtl.paid_amt,
            curr_prn_recov: transactionDtl.curr_prn_recov,
            ovd_prn_recov: transactionDtl.ovd_prn_recov,
            curr_numbert_recov: transactionDtl.curr_intt_recov,
            tot_amount:transactionDtl.trans_mode!='R'?(transactionDtl.curr_intt_recov!=null && transactionDtl.curr_intt_recov!=undefined? 
              (transactionDtl.amount?transactionDtl.amount+transactionDtl.curr_intt_recov+(transactionDtl.curr_prn_recov!=null || transactionDtl.curr_prn_recov!=undefined?transactionDtl.curr_prn_recov:0)-(transactionDtl.ovd_intt_recov!=null ||transactionDtl.ovd_intt_recov!=undefined?transactionDtl.ovd_intt_recov:0):(transactionDtl.curr_intt_recov?transactionDtl.curr_intt_recov:transactionDtl.ovd_prn_recov)):transactionDtl.amount):
              (transactionDtl.acc_type_cd==2?(transactionDtl.trans_type=='D'? transactionDtl.ovd_prn_recov+transactionDtl.curr_intt_recov:transactionDtl.ovd_prn_recov):
              (transactionDtl.acc_type_cd==4?(transactionDtl.trans_type=='D'?transactionDtl.ovd_prn_recov+transactionDtl.curr_intt_recov:transactionDtl.ovd_prn_recov):
              (transactionDtl.acc_type_cd==5?(transactionDtl.trans_type=='D'?transactionDtl.ovd_prn_recov+transactionDtl.curr_intt_recov:transactionDtl.ovd_prn_recov):
              transactionDtl.curr_prn_recov- transactionDtl.ovd_prn_recov-transactionDtl.curr_intt_recov+transactionDtl.ovd_prn_recov+transactionDtl.curr_intt_recov))),
            
              curr_intt_recov: transactionDtl.trans_mode=='R'? transactionDtl.acc_type_cd==4?transactionDtl.curr_intt_recov:
            transactionDtl.acc_type_cd==2?transactionDtl.curr_intt_recov:
            transactionDtl.acc_type_cd==5?transactionDtl.curr_intt_recov:
            transactionDtl.curr_prn_recov- transactionDtl.ovd_prn_recov-transactionDtl.curr_intt_recov :
             transactionDtl.curr_intt_recov,//PARTHA

            ovd_intt_recov: transactionDtl.ovd_intt_recov,
            remarks: transactionDtl.remarks,
            crop_cd: transactionDtl.crop_cd,
            activity_cd: transactionDtl.activity_cd,
            curr_numbert_rate: transactionDtl.curr_intt_rate,
            ovd_numbert_rate: transactionDtl.ovd_intt_rate,
            instl_no: transactionDtl.instl_no,
            instl_start_dt: transactionDtl.instl_start_dt.toString().substr(0, 10),
            periodicity: transactionDtl.periodicity,
            disb_id: transactionDtl.disb_id,
            comp_unit_no: transactionDtl.comp_unit_no,
            ongoing_unit_no: transactionDtl.ongoing_unit_no,
            mis_advance_recov: transactionDtl.mis_advance_recov,
            audit_fees_recov: transactionDtl.audit_fees_recov,
            sector_cd: transactionDtl.sector_cd,
            spl_prog_cd: transactionDtl.spl_prog_cd,
            borrower_cr_cd: transactionDtl.borrower_cr_cd,
            numbert_till_dt: transactionDtl.intt_till_dt,
            acc_name: transactionDtl.acc_name,
            brn_cd: transactionDtl.brn_cd,
          });
          this.getDenominationOrTransferDtl(transactionDtl);
        },
        err => { this.isLoading = false; }
      );
    } else { this.transactionDtlsFrm.reset(); }
    if(transactionDtl.trf_type === 'T'){
      this.trfDtls=true;
    }
    else{
      this.trfDtls=false;

    }

  }

  private getDenominationOrTransferDtl(transactionDtl: td_def_trans_trf): void {
    this.tmDenominationTransLst = [];
    this.tranferDetails = [];
    if (transactionDtl.trf_type === 'C') {
      const tmDenoTrf = new tm_denomination_trans();
      tmDenoTrf.brn_cd = this.sys.BranchCode;
      tmDenoTrf.trans_cd = transactionDtl.trans_cd;
      tmDenoTrf.trans_dt = Utils.convertStringToDt(transactionDtl.trans_dt.toString());
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
      const tdDefTranTransfr = new td_def_trans_trf();
      tdDefTranTransfr.brn_cd = this.sys.BranchCode;
      tdDefTranTransfr.trans_cd = transactionDtl.trans_cd;
      tdDefTranTransfr.trans_dt = Utils.convertStringToDt(transactionDtl.trans_dt.toString());
      // tdDefTranTransfr.trans_type = transactionDtl.trans_type;
      this.svc.addUpdDel<any>('Common/GetDepTransTrfwithChild', tdDefTranTransfr).subscribe(
        res => {
          ////debugger;
          if (null !== res && Object.keys(res).length !== 0) {
            this.tranferDetails = res;
            // this.showTransferDtl = true;
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

  private setAccDtlsFrmData(acctDtls: tm_deposit): void {
    if (undefined !== acctDtls && Object.keys(acctDtls).length !== 0
      && (acctDtls !== null && acctDtls.constitution_cd !== null
        && acctDtls.constitution_cd > 0)) {
      ////debugger;
      const constitution = this.constitutionList.filter(e => e.constitution_cd
        === acctDtls.constitution_cd)[0];
      const OprnInstrDesc = this.operationalInstrList.filter(e => e.oprn_cd
        === acctDtls.oprn_instr_cd)[0];

      this.accDtlsFrm.patchValue({
        brn_cd: acctDtls.brn_cd,
        acc_type_cd: acctDtls.acc_type_cd,
        acc_num: acctDtls.acc_num,
        renew_id: acctDtls.renew_id,
        cust_cd: acctDtls.cust_cd,
        intt_trf_type: acctDtls.intt_trf_type,
        constitution_cd: acctDtls.constitution_cd,
        constitution_cd_desc: (undefined !== constitution && null !== constitution
          && undefined !== constitution.constitution_desc && null !== constitution.constitution_desc) ?
          constitution.constitution_desc : null,
        oprn_instr_cd: acctDtls.oprn_instr_cd,
        oprn_instr_cd_desc: (undefined !== OprnInstrDesc && null !== OprnInstrDesc
          && undefined !== OprnInstrDesc.oprn_desc && null !== OprnInstrDesc.oprn_desc) ?
          OprnInstrDesc.oprn_desc : null,
        opening_dt: acctDtls.opening_dt.toString().substr(0, 10),
        prn_amt: acctDtls.prn_amt,
        intt_amt: acctDtls.intt_amt,
        dep_period: acctDtls.dep_period,
        instl_amt: acctDtls.instl_amt,
        instl_no: acctDtls.instl_no,
        mat_dt:  acctDtls.mat_dt.toString() === '01/01/0001 00:00' ? '' :acctDtls.mat_dt.toString().substr(0, 10),
        intt_rt: acctDtls.intt_rt,
        tds_applicable: acctDtls.tds_applicable,
        last_intt_calc_dt: acctDtls.last_intt_calc_dt.toString().substr(0, 10),
        acc_close_dt: acctDtls.acc_close_dt.toString().substr(0, 10),
        closing_prn_amt: acctDtls.closing_prn_amt,
        closing_intt_amt: acctDtls.closing_intt_amt,
        penal_amt: acctDtls.penal_amt,
        ext_instl_tot: acctDtls.ext_instl_tot,
        mat_status: acctDtls.mat_status,
        acc_status: acctDtls.acc_status,
        curr_bal: acctDtls.curr_bal,
        clr_bal: (this.selectedVm.td_def_trans_trf.acc_type_cd==1||this.selectedVm.td_def_trans_trf.acc_type_cd==7
          ||this.selectedVm.td_def_trans_trf.acc_type_cd==8||this.selectedVm.td_def_trans_trf.acc_type_cd==9
          ||this.selectedVm.td_def_trans_trf.acc_type_cd==11)?this.selectedVm.td_def_trans_trf.trans_type == 'D'?acctDtls.curr_bal + (+this.Totamount):acctDtls.curr_bal - (+this.Totamount):0,
        standing_instr_flag: acctDtls.standing_instr_flag,
        cheque_facility_flag: acctDtls.cheque_facility_flag,
        approval_status: acctDtls.approval_status,
        approved_by: acctDtls.approved_by,
        approved_dt: acctDtls.approved_dt.toString().substr(0, 10),
        user_acc_num: acctDtls.user_acc_num,
        lock_mode: acctDtls.lock_mode,
        loan_id: acctDtls.loan_id,
        cert_no: acctDtls.cert_no,
        bonus_amt: acctDtls.bonus_amt,
        penal_intt_rt: acctDtls.penal_intt_rt,
        bonus_intt_rt: acctDtls.bonus_intt_rt,
        transfer_flag: acctDtls.transfer_flag,
        transfer_dt: acctDtls.transfer_dt.toString().substr(0, 10),
        agent_cd: acctDtls.agent_cd,
      });
      debugger
    } else { this.accDtlsFrm.reset(); }
  }

  private setCustFrm(cust: mm_customer): void {
    if (undefined !== cust && Object.keys(cust).length !== 0) {
      const category = TransactionapprovalComponent.categories.
        filter(e => e.catg_cd === cust.catg_cd)[0];
      this.custMstrFrm.patchValue({
        brn_cd: cust.brn_cd,
        cust_cd: cust.cust_cd,
        cust_type: cust.cust_type,
        title: cust.title,
        first_name: cust.first_name,
        middle_name: cust.middle_name,
        last_name: cust.last_name,
        cust_name: cust.cust_name,
        guardian_name: cust.guardian_name,
        cust_dt: cust.cust_dt,
        old_cust_cd: cust.old_cust_cd,
        dt_of_birth: cust.dt_of_birth.toString().substr(0, 10),
        age: cust.age,
        sex: cust.sex,
        marital_status: cust.marital_status,
        catg_cd: cust.catg_cd,
        community: cust.community,
        caste: cust.caste,
        permanent_address: cust.permanent_address,
        ward_no: cust.ward_no,
        state: cust.state,
        dist: cust.dist,
        pin: cust.pin,
        vill_cd: cust.vill_cd,
        block_cd: cust.block_cd,
        service_area_cd: cust.service_area_cd,
        occupation: cust.occupation,
        phone: cust.phone,
        present_address: cust.present_address,
        farmer_type: cust.farmer_type,
        email: cust.email,
        monthly_income: cust.monthly_income,
        date_of_death: cust.date_of_death,
        sms_flag: cust.sms_flag,
        status: cust.status,
        pan: cust.pan,
        nominee: cust.nominee,
        nom_relation: cust.nom_relation,
        kyc_photo_type: cust.kyc_photo_type,
        kyc_photo_no: cust.kyc_photo_no,
        kyc_address_type: cust.kyc_address_type,
        kyc_address_no: cust.kyc_address_no,
        org_status: cust.org_status,
        org_reg_no: cust.org_reg_no,
        catg_desc: category?.catg_desc
      });
    } else { this.custMstrFrm.reset(); }

  }

  getConstitutionList() {
    if (undefined !== this.constitutionList &&
      null !== this.constitutionList &&
      this.constitutionList.length > 0) {
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

  getOperationalInstr() {
    if (this.operationalInstrList.length > 0) {
      return;
    }

    this.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
      res => {
        this.operationalInstrList = Utils.ChkArrNotEmptyRetrnEmptyArr(res);
      },
      err => { }
    );
  }

  private getCategoryMaster(): void {
    if (undefined !== TransactionapprovalComponent.categories &&
      null !== TransactionapprovalComponent.categories &&
      TransactionapprovalComponent.categories.length > 0) {
    } else {
      this.svc.addUpdDel<mm_category[]>('Mst/GetCategoryMaster', null).subscribe(
        res => {
          if (Utils.ChkArrNotEmpty(res)) {
            TransactionapprovalComponent.categories = res;
          }
        },
        err => { }
      );
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  public onClickRefreshList() {
    this.disabledApproved=true;
    this.unLockTransaction(this.tempData?this.tempData:null);
    this.HandleMessage(false);
    this.refresh = false;
    // this.msg.sendCommonTransactionInfo(null);
    this.resetTransactionDtlsFrm();
    this.custMstrFrm.reset();
    // this.msg.sendCommonAcctInfo(null);
    this.resetAccDtlsFrmData();
    this.msg.sendCommonAccountNum(null);
    this.toFltrAccountTyp = '';
    this.toFltrTrnCd = '';
    this.refresh = true;
    this.trfDtls=false;
    this.getAcctTypeMaster();
    this.tranferDetails = [];
    this.totalOfDenomination = 0;
    this.AllHolder=[];
    this.joinHold=[];
    this.selectedVm1=new TranApprovalVM()
    this.selectedVm=new TranApprovalVM()
  }

  private getAcctTypeMaster(): void {
    this.isLoading = true;
    if (undefined !== TransactionapprovalComponent.accType &&
      null !== TransactionapprovalComponent.accType &&
      TransactionapprovalComponent.accType.length > 0) {
      this.isLoading = false;
      // this.uniqueAccTypes = TransactionapprovalComponent.accType;
      this.GetUnapprovedDepTrans();
    } else {
      this.svc.addUpdDel<mm_acc_type[]>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          TransactionapprovalComponent.accType = res;
          this.isLoading = false;
          // this.uniqueAccTypes = TransactionapprovalComponent.accType;
          this.GetUnapprovedDepTrans();
        },
        err => { this.isLoading = false; }
      );
    }
  }
  public selectTransaction(vm: TranApprovalVM): void {
    if (vm.td_def_trans_trf.created_by){
      const inputString=vm.td_def_trans_trf.created_by
      const parts = inputString.split('/');
      if (parts.length > 0) {
        const result = parts[0];
        this.createUser=result;
        console.log(result); // This will output: username
      } else {
        this.createUser="no"
        console.log("No '/' found in the string.");
      }
    }
    this.tempData=null;
    this.tempData=vm.td_def_trans_trf;
    console.log(this.tempData);
    
    this.HandleMessage(false);
    console.log(vm.td_def_trans_trf)
    this.typeCd=vm.td_def_trans_trf.acc_type_cd
    this.Totamount=vm.td_def_trans_trf.amount
    let k= new tm_deposit();
    k.acc_type_cd=vm.td_def_trans_trf.acc_type_cd;
    k.acc_num=vm.td_def_trans_trf.acc_num;
    this.msg.sendCommonAcctInfo(k)
    this.msg.sendcustomerCodeForKyc(k.cust_cd);
    debugger
    this.additionalInformation = new AccOpenDM();
    this.selectedVm = vm;
    // this.selectedVm1 = vm;
    // this.selectedVm2 = vm;
    this.selectedTransactionCd = vm.td_def_trans_trf.trans_cd;
    this.selectedAccountType = vm.td_def_trans_trf.acc_type_cd;
    this.selectedTransactionMode = vm.td_def_trans_trf.trans_mode;
    this.getTranAcctInfo(vm.td_def_trans_trf.acc_num);
    this.getDepTrans(vm.td_def_trans_trf);
    this.lockTransaction(vm.td_def_trans_trf);

  }
  private lockTransaction(dt:any){
    console.log(dt);
    debugger
    const data={
      "ardb_cd":this.sys.ardbCD, 
      "brn_cd": this.sys.BranchCode,
      "adt_trans_dt": dt.trans_dt,
      "ad_trans_cd": dt.trans_cd  
      }
      this.svc.addUpdDel<any>('Deposit/TransactionLock', data).subscribe(
        res => {
          this.lockApproveFlag=0
          console.log(res);
          if(res){
            this.disabledApproved=false;
          this.lockApproveFlag=(+res.flag)
          if(this.lockApproveFlag!=2){
            this.accDtlsFrm.reset();
            this.renewDtlsFrm.reset();
            this.transactionDtlsFrm.reset();
            this.custMstrFrm.reset();
            this.tranferDetails=[];
            this.disabledApproved=true;
            this.modalRef = this.modalService.show(this.lockApprove, { class: 'modal-lg' });
          }
          else{
            this.disabledApproved=false;
          }
          debugger;
          }
          
        }
        )
  }
  private unLockTransaction(dt:any){
    console.log(dt);
    if(dt.trans_cd){
      debugger
    const data={
      "ardb_cd":this.sys.ardbCD, 
      "brn_cd": this.sys.BranchCode,
      "adt_trans_dt": dt.trans_dt,
      "ad_trans_cd": dt.trans_cd  
      }
      this.svc.addUpdDel<any>('Deposit/TransactionLockReverse', data).subscribe(
        res => {
          this.lockApproveFlag=0
          console.log(res);
          if(res){
            this.disabledApproved=true;
          this.lockApproveFlag=(+res.flag)
          if(this.lockApproveFlag!=2){
            // this.onClickRefreshList();
            this.disabledApproved=true;
            // this.modalRef = this.modalService.show(this.lockApprove, { class: 'modal-lg' });
          }
          else{
            this.disabledApproved=true;
          }
          debugger;
          }
          
        }
        )
    }
  }
  private getAdditionalInformationForAccount(tmDeposit: tm_deposit): void {
    this.fetchingAddInf = true;
    this.acc_OWNER=tmDeposit.cust_cd;
    this.svc.addUpdDel<any>('Deposit/GetDepositAddlInfo', tmDeposit).subscribe(
      res => {
        debugger;
        this.fetchingAddInf = false;
        if (undefined !== res && null !== res) {
          this.additionalInformation = res;
          if (undefined !== this.additionalInformation.tdintroducer
            && null !== this.additionalInformation.tdintroducer
            && this.additionalInformation.tdintroducer.length > 0) {
            this.additionalInformation.tdintroducer.forEach(element => {
              const desc = TransactionapprovalComponent.accType
                .filter(e => e.acc_type_cd === element.acc_type_cd)[0].acc_type_desc;
              if (null !== desc && desc.length > 0) {
                element.AccTypeDesc = desc;
              }
            });
          }
          if(res.tdaccholder.length>0){
            this.kycForAllHolder=false;
            this.AllHolder=res.tdaccholder;
            
              for (let i = 0; i <= this.AllHolder.length; i++) {
                console.log(res);
                
              this.joinHold+=(this.AllHolder.length==0?'':this.AllHolder[i]?.acc_holder+',')
              console.log(this.joinHold);
              }
            debugger
          }
          else{
            this.kycForAllHolder=true;
            this.AllHolder=[];
            this.joinHold=[];
            this.msg.sendcustomerCodeForKyc(tmDeposit.cust_cd);
          }
        }
      },
      err => { this.additionalInformation = new AccOpenDM(); this.fetchingAddInf = false; }
    );
  }
  holderKYC(i:any){
    if(i=="OWN"){
    this.msg.sendcustomerCodeForKyc(this.acc_OWNER);
    }
    else{
    this.msg.sendcustomerCodeForKyc(this.AllHolder[i].cust_cd)
    }
    debugger
  }
  private getDepTrans(depTras: td_def_trans_trf): void {
    this.getRenewDtls(depTras);
    this.isLoading = true;
    // this.showCust = false; // this is done to forcibly rebind the screen
    // const defTransaction = new td_def_trans_trf();
    // defTransaction.trans_cd = this.selectedTransactionCd;
    // defTransaction.brn_cd = localStorage.getItem('__brnCd');
    this.svc.addUpdDel<td_def_trans_trf>('Common/GetDepTrans', depTras).subscribe(
      res => {
        this.selectedVm.td_def_trans_trf = res[0];
        // this.msg.sendCommonTransactionInfo(res[0]); // show transaction details
        this.setTransactionDtl(res[0]);
        this.isLoading = false;
        if (this.selectedVm.td_def_trans_trf.created_by){
          const inputString=this.selectedVm.td_def_trans_trf.created_by
          const parts = inputString.split('/');
          if (parts.length > 0) {
            const result = parts[0];
            this.selectedVm.td_def_trans_trf.created_by=result;
            console.log(result); // This will output: username
          } else {
            this.selectedVm.td_def_trans_trf.created_by="no"
            console.log("No '/' found in the string.");
          }
        }
      },
      err => { this.isLoading = false; }
    );
  }
  private getRenewDtls(depTras: td_def_trans_trf){
    this.svc.addUpdDel<any>('Deposit/GetAccountOpeningTempData', depTras).subscribe(
      res => {
        const allData=res;
        const renewData=allData.tmdepositrenew;
        if(renewData.acc_num!=null){
          debugger
          this.renewDtlsFrm.patchValue({
            dep_period:renewData.dep_period,
            mat_dt:renewData.mat_dt?.substr(0,10),
            opening_dt:renewData.created_dt?.substr(0,10),
            intt_rt:renewData.intt_rt,
            prn_amt:renewData.prn_amt,
            curr_intt_recov:renewData.intt_amt,
            instl_no:renewData.instl_no,
            tot_amount:renewData.intt_amt+renewData.prn_amt
          });
        }
         
      })
  }
  private getCustInfo(CustCd: number): void {
    this.isLoading = true;
    // this.showCust = false; // this is done to forcibly rebind the screen
    const cust = new mm_customer(); cust.cust_cd = CustCd;
    this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
      res => {
        this.selectedVm.mm_customer = res[0];
        this.setCustFrm(res[0]);
        this.msg.sendcustomerCodeForKyc(this.selectedVm.mm_customer.cust_cd);
        this.isLoading = false;
        debugger
      },
      err => { this.isLoading = false; }
    );
  }

  private getTranAcctInfo(forAcc: string): void {
    this.isLoading = false;
    let acc = new tm_deposit();
    acc.acc_num = forAcc; acc.brn_cd = this.sys.BranchCode;
    acc.acc_type_cd=this.typeCd
     // localStorage.getItem('__brnCd');
    console.log(acc.ardb_cd)
    this.svc.addUpdDel<tm_deposit>('Deposit/GetDepositView', acc).subscribe(
      res => {
        acc = res[0];
        console.log(acc)
        this.acctypcd=acc.acc_type_cd;
        this.accnum=acc.acc_num
        this.selectedVm.tm_deposit = acc;
        this.refresh = false;
        this.setAccDtlsFrmData(acc);
        // this.msg.sendCommonAccountNum(acc.acc_num);
        this.getAdditionalInformationForAccount(acc);
        this.refresh = true;
        this.isLoading = false;
        this.getCustInfo(acc.cust_cd);
      },
      err => { this.isLoading = false; }
    );
  }

  /** Below method handles message show/hide */
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();

    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

  private GetUnapprovedDepTrans(): void {
    this.isLoading = true;
    this.tdDepTrans.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', this.tdDepTrans).subscribe(
      res => {
        // const filteredTransactions = res.filter(transaction => transaction.acc_type_cd !== 11);
        const tdDepTransRet = res as td_def_trans_trf[];
        this.vm = [];
        tdDepTransRet.forEach(element => {
          const vm = new TranApprovalVM();
          vm.mm_acc_type = TransactionapprovalComponent.accType.
            filter(e => e.acc_type_cd === element.acc_type_cd && e.dep_loan_flag === 'D')[0];
          vm.td_def_trans_trf = element;
          this.vm.push(vm);
          // add and check account type in unique account type list
          const isAcctTypePresent = this.uniqueAccTypes.filter(e => e.acc_type_cd === vm.mm_acc_type.acc_type_cd)[0];
          if (undefined === isAcctTypePresent) {
            this.uniqueAccTypes.push(vm.mm_acc_type);
          }

        });
        this.vm.forEach(e=>{
          if(e.td_def_trans_trf.created_by){
          const inputString=e.td_def_trans_trf.created_by
          const parts = inputString?.split('/');
          var name;
          if (parts.length > 0) {
            const result = parts[0];
            name=result;
            console.log(result); // This will output: username
          } else {
           name=e.td_def_trans_trf.created_by
            console.log("No '/' found in the string.");
          }
          e.td_def_trans_trf.created_by=name;
          }else{

          }
        })
        this.uniqueAccTypes = this.uniqueAccTypes.sort((a, b) => (a.acc_type_cd < b.acc_type_cd ? -1 : 1));
        this.filteredVm = this.vm;
        this.filteredVm = this.filteredVm.sort((a, b) => (a.td_def_trans_trf.trans_cd < b.td_def_trans_trf.trans_cd ? -1 : 1));
        // this.tdDepTransGroup = this.groupBy(this.tdDepTransRet, (c) => c.acc_type_cd);
        this.isLoading = false;
        debugger
      },
      err => { this.isLoading = false; }
    );
  }

  public onApproveClick(): void {
    this.selectedVm1=new TranApprovalVM();
    debugger
    this.selectedVm1=this.selectedVm;
    debugger
    this.selectedVm=new TranApprovalVM();
    this.disabledApproved=true;
    debugger
    this.modalRef.hide();
    debugger
    if(this.createUser?.toLowerCase()==this.logUser?.toLowerCase()){
      this.modalRef = this.modalService.show(this.MakerChecker, { class: 'modal-lg' });
      
    }
    else{
      if (this.selectedVm1.td_def_trans_trf.trans_type.toLocaleLowerCase() === 'W') {
        if (this.selectedVm1.tm_deposit.acc_type_cd === 1 ||
          this.selectedVm1.tm_deposit.acc_type_cd === 7) {
          if ((this.selectedVm1.tm_deposit.clr_bal - this.selectedVm1.td_def_trans_trf.amount) < 0) {
            this.HandleMessage(true, MessageType.Warning, 'Balance Will Be Negative....So Operation Rejected.' +
              'You First Approve The Deposit Vouchers Then Approve This Voucher.');
            return;
          }
        }
      }
    //   this.tempData = new TranApprovalVM();
    // this.tempData=this.selectedVm1;
    
    this.isLoading = true;
    const param = new p_gen_param();
    param.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    param.ad_trans_cd =this.transactionDtlsFrm.controls.acc_num.value.length>0? this.selectedVm1.td_def_trans_trf.trans_cd:null;
    // const dt = this.sys.CurrentDate;
    param.adt_trans_dt = this.sys.CurrentDate;
    param.ad_acc_type_cd = this.selectedVm1.mm_acc_type.acc_type_cd;
    param.as_acc_num = this.selectedVm1.tm_deposit.acc_num;
    param.flag = this.selectedVm1.td_def_trans_trf.trans_type === 'D' ? 'D' : 'W';
    param.gs_user_id = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    param.ardb_cd = this.sys.ardbCD
    debugger
    this.svc.addUpdDel<any>('Deposit/ApproveAccountTranaction', param).subscribe(
      res => {
        if (res === 0) {
          this.selectedVm1.td_def_trans_trf.approval_status = 'A';
          this.HandleMessage(true, MessageType.Sucess, this.selectedVm1.tm_deposit.acc_num
            + '\'s Transaction with Transancation Cd ' + this.selectedVm1.td_def_trans_trf.trans_cd
            + ' is approved successfully.');
          setTimeout(() => {
            this.onClickRefreshList();
            this.isLoading = false;
            
          }, 3000);
        } else {
          this.onClickRefreshList();
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, JSON.stringify(res));
        }
      },
      err => {
        this.onClickRefreshList();
        this.isLoading = false;
        const errorMessage=err.error.text;
        if(this.containsSubstring(errorMessage)){
          this.HandleMessage(true, MessageType.Error,'Transaction already Approved...');
          this.onClickRefreshList();
        }
        
        console.log(err.error.text);
        debugger
        this.HandleMessage(true, MessageType.Error, err.status==400?'Select Transaction to be APPROVE!!':'Error from server side');
      }
    );
  }
}

containsSubstring(msg:any): boolean {
  return msg.includes("Transaction already Approved...");
}
  public onChangeAcctType(acctTypeCd: number): void {
    acctTypeCd = +acctTypeCd;
    if (acctTypeCd === -99) {
      this.filteredVm = this.vm;
    } else {
      this.filteredVm = this.vm.filter(e => e.mm_acc_type.acc_type_cd === acctTypeCd);
    }
  }
  public acctNumberAndTrnCdFilter(searchValue: string): void {
    if (null !== searchValue && '' !== searchValue) {
      this.filteredVm = this.vm.filter(e => e.td_def_trans_trf.acc_num.includes(searchValue) ||
        e.td_def_trans_trf.trans_cd.toString().includes(searchValue));
    } else {
      this.filteredVm = this.vm;
    }
  }
  ApproveNoClick(){
    this.modalRef.hide() ;
    this.onClickRefreshList();
  }
  onDeleteClick(): void {
    if (!(confirm('Are you sure you want to Delete Transaction of Acc ' + this.selectedVm.tm_deposit.acc_num
      + ' with Transancation Cd ' + this.selectedVm.td_def_trans_trf.trans_cd))) {
      return;
    }

    this.isLoading = true;
    const param = new td_def_trans_trf();
    param.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    param.trans_cd = this.selectedVm.td_def_trans_trf.trans_cd;
    // const dt = this.sys.CurrentDate;
    param.trans_dt = this.sys.CurrentDate;
    param.acc_type_cd = this.selectedVm.mm_acc_type.acc_type_cd;
    param.acc_num = this.selectedVm.tm_deposit.acc_num;

    this.svc.addUpdDel<any>('Deposit/DeleteAccountOpeningData ', param).subscribe(
      res => {
        this.isLoading = false;
        if (res === 0) {
          this.onClickRefreshList();
          this.HandleMessage(true, MessageType.Sucess, this.selectedVm.tm_deposit.acc_num
            + '\'s Transaction with Transancation Cd ' + this.selectedVm.td_def_trans_trf.trans_cd
            + ' is deleted.');
        } else {
          this.HandleMessage(true, MessageType.Error, JSON.stringify(res));
        }
      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, err.error.text);
      }
    );
  }

  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
}
