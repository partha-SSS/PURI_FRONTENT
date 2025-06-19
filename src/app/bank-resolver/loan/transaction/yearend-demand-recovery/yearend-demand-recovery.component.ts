import { Router } from '@angular/router';

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestService, InAppMessageService } from 'src/app/_service';
import {
  MessageType, mm_acc_type, mm_block, mm_customer,
  mm_operation, m_acc_master, ShowMessage, SystemValues,
  td_def_trans_trf, tm_deposit
} from '../../../Models';
import { tm_denomination_trans } from '../../../Models/deposit/tm_denomination_trans';
import { DatePipe } from '@angular/common';
import { tm_transfer } from '../../../Models/deposit/tm_transfer';
import { tt_denomination } from '../../../Models/deposit/tt_denomination';
import { mm_constitution } from '../../../Models/deposit/mm_constitution';
import Utils from 'src/app/_utility/utils';
import { p_gen_param } from '../../../Models/p_gen_param';
import { AccounTransactionsComponent } from 'src/app/bank-resolver/deposit/accoun-transactions/accoun-transactions.component';
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { tm_loan_sanction_dtls } from 'src/app/bank-resolver/Models/loan/tm_loan_sanction_dtls';
import { mm_installment_type } from 'src/app/bank-resolver/Models/mm_installment_type';
import { p_loan_param } from 'src/app/bank-resolver/Models/loan/p_loan_param';
import { tt_loan_rep } from 'src/app/bank-resolver/Models/loan/tt_loan_rep';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/internal/Observable';
// import { threadId } from 'worker_threads';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { tm_subsidy } from 'src/app/bank-resolver/Models/loan/tm_subsidy';
import { mm_activity } from 'src/app/bank-resolver/Models/loan/mm_activity';
@Component({
  selector: 'app-yearend-demand-recovery',
  templateUrl: './yearend-demand-recovery.component.html',
  styleUrls: ['./yearend-demand-recovery.component.css'],
  providers: [DatePipe]
})
export class YearendDemandRecoveryComponent implements OnInit {
  constructor(private svc: RestService, private msg: InAppMessageService, private modalService: BsModalService,
    private frmBldr: FormBuilder, public datePipe: DatePipe, private router: Router) { }
  get f() { return this.accTransFrm.controls; }
  get fd() { return this.accDtlsFrm.controls; }
  get td() { return this.tdDefTransFrm.controls; }
  static constitutionList: mm_constitution[] = [];
  private static operations: mm_operation[] = [];
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('contentbatch', { static: true }) contentbatch: TemplateRef<any>;
  @ViewChild('contentLoanRep', { static: true }) contentLoanRep: TemplateRef<any>;
  @ViewChild('contentLoanStmt', { static: true }) contentLoanStmt: TemplateRef<any>;
  @ViewChild('custDtls', { static: true }) custDtls: TemplateRef<any>;
  @ViewChild('LoanChallan', { static: true }) LoanChallan: TemplateRef<any>;
  @ViewChild('ContaiLoanChallan', { static: true }) ContaiLoanChallan: TemplateRef<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  lFinYearDt=localStorage.getItem('__lastDt');
  cust_acc_type:any;
  blocks: mm_block[] = [];
  selectedBlock:any[]=[];
  acc2 = new LoanOpenDM();
  operations: mm_operation[];
  unApprovedTransactionLst: td_def_trans_trf[] = [];
  unapprovedTrans: td_def_trans_trf[] = [];
  disableOperation = true;
  modalRef: BsModalRef;
  AcctTypes: mm_operation[];
  LoanRepSch: tt_loan_rep[];
  transType: DynamicSelect;
  isLoading: boolean;
  sys = new SystemValues();
  accTransFrm: FormGroup;
  tdDefTransFrm: FormGroup;
  accDtlsFrm: FormGroup;
  sancDetails: FormGroup;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  // sancdtls: FormArray;
  showTransMode = false;
  showTransactionDtl = false;
  hideOnClose = false;
  isRecovery = false;
  isDisburs = false;
  isOpenToDp = false;
  isDelete = false;
  TrfTotAmt = 0;
  strtDt: any;
  perVal: any;
  editDeleteMode = false;
  inttTillDt: any;
  shownoresult=false;
  recov_sum=0;
  outPrn:any;
  outIntt:any;
  pps:any;
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  subSidyAmt=0;
  CurrentYearDemand:any[]=[];
  customerList: mm_customer[] = [];
  td_deftrans = new td_def_trans_trf();
  td_deftranstrfList: td_def_trans_trf[] = [];
  tm_transferList: tm_transfer[] = [];
  accountTypeList: mm_acc_type[] = [];
  acc_master: m_acc_master[] = [];
  acc_master1: m_acc_master[] = [];
  tm_deposit = new tm_deposit();
  name:string;
  accNoEnteredForTransaction: tm_loan_all;
  hideOnRenewal = false;
  showTranferType = true;
  showMsg: ShowMessage;
  showInstrumentDtl = false;
  tm_denominationList: tm_denomination_trans[] = [];
  denominationList: tt_denomination[] = [];
  sancdtls: tm_loan_sanction_dtls[] = [];
  installmenttypeList: mm_installment_type[] = [];
  denominationGrandTotal = 0;
  transferGrandTotal = 0;
  suggestedCustomer1: mm_customer[];
  ardbName=localStorage.getItem('ardb_name');
  ardbAddr=localStorage.getItem('ardb_addr');
  branchName=this.sys.BranchName;
  suggestedCustomer: mm_customer[];
  suggestedCustomerCr: mm_customer[];
  indxsuggestedCustomerCr = 0;
  currRt: any;
  ovdRt: any;
  instl_no: any
  accCD: any;
  accTCD: any;
  loanID: any;
  currPrn: any;
  ovdPrn: any;
  currIntt: any;
  ovdIntt: any;
  showRemarks = false;
  disabledOnNull=true;
  disableOnSaveEdit=false;
  disableChangeTrf=true
  inttRetForUpdate:any;
  hidegl:boolean=true;
  glHead:any;
  displayedColumns: string[] = ['trans_dt', 'disb_amt', 'curr_intt_cal', 'ovd_intt_cal','penal_intt_cal','last_intt_calc_dt','prn_trf','intt_trf','curr_intt_recov','ovd_intt_recov','penal_intt_recov','adv_prn_recov','curr_prn_recov','ovd_prn_recov','totalRecov','curr_prn','ovd_prn','curr_intt','ovd_intt','penal_intt'];
  dataSource = new MatTableDataSource()
  opcrSum = 0;
  drSum = 0;
  crSum = 0;
  clsdrSum = 0;
  clscrSum = 0;
  totalRecovSum=0;
  lastAccCD: any;
  today: any
  cName: any
  cAddress: any
  cAcc: any
  lastAccNum: any
  currInttSum = 0
  ovdInttSum = 0
  ovdPrnSum = 0
  currPrnSum = 0
  currInttRecovSum = 0
  ovdInttRecovSum = 0
  ovdPrnRecovSum = 0
  currPrnRecovSum = 0
  totPrn = 0;
  loanId: any;
  custNm:any;
  addr:any;
  reportData: any = []
  fromdate: Date;
  toDate: Date;
  // suggestedCustomer: mm_customer[];
  recovSum=0;
  disbSum=0;
  lastDt:any;
  lastCd:any;
  penalInttSum=0
  penalInttRecovSum=0;
  advPrnRecovSum=0;
  showWait=false
  resultLength=0;
  currInttCalSum = 0
  ovdInttCalSum = 0
  penalInttCalSum=0
  fdCurrPrn=0
  fdCurrIntt=0
  fdPrincipal=0
  fdTotalDue=0
  fdIntt=0;
  fdOvdprn=0
  fdOvdIntt=0
  fdPenalIntt=0
  joinHold:any=[];
  member_id:string;
  acc_block:string;
  acc_lfNo:string;
  acc_phone:string;
  guardian_name:string;
  present_address:string;
  l_cust_cd:any;
  l_case_no:string;
  t_d:any;
  t_a:any;
  s_a:any;
  c_int:any;
  o_int:any;
  i_r_t:any;
  c_p:any;
  c_i:any;
  o_p:any;
  o_i:any;
  a_p:any;
  p_i:any;
  t_cd:any;
  i_n_dt:any;
  partyName:any;
  ln_id:any;
  aCD:any
  acDesc:any;
  trns_type:any;
  m_id:any;
  fdt:any;
  tdt:any;
  l_ch:any;
  activityList: mm_activity[] = [];

  // editDeleteMode=false
  // showInstrumentDtl = false;
  ngOnInit(): void {
    this.initialize();
  }
  initialize(): void {
    this.showMsg = null;
    this.getActivityList();
    this.isLoading = false;
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today= n + " "+ time
    this.accTransFrm = this.frmBldr.group({
      acc_type_cd: [''],
      oprn_cd: [''],
      acct_num: ['']
    });
    this.accDtlsFrm = this.frmBldr.group({
      cust_name: [''],
      intt_recev: [''],
      curr_principal: [''],
      curr_intt: [''],
      curr_intt_rate: [''],
      ovd_principal: [''],
      ovd_intt: [''],
      ovd_intt_rate: [''],
      principal: [''],
      total_due: [''],
      disb_amt: [''],
      disb_dt: [''],
      penal_intt: ['']
    });
    this.tdDefTransFrm = this.frmBldr.group({
      trans_dt: [''],
      trans_cd: [''],
      acc_type_cd: [''],
      acc_type_desc: [''],
      acc_num: [''],
      adv_prn_recov: [''],
      trans_type_key: [''],
      trans_type: [''],
      trans_mode: [''],
      amount: [''],
      instrument_dt: [''],
      instrument_num: [''],
      paid_to: [''],
      penal_intt_recov: [''],
      token_num: [''],
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
      intt_till_dt: [''],
      acc_name: [''],
      brn_cd: [''],
      trf_type_desc: [''],
      constitution_cd: [''],
      constitution_cd_desc: [''],
      cert_no: [''],
      opening_dt: [''],
      mat_dt: [''],
      dep_period_y: [''],
      dep_period_m: [''],
      dep_period_d: [''],
      intt_trf_type: [''],
      intt_rate: [''],
      interest: [''],
      recov_type: [''],
      intt_recov_dt: [''],
      paid_amount: [''],
      no_of_day: [''],
      share: [''],
      comm: [''],
      svcchrg: [''],
      saleform: [''],
      insurence: [''],
      remarks_on_manual: ['']
    });

    const td_deftranstrf: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftranstrf;
    const temp_deftranstrf = new td_def_trans_trf();
    this.td_deftranstrfList.push(temp_deftranstrf);


    setTimeout(() => {
      this.getBlockMster();
      this.getOperationMaster();
      this.getAccountTypeList();
      // this.getCustomerList();
      this.GetUnapprovedDepTrans();
      this.getDenominationList();
      this.getInstallmentType();
      
    }, 150);
  }
  // addVoucherFromGroup(): FormGroup {
  //   return this.frmBldr.group({
  //     'sector': '',
  //     'activity': '',
  //     'sanc_amt':'',
  //     'draw_amt':''
  //   });
  // }
  processInterest(): void {
    const temp_gen_param = new p_gen_param();

    temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;

    if (this.td.acc_type_cd.value === 6) {
      // if (this.td.instl_amt.value === undefined || this.td.instl_amt.value === null ||
      //   this.td.instl_no.value === undefined || this.td.instl_no.value === null ||
      //   this.td.intt_rt.value === undefined || this.td.intt_rt.value === null)
      // // temp_gen_param.an_intt_rate === undefined || temp_gen_param.an_intt_rate === null )
      // {
      //   return;
      // }

      temp_gen_param.ad_instl_amt = +this.td.instl_amt.value;
      temp_gen_param.an_instl_no = +this.td.instl_no.value;
      temp_gen_param.an_intt_rate = +this.td.intt_rt.value;
      this.calCrdIntReg(temp_gen_param);
    }
    else {

      // if (((this.tm_deposit.year === undefined || this.tm_deposit.year === null) &&
      //   (this.tm_deposit.month === undefined || this.tm_deposit.month === null) &&
      //   (this.tm_deposit.day === undefined || this.tm_deposit.day === null)) ||
      //   this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null || this.tm_deposit.prn_amt === 0 ||
      //   this.tm_deposit.intt_trf_type === undefined || this.tm_deposit.intt_trf_type === null) {
      //   return;
      // }
      if (this.td.intt_trf_type.value === '' || this.td.intt_rate.value === '') {
        return;
      }


      // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      // this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
      // this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
      // this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);


      // var temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = +this.td.acc_type_cd.value;
      temp_gen_param.ad_prn_amt = +this.td.amount.value;
      temp_gen_param.adt_temp_dt = Utils.convertStringToDt(this.td.opening_dt.value);
      temp_gen_param.as_intt_type = this.td.intt_trf_type.value;
      // tslint:disable-next-line: max-line-length
      // if (typeof (this.td.opening_dt) === 'string') {
      //   this.tm_deposit.opening_dt = Utils.convertStringToDt(this.td.opening_dt.value);
      // }

      // if (typeof (this.tm_deposit.mat_dt) === 'string') {
      //   this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
      // }

      const o = Utils.convertStringToDt(this.td.opening_dt.value);
      const m = Utils.convertStringToDt(this.td.mat_dt.value);
      const diffDays = Math.ceil((Math.abs(m.getTime() - o.getTime())) / (1000 * 3600 * 24));

      temp_gen_param.ai_period = diffDays;
      temp_gen_param.ad_intt_rt = +this.td.intt_rate.value;

      this.f_calctdintt_reg(temp_gen_param);
    }
  }

  calCrdIntReg(tempGenParam: p_gen_param): void {
    this.isLoading = true;

    this.svc.addUpdDel<any>('Deposit/F_CALCRDINTT_REG', tempGenParam).subscribe(
      res => {

        this.tm_deposit.intt_amt = res;
        this.tm_deposit.mat_val = Number(this.tm_deposit.intt_amt) + Number(this.tm_deposit.prn_amt);
        this.isLoading = false;
      },
      err => {
        this.tm_deposit.intt_amt = 0;
        this.isLoading = false;

      }
    );
  }

  f_calctdintt_reg(temp_gen_param: p_gen_param): void {
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
      res => {
        this.tdDefTransFrm.patchValue({
          interest: +res
        });
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;

      }
    );
  }

  // getConstitutionList() {
  //   if (AccounTransactionsComponent.constitutionList.length > 0) {
  //     return;
  //   }

  //   AccounTransactionsComponent.constitutionList = [];
  //   this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
  //     res => {
  //       // ;
  //       AccounTransactionsComponent.constitutionList = res;
  //     },
  //     err => { // ;
  //     }
  //   );
  // }

  private getDenominationList(): void {

    let denoList: tt_denomination[] = [];
    this.svc.addUpdDel<any>('Common/GetDenomination', null).subscribe(
      res => {

        denoList = res;
        this.denominationList = denoList.sort((a, b) => (a.value < b.value) ? 1 : -1);
      },
      err => { // ;
      }
    );
  }
  private getInstallmentType(): void {

    this.svc.addUpdDel<any>('Mst/GetInstalmentTypeMaster', null).subscribe(
      res => {
        console.log('installment type list ', res)
        this.installmenttypeList = res;
      },
      err => { // ;
      }
    );
  }

  /** silently bring all the unapproved transaction
   * silently because it will be needed during save
   */
  private GetUnapprovedDepTrans(): void {
    const tdDepTrans = new td_def_trans_trf();
    tdDepTrans.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    tdDepTrans.trans_type = 'L';
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', tdDepTrans).subscribe(
      res => {
        console.log(res)
        this.unApprovedTransactionLst = res;
        debugger;
      },
      err => { this.isLoading = false; }
    );
  }

  // getCustomerList() {
  //   ;
  //   const cust = new mm_customer();
  //   cust.cust_cd = 0;
  //   cust.brn_cd = this.sys.BranchCode;

  //   if (this.customerList === undefined || this.customerList === null || this.customerList.length === 0) {
  //     this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
  //       res => {
  //         ;
  //         this.isLoading = false;
  //         this.customerList = res;
  //       },
  //       err => {
  //         this.isLoading = false;
  //         ;
  //       }
  //     );
  //   }
  //   else { this.isLoading = false; }
  // }

  public suggestCustomer(): void {
    this.isLoading=true;
    // if (this.f.acct_num.value.length > 0) {
    //   const prm = new p_gen_param();
    //   prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
    //   prm.as_cust_name = this.f.acct_num.value.toLowerCase();
    //   this.svc.addUpdDel<any>('Loan/GetLoanDtls', prm).subscribe(
    //     res => {
    //       this.isLoading=false;
    //       if (undefined !== res && null !== res && res.length > 0) {
    //         // console.log('here')
           
    //         // this.suggestedCustomer = res.slice(0, 10);
    //         this.suggestedCustomer = res;
    //       } else {
    //         this.shownoresult=true;
    //         this.suggestedCustomer = [];
    //       }
    //     },
    //     err => { 
    //       this.shownoresult=false;
    //       this.isLoading = false;
    //      }
    //   );
    // } else {
    //   this.suggestedCustomer = null;
    // }
    if (this.f.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.brn_cd=this.sys.BranchCode
      prm.as_cust_name = this.f.acct_num.value.toLowerCase();
      this.svc.addUpdDel<any>('Loan/GetLoanDtls1', prm).subscribe(
        res => {
          console.log(res)
          this.isLoading=false;
          if(this.sys.ardbCD=='20'){
            this.name='Phone'
          }
          else{
            this.name='Outstanding'

          }
          if (undefined !== res && null !== res && res.length > 0) {
            // console.log('here')
           
            // this.suggestedCustomer = res.slice(0, 10);
            this.suggestedCustomer = res;
          } else {
            this.shownoresult=true;
            this.suggestedCustomer = [];
          }

        },
        err => { 
          this.shownoresult=false;
          this.isLoading = false;
         }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }
  clearSuggestedCust(){
      this.suggestedCustomer = null;
      this.shownoresult=false
      if (this.f.acct_num.value.length > 0) {
        this.disabledOnNull=false
      }
      else{
        this.disabledOnNull=true;
      }
  }
  public SelectCustomer(cust: any): void {
    console.log(cust);
    this.loanID = cust.loan_id;
    console.log(this.loanID)
    this.shownoresult=false;
    //////debugger;
    ////debugger;
    debugger;
    this.f.acct_num.setValue(cust.loan_id);
    // 
    this.f.acc_type_cd.setValue(cust.acc_cd)
    this.onAcctTypeChange()
    // 
    //this.f.acc_type_cd.disable()
    this.onAccountNumTabOff();
    this.suggestedCustomer = [];
    this.getSubsidy();
    this.td.ongoing_unit_no.enable();


  }

  private getOperationMaster(): void {

    this.isLoading = true;
    // if (undefined !== AccounTransactionsComponent.operations && null !== AccounTransactionsComponent.operations && AccounTransactionsComponent.operations.length > 0) {
    //   this.isLoading = false;
    //   this.AcctTypes = AccounTransactionsComponent.operations.filter(e => e.module_type === 'LOAN')
    //     .filter((thing, i, arr) => {
    //       return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
    //     });
    //   this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
      // console.log(this.AcctTypes)
    // } else {
      this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
        res => {
          console.log(res)
          AccounTransactionsComponent.operations = res;
          debugger
          this.isLoading = false;
          this.AcctTypes = AccounTransactionsComponent.operations.filter(e => e.module_type === 'LOAN')
            .filter((thing, i, arr) => {
              return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
            });
          this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
        },
        err => { this.isLoading = false; }
      );
    // }
    debugger
  }

  public onAcctTypeChange(): void {
    // this.f.acct_num.reset();
    const acctTypCdTofilter = +this.f.acc_type_cd.value;
    const acctTypeDesription = AccounTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter)[0].acc_type_desc;
    this.tdDefTransFrm.patchValue({
      acc_type_desc: acctTypeDesription,
      acc_type_cd: acctTypCdTofilter
    });
    this.operations = AccounTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter);
    // this.f.oprn_cd.enable();
    this.f.acct_num.enable();
    this.f.oprn_cd.disable();
    this.msg.sendCommonTmLoanAll(null);
  }
  onCancel() {
    this.modalRef.hide();
    this.disableOperation = false;
    this.showTransactionDtl = false;
    this.f.oprn_cd.enable();
    this.f.oprn_cd.reset() 
    this.takeDataForCancel();
    this.editDeleteMode = false;
  }
  onCancel2() {
    this.modalRef.hide();
  }
  Submit() {
    debugger;
    this.editDeleteMode = true;
    this.f.oprn_cd.disable();
    this.disableOperation = true;
    this.showTranferType = true;
    this.isOpenToDp = false;
    this.isLoading = true;
    this.showMsg = null;
    const acc1 = new tm_loan_all();
    let acc = new LoanOpenDM();
    acc1.loan_id = '' + this.f.acct_num.value;
    acc1.brn_cd = this.sys.BranchCode;
    acc1.acc_cd = this.f.acc_type_cd.value;
    acc1.trans_cd = this.unapprovedTrans[0].trans_cd;
    acc1.trans_dt = this.unapprovedTrans[0].trans_dt;
    // this.GetUnapprovedDepTrans()
    this.svc.addUpdDel<any>('Loan/GetLoanData', acc1).subscribe(
      res => {
        ////////debugger;
        acc = res;
        this.acc2=res;
        this.GetCustomer();
        this.CurrentDemand();
        console.log(res)
        if (undefined === acc || acc.tmloanall.loan_id == null) {
          this.accTransFrm.patchValue({
            acct_num: ''
          });
          this.HandleMessage(true, MessageType.Error,
            'Loan ID ' + this.f.acct_num.value + ' is not Valid/Present/LoanType doesn\'t match.');
          this.msg.sendCommonTmLoanAll(null);
        } else {
          if (null !== acc.tmloanall.approval_status
            && acc.tmloanall.approval_status.toLowerCase() === 'u') {
            this.HandleMessage(true, MessageType.Error,
              'Loan ' + this.f.acct_num.value + ' is not approved, please approve before transaction.');
            this.msg.sendCommonTmLoanAll(null);
            this.isLoading = false;
            this.onResetClick();
            return;
          }
          
          const oprn_cd_temp = this.operations.filter(e => e.acc_type_cd === acc.tddeftrans.acc_type_cd
            && e.oprn_desc.toLocaleLowerCase() === (acc.tddeftrans.trans_type.toLocaleUpperCase() === 'B'
              ? 'disbursement' : 'recovery') && e.module_type.toLocaleUpperCase() === 'LOAN')[0].oprn_cd;
          this.accTransFrm.patchValue({
            oprn_cd: oprn_cd_temp
          });
          // const td_deftranstrf: td_def_trans_trf[] = [];
          // this.td_deftranstrfList = td_deftranstrf;
          // const temp_deftranstrf = new td_def_trans_trf();
          // this.td_deftranstrfList.push(temp_deftranstrf);
          // this.tm_denominationList = [];
          // this.denominationGrandTotal = 0;
          // this.transferGrandTotal = 0;
          // this.TrfTotAmt = 0;
          // this.tdDefTransFrm.reset();
          // this.accDtlsFrm.reset();
          // this.showTransactionDtl = false;
          // this.disableOperation = false;
          ////////debugger;
          console.log(acc.tddeftrans.trans_type)
          debugger
          this.accNoEnteredForTransaction = acc.tmloanall;
          this.accDtlsFrm.patchValue({
            cust_name: acc.tmloanall.cust_name,
            intt_recev: acc.tmloanall.curr_intt + acc.tmloanall.ovd_intt + acc.tmloanall.penal_intt,
            curr_principal: acc.tmloanall.curr_prn,
            curr_intt: acc.tmloanall.curr_intt,
            curr_intt_rate: acc.tmloanall.curr_intt_rate,
            ovd_principal: acc.tmloanall.ovd_prn,
            ovd_intt: acc.tmloanall.ovd_intt,
            ovd_intt_rate: acc.tmloanall.ovd_intt_rate,
            principal: acc.tmloanall.curr_prn + acc.tmloanall.ovd_prn,
            total_due: acc.tmloanall.curr_intt + acc.tmloanall.ovd_intt + acc.tmloanall.curr_prn + acc.tmloanall.ovd_prn + acc.tmloanall.penal_intt,
            disb_amt: acc.tmloanall.disb_amt,
            disb_dt: acc.tmloanall.disb_dt,
            penal_intt: acc.tmloanall.penal_intt
          });
          // marker
          // this.PopulateRecoveryDetails(3)
          console.log(acc.tddeftrans.ovd_intt_recov, this.td.recov_type.value)
          // debugger;
          // if(this.editDeleteMode && this.td.recov_type.value=='A'){
          //   // console.log('manual select');
          //   debugger; //marker at 581
          //   this.accDtlsFrm.patchValue({
          //     curr_intt:acc.tddeftrans.curr_intt_recov,
          //     ovd_intt: acc.tddeftrans.ovd_intt_recov,
          //     penal_intt:acc.tddeftrans.penal_intt_recov
          // })
          // }

          this.msg.sendCommonTmLoanAll(acc.tmloanall);
          // console.log(acc.tddeftrans.instrument_dt.toString().substr(0, 10))
          // //////debugger;
          console.log(acc.tddeftrans.instrument_dt)
          ////debugger
          var dt = this.sys.CurrentDate
          console.log(acc.tddeftrans.remarks)
          // debugger;
          if (acc.tddeftrans.remarks) {
            this.isRecovery = acc.tddeftrans.remarks ? true : false
            this.showRemarks = acc.tddeftrans.remarks ? true : false;
          }
          
          dt.setDate(dt.getDate() - 1)
          console.log(this.datePipe.transform(dt, 'dd/MM/yyyy hh:mm:ss'))
          console.log(acc.tddeftrans.intt_till_dt);

          //Challan Value set Retrive time
          this.t_cd=acc.tddeftrans.trans_cd;
          this.t_a=(+acc.tddeftrans?.amount)+(acc.tddeftrans?.ongoing_unit_no);
                // this.s_a=saveTransaction.tddeftrans?.share_amt;
                this.c_p=acc.tddeftrans?.curr_prn_recov;
                this.c_i=acc.tddeftrans?.curr_intt_recov;
                this.o_p=acc.tddeftrans?.ovd_prn_recov;
                this.o_i=acc.tddeftrans?.ovd_intt_recov;
                this.a_p=acc.tddeftrans?.adv_prn_recov;
                this.p_i=acc.tddeftrans?.penal_intt_recov;
                this.i_n_dt=acc.tddeftrans?.intt_till_dt;
                this.trns_type=acc.tddeftrans?.trf_type;
                this.ln_id=acc.tddeftrans?.acc_num;
                this.aCD=acc.tmloanall.acc_cd;
                this.l_ch=acc.tddeftrans?.ongoing_unit_no;
                this.acDesc=this.AcctTypes.filter(e=>e.acc_type_cd==this.aCD)[0].acc_type_desc;
                
          debugger;

          this.tdDefTransFrm.patchValue({
            ongoing_unit_no:acc.tddeftrans.ongoing_unit_no,
            trans_cd: acc.tddeftrans.trans_cd,
            trans_dt: acc.tddeftrans.trans_dt,
            acc_num: acc.tmloanall.loan_id,
            acc_type_cd: acc.tmloanall.acc_cd,
            acc_cd: acc.tmloanall.acc_cd, //marker
            curr_intt_rate: acc.tmloanall.curr_intt_rate,
            ovd_intt_rate: acc.tmloanall.ovd_intt_rate,
            instl_start_dt: acc.tmloanall.instl_start_dt.toString().substr(0, 10),
            periodicity: this.installmenttypeList.filter(x => x.desc_type === acc.tmloanall.piriodicity)[0].ins_desc,
            instl_no: acc.tmloanall.instl_no,
            // recov_type:this.td.recov_type.value,
             recov_type: acc.tddeftrans.particulars == 'M' ? 'M' : 'A',
             remarks_on_manual:acc.tddeftrans.remarks,//PARTHA
            intt_recov_dt: Utils.convertStringToDt(acc.tddeftrans.intt_till_dt.toString().substr(0, 10)),
            intt_till_dt: acc.tddeftrans.intt_till_dt.toString().substr(0, 10),
            // intt_till_dt: Utils.convertStringToDt(acc.tddeftrans.intt_till_dt.toString().substr(0, 10)),
            trans_type_key: acc.tddeftrans.trans_type,
            trans_mode: acc.tddeftrans.trans_mode,
            amount: acc.tddeftrans.amount,
            penal_intt_recov: acc.tddeftrans.penal_intt_recov,
            adv_prn_recov: acc.tddeftrans.adv_prn_recov,
            no_of_day: this.dayDiff(acc.tddeftrans.intt_till_dt, this.datePipe.transform(this.td.intt_recov_dt.value, 'dd/MM/yyyy hh:mm:ss')),

            // instrument_dt: acc.tddeftrans.instrument_dt,
            instrument_dt: acc.tddeftrans.trans_mode == 'Q' ? this.datePipe.transform(Utils.convertStringToDt(acc.tddeftrans.instrument_dt.toString().substr(0, 10)), 'yyyy-MM-dd') : null,
            instrument_num: acc.tddeftrans.instrument_num,
            paid_to: acc.tddeftrans.paid_to,
            token_num: acc.tddeftrans.token_num,
            trf_type: acc.tddeftrans.trf_type,
            curr_prn_recov: acc.tddeftrans.curr_prn_recov,
            curr_intt_recov: acc.tddeftrans.curr_intt_recov,
            ovd_prn_recov: acc.tddeftrans.ovd_prn_recov,
            ovd_intt_recov: acc.tddeftrans.ovd_intt_recov,
            paid_amount: acc.tddeftrans.paid_amt,
            share: acc.tddeftrans.share_amt,
            comm: acc.tddeftrans.sum_assured,
            svcchrg: acc.tddeftrans.voucher_id,
            saleform: acc.tddeftrans.mis_advance_recov,
            insurence: acc.tddeftrans.audit_fees_recov
          });
  if(acc.tddeftrans.trans_type=='B'){
  // 
  this.fdCurrPrn=this.fd.curr_principal.value
  this.fdPrincipal=this.fd.principal.value
  this.fdOvdprn=this.fd.ovd_principal.value
  this.fdCurrIntt=this.fd.curr_intt.value
  this.fdOvdIntt=this.fd.ovd_intt.value
  this.fdPenalIntt=this.fd.penal_intt.value
  this.accDtlsFrm.patchValue({
    // adv_prn_recov: (+this.fd.adv_prn_recov.value) - (+this.td.adv_prn_recov.value),
    // penal_intt_recov: (+this.fd.penal_intt_recov.value) - (+this.td.penal_intt_recov.value),
    // curr_prn_recov: (+this.fd.curr_prn_recov.value) - (+this.td.curr_prn_recov.value),
    // curr_intt_recov: (+this.fd.curr_intt_recov.value) - (+this.td.curr_intt_recov.value),
    // ovd_prn_recov: (+this.fd.ovd_prn_recov.value) - (+this.td.ovd_prn_recov.value),
    // ovd_intt_recov: (+this.fd.ovd_intt_recov.value) - (+this.td.ovd_intt_recov.value)
    curr_principal:this.fd.curr_principal.value+this.td.paid_amount.value,
    principal:this.fd.principal.value+this.td.paid_amount.value,
    //total_due: (+this.inttRetForUpdate.curr_intt_recov) + (+this.inttRetForUpdate.ovd_intt_recov) + (+this.inttRetForUpdate.penal_intt_recov) - this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value + +this.inttRetForUpdate.curr_prn_recov-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value) + this.inttRetForUpdate.ovd_prn_recov-(+this.td.ovd_prn_recov.value) ,
    total_due: this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value + this.fd.ovd_principal.value + this.fd.curr_principal.value + this.td.paid_amount.value,


  })
}

          if (acc.tddeftrans.particulars == 'S') {
            this.td.curr_prn_recov.disable();
            this.td.curr_intt_recov.disable();
            this.td.ovd_prn_recov.disable();
            this.td.ovd_intt_recov.disable();
            this.td.penal_intt_recov.disable();
            this.td.adv_prn_recov.disable();
            this.showRemarks = false;
          }
          else {
            this.td.curr_prn_recov.enable();
            this.td.curr_intt_recov.enable();
            this.td.ovd_prn_recov.enable();
            this.td.ovd_intt_recov.enable();
            this.td.penal_intt_recov.enable();
            this.td.adv_prn_recov.enable();
            this.showRemarks = true;
          }
          if (this.td.recov_type.value == 'M') {
            this.tdDefTransFrm.patchValue({
              remarks_on_manual: acc.tddeftrans.remarks
            })


          }
         
          // console.log(this.f.oprn_cd.value);
          // debugger;
          if(this.isRecovery)
         {

          //marker for changed value
          this.PopulateRecoveryDetails(3)    //marker 654


        //   if(acc.tddeftrans.trans_type=='R'){ //marker
        //     console.log(+acc.tmloanall.curr_prn-(+acc.tddeftrans.curr_prn_recov))
        //     // debugger;
        //     this.accDtlsFrm.patchValue({
        //       ovd_principal:+acc.tmloanall.ovd_prn-(+acc.tddeftrans.ovd_prn_recov),
        //       curr_principal:+acc.tmloanall.curr_prn-(+acc.tddeftrans.curr_prn_recov),
        //       curr_intt:+acc.tmloanall.curr_intt-(+acc.tddeftrans.curr_intt_recov),
        //       ovd_intt:+acc.tmloanall.ovd_intt-(+acc.tddeftrans.ovd_intt_recov),
        //       penal_intt:+acc.tmloanall.penal_intt-(+acc.tddeftrans.penal_intt_recov)
        //       // total_due:+/
        //     })
        //  }

          }
          if(this.isDisburs)
          debugger;

          this.sancdtls = acc.tmlaonsanctiondtls;
          this.sancdtls.forEach(x => x.draw_limit = x.sanc_amt - acc.tmloanall.curr_prn);
          if (acc.tddeftrans.trf_type === 'C') {
            // this.tm_denominationList = acc.tmdenominationtrans;
            // this.tm_denominationList.forEach(x => x.rupees_desc = this.denominationList.filter(y => y.value === x.rupees)[0].rupees);
            // this.denominationGrandTotal = 0;
            // for (const l of this.tm_denominationList) {
            //   this.denominationGrandTotal = this.denominationGrandTotal + l.total;
            // }
          }
          else {
            ////////debugger;
            this.td_deftranstrfList = acc.tddeftranstrf;
            // this.f.oprn_cd.enable();
            for (let i = 0; i < this.td_deftranstrfList.length; i++) {
              if (this.td_deftranstrfList[i].acc_num === '0000') {
                this.td_deftranstrfList[i].gl_acc_code = this.td_deftranstrfList[i].acc_type_cd.toString();
                this.checkAndSetDebitAccType('gl_acc', this.td_deftranstrfList[i]);
              }
              else {
                this.td_deftranstrfList[i].cust_acc_type = this.td_deftranstrfList[i].acc_type_cd.toString();
                this.td_deftranstrfList[i].cust_acc_number = this.td_deftranstrfList[i].acc_num;
                this.checkAndSetDebitAccType('cust_acc', this.td_deftranstrfList[i]);
                this.setDebitAccDtls(this.td_deftranstrfList[i]);
              }
            }
            this.sumTransfer();
          }
          if (acc.tddeftrans.trans_type === 'B') {
            this.showTransactionDtl = true;
            this.isDisburs = true;
            this.showTranferType = true;
            this.isRecovery = false;
            // this.showInstrumentDtl = true;
            this.showInstrumentDtl = acc.tddeftrans.trans_mode == 'Q' ? true : false
            console.log(acc.tddeftrans.instrument_dt.toString().substr(0, 10), this.showInstrumentDtl);
            //debugger;
            this.isDelete = true;
            this.f.oprn_cd.disable();
          }
          else {
            this.td.ongoing_unit_no.enable();
            this.showTransactionDtl = true;
            this.isDisburs = false;
            this.showTranferType = true;
            this.isRecovery = true;
            this.isDelete = true;
            this.showInstrumentDtl = acc.tddeftrans.trans_mode == 'Q' ? true : false
            console.log(acc.tddeftrans.instrument_dt.toString().substr(0, 10), this.showInstrumentDtl);
            //debugger;
          }
          debugger;

        }
        this.isLoading = false;
      },
      err => {

        this.f.oprn_cd.disable(); this.isLoading = false;
        console.log(err);
        this.msg.sendCommonTmLoanAll(null);
      }
    
    );

    this.modalRef.hide();
  }
  checkValidity(num: any) {
    // switch (num) {
      // case 1:
      //   if (this.td.curr_prn_recov.value > this.accDtlsFrm.controls.curr_principal.value) {
      //     this.HandleMessage(true, MessageType.Error,'Current principal value ' + this.td.curr_prn_recov.value + ' should not be greater than ' + this.accDtlsFrm.controls.curr_principal.value);
      //     this.td.curr_prn_recov.setValue('')
      //     return;
      //   }
      //   break;
      // case 2:
      //   if (this.td.ovd_prn_recov.value > this.accDtlsFrm.controls.ovd_principal.value) {
      //     this.HandleMessage(true, MessageType.Error,
      //       'Overdue principal value ' + this.td.ovd_prn_recov.value + ' should not be greater than ' + this.accDtlsFrm.controls.ovd_principal.value);
      //       this.td.ovd_prn_recov.setValue('')
      //       return;
      //   }
      //   break;
      // case 3:
      //   if (this.td.adv_prn_recov.value > this.accDtlsFrm.controls.adv_prn.value) {
      //     this.HandleMessage(true, MessageType.Error,
      //       'Advance principal value ' + this.td.adv_prn_recov.value + ' should be less then ' + this.accDtlsFrm.controls.adv_prn.value);
      //     return;
      //   }
      //   break;
      // case 4:
      //   if (this.td.curr_intt_recov.value > this.accDtlsFrm.controls.curr_intt.value) {
      //     this.HandleMessage(true, MessageType.Error,
      //       'Current interest value ' + this.td.curr_intt_recov.value + ' should not be greater than ' + this.accDtlsFrm.controls.curr_intt.value);
      //        this.td.curr_intt_recov.setValue('')
      //       return;
      //   }
      //   break;
      // case 5:
      //   if (this.td.ovd_intt_recov.value > this.accDtlsFrm.controls.ovd_intt.value) {
      //       this.HandleMessage(true, MessageType.Error,
      //         'Overdue interest value ' + this.td.ovd_intt_recov.value + ' should not be greater than ' + this.accDtlsFrm.controls.ovd_intt.value);
      //       this.td.ovd_intt_recov.setValue('')
      //         return;
      //     }
      //     break;
      // case 6:
      //   if (this.td.penal_intt_recov.value > this.accDtlsFrm.controls.penal_intt.value) {
      //     this.HandleMessage(true, MessageType.Error,
      //        'Penal interest value ' + this.td.penal_intt_recov.value + ' should not be greater than ' + this.accDtlsFrm.controls.penal_intt.value);
      //       this.td.penal_intt_recov.setValue('')
      //       return;
      //   }
      //   break;
    // }
  }
  takeDataForCancel() {

    this.f.oprn_cd.enable();
    this.f.oprn_cd.reset() //marker
    console.log(this.f.oprn_cd.value)
    this.disableOperation = true;
    this.showTranferType = true;
    this.isDelete = false;
    this.isLoading = true;
    this.showMsg = null;
    const acc1 = new tm_loan_all();
    let acc = new LoanOpenDM();
    acc1.loan_id = '' + this.f.acct_num.value;
    acc1.brn_cd = this.sys.BranchCode;
    acc1.acc_cd = this.f.acc_type_cd.value;
    this.svc.addUpdDel<any>('Loan/GetLoanData', acc1).subscribe(
      res => {
        acc = res;
        this.strtDt = acc.tmloanall.instl_start_dt
        this.currRt = acc.tmloanall.curr_intt_rate
        this.ovdRt = acc.tmloanall.ovd_intt_rate
        this.instl_no = acc.tmloanall.instl_no
        this.perVal = acc.tmloanall.piriodicity
        this.accCD = acc.tmloanall.acc_cd
        this.currPrn = acc.tmloanall.curr_prn
        this.ovdPrn = acc.tmloanall.ovd_prn
        this.currIntt = acc.tmloanall.curr_intt
        this.ovdIntt = acc.tmloanall.ovd_intt_rate
        this.inttTillDt = acc.tmloanall.last_intt_calc_dt
        if (undefined === acc || acc.tmloanall.loan_id == null) {
          this.accTransFrm.patchValue({
            acct_num: ''
          });
          this.HandleMessage(true, MessageType.Error,
            'Loan ID' + this.f.acct_num.value + ' is not Valid/Present/Account Type doesn\'t match.');
          this.msg.sendCommonTmLoanAll(null);
        } else {
          if (null !== acc.tmloanall.approval_status
            && acc.tmloanall.approval_status.toLowerCase() === 'u') {
            this.HandleMessage(true, MessageType.Error,
              'Loan ' + this.f.acct_num.value + ' is not approved, please approve before transaction.');
            this.msg.sendCommonTmLoanAll(null);
            this.isLoading = false;
            this.onResetClick();
            return;
          }
          this.accTransFrm.patchValue({
            oprn_cd: '',
            instl_start_dt: acc.tmloanall.instl_start_dt
          });
          const td_deftranstrf: td_def_trans_trf[] = [];
          this.td_deftranstrfList = td_deftranstrf;
          const temp_deftranstrf = new td_def_trans_trf();
          this.td_deftranstrfList.push(temp_deftranstrf);
          this.tm_denominationList = [];
          this.denominationGrandTotal = 0;
          this.transferGrandTotal = 0;
          this.TrfTotAmt = 0;
          // const temp_denomination = new tm_denomination_trans();
          // temp_denomination.brn_cd = localStorage.getItem('__brnCd');
          // temp_denomination.trans_dt = this.sys.CurrentDate;
          // this.tm_denominationList.push(temp_denomination);
          // this.tdDefTransFrm.reset();
          this.accDtlsFrm.reset();
          this.showTransactionDtl = false;
          this.disableOperation = false;
          this.accNoEnteredForTransaction = acc.tmloanall;
          console.log(acc.tmloanall.penal_intt)
          // debugger;
          this.accDtlsFrm.patchValue({
            cust_name: acc.tmloanall.cust_name,
            intt_recev: acc.tmloanall.curr_intt + acc.tmloanall.ovd_intt + acc.tmloanall.penal_intt,
            curr_principal: acc.tmloanall.curr_prn,
            curr_intt: acc.tmloanall.curr_intt,
            curr_intt_rate: acc.tmloanall.curr_intt_rate,
            ovd_principal: acc.tmloanall.ovd_prn,
            ovd_intt: acc.tmloanall.ovd_intt,
            ovd_intt_rate: acc.tmloanall.ovd_intt_rate,
            principal: acc.tmloanall.curr_prn + acc.tmloanall.ovd_prn,
            total_due: acc.tmloanall.curr_intt + acc.tmloanall.ovd_intt + acc.tmloanall.curr_prn + acc.tmloanall.ovd_prn,
            disb_amt: acc.tmloanall.disb_amt,
            disb_dt: acc.tmloanall.disb_dt,
            penal_intt:acc.tmloanall.penal_intt
          });
          var dt = this.sys.CurrentDate
          dt.setDate(dt.getDate() - 1)
          console.log(this.datePipe.transform(dt, 'dd/MM/yyyy hh:mm:ss'))
          this.msg.sendCommonTmLoanAll(acc.tmloanall);
          this.tdDefTransFrm.patchValue({
            acc_num: acc.tmloanall.loan_id,
            acc_type_cd: acc.tmloanall.acc_cd,
            curr_intt_rate: acc.tmloanall.curr_intt_rate,
            ovd_intt_rate: acc.tmloanall.ovd_intt_rate,
            instl_start_dt: acc.tmloanall.instl_start_dt.toString().substr(0, 10),
            periodicity: this.installmenttypeList.filter(x => x.desc_type === acc.tmloanall.piriodicity)[0].ins_desc,
            instl_no: acc.tmloanall.instl_no,
            // recov_type: acc.tddeftrans.particulars == 'M' ? 'M' : 'A',
            recov_type: this.td.recov_type.value,

            intt_recov_dt: Utils.convertStringToDt(acc.tmloanall.last_intt_calc_dt.toString().substr(0, 10)),
            // paid_amount:acc.tmloanall.disb_amt,
            intt_till_dt: acc.tmloanall.last_intt_calc_dt ? Utils.convertStringToDt(acc.tmloanall.last_intt_calc_dt.toString().substr(0, 10)) : this.datePipe.transform(dt, 'dd/MM/yyyy hh:mm:ss'),
            // intt_till_dt: Utils.convertStringToDt(acc.tmloanall.last_intt_calc_dt.toString().substr(0, 10)),
          });
          console.log(acc.tmloanall.last_intt_calc_dt)
          this.sancdtls = acc.tmlaonsanctiondtls;
          this.sancdtls.forEach(x => x.draw_limit = x.sanc_amt - acc.tmloanall.curr_prn);
          // for (let x = 0; x < acc.tmlaonsanctiondtls.length; x++) {
          //   this.sancdtls = this.sancDetails.get('sancdtls') as FormArray;
          //   this.sancdtls.push(this.frmBldr.group({
          //     'sector':  acc.tmlaonsanctiondtls[x].sector_desc,
          //     'activity': acc.tmlaonsanctiondtls[x].activity_desc,
          //     'sanc_amt':acc.tmlaonsanctiondtls[x].sanc_amt,
          //     'draw_amt':acc.tmlaonsanctiondtls[x].sanc_amt}));
          // }
          this.f.oprn_cd.enable();
        }
        this.isLoading = false;
      },
      err => {

        this.f.oprn_cd.disable(); this.isLoading = false;
        console.log(err);
        this.msg.sendCommonTmLoanAll(null);
      }
    );

  }
  public onAccountNumTabOff(): void {
    
    if (this.checkUnaprovedTransactionExixts(this.loanID, Number(this.f.acc_type_cd.value))) {
      const tdDepTrans = new td_def_trans_trf();
    tdDepTrans.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    tdDepTrans.trans_type = 'L';
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', tdDepTrans).subscribe(
      res => {
        console.log(res)
        this.unApprovedTransactionLst = res;
        // debugger;
        // this.GetCustomer();
        // debugger;
      
      this.unapprovedTrans = this.unApprovedTransactionLst.filter(e => e.acc_num
        === this.f.acct_num.value.toString() && e.acc_type_cd === Number(this.f.acc_type_cd.value));
      this.modalRef = this.modalService.show(this.contentbatch, this.config);
    },
    err => { this.isLoading = false; }
  );
      // this.HandleMessage(true, MessageType.Error,
      //  'Un-approved Transaction already exists for the Account ' + this.f.acct_num.value);
      const td_deftranstrf: td_def_trans_trf[] = [];
      this.td_deftranstrfList = td_deftranstrf;
      const temp_deftranstrf = new td_def_trans_trf();
      this.td_deftranstrfList.push(temp_deftranstrf);
      this.tm_denominationList = [];
      this.denominationGrandTotal = 0;
      this.transferGrandTotal = 0;
      this.TrfTotAmt = 0;
      this.disableOperation = false; //marker
      this.f.oprn_cd.disable();
      this.takeDataForCancel()  //marker
      // this.tdDefTransFrm.reset();
      // this.accDtlsFrm.reset();
      // this.showTransactionDtl = false;
      // this.disableOperation = true;


      // return;
    }
    else {
      this.f.oprn_cd.enable();
      this.f.oprn_cd.reset() //marker
      console.log(this.f.oprn_cd.value)
      this.disableOperation = true;
      this.showTranferType = true;
      this.isDelete = false;
      // console.log('onAccountNumTabOff -' + this.f.acct_num.value);
      this.isLoading = true;
      this.showMsg = null;
      const acc1 = new tm_loan_all();
      let acc = new LoanOpenDM();
      acc1.loan_id = '' + this.f.acct_num.value;
      acc1.brn_cd = this.sys.BranchCode;
      acc1.acc_cd = this.f.acc_type_cd.value;
      this.svc.addUpdDel<any>('Loan/GetLoanData', acc1).subscribe(
        res => {
          ////////debugger;
          acc = res;
          this.acc2 = res;
          this.GetCustomer();
          this.CurrentDemand();
          debugger
          this.strtDt = acc.tmloanall.instl_start_dt
          this.currRt = acc.tmloanall.curr_intt_rate
          this.ovdRt = acc.tmloanall.ovd_intt_rate
          this.instl_no = acc.tmloanall.instl_no
          this.perVal = acc.tmloanall.piriodicity
          this.currPrn = acc.tmloanall.curr_prn
          this.ovdPrn = acc.tmloanall.ovd_prn
          this.currIntt = acc.tmloanall.curr_intt
          this.ovdIntt = acc.tmloanall.ovd_intt
          this.inttTillDt = acc.tmloanall.last_intt_calc_dt
          this.aCD=acc.tmloanall.acc_cd
          this.ln_id=Number(acc.tmloanall.loan_id)
          this.acDesc=this.AcctTypes.filter(e=>e.acc_type_cd==this.aCD)[0].acc_type_desc
          debugger
          console.log(acc)
          ////debugger
          if (undefined === acc || acc.tmloanall.loan_id == null) {
            this.accTransFrm.patchValue({
              acct_num: ''
            });
            this.HandleMessage(true, MessageType.Error,
              'Loan ID' + this.f.acct_num.value + ' is not Valid/Present/Account Type doesn\'t match.');
            this.msg.sendCommonTmLoanAll(null);
          } else {
            if (null !== acc.tmloanall.approval_status
              && acc.tmloanall.approval_status.toLowerCase() === 'u') {
              this.HandleMessage(true, MessageType.Error,
                'Loan ' + this.f.acct_num.value + ' is not approved, please approve before transaction.');
              this.msg.sendCommonTmLoanAll(null);
              this.isLoading = false;
              this.onResetClick();
              return;
            }
            this.joinHold=[];
          for (let i = 0; i <= res.tdaccholder.length-1; i++) {
          console.log(res.tdaccholder);
          
        this.joinHold.push(res.tdaccholder.length==0?'':res.tdaccholder[i].acc_holder)
        console.log(this.joinHold);
        }
            this.accTransFrm.patchValue({
              oprn_cd: '',
              instl_start_dt: acc.tmloanall.instl_start_dt
            });
            const td_deftranstrf: td_def_trans_trf[] = [];
            this.td_deftranstrfList = td_deftranstrf;
            const temp_deftranstrf = new td_def_trans_trf();
            this.td_deftranstrfList.push(temp_deftranstrf);
            this.tm_denominationList = [];
            this.denominationGrandTotal = 0;
            this.transferGrandTotal = 0;
            this.TrfTotAmt = 0;
            // const temp_denomination = new tm_denomination_trans();
            // temp_denomination.brn_cd = localStorage.getItem('__brnCd');
            // temp_denomination.trans_dt = this.sys.CurrentDate;
            // this.tm_denominationList.push(temp_denomination);
            // this.tdDefTransFrm.reset();
            // this.accDtlsFrm.reset();
            this.showTransactionDtl = false;
            this.disableOperation = false;
            this.accNoEnteredForTransaction = acc.tmloanall;
            var dt = this.sys.CurrentDate
            dt.setDate(dt.getDate() - 1)
            console.log(acc.tmloanall.penal_intt);
            // debugger;
            console.log(this.datePipe.transform(dt, 'dd/MM/yyyy hh:mm:ss'))
            this.accDtlsFrm.patchValue({
              cust_name: acc.tmloanall.cust_name,
              intt_recev: acc.tmloanall.curr_intt + acc.tmloanall.ovd_intt + acc.tmloanall.penal_intt,
              curr_principal: acc.tmloanall.curr_prn,
              curr_intt: acc.tmloanall.curr_intt,
              curr_intt_rate: acc.tmloanall.curr_intt_rate,
              ovd_principal: acc.tmloanall.ovd_prn,
              ovd_intt: acc.tmloanall.ovd_intt,
              ovd_intt_rate: acc.tmloanall.ovd_intt_rate,
              // 
              principal:  acc.tmloanall.curr_prn + acc.tmloanall.ovd_prn ,
              total_due: acc.tmloanall.curr_intt + acc.tmloanall.ovd_intt + acc.tmloanall.curr_prn + acc.tmloanall.ovd_prn + acc.tmloanall.penal_intt,
              disb_amt: acc.tmloanall.disb_amt,
              disb_dt: acc.tmloanall.disb_dt,
              penal_intt: acc.tmloanall.penal_intt

            });
            // var dt=Utils.convertStringToDt(acc.tmloanall.last_intt_calc_dt.toString())
            var dt = this.sys.CurrentDate
            dt.setDate(dt.getDate() - 1)
            console.log(this.datePipe.transform(dt, 'dd/MM/yyyy hh:mm:ss'))
            console.log(this.td.ovd_prn_recov.value + " " + this.td.curr_prn_recov.value)
            this.msg.sendCommonTmLoanAll(acc.tmloanall);
            console.log(acc.tmloanall);
            this.isLoading = false;
            debugger
            this.tdDefTransFrm.patchValue({
              acc_num: acc.tmloanall.loan_id,
              acc_type_cd: acc.tmloanall.acc_cd,
              curr_intt_rate: acc.tmloanall.curr_intt_rate,
              ovd_intt_rate: acc.tmloanall.ovd_intt_rate,
              instl_start_dt: acc.tmloanall.instl_start_dt.toString().substr(0, 10),
              periodicity: this.installmenttypeList.filter(x => x.desc_type === acc.tmloanall.piriodicity)[0].ins_desc,
              instl_no: acc.tmloanall.instl_no,
              recov_type: 'A',
              intt_recov_dt: Utils.convertStringToDt(acc.tmloanall.last_intt_calc_dt.toString().substr(0, 10)),
              // paid_amount:acc.tmloanall.disb_amt,
              // intt_till_dt: Utils.convertStringToDt(acc.tmloanall.last_intt_calc_dt.toString().substr(0, 10)),
              intt_till_dt: acc.tmloanall.last_intt_calc_dt ? Utils.convertStringToDt(acc.tmloanall.last_intt_calc_dt.toString().substr(0, 10)) : this.datePipe.transform(dt, 'dd/MM/yyyy hh:mm:ss'),
            });
            // var dt=this.sys.CurrentDate
            // dt.setDate(dt.getDate()-1)
            // // console.log(dt.setDate(dt.getDate()-1))
            // // console.log(dt)
            // console.log(this.c.transform(dt,'dd/MM/yyyy hh:mm:ss'))
            debugger
            this.sancdtls = acc.tmlaonsanctiondtls;
            this.sancdtls.forEach(x => x.draw_limit = x.sanc_amt - acc.tmloanall.curr_prn);
            // for (let x = 0; x < acc.tmlaonsanctiondtls.length; x++) {
            //   this.sancdtls = this.sancDetails.get('sancdtls') as FormArray;
            //   this.sancdtls.push(this.frmBldr.group({
            //     'sector':  acc.tmlaonsanctiondtls[x].sector_desc,
            //     'activity': acc.tmlaonsanctiondtls[x].activity_desc,
            //     'sanc_amt':acc.tmlaonsanctiondtls[x].sanc_amt,
            //     'draw_amt':acc.tmlaonsanctiondtls[x].sanc_amt}));
            // }
            this.f.oprn_cd.enable();
          }
          
        },
        err => {

          this.f.oprn_cd.disable(); this.isLoading = false;
          console.log(err);
          this.msg.sendCommonTmLoanAll(null);
        }
      );
    }
  }

  /* method fires on operation type change */
  public onOperationTypeChange(): void {
    this.HandleMessage(false);
    this.tdDefTransFrm.reset()
    this.editDeleteMode = false;
    this.showTranferType = true;
    this.hideOnClose = false;
    this.showTransactionDtl = true;
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    this.transType = new DynamicSelect();
    // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'disbursement') {
    //   console.log(this.strtDt)
    //   ////debugger
    //   this.transType.key = 'B';
    //   this.transType.Description = 'Disbursement';
    //   this.tdDefTransFrm.patchValue({
    //     acc_num: this.loanID,
    //     acc_cd: this.accCD,
    //     trans_type: this.transType.Description,
    //     trans_type_key: this.transType.key,
    //     share: 0,
    //     comm: 0,
    //     svcchrg: 0,
    //     saleform: 0,
    //     insurence: 0,
    //     instl_start_dt: this.strtDt.substr(0, 10),
    //     curr_intt_rate: this.currRt,
    //     ovd_intt_rate: this.ovdRt,
    //     instl_no: this.instl_no,
    //     periodicity: this.installmenttypeList.filter(x => x.desc_type === this.perVal)[0].ins_desc,

    //   });
    //   this.showTransMode = true;
    //   this.isDisburs = true;
    //   this.isRecovery = false;
    //   this.showInstrumentDtl = false;
    //   this.showRemarks = false;

    //   // this.td.trf_type.value !== '';
    // } 
   if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'recovery') {
      this.isOpenToDp = false;
      // this.td.intt_recov_dt.setValue(this.lFinYearDt)
      this.td.ongoing_unit_no.setValue(0);
      this.td.intt_till_dt = this.inttTillDt.substr(0,10);
      this.showRemarks = false;
      this.td.curr_prn_recov.disable();
      this.td.curr_intt_recov.disable();
      this.td.ovd_prn_recov.disable();
      this.td.ovd_intt_recov.disable();
      this.td.amount.setValue('');
      // this.td.curr_prn_recov.setValue('');
      // this.td.curr_intt_recov.setValue('this.currIntt');
      // this.td.ovd_prn_recov.setValue(this.ovdPrn);
      // this.td.ovd_intt_recov.setValue(this.ovdIntt);
      this.td.penal_intt_recov.disable();
      this.td.adv_prn_recov.disable();
      this.showRemarks = false;
      // console.log(this.dayDiff(this.td.intt_recov_dt.value, this.td.intt_till_dt.value));
      this.transType.key = 'R';
      this.td.recov_type.setValue('A');
      this.td.recov_type.disable();
      this.transType.Description = 'Recovery';
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key,
        curr_intt_rate: this.currRt,
        ovd_intt_rate: this.ovdRt,
        // curr_prn_recov:this.currPrn,
        // curr_intt_recov:this.currIntt,
        // ovd_intt_recov:this.ovdIntt,
        // ovd_prn_recov:this.ovdPrn,
        intt_recov_dt: this.lFinYearDt,
        // intt_recov_dt: this.inttTillDt,
        // no_of_day: this.dayDiff(this.td.intt_recov_dt.value, this.td.intt_till_dt.value)

      });
      this.onRecoveryTillDateChng(this.td.intt_recov_dt.value)
      console.log(this.td.intt_recov_dt.value, this.td.intt_till_dt)
      debugger
      this.tdDefTransFrm.patchValue({
        no_of_day: this.dayDiff(this.td.intt_recov_dt.value, this.td.intt_till_dt)

      })
      debugger
      this.geteffectiveinttrt();
      this.isDisburs = false;
      this.isRecovery = true;
      this.td.trf_type.value !== '';
    }
  }


  onRecovTypeChange(): void {
    debugger;
    console.log(this.td.recov_type.value)
    const selectedRecovType = this.td.recov_type.value;
    if ('M' === selectedRecovType) {
      this.td.curr_prn_recov.enable();
      this.td.curr_intt_recov.enable();
      this.td.ovd_prn_recov.enable();
      this.td.ovd_intt_recov.enable();
      this.td.penal_intt_recov.enable();
      this.td.adv_prn_recov.enable();
      this.td.amount.setValue('');
      this.td.curr_prn_recov.setValue('');
      this.td.curr_intt_recov.setValue('');
      this.td.ovd_prn_recov.setValue('');
      this.td.ovd_intt_recov.setValue('');
      this.td.adv_prn_recov.setValue('');
      this.td.penal_intt_recov.setValue('')
      this.showRemarks = true;
    }
    else {
      this.td.curr_prn_recov.disable();
      this.td.curr_intt_recov.disable();
      this.td.ovd_prn_recov.disable();
      this.td.ovd_intt_recov.disable();
      this.td.amount.setValue('');
      // this.td.curr_prn_recov.setValue('');
      // this.td.curr_intt_recov.setValue('this.currIntt');
      // this.td.ovd_prn_recov.setValue(this.ovdPrn);
      // this.td.ovd_intt_recov.setValue(this.ovdIntt);
      this.td.penal_intt_recov.disable();
      this.td.adv_prn_recov.disable();
      this.showRemarks = false;
    }
  }

  onTransModeChange(): void {

    const selectedTransMode = this.td.trans_mode.value;
    if ('Q' === selectedTransMode) {
      // check if cheque facility is available or not
      if (this.accNoEnteredForTransaction.cheque_facility === 'N') {
        this.td.trans_mode.reset();
        alert('Account does not have cheque facility.');
        return;
      }
      this.showInstrumentDtl = true;
    } else {
      this.showInstrumentDtl = false;
    }
  }



  onTransTypeChange(): void {

    const accTypeCd = +this.f.acc_type_cd.value;
    if (accTypeCd !== 2
      && accTypeCd !== 3
      && accTypeCd !== 4
      && accTypeCd !== 5) {
      if (this.td.trf_type.value === 'C') {
        this.tdDefTransFrm.patchValue({
          paid_to: null,
          particulars: 'TO CASH '
        });
      } else {
        this.tdDefTransFrm.patchValue({
          paid_to: null,
          particulars: 'TO TRANSFER '
        });
      }
    }
      const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'recovery') 
      {
         
        if (this.td.trf_type.value === 'C') {
          this.tdDefTransFrm.patchValue({
            remarks_on_manual: 'BY CASH '
          });
        } else {
          this.tdDefTransFrm.patchValue({
            remarks_on_manual: 'BY TRANSFER '
          });
        }
      }
    

    if (this.td.trf_type.value === 'C') {
      this.addDenomination();
    }
  }

  private checkUnaprovedTransactionExixts(acc_num: string, acc_type_cd: number) {
    console.log(acc_num + " " + acc_type_cd,this.unApprovedTransactionLst)
    debugger;
    this.GetUnapprovedDepTrans();
    
    ////////debugger;
    // const unapprovedTrans = this.unApprovedTransactionLst.filter(e => e.acc_num
    //   === acc_num.toString() && e.acc_type_cd === acc_type_cd)[0];
    const unapprovedTrans = this.unApprovedTransactionLst.filter(e => e.acc_num
      == acc_num && e.acc_type_cd === acc_type_cd); 
    //  console.log(unapprovedTrans.length);
    //debugger;
    console.log(unapprovedTrans,this.unApprovedTransactionLst)
    if (undefined === unapprovedTrans || Object.keys(unapprovedTrans).length === 0) {
      return Object.keys(unapprovedTrans).length;
    }
    debugger;
    return Object.keys(unapprovedTrans).length;
  }

  onMiscChng(): void {
    if ((+this.td.amount.value) < 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be negative.');
      this.td.amount.setValue('');
      return;
    }
    const totmiscAmt = (+this.td.share.value) +
      (+this.td.comm.value) + (+this.td.svcchrg.value) +
      (+this.td.saleform.value) + (+this.td.insurence.value);
    if ((+this.td.amount.value) < totmiscAmt) {
      this.HandleMessage(true, MessageType.Error, 'Disbursement Amount can not be less than total  Misc. Charges.');
      this.td.amount.setValue('');
      return;
    }
    this.tdDefTransFrm.patchValue({
      paid_amount: ((+this.td.amount.value) - totmiscAmt)
    });
  }
  onAmtChng2(i:any){
    if ((+i.target.value) > (+this.fd.total_due.value)) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be greaterthan due amount');
      this.tdDefTransFrm.patchValue({
        no_of_day: 0,
        curr_prn_recov: '',
        curr_intt_recov: '',
        ovd_prn_recov: '',
        ovd_intt_recov: '',
        adv_prn_recov:'',
        penal_intt_recov:'',
        amount: ''
      });
      return;
    }
  }
  onAmtChng(): void {

    this.HandleMessage(false);
    
    if ((+this.td.amount.value) < 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be negative.');
      this.td.amount.setValue('');
      return;
    }
    // if (this.td.trans_type_key.value === 'R' && (+this.td.amount.value) >
    //   (Number(this.fd.curr_principal.value) +
    //     Number(this.fd.curr_intt.value) +
    //     Number(this.fd.ovd_principal.value) + Number(this.fd.ovd_intt.value))) {
    //   this.HandleMessage(true, MessageType.Error, 'Recovery Amount Can Not be greater Than Total Outstanding.');
    //   this.td.amount.setValue('');
    //   return;
    // } //to be changed
    ////////debugger;
    if (this.td.trans_type_key.value === 'B' &&
      (undefined !== this.sancdtls && this.sancdtls.length > 0) &&
      (+this.td.amount.value) >
      this.sancdtls.map(a => a.draw_limit).reduce(function (a, b) { return a + b; })
    ) {
      this.HandleMessage(true, MessageType.Error, 'Amount Exceeds Drawal Limit.');
      this.td.amount.setValue('');
      return;
    }
    if (this.td.trans_type_key.value === 'R') {
  
      this.PopulateRecoveryDetails(2);
    }
    else {
      this.onMiscChng();
    }

  }
  onRecoveryTillDateChng(ev: any): void {
    console.log(this.getInttDt(ev))
    console.log(this.inttTillDt)
    var dd=this.getInttDt(ev)
    // var dt1=this.c.transform(this.td.intt_recov_dt.value,'dd/MM/yyyy hh:mm:ss')
    var dt1 = this.datePipe.transform(dd, 'dd/MM/yyyy hh:mm:ss')
      this.i_n_dt=dt1;//partha
    var dt2 = this.inttTillDt
    debugger
    // console.log(dt1, dt2)
    // console.log(this.dayDiff(this.td.intt_recov_dt.value, this.td.intt_till_dt.value))
    if (this.td.trans_type_key.value === 'R') {

      // if (+this.td.amount.value > 0) {
      // if (this.dayDiff(this.td.intt_recov_dt.value, this.td.intt_till_dt.value) <= 0) {
      if (this.dayDiff(dt1, dt2) <= 0) {
        this.HandleMessage(true, MessageType.Error, 'Interest Already calculated upto ' + this.td.intt_till_dt.value);
        this.tdDefTransFrm.patchValue({
          no_of_day: 0,
          curr_prn_recov: '',
          curr_intt_recov: '',
          ovd_prn_recov: '',
          ovd_intt_recov: ''
        });
        return;
      }
      else {
        debugger
        const fyearlstfDT= localStorage.getItem('__lastDt');
        const lstfDT=this.convertDate(fyearlstfDT).toLocaleString();
        var dt = this.datePipe.transform(lstfDT, 'dd/MM/yyyy hh:mm:ss')
        console.log(this.dayDiff(dt1, dt))
        if(this.dayDiff(dt1 ,dt)>0){
          debugger
          this.HandleMessage(true, MessageType.Error, 'Interest can not be calculated after ' + fyearlstfDT);
        this.tdDefTransFrm.patchValue({
          intt_recov_dt:Utils.convertStringToDt(fyearlstfDT),
          no_of_day: 0,
          curr_prn_recov: '',
          curr_intt_recov: '',
          ovd_prn_recov: '',
          ovd_intt_recov: ''
        });
        return
        }
        console.log(dt1 + " " + dt2)
        this.PopulateRecoveryDetails(3);
        if (this.td.amount.value > 0){
         
          this.PopulateRecoveryDetails(2);

        }

        // this.geteffectiveinttrt();
        this.tdDefTransFrm.patchValue({
          // no_of_day: this.dayDiff(this.td.intt_recov_dt.value, this.td.intt_till_dt.value)
          no_of_day: this.dayDiff(dt1, dt2)
        });
      }
      // }
      // else {
      //   this.HandleMessage(true, MessageType.Error, 'Recovery amount can not be blank or negative');
      //   this.td.amount.setValue('');
      // }
    }
  }
  
  dayDiff(d1: any, d2: any) {
    debugger
    console.log(d1 + " " + d2)
    d1 = Utils.convertStringToDt(d1);
    d2 = Utils.convertStringToDt(d2);
    console.log(d1 + " " + d2)
    if (d2) {
      const diffDays = Math.floor((Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate())
        - Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate())) / (1000 * 60 * 60 * 24));
       console.log(diffDays)

      return diffDays;
    }
    debugger

  }
  PopulateRecoveryDetails(callval: any) {
    const tmDep = new p_loan_param();
    let inttRet = new p_loan_param();
    tmDep.loan_id = this.f.acct_num.value;
    tmDep.brn_cd = this.sys.BranchCode;
    tmDep.gs_user_id = this.sys.UserId;
    tmDep.ardb_cd = this.sys.ardbCD
    debugger

    if (callval == 2) {
      tmDep.curr_intt_rate = this.td.intt_rate.value == null ? this.td.curr_intt_rate.value : this.td.intt_rate.value;
      tmDep.recov_amt = this.td.amount.value;
    }
    tmDep.commit_roll_flag = callval;
    if(this.editDeleteMode){
      
      console.log(this.datePipe.transform(this.td.intt_recov_dt.value, 'dd/MM/yyyy hh:mm:ss'))
      tmDep.intt_dt =this.td.intt_recov_dt.value;
      // tmDep.intt_dt = this.td.intt_recov_dt.value.substr(0,10);
      debugger
    }
    else{
      tmDep.intt_dt = this.getInttDt(this.td.intt_recov_dt.value)
    }
    debugger
    console.log(tmDep.intt_dt + " " + this.tdDefTransFrm.controls.intt_recov_dt.value, this.td.amount.value)
    this.isLoading=true
    this.svc.addUpdDel<any>('Loan/CalculateLoanInterestYearend', tmDep).subscribe(
      res => {
        console.log(res)
        if (undefined !== res) {
          this.isLoading=false
          inttRet = res;
          this.inttRetForUpdate=res
          console.log(inttRet)
          // this.tdDefTransFrm.patchValue({
          //   curr_prn_recov: inttRet.curr_prn_recov,
          //   curr_intt_recov: inttRet.curr_intt_recov,
          //   ovd_prn_recov: inttRet.ovd_prn_recov,
          //   ovd_intt_recov: inttRet.ovd_prn_recov
          // });
          if (callval == 2 && this.td.recov_type.value != 'M') {
            this.tdDefTransFrm.patchValue({
              adv_prn_recov: inttRet.adv_prn_recov,
              penal_intt_recov: inttRet.penal_intt_recov,
              curr_prn_recov: inttRet.curr_prn_recov,
              curr_intt_recov: inttRet.curr_intt_recov,
              ovd_prn_recov: inttRet.ovd_prn_recov,
              ovd_intt_recov: inttRet.ovd_intt_recov

              // adv_prn_recov: (+inttRet.adv_prn_recov) - (+this.tdDefTransFrm.controls.adv_prn_recov),
              // penal_intt_recov: (+inttRet.penal_intt_recov) - (+this.tdDefTransFrm.controls.penal_intt_recov),
              // curr_prn_recov: (+inttRet.curr_prn_recov) - (+this.tdDefTransFrm.controls.curr_prn_recov),
              // curr_intt_recov: (+inttRet.curr_intt_recov) - (+this.tdDefTransFrm.controls.curr_intt_recov),
              // ovd_prn_recov: (+inttRet.ovd_prn_recov) - (+this.tdDefTransFrm.controls.ovd_prn_recov),
              // ovd_intt_recov: (+inttRet.ovd_intt_recov) - (+this.tdDefTransFrm.controls.ovd_intt_recov)
            });
            console.log(this.tdDefTransFrm)
             this.accDtlsFrm.patchValue({
              // curr_principal: +this.fd.curr_principal.value -(+this.tdDefTransFrm.controls.curr_prn_recov.value) ,
              // penal_intt: +inttRet.penal_intt_recov - (+this.tdDefTransFrm.controls.penal_intt_recov.value),
              // intt_recev: (+inttRet.curr_intt_recov) + (+inttRet.ovd_intt_recov)+(+inttRet.penal_intt_recov)- (+this.tdDefTransFrm.controls.curr_intt_recov.value) - this.tdDefTransFrm.controls.ovd_intt_recov.value - this.tdDefTransFrm.controls.penal_intt_recov.value,
              // curr_intt: +inttRet.curr_intt_recov - (+this.tdDefTransFrm.controls.curr_intt_recov.value),
              // ovd_principal: inttRet.ovd_prn_recov -(+this.tdDefTransFrm.controls.ovd_prn_recov.value),
              // ovd_intt: inttRet.ovd_intt_recov - (+this.tdDefTransFrm.controls.ovd_intt_recov.value),
              // total_due: inttRet.curr_intt_recov + inttRet.ovd_intt_recov + inttRet.curr_prn_recov + inttRet.ovd_prn_recov + inttRet.penal_intt_recov
           
              // ovd_principal:+this.fd.ovd_principal.value-(+this.td.ovd_prn_recov.value),
              // curr_principal:+this.fd.curr_principal.value-(+this.td.curr_prn_recov.value),
              // curr_intt:+this.fd.curr_intt.value-(+this.td.curr_intt_recov.value),
              // ovd_intt:+this.fd.ovd_intt.value-(+this.td.ovd_intt_recov.value),
              // penal_intt:+this.fd.penal_intt.value-(+this.td.penal_intt_recov.value),
              // intt_recev: (+this.fd.curr_intt.value) + (+this.fd.ovd_intt.value)+(+this.fd.penal_intt.value)- (+this.tdDefTransFrm.controls.curr_intt_recov.value) - this.tdDefTransFrm.controls.ovd_intt_recov.value - this.tdDefTransFrm.controls.penal_intt_recov.value,
              // total_due: (+this.fd.curr_intt.value) + (+this.fd.ovd_intt.value)+(+this.fd.penal_intt.value)- (+this.tdDefTransFrm.controls.curr_intt_recov.value) - this.tdDefTransFrm.controls.ovd_intt_recov.value - this.tdDefTransFrm.controls.penal_intt_recov.value + (+this.fd.principal.value)
           
            });
            debugger;
          }
          else if (callval == 3) {
            // console.log(callval+" in 1294")
            console.log(this.tdDefTransFrm)
            console.log(this.td.recov_type)
            debugger;
            this.accDtlsFrm.patchValue({
              // curr_principal: inttRet.curr_prn_recov,
              // penal_intt: inttRet.penal_intt_recov,
              // intt_recev: inttRet.curr_intt_recov+inttRet.ovd_intt_recov+inttRet.penal_intt_recov,
              // curr_intt: inttRet.curr_intt_recov,
              // ovd_principal: inttRet.ovd_prn_recov,
              // ovd_intt: inttRet.ovd_intt_recov,
              // total_due: inttRet.curr_intt_recov + inttRet.ovd_intt_recov + inttRet.curr_prn_recov + inttRet.ovd_prn_recov + inttRet.penal_intt_recov
            });
          if(this.td.recov_type.value=='A'){
            debugger;
            if(!this.td.amount.value)
            { this.accDtlsFrm.patchValue({
              curr_principal: inttRet.curr_prn_recov - (+this.tdDefTransFrm.controls.curr_prn_recov.value),
              penal_intt: (+inttRet.penal_intt_recov)- (+this.tdDefTransFrm.controls.penal_intt_recov.value),
              // intt_recev: inttRet.curr_intt_recov+inttRet.ovd_intt_recov+inttRet.penal_intt_recov,
              curr_intt: (+inttRet.curr_intt_recov)- (+this.tdDefTransFrm.controls.curr_intt_recov.value),
              ovd_principal: (+inttRet.ovd_prn_recov) - (+this.tdDefTransFrm.controls.ovd_prn_recov.value),
              ovd_intt: (+inttRet.ovd_intt_recov) - (+this.tdDefTransFrm.controls.ovd_intt_recov.value),
              // total_due:this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value + this.fd.ovd_principal.value + this.fd.curr_principal.value -this.td.paid_amount.value,
              intt_recev:(+inttRet.curr_intt_recov) + (+inttRet.ovd_intt_recov) + (+inttRet.penal_intt_recov) - (+this.tdDefTransFrm.controls.curr_intt_recov.value) - (+this.tdDefTransFrm.controls.penal_intt_recov.value) -  (+this.tdDefTransFrm.controls.ovd_intt_recov.value),
              // curr_principal:(+inttRet.curr_prn.value)+this.td.paid_amount.value,
              // principal:(inttRet.principal)+this.td.paid_amount.value
              principal:(+inttRet.ovd_prn_recov) - (+this.tdDefTransFrm.controls.ovd_prn_recov.value) + inttRet.curr_prn_recov - (+this.tdDefTransFrm.controls.curr_prn_recov.value),
             
              total_due: (+inttRet.curr_intt_recov) + (+inttRet.ovd_intt_recov) + (+inttRet.penal_intt_recov) - (+this.tdDefTransFrm.controls.curr_intt_recov.value) - (+this.tdDefTransFrm.controls.penal_intt_recov.value) -  (+this.tdDefTransFrm.controls.ovd_intt_recov.value) + (+inttRet.ovd_prn_recov) - (+this.tdDefTransFrm.controls.ovd_prn_recov.value) + inttRet.curr_prn_recov - (+this.tdDefTransFrm.controls.curr_prn_recov.value)
            });
          }
          else{
            if(!this.editDeleteMode)
            {this.accDtlsFrm.patchValue({
              curr_principal: inttRet.curr_prn_recov,
              penal_intt: inttRet.penal_intt_recov,
              intt_recev: inttRet.curr_intt_recov+inttRet.ovd_intt_recov+inttRet.penal_intt_recov,
              curr_intt: inttRet.curr_intt_recov,
              ovd_principal: inttRet.ovd_prn_recov,
              ovd_intt: inttRet.ovd_intt_recov,
              total_due: inttRet.curr_intt_recov + inttRet.ovd_intt_recov + inttRet.curr_prn_recov + inttRet.ovd_prn_recov + inttRet.penal_intt_recov
            });
            
          }
          else{
            debugger;
            this.accDtlsFrm.patchValue({
              curr_principal: inttRet.curr_prn_recov - (+this.tdDefTransFrm.controls.curr_prn_recov.value),
              penal_intt: (+inttRet.penal_intt_recov)- (+this.tdDefTransFrm.controls.penal_intt_recov.value),
              // intt_recev: inttRet.curr_intt_recov+inttRet.ovd_intt_recov+inttRet.penal_intt_recov,
              curr_intt: (+inttRet.curr_intt_recov)- (+this.tdDefTransFrm.controls.curr_intt_recov.value),
              ovd_principal: (+inttRet.ovd_prn_recov) - (+this.tdDefTransFrm.controls.ovd_prn_recov.value),
              ovd_intt: (+inttRet.ovd_intt_recov) - (+this.tdDefTransFrm.controls.ovd_intt_recov.value),
              // total_due:this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value + this.fd.ovd_principal.value + this.fd.curr_principal.value -this.td.paid_amount.value,
              intt_recev:(+inttRet.curr_intt_recov) + (+inttRet.ovd_intt_recov) + (+inttRet.penal_intt_recov) - (+this.tdDefTransFrm.controls.curr_intt_recov.value) - (+this.tdDefTransFrm.controls.penal_intt_recov.value) -  (+this.tdDefTransFrm.controls.ovd_intt_recov.value),
              // curr_principal:(+inttRet.curr_prn.value)+this.td.paid_amount.value,
              // principal:(inttRet.principal)+this.td.paid_amount.value
              principal:(+inttRet.ovd_prn_recov) - (+this.tdDefTransFrm.controls.ovd_prn_recov.value) + inttRet.curr_prn_recov - (+this.tdDefTransFrm.controls.curr_prn_recov.value),
              total_due: (+inttRet.curr_intt_recov) + (+inttRet.ovd_intt_recov) + (+inttRet.penal_intt_recov) - (+this.tdDefTransFrm.controls.curr_intt_recov.value) - (+this.tdDefTransFrm.controls.penal_intt_recov.value) -  (+this.tdDefTransFrm.controls.ovd_intt_recov.value) + (+inttRet.ovd_prn_recov) - (+this.tdDefTransFrm.controls.ovd_prn_recov.value) + inttRet.curr_prn_recov - (+this.tdDefTransFrm.controls.curr_prn_recov.value)
             
              // total_due: (+inttRet.curr_intt_recov) + (+inttRet.ovd_intt_recov) + (+inttRet.penal_intt_recov) - (+this.tdDefTransFrm.controls.curr_intt_recov.value) - (+this.tdDefTransFrm.controls.penal_intt_recov.value) -  (+this.tdDefTransFrm.controls.ovd_intt_recov.value) + this.accDtlsFrm.controls.principal.value
            });
            debugger
            // this.editDeleteMode=false;
          }
          }
          }
          else{
            this.accDtlsFrm.patchValue({
              curr_principal: inttRet.curr_prn_recov - (+this.tdDefTransFrm.controls.curr_prn_recov.value),
              penal_intt: (+inttRet.penal_intt_recov)- (+this.tdDefTransFrm.controls.penal_intt_recov.value),
              // intt_recev: inttRet.curr_intt_recov+inttRet.ovd_intt_recov+inttRet.penal_intt_recov,
              curr_intt: (+inttRet.curr_intt_recov)- (+this.tdDefTransFrm.controls.curr_intt_recov.value),
              ovd_principal: (+inttRet.ovd_prn_recov) - (+this.tdDefTransFrm.controls.ovd_prn_recov.value),
              ovd_intt: (+inttRet.ovd_intt_recov) - (+this.tdDefTransFrm.controls.ovd_intt_recov.value),
              // total_due:this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value + this.fd.ovd_principal.value + this.fd.curr_principal.value -this.td.paid_amount.value,
              intt_recev:(+inttRet.curr_intt_recov) + (+inttRet.ovd_intt_recov) + (+inttRet.penal_intt_recov) - (+this.tdDefTransFrm.controls.curr_intt_recov.value) - (+this.tdDefTransFrm.controls.penal_intt_recov.value) -  (+this.tdDefTransFrm.controls.ovd_intt_recov.value),
              // curr_principal:(+inttRet.curr_prn.value)+this.td.paid_amount.value,
              principal:(inttRet.curr_prn_recov - (+this.tdDefTransFrm.controls.curr_prn_recov.value))+((+inttRet.ovd_prn_recov) - (+this.tdDefTransFrm.controls.ovd_prn_recov.value)),
              // total_due: (+this.fd.intt_recev.value) + (+this.fd.principal.value)
            });
            this.accDtlsFrm.controls.total_due.setValue((+this.fd.intt_recev.value) + (+this.fd.principal.value))
            debugger
          }
         
          
        }
        }
      },
      err => {
        this.isLoading = false; console.log(err);
        this.HandleMessage(true, MessageType.Error, 'Interest Can not be calculated, Try again later.');
      }
    );
  }
  getInttDt(dt:any){
    var dateStr = dt;
    var parts = dateStr.split("/");
    var formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);
    return formattedDate
  }
  geteffectiveinttrt(): void {
    debugger;
   
    const tmDep = new p_loan_param();
    let inttRet = 0;
    tmDep.loan_id = this.f.acct_num.value;
    tmDep.acc_type_cd = this.f.acc_type_cd.value;
    tmDep.intt_dt = this.getInttDt(this.td.intt_recov_dt.value);
    tmDep.ardb_cd = this.sys.ardbCD
    debugger
    this.svc.addUpdDel<any>('Loan/F_GET_EFF_INTT_RT', tmDep).subscribe(
      res => {
        console.log(res)
        if (undefined !== res) {
          inttRet = res;
          this.tdDefTransFrm.patchValue({
            intt_rate: inttRet
          });
          if (this.td.amount.value > 0)
            {
              debugger;
              this.PopulateRecoveryDetails(2);
            }
        }
      },
      err => {
        this.isLoading = false; console.log(err);
        this.HandleMessage(true, MessageType.Error, 'Effective Interest Rate calculation failed, Try again later.');
      }
    );
  }



  onSaveClick(): void {

    if ((+this.td.amount.value) <= 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be blank');
      return;
    }
    debugger
    if (this.td.trf_type.value === 'T' && (this.TrfTotAmt != (+this.td.amount.value))) {
      this.HandleMessage(true, MessageType.Error,
        `Transfer total amount ₹${this.TrfTotAmt}, ` +
        ` does not match with transaction amount ₹${this.td.amount.value}`);
      return;
    }
    // console.log(this.checkUnaprovedTransactionExixts(this.td.acc_num.value, this.td.acc_cd.value),this.td.curr_prn_recov.value,this.td.ovd_prn_recov.value)
    // //debugger;
    if (this.editDeleteMode) {
      if (this.checkUnaprovedTransactionExixts(this.loanID, this.td.acc_cd.value) > 1) {
        this.HandleMessage(true, MessageType.Error,
          'Unapproved Transaction already exists for the Account ' + this.td.acc_num.value);
        return;
      }

    }
    else {
      if (this.checkUnaprovedTransactionExixts(this.loanID, this.td.acc_cd.value) > 0) {
        this.HandleMessage(true, MessageType.Error,
          'Unapproved Transaction already exists for the Account ' + this.td.acc_num.value);
        return;
      }
    }

    if (undefined === this.td.trf_type.value
      || null === this.td.trf_type.value
      || this.td.trf_type.value === '') {
      this.HandleMessage(true, MessageType.Error, 'Please choose Transaction type.');
      return;
    }
      
    if(this.isRecovery && this.td.recov_type.value=='M'){
      if(!this.td.remarks_on_manual.value){
      this.HandleMessage(true, MessageType.Error, 'Please provide remarks.');
      return;
      }
    }

    // if (this.td.trf_type.value === 'C' && this.denominationGrandTotal !== (+this.td.amount.value)) {
    //   this.HandleMessage(true, MessageType.Error,
    //     `Denomination total amount ₹${this.denominationGrandTotal}, ` +
    //     ` do not match with transaction amount ₹${this.td.amount.value}`);
    //   return;
    // }
if(this.isRecovery){
   this.recov_sum=0;
   this.recov_sum=Number(this.td.curr_prn_recov.value?this.td.curr_prn_recov.value:0) +
    Number(this.td.ovd_prn_recov.value?this.td.ovd_prn_recov.value:0) + 
    Number(this.td.adv_prn_recov.value?this.td.adv_prn_recov.value:0) + 
    Number(this.td.curr_intt_recov.value?this.td.curr_intt_recov.value:0) + 
    Number(this.td.ovd_intt_recov.value?this.td.ovd_intt_recov.value:0) + 
    Number(this.td.penal_intt_recov.value?this.td.penal_intt_recov.value:0)+
    Number(this.td.ongoing_unit_no.value?this.td.ongoing_unit_no.value:0)
   console.log(this.recov_sum)
   debugger; 
   if(this.td.ongoing_unit_no.value>0){
    if (this.td.trf_type.value === 'T' && this.TrfTotAmt !== ((+this.td.amount.value)+(+this.td.ongoing_unit_no.value)) && this.TrfTotAmt !=this.recov_sum) {
      this.HandleMessage(true, MessageType.Error,
        `Transfer total amount ₹${this.TrfTotAmt}, ` +
        ` does not match with transaction amount ₹${(+this.td.amount.value)+(+this.td.ongoing_unit_no.value)}`);
      return;
    }
    if (this.td.trf_type.value === 'C' && ((+this.td.amount.value)+(+this.td.ongoing_unit_no.value)) !=this.recov_sum) {
      this.HandleMessage(true, MessageType.Error,
        `Transfer total amount ₹${this.recov_sum}, ` +
        ` does not match with transaction amount ₹${(+this.td.amount.value)+(+this.td.ongoing_unit_no.value)}`);
      return;
    }
   }
   else{
    if (this.td.trf_type.value === 'T' && this.TrfTotAmt !== (+this.td.amount.value) && this.TrfTotAmt !=this.recov_sum) {
      this.HandleMessage(true, MessageType.Error,
        `Transfer total amount ₹${this.TrfTotAmt}, ` +
        ` does not match with transaction amount ₹${this.td.amount.value}`);
      return;
    }
    if (this.td.trf_type.value === 'C' && this.td.amount.value !=this.recov_sum) {
      this.HandleMessage(true, MessageType.Error,
        `Transfer total amount ₹${this.recov_sum}, ` +
        ` does not match with transaction amount ₹${this.td.amount.value}`);
      return;
    }
   }
}
if(this.isDisburs){
  if (this.td.trf_type.value === 'T' && this.TrfTotAmt !== (+this.td.paid_amount.value)) {
    this.HandleMessage(true, MessageType.Error,
      `Transfer total amount ₹${this.TrfTotAmt}, ` +
      ` doesn\'t match with transaction amount ₹${this.td.paid_amount.value}`);
    return;
  }
}
this.t_a=null;
this.c_p=null;
this.c_i=null;
this.o_p=null;
this.o_i=null;
this.a_p=null;
this.p_i=null;
this.l_ch=null

// this.i_n_dt=this.td.intt_recov_dt.value;
this.i_n_dt=null;

// debugger
console.log(this.td.recov_type.value)
debugger;
    if (this.td.recov_type.value == 'A') {
      const tmDep = new p_loan_param();
      let inttRet = new p_loan_param();
      tmDep.loan_id = this.f.acct_num.value;
      tmDep.brn_cd = this.sys.BranchCode;
      tmDep.gs_user_id = this.sys.UserId;
      // console.log("this.td.intt_rate= " + this.td.intt_rate.value+" and this.td.curr_intt_rate="+this.td.curr_intt_rate.value)
      // //////debugger;
      // tmDep.curr_intt_rate = this.td.intt_rate.value == null ? this.td.curr_intt_rate.value : this.td.intt_rate.value;
      tmDep.curr_intt_rate = !this.td.intt_rate.value ? this.td.curr_intt_rate.value : this.td.intt_rate.value;
      console.log(tmDep.curr_intt_rate);
      // //////debugger;
      tmDep.recov_amt = this.td.amount.value;

      tmDep.commit_roll_flag = 2;
      if(this.editDeleteMode){
        tmDep.intt_dt = this.td.intt_recov_dt.value;
      }else{
        tmDep.intt_dt = this.getInttDt(this.td.intt_recov_dt.value);
      }
      tmDep.ardb_cd = this.sys.ardbCD
      this.isLoading = true;
      this.svc.addUpdDel<any>('Loan/CalculateLoanInterestYearend', tmDep).subscribe(
        res => {

          if (undefined !== res) {
            inttRet = res;
            this.isLoading=false
            this.inttRetForUpdate=inttRet
            console.log(res)
            this.tdDefTransFrm.patchValue({
              curr_prn_recov: inttRet?.curr_prn_recov,   //marker to add ? subject to change
              curr_intt_recov: inttRet?.curr_intt_recov,
              ovd_prn_recov: inttRet?.ovd_prn_recov,
              ovd_intt_recov: inttRet?.ovd_intt_recov
            });
            /////////////////////
            //this.isLoading = true;
            const saveTransaction = new LoanOpenDM();
            const tdDefTrans = this.mappTddefTransFromFrm();
            saveTransaction.tddeftrans = tdDefTrans;
            if (this.td.trf_type.value === 'C') {
              saveTransaction.tmdenominationtrans = this.tm_denominationList;
              for (let i = 0; i < saveTransaction.tmdenominationtrans.length; i++) {
                // ////////debugger;
                if (this.td.trans_cd.value > 0) {
                  saveTransaction.tmdenominationtrans[i].trans_cd = this.td.trans_cd.value;
                }
              }
            } else if (this.td.trf_type.value === 'T') {
              let i = 0;
              this.td_deftranstrfList.forEach(e => {
                const tdDefTransAndTranfer = this.mappTddefTransAndTransFrFromFrm();
                if (e.trans_type === 'cust_acc') {
                  tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
                  tdDefTransAndTranfer.acc_num = e.cust_acc_number;
                  tdDefTransAndTranfer.acc_name = e.cust_name;
                  tdDefTransAndTranfer.instrument_num = e.instrument_num;
                  tdDefTransAndTranfer.acc_cd = e.acc_cd;
                  tdDefTransAndTranfer.remarks = 'D';
                  tdDefTransAndTranfer.disb_id = ++i;
                } else {
                  tdDefTransAndTranfer.acc_type_cd = +e.gl_acc_code;
                  tdDefTransAndTranfer.acc_num = '0000';
                  tdDefTransAndTranfer.acc_name = e.gl_acc_desc;
                  tdDefTransAndTranfer.instrument_num = e.instrument_num;
                  tdDefTransAndTranfer.acc_cd = +e.gl_acc_code;
                  tdDefTransAndTranfer.remarks = 'X';
                  tdDefTransAndTranfer.disb_id = ++i;
                }
                tdDefTransAndTranfer.amount = e.amount;
                ////////debugger;
                saveTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
                
                
              });

              const tmTrnsfr = new tm_transfer();
              if (this.td.trans_cd.value > 0) {
                tmTrnsfr.trans_cd = this.td.trans_cd.value;
              }
              tmTrnsfr.brn_cd = this.sys.BranchCode;
              tmTrnsfr.trf_dt = this.sys.CurrentDate;
              tmTrnsfr.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
              tmTrnsfr.approval_status = 'U';
              saveTransaction.tmtransfer.push(tmTrnsfr);
              
              
            }
            ////////debugger;
          
            if (this.td.trans_cd.value > 0) {
              this.t_a=(saveTransaction.tddeftrans?.amount)+(saveTransaction.tddeftrans?.ongoing_unit_no);
                // this.s_a=saveTransaction.tddeftrans?.share_amt;
                this.c_p=saveTransaction.tddeftrans?.curr_prn_recov;
                this.c_i=saveTransaction.tddeftrans?.curr_intt_recov;
                this.o_p=saveTransaction.tddeftrans?.ovd_prn_recov;
                this.o_i=saveTransaction.tddeftrans?.ovd_intt_recov;
                this.a_p=saveTransaction.tddeftrans?.adv_prn_recov;
                this.p_i=saveTransaction.tddeftrans?.penal_intt_recov;
                // this.i_n_dt=this.td.intt_recov_dt.value;
                this.i_n_dt=this.td.intt_recov_dt.value;
                this.l_ch=saveTransaction.tddeftrans?.ongoing_unit_no;
              debugger
              this.svc.addUpdDel<LoanOpenDM>('Common/UpdateTransactionDetails', saveTransaction).subscribe(
                res => {
                  this.tdDefTransFrm.disable();
                  this.tdDefTransFrm.disable();
                  this.td.trf_type.disable();
                  this.td.amount.disable()
                  this.disableOnSaveEdit=true;
                  if(this.isDisburs){
                    this.td.trans_mode.disable();
                    this.td.instrument_num.disable();
                    this.td.instrument_dt.disable();
                    this.td.share.disable();
                    this.td.comm.disable();
                    this.td.svcchrg.disable();
                    this.td.saleform.disable();
                    this.td.insurence.disable()
                  }
                  if(this.isRecovery){
                    this.td.recov_type.disable();
                    this.td.intt_recov_dt.disable();
                    this.td.remarks_on_manual.disable();
                  }
                  // marker 
                  if(this.isRecovery){
                    const tmDep = new p_loan_param();
                   let inttRet = new p_loan_param();
                   tmDep.loan_id = this.f.acct_num.value;
                   tmDep.brn_cd = this.sys.BranchCode;
                   tmDep.gs_user_id = this.sys.UserId;
                   tmDep.ardb_cd = this.sys.ardbCD
                   debugger
                   
                 
                   tmDep.commit_roll_flag = 3;
                   if(this.editDeleteMode){
                    tmDep.intt_dt = this.td.intt_recov_dt.value;
                  }else{
                    tmDep.intt_dt = this.getInttDt(this.td.intt_recov_dt.value);
                  }
                    // tmDep.intt_dt = this.getInttDt(this.td.intt_recov_dt.value);
                  this.isLoading=true
                  this.svc.addUpdDel<any>('Loan/CalculateLoanInterestYearend', tmDep).subscribe(
                     res => {
                       console.log(res)
                       debugger;
                       if (undefined !== res) {
                         inttRet = res;
                         this.isLoading=false
                         this.inttRetForUpdate=res
     
                 this.accDtlsFrm.patchValue({
                   ovd_principal:+this.inttRetForUpdate.ovd_prn_recov-(+this.td.ovd_prn_recov.value),
                   curr_principal:+this.inttRetForUpdate.curr_prn_recov-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value),
                   curr_intt:+this.inttRetForUpdate.curr_intt_recov-(+this.td.curr_intt_recov.value),
                   ovd_intt:+this.inttRetForUpdate.ovd_intt_recov-(+this.td.ovd_intt_recov.value),
                   penal_intt:+this.inttRetForUpdate.penal_intt_recov-(+this.td.penal_intt_recov.value),
                   intt_recev:(+this.inttRetForUpdate.curr_intt_recov) + (+this.inttRetForUpdate.ovd_intt_recov) + (+this.inttRetForUpdate.penal_intt_recov) - this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value ,
                   principal:+this.inttRetForUpdate.curr_prn_recov-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value) + this.inttRetForUpdate.ovd_prn_recov-(+this.td.ovd_prn_recov.value),
                   total_due: (+this.inttRetForUpdate.curr_intt_recov) + (+this.inttRetForUpdate.ovd_intt_recov) + (+this.inttRetForUpdate.penal_intt_recov) - this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value + +this.inttRetForUpdate.curr_prn_recov-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value) + this.inttRetForUpdate.ovd_prn_recov-(+this.td.ovd_prn_recov.value) ,
                 
                  })
               }
               })
               }
               if(this.isDisburs){
                
                 this.accDtlsFrm.patchValue({
                   // adv_prn_recov: (+this.fd.adv_prn_recov.value) - (+this.td.adv_prn_recov.value),
                   // penal_intt_recov: (+this.fd.penal_intt_recov.value) - (+this.td.penal_intt_recov.value),
                   // curr_prn_recov: (+this.fd.curr_prn_recov.value) - (+this.td.curr_prn_recov.value),
                   // curr_intt_recov: (+this.fd.curr_intt_recov.value) - (+this.td.curr_intt_recov.value),
                   // ovd_prn_recov: (+this.fd.ovd_prn_recov.value) - (+this.td.ovd_prn_recov.value),
                   // ovd_intt_recov: (+this.fd.ovd_intt_recov.value) - (+this.td.ovd_intt_recov.value)
                   curr_principal:this.fdCurrPrn+this.td.paid_amount.value,
                   principal:this.fdPrincipal+this.td.paid_amount.value,
                   //total_due: (+this.inttRetForUpdate.curr_intt_recov) + (+this.inttRetForUpdate.ovd_intt_recov) + (+this.inttRetForUpdate.penal_intt_recov) - this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value + +this.inttRetForUpdate.curr_prn_recov-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value) + this.inttRetForUpdate.ovd_prn_recov-(+this.td.ovd_prn_recov.value) ,
                   total_due: this.fdCurrIntt + this.fdOvdIntt + this.fdPenalIntt + this.fdOvdprn + this.fdCurrPrn + this.td.paid_amount.value,

     
                 })
                }
                  // marker
                  ////////debugger;
                  // this.unApprovedTransactionLst.push(tdDefTrans);
                  const loanId = this.td.acc_num.value;
                  this.HandleMessage(true, MessageType.Sucess, `Transaction for Loan Id ${loanId}, updated successfully !!!!`);
                  this.isLoading = false;
                   if(this.isRecovery){
                    if(this.sys.ardbCD=='1'){
                      this.modalRef = this.modalService.show(this.ContaiLoanChallan, { class: 'modal-xl' });
                    }
                    else{
                      this.modalRef = this.modalService.show(this.LoanChallan, { class: 'modal-sm' });
                    
                 }
                  }
                  // this.onResetClick();
                  // this.tdDefTransFrm.reset();
                  // this.accTransFrm.reset();
                },
                err => {
                  this.isLoading = false;
                  this.HandleMessage(true, MessageType.Error, 'Update Failed !!!!');
                  console.error('Error on onSaveClick' + JSON.stringify(err));
                }
              );
            }
            else {
              this.t_a=(saveTransaction.tddeftrans?.amount)+(saveTransaction.tddeftrans?.ongoing_unit_no);
                // this.s_a=saveTransaction.tddeftrans?.share_amt;
                this.c_p=saveTransaction.tddeftrans?.curr_prn_recov;
                this.c_i=saveTransaction.tddeftrans?.curr_intt_recov;
                this.o_p=saveTransaction.tddeftrans?.ovd_prn_recov;
                this.o_i=saveTransaction.tddeftrans?.ovd_intt_recov;
                this.a_p=saveTransaction.tddeftrans?.adv_prn_recov;
                this.p_i=saveTransaction.tddeftrans?.penal_intt_recov;
                // this.i_n_dt=this.td.intt_recov_dt.value;
                this.i_n_dt=this.td.intt_recov_dt.value;
                this.l_ch=saveTransaction.tddeftrans?.ongoing_unit_no;
                
                // this.i_n_dt=saveTransaction.tddeftrans?.intt_till_dt
                debugger
                // this.i_n_dt=this.c.transform(this.i_n_dt, 'dd/MM/yyyy')
              debugger
              this.disableOnSaveEdit=true;
              // this.tdDefTransFrm.disable();
              this.td.trf_type.disable();
              this.trns_type=this.td.trf_type.value;
              // this.td.amount.disable()
              if(this.isDisburs){
                debugger;
                this.td.trans_mode.disable();
                this.td.instrument_num.disable();
                this.td.instrument_dt.disable();
                this.td.share.disable();
                this.td.comm.disable();
                this.td.svcchrg.disable();
                this.td.saleform.disable();
                this.td.insurence.disable()
              }
              if(this.isRecovery){
                this.td.recov_type.disable();
                this.td.intt_recov_dt.disable();
                this.td.remarks_on_manual.disable();
              }
              
              this.svc.addUpdDel<LoanOpenDM>('Loan/InsertLoanTransactionData', saveTransaction).subscribe(
                res => {
                  ////////debugger;
                  this.t_cd=+res
                  tdDefTrans.trans_cd = +res;
                  // console.log(JSON.stringify(tdDefTrans))
                  this.unApprovedTransactionLst.push(tdDefTrans);
                  console.log(this.unApprovedTransactionLst);
                  debugger;
                  if(this.isRecovery){
                    debugger;
                    this.outIntt=this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value - this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value
                    // this.outPrn=((+this.inttRetForUpdate.curr_prn_recov)-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value)) + ((+this.inttRetForUpdate.ovd_prn_recov)-(+this.td.ovd_prn_recov.value))
                    this.outPrn=(this.fd.ovd_principal.value-(+this.td.ovd_prn_recov.value))+(+this.fd.curr_principal.value-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value))
                    debugger;
                    this.accDtlsFrm.patchValue({
                      ovd_principal:+this.fd.ovd_principal.value-(+this.td.ovd_prn_recov.value),
                      curr_principal:+this.fd.curr_principal.value-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value),
                      curr_intt:+this.fd.curr_intt.value-(+this.td.curr_intt_recov.value),
                      ovd_intt:+this.fd.ovd_intt.value-(+this.td.ovd_intt_recov.value),
                      penal_intt:+this.fd.penal_intt.value-(+this.td.penal_intt_recov.value),
                      intt_recev:this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value - this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value,
                      principal:+this.inttRetForUpdate.curr_prn_recov-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value) + this.inttRetForUpdate.ovd_prn_recov-(+this.td.ovd_prn_recov.value),
                      total_due: this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value + this.fd.ovd_principal.value + this.fd.curr_principal.value - this.td.ovd_prn_recov.value - this.td.curr_prn_recov.value -this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value- (+this.td.adv_prn_recov.value),
                      })
                    this.accDtlsFrm.patchValue({
                      principal: this.fd.ovd_principal.value + this.fd.curr_principal.value
                    })
                    debugger
                  }
                  if(this.isDisburs){
                    this.accDtlsFrm.patchValue({
                      // adv_prn_recov: (+this.fd.adv_prn_recov.value) - (+this.td.adv_prn_recov.value),
                      // penal_intt_recov: (+this.fd.penal_intt_recov.value) - (+this.td.penal_intt_recov.value),
                      // curr_prn_recov: (+this.fd.curr_prn_recov.value) - (+this.td.curr_prn_recov.value),
                      // curr_intt_recov: (+this.fd.curr_intt_recov.value) - (+this.td.curr_intt_recov.value),
                      // ovd_prn_recov: (+this.fd.ovd_prn_recov.value) - (+this.td.ovd_prn_recov.value),
                      // ovd_intt_recov: (+this.fd.ovd_intt_recov.value) - (+this.td.ovd_intt_recov.value)
      
                    //  total_due: this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value + this.fd.ovd_principal.value + this.fd.curr_principal.value -  this.td.paid_amount.value,
                    curr_principal:this.fd.curr_principal.value+this.td.paid_amount.value,
                    principal:this.fd.principal.value+this.td.paid_amount.value,
                    total_due: this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value + this.fd.ovd_principal.value + this.fd.curr_principal.value +this.td.paid_amount.value,

                    })
                  }
                  // this.GetUnapprovedDepTrans()
                  this.HandleMessage(true, MessageType.Sucess, 'Saved successfully, your transaction code is: ' + res);
                  this.accDtlsFrm.patchValue({

                  })
                  // 
                  if(this.isRecovery){
                    if(this.sys.ardbCD=='1'||this.sys.ardbCD=='3'){
                      this.modalRef = this.modalService.show(this.ContaiLoanChallan, { class: 'modal-xl' });
                    }
                    else{
                      this.modalRef = this.modalService.show(this.LoanChallan, { class: 'modal-sm' });
                    }
                  }
               
                  //  
                  
                  this.tdDefTransFrm.patchValue({
                    trans_cd: res
                  });
                  this.isLoading = false;
                },
                err => {
                  this.isLoading = false;
                  this.HandleMessage(true, MessageType.Error, 'Save Failed !!!!');
                  console.error('Error on onSaveClick' + JSON.stringify(err));
                }
              );
            }
            ////////////////////

          }
        },
        err => {
          this.isLoading = false;
          this.isLoading = false; console.log(err);
          this.HandleMessage(true, MessageType.Error, 'Interest Can not be calculated, Try again later.');
        }
      );
    }
    else {
      // console.log(this.td.curr_prn_recov.value,this.td.curr_intt_recov.value,this.td.ovd_prn_recov.value,this.td.ovd_intt_recov.value)
      // //////debugger;
      if (this.td.curr_prn_recov.value && this.td.curr_intt_recov.value && this.td.ovd_prn_recov.value && this.td.ovd_intt_recov.value && (this.td.curr_prn_recov.value + this.td.curr_intt_recov.value + this.td.ovd_prn_recov.value + this.td.ovd_intt_recov.value <= 0)) {
        this.HandleMessage(true, MessageType.Error, 'Please input all recovery Amount');
        return;
      }
      console.log(this.td.curr_prn_recov.value,
        this.td.curr_intt_recov.value,
        this.td.ovd_prn_recov.value,
        this.td.ovd_intt_recov.value,
        this.td.penal_intt_recov.value,
        this.td.adv_prn_recov.value, this.td.amount.value)
        let tempSum = (Number(this.td.curr_prn_recov.value) +
        Number(this.td.curr_intt_recov.value) +
        Number(this.td.ovd_prn_recov.value) +
        Number(this.td.ovd_intt_recov.value) +
        Number(this.td.penal_intt_recov.value) +
        Number(this.td.adv_prn_recov.value))
      if (tempSum != this.td.amount.value && this.isRecovery) {

        this.HandleMessage(true, MessageType.Error,
          `Total amount ₹${tempSum}, ` +
          ` doesn\'t match with recovery amount ₹${this.td.amount.value}`);
        return;
      }
      /////////////////////
      this.isLoading = true;
      const saveTransaction = new LoanOpenDM();
      const tdDefTrans = this.mappTddefTransFromFrm();
      saveTransaction.tddeftrans = tdDefTrans;
      if (this.td.trf_type.value === 'C') {
        saveTransaction.tmdenominationtrans = this.tm_denominationList; //marker
        for (let i = 0; i < saveTransaction.tmdenominationtrans.length; i++) {
          ////////debugger;
          if (this.td.trans_cd.value > 0) {
            saveTransaction.tmdenominationtrans[i].trans_cd = this.td.trans_cd.value; //marker
          }
        }
      } else if (this.td.trf_type.value === 'T') {
        let i = 0;
        this.td_deftranstrfList.forEach(e => {
          const tdDefTransAndTranfer = this.mappTddefTransAndTransFrFromFrm();
          if (e.trans_type === 'cust_acc') {
            tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
            tdDefTransAndTranfer.acc_num = e.cust_acc_number;
            tdDefTransAndTranfer.acc_name = e.cust_name;
            tdDefTransAndTranfer.instrument_num = e.instrument_num;
            tdDefTransAndTranfer.acc_cd = e.acc_cd;
            tdDefTransAndTranfer.remarks = 'D';
            tdDefTransAndTranfer.disb_id = ++i;
          } else {
            tdDefTransAndTranfer.acc_type_cd = +e.gl_acc_code;
            tdDefTransAndTranfer.acc_num = '0000';
            tdDefTransAndTranfer.acc_name = e.gl_acc_desc;
            tdDefTransAndTranfer.instrument_num = e.instrument_num;
            tdDefTransAndTranfer.acc_cd = +e.gl_acc_code;
            tdDefTransAndTranfer.remarks = 'X';
            tdDefTransAndTranfer.disb_id = ++i;
          }
          tdDefTransAndTranfer.amount = e.amount;
          ////////debugger;
          saveTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
        });

        const tmTrnsfr = new tm_transfer();
        if (this.td.trans_cd.value > 0) {
          tmTrnsfr.trans_cd = this.td.trans_cd.value;
        }
        tmTrnsfr.brn_cd = this.sys.BranchCode;
        tmTrnsfr.trf_dt = this.sys.CurrentDate;
        tmTrnsfr.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
        tmTrnsfr.approval_status = 'U';
        saveTransaction.tmtransfer.push(tmTrnsfr);
      }
      ////////debugger;
      if (this.td.trans_cd.value > 0) {
        this.svc.addUpdDel<LoanOpenDM>('Common/UpdateTransactionDetails', saveTransaction).subscribe(
          res => {
            ////////debugger;
            this.disableOnSaveEdit=true;
            this.tdDefTransFrm.disable();
            this.tdDefTransFrm.disable();
            this.td.trf_type.disable();
            this.td.amount.disable()
            if(this.isDisburs){
              this.td.trans_mode.disable();
              this.td.instrument_num.disable();
              this.td.instrument_dt.disable();
              this.td.share.disable();
              this.td.comm.disable();
              this.td.svcchrg.disable();
              this.td.saleform.disable();
              this.td.insurence.disable()
            }
            if(this.isRecovery){
              this.td.recov_type.disable();
              this.td.intt_recov_dt.disable();
              this.td.remarks_on_manual.disable()
            }
            // this.unApprovedTransactionLst.push(tdDefTrans);
            const loanId = this.td.acc_num.value;
            // debugger;
            if(this.isRecovery){
               const tmDep = new p_loan_param();
              let inttRet = new p_loan_param();
              tmDep.loan_id = this.f.acct_num.value;
              tmDep.brn_cd = this.sys.BranchCode;
              tmDep.gs_user_id = this.sys.UserId;
              tmDep.ardb_cd = this.sys.ardbCD
              //debugger
          
            
              tmDep.commit_roll_flag = 3;
              tmDep.intt_dt = this.getInttDt(this.td.intt_recov_dt.value);
              this.isLoading=true
              this.svc.addUpdDel<any>('Loan/CalculateLoanInterestYearend', tmDep).subscribe(
                res => {
                  console.log(res)
                  debugger;
                  if (undefined !== res) {
                    this.isLoading=false
                    inttRet = res;
                    this.inttRetForUpdate=res
                    this.outIntt=(+this.inttRetForUpdate.curr_intt_recov) + (+this.inttRetForUpdate.ovd_intt_recov) + (+this.inttRetForUpdate.penal_intt_recov) - this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value
                    this.outPrn=+(+this.inttRetForUpdate.curr_prn_recov-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value)) + ((+this.inttRetForUpdate.ovd_prn_recov)-(+this.td.ovd_prn_recov.value))
            this.accDtlsFrm.patchValue({
              ovd_principal:+this.inttRetForUpdate.ovd_prn_recov-(+this.td.ovd_prn_recov.value),
              curr_principal:+this.inttRetForUpdate.curr_prn_recov-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value),
              curr_intt:+this.inttRetForUpdate.curr_intt_recov-(+this.td.curr_intt_recov.value),
              ovd_intt:+this.inttRetForUpdate.ovd_intt_recov-(+this.td.ovd_intt_recov.value),
              penal_intt:+this.inttRetForUpdate.penal_intt_recov-(+this.td.penal_intt_recov.value),
              intt_recev:(+this.inttRetForUpdate.curr_intt_recov) + (+this.inttRetForUpdate.ovd_intt_recov) + (+this.inttRetForUpdate.penal_intt_recov) - this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value ,
              principal:+this.inttRetForUpdate.curr_prn_recov-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value) + this.inttRetForUpdate.ovd_prn_recov-(+this.td.ovd_prn_recov.value),
              total_due: (+this.inttRetForUpdate.curr_intt_recov) + (+this.inttRetForUpdate.ovd_intt_recov) + (+this.inttRetForUpdate.penal_intt_recov) - this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value + +this.inttRetForUpdate.curr_prn_recov-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value) + this.inttRetForUpdate.ovd_prn_recov-(+this.td.ovd_prn_recov.value),
              // total_due: this.accDtlsFrm.controls.ovd_intt.value + this.accDtlsFrm.controls.curr_intt.value + this.accDtlsFrm.controls.penal_intt.value + this.accDtlsFrm.controls.principal.value ,
             })
             if(this.sys.ardbCD=='1'){
              this.modalRef = this.modalService.show(this.ContaiLoanChallan, { class: 'modal-xl' });
            }
            else{
              this.modalRef = this.modalService.show(this.LoanChallan, { class: 'modal-sm' });
            }
          }
          })
          }
          if(this.isDisburs){
            this.accDtlsFrm.patchValue({
              // adv_prn_recov: (+this.fd.adv_prn_recov.value) - (+this.td.adv_prn_recov.value),
              // penal_intt_recov: (+this.fd.penal_intt_recov.value) - (+this.td.penal_intt_recov.value),
              // curr_prn_recov: (+this.fd.curr_prn_recov.value) - (+this.td.curr_prn_recov.value),
              // curr_intt_recov: (+this.fd.curr_intt_recov.value) - (+this.td.curr_intt_recov.value),
              // ovd_prn_recov: (+this.fd.ovd_prn_recov.value) - (+this.td.ovd_prn_recov.value),
              // ovd_intt_recov: (+this.fd.ovd_intt_recov.value) - (+this.td.ovd_intt_recov.value)
              curr_principal:this.fd.curr_principal.value+this.td.paid_amount.value,
              principal:this.fd.principal.value+this.td.paid_amount.value,
             
              total_due: this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value + this.fd.ovd_principal.value + this.fd.curr_principal.value +this.td.paid_amount.value,
             // total_due: (+this.inttRetForUpdate.curr_intt_recov) + (+this.inttRetForUpdate.ovd_intt_recov) + (+this.inttRetForUpdate.penal_intt_recov) - this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value + +this.inttRetForUpdate.curr_prn_recov-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value) + this.inttRetForUpdate.ovd_prn_recov-(+this.td.ovd_prn_recov.value),

            })
          }
            this.HandleMessage(true, MessageType.Sucess, `Transaction for Loan Id ${loanId}, updated sucessfully !!!!`);
            this.isLoading = false;
            // this.onResetClick();
            // this.tdDefTransFrm.reset();
            // this.accTransFrm.reset();
          },
          err => {
            this.isLoading = false;
            this.HandleMessage(true, MessageType.Error, 'Update Failed !!!!');
            console.error('Error on onSaveClick' + JSON.stringify(err));
          }
        );
      }
      else {
        this.tdDefTransFrm.disable();
        this.tdDefTransFrm.disable();
        this.td.trf_type.disable();
        // this.td.amount.disable()
        this.disableOnSaveEdit=true;
        if(this.isDisburs){
          this.td.trans_mode.disable();
          this.td.instrument_num.disable();
          this.td.instrument_dt.disable();
          this.td.share.disable();
          this.td.comm.disable();
          this.td.svcchrg.disable();
          this.td.saleform.disable();
          this.td.insurence.disable()
        }
        if(this.isRecovery){
          this.td.recov_type.disable();
          this.td.intt_recov_dt.disable();
          this.td.remarks_on_manual.disable();
        }
        console.log(this.tdDefTransFrm.value,this.accDtlsFrm.value)
              debugger;
             
        this.svc.addUpdDel<LoanOpenDM>('Loan/InsertLoanTransactionData', saveTransaction).subscribe(
          res => {
            ////////debugger;
            // console.log(res)
            tdDefTrans.trans_cd = +res;
            // console.log(JSON.stringify(tdDefTrans))
            // const obj=JSON.stringify(tdDefTrans)
            // this.unApprovedTransactionLst.push(tdDefTrans);
            // this.unApprovedTransactionLst.push(tdDefTrans);
            this.GetUnapprovedDepTrans()
            // this.unApprovedTransactionLst.push(JSON.parse(obj));
            console.log(this.unApprovedTransactionLst)
            // debugger;
            this.outIntt=this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value - this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value
            // this.outPrn=((+this.inttRetForUpdate.curr_prn_recov)-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value)) + ((+this.inttRetForUpdate.ovd_prn_recov)-(+this.td.ovd_prn_recov.value))
            this.outPrn=(this.fd.ovd_principal.value-(+this.td.ovd_prn_recov.value))+(+this.fd.curr_principal.value-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value))
            debugger;
            if(this.isRecovery){
              this.accDtlsFrm.patchValue({
                ovd_principal:+this.fd.ovd_principal.value-(+this.td.ovd_prn_recov.value),
                curr_principal:+this.fd.curr_principal.value-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value),
                curr_intt:+this.fd.curr_intt.value-(+this.td.curr_intt_recov.value),
                ovd_intt:+this.fd.ovd_intt.value-(+this.td.ovd_intt_recov.value),
                penal_intt:+this.fd.penal_intt.value-(+this.td.penal_intt_recov.value),
                intt_recev:this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value - this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value,
                principal:((+this.fd.curr_principal.value)+(+this.fd.ovd_principal.value))-((+this.td.ovd_prn_recov.value)+(+this.td.adv_prn_recov.value)+(+this.td.curr_prn_recov.value)),
                total_due: this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value + this.fd.ovd_principal.value + this.fd.curr_principal.value - this.td.ovd_prn_recov.value - this.td.curr_prn_recov.value -this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value- (+this.td.adv_prn_recov.value),
                })
                // principal:+this.inttRetForUpdate.curr_prn_recov-(+this.td.curr_prn_recov.value) - (+this.td.adv_prn_recov.value) + this.inttRetForUpdate.ovd_prn_recov-(+this.td.ovd_prn_recov.value),
                // if(this.td.recov_type.value=='M'){
                //   this.accDtlsFrm.controls.principal.setValue(((+this.fd.curr_principal.value)+(+this.fd.ovd_principal.value))-((+this.td.ovd_prn_recov.value)+(+this.td.adv_prn_recov.value)+(+this.td.curr_prn_recov.value)))
                // }
                debugger
            }
            if(this.isDisburs){
              this.accDtlsFrm.patchValue({
                // adv_prn_recov: (+this.fd.adv_prn_recov.value) - (+this.td.adv_prn_recov.value),
                // penal_intt_recov: (+this.fd.penal_intt_recov.value) - (+this.td.penal_intt_recov.value),
                // curr_prn_recov: (+this.fd.curr_prn_recov.value) - (+this.td.curr_prn_recov.value),
                // curr_intt_recov: (+this.fd.curr_intt_recov.value) - (+this.td.curr_intt_recov.value),
                // ovd_prn_recov: (+this.fd.ovd_prn_recov.value) - (+this.td.ovd_prn_recov.value),
                // ovd_intt_recov: (+this.fd.ovd_intt_recov.value) - (+this.td.ovd_intt_recov.value)

              //  total_due: this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value + this.fd.ovd_principal.value + this.fd.curr_principal.value -  this.td.paid_amount.value,
              curr_principal:this.fd.curr_principal.value+this.td.paid_amount.value,
              principal:this.fd.principal.value+this.td.paid_amount.value,
              total_due: this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value + this.fd.ovd_principal.value + this.fd.curr_principal.value +this.td.paid_amount.value,
            
              // total_due:this.fd.curr_intt.value + this.fd.ovd_intt.value + this.fd.penal_intt.value + this.fd.ovd_principal.value + this.fd.curr_principal.value - this.td.ovd_prn_recov.value - this.td.curr_prn_recov.value -this.td.curr_intt_recov.value - this.td.ovd_intt_recov.value - this.td.penal_intt_recov.value
              })
            }
            this.HandleMessage(true, MessageType.Sucess, 'Saved successfully, your transaction code is -' + res);
            if(this.isRecovery){
              if(this.sys.ardbCD=='1' ){
                this.modalRef = this.modalService.show(this.ContaiLoanChallan, { class: 'modal-xl' });
              }
              else{
                this.modalRef = this.modalService.show(this.LoanChallan, { class: 'modal-sm' });
              }
            }
           this.tdDefTransFrm.patchValue({
              trans_cd: res
            });
            this.isLoading = false;
          },
          err => {
            this.isLoading = false;
            this.HandleMessage(true, MessageType.Error, 'Save Failed !!!!');
            console.error('Error on onSaveClick' + JSON.stringify(err));
          }
        );
      }
      ////////////////////

    }
  }

  onDeleteClick(): void {
    // if (!(confirm('Are you sure you want to Delete Transaction of Acc '
    //   + this.td.acc_num.value
    //   + ' with Transancation Cd ' + this.td.trans_cd.value))) {
    //   return;
    // }
    ////////debugger;
    this.isLoading = true;
    const param = new td_def_trans_trf();
    param.brn_cd = this.sys.BranchCode;
    param.trans_cd = this.td.trans_cd.value;
    param.trans_dt = this.sys.CurrentDate;
    param.acc_type_cd = (+this.f.acc_type_cd.value);
    param.acc_num = this.td.acc_num.value;
    param.ardb_cd = this.sys.ardbCD
    this.modalRef.hide();
    this.svc.addUpdDel<any>('Deposit/DeleteAccountOpeningData ', param).subscribe(
      res => {
        this.isLoading = false;
        if (res === 0) {
          this.HandleMessage(true, MessageType.Sucess, this.td.acc_num.value
            + '\'s Transaction with Transaction Cd ' + this.td.trans_cd.value
            + ' is deleted.');
          this.GetUnapprovedDepTrans();
          this.onResetClick();
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

  // mappTddefTransFromFrm(): td_def_trans_trf {
    mappTddefTransFromFrm(): any{
    ////////debugger;
    console.log(this.f.acc_type_cd.value + " " + this.td.acc_num.value);
    ////debugger;
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    const toReturn = new td_def_trans_trf();
    // const toReturn=null;
    const accTypeCd = +this.f.acc_type_cd.value;
    // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
    if (this.td.trans_cd.value > 0) {
      toReturn.trans_cd = this.td.trans_cd.value;
    }
    toReturn.brn_cd = this.sys.BranchCode;
    toReturn.trans_dt = this.sys.CurrentDate;
    toReturn.acc_type_cd = this.td.acc_type_cd.value;
    // toReturn.acc_num = this.td.acc_num.value;
    toReturn.acc_num = this.loanID;
    toReturn.trans_type = this.td.trans_type_key.value;
    toReturn.trans_mode = this.td.trans_mode.value;
    toReturn.amount = +this.td.amount.value;
    toReturn.instrument_dt = !this.td.instrument_dt.value ? null : this.td.instrument_dt.value;
    toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
    toReturn.paid_to = 'YEAREND';
    toReturn.token_num = this.td.token_num.value;
    toReturn.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    toReturn.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    toReturn.approval_status = 'U';
     toReturn.particulars = this.td.recov_type.value=='M'? 'M' : 'S';
    if (this.td.trf_type.value === 'T') {
      toReturn.tr_acc_cd = 10000;
    } else if (this.td.trf_type.value === 'C') {
      toReturn.tr_acc_cd = 21101;
    }
    toReturn.trf_type = this.td.trf_type.value;
    toReturn.acc_cd = this.f.acc_type_cd.value;
    toReturn.acc_type_cd = this.f.acc_type_cd.value
    if (this.td.trans_type_key.value === 'R') {
      toReturn.curr_prn_recov = this.td.curr_prn_recov.value ? this.td.curr_prn_recov.value : 0;
      toReturn.curr_intt_recov = this.td.curr_intt_recov.value ? this.td.curr_intt_recov.value : 0;
      toReturn.ovd_prn_recov = this.td.ovd_prn_recov.value ? this.td.ovd_prn_recov.value : 0;
      toReturn.ovd_intt_recov = this.td.ovd_intt_recov.value ? this.td.ovd_intt_recov.value : 0;
      if(this.editDeleteMode){
        toReturn.intt_till_dt = this.td.intt_recov_dt.value;
      }else{
        toReturn.intt_till_dt = this.getInttDt(this.td.intt_recov_dt.value);
      }
      // toReturn.intt_till_dt = this.getInttDt(this.td.intt_recov_dt.value);
      toReturn.penal_intt_recov = this.td.penal_intt_recov.value ? this.td.penal_intt_recov.value : 0;
      toReturn.adv_prn_recov = this.td.adv_prn_recov.value ? this.td.adv_prn_recov.value : 0;
      toReturn.paid_amt = +this.td.amount.value;
      toReturn.share_amt = 0,
      toReturn.sum_assured = 0,
      toReturn.voucher_id = 0,
      toReturn.mis_advance_recov = 0,
      toReturn.audit_fees_recov = 0;
      toReturn.ongoing_unit_no = this.td.ongoing_unit_no.value;
    }
    else {
      var dt = this.sys.CurrentDate
      dt.setDate(dt.getDate() - 1)
      console.log(this.datePipe.transform(dt, 'dd/MM/yyyy hh:mm:ss'))
      toReturn.curr_prn_recov = 0;
      toReturn.curr_intt_recov = 0;
      toReturn.ovd_prn_recov = 0;
      toReturn.ovd_intt_recov = 0;
      toReturn.ongoing_unit_no = 0;
      toReturn.intt_till_dt =this.accDtlsFrm.controls.total_due.value==0? Utils.convertStringToDt(this.datePipe.transform(dt, 'dd/MM/yyyy hh:mm:ss')):this.inttTillDt;
      toReturn.paid_amt = +this.td.paid_amount.value;
      toReturn.share_amt = this.td.share.value,
        toReturn.sum_assured = this.td.comm.value,
        toReturn.voucher_id = this.td.svcchrg.value,
        toReturn.mis_advance_recov = this.td.saleform.value,
        toReturn.audit_fees_recov = this.td.insurence.value;
    }
    toReturn.remarks = this.td.remarks_on_manual.value ? this.td.remarks_on_manual.value : null;
    toReturn.crop_cd = (undefined !== this.sancdtls && this.sancdtls.length > 0) ?
      this.sancdtls[0].crop_cd : '';
    toReturn.activity_cd = (undefined !== this.sancdtls && this.sancdtls.length > 0) ?
      this.sancdtls[0].activity_cd : '';
    toReturn.curr_intt_rate = this.td.curr_intt_rate.value;
    toReturn.ovd_intt_rate = this.td.ovd_intt_rate.value;
    // toReturn.instl_no = 1;
    toReturn.instl_no = this.td.instl_no.value;
    if (this.isDisburs)
      toReturn.instl_start_dt = Utils.convertStringToDt(this.td.instl_start_dt.value);
    toReturn.instl_no = this.instl_no
    console.log(this.perVal)
    toReturn.periodicity = this.td.periodicity.value ? Number(this.installmenttypeList.filter(x => x.desc_type === this.perVal)[0].ins_type) : 0; //marker
    toReturn.disb_id = 0;
    toReturn.comp_unit_no = 0;
    // toReturn.ongoing_unit_no = 0;
    // toReturn.mis_advance_recov = 0;
    // toReturn.audit_fees_recov = 0;
    toReturn.sector_cd = (undefined !== this.sancdtls && this.sancdtls.length > 0) ?
      this.sancdtls[0].sector_cd : '';
    toReturn.spl_prog_cd = '18';
    toReturn.borrower_cr_cd = '0000';
    return toReturn;
  }

  mappTddefTransAndTransFrFromFrm(): td_def_trans_trf {
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    const toReturn = new td_def_trans_trf();
    const accTypeCd = +this.f.acc_type_cd.value;
    toReturn.brn_cd = this.sys.BranchCode;
    if (this.td.trans_cd.value > 0) {
      toReturn.trans_cd = this.td.trans_cd.value;
    }
    toReturn.trans_dt = this.sys.CurrentDate;
    toReturn.trans_mode = 'V';
    toReturn.paid_to = null;
    toReturn.token_num = null;
    toReturn.trf_type = this.td.trf_type.value;

    switch (selectedOperation.oprn_desc.toLocaleLowerCase()) {
      case 'disbursement':
        toReturn.trans_type = 'D';
        toReturn.particulars = 'BY TRANSFER FROM ' + this.td.acc_num.value;
        toReturn.tr_acc_cd = 10000;
        break;
      case 'recovery':
        toReturn.trans_type = 'W';
        // toReturn.particulars = 'TO TRANSFER TO' + this.td.acc_num.value;
        toReturn.particulars = 'TO TRANSFER TO LOAN ID - ' + this.loanID;
        toReturn.tr_acc_cd = 10000;
        break;
    }
    toReturn.instrument_dt = !this.td.instrument_dt.value ? null : this.td.instrument_dt.value;
    toReturn.paid_to = null;
    toReturn.token_num = null;
    toReturn.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    toReturn.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    toReturn.approval_status = 'U';
    toReturn.trf_type = 'T';
    return toReturn;
  }

  mapDenominationToTmdenominationtrans(): void {

  }

  onResetClick(): void {
    this.initialize();
    debugger
    this.joinHold=[];
    this.subSidyAmt=0;
    this.suggestedCustomerCr = null;
    this.disableChangeTrf=true;
    this.disableOperation = false
    this.isDelete = false;
    this.disabledOnNull=true;
    this.suggestedCustomer=null
    // this.getOperationMaster();
    this.f.oprn_cd.disable();
    // this.f.acct_num.disable();
    this.msg.sendCommonTmLoanAll(null);
    this.tm_denominationList = [];
    this.td_deftranstrfList = [];
    this.sancdtls = [];
    this.showTransactionDtl = false;
  //  
      this.td.trf_type.enable();
      this.td.amount.enable();
      this.td.trans_mode.enable();
      this.td.instrument_num.enable();
      this.td.instrument_dt.enable();
      this.td.share.enable();
      this.td.comm.enable();
      this.td.svcchrg.enable();
      this.td.saleform.enable();
      this.td.insurence.enable();
      this.disableOnSaveEdit=false;
      this.td.ongoing_unit_no.enable();
      this.td.recov_type.enable();
      this.td.intt_recov_dt.enable();
      this.td.remarks_on_manual.enable();
      this.acc_block=null;
      this.acc_lfNo=null;
      this.acc_phone=null;
      this.present_address=null;
      this.member_id=null;
      this.guardian_name=null;
      this.l_cust_cd=null;
      this.l_case_no=null;

  }
  // onClearClick(){
  //   this.showMsg = null;
  //   this.joinHold=[];
  //   this.subSidyAmt=0;
  //   this.suggestedCustomerCr = null;
  //   this.disableChangeTrf=true;
  //   this.disableOperation = false
  //   this.accTransFrm.reset();
  //   // this.tdDefTransFrm.reset();
  //   this.accDtlsFrm.reset();
  //   this.isDelete = false;
  //   this.disabledOnNull=true;
  //   this.suggestedCustomer=null
  //   // this.getOperationMaster();
  //   this.f.oprn_cd.disable();
  //   // this.f.acct_num.disable();
  //   this.msg.sendCommonTmLoanAll(null);
  //   this.tm_denominationList = [];
  //   this.td_deftranstrfList = [];
  //   this.sancdtls = [];
  //   this.showTransactionDtl = false;
  // //  
  //     this.td.trf_type.enable();
  //     this.td.amount.enable();
  //     this.td.trans_mode.enable();
  //     this.td.instrument_num.enable();
  //     this.td.instrument_dt.enable();
  //     this.td.share.enable();
  //     this.td.comm.enable();
  //     this.td.svcchrg.enable();
  //     this.td.saleform.enable();
  //     this.td.insurence.enable()
  //     this.disableOnSaveEdit=false
  //     this.td.ongoing_unit_no.enable();
  //     this.td.recov_type.enable();
  //     this.td.intt_recov_dt.enable();
  //     this.td.remarks_on_manual.enable();
  //     this.acc_block=null;
  //     this.acc_lfNo=null;
  //     this.acc_phone=null;
  //     this.present_address=null;
  //     this.member_id=null;
  //     this.guardian_name=null;
  //     this.l_cust_cd=null;
  //     this.l_case_no=null;
  // }
 addDenomination() {
    let alreadyHasEmptyDenominationItem = false;
    if (this.tm_denominationList.length >= 1) {
      // check if tm_denominationList has any blank items
      this.tm_denominationList.forEach(element => {
        if (!alreadyHasEmptyDenominationItem) {
          if (undefined === element.rupees
            || undefined === element.count
            || undefined === element.total) { alreadyHasEmptyDenominationItem = true; }
        }
      });
    }
    if (alreadyHasEmptyDenominationItem) { return; }

    const temp_denomination = new tm_denomination_trans();
    temp_denomination.brn_cd = localStorage.getItem('__brnCd');
    temp_denomination.trans_dt = this.sys.CurrentDate;
    this.tm_denominationList.push(temp_denomination);
  }

  removeDenomination() {
    if (this.tm_denominationList.length >= 1) {
      this.tm_denominationList.pop();
      this.denominationGrandTotal = 0;
      for (const l of this.tm_denominationList) {
        this.denominationGrandTotal = this.denominationGrandTotal + l.total;
      }
    }
  }

  setDenomination(val: number, idx: number) {
    val = +val;
    this.tm_denominationList[idx].rupees = val;
    this.tm_denominationList[idx].rupees_desc =
      this.denominationList.filter(x => x.value === val)[0].rupees;
    this.calculateTotalDenomination(idx);
  }

  calculateTotalDenomination(idx: number) {

    let r = 0;
    let c = 0;

    if (this.tm_denominationList[idx].rupees != null) {
      r = this.tm_denominationList[idx].rupees;
    }

    if (this.tm_denominationList[idx].count != null) {
      this.tm_denominationList[idx].count = Number(this.tm_denominationList[idx].count);
      c = this.tm_denominationList[idx].count;
    }

    this.tm_denominationList[idx].total = r * c;

    this.denominationGrandTotal = 0;
    for (const l of this.tm_denominationList) {
      this.denominationGrandTotal = this.denominationGrandTotal + l.total;
    }
  }

  getAccountTypeList() {

    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {

        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {

      }
    );
  }

  setDebitAccDtls(tdDefTransTrnsfr: td_def_trans_trf) {
    this.HandleMessage(false);
    if (tdDefTransTrnsfr.cust_acc_type === undefined
      || tdDefTransTrnsfr.cust_acc_type === null
      || tdDefTransTrnsfr.cust_acc_type === '') {
      this.HandleMessage(true, MessageType.Error, 'Account Type in Transfer Details can not be blank');
      tdDefTransTrnsfr.cust_acc_number = null;
      return;
    }

    if (tdDefTransTrnsfr.cust_acc_number === undefined ||
      tdDefTransTrnsfr.cust_acc_number === null ||
      tdDefTransTrnsfr.cust_acc_number === '') {
      tdDefTransTrnsfr.cust_name = null;
      tdDefTransTrnsfr.clr_bal = null;
      return;
    }


    let temp_deposit_list: tm_deposit[] = [];
    const temp_deposit = new tm_deposit();

    temp_deposit.brn_cd = this.sys.BranchCode;
    temp_deposit.acc_num = tdDefTransTrnsfr.cust_acc_number;
    temp_deposit.acc_type_cd = parseInt(tdDefTransTrnsfr.cust_acc_type);

    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', temp_deposit).subscribe(
      res => {
        this.isLoading = false;
        let foundOneUnclosed = false;
        if (undefined !== res && null !== res && res.length > 0) {
          temp_deposit_list = res;
          temp_deposit_list.forEach(element => {
            if (element.acc_status === null || element.acc_status.toUpperCase() !== 'C') {
              foundOneUnclosed = true;
              tdDefTransTrnsfr.cust_name = element.cust_name;
              tdDefTransTrnsfr.acc_cd = element.acc_cd;
              tdDefTransTrnsfr.clr_bal = element.clr_bal;
            }
          });
          if (temp_deposit_list.length === 0) {
            this.HandleMessage(true, MessageType.Error, 'Invalid Loan ID in Transfer Details');
            tdDefTransTrnsfr.cust_acc_number = null;
            return;
          }
          if (!foundOneUnclosed) {
            this.HandleMessage(true, MessageType.Error,
              `Transfer details Loan ID${this.f.acct_num.value} is closed.`);
            tdDefTransTrnsfr.cust_acc_number = null;
            return;
          }
        }

      },
      err => {
        this.isLoading = false;
      }
    );
  }
  checkAndSetDebitAccType(tfrType: string, tdDefTransTrnsfr: td_def_trans_trf) {
    console.log(tdDefTransTrnsfr.cust_acc_type)
    this.cust_acc_type=tdDefTransTrnsfr.cust_acc_type
    this.HandleMessage(false);
    if (tfrType === 'cust_acc') {
      if (tdDefTransTrnsfr.cust_acc_type === undefined
        || tdDefTransTrnsfr.cust_acc_type === null
        || tdDefTransTrnsfr.cust_acc_type === '') {
        tdDefTransTrnsfr.cust_name = null;
        tdDefTransTrnsfr.clr_bal = null;
        tdDefTransTrnsfr.cust_acc_desc = null;
        tdDefTransTrnsfr.cust_acc_number = null;
        return;
      }

      if (tdDefTransTrnsfr.gl_acc_code === undefined
        || tdDefTransTrnsfr.gl_acc_code === null
        || tdDefTransTrnsfr.gl_acc_code === '') {
        let temp_acc_type = new mm_acc_type();
        temp_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString()
          === tdDefTransTrnsfr.cust_acc_type.toString())[0];

        if (temp_acc_type === undefined || temp_acc_type === null) {
          tdDefTransTrnsfr.cust_acc_type = null;
          this.HandleMessage(true, MessageType.Error, 'Invalid Loan Type');
          return;
        }
        else {
          tdDefTransTrnsfr.cust_acc_desc = temp_acc_type.acc_type_desc;
          tdDefTransTrnsfr.trans_type = tfrType;
        }
      }
      else {
        this.HandleMessage(true, MessageType.Error, 'GL Code in Transfer Details is not Blank');
        tdDefTransTrnsfr.cust_acc_type = null;
        return;
      }
    }

    if (tfrType === 'gl_acc') {
      //   if (tdDefTransTrnsfr.gl_acc_code === undefined
      //     || tdDefTransTrnsfr.gl_acc_code === null
      //     || tdDefTransTrnsfr.gl_acc_code === '') {
      //     tdDefTransTrnsfr.gl_acc_desc = null;
      //     return;
      //   }
  
      // else  if (tdDefTransTrnsfr.gl_acc_code === this.sys.CashAccCode.toString()) {
      //     this.HandleMessage(true, MessageType.Error, this.sys.CashAccCode.toString() +
      //       ' cash account code is not permissible.');
      //     tdDefTransTrnsfr.gl_acc_desc = null;
      //     tdDefTransTrnsfr.gl_acc_code = '';
      //     return;
      //   }
  
        // if (tdDefTransTrnsfr.cust_acc_type === undefined
        //   || tdDefTransTrnsfr.cust_acc_type === null
        //   || tdDefTransTrnsfr.cust_acc_type === '') {
        //   if (this.acc_master === undefined || this.acc_master === null || this.acc_master.length === 0) {
            this.isLoading = true;
            let temp_acc_master:any = new m_acc_master();
            var dt={"ardb_cd":this.sys.ardbCD}
            this.svc.addUpdDel<any>('Mst/GetAccountMaster', dt).subscribe(
              res => {
                 this.acc_master = res;
                 this.acc_master1 = res;
                this.isLoading = false;
                // if(tdDefTransTrnsfr.acc_cd!=null){
                  // debugger;
                  console.log(res)
                  this.hidegl=false;
                  this.acc_master= this.acc_master1.filter(x => x.acc_cd.toString().includes(tdDefTransTrnsfr.gl_acc_code) || x.acc_name.toString().toLowerCase().includes(tdDefTransTrnsfr.gl_acc_code.toString().toLowerCase())  );
                // }
                // temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString().includes(tdDefTransTrnsfr.gl_acc_code) || x.acc_name.toString().includes(tdDefTransTrnsfr.gl_acc_code)  );
                
                // if (temp_acc_master === undefined || temp_acc_master === null) {
                //   tdDefTransTrnsfr.gl_acc_desc = null;
                //   this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
                //   return;
                // }
                // else {
                  console.log( this.acc_master.filter(x => x.acc_cd.toString().includes(tdDefTransTrnsfr.gl_acc_code) || x.acc_name.toString().includes(tdDefTransTrnsfr.gl_acc_code)))
                  tdDefTransTrnsfr.gl_acc_desc = temp_acc_master.acc_name;
                  tdDefTransTrnsfr.trans_type = tfrType;
                // }
              },
              err => {
  
                this.isLoading = false;
              }
            );
          // }
          // else {
          //   let temp_acc_master = new m_acc_master();
          //   temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tdDefTransTrnsfr.gl_acc_code)[0];
          //   if (temp_acc_master === undefined || temp_acc_master === null) {
          //     tdDefTransTrnsfr.gl_acc_desc = null;
          //     // this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
          //     // return;
          //   }
          //   else {
          //     tdDefTransTrnsfr.gl_acc_desc = temp_acc_master.acc_name;
          //     tdDefTransTrnsfr.trans_type = tfrType;
          //   }
          // }
        // }
        // else {
        //   this.HandleMessage(true, MessageType.Error, 'Account Type in Transfer Details is not blank');
        //   tdDefTransTrnsfr.gl_acc_code = null;
        //   return;
        // }
      }
    // tdDefTransTrnsfr.amount = this.td.amount.value;
  }
  hidetab(e){
    if(!e.target.value.length){
      // debugger;
      this.acc_master.length=0
      this.acc_master=null
      this.glHead=document.getElementById('debit_gl_ac')
      this.glHead.value=''
      this.hidegl=true
    }
  }
  setGLCode(acc_cd: string, acc_name: string, indx: number, c: any){
    this.acc_master = null;
    this.hidegl=true;
    // console.log(this.suggestedCustomerCr.length)
    
      this.td_deftranstrfList[indx].gl_acc_code = acc_cd;
      this.td_deftranstrfList[indx].gl_acc_desc = acc_name;
      // this.setDebitAccDtls(this.td_deftranstrfList[indx]);
    
    
  }
  checkDebitBalance(tdDefTransTrnsfr: td_def_trans_trf) {
    console.log(tdDefTransTrnsfr);
    console.log(this.cust_acc_type)
    this.HandleMessage(false);
    if (tdDefTransTrnsfr.amount === undefined
      || tdDefTransTrnsfr.amount === null) {
      return;
    }
    //marker
    if(tdDefTransTrnsfr.gl_acc_code){
      if(this.td.ongoing_unit_no.value > 0){

      }
      else{
        if((+tdDefTransTrnsfr.amount)!=this.tdDefTransFrm.controls.amount.value && this.isRecovery){
        this.HandleMessage(true, MessageType.Error, 'Entered amount does not match with recovery amount..!!');
        tdDefTransTrnsfr.amount = 0;
        this.TrfTotAmt=0;
        return;
    }}
      
  }
    if(tdDefTransTrnsfr.cust_acc_number){
      if((+tdDefTransTrnsfr.amount)>tdDefTransTrnsfr.clr_bal && this.isRecovery){
        this.HandleMessage(true, MessageType.Error, 'Amount entered is more than the Balance of - '+ tdDefTransTrnsfr.cust_acc_number);
        tdDefTransTrnsfr.amount = 0;
        this.TrfTotAmt=0;
        return;
      
    }
  
    }
    //marker
    if ((+tdDefTransTrnsfr.amount) < 0) {
      this.HandleMessage(true, MessageType.Error, 'Negative amount can not be entered.');
      tdDefTransTrnsfr.amount = 0;
      return;
    }

    if ((tdDefTransTrnsfr.cust_acc_number === undefined
      || tdDefTransTrnsfr.cust_acc_number === null
      || tdDefTransTrnsfr.cust_acc_number === '')
      && (tdDefTransTrnsfr.gl_acc_code === undefined
        || tdDefTransTrnsfr.gl_acc_code === null
        || tdDefTransTrnsfr.gl_acc_code === '')) {
      this.HandleMessage(true, MessageType.Warning, 'Please enter Account Number or GL Code');
      tdDefTransTrnsfr.amount = null;
      return;
    }


    if (tdDefTransTrnsfr.clr_bal === undefined
      || tdDefTransTrnsfr.clr_bal === null) {
      tdDefTransTrnsfr.clr_bal = 0;
    }
    this.sumTransfer();
  }

  public addTransfer(): void {
    let emptyTranTranferExist = false;
    this.td_deftranstrfList.forEach(e => {
      if (undefined !== e && null !== e
        && (undefined === e.cust_acc_type && undefined === e.gl_acc_code)) {
        emptyTranTranferExist = true;
      }
    });
    if (!emptyTranTranferExist) {
      this.td_deftranstrfList.push(new td_def_trans_trf());
    }
  }

  private sumTransfer(): void {
    this.TrfTotAmt = 0;
    this.td_deftranstrfList.forEach(e => {
      this.TrfTotAmt += (+e.amount);
    });
    if(this.isRecovery && this.td.ongoing_unit_no.value>0){
      if ((+this.td.amount.value)+this.td.ongoing_unit_no.value != this.TrfTotAmt) {
        this.HandleMessage(true, MessageType.Error, 'Total Amount missmatch with Transaction amount');
        this.td_deftranstrfList[(this.td_deftranstrfList.length - 1)].amount = 0;
        this.TrfTotAmt = 0;
      }
    }
    else{
      if ((+this.td.amount.value) < this.TrfTotAmt) {
        this.HandleMessage(true, MessageType.Error, 'Total Amount can not be more than Transaction amount');
        this.td_deftranstrfList[(this.td_deftranstrfList.length - 1)].amount = 0;
        this.TrfTotAmt = 0;
      }
    }
    
  }

  public removeTransfer(tdDefTransTrnsfr: td_def_trans_trf): void {
    this.td_deftranstrfList.forEach((e, i) => {
      if (undefined !== e.cust_acc_type
        && e.cust_acc_type === tdDefTransTrnsfr.cust_acc_type
        && e.cust_acc_number === tdDefTransTrnsfr.cust_acc_number) {
        this.td_deftranstrfList.splice(i, 1);
      } else if (undefined !== e.gl_acc_code
        && e.gl_acc_code === tdDefTransTrnsfr.gl_acc_code) {
        this.td_deftranstrfList.splice(i, 1);
      }
    });
    this.sumTransfer();
  }
  private resetTransfer() {
    const td_deftranstrf: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftranstrf;
    const temp_deftranstrf = new td_def_trans_trf();
    this.td_deftranstrfList.push(temp_deftranstrf);
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
    // setTimeout(() => {
    //   this.showMsg = new ShowMessage();
    // }, 3000);
  }

  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  openModal(template: TemplateRef<any>) {
    this.msg.sendCommonAccountNum('9');
    this.modalRef = this.modalService.show(template);
  }
  openModalC5(template: TemplateRef<any>) {
    ////////debugger;
    this.PopulateLoanRepSch(template);
  }
  PopulateLoanRepSch(template: TemplateRef<any>): void {
    this.isLoading = true;
    const tmDep = new p_loan_param();
    tmDep.loan_id = this.loanID;
    tmDep.ardb_cd = this.sys.ardbCD;
    this.svc.addUpdDel<any>('Loan/PopulateLoanRepSch', tmDep).subscribe(
      res => {
        ////////debugger;
        console.log(res)
        if (undefined !== res) {
          this.LoanRepSch = res;
          this.LoanRepSch.forEach(x => x.due_dt1 = x.due_dt.toString().substr(0, 10))
          this.modalRef = this.modalService.show(template);
          this.isLoading = false;
        }
      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, 'Loan Repayment Schedule not found, Try again later.');
      }
    );
  }
  openModalC1(template: TemplateRef<any>) {
    ////////debugger;
    this.SubmitReport(template);

    // this.PopulateLoanRepSch(template);
  }
  customerDtls(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });


  }
  public SubmitReport(template: TemplateRef<any>) {
    ////////debugger;
    // this.UrlString = this.svc.getReportUrl();
    // this.UrlString = this.UrlString + 'WebForm/Loan/loanstatement?'
    //   + 'ardb_cd=' + this.sys.ardbCD
    //   + '&brn_cd=' + this.sys.BranchCode
    //   + '&loan_id=' + this.f.acct_num.value
    //   + '&from_dt=' + this.fd.disb_dt.value.toString().substr(0, 10)
    //   + '&to_dt=' + Utils.convertDtToString(this.sys.CurrentDate);
    // this.isLoading = false;//this.fd.disb_dt.value
    // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
    // this.modalRef = this.modalService.show(template);
    this.ovdInttSum=0
    this.currInttSum=0
    this.currPrnSum=0
    this.ovdPrnSum=0
    this.ovdInttRecovSum=0
    this.currInttRecovSum=0
    this.currPrnRecovSum=0
    this.ovdPrnRecovSum=0
    this.penalInttSum+=0
    this.penalInttCalSum+=0
    this.ovdInttCalSum+=0
    this.currInttCalSum+=0
    this.penalInttRecovSum=0
    this.advPrnRecovSum=0
    // this.totPrn+=e.ovd_prn+e.curr_prn
    this.recovSum=0
    this.disbSum=0
    this.totalRecovSum=0
    this.reportData.length=0;
    // this.pagedItems.length=0;
    //PARTHA  this.modalRef.hide();
    this.isLoading=true
    // this.fromdate = this.fd.disb_dt.value;
    this.fromdate =Utils.convertStringToDt('01/01/2000');
    console.log(this.fromdate);
    
    this.toDate =  this.sys.CurrentDate;
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode,
      "loan_id": this.f.acct_num.value,
      // "from_dt": this.fromdate.toISOString(),
      "from_dt": this.fromdate,
      // "to_dt": this.toDate.toISOString()
      "to_dt": this.toDate
    }
    this.svc.addUpdDel('Loan/PopulateLoanStatement', dt).subscribe(data => {
      console.log(data)
      this.reportData = data
            this.isLoading = false
      
     
      // this.modalRef.hide();
      this.dataSource.data=this.reportData
      // for(let i=0;i<50;i++)
      // this.dataSource.data.push(this.reportData)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.resultLength=this.reportData.length
      this.lastAccNum=this.reportData[this.reportData.length-1].acc_num
      this.reportData.forEach(e => {
        this.ovdInttSum+=e.ovd_intt
        this.currInttSum+=e.curr_intt
        this.currPrnSum+=e.curr_prn
        this.ovdPrnSum+=e.ovd_prn
        this.ovdInttRecovSum+=e.ovd_intt_recov
        this.currInttRecovSum+=e.curr_intt_recov
        this.currPrnRecovSum+=e.curr_prn_recov
        this.ovdPrnRecovSum+=e.ovd_prn_recov
        this.penalInttSum+=e.penal_intt
        this.currInttCalSum+=e.curr_intt_calculated
        this.ovdInttCalSum+=e.ovd_intt_calculated
        this.penalInttCalSum+=e.penal_intt_calculated
        this.penalInttRecovSum+=e.penal_intt_recov
        this.advPrnRecovSum+=e.adv_prn_recov
        // this.totPrn+=e.ovd_prn+e.curr_prn
        this.recovSum+=e.recov_amt
        this.disbSum+=e.disb_amt
        this.totalRecovSum+=e.curr_intt_recov+e.ovd_intt_recov+e.penal_intt_recov+e.adv_prn_recov+e.curr_prn_recov+e.ovd_prn_recov
      });
      this.lastCd=this.reportData[this.reportData.length-1].trans_cd
      this.lastDt=this.reportData[this.reportData.length-1].trans_dt
    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass('modal-xl');

    })
    // this.modalRef.hide();
    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 10000);

  }
  onChangeTrf(i:any){
    this.suggestedCustomerCr = null;
    if (this.td_deftranstrfList[i].cust_name.length > 2) {
      this.disableChangeTrf=false;

    }
    else{
      this.disableChangeTrf=true;
    }
  }
  public suggestCustomerCr(i: number): void {
    ////////debugger;
    this.isLoading=true;
    if (this.td_deftranstrfList[i].cust_name.length > 2) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.td_deftranstrfList[i].cust_name.toLowerCase();
      prm.ad_acc_type_cd = +this.td_deftranstrfList[i].cust_acc_type;
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          this.isLoading=false
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomerCr = res
            this.indxsuggestedCustomerCr = i;
          } else {
            this.suggestedCustomerCr = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomerCr = null;
    }
  }
  getDetails(cust:any){
    console.log(cust)
    console.log(this.cust_acc_type)
  }
  setCustDtlsCr(acc_num: string, cust_name: string, indx: number) {
    this.suggestedCustomerCr = null;
    this.td_deftranstrfList[indx].cust_acc_number = acc_num;
    this.td_deftranstrfList[indx].cust_name = cust_name;

    this.setDebitAccDtls(this.td_deftranstrfList[indx]);
  }
  private getBlockMster(): void {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    // this.svc.addUpdDel<mm_block[]>('Mst/GetBlockMaster', this.sys.ardbCD).subscribe(
    this.svc.addUpdDel<any>('Mst/GetBlockMaster', dt).subscribe(
      res => {
        console.log(res)
        this.blocks = res;
        this.blocks = this.blocks.sort((a, b) => (a.block_name > b.block_name) ? 1 : -1);
      },
      err => { }
    );
  }
  public GetCustomer(): Observable<mm_customer> {
    const prm = new p_gen_param();
     
        prm.as_cust_name = this.acc2.tmloanall.party_cd.toString();
        prm.ardb_cd = this.sys.ardbCD;
        this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
          res => {
            console.log(res)
            if (undefined !== res && null !== res && res.length > 0) {
              this.suggestedCustomer1 = res;
              let BLOCK=res.filter(e=>e.cust_cd===this.acc2.tmloanall.party_cd)
              this.selectedBlock[0] = this.blocks.filter(e => e.block_cd === BLOCK[0].block_cd)[0];
              console.log(this.blocks);
              debugger
              // console.log(this.selectedBlock[0].block_name);
              // console.log(this.suggestedCustomer1[0].phone);
              // console.log(this.acc2.tmloanall.loan_acc_no);
              // this.ln_id=this.suggestedCustomer1[0].acc_num
              this.partyName=this.suggestedCustomer1[0].cust_name
              this.acc_block=this.selectedBlock[0].block_name;
              this.acc_phone=this.suggestedCustomer1[0].phone;
              this.present_address=this.suggestedCustomer1[0].present_address;
              this.member_id=this.suggestedCustomer1[0].old_cust_cd;
              this.m_id=this.member_id;
              this.pps=this.activityList.filter(e=>e.activity_cd==this.acc2.tmloanall.activity_cd)[0].activity_desc
              this.guardian_name=this.suggestedCustomer1[0].guardian_name;
              this.acc_lfNo=this.acc2.tmloanall.loan_acc_no;
              this.l_cust_cd=this.suggestedCustomer1[0].cust_cd;debugger
              this.l_case_no=this.acc2.tdloansancsetlist[0]?.tdloansancset.filter(e=>e.param_cd=='117')[0]?.param_value
              
              debugger
            } else {
              this.suggestedCustomer1 = [];
              return [];
            }
          },
          err => { this.isLoading = false; }
        );
      
    
    return null

  }
  getSubsidy() {
    let subsidyEntry = new tm_subsidy();
    subsidyEntry.brn_cd = this.sys.BranchCode;
    subsidyEntry.loan_id = this.loanID;
    subsidyEntry.ardb_cd = this.sys.ardbCD;
    this.svc.addUpdDel<any>('Loan/GetSubsidyData', subsidyEntry).subscribe(
      res => {
        ;
        console.log(res)
        if (res.length == 0) {
          this.HandleMessage(true, MessageType.Sucess, 'Data Not found !!!');
        }
        else{
         this.subSidyAmt= res.subsidy_amt
        }
      })
    }
    CurrentDemand() {
  this.fdt='01/04/'+((+(this.sys.lastDt).substring(6,10))-1).toString();
  this.tdt='31/03/'+(+(this.sys.lastDt).substring(6,10)).toString();
      var dt = {
        "ardb_cd": this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.convertDate('01/04/'+((+(this.sys.lastDt).substring(6,10))-1).toString()),
        "to_dt": this.convertDate('31/03/'+(+(this.sys.lastDt).substring(6,10)).toString()),
        "fund_type":this.acc2.tmloanall.fund_type,
        "loan_id":this.loanID
      }
      debugger
      this.svc.addUpdDel<any>('Loan/GetDemandListSingle', dt).subscribe(
        res => {
          console.log(res)
          this.CurrentYearDemand = res;
        },
        err => { }
      );
    }
    private convertDate(datestring:string):Date
      {
      var parts = datestring.match(/(\d+)/g);
      return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
      }
      printChallan(){
        if(this.sys.ardbCD=='1'){
          this.modalRef = this.modalService.show(this.ContaiLoanChallan, { class: 'modal-xl' });
        }
        else{
          this.modalRef = this.modalService.show(this.LoanChallan, { class: 'modal-sm' });
        }}
        getActivityList() {

          this.activityList = [];
      
          this.svc.addUpdDel<any>('Mst/GetActivityMaster', null).subscribe(
            res => {
      
              this.activityList = res;
              this.activityList = this.activityList.sort((a, b) => (a.activity_cd > b.activity_cd) ? 1 : -1);
            },
            err => {
            console.log(err);
      
            }
          );
      
        }

}
export class DynamicSelect {
  key: any;
  Description: any;
}