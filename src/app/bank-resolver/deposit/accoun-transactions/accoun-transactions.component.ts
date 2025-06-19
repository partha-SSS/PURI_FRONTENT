import { Router } from '@angular/router';
import { AccOpenDM } from './../../Models/deposit/AccOpenDM';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestService, InAppMessageService } from 'src/app/_service';
import {
  MessageType, mm_acc_type, mm_category, mm_customer,
  mm_operation, m_acc_master, ShowMessage, SystemValues,
  td_def_trans_trf, td_intt_dtls, td_rd_installment, tm_deposit, tm_depositall
} from '../../Models';
import { tm_denomination_trans } from '../../Models/deposit/tm_denomination_trans';
import { DatePipe, DecimalPipe } from '@angular/common';
import { tm_transfer } from '../../Models/deposit/tm_transfer';
import { tt_denomination } from '../../Models/deposit/tt_denomination';
import { mm_constitution } from '../../Models/deposit/mm_constitution';
import Utils from 'src/app/_utility/utils';
import { p_gen_param } from '../../Models/p_gen_param';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { mm_oprational_intr } from '../../Models/deposit/mm_oprational_intr';
import { LoanOpenDM } from '../../Models/loan/LoanOpenDM';
import { Observable } from 'rxjs/internal/Observable';
import { INRCurrencyPipe } from'src/app/_utility/filter';
import { td_accholder } from '../../Models/deposit/td_accholder';

 
@Component({
  selector: 'app-accoun-transactions',
  templateUrl: './accoun-transactions.component.html',
  styleUrls: ['./accoun-transactions.component.css'],
  providers: [DatePipe, INRCurrencyPipe]
})
export class AccounTransactionsComponent implements OnInit {
  td_def_trans_trf: any;
  constructor(private INRCurrency: INRCurrencyPipe,private svc: RestService, private msg: InAppMessageService,
    private frmBldr: FormBuilder, public datepipe: DatePipe, private router: Router,private  dcml:DecimalPipe,
    private modalService: BsModalService) { }
  get f() { return this.accTransFrm.controls; }
  get td() { return this.tdDefTransFrm.controls; }
  static existingCustomers: mm_customer[] = [];
  static constitutionList: mm_constitution[] = [];
  static operationalInstrList: mm_oprational_intr[] = [];
  public static operations: mm_operation[] = [];
  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;
  @ViewChild('saveBtn', { static: true }) saveBtn: ElementRef;
  @ViewChild('unappconfirm', { static: true }) unappconfirm: TemplateRef<any>;
  @ViewChild('getalltrans', { static: true }) getalltrans: TemplateRef<any>;
  @ViewChild('HWHsbClose', { static: true }) HWHsbClose: TemplateRef<any>;
  @ViewChild('preClose', { static: true }) preClose: TemplateRef<any>;
  @ViewChild('preClose', { static: true }) preCloseMIS: TemplateRef<any>;
  @ViewChild('preCloseDbs', { static: true }) preCloseDbs: TemplateRef<any>;
  @ViewChild('interestMsg', { static: true }) interestMsg: TemplateRef<any>;
  @ViewChild('afterMatRenewal', { static: true }) afterMatRenewal: TemplateRef<any>;
  @ViewChild('afterMatClose', { static: true }) afterMatClose: TemplateRef<any>;
  @ViewChild('netWorth', { static: true }) netWorth: TemplateRef<any>;

  @ViewChild('effint', { static: true }) effint: ElementRef;
  operations: mm_operation[];
  unApprovedTransactionLst: td_def_trans_trf[] = [];
  unApprovedTransactionLstOfAcc: td_def_trans_trf[] = [];
  selectedUnapprovedTransactionToEdit: td_def_trans_trf;
  disableOperation = true;
  AcctTypes: mm_operation[];
  transType: DynamicSelect;
  isLoading: boolean;
  errorFlag:boolean=false;
  resetClicked = false;
  closeInt: any;
  custBrnCd:any;
  MIScloseInt:any;
  matInt: any;
  Formatamount:any;
  selOprn2:any;
  sbCloseInterestHWH=0;
  sys = new SystemValues();
  accTransFrm: FormGroup;
  tdDefTransFrm: FormGroup;
  showTransMode = false;
  showTransModeForR = false;
  showTransactionDtl = false;
  hideOnClose = false;
  showAmtDrpDn = false;
  disableSave:boolean = false;
  TrfTotAmt = 0;
  showInterestDtls = false;
  showRdInstalment = false;
  showMisInstalment = false;
  accDtlsFrm: FormGroup;
  ShadowBalance: number;
  showBalance = false;
  showTransfrTyp = true;
  suggestedCustomer: mm_customer[];
  customerList: mm_customer[] = [];
  td_deftrans = new td_def_trans_trf();
  td_deftranstrfList: td_def_trans_trf[] = [];
  tm_transferList: tm_transfer[] = [];
  accountTypeList: mm_acc_type[] = [];
  accountTypeList2: mm_acc_type[] = [];
  accountTypeList3: mm_acc_type[] = [];
  acc_master: m_acc_master[] = [];
  acc_master1: m_acc_master[] = [];
  tm_deposit = new tm_deposit();
  selectedCust: any;
  accNoEnteredForTransaction: tm_depositall;
  rdInstallemntsForSelectedAcc: td_rd_installment[] = [];
  misInstallemntsForSelectedAcc: td_intt_dtls[] = [];
  misInstallemntsFor_B: td_intt_dtls[] = [];
  misPreMatClose:boolean=false;
  fdInstallemntsForSelectedAcc: td_intt_dtls[] = [];
  allApproveTrans:any[]=[];
  StandingRD:any=[];
  StandingArr:any=[];
  StandingArr2:any;
  preTransactionDtlForSelectedAcc: td_def_trans_trf[] = [];
  rdInstallamentOption: any[] = [];
  showOnRenewal = false;
  showOnClose = false;
  rdPenal:Number=0
  mat_val = 0;
  isMat: any;
  afMat: any;
  afMat1: any;
  lastInst: any;
  prevTransForDsp: any
  showtransmodeforC = false
  // showTranferType = true;
  showMsg: ShowMessage;
  showInstrumentDtl = false;
  tm_denominationList: tm_denomination_trans[] = [];
  denominationList: tt_denomination[] = [];
  denominationGrandTotal = 0;
  modalRef: BsModalRef;
  modalRefClose: BsModalRef;
  diff: any;
  diff1: any;
  aftmatInt:any;
  editDeleteMode = false;
  showCloseInterest = false;
  suggestedCustomerCr: mm_customer[];
  indxsuggestedCustomerCr = 0;
  deftransfrmData: any;
  resBrnCd: any;
  resBrnCatgCd: any;
  deptransData: any;
  showtransdetails = false;
  effInt: any;
  closeRt: any;
  constCd: any;
  selOprn: any;
  counter = 0;
  counter1 = 0;
  prematurePrnForMis: any;
  matureIntForMis: any;
  res_rt: any;
  tddefAccTypCd: any;
  rdInClose: any;
  editdelcontainer: any;
  trftype = '';
  resbrnCD1: any
  trans: any;
  remarks: any;
  disabledOnNull = true;
  shownoresult = false
  disabledTrfOnNull = true
  accountType: any;
  misSum=0;
  fdSum=0
  totalDueRD=0;
  hidegl:boolean=true;
  glHead:any;
  interestPeriod=0
  intt=0
  inttMsg=''
  joinHold:any=[];
  joinHolddtls:any;
  forB:number;
  args:any
  categories:any;
  allcategories:any;
  reportData:any=[];
  reportData1:any=[];
  coustCD:any;
  custName:any
  showNW:boolean;
  custUCIC:number=0
  config = {
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-xl'
  };
  kycForAllHolder:boolean=true;
  AllHolder:td_accholder[];
  acc_OWNER:any=null;
  paidRDinstlNo:Number;
  RDAllInstlPaid:boolean=false;
  accOpenDt:any;
  new_acc_status:boolean=false;
  showLockType:boolean=false;
  interestAmount:number=0;
  customerFullData:mm_customer;
  // disableIntt:boolean=false;
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }
  
  ngOnInit(): void {
    this.showNW=true;
    
    this.isLoading = false;
    setTimeout(() => {
      this.getOperationMaster();
      this.getAccountTypeList();
      this.getCustomerList();
      this.getDenominationList();
      this.getConstitutionList();
      this.getOperationalInstr();
      this.getRDActiveList();
      // this.getAllCustomer();
    }, 150);

    this.accTransFrm = this.frmBldr.group({
      acc_type_cd: [''],
      oprn_cd: [''],
      acct_num: ['']
    });
    this.tdDefTransFrm = this.frmBldr.group({
      trans_dt: [''],
      trans_cd: [''],
      acc_type_cd: [''],
      acc_type_desc: [''],
      acc_num: [''],
      trans_type_key: [''],
      trans_type: [''],
      trans_mode: [''],
      trans_mode1: [''],
      amount: [''],
      amount0: [''],
      instrument_dt: [''],
      instrument_num: [''],
      paid_to: [''],
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
      eff_int: [''],
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
      penal_rt: [''],
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
      td_def_mat_amt: [''],
      closeIntrest: [''],
      balance: [''],
      intra_brn_cd: [this.sys.BranchCode],
      home_brn_cd: ['Y'],
    });
    this.resetTransfer();
    this.resetAccDtlsFrmFormData();

    this.tdDefTransFrm.valueChanges.subscribe(e=>{
      if(e.amount0){

        // e.amount = +e.amount;
        // e.amount = e.amount.toFixed(2);
        // console.log(e.amount);
        // const result = e.amount.toString().split('.');
        // let lastThree = result[0].substring(result[0].length - 3);
        // const otherNumbers = result[0].substring(0, result[0].length - 3);
        // if (otherNumbers !== '' && otherNumbers !== '-') {
        //   lastThree = ',' + lastThree;
        // }
        // let output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
        //  console.log(result);
        // if (result.length > 1) {
        //   output += '.' + result[1];
        // }



        const _num = e.amount0.toString().split(".");
        let lastThree = _num[0].replace(/,/g, '').substring(_num[0].replace(/,/g, '').length - 3);
        const otherNumbers = _num[0].replace(/,/g, '').substring(0, _num[0].replace(/,/g, '').length - 3);
        if (otherNumbers !== '' && otherNumbers !== '-') {
            lastThree = ',' + lastThree;
          }
        console.log(_num);
        console.log(lastThree);
        console.log(otherNumbers);
        console.log(_num[0].length);
        // console.log();

        
         if(_num[0].replace(/,/g, '').length>1 ){
          _num[0] = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',')+lastThree;
        }
        
        // _num[0] = this.dcml.transform(_num[0].replace(/\B(?=(\d{2})+(?!\d))/g, ','));

        // _num[0] = this.dcml.transform(_num[0].replace(/,/g, ''));

        let final_num=_num.join('.')
        console.log(final_num);
        console.log(_num);
        
        this.tdDefTransFrm.patchValue({
           amount0:final_num,
           amount:parseFloat(e.amount0.replace(/,/g, ''))
        // amount:output
        },{emitEvent:false})
        console.log(parseFloat(e.amount0.replace(/,/g, '')))
        console.log(this.tdDefTransFrm.controls.amount0.value);

      }
      
    })

  }
getRDActiveList(){

}
  // private getAllCustomer(): void {
  //   if (undefined !== AccounTransactionsComponent.existingCustomers &&
  //     null !== AccounTransactionsComponent.existingCustomers &&
  //     AccounTransactionsComponent.existingCustomers.length > 0) {
  //   } else {
  //     const cust = new mm_customer(); cust.cust_cd = 0;
  //     this.isLoading = true;
  //     this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
  //       res => {
  //         AccounTransactionsComponent.existingCustomers = res;
  //         this.isLoading = false;
  //       },
  //       err => { this.isLoading = false; }
  //     );
  //   }
  // }
  private getCategoryMaster(): void {
    this.svc.addUpdDel<mm_category[]>('Mst/GetCategoryMaster', null).subscribe(
      res => {
        this.allcategories = res;
        this.allcategories=this.allcategories.filter(e=>e.catg_cd==this.categories)
        console.log(this.allcategories);
        this.categories=this.allcategories[0].catg_desc
        console.log(this.categories);
        debugger
        this.accDtlsFrm.controls.category.setValue(this.categories);
      },
      err => { }
    );
  }
  public suggestCustomer(): Observable<mm_customer> {
    this.resetClicked = false;
    this.isLoading = true;
    console.log("here")
    // console.log(this.f.acct_num.value.length)
    //  console.log(this.accDtlsFrm.get('home_brn_cd').value)
    if (this.f.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.f.acct_num.value.toLowerCase();
      console.log(prm.ardb_cd);

      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          console.log(res)
          this.isLoading = false;
          console.log(this.f.acct_num.value)
          if (undefined !== res && null !== res && res.length > 0 && res != '' && this.f.acct_num.value) {
            this.suggestedCustomer = [];
            // this.suggestedCustomer = res.slice(0, 10);
            this.suggestedCustomer = res
            console.log(res.length + " " + this.suggestedCustomer.length)
            return this.suggestedCustomer;
          } else {
            this.shownoresult = true;
            console.log(res.length)
            this.suggestedCustomer = [];
            return this.suggestedCustomer;
          }
        },
        err => {
          this.shownoresult = true;
          this.isLoading = false;
        }
      );


    } else {
      // debugger;
      this.isLoading = false;
      this.suggestedCustomer = null;
      return null;
    }
    // console.log(this.suggestedCustomer)
  }
  clearSuggestedCust() {
    this.suggestedCustomer = null;
    this.shownoresult = false;
    if (this.f.acct_num.value.length > 0) {
      this.disabledOnNull = false;
    }
    else {
      this.disabledOnNull = true;
    }


  }
  calculateInterestRate() {
    const temp_gen_param2 = new p_gen_param();
    temp_gen_param2.ardb_cd=this.sys.ardbCD;
    temp_gen_param2.acc_cd = this.f.acc_type_cd.value;
    temp_gen_param2.from_dt = this.sys.CurrentDate;
    temp_gen_param2.ls_catg_cd = this.allcategories[0].catg_cd;
    const o = Utils.convertStringToDt(this.td.opening_dt.value);
      const m = Utils.convertStringToDt(this.td.mat_dt.value);
      const diffDays = Math.ceil((Math.abs(m.getTime() - o.getTime())) / (1000 * 3600 * 24));
      temp_gen_param2.ai_period = diffDays;
    // temp_gen_param2.ai_period = Math.floor((Date.UTC(this.td.mat_dt.getFullYear(),
    //   this.td.mat_dt.getMonth(), this.td.mat_dt.getDate()) -
    //   (Date.UTC(this.td.dep_period_y.value.getFullYear(), this.td.dep_period_m.value.getMonth(),
    //   this.td.dep_period_d.value.getDate()))) / (1000 * 60 * 60 * 24)) - 1;
    this.svc.addUpdDel<any>('Deposit/GET_INT_RATE', temp_gen_param2).subscribe(
      // var dt = {
      //   "ardb_cd": this.sys.ardbCD,
      //   "acc_type_cd": 2,
      //   "catg_cd":this.tm_deposit.category_cd,
      //   "no_of_days":Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(),
      //      this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) -
      //   (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(),
      //   this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24)) - 1
      // }
    //  this.svc.addUpdDel<any>('Deposit/GetInttRate', dt).subscribe(

      res => {
        //debugger;
        this.td.intt_rate.setValue(Number(res));
        if(res){
            const temp_gen_param2 = new p_gen_param();
          temp_gen_param2.ardb_cd=this.sys.ardbCD;
          temp_gen_param2.ad_prn_amt=(this.sys.ardbCD=='4'&&(this.f.acc_type_cd.value === 2 || this.f.acc_type_cd.value == 4))?this.accNoEnteredForTransaction.prn_amt:this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt;///13
          temp_gen_param2.ad_acc_type_cd=2;
          temp_gen_param2.ad_intt_rt = +res;//Need to be change in future
          temp_gen_param2.as_intt_type = "O" ;
          const o = Utils.convertStringToDt(this.td.opening_dt.value);
          const m = Utils.convertStringToDt(this.td.mat_dt.value);
          const diffDays = Math.ceil((Math.abs(m.getTime() - o.getTime())) / (1000 * 3600 * 24));
          temp_gen_param2.ai_period = diffDays;
          debugger
          this.f_calctdintt_reg(temp_gen_param2);
          
        }
      },
      err => {
        console.log(err);
      }
    );

  }
  processInterest(): void {
    debugger
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
      if (this.td.intt_trf_type.value === '' ||
        this.td.intt_rate.value === '') {
        return;
      }
      // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      // this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
      // this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
      // this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);

console.log(this.td.amount.value,this.td.curr_intt_recov.value);

debugger
      // var temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = +this.td.acc_type_cd.value;
      // temp_gen_param.ad_prn_amt = this.td.intt_trf_type.value!='O'? +this.td.amount.value:this.td.td_def_mat_amt.value;
      // temp_gen_param.ad_prn_amt = this.td.amount.value+this.td.curr_intt_recov.value; //PARTHA
      temp_gen_param.ad_prn_amt = this.td.amount.value;
      temp_gen_param.adt_temp_dt =this.td.opening_dt?.value? Utils.convertStringToDt(this.td.opening_dt?.value):null;
      temp_gen_param.as_intt_type = this.td.intt_trf_type.value;
      // tslint:disable-next-line: max-line-length
      // if (typeof (this.td.opening_dt) === 'string') {
      //   this.tm_deposit.opening_dt = Utils.convertStringToDt(this.td.opening_dt.value);
      // }
debugger
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
        this.mat_val = this.tm_deposit.mat_val
        this.isLoading = false;
      },
      err => {
        this.tm_deposit.intt_amt = 0;
        this.isLoading = false;

      }
    );
  }  
  calCrdIntOpenTime(tempGenParam: p_gen_param): void {
    this.isLoading = true;
    
    this.svc.addUpdDel<any>('Deposit/F_CALCRDINTT_REG', tempGenParam).subscribe(
      res => {
        // this.tm_deposit.intt_amt = res;
        this.accDtlsFrm.patchValue({
          RD_mat_amount:Number(Number(this.accNoEnteredForTransaction.instl_no) * Number(this.accNoEnteredForTransaction.instl_amt)) +res
        });
        // this.tm_deposit.mat_val = ;
        this.isLoading = false;
      },
      err => {
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
        if (this.f.acc_type_cd.value != 5)
          this.mat_val = Number(temp_gen_param.ad_prn_amt) + Number(this.tdDefTransFrm.controls.interest.value);
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;

      }
    );
  }

    async F_CALC_SB_INTT() {
    const prm = new p_gen_param();
    console.log(this.f.acc_type_cd.value)
    prm.as_acc_num = this.f.acct_num.value;
    prm.from_dt = this.sys.SBInttCalTillDt;
    prm.to_dt = this.sys.CurrentDate;
    prm.brn_cd = this.sys.BranchCode;
    prm.ad_acc_type_cd = this.f.acc_type_cd.value;
    debugger
    this.isLoading=true;
    this.sbCloseInterestHWH=0;
    const data = await this.svc.addUpdDel<any>('Deposit/F_CALC_SB_INTT', prm).toPromise()
    debugger
    if(data>=0){
      debugger
      this.sbCloseInterestHWH=(+data)
      this.isLoading=false;
        this.showCloseInterest = this.f.acc_type_cd.value==1 || this.f.acc_type_cd.value==8 ? true : false;
      if(this.sys.ardbCD=="23"){
        this.modalRef = this.modalService.show(this.HWHsbClose,
          { class: 'modal-sm', keyboard: false, backdrop: true, ignoreBackdropClick: false })
      
        this.tdDefTransFrm.patchValue({
          closeIntrest:0,
          amount: this.accNoEnteredForTransaction.curr_bal ,
          td_def_mat_amt:this.accNoEnteredForTransaction.curr_bal ,
          paid_to: 'SELF',
          particulars: 'To Closing',
        });
        this.tdDefTransFrm.controls.closeIntrest.disable()
      }
      else{
        this.tdDefTransFrm.patchValue({
          closeIntrest:this.sys.ardbCD=='4'&& this.f.acc_type_cd.value==8? 0:(+data),
        });
        if(this.sys.ardbCD!='20'&&this.sys.ardbCD!='4'&&this.sys.ardbCD!='2'){
          this.td.closeIntrest.value
          debugger
          this.tdDefTransFrm.patchValue({
            amount: this.accNoEnteredForTransaction.curr_bal ,
            td_def_mat_amt:(this.accNoEnteredForTransaction.curr_bal + Number(this.td.closeIntrest.value)).toFixed(2),
            paid_to: 'SELF',
            particulars: 'To Closing',
          })
          
        }
        else{
          this.tdDefTransFrm.patchValue({
            amount: (this.accNoEnteredForTransaction.curr_bal ),
            td_def_mat_amt:(this.accNoEnteredForTransaction.curr_bal + Number(this.td.closeIntrest.value)).toFixed(2),
            paid_to: 'SELF',
            particulars: 'To Closing',
          })
          
        }
      }
        
  
        
      }
    
    
    
    debugger
  }
  
    // this.svc.addUpdDel<any>('Deposit/F_CALC_SB_INTT', prm).subscribe(
    //   res => {
    //     console.log(res)
    //     this.showCloseInterest = this.f.acc_type_cd.value==1 || this.f.acc_type_cd.value==8 ? true : false;
    //     this.tdDefTransFrm.patchValue({
    //      closeIntrest: (+res),
    //     });
    //     console.log(this.tdDefTransFrm.controls.amount.value)
    //     this.isLoading = false;
    //   },
    //   err => {
    //     this.isLoading = false;
    //   }
    // )
  // }

  getOperationalInstr() {
    // //////////////debugger;
    if (AccounTransactionsComponent.operationalInstrList.length > 0) {
      return;
    }

    AccounTransactionsComponent.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
      res => {
        AccounTransactionsComponent.operationalInstrList = res;
      },
      err => { }
    );
  }

  getConstitutionList() {
    if (AccounTransactionsComponent.constitutionList.length > 0) {
      return;
    }

    AccounTransactionsComponent.constitutionList = [];
    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
      res => {
        console.log(res)
        // //////////////debugger;
        AccounTransactionsComponent.constitutionList = res;
      },
      err => { // ;
      }
    );
    console.log(AccounTransactionsComponent.constitutionList)
  }

  private resetAccDtlsFrmFormData(): void {
    
    this.showRdInstalment = false;
    this.showMisInstalment = false;
    this.accDtlsFrm = this.frmBldr.group({
      brn_cd: [''],
      acc_type_cd: [''],
      acc_num: [''],
      renew_id: [''],
      cust_cd: [''],
      category:[''],
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
      RD_mat_amount:['']
    });
  }
  getFDCCTDintt(val1,val2,val3,val4,val5,val6){
    const temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = +val1;
      temp_gen_param.ad_prn_amt = val2;
      temp_gen_param.adt_temp_dt = Utils.convertStringToDt(val3);
      temp_gen_param.as_intt_type = val5;
      const o = Utils.convertStringToDt(val3);
      const m = Utils.convertStringToDt(val4);
      const diffDays = Math.ceil((Math.abs(m.getTime() - o.getTime())) / (1000 * 3600 * 24));
      temp_gen_param.ai_period = diffDays;
      temp_gen_param.ad_intt_rt = +val6;
      console.log(temp_gen_param);
      if (val5 === 'O' && (val1== 2 ||val1== 3 ||val1== 4)) {
        this.isLoading=true;
      this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
        res => {
          if(res){
            this.interestAmount=+res
            this.accDtlsFrm.patchValue({
              intt_amt: +res,//tobechange
              mat_amt:this.accNoEnteredForTransaction.prn_amt + (this.interestAmount?this.interestAmount:0),
              });
              this.isLoading = false;
          }else{
            this.isLoading=false;
          }
         
        },
        err => {
          this.isLoading = false;
  
        }
      );
    }
      
}
  private setAccDtlsFrmForm(): void {
    // //////////////debugger;

    if (undefined !== this.accNoEnteredForTransaction && Object.keys(this.accNoEnteredForTransaction).length !== 0) {
      this.resetAccDtlsFrmFormData();
      this.getShadowBalance();
      this.getFDCCTDintt(
        this.accNoEnteredForTransaction.acc_type_cd,
        this.accNoEnteredForTransaction.prn_amt,
        this.accNoEnteredForTransaction.opening_dt,
        this.accNoEnteredForTransaction.mat_dt,
        this.accNoEnteredForTransaction.intt_trf_type,
        this.accNoEnteredForTransaction.intt_rt
      );
      if (this.accNoEnteredForTransaction.acc_type_cd === 2
        || this.accNoEnteredForTransaction.acc_type_cd === 3
        || this.accNoEnteredForTransaction.acc_type_cd === 4) {
        this.showInterestDtls = true;
        this.accNoEnteredForTransaction.ShowClose = true;
      }
      if (this.accNoEnteredForTransaction.acc_type_cd === 6) {
        this.showRdInstalment = true;
        this.accNoEnteredForTransaction.ShowClose = true;
      }
      if (this.accNoEnteredForTransaction.acc_type_cd === 5) {
        this.showMisInstalment = true;
        this.showInterestDtls = true;
        this.accNoEnteredForTransaction.ShowClose = true;
      }
      if (this.accNoEnteredForTransaction.acc_type_cd === 11) {
        this.showInterestDtls = true;
        this.accNoEnteredForTransaction.ShowClose = true;
      }
      const constitution = AccounTransactionsComponent.constitutionList.filter(e => e.constitution_cd
        === this.accNoEnteredForTransaction.constitution_cd)[0];
      const OprnInstrDesc = AccounTransactionsComponent.operationalInstrList.filter(e => e.oprn_cd
        === this.accNoEnteredForTransaction.oprn_instr_cd)[0];

      let intrestType = ''; this.interestPeriod=0
      if (this.accNoEnteredForTransaction.intt_trf_type === 'O') {
        intrestType = 'On Maturity';
      } 
      else if (this.accNoEnteredForTransaction.intt_trf_type === 'Y') {
        intrestType = 'Yearly'; this.interestPeriod=1
      }
      else if (this.accNoEnteredForTransaction.intt_trf_type === 'H') {
        intrestType = 'Half Yearly'; this.interestPeriod=2
      } 
      else if (this.accNoEnteredForTransaction.intt_trf_type === 'Q') {
        intrestType = 'Quarterly'; this.interestPeriod=4
      } 
      else if (this.accNoEnteredForTransaction.intt_trf_type === 'M') {
        intrestType = 'Monthly'; this.interestPeriod=12
      }
      console.log(this.td.amount.value)
      console.log(this.accNoEnteredForTransaction.prn_amt + this.interestAmount?this.interestAmount:0);
      debugger
      // console.log(this.accNoEnteredForTransaction.intt_trf_type=='H' || this.accNoEnteredForTransaction.intt_trf_type=='Q'? this.td.amount.value :this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt)
      this.accDtlsFrm.patchValue({
        brn_cd: this.accNoEnteredForTransaction.brn_cd,
        acc_type_cd: this.accNoEnteredForTransaction.acc_type_cd,
        acc_num: this.accNoEnteredForTransaction.acc_num,
        renew_id: this.accNoEnteredForTransaction.renew_id,
        cust_cd: this.accNoEnteredForTransaction.cust_cd,
        cust_name: this.accNoEnteredForTransaction.cust_name,
        intt_trf_type: intrestType,
        constitution_cd: this.accNoEnteredForTransaction.constitution_cd,
        constitution_cd_desc: this.accNoEnteredForTransaction.constitution_desc,
        oprn_instr_cd: this.accNoEnteredForTransaction.oprn_instr_cd,
        oprn_instr_cd_desc: (undefined !== OprnInstrDesc && null !== OprnInstrDesc
          && undefined !== OprnInstrDesc.oprn_desc && null !== OprnInstrDesc.oprn_desc) ?
          OprnInstrDesc.oprn_desc : null,
        opening_dt: this.accNoEnteredForTransaction.opening_dt.toString().substr(0, 10),
        prn_amt: this.accNoEnteredForTransaction.prn_amt,
        intt_amt: this.accNoEnteredForTransaction.intt_amt,
        // mat_amt:this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt,
        mat_amt: this.accNoEnteredForTransaction.intt_trf_type === 'H'  ||this.accNoEnteredForTransaction.intt_trf_type === 'Y'  ||this.accNoEnteredForTransaction.intt_trf_type === 'Q'? this.accNoEnteredForTransaction.prn_amt + this.interestPeriod*this.accNoEnteredForTransaction.intt_amt : this.accNoEnteredForTransaction.prn_amt + (this.interestAmount?this.interestAmount:0),
        
        
        dep_period_y: null === this.accNoEnteredForTransaction.dep_period ? ''
          : (this.accNoEnteredForTransaction.dep_period.split(';')[0].split('=')[1]),
        dep_period_m: null === this.accNoEnteredForTransaction.dep_period ? ''
          : (this.accNoEnteredForTransaction.dep_period.split(';')[1].split('=')[1]),
        dep_period_d: null === this.accNoEnteredForTransaction.dep_period ? ''
          : (this.accNoEnteredForTransaction.dep_period.split(';')[2].split('=')[1]),
        instl_amt: this.accNoEnteredForTransaction.instl_amt,
        instl_no: this.accNoEnteredForTransaction.instl_no,
        mat_dt: this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10),
        intt_rt: this.accNoEnteredForTransaction.intt_rt,
        tds_applicable: this.accNoEnteredForTransaction.tds_applicable,
        last_intt_calc_dt: this.accNoEnteredForTransaction.last_intt_calc_dt.toString().substr(0, 10),
        acc_close_dt: this.accNoEnteredForTransaction.ShowClose ? this.datepipe.transform(this.sys.CurrentDate, 'dd/MM/yyy') : null,
        // acc_close_dt: this.accNoEnteredForTransaction.ShowClose ? Utils.getTodaysDtInCorrectFormat() : null,
        closing_prn_amt: this.accNoEnteredForTransaction.closing_prn_amt,
        closing_intt_amt: this.accNoEnteredForTransaction.closing_intt_amt,
        penal_amt: this.accNoEnteredForTransaction.penal_amt,
        ext_instl_tot: this.accNoEnteredForTransaction.ext_instl_tot,
        mat_status: this.accNoEnteredForTransaction.mat_status,
        acc_status: this.accNoEnteredForTransaction.acc_status,
        curr_bal: this.accNoEnteredForTransaction.curr_bal,
        clr_bal: this.accNoEnteredForTransaction.clr_bal, //marker
        standing_instr_flag: this.accNoEnteredForTransaction.standing_instr_flag,
        cheque_facility_flag: this.accNoEnteredForTransaction.cheque_facility_flag,
        approval_status: this.accNoEnteredForTransaction.approval_status,
        approved_by: this.accNoEnteredForTransaction.approved_by,
        approved_dt: this.accNoEnteredForTransaction.approved_dt,
        user_acc_num: this.accNoEnteredForTransaction.user_acc_num,
        lock_mode: this.accNoEnteredForTransaction.lock_mode,
        loan_id: this.accNoEnteredForTransaction.loan_id,
        cert_no: this.accNoEnteredForTransaction.cert_no,
        bonus_amt: this.accNoEnteredForTransaction.bonus_amt,
        penal_intt_rt: this.accNoEnteredForTransaction.penal_intt_rt,
        bonus_intt_rt: this.accNoEnteredForTransaction.bonus_intt_rt,
        transfer_flag: this.accNoEnteredForTransaction.transfer_flag,
        transfer_dt: this.accNoEnteredForTransaction.transfer_dt,
        agent_cd: this.accNoEnteredForTransaction.agent_cd,
       
      });
      // 
console.log(this.accDtlsFrm.controls.mat_amt.value);

      if(this.accNoEnteredForTransaction.acc_type_cd==6){
        const temp_gen_param = new p_gen_param();

        temp_gen_param.ad_acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
    
          temp_gen_param.ad_instl_amt = +this.accNoEnteredForTransaction.instl_amt;
          temp_gen_param.an_instl_no = +this.accNoEnteredForTransaction.instl_no;
          temp_gen_param.an_intt_rate = +this.accNoEnteredForTransaction.intt_rt;
          this.calCrdIntOpenTime(temp_gen_param);

      const rdInstallament = new td_rd_installment();

      rdInstallament.acc_num = this.accNoEnteredForTransaction.acc_num;
      this.svc.addUpdDel<any>('Deposit/GetRDInstallment', rdInstallament).subscribe(
        rdInstallamentRes => {
          this.rdInstallemntsForSelectedAcc = [];
          this.rdInstallemntsForSelectedAcc = Utils.ChkArrNotEmptyRetrnEmptyArr(rdInstallamentRes);
          let i = 0;
          this.rdInstallemntsForSelectedAcc.forEach(e => {
            if (e.status.toLocaleLowerCase() === 'p') {
              // this.rdInstallamentOption.push(acc.instl_amt * i);
              i = i + 1;
            }
            this.accDtlsFrm.patchValue({

              curr_bal: this.accNoEnteredForTransaction.instl_amt*i,
             clr_bal: this.accNoEnteredForTransaction.instl_amt*i,
            })
          });
        },
        rdInstallamentErr => { console.log(rdInstallamentErr); }
      );
      }
    } else {
      this.accDtlsFrm.reset();
      this.showRdInstalment = false;
      this.showMisInstalment = false;
    }
  }

  private getShadowBalance(): void {
    const tmDep = new tm_deposit();
    this.ShadowBalance = 0;
    tmDep.acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
    // tmDep.brn_cd = this.accNoEnteredForTransaction.brn_cd;
    tmDep.acc_num = this.accNoEnteredForTransaction.acc_num;
    tmDep.ardb_cd = this.sys.ardbCD;
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

  getCustomerList() {
    const cust = new mm_customer();
    cust.cust_cd = 0;
    cust.brn_cd = this.sys.BranchCode;

    // cust.ardb_cd = this.sys.ardbCD;
    if (this.customerList === undefined || this.customerList === null || this.customerList.length === 0) {
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
        res => {
          this.isLoading = false;
          this.customerList = res;
        },
        err => {
          this.isLoading = false;

        }
      );
    }
    else { this.isLoading = false; }
  }

  private getOperationMaster(): void {
    console.log(AccounTransactionsComponent.operations);

    this.isLoading = true;
    if (undefined !== AccounTransactionsComponent.operations &&
      null !== AccounTransactionsComponent.operations &&
      AccounTransactionsComponent.operations.length > 0) {
      this.isLoading = false;
      this.AcctTypes = AccounTransactionsComponent.operations.filter(e => e.module_type === 'DEPOSIT')
        .filter((thing, i, arr) => {
          return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
        });
      this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
    } else {
      this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
        res => {
          console.log(res)
          AccounTransactionsComponent.operations = res;
          this.isLoading = false;
          this.AcctTypes = AccounTransactionsComponent.operations.filter(e => e.module_type === 'DEPOSIT')
            .filter((thing, i, arr) => {
              return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
            });
          this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
        },
        err => { this.isLoading = false; }
      );
    }
    console.log(this.AcctTypes);

  }

  /** method fires on account type change */
  public onAcctTypeChange(): void {
    this.accountTypeList3=[]
    if(this.accTransFrm.controls.acc_type_cd.value==1){
      this.accountTypeList3 = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
      this.accountTypeList3 =this.accountTypeList3.filter(e=>e.acc_type_cd!=2 && e.acc_type_cd!=3 && e.acc_type_cd!=4 && e.acc_type_cd!=5 && e.acc_type_cd!=6 && e.acc_type_cd!=11)
      this.accountTypeList3 = this.accountTypeList3.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
    }
    else if(this.accTransFrm.controls.acc_type_cd.value==7){
      this.accountTypeList3 = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
      this.accountTypeList3 =this.accountTypeList3.filter(e=>e.acc_type_cd!=2 && e.acc_type_cd!=3 && e.acc_type_cd!=4 && e.acc_type_cd!=5 && e.acc_type_cd!=6 && e.acc_type_cd!=11)
      this.accountTypeList3 = this.accountTypeList3.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
    }
    else if(this.accTransFrm.controls.acc_type_cd.value==8){
      this.accountTypeList3 = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
      this.accountTypeList3 =this.accountTypeList3.filter(e=>e.acc_type_cd!=2 && e.acc_type_cd!=3 && e.acc_type_cd!=4 && e.acc_type_cd!=5 && e.acc_type_cd!=6 && e.acc_type_cd!=11)
      this.accountTypeList3 = this.accountTypeList3.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
    }
    else if(this.accTransFrm.controls.acc_type_cd.value==9){
      this.accountTypeList3 = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
      this.accountTypeList3 =this.accountTypeList3.filter(e=>e.acc_type_cd!=2 && e.acc_type_cd!=3 && e.acc_type_cd!=4 && e.acc_type_cd!=5 && e.acc_type_cd!=6 && e.acc_type_cd!=11)
      this.accountTypeList3 = this.accountTypeList3.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
    }
    else{
      this.accountTypeList3 =this.accountTypeList
    }
    this.suggestedCustomer=[]
    console.log(this.f.acc_type_cd.value)
    this.tm_denominationList = [];
    this.accNoEnteredForTransaction = undefined;
    this.resetTransfer();
    this.f.acct_num.reset(); this.f.oprn_cd.reset();
    this.tdDefTransFrm.reset(); this.showTransactionDtl = false;
    this.HandleMessage(false);
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
    // this.refresh = false;
    // this.msg.sendCommonTmDepositAll(null);
    // this.refresh = true;
  }

  public SelectCustomer(cust: any): void {
    // this.optionClicked=true;
    if(cust){this.showNW=false;}
    this.shownoresult = false;
    this.selectedCust = cust.acc_num
    console.log(cust)
    this.f.acct_num.setValue(cust.acc_num);
    this.onAccountNumTabOff();
    // this.f.acct_num.value.length=0;
    this.suggestedCustomer = [];
   

  }
getjoinholder(){
//   acc_num
// : 
// "1010000051"
// acc_type_cd
// : 
// 1

// ardb_cd
// : 
// "20"
// brn_cd
// : 
// "101"
// tdaccholder[0].acc_holder

  // this.joinHoldIdx = this.selectedCust;
   // this.isLoading = false;
        // if (undefined !== res && null !== res && res.length > 0) {
        //   this.joinHolddtls = res
         
          
        // } else {
        //   this.joinHolddtls = null;
        // }
  const acc= new tm_depositall()
  const t = new td_def_trans_trf();
    this.isLoading = true;
    t.brn_cd = this.sys.BranchCode;
    t.acc_num = acc.acc_num;
    t.acc_type_cd = acc.acc_type_cd;
    t.ardb_cd= acc.ardb_cd;
    
  
}
  public onAccountNumTabOff(): void {
    debugger
    this.tm_denominationList = [];
    this.resetTransfer();
    this.tdDefTransFrm.reset(); this.showTransactionDtl = false;
    this.f.oprn_cd.disable(); this.f.oprn_cd.reset();
    this.disableOperation = true;
    // this.showTranferType = true;
    // console.log('onAccountNumTabOff -' + this.f.acct_num.value);
    this.isLoading = true;
    this.showMsg = null;
    let acc = new tm_depositall();
    acc.acc_num = '' + this.f.acct_num.value;
    acc.acc_type_cd = +this.f.acc_type_cd.value;
    acc.brn_cd = this.sys.BranchCode;

    acc.ardb_cd = this.sys.ardbCD;
    this.custName='';
    this.custUCIC=0
    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', acc).subscribe(
      res => {
        if(res[0]?.constitution_cd==101){
          this.HandleMessage(true, MessageType.Error,
            ' Deposit and Withdrawal Operation was not POSSIBLE!! for this Account Number :' + this.f.acct_num.value  );
          this.onResetClick();
          this.isLoading = false;
          return false;
        }
        if(res[0]?.cust_cd){
          this.getCustInfo(res[0]?.cust_cd);
        }
        this.categories=res[0]?.catg_cd
        this.custName=res[0]?.cust_name
        this.getCategoryMaster();
        debugger
        console.log(res, this.rdInstallamentOption)
        this.resBrnCd = res;
        this.resbrnCD1 = res;
        this.resBrnCatgCd = res;
        this.constCd = this.resbrnCD1[0]?.constitution_cd
        this.resBrnCatgCd = this.resbrnCD1[0]?.catg_cd;
        console.log(this.resBrnCatgCd)
        this.resBrnCd = this.resbrnCD1[0]?.brn_cd
        console.log(this.resBrnCd)
        this.custUCIC=res[0]?.cust_cd
        this.accOpenDt=res[0]?.opening_dt;
        this.setAccFlag(this.accOpenDt,this.sys.CurrentDate)
        //////////////debugger;
        this.isLoading = false;
        let foundOneUnclosed = false;
        if (undefined !== res && null !== res && res.length > 0) {
          debugger
          this.custBrnCd=res[0]?.brn_cd;
          res.forEach(element => {
            
            if (element.acc_status === null || element.acc_status.toUpperCase() !== 'C') {
              console.log(element);
            
              foundOneUnclosed = true;
              acc = element;
              // this.resbrnCD1 = element;

              if (this.validationOnAcctTabOff(acc)) {
                this.disableOperation = false;
                this.accNoEnteredForTransaction = acc;
                this.setAccDtlsFrmForm();
                if (this.accTransFrm.controls.acc_type_cd.value != 11)
                  this.getPreviousTransactionDtl(acc);
                else {
                  this.getPreviousTransactionDtl_dsp(acc);
                }
                this.tdDefTransFrm.patchValue({
                  acc_num: acc.acc_num,
                  
                });
                debugger
                this.f.oprn_cd.enable();
              }
            }
          });
          if (!foundOneUnclosed) {
            this.HandleMessage(true, MessageType.Error,
              'Account number ' + this.f.acct_num.value + ' is closed.');
            this.onResetClick();
            return;
          }
        } else {
          this.HandleMessage(true, MessageType.Error,
            'Account number does not exists.');
          this.onResetClick();
          return;
        }
      },
      err => {
        this.f.oprn_cd.disable(); this.isLoading = false;
        console.log(err);
        this.resetAccDtlsFrmFormData();
      }
    );
    this.svc.addUpdDel<any>('Deposit/getAccountOpeningData', acc).subscribe(
      res => {
        console.log(res);
        this.acc_OWNER=res.tmdeposit.cust_cd;
        this.msg.sendcustomerCodeForKyc(res.tmdeposit.cust_cd);
        if(res.tdaccholder.length>0){
          this.kycForAllHolder=false;
          this.AllHolder=res.tdaccholder;
          debugger
        }
        else{
          this.kycForAllHolder=true;
          this.AllHolder=[];
          this.msg.sendcustomerCodeForKyc(res.tmdeposit.cust_cd);
        }
        debugger
        if(res.tmdeposit.cust_cd){
          this.coustCD=res.tmdeposit.cust_cd
          this.reportData.length=0;
          this.reportData1.length=0;
          var dt={
            "ardb_cd":this.sys.ardbCD,
            "brn_cd":this.sys.BranchCode,
            "cust_cd":res.tmdeposit.cust_cd
          }
        
          this.isLoading=true
          this.svc.addUpdDel('UCIC/GetLoanDtls',dt).subscribe(data=>{console.log(data)
            this.reportData=data
            for(let i=0;i<this.reportData.length;i++){
              this.reportData[i].acc_desc= this.accountTypeList2.filter(c => c.acc_type_cd == this.reportData[i].acc_cd)[0]?.acc_type_desc;
            }
            this.svc.addUpdDel('UCIC/GetDepositDtls',dt).subscribe(data=>{console.log(data)
              this.reportData1=data;
              for(let i=0;i<this.reportData1.length;i++){
                this.reportData1[i].acc_type_cd= this.accountTypeList.filter(c => c.acc_type_cd == this.reportData1[i].acc_type_cd)[0].acc_type_desc;
              }
              this.isLoading=false
            })
          })
        }
        this.joinHold=[];
        for (let i = 0; i <= res.tdaccholder.length; i++) {
          console.log(res);
          
        this.joinHold+=(res.tdaccholder.length==0?'':res.tdaccholder[i].acc_holder+',')
        console.log(this.joinHold);
        }
        
       
      },
      err => { this.isLoading = false; }
    );

  }
    private getCustInfo(CustCd: number): void {
    this.isLoading = true;
    // this.showCust = false; // this is done to forcibly rebind the screen
    const cust = new mm_customer(); cust.cust_cd = CustCd;
    this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
      res => {
        this.customerFullData = res[0];
        this.isLoading = false;
        const aadhar = this.customerFullData.aadhar?.toString() || '';
        const pan = this.customerFullData.pan?.toString() || '';
        const custName = this.accDtlsFrm.controls.cust_name.value;

        // Check both Aadhar and PAN are missing or invalid
        if (aadhar.length < 5 && pan.length < 5) {
          this.HandleMessage(true, MessageType.Warning,
            `Account for ${custName} does not have full KYC completed.`);
        }
        // Check both are valid
        else if (aadhar.length > 5 && pan.length > 5) {
          this.HandleMessage(true, MessageType.Sucess,
            `Account for ${custName} has successfully completed full KYC.`);
        }
        // Aadhar valid, PAN invalid
        else if (aadhar.length > 5 && pan.length < 5) {
          this.HandleMessage(true, MessageType.Warning,
            `Account for ${custName} has Aadhar uploaded but PAN not verified.`);
        }
        // PAN valid, Aadhar invalid
        else if (aadhar.length < 5 && pan.length > 5) {
          this.HandleMessage(true, MessageType.Warning,
            `Account for ${custName} has PAN uploaded but Aadhar not verified.`);
        }

        debugger
      },
      err => { this.isLoading = false; }
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
  private getPreviousTransactionDtl(acc: tm_depositall): void {
    //////////////debugger;
    this.preTransactionDtlForSelectedAcc = [];
    const t = new td_def_trans_trf();
    t.brn_cd = this.sys.BranchCode;
    t.acc_num = acc.acc_num;
    t.acc_type_cd = acc.acc_type_cd;
    console.log(JSON.stringify(t));
    this.svc.addUpdDel<any>('Deposit/GetPrevTransaction', t).subscribe(
      res => {
         if(res.length>0){//PARTHA
        console.log(res);
        debugger;
        let prTrans = [];
        prTrans = Utils.ChkArrNotEmptyRetrnEmptyArr(res);
        this.preTransactionDtlForSelectedAcc = [];
        let tot = acc.clr_bal;
        console.log(tot);
        prTrans[0].balance=acc.clr_bal
        console.log( prTrans);
        this.preTransactionDtlForSelectedAcc.push(prTrans[0]);
        
        // if(this.preTransactionDtlForSelectedAcc[0].Balance)
        // this.preTransactionDtlForSelectedAcc.push(prTrans[0].balance);
        for (let i = 0; i <= prTrans.length; i++) {
          // prTrans[i].TransDtAsString = prTrans[i].trans_dt.toString().substring(0, 10);
          if (i > 0) {
            if (prTrans[i - 1].trans_type === 'D') { // deposit
              tot -= +(prTrans[i - 1].amount);
            } else {
              tot += +(prTrans[i - 1].amount);
            }
             prTrans[i].balance = tot;
             this.preTransactionDtlForSelectedAcc.push(prTrans[i]);
          }
        }
        // this.preTransactionDtlForSelectedAcc.push(prTrans[0]);

        // this.preTransactionDtlForSelectedAcc[0].Balance=acc.clr_bal
         console.log(this.preTransactionDtlForSelectedAcc[0]);
        // this.preTransactionDtlForSelectedAcc = this.preTransactionDtlForSelectedAcc.((a, b) => (a.trans_dt < b.trans_dt ? -1 : 1));
       }
    },
      err => { console.log(err); }
    );
  }
  private getPreviousTransactionDtl_dsp(acc: tm_depositall): void {
    //////////////debugger;
    this.preTransactionDtlForSelectedAcc = [];
    const t = new td_def_trans_trf();
    t.brn_cd = this.sys.BranchCode;
    t.acc_num = acc.acc_num;
    console.log(JSON.stringify(t));
    debugger;

    this.svc.addUpdDel<any>('Deposit/GetDdsAccountData', t).subscribe(
      res => {
        console.log(res);
        debugger;
        this.prevTransForDsp = res
        this.prevTransForDsp = this.prevTransForDsp.reverse()
      },
      err => { console.log(err); }
    );
  }
  private validationOnAcctTabOff(acc: tm_depositall): boolean {
    // //////////////debugger;
    if (undefined === acc) {
      this.HandleMessage(true, MessageType.Error,
        'Account number ' + this.f.acct_num.value + ' is not Valid/Present/Account Type doesnt match.');
      this.onResetClick();
      return false;
    }
    // /* check if account is not closed */
    // if (acc.acc_status.toUpperCase() === 'C') {
    //   this.HandleMessage(true, MessageType.Error,
    //     'Account number ' + this.f.acct_num.value + ' is closed.');
    //   this.onResetClick();
    //   return false;
    // }
    // acc.acc_type_cd === 5 ||
    if((acc.acc_type_cd === 2||acc.acc_type_cd === 3||acc.acc_type_cd === 4|| acc.acc_type_cd === 5 ||acc.acc_type_cd === 6 ) && acc.lock_mode){
      if(acc.lock_mode.toUpperCase() === 'L'){
        this.showLockType=true;
        this.HandleMessage(true, MessageType.Warning,
          `Account number ${this.f.acct_num.value} is locked. Renew and Close Operation are not Permissible. `);
      }
      else{
        this.showLockType=false;
      }
    }
    if (acc.acc_type_cd === 1 || acc.acc_type_cd === 8 ) {
      /* check if account is not Locked */
      if (null !== acc.lock_mode
        && acc.lock_mode.toUpperCase() === 'L') {
        this.HandleMessage(true, MessageType.Error,
          `Account number ${this.f.acct_num.value} is locked.`);
        this.onResetClick();
        return false;
      }
    }
    this.getUnapprovedDepTransAskViewEditOption();

    /** Account type wise validation if any */
    switch (acc.acc_type_cd) {
      case 1: // SB
        /* check if constituion is set for No transaction is dormant */
        const constitution = AccounTransactionsComponent.constitutionList.filter
          (e => e.constitution_cd === acc.constitution_cd)[0];
        if (undefined !== constitution && null !== constitution
          && null !== constitution.allow_trans
          && constitution.allow_trans.toUpperCase() === 'N') {
          this.HandleMessage(true, MessageType.Error,
            `No transaction allowed for this constituion ${constitution.constitution_desc}.`);
          this.onResetClick();
          return false;
        }
        /* check if account is dormant */
        const temp = new tm_deposit();
        temp.brn_cd = this.sys.BranchCode;
        temp.acc_num = acc.acc_num;
        console.log(JSON.stringify(temp));
        // this.svc.addUpdDel<any>('Deposit/isDormantAccount', temp).subscribe(
        //   res => {
        //     if (undefined !== res && null !== res && res === 0) {
        //       this.HandleMessage(true, MessageType.Warning,
        //         `Account number ${this.f.acct_num.value} is dormant.`);
        //     }
        //   },
        //   err => { console.log(err); }
        // );
        break;
      case 6: // RD
        // const cDt = this.sys.CurrentDate.getTime();
        // const chDt = Utils.convertStringToDt(acc.mat_dt.toString()).getTime();
        // if (cDt > chDt) {
        //   this.HandleMessage(true, MessageType.Error,
        //     `Maturity date of account number ${this.f.acct_num.value} has crossed ${Utils.convertDtToString(this.sys.CurrentDate)}`);
        //   this.onResetClick();
        //   return false;
        // } may change
        /** For RD get the RD installament */
        const rdInstallament = new td_rd_installment();
        rdInstallament.acc_num = acc.acc_num;
        this.svc.addUpdDel<any>('Deposit/GetRDInstallment', rdInstallament).subscribe(
          rdInstallamentRes => {
            debugger
            this.rdInstallemntsForSelectedAcc = [];
            this.rdInstallemntsForSelectedAcc = Utils.ChkArrNotEmptyRetrnEmptyArr(rdInstallamentRes);
            let i = 1;
            // let j = 0;
            this.paidRDinstlNo=0
            this.totalDueRD=0
            this.rdInstallemntsForSelectedAcc.forEach(e => {
              if (e.status.toLocaleLowerCase() === 'p') {
                this.paidRDinstlNo=Number(this.paidRDinstlNo)+1;
                this.rdInstallamentOption.push(acc.instl_amt * i);
                i = i + 1;
              }
              else{
                // j=j+1
                this.totalDueRD+=acc.instl_amt;
              }
            });
            if(this.rdInstallemntsForSelectedAcc.length == this.paidRDinstlNo){
              this.RDAllInstlPaid=true;
            }
            else{
              this.RDAllInstlPaid=false;
            }
            debugger
          },
          
          rdInstallamentErr => { console.log(rdInstallamentErr); }
        );
        break;

      case 5: // MIS
      this.misSum=0
        this.showMisInstalment = false;
        const misInstalments = new td_intt_dtls();
        misInstalments.ardb_cd = this.sys.ardbCD
        misInstalments.brn_cd = this.sys.BranchCode;
        misInstalments.acc_num = acc.acc_num;
        misInstalments.acc_type_cd = acc.acc_type_cd;
        this.svc.addUpdDel<any>('Deposit/GetInttDetails', misInstalments).subscribe(
          misInstalmentsRes => {
            console.log(misInstalmentsRes)
            this.misInstallemntsForSelectedAcc = [];
            this.misInstallemntsForSelectedAcc = Utils.ChkArrNotEmptyRetrnEmptyArr(misInstalmentsRes);
            let i = 1;
            this.showMisInstalment = true;
            this.misInstallemntsForSelectedAcc.forEach(e => {
              if (e.paid_status.toLocaleLowerCase() === 'b') {
                this.rdInstallamentOption.push(acc.intt_amt * i);
                i = i + 1;
                this.misSum+=e.intt_amt
              }

            });
            console.log(this.misSum)
            console.log(this.rdInstallamentOption[this.rdInstallamentOption.length - 1])
            this.tdDefTransFrm.patchValue({
              // amount: this.rdInstallamentOption[this.rdInstallamentOption.length - 1]
              amount: this.misSum

            })
            this.accDtlsFrm.controls.intt_amt.setValue(this.misSum)//PARTHA
            


            // this.rdInstallamentOption[this.rdInstallamentOption.length-1]
            this.misInstallemntsForSelectedAcc = this.misInstallemntsForSelectedAcc.filter(e =>
              e.paid_status.toLocaleLowerCase() === 'b' || e.paid_status.toLocaleLowerCase() === 'p' || e.paid_status.toLocaleLowerCase() === 'u');
          },
          misInstalmentsErr => { console.log(misInstalmentsErr); }
        );
        break;


      case 2: // FD

        this.misSum=0
  
          this.showMisInstalment = false;
  
          if (acc.intt_trf_type !== 'O')
  
          {
            const fdInstalments = new td_intt_dtls();
  
          fdInstalments.ardb_cd = this.sys.ardbCD
  
          fdInstalments.brn_cd = this.sys.BranchCode;
  
          fdInstalments.acc_num = acc.acc_num;
  
          fdInstalments.acc_type_cd = acc.acc_type_cd;
  
          this.svc.addUpdDel<any>('Deposit/GetInttDetails', fdInstalments).subscribe(
  
            fdInstalmentsRes => {
  
              console.log(fdInstalmentsRes)
  
              this.misInstallemntsForSelectedAcc = [];
  
              this.misInstallemntsForSelectedAcc = Utils.ChkArrNotEmptyRetrnEmptyArr(fdInstalmentsRes);
  
              let i = 1;
  
              this.showMisInstalment = true;
  
              this.misInstallemntsForSelectedAcc.forEach(e => {
  
                if (e.paid_status.toLocaleLowerCase() === 'b') {
  
                  this.rdInstallamentOption.push(acc.intt_amt * i);
  
                  i = i + 1;
  
                  this.misSum+=e.intt_amt
  
                }
  
              });
              console.log(this.misSum)
  
              console.log(this.rdInstallamentOption[this.rdInstallamentOption.length - 1])
  
              this.tdDefTransFrm.patchValue({
  
                // amount: this.rdInstallamentOption[this.rdInstallamentOption.length - 1]
  
                 amount: this.misSum
  
              }
              )
              this.accDtlsFrm.patchValue({
  
                // amount: this.rdInstallamentOption[this.rdInstallamentOption.length - 1]
  
                intt_amt : this.misSum,
                mat_amt: this.accNoEnteredForTransaction.prn_amt + this.misSum
   
  
              }
              )
              console.log(this.accDtlsFrm.controls.mat_amt.value);
  
              // this.rdInstallamentOption[this.rdInstallamentOption.length-1]
  
              this.fdInstallemntsForSelectedAcc = this.fdInstallemntsForSelectedAcc.filter(e =>
  
                e.paid_status.toLocaleLowerCase() === 'b' || e.paid_status.toLocaleLowerCase() === 'p' || e.paid_status.toLocaleLowerCase() === 'u');
  
            },
  
            misInstalmentsErr => { console.log(misInstalmentsErr); }
  
          );
  
          }
  
          break;
  
   
  
      }
  
   
  
      return true;
  
    }
  /**
   * Get all unapprved transaction
  get if the account is entered has unaaproved transaction
  show confirm box, if more that one upapproved transaction is present then show a list
  on click of ok for single tansaction or in list selected btn trn code will be opened in Edit
  on click of cancel old logic will follow.
   */
  /** return true if no unapproved transaction exixts */
  private getUnapprovedDepTransAskViewEditOption(): void {
    console.log('getUnapprovedDepTransAskViewEditOption')
    this.isLoading = true;
    const tdDepTrans = new td_def_trans_trf();
    tdDepTrans.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', tdDepTrans).subscribe(
      res => {
        console.log(res)
        //////////////debugger;
        this.isLoading = false;
        if (res.length > 0) {
          this.unApprovedTransactionLst = res;
          this.unApprovedTransactionLstOfAcc = this.unApprovedTransactionLst.filter(e => e.acc_num
            === this.f.acct_num.value.toString());
          if (undefined !== this.unApprovedTransactionLstOfAcc &&
            null !== this.unApprovedTransactionLstOfAcc &&
            this.unApprovedTransactionLstOfAcc.length > 0) {
            this.modalRef = this.modalService.show(this.unappconfirm,
              { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true });
          }
          else{
            this.svc.addUpdDel<any>('Common/GetapprovedDepTrans', tdDepTrans).subscribe(
              res => {
                console.log(res)
                this.allApproveTrans=res.filter(e=>e.acc_num===this.f.acct_num.value.toString())
                if((this.allApproveTrans.length>0)&&(this.f.acc_type_cd.value==1||this.f.acc_type_cd.value==7||this.f.acc_type_cd.value==8||this.f.acc_type_cd.value==9)){ 
                  debugger
                  this.modalRef = this.modalService.show(this.getalltrans,
                  { class: 'modal-sm', keyboard: false, backdrop: true, ignoreBackdropClick: false });}
              })
          }
        }
      },
      err => { this.isLoading = false; }
    );
    
  }

  onDeleteClick() {
    // if (!(confirm('Are you sure you want to Delete Transaction of Acc '
    //   + this.accNoEnteredForTransaction.acc_num
    //   + ' with Transancation Cd ' + this.selectedUnapprovedTransactionToEdit.trans_cd))) {
    //   return;
    // }
    this.modalRef.hide();
    this.isLoading = true;
    const param = new td_def_trans_trf();
    param.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    param.trans_cd = this.selectedUnapprovedTransactionToEdit.trans_cd;
    // const dt = this.sys.CurrentDate;
    param.trans_dt = this.sys.CurrentDate;
    param.acc_type_cd = (+this.f.acc_type_cd.value);
    param.acc_num = this.accNoEnteredForTransaction.acc_num;

    this.svc.addUpdDel<any>('Deposit/DeleteAccountOpeningData ', param).subscribe(
      res => {
        this.isLoading = false;
        
        if (res === 0) {
          this.HandleMessage(true, MessageType.Sucess, this.accNoEnteredForTransaction.acc_num
            + '\'s Transaction with Transacation Cd ' + this.selectedUnapprovedTransactionToEdit.trans_cd
            + ' is deleted.');
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
  hideModalForClose() {
    debugger
    this.modalRefClose.hide();
    if(+this.f.acc_type_cd.value == 2){
      this.tdDefTransFrm.patchValue({
        amount: (this.accNoEnteredForTransaction.prn_amt),
        curr_intt_recov: this.isMat ? this.interestAmount+(+this.aftmatInt) : this.closeInt,
        td_def_mat_amt: this.isMat ? this.accNoEnteredForTransaction.prn_amt + this.interestAmount+(+this.aftmatInt) : this.accNoEnteredForTransaction.prn_amt + this.closeInt
       });
    }
    else{
      debugger
      if((this.sys.ardbCD!='4'&& this.sys.ardbCD!='20' && this.sys.ardbCD!='26')&& Number(this.f.acc_type_cd.value) == 4  )
        {
                              debugger
                              this.tdDefTransFrm.patchValue({
                                ovd_intt_recov: 0,
                                curr_prn_recov: 0,
                                bonus_amt: 0,
                                amount: (+this.accNoEnteredForTransaction.prn_amt),
                                curr_intt_recov:this.afMat1?(+this.interestAmount)+(+this.aftmatInt):(+this.closeInt),
                                td_def_mat_amt:this.afMat1?this.accNoEnteredForTransaction.prn_amt + this.interestAmount+(+this.aftmatInt):this.accNoEnteredForTransaction.prn_amt +(+this.closeInt)
                                });
                            }
                
      if(this.sys.ardbCD=='26' && Number(this.f.acc_type_cd.value) == 4 && this.closeInt)
      {
        debugger
        this.tdDefTransFrm.patchValue({
          ovd_intt_recov: 0,
          curr_prn_recov: 0,
          bonus_amt: 0,
          amount: (+this.accNoEnteredForTransaction.prn_amt),
          curr_intt_recov:(+this.closeInt),
          td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.closeInt
          });
      }
      
    }
    
    
  }
  hideModalForRenewal(){
    this.modalRefClose.hide();

    // const prn_amt_for_renew=(this.sys.ardbCD=='4'&& (this.f.acc_type_cd.value === 2))?
    // this.accNoEnteredForTransaction.prn_amt:(this.f.acc_type_cd.value === 2 && (this.resbrnCD1[0].intt_trf_type=='H' ||this.resbrnCD1[0].intt_trf_type=='Q'||this.resbrnCD1[0].intt_trf_type=='Y'))?
    // this.accNoEnteredForTransaction.prn_amt+this.forB+(+this.afMat?(this.matInt?this.matInt:0):0):
    // this.accNoEnteredForTransaction.prn_amt+this.interestAmount;
    // const temp_gen_param2 = new p_gen_param();
    // temp_gen_param2.ardb_cd=this.sys.ardbCD;
    // temp_gen_param2.ad_prn_amt=prn_amt_for_renew;
    // temp_gen_param2.ad_acc_type_cd=2;
    // temp_gen_param2.ad_intt_rt = 4;//Need to be change in future
    // temp_gen_param2.as_intt_type = "O" ;
    // const o = Utils.convertStringToDt(this.td.opening_dt.value);
    // const m = Utils.convertStringToDt(this.td.mat_dt.value);
    // const diffDays = Math.ceil((Math.abs(m.getTime() - o.getTime())) / (1000 * 3600 * 24));
    // temp_gen_param2.ai_period = diffDays;
    // debugger
    // this.f_calctdintt_reg(temp_gen_param2);
  }
  public onUpapprovedConfirm(selectedTransactionToEdit: td_def_trans_trf): void {
    console.log(selectedTransactionToEdit)
    this.remarks = selectedTransactionToEdit.remarks
    this.disableOperation = true;
    this.editDeleteMode = true;
    this.selectedUnapprovedTransactionToEdit = selectedTransactionToEdit;
    this.modalRef.hide();
    this.showTransactionDtl = true;
    this.getDepTrans(selectedTransactionToEdit);
    this.getDenominationOrTransferDtl(selectedTransactionToEdit);
  }

  private getDepTrans(depTras: td_def_trans_trf): void {
    this.isLoading = true;

    // this.showCust = false; // this is done to forcibly rebind the screen
    // const defTransaction = new td_def_trans_trf();
    // defTransaction.trans_cd = this.selectedTransactionCd;
    // defTransaction.brn_cd = localStorage.getItem('__brnCd');
    console.log(depTras)
    this.svc.addUpdDel<td_def_trans_trf>('Common/GetDepTrans', depTras).subscribe(
      res => {
        console.log('deptrans', res)
        // this.deptransData=res[0]
        // console.log(this.deptransData.trans_mode)
        // this.selectedVm.td_def_trans_trf = res[0];
        // this.msg.sendCommonTransactionInfo(res[0]); // show transaction details
        this.setTransactionDtl(res[0]);
        
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
    // console.log(this.deptransData)

  }

  private getDenominationOrTransferDtl(transactionDtl: td_def_trans_trf): void {
    //////////////debugger;
    
    console.log(transactionDtl)
    this.tm_denominationList = [];
    console.log(transactionDtl.remarks)
    this.td_deftranstrfList = [];
    this.denominationGrandTotal = 0;
    this.TrfTotAmt = 0;
    if (transactionDtl.trf_type === 'C') {
      // this.hideOnClose=false;
      const tmDenoTrf = new tm_denomination_trans();
      tmDenoTrf.brn_cd = this.sys.BranchCode;
      tmDenoTrf.trans_cd = transactionDtl.trans_cd;
      tmDenoTrf.trans_dt = Utils.convertStringToDt(transactionDtl.trans_dt.toString());
      this.svc.addUpdDel<any>('Common/GetDenominationDtls', tmDenoTrf).subscribe(
        res => {
          //////////////debugger;
          if (null !== res && Object.keys(res).length !== 0) {
            // this.showDenominationDtl = true;
            this.tm_denominationList = res;
            this.tm_denominationList.forEach(element => {
              const denomination = this.denominationList.filter(e => e.value === element.rupees)[0];
              element.rupees_desc = denomination.rupees;
              this.denominationGrandTotal += element.total;
            });
          }
        },
        err => { }
      );

      ////////
      console.log(transactionDtl.trans_mode)  //marker
      if (transactionDtl.trans_mode == null && (transactionDtl.trans_type === 'W' || transactionDtl.trans_type === 'D')) {
        console.log(transactionDtl.trans_mode)
        this.trftype = transactionDtl.trans_type
        // debugger;
      }
      else if (transactionDtl.trans_mode == 'C') {
        this.showtransmodeforC = true; //marker
        this.showOnClose = true//marker
        if (transactionDtl.acc_type_cd == 1 || transactionDtl.acc_type_cd == 8) {
          this.hideOnClose = false;
          this.showCloseInterest = true;
          // this.F_CALC_SB_INTT() //marker
          this.tdDefTransFrm.patchValue({
            closeIntrest:transactionDtl.amount-this.accDtlsFrm.controls.clr_bal.value
          
          
          })
        }
        if (transactionDtl.acc_type_cd == 2) {
          //  this.showOnClose=false//marker
          this.showCloseInterest = false;
          //  this.F_CALC_SB_INTT()
          console.log(transactionDtl.amount)
          //  debugger;
          this.tdDefTransFrm.patchValue({
            // amount: (this.accNoEnteredForTransaction.prn_amt +
            //   (this.accNoEnteredForTransaction.intt_amt > 0 ?
            //   this.accNoEnteredForTransaction.intt_amt :
            //   (0.015 * this.accNoEnteredForTransaction.prn_amt))).toFixed(2),
            amount: (transactionDtl.amount).toFixed(2)
          })
          console.log(this.tdDefTransFrm.controls.amount.value)
        }

        this.trftype = ''
      }
      else if (transactionDtl.trans_mode == 'R') { //marker
        this.showTransMode = false; //marker
        this.showTransModeForR = true
        if (transactionDtl.acc_type_cd == 5) {
          this.showOnClose = false
          console.log(this.counter1)
        }
      }
      const tdDefTranTransfr = new td_def_trans_trf();
      tdDefTranTransfr.brn_cd = this.sys.BranchCode;
      tdDefTranTransfr.trans_cd = transactionDtl.trans_cd;
      tdDefTranTransfr.trans_dt = Utils.convertStringToDt(transactionDtl.trans_dt.toString());
      // tdDefTranTransfr.trans_type = transactionDtl.trans_type;
      if (transactionDtl.trans_mode === 'R') {
        console.log(transactionDtl.trans_mode)
        this.showOnRenewal = true
        console.log(this.showOnRenewal)
        this.svc.addUpdDel<any>('Deposit/GetAccountOpeningTempData', transactionDtl).subscribe(
          res => {
            console.log(res);
            this.deftransfrmData = res.tmdepositrenew;
            //  this.setTransactionDtl(res.tmdepositrenew);

            console.log(res.tmdepositrenew)
            this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
              res1 => {
                let k = res1.filter(x => x.constitution_cd == res.tmdepositrenew.constitution_cd)
                debugger;
                this.tdDefTransFrm.patchValue({
                  constitution_cd: k[0].constitution_cd,
                  constitution_cd_desc: k[0].constitution_desc
                })

              },
              err => { // ;
              }
            );
            if (transactionDtl.acc_type_cd != 5)
              this.showBalance = true
            // this.showBalance=(res.tddeftrans.ovd_prn_recov+res.tddeftrans.curr_intt_recov)!=res.tmdepositrenew.prn_amt? (res.tddeftrans.curr_intt_recov?true:false):false,
            console.log(res.tddeftrans.ovd_prn_recov + res.tddeftrans.curr_intt_recov)
            // debugger;
            this.showTransModeForR = true
            this.tdDefTransFrm.patchValue({
              opening_dt: res.tmdepositrenew.opening_dt.toString().substr(0, 10),
              mat_dt: res.tmdepositrenew.mat_dt.toString().substr(0, 10),
              amount: res.tmdepositrenew.prn_amt,
              // balance:(res.tddeftrans.ovd_prn_recov+res.tddeftrans.curr_intt_recov)!=res.tmdepositrenew.prn_amt? (res.tddeftrans.curr_intt_recov?res.tddeftrans.curr_intt_recov:0):0,
              balance: (res.tddeftrans.ovd_prn_recov + res.tddeftrans.curr_intt_recov) != res.tmdepositrenew.prn_amt ? (this.accDtlsFrm.controls.mat_amt.value) - res.tmdepositrenew.prn_amt : 0,
              intt_trf_type: res.tmdepositrenew.intt_trf_type,
              dep_period_y: (res.tmdepositrenew.dep_period.split(';')[0]).split('=')[1],
              dep_period_m: (res.tmdepositrenew.dep_period.split(';')[1]).split('=')[1],
              dep_period_d: (res.tmdepositrenew.dep_period.split(';')[2]).split('=')[1],
              intt_rate: res.tmdepositrenew.intt_rt,
              interest: res.tmdepositrenew.intt_amt,
              trans_mode1: 'Renewal'

              // opening_dt:res.tmdepositrenew.opening_dt,
              // mat_dt:res.tmdepositrenew.mat_dt
            })
            this.mat_val = Number(this.tdDefTransFrm.controls.amount.value)+ Number(this.tdDefTransFrm.controls.interest.value)
          }
        )
      }
      else if (transactionDtl.trans_mode === 'I') {
        console.log(transactionDtl.trans_mode)  //marker
        this.showTransMode = false
        console.log(transactionDtl.acc_cd)
      }
      ////////
    } else {
      console.log(transactionDtl.trans_mode)
      if (transactionDtl.trans_mode == null && (transactionDtl.trans_type === 'W' || transactionDtl.trans_type === 'D')) {
        console.log(transactionDtl.trans_mode)
        this.trftype = transactionDtl.trans_type
        if (transactionDtl.trf_type == 'T') {
          this.showtransdetails = true;
        }
      }
      else if (transactionDtl.trans_mode == 'C') {
        console.log('here in c')
        this.showtransmodeforC = true; //marker
        this.showTransModeForR = false; //marker
        if (transactionDtl.trf_type == 'T') {
          this.showtransdetails = true;
          if (transactionDtl.acc_type_cd == 1) //marker
            this.F_CALC_SB_INTT()
          console.log(transactionDtl.amount)
          // debugger;
          if (transactionDtl.acc_type_cd == 2 || transactionDtl.acc_type_cd == 4 || transactionDtl.acc_type_cd == 5) { //marker whether 5 is to be added
            this.tdDefTransFrm.patchValue({
              amount: (transactionDtl.amount).toFixed(2)
            })
            this.showCloseInterest = false;
            console.log(this.tdDefTransFrm.controls.amount.value)
            ///

            if (transactionDtl.acc_type_cd == 2 || transactionDtl.acc_type_cd == 4 || transactionDtl.acc_type_cd == 5) { //marker whether 5 is to be added
              //  this.showOnClose=false//marker
              this.showCloseInterest = false;
              //  this.F_CALC_SB_INTT()
              console.log(transactionDtl.amount)
              //  debugger;
              this.tdDefTransFrm.patchValue({
                // amount: (this.accNoEnteredForTransaction.prn_amt +
                //   (this.accNoEnteredForTransaction.intt_amt > 0 ?
                //   this.accNoEnteredForTransaction.intt_amt :
                //   (0.015 * this.accNoEnteredForTransaction.prn_amt))).toFixed(2),
                amount: (transactionDtl.amount).toFixed(2)
              })
              console.log(this.tdDefTransFrm.controls.amount.value)
            }
            ///
          }
        }
        this.trftype = ''

      }
      const tdDefTranTransfr = new td_def_trans_trf();
      tdDefTranTransfr.brn_cd = this.sys.BranchCode;
      tdDefTranTransfr.trans_cd = transactionDtl.trans_cd;
      tdDefTranTransfr.trans_dt = Utils.convertStringToDt(transactionDtl.trans_dt.toString());
      // tdDefTranTransfr.trans_type = transactionDtl.trans_type;
      console.log(transactionDtl.trans_mode)

      if (transactionDtl.trans_mode === 'R') {
        console.log(transactionDtl.trans_mode)
        this.showOnRenewal = true
        console.log(this.showOnRenewal)
        this.svc.addUpdDel<any>('Deposit/GetAccountOpeningTempData', transactionDtl).subscribe(
          res => {
            console.log(res);
            this.deftransfrmData = res.tmdepositrenew;
            //  this.setTransactionDtl(res.tmdepositrenew);

            console.log(res.tmdepositrenew)
            this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
              res1 => {
                let k = res1.filter(x => x.constitution_cd == res.tmdepositrenew.constitution_cd)
                // //////////////debugger;
                this.tdDefTransFrm.patchValue({
                  constitution_cd: k[0].constitution_cd,
                  constitution_cd_desc: k[0].constitution_desc
                })

              },
              err => { // ;
              }
            );
            if (res.tddeftrans.acc_type_cd != 5)
              this.showBalance = true
            // if (res.tddeftrans.acc_type_cd == 5) {
            //   this.showOnClose = true;

            // }
            // this.showBalance=(res.tddeftrans.ovd_prn_recov+res.tddeftrans.curr_intt_recov)!=res.tmdepositrenew.prn_amt? (res.tddeftrans.curr_intt_recov?true:false):false,
            console.log(res.tddeftrans.ovd_prn_recov + res.tddeftrans.curr_intt_recov)
            this.showTransModeForR = true
            if (res.tddeftrans.acc_type_cd != 5) {
              this.tdDefTransFrm.patchValue({
                opening_dt: res.tmdepositrenew.opening_dt.toString().substr(0, 10),
                mat_dt: res.tmdepositrenew.mat_dt.toString().substr(0, 10),
                amount: res.tmdepositrenew.prn_amt,
                curr_intt_recov: (this.accDtlsFrm.controls.intt_amt.value * this.counter1),
                balance: (res.tddeftrans.ovd_prn_recov + res.tddeftrans.curr_intt_recov) != res.tmdepositrenew.prn_amt ? this.accDtlsFrm.controls.mat_amt.value - res.tmdepositrenew.prn_amt : 0,
                intt_trf_type: res.tmdepositrenew.intt_trf_type,
                dep_period_y: (res.tmdepositrenew.dep_period.split(';')[0]).split('=')[1],
                dep_period_m: (res.tmdepositrenew.dep_period.split(';')[1]).split('=')[1],
                dep_period_d: (res.tmdepositrenew.dep_period.split(';')[2]).split('=')[1],
                intt_rate: res.tmdepositrenew.intt_rt,
                interest: res.tmdepositrenew.intt_amt,
                trans_mode1: 'Renewal'

                // opening_dt:res.tmdepositrenew.opening_dt,
                // mat_dt:res.tmdepositrenew.mat_dt
              })
              this.mat_val = Number(this.tdDefTransFrm.controls.amount.value) + Number(this.tdDefTransFrm.controls.interest.value)

            }
            else {
              console.log(this.rdInstallamentOption[this.rdInstallamentOption.length - 1])
              this.rdInstallamentOption[this.rdInstallamentOption.length - 1] = this.rdInstallamentOption[this.rdInstallamentOption.length - 1] ? this.rdInstallamentOption[this.rdInstallamentOption.length - 1] : 0
              this.tdDefTransFrm.patchValue({
                opening_dt: res.tmdepositrenew.opening_dt.toString().substr(0, 10),
                mat_dt: res.tmdepositrenew.mat_dt.toString().substr(0, 10),
                amount: res.tmdepositrenew.prn_amt,
                curr_prn_recov: 0,
                curr_intt_recov: res.tddeftrans.acc_type_cd == 5 ? this.rdInstallamentOption[this.rdInstallamentOption.length - 1] : 0,
                balance: (res.tddeftrans.ovd_prn_recov + res.tddeftrans.curr_intt_recov) != res.tmdepositrenew.prn_amt ? this.accDtlsFrm.controls.mat_amt.value - res.tmdepositrenew.prn_amt : 0,
                intt_trf_type: res.tmdepositrenew.intt_trf_type,
                dep_period_y: (res.tmdepositrenew.dep_period.split(';')[0]).split('=')[1],
                dep_period_m: (res.tmdepositrenew.dep_period.split(';')[1]).split('=')[1],
                dep_period_d: (res.tmdepositrenew.dep_period.split(';')[2]).split('=')[1],
                intt_rate: res.tmdepositrenew.intt_rt,
                interest: res.tmdepositrenew.intt_amt,
                td_def_mat_amt: res.tddeftrans.acc_type_cd == 5 ? res.tmdepositrenew.prn_amt + this.rdInstallamentOption[this.rdInstallamentOption.length - 1] : '',
                trans_mode1: 'Renewal',
                cert_no:res.tmdepositrenew.cert_no
              })
              // this.tdDefTransFrm.controls.intt_trf_type.disable()
              this.mat_val = Number(this.tdDefTransFrm.controls.amount.value)

            }
          }
        )
      }
      else if (transactionDtl.trans_mode === 'C') {
        this.showtransmodeforC = true;
        // this.showTransModeForR=true; //marker
        // this.showTransMode=false;
        // this.showTransModeForR=false;

        if (transactionDtl.acc_type_cd != 2 && transactionDtl.acc_type_cd != 4 && transactionDtl.acc_type_cd != 5 && transactionDtl.acc_type_cd != 6 && transactionDtl.acc_type_cd != 11 ) { //11marker 11 to be added later
          this.F_CALC_SB_INTT();
          this.showCloseInterest = true

        }
        else {
          // this.F_CALC_SB_INTT() //marker
          console.log(transactionDtl)
          // debugger;
          this.tdDefTransFrm.patchValue({
            // amount: (this.accNoEnteredForTransaction.prn_amt +
            //   (this.accNoEnteredForTransaction.intt_amt > 0 ?
            //   this.accNoEnteredForTransaction.intt_amt :
            //   (0.015 * this.accNoEnteredForTransaction.prn_amt))).toFixed(2),
            //  penal_rt:transactionDtl.acc_type_cd==6?transactionDtl.pe:''
            trans_mode1: transactionDtl.acc_type_cd == 6 ? 'Close' : '',
            curr_prn_recov: transactionDtl.acc_type_cd == 5 ? 0 : transactionDtl.curr_prn_recov,
            amount: (transactionDtl.amount).toFixed(2)
          })
          this.showCloseInterest = false;
          console.log(this.tdDefTransFrm.controls.curr_prn_recov.value)
        }

        console.log(this.showtransmodeforC)
      }
      else if (transactionDtl.trans_mode === 'I') {
        console.log(transactionDtl.trans_mode)  //marker
        this.showTransMode = false
      }
      else {
        console.log(transactionDtl.trans_mode)
        this.showtransmodeforC = false;
        // this.showTransMode

      }
      console.log(this.tdDefTransFrm.controls.amount.value)
      this.svc.addUpdDel<any>('Common/GetDepTransTrfwithChild', tdDefTranTransfr).subscribe(
        res => {
          console.log('GetDepTransTrfwithChild', res)
          this.showtransdetails = Object.keys(res).length !== 0 ? true : false;
          //////////////debugger;
          if (null !== res && Object.keys(res).length !== 0) {
            this.td_deftranstrfList = res;
            console.log(Object.keys(res).length)
            this.td_deftranstrfList.forEach(e => {
              this.TrfTotAmt += (+e.amount);
            });
            //////////////debugger;
            // this.td_deftranstrfList = acc.tddeftranstrf;
            // this.f.oprn_cd.enable();
            for (let i = 0; i < this.td_deftranstrfList.length; i++) {
              if (this.td_deftranstrfList[i].acc_num === '0000') {
                this.td_deftranstrfList[i].gl_acc_code = this.td_deftranstrfList[i].acc_type_cd.toString();
                this.checkAndSetDebitAccType('gl_acc', this.td_deftranstrfList[i]);
                debugger

              }
              else {
                this.td_deftranstrfList[i].cust_acc_type = this.td_deftranstrfList[i].acc_type_cd.toString();
                this.td_deftranstrfList[i].cust_acc_number = this.td_deftranstrfList[i].acc_num;
                this.checkAndSetDebitAccType('cust_acc', this.td_deftranstrfList[i]);
                console.log(this.td_deftranstrfList[i], this.tdDefTransFrm.controls.amount.value)
                // debugger;
                this.setDebitAccDtls(this.td_deftranstrfList[i]);

              }
              if (transactionDtl.acc_type_cd == 2) {
                // this.F_CALC_SB_INTT() /marker
                console.log(transactionDtl.amount)
                // debugger;
                this.tdDefTransFrm.patchValue({
                  // amount: (this.accNoEnteredForTransaction.prn_amt +
                  //   (this.accNoEnteredForTransaction.intt_amt > 0 ?
                  //   this.accNoEnteredForTransaction.intt_amt :
                  //   (0.015 * this.accNoEnteredForTransaction.prn_amt))).toFixed(2),
                  amount: (transactionDtl.amount).toFixed(2)
                })
                this.showCloseInterest = false;
                console.log(this.tdDefTransFrm.controls.amount.value)
              }
            }
            
            this.sumTransfer();
          }
          
        },
        
        err => { }
      );
    }
  }

  private setTransactionDtl(tdDefTransTrf: any): void {
    if(this.sys.ardbCD=='26'){
      debugger//PARTHA
      this.accDtlsFrm.controls.mat_amt.setValue(tdDefTransTrf.curr_prn_recov+tdDefTransTrf.curr_intt_recov)
      this.accDtlsFrm.controls.intt_amt.setValue(tdDefTransTrf.curr_intt_recov)
                  
    }
    console.log(tdDefTransTrf)
    console.log(this.deftransfrmData)
    // debugger;deftransfrmData
    // this.selOprn.oprn_desc=tdDefTransTrf.remarks;
    // console.log(this.selOprn.oprn_desc)
    // this.f.oprn_desc.setValue(tdDefTransTrf.remarks)
    const acctTypeDesription = AccounTransactionsComponent.operations
      .filter(e => e.acc_type_cd === tdDefTransTrf.acc_type_cd)[0].acc_type_desc;
    console.log(AccounTransactionsComponent.operations);
    console.log({ "arg": tdDefTransTrf, "acctTypeDesription": acctTypeDesription })
    this.tdDefTransFrm.patchValue({
      trans_dt: tdDefTransTrf.trans_dt,
      trans_cd: tdDefTransTrf.trans_cd,
      acc_type_cd: tdDefTransTrf.acc_type_cd,
      acc_type_desc: acctTypeDesription,
      acc_num: tdDefTransTrf.acc_num,
      // trans_type_key:  tdDefTransTrf.trans_type_key ,
      trans_type: tdDefTransTrf.trans_type.toLowerCase() === 'w' ? 'Withdraw' : 'Deposit',
      trans_type_key: tdDefTransTrf.trans_type,
      trans_mode: tdDefTransTrf.trans_mode,
      trf_type: tdDefTransTrf.trf_type,
      amount: tdDefTransTrf.amount,
      curr_intt_recov: tdDefTransTrf.curr_intt_recov,
      ovd_intt_recov: tdDefTransTrf.ovd_intt_recov,
      curr_prn_recov: tdDefTransTrf.acc_type_cd == 5 && tdDefTransTrf.trans_mode == 'C' ? 0 : tdDefTransTrf.curr_prn_recov,
      ovd_prn_recov: tdDefTransTrf.ovd_prn_recov,
      instrument_dt: tdDefTransTrf.instrument_dt,
      instrument_num: tdDefTransTrf.instrument_num,
      paid_to: tdDefTransTrf.paid_to,
      token_num: tdDefTransTrf.token_num,
      approval_status: tdDefTransTrf.approval_status,
      approved_by: tdDefTransTrf.approved_by,
      approved_dt: tdDefTransTrf.approved_dt,
      particulars: tdDefTransTrf.particulars,
      tr_acc_type_cd: tdDefTransTrf.tr_acc_type_cd,
      tr_acc_num: tdDefTransTrf.tr_acc_num,
      voucher_dt: tdDefTransTrf.voucher_dt,
      voucher_id: tdDefTransTrf.voucher_id,
      tr_acc_cd: tdDefTransTrf.tr_acc_cd,
      acc_cd: tdDefTransTrf.acc_cd,
      share_amt: tdDefTransTrf.share_amt,
      sum_assured: tdDefTransTrf.sum_assured,
      paid_amt: tdDefTransTrf.paid_amt,
      remarks: tdDefTransTrf.remarks,
      crop_cd: tdDefTransTrf.crop_cd,
      activity_cd: tdDefTransTrf.activity_cd,
      curr_intt_rate: tdDefTransTrf.curr_intt_rate,
      ovd_intt_rate: tdDefTransTrf.ovd_intt_rate,
      instl_no: tdDefTransTrf.instl_no,
      instl_start_dt: tdDefTransTrf.instl_start_dt,
      periodicity: tdDefTransTrf.periodicity,
      disb_id: tdDefTransTrf.disb_id,
      comp_unit_no: tdDefTransTrf.comp_unit_no,
      ongoing_unit_no: tdDefTransTrf.ongoing_unit_no,
      mis_advance_recov: tdDefTransTrf.mis_advance_recov,
      audit_fees_recov: tdDefTransTrf.audit_fees_recov,
      sector_cd: tdDefTransTrf.sector_cd,
      spl_prog_cd: tdDefTransTrf.spl_prog_cd,
      borrower_cr_cd: tdDefTransTrf.borrower_cr_cd,
      intt_till_dt: tdDefTransTrf.intt_till_dt,
      acc_name: tdDefTransTrf.acc_name,
      brn_cd: tdDefTransTrf.brn_cd,
      trf_type_desc: tdDefTransTrf.trf_type_desc,
      // constitution_cd:  tdDefTransTrf.c ,
      // constitution_cd_desc:  tdDefTransTrf.constitution_cd_desc ,
      cert_no:this.editDeleteMode?this.deftransfrmData?.cert_no:tdDefTransTrf.cert_no ,
      // opening_dt:  tdDefTransTrf.opening_dt ,
      // mat_dt:  tdDefTransTrf.mat_dt ,
      // dep_period_y:  tdDefTransTrf.dep_period_y ,
      // dep_period_m:  tdDefTransTrf.dep_period_m ,
      // dep_period_d:  tdDefTransTrf.dep_period_d ,
      intt_trf_type: tdDefTransTrf.intt_trf_type,
      intt_rate: tdDefTransTrf.intt_rate,
      interest: tdDefTransTrf.interest,
      td_def_mat_amt: (+tdDefTransTrf.amount) + (+tdDefTransTrf.curr_prn_recov) - (+tdDefTransTrf.ovd_intt_recov)
    });
   
    // debugger;
    console.log(tdDefTransTrf.amount, tdDefTransTrf.curr_prn_recov,(+tdDefTransTrf.ovd_intt_recov))
    // debugger;
    // console.log(tdDefTransTrf.trans_type.toLowerCase(), tdDefTransTrf.trans_mode.toLowerCase())
    // debugger;
    if (this.f.acc_type_cd.value == 1) {
      if (tdDefTransTrf.trans_type.toLowerCase() === 'w') {

        if (tdDefTransTrf.trans_mode == 'C') {
          this.f.oprn_cd.setValue(3)
        }
        else {
          this.f.oprn_cd.setValue(2)
        }
      }
      else {
        this.f.oprn_cd.setValue(1)
      }
    }
    if (this.f.acc_type_cd.value == 8) {
      if (tdDefTransTrf.trans_type.toLowerCase() === 'w') {
        if (tdDefTransTrf.trans_mode.toLowerCase() == 'c' && tdDefTransTrf.trans_mode.toLowerCase()) {
          this.f.oprn_cd.setValue(20)
        }
        else {
          this.f.oprn_cd.setValue(19)
        }
      }
      else {
        this.f.oprn_cd.setValue(18)
      }
    }
    if (this.f.acc_type_cd.value == 2) {
      if (tdDefTransTrf.trans_type.toLowerCase() === 'w') {
        if (tdDefTransTrf.trans_mode.toLowerCase() == 'c' && tdDefTransTrf.trans_mode.toLowerCase()) {
          this.f.oprn_cd.setValue(5)
        }
        else {
          this.f.oprn_cd.setValue(5)
        }
      }
      else {
        this.f.oprn_cd.setValue(4)
      }
    }
    if (this.f.acc_type_cd.value == 3) {
      if (tdDefTransTrf.trans_type.toLowerCase() === 'w') {
        if (tdDefTransTrf.trans_mode.toLowerCase() == 'c' && tdDefTransTrf.trans_mode.toLowerCase()) {
          this.f.oprn_cd.setValue(15)
        }
        else {
          this.f.oprn_cd.setValue(15)
        }
      }
      else {
        this.f.oprn_cd.setValue(14)
      }
    }
    if (this.f.acc_type_cd.value == 4) {
      if (tdDefTransTrf.trans_type.toLowerCase() === 'w') {
        if (tdDefTransTrf.trans_mode.toLowerCase() == 'c' && tdDefTransTrf.trans_mode.toLowerCase()) {
          this.f.oprn_cd.setValue(7)
        }
        else {
          this.f.oprn_cd.setValue(7)
        }
      }
      else {
        this.f.oprn_cd.setValue(6)
      }
    }
    if (this.f.acc_type_cd.value == 5) {
      if (tdDefTransTrf.trans_type.toLowerCase() === 'w') {
        if (tdDefTransTrf.trans_mode.toLowerCase() == 'c' && tdDefTransTrf.trans_mode.toLowerCase()) {
          this.f.oprn_cd.setValue(10)
        }
        else if (tdDefTransTrf.trans_mode.toLowerCase() == 'i') {
          this.f.oprn_cd.setValue(8)
        }
        else {
          this.f.oprn_cd.setValue(9)
        }
      }
      else {
        this.f.oprn_cd.setValue(9)
      }
    }
    if (this.f.acc_type_cd.value == 6) {
      if (tdDefTransTrf.trans_type.toLowerCase() === 'w') {
        this.f.oprn_cd.setValue(16)
      }


      else {
        this.f.oprn_cd.setValue(17)
      }
    }
    if (this.f.acc_type_cd.value == 11) {
      if (tdDefTransTrf.trans_type.toLowerCase() === 'w') {
        this.f.oprn_cd.setValue(21)
      }


      // else {
      //   this.f.oprn_cd.setValue(17)
      // }
    }
    console.log(this.f.oprn_cd.value)
    // debugger;
    // this.f.oprn_cd.setValue(this.f.acc_type_cd.value==1 ? 
    //                         (tdDefTransTrf.trans_type.toLowerCase() === 'w' ?  tdDefTransTrf.trans_mode.toLowerCase()=='c'?3:2 : tdDefTransTrf.trans_type.toLowerCase() === 'd'?1:3): '');
    //                         this.f.oprn_cd.setValue(this.f.acc_type_cd.value==8 ? 
    //                           (tdDefTransTrf.trans_type.toLowerCase() === 'w' ?  tdDefTransTrf.trans_mode.toLowerCase()=='c'?20:19 : tdDefTransTrf.trans_type.toLowerCase() === 'd'?18:20): '');
    //                         debugger;
    this.mapformDataOnEditOrDelete(tdDefTransTrf);
  }
  public onUpapprovedCancel(): void {
    console.log("close modal")
    this.editDeleteMode = false;
    this.selectedUnapprovedTransactionToEdit = null;
    this.modalRef.hide();
    this.showTransactionDtl = false;
  }
  /*  */
  public mapformDataOnEditOrDelete(tdDefTransTrf: td_def_trans_trf): void {
    // this.tm_denominationList = [];
    // this.resetTransfer();
    console.log(tdDefTransTrf);
    // this.tdDefTransFrm.reset(); this.showTransactionDtl = false;
    this.HandleMessage(false);
    // this.showTranferType = true;
    this.showAmtDrpDn = false;
    this.showOnClose = false;
    this.hideOnClose = this.showOnRenewal ? true : false;

    // this.showOnRenewal = false;
    this.showTransactionDtl = true;
    this.showTransMode = false;
    this.accNoEnteredForTransaction.ShowClose = false;
    // this.td.amount.enable();
    // this.td.amount.setValue(null);

    const accTypCode = +this.f.acc_type_cd.value;
    // const selectedOperation = this.operations.filter
    //   (e => e.oprn_cd === +this.f.oprn_cd.value)[0];

    // this.transType = new DynamicSelect();
    if (tdDefTransTrf.trans_type.toLowerCase() === 'w') {
      this.showTransMode = true;
      console.log(tdDefTransTrf.trans_mode)
      if (tdDefTransTrf.trans_mode == 'I') {
        console.log('inside i')
        console.log(tdDefTransTrf.acc_cd)
        this.hideOnClose = false;
        this.showAmtDrpDn = true;
        this.showTransMode = false
      }  //marker
      if (tdDefTransTrf.trans_mode == 'C') {
        // this is the case of close
        this.showTransMode = false //marker
        console.log(this.tdDefTransFrm.controls.amount.value + " " + this.tdDefTransFrm.controls.curr_intt_recov.value)
        this.tdDefTransFrm.patchValue({
          amount: this.tdDefTransFrm.controls.amount.value, //marker
          td_def_mat_amt: accTypCode!=6? this.tdDefTransFrm.controls.amount.value + this.tdDefTransFrm.controls.curr_intt_recov.value :this.tdDefTransFrm.controls.amount.value + this.tdDefTransFrm.controls.curr_intt_recov.value -this.tdDefTransFrm.controls.ovd_intt_recov.value

        })
        if (accTypCode === 2 || accTypCode === 3 ||
          accTypCode === 4 || accTypCode === 5 ||
          accTypCode === 6 || accTypCode === 11) {
            //11 is a marker
          this.showOnClose = true;
          console.log(this.tdDefTransFrm.controls.amount.value)
         if(accTypCode==11)
           this.tdDefTransFrm.controls.amount.disable()
          // this.showCloseInterest=false; //marker 
          // console.log("this.showcloseinterest"+this.showCloseInterest)
        }
        this.hideOnClose = true;
      }
    } else if (tdDefTransTrf.trans_type.toLowerCase() === 'd') {
      this.hideOnClose = true;
      if (accTypCode === 6) {
        this.hideOnClose = true;
        this.showAmtDrpDn = true;
      }
      if (null !== tdDefTransTrf.trans_mode) {
        if (tdDefTransTrf.trans_mode.toLowerCase() === 'r') {
          // this is the case of renewal
          this.showOnRenewal = true;
          this.hideOnClose = true;
        } else if (tdDefTransTrf.trans_mode.toLowerCase() === 'i') {
          // console.log('inside i')

          this.hideOnClose = true;
          this.showAmtDrpDn = true;
          this.showTransMode = false
        }
      }
      if (accTypCode === 1) { this.hideOnClose = false; }
    }
  }

  /* method fires on operation type change */
  public async onOperationTypeChange(): Promise<void> {
    this.showtransdetails = false;
    this.trftype = ''
    this.counter = 0;
    this.counter1 = 0;
    console.log("in operation type")
    //////////////debugger;
    this.tm_denominationList = [];
    this.resetTransfer();
    this.tdDefTransFrm.reset(); this.showTransactionDtl = false;
    this.HandleMessage(false);
    // this.showTranferType = true;
    this.hideOnClose = false;
    this.showBalance = false;
    this.showTransfrTyp = true;
    this.showAmtDrpDn = false;
    this.showOnClose = false;
    this.showOnRenewal = false;
    this.showTransactionDtl = true;
    this.showTransMode = false;
    this.showTransModeForR = false;
    this.accNoEnteredForTransaction.ShowClose = false;
    this.td.amount.enable();
    this.td.amount.setValue(null);
    this.showCloseInterest = false;

    /* check if there any unapproved transaction
    exixits already for non saving accounts*/
    const accTypCode = +this.f.acc_type_cd.value;
    const selectedOperation = this.operations.filter
      (e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    this.selOprn = selectedOperation;

    if (undefined === this.unApprovedTransactionLst ||
      null === this.unApprovedTransactionLst ||
      this.unApprovedTransactionLst.length <= 0) {
      this.isLoading = true;
      const tdDepTrans = new td_def_trans_trf();
      tdDepTrans.brn_cd = this.sys.BranchCode;
      this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', tdDepTrans).subscribe(
        res => {
          this.isLoading = false;
          if (res.length > 0) {
            this.unApprovedTransactionLst = res;
            const unapprovedTrans = this.unApprovedTransactionLst.filter(e => e.acc_num
              === this.f.acct_num.value.toString())[0];
            if (accTypCode === 1 && 
              selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') { } else {

              if (undefined === unapprovedTrans || Object.keys(unapprovedTrans).length === 0) { } else {
                this.HandleMessage(true, MessageType.Error,
                  `Un-approved Transaction already exists for the Account ${this.f.acct_num.value}`);
                this.onResetClick();
                return;
              }
            }
            const unapprovedTransForTdy = this.unApprovedTransactionLst.filter(e => e.trans_dt
              === this.sys.CurrentDate)[0];
            if (undefined !== unapprovedTrans && Object.keys(unapprovedTrans).length > 0) {
              this.HandleMessage(true, MessageType.Warning,
                `Today few transaction has been done for Acc# ${this.f.acct_num.value}.`);
            }
          }
        },
        err => { this.isLoading = false; }
      );
    }

    this.transType = new DynamicSelect();

    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
      this.transType.key = 'W';
      this.showCloseInterest = false;
      this.transType.Description = 'Withdrawl';
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key
      });
      this.showTransMode = true;

    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
      this.showCloseInterest = false
      this.transType.key = 'D';
      this.transType.Description = 'Deposit';
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key
      });
      this.showTransMode = true
      this.hideOnClose = true;
      this.showAmtDrpDn = true;
      } 
      else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'rd installment') {
        if(this.RDAllInstlPaid){
          this.HandleMessage(true, MessageType.Error, `A/C ${this.f.acct_num.value} had already paid all the Installment..`);
          this.showTransactionDtl=false;
          return
        }
        else{
          var rd={
            "ardb_cd":this.sys.ardbCD,
            "brn_cd":this.sys.BranchCode
          }
          this.svc.addUpdDel('Deposit/PopulateActiveSIList',rd).subscribe(data=>{console.log(data)
          this.StandingRD=data
          if(this.StandingRD.length>0){
            debugger
            this.StandingArr=this.StandingRD.filter(e=>e.acc_type_to.toLowerCase()=='recurring deposit')
            debugger
            console.log(this.StandingArr.filter(p=>p.acc_num_to == this.f.acct_num.value))
            this.StandingArr2=this.StandingArr.filter(p=>p.acc_num_to==this.f.acct_num.value)[0]
            debugger
            if(this.StandingArr2){
              this.HandleMessage(true, MessageType.Error, `A/C ${this.f.acct_num.value} have already Standing Instraction, Transaction Not Permited from this screen !!!`);
              this.showTransactionDtl=false;
              return
            }
          }
        })
          
          debugger
          
          this.transType.key = 'D';
          this.transType.Description = 'Deposit';
          
          this.tdDefTransFrm.patchValue({
            trans_type: this.transType.Description,
            trans_type_key: this.transType.key,
          
          amount: this.accNoEnteredForTransaction.instl_amt
          });
          this.hideOnClose = true;
          // this.showAmtDrpDn = true;
        debugger
        }
      }
      //Account Close
     else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
      if (this.resBrnCd != this.sys.BranchCode) {
        this.HandleMessage(true, MessageType.Error, 'Account CLOSE will only be possible on Home Branch.');
        this.onResetClick();

        return;
      }
      else{
      this.showtransmodeforC = true; //marker
      this.counter = 0;
      this.counter1 = 0;
      // this.showTransModeForR=false //marker
      // check maturity of account
      this.showTransMode = false //marker
      let isMatured = false;
      this.isMat = isMatured
      const cDt = this.sys.CurrentDate.getTime();
      const matDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime();
      let afterMatured = false;
      this.afMat1 = afterMatured
      this.diff1=Math.ceil((cDt - matDt) / (1000 * 3600 * 24));
      console.log(cDt,matDt,this.diff1);
      if(this.diff1>=0){
        this.afMat1 = true
      }
      else{ this.afMat1 = false}
      debugger
       this.aftmatInt=0;
       if((this.sys.ardbCD!='20'&& this.sys.ardbCD!='26') && ( this.afMat1 == true && (accTypCode === 2 || accTypCode === 4|| accTypCode === 5) )) {
        // if((this.sys.ardbCD!='20'&& this.sys.ardbCD!='26'&& this.sys.ardbCD!='25') && ( this.afMat1 == true && (accTypCode === 2 || accTypCode === 4) )) {
         debugger
         if(this.diff1==0){
          this.showOnClose = true;
          this.tdDefTransFrm.patchValue({
            ovd_intt_recov: 0,
            curr_prn_recov: 0,
            bonus_amt: 0,
            amount: (+this.accNoEnteredForTransaction.prn_amt),
            curr_intt_recov:(+this.interestAmount),
            td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.interestAmount
            });
         }
         else{
          this.modalRefClose = this.modalService.show(this.afterMatClose,
            { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
        
        
        const temp_gen_param = new p_gen_param();
            temp_gen_param.ad_acc_type_cd=2;//for simple interest calculation like FD //PARTHA
            temp_gen_param.ad_prn_amt=this.accNoEnteredForTransaction.prn_amt+this.interestAmount;
            temp_gen_param.ai_period=this.diff1-1;//for subtract current date //PARTHA
            temp_gen_param.ad_intt_rt = this.sys.ardbCD=='3'?(+  await this.getInttRate(this.f.acc_type_cd.value)) :4;//Need to be change in future
            temp_gen_param.as_intt_type = "O" //Need to be change in future
            temp_gen_param.adt_temp_dt = this.sys.CurrentDate;
            this.isLoading=true;
            // const data = await this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
              const data = await this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).toPromise()
              if(data) {
                this.isLoading=false;
                debugger
                console.log(data)
                this.aftmatInt = data;
                if(data){
                  debugger
                  if(Number(this.f.acc_type_cd.value) == 4 && this.sys.ardbCD=='1' ){
                              debugger
                              this.showOnClose = true;
                              this.tdDefTransFrm.patchValue({
                                ovd_intt_recov: 0,
                                curr_prn_recov: 0,
                                bonus_amt: 0,
                                amount: (+this.accNoEnteredForTransaction.prn_amt),
                                curr_intt_recov:(+this.interestAmount)+(+this.aftmatInt),
                                td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.interestAmount+(+this.aftmatInt)
                                });
                                
                            }
                           else if(Number(this.f.acc_type_cd.value) == 5 && this.sys.ardbCD=='25' ){
                              debugger
                              this.showOnClose = true;
                              this.tdDefTransFrm.patchValue({
                                ovd_intt_recov: 0,
                                curr_prn_recov: 0,
                                bonus_amt: 0,
                                amount: (+this.accNoEnteredForTransaction.prn_amt),
                                curr_intt_recov:(+this.interestAmount)+(+this.aftmatInt),
                                td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.interestAmount+(+this.aftmatInt)
                                });
                                
                            }
                }
      //             if (this.sys.ardbCD!='20' && (accTypCode == 2||accTypCode == 3)) {

      //           //  if (accTypCode == 2||accTypCode == 4) {
      //             console.log("hello")
      //             this.tdDefTransFrm.patchValue({
      //               curr_intt_recov:this.accNoEnteredForTransaction.intt_amt+this.aftmatInt,
      //               td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt+this.matInt
      //             });
      //             debugger
      //             // this.accDtlsFrm.controls.mat_amt.setValue(this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt+this.matInt)
      //             // this.accDtlsFrm.controls.intt_amt.setValue(this.accNoEnteredForTransaction.intt_amt+this.matInt)
                  
                // }
              }
            }
         }
          
            
      debugger
      if (cDt >= matDt) {
        isMatured = true;
        this.isMat = isMatured

        console.log(isMatured)

      }
      else {
        isMatured = false;
        this.isMat = isMatured

        // this.processInterest();
        console.log(isMatured)
        // const temp_gen_param = new p_gen_param();
        // this.modalRefClose = this.modalService.show(this.preClose,
        //   { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })


      }
      debugger
      this.transType.key = 'W';
      this.transType.Description = 'Close';
      this.accNoEnteredForTransaction.ShowClose = true;
      // this.accNoEnteredForTransaction.acc_close_dt = new Date();
      // this.refresh = false;
      // this.msg.sendCommonTmDepositAll(this.accNoEnteredForTransaction);
      // this.refresh = true;
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key,
        trans_mode: 'C',
        amount: accTypCode === 6 ? this.accNoEnteredForTransaction.instl_amt : this.accNoEnteredForTransaction.prn_amt
      });

      if (accTypCode === 2 || accTypCode === 3 ||
        accTypCode === 4  || accTypCode === 5 ||
        accTypCode === 6) {
        console.log("inside fd")
        console.log(this.resbrnCD1)
        
        this.showOnClose = true;
        console.log(this.accNoEnteredForTransaction.intt_rt + " " + this.sys.PenalInttRtFrAccPreMatureClosing)
        const cDt = this.sys.CurrentDate.getTime();
        const opDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.opening_dt.toString()).getTime();
        // const o = Utils.convertStringToDt(this.td.opening_dt.value);

        const diffDays = Math.ceil((Math.abs(cDt - opDt)) / (1000 * 3600 * 24));
        this.diff = diffDays
        console.log(cDt + " " + opDt + " " + diffDays)
        console.log(this.accNoEnteredForTransaction)
        const temp_gen_param = new p_gen_param();
        console.log(this.resBrnCatgCd)

        temp_gen_param.ad_acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
        temp_gen_param.ad_prn_amt = this.accNoEnteredForTransaction.prn_amt;
        temp_gen_param.adt_temp_dt = this.accNoEnteredForTransaction.opening_dt;
        temp_gen_param.ai_period = diffDays;
        // temp_gen_param.ad_intt_rt = this.accNoEnteredForTransaction.intt_rt - this.sys.PenalInttRtFrAccPreMatureClosing
        // this.effInt = temp_gen_param.ad_intt_rt > 0 ? temp_gen_param.ad_intt_rt : 0
        // console.log(this.effInt)
        


     
        // console.log("here")
        var dt = {
          acc_type_cd: temp_gen_param.ad_acc_type_cd,
          catg_cd: this.resBrnCatgCd,
          no_of_days: this.diff,
          ardb_cd:this.sys.ardbCD
        }
        debugger
        console.log(dt)
        var dc = {
          acc_type_cd: temp_gen_param.ad_acc_type_cd,
          catg_cd: this.resBrnCatgCd,
          no_of_days: this.diff,
          ardb_cd:this.sys.ardbCD,
          ad_intt_rt:this.accNoEnteredForTransaction.intt_rt
        }
        console.log(dc)
        if((this.sys.ardbCD=='4' || this.sys.ardbCD=='3'|| this.sys.ardbCD=='21'|| this.sys.ardbCD=='23' || this.sys.ardbCD=='26') &&  this.isMat==false && (accTypCode == 2||accTypCode == 4||accTypCode == 3)){
          this.isLoading=true;
          
                  const data = await this.svc.addUpdDel<any>('Deposit/GetInttRatePremature', dc).toPromise()
                  if(data){
                  this.effInt = data;
                  this.isLoading=false;
                   if(this.effInt){
            temp_gen_param.ad_intt_rt = this.effInt;
            temp_gen_param.ad_acc_type_cd = (accTypCode == 4 && this.diff<365?2:accTypCode == 3 && this.sys.ardbCD=='23'?4:this.accNoEnteredForTransaction.acc_type_cd);
          debugger
            
              this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
                res => {
                  if(res){
                    console.log(res)
                    this.closeInt = res;
                    this.isLoading=false;
                  }
                  
                  // this.tdDefTransFrm.patchValue({
                  //   interest: +res
                  // });
                  
                  if (temp_gen_param.ad_acc_type_cd != 5 && temp_gen_param.ad_acc_type_cd != 6) {
                    console.log("hello")
                    this.isLoading=false;
                    //PARTHA
                    debugger

                    if(this.afMat1){
                     
                        this.tdDefTransFrm.patchValue({
                          ovd_intt_recov: 0,
                          curr_prn_recov: 0,
                          bonus_amt: 0,
                          amount: (+this.accNoEnteredForTransaction.prn_amt),
                          curr_intt_recov:this.interestAmount,
                          // curr_intt_recov:this.interestAmount+this.aftmatInt,
                          td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.interestAmount
                          // td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.interestAmount+this.aftmatInt
                        });
                        debugger
                       this.isLoading=false;
                      
                    }
                    else{
                     debugger
                        this.tdDefTransFrm.patchValue({
                          // amount: (this.accNoEnteredForTransaction.prn_amt +
                          //   (this.interestAmount > 0 ?
                          //   this.interestAmount :
                          //   (0.015 * this.accNoEnteredForTransaction.prn_amt))).toFixed(2),
                          amount: (this.accNoEnteredForTransaction.prn_amt),
                          // curr_intt_recov: (this.interestAmount > 0 ?
                          //   this.interestAmount :
                          //   (0.015 * this.accNoEnteredForTransaction.prn_amt)).toFixed(2),
                        
                          curr_intt_recov: isMatured ? this.interestAmount : this.closeInt?this.closeInt:0,
      
                //           curr_intt_recov:
                //           this.closeInt
                // ,
                          // ovd_intt_recov: isMatured? '':this.sys.PenalInttRtFrAccPreMatureClosing,
                          ovd_intt_recov: 0,
                          bonus_amt: 0,
                          // curr_prn_recov: isMatured ? (this.sys.DepositBonusRate *
                          //   this.accNoEnteredForTransaction.prn_amt).toFixed(2) : '',
                          curr_prn_recov: 0,
                          // td_def_mat_amt: (this.accNoEnteredForTransaction.prn_amt +
                          //   (this.interestAmount > 0 ?
                          //     this.interestAmount :
                          //     (  temp_gen_param.ad_intt_rt* this.accNoEnteredForTransaction.prn_amt))).toFixed(2)
                        
                          td_def_mat_amt: isMatured ? this.accNoEnteredForTransaction.prn_amt + this.interestAmount :this.closeInt?this.closeInt+ this.accNoEnteredForTransaction.prn_amt  :0
                         
                          // td_def_mat_amt: this.accNoEnteredForTransaction.prn_amt + this.closeInt
      
                        });
                      
                      debugger
                      this.isLoading=false;
                    }
                    
  
                    // marker for change, to be uncommented
                    // const cDt = this.sys.CurrentDate.getTime();
                    // const matDt=Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime()
                    // const diffDays = Math.ceil((Math.abs(matDt - cDt)) / (1000 * 3600 * 24))/365;
                    // console.log(diffDays)
                    // const inttRt=3.5
                    // this.intt= this.accNoEnteredForTransaction.prn_amt * inttRt * diffDays 
                    // this.intt=this.intt/100
                    // console.log(this.intt)
                   
                    // this.tdDefTransFrm.patchValue({
                    //   curr_intt_recov: isMatured ? +this.interestAmount + (+Math.round(this.intt)) : +this.closeInt + (+Math.round(this.intt)),
                    //   td_def_mat_amt: isMatured ? +this.accNoEnteredForTransaction.prn_amt + (+this.interestAmount) + (+Math.round(this.intt)): +this.accNoEnteredForTransaction.prn_amt + (+this.closeInt) + (+Math.round(this.intt))
  
                    // })
                    // this.inttMsg='The additional interest of Rs '+ Math.round(this.intt) +' with an interest rate of '+ inttRt + '% for '+ diffDays*365 + ' days has been accrued.'
                    // // this.HandleMessage(true, MessageType.Info, );
  
  
                    // this.modalRefClose = this.modalService.show(this.interestMsg,
                    //   { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
                    // marker for change, to be uncommented
                    
                  }
                  
                })
          }
                  }
              
                
              
              console.log(this.effInt)
              debugger
          
       }
       
        
          else if(accTypCode === 5 ||accTypCode === 6){
            temp_gen_param.ad_intt_rt = this.accNoEnteredForTransaction.intt_rt - this.sys.PenalInttRtFrAccPreMatureClosing
            this.effInt = temp_gen_param.ad_intt_rt > 0 ? temp_gen_param.ad_intt_rt : 0
            console.log(this.effInt)
            this.isLoading=false;
             if(this.effInt){
            temp_gen_param.ad_intt_rt = this.effInt
          debugger
            
              this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
                res => {
                  if(res){
                    console.log(res)
                    this.closeInt = res;
                    this.isLoading=false;
                  }
                  
                  // this.tdDefTransFrm.patchValue({
                  //   interest: +res
                  // });
                  
                  if (temp_gen_param.ad_acc_type_cd != 5 && temp_gen_param.ad_acc_type_cd != 6) {
                    console.log("hello")
                    this.isLoading=false;
                    //PARTHA
                    debugger

                    if(this.afMat1){
                     
                        this.tdDefTransFrm.patchValue({
                          ovd_intt_recov: 0,
                          curr_prn_recov: 0,
                          bonus_amt: 0,
                          amount: (+this.accNoEnteredForTransaction.prn_amt),
                          curr_intt_recov:this.interestAmount,
                          // curr_intt_recov:this.interestAmount+this.aftmatInt,
                          td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.interestAmount
                          // td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.interestAmount+this.aftmatInt
                        });
                        debugger
                       this.isLoading=false;
                      
                    }
                    else{
                     debugger
                        this.tdDefTransFrm.patchValue({
                          // amount: (this.accNoEnteredForTransaction.prn_amt +
                          //   (this.interestAmount > 0 ?
                          //   this.interestAmount :
                          //   (0.015 * this.accNoEnteredForTransaction.prn_amt))).toFixed(2),
                          amount: (this.accNoEnteredForTransaction.prn_amt),
                          // curr_intt_recov: (this.interestAmount > 0 ?
                          //   this.interestAmount :
                          //   (0.015 * this.accNoEnteredForTransaction.prn_amt)).toFixed(2),
                        
                          curr_intt_recov: isMatured ? this.interestAmount : this.closeInt?this.closeInt:0,
      
                //           curr_intt_recov:
                //           this.closeInt
                // ,
                          // ovd_intt_recov: isMatured? '':this.sys.PenalInttRtFrAccPreMatureClosing,
                          ovd_intt_recov: 0,
                          bonus_amt: 0,
                          // curr_prn_recov: isMatured ? (this.sys.DepositBonusRate *
                          //   this.accNoEnteredForTransaction.prn_amt).toFixed(2) : '',
                          curr_prn_recov: 0,
                          // td_def_mat_amt: (this.accNoEnteredForTransaction.prn_amt +
                          //   (this.interestAmount > 0 ?
                          //     this.interestAmount :
                          //     (  temp_gen_param.ad_intt_rt* this.accNoEnteredForTransaction.prn_amt))).toFixed(2)
                        
                          td_def_mat_amt: isMatured ? this.accNoEnteredForTransaction.prn_amt + this.interestAmount :this.closeInt?this.closeInt+ this.accNoEnteredForTransaction.prn_amt  :0
                         
                          // td_def_mat_amt: this.accNoEnteredForTransaction.prn_amt + this.closeInt
      
                        });
                      
                      debugger
                      this.isLoading=false;
                    }
                    
  
                    // marker for change, to be uncommented
                    // const cDt = this.sys.CurrentDate.getTime();
                    // const matDt=Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime()
                    // const diffDays = Math.ceil((Math.abs(matDt - cDt)) / (1000 * 3600 * 24))/365;
                    // console.log(diffDays)
                    // const inttRt=3.5
                    // this.intt= this.accNoEnteredForTransaction.prn_amt * inttRt * diffDays 
                    // this.intt=this.intt/100
                    // console.log(this.intt)
                   
                    // this.tdDefTransFrm.patchValue({
                    //   curr_intt_recov: isMatured ? +this.interestAmount + (+Math.round(this.intt)) : +this.closeInt + (+Math.round(this.intt)),
                    //   td_def_mat_amt: isMatured ? +this.accNoEnteredForTransaction.prn_amt + (+this.interestAmount) + (+Math.round(this.intt)): +this.accNoEnteredForTransaction.prn_amt + (+this.closeInt) + (+Math.round(this.intt))
  
                    // })
                    // this.inttMsg='The additional interest of Rs '+ Math.round(this.intt) +' with an interest rate of '+ inttRt + '% for '+ diffDays*365 + ' days has been accrued.'
                    // // this.HandleMessage(true, MessageType.Info, );
  
  
                    // this.modalRefClose = this.modalService.show(this.interestMsg,
                    //   { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
                    // marker for change, to be uncommented
                    
                  }
                  
                })
          }
          }
          else{
            debugger
            this.isLoading=true;
            this.svc.addUpdDel<any>('Deposit/GetInttRate', dt).subscribe(
            resrt => {
              console.log(resrt)
              this.effInt = resrt;
              this.isLoading=false;
               if(this.effInt){
            temp_gen_param.ad_intt_rt = this.effInt
          debugger
            
              this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
                res => {
                  if(res){
                    console.log(res)
                    this.closeInt = res;
                    this.isLoading=false;
                  }
                  
                  // this.tdDefTransFrm.patchValue({
                  //   interest: +res
                  // });
                  
                  if (temp_gen_param.ad_acc_type_cd != 5 && temp_gen_param.ad_acc_type_cd != 6) {
                    console.log("hello")
                    this.isLoading=false;
                    //PARTHA
                    debugger

                    if(this.afMat1){
                     
                        this.tdDefTransFrm.patchValue({
                          ovd_intt_recov: 0,
                          curr_prn_recov: 0,
                          bonus_amt: 0,
                          amount: (+this.accNoEnteredForTransaction.prn_amt),
                          curr_intt_recov:this.interestAmount,
                          // curr_intt_recov:this.interestAmount+this.aftmatInt,
                          td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.interestAmount
                          // td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.interestAmount+this.aftmatInt
                        });
                        debugger
                       this.isLoading=false;
                      
                    }
                    else{
                     debugger
                        this.tdDefTransFrm.patchValue({
                          // amount: (this.accNoEnteredForTransaction.prn_amt +
                          //   (this.interestAmount > 0 ?
                          //   this.interestAmount :
                          //   (0.015 * this.accNoEnteredForTransaction.prn_amt))).toFixed(2),
                          amount: (this.accNoEnteredForTransaction.prn_amt),
                          // curr_intt_recov: (this.interestAmount > 0 ?
                          //   this.interestAmount :
                          //   (0.015 * this.accNoEnteredForTransaction.prn_amt)).toFixed(2),
                        
                          curr_intt_recov: isMatured ? this.interestAmount : this.closeInt?this.closeInt:0,
      
                //           curr_intt_recov:
                //           this.closeInt
                // ,
                          // ovd_intt_recov: isMatured? '':this.sys.PenalInttRtFrAccPreMatureClosing,
                          ovd_intt_recov: 0,
                          bonus_amt: 0,
                          // curr_prn_recov: isMatured ? (this.sys.DepositBonusRate *
                          //   this.accNoEnteredForTransaction.prn_amt).toFixed(2) : '',
                          curr_prn_recov: 0,
                          // td_def_mat_amt: (this.accNoEnteredForTransaction.prn_amt +
                          //   (this.interestAmount > 0 ?
                          //     this.interestAmount :
                          //     (  temp_gen_param.ad_intt_rt* this.accNoEnteredForTransaction.prn_amt))).toFixed(2)
                        
                          td_def_mat_amt: isMatured ? this.accNoEnteredForTransaction.prn_amt + this.interestAmount :this.closeInt?this.closeInt+ this.accNoEnteredForTransaction.prn_amt  :0
                         
                          // td_def_mat_amt: this.accNoEnteredForTransaction.prn_amt + this.closeInt
      
                        });
                      
                      debugger
                      this.isLoading=false;
                    }
                    
  
                    // marker for change, to be uncommented
                    // const cDt = this.sys.CurrentDate.getTime();
                    // const matDt=Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime()
                    // const diffDays = Math.ceil((Math.abs(matDt - cDt)) / (1000 * 3600 * 24))/365;
                    // console.log(diffDays)
                    // const inttRt=3.5
                    // this.intt= this.accNoEnteredForTransaction.prn_amt * inttRt * diffDays 
                    // this.intt=this.intt/100
                    // console.log(this.intt)
                   
                    // this.tdDefTransFrm.patchValue({
                    //   curr_intt_recov: isMatured ? +this.interestAmount + (+Math.round(this.intt)) : +this.closeInt + (+Math.round(this.intt)),
                    //   td_def_mat_amt: isMatured ? +this.accNoEnteredForTransaction.prn_amt + (+this.interestAmount) + (+Math.round(this.intt)): +this.accNoEnteredForTransaction.prn_amt + (+this.closeInt) + (+Math.round(this.intt))
  
                    // })
                    // this.inttMsg='The additional interest of Rs '+ Math.round(this.intt) +' with an interest rate of '+ inttRt + '% for '+ diffDays*365 + ' days has been accrued.'
                    // // this.HandleMessage(true, MessageType.Info, );
  
  
                    // this.modalRefClose = this.modalService.show(this.interestMsg,
                    //   { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
                    // marker for change, to be uncommented
                    
                  }
                  
                })
          }
            })
          }

          // if(this.effInt){
          //   temp_gen_param.ad_intt_rt = this.effInt
          // debugger
            
          //     this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
          //       res => {
          //         if(res){
          //           console.log(res)
          //           this.closeInt = res;
          //           this.isLoading=false;
          //         }
                  
          //         // this.tdDefTransFrm.patchValue({
          //         //   interest: +res
          //         // });
                  
          //         if (temp_gen_param.ad_acc_type_cd != 5 && temp_gen_param.ad_acc_type_cd != 6) {
          //           console.log("hello")
          //           this.isLoading=false;
          //           //PARTHA
          //           debugger

          //           if(this.afMat1){
                     
          //               this.tdDefTransFrm.patchValue({
          //                 ovd_intt_recov: 0,
          //                 curr_prn_recov: 0,
          //                 bonus_amt: 0,
          //                 amount: (+this.accNoEnteredForTransaction.prn_amt),
          //                 curr_intt_recov:this.interestAmount,
          //                 // curr_intt_recov:this.interestAmount+this.aftmatInt,
          //                 td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.interestAmount
          //                 // td_def_mat_amt:this.accNoEnteredForTransaction.prn_amt + this.interestAmount+this.aftmatInt
          //               });
          //               debugger
          //              this.isLoading=false;
                      
          //           }
          //           else{
          //            debugger
          //               this.tdDefTransFrm.patchValue({
          //                 // amount: (this.accNoEnteredForTransaction.prn_amt +
          //                 //   (this.interestAmount > 0 ?
          //                 //   this.interestAmount :
          //                 //   (0.015 * this.accNoEnteredForTransaction.prn_amt))).toFixed(2),
          //                 amount: (this.accNoEnteredForTransaction.prn_amt),
          //                 // curr_intt_recov: (this.interestAmount > 0 ?
          //                 //   this.interestAmount :
          //                 //   (0.015 * this.accNoEnteredForTransaction.prn_amt)).toFixed(2),
                        
          //                 curr_intt_recov: isMatured ? this.interestAmount : this.closeInt?this.closeInt:0,
      
          //       //           curr_intt_recov:
          //       //           this.closeInt
          //       // ,
          //                 // ovd_intt_recov: isMatured? '':this.sys.PenalInttRtFrAccPreMatureClosing,
          //                 ovd_intt_recov: 0,
          //                 bonus_amt: 0,
          //                 // curr_prn_recov: isMatured ? (this.sys.DepositBonusRate *
          //                 //   this.accNoEnteredForTransaction.prn_amt).toFixed(2) : '',
          //                 curr_prn_recov: 0,
          //                 // td_def_mat_amt: (this.accNoEnteredForTransaction.prn_amt +
          //                 //   (this.interestAmount > 0 ?
          //                 //     this.interestAmount :
          //                 //     (  temp_gen_param.ad_intt_rt* this.accNoEnteredForTransaction.prn_amt))).toFixed(2)
                        
          //                 td_def_mat_amt: isMatured ? this.accNoEnteredForTransaction.prn_amt + this.interestAmount :this.closeInt?this.closeInt+ this.accNoEnteredForTransaction.prn_amt  :0
                         
          //                 // td_def_mat_amt: this.accNoEnteredForTransaction.prn_amt + this.closeInt
      
          //               });
                      
          //             debugger
          //             this.isLoading=false;
          //           }
                    
  
          //           // marker for change, to be uncommented
          //           // const cDt = this.sys.CurrentDate.getTime();
          //           // const matDt=Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime()
          //           // const diffDays = Math.ceil((Math.abs(matDt - cDt)) / (1000 * 3600 * 24))/365;
          //           // console.log(diffDays)
          //           // const inttRt=3.5
          //           // this.intt= this.accNoEnteredForTransaction.prn_amt * inttRt * diffDays 
          //           // this.intt=this.intt/100
          //           // console.log(this.intt)
                   
          //           // this.tdDefTransFrm.patchValue({
          //           //   curr_intt_recov: isMatured ? +this.interestAmount + (+Math.round(this.intt)) : +this.closeInt + (+Math.round(this.intt)),
          //           //   td_def_mat_amt: isMatured ? +this.accNoEnteredForTransaction.prn_amt + (+this.interestAmount) + (+Math.round(this.intt)): +this.accNoEnteredForTransaction.prn_amt + (+this.closeInt) + (+Math.round(this.intt))
  
          //           // })
          //           // this.inttMsg='The additional interest of Rs '+ Math.round(this.intt) +' with an interest rate of '+ inttRt + '% for '+ diffDays*365 + ' days has been accrued.'
          //           // // this.HandleMessage(true, MessageType.Info, );
  
  
          //           // this.modalRefClose = this.modalService.show(this.interestMsg,
          //           //   { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
          //           // marker for change, to be uncommented
                    
          //         }
                  
          //       })
          // }
        
        
          
          
        this.td.amount.disable();
        console.log(this.tdDefTransFrm.controls.amount.value, this.closeInt, this.accNoEnteredForTransaction.prn_amt, this.interestAmount)
       
// 
     
          // this.td.td_def_mat_amt.setValue(this.accNoEnteredForTransaction.prn_amt + this.closeInt+this.intt);
         
// // this.isLoading = true;
      if (isMatured == false && (accTypCode === 2 || accTypCode == 4 ||accTypCode == 3)) {
        this.modalRefClose = this.modalService.show(this.preClose,
          { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
      }

      // if (isMatured == false && accTypCode == 3) {
      //   this.modalRefClose = this.modalService.show(this.preCloseDbs,
      //     { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
      // }
   

      }
      if (accTypCode === 7) {
        this.tdDefTransFrm.patchValue({
          paid_to: 'SELF',
          particulars: 'To Closing',
          amount: (+this.accDtlsFrm.controls.clr_bal.value)
        });
        this.tdDefTransFrm.controls.amount.disable();
        
      }
      
      //for ghatal premature fd close without this condition this.sys.ardbCD!='4'&& this.isMat!=true &&
      if (accTypCode === 5 || (accTypCode==2 && this.resbrnCD1[0].intt_trf_type=='H' || accTypCode==2 && this.resbrnCD1[0].intt_trf_type=='Q' || accTypCode==2 && this.resbrnCD1[0].intt_trf_type=='Y')) { // Special logic for MIS on close
        console.log(this.diff)
        debugger
        const misInstalments = new td_intt_dtls();
        misInstalments.ardb_cd = this.sys.ardbCD
        misInstalments.brn_cd = this.sys.BranchCode;
        misInstalments.acc_num = this.accNoEnteredForTransaction.acc_num;
        misInstalments.acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
        this.svc.addUpdDel<any>('Deposit/GetInttDetails', misInstalments).subscribe(
          misInstalmentsRes => {
            console.log(misInstalmentsRes)
            this.misInstallemntsForSelectedAcc = [];
            this.misInstallemntsForSelectedAcc = Utils.ChkArrNotEmptyRetrnEmptyArr(misInstalmentsRes);
            let i = 1;
            this.showMisInstalment = true;
            this.misInstallemntsForSelectedAcc.forEach(e => {
              if (e.paid_status.toLocaleLowerCase() === 'p') {
                this.counter = this.counter + 1
              }
            })
            this.forB=0;
            this.misInstallemntsForSelectedAcc.forEach(e => {
              if (e.paid_status.toLocaleLowerCase() === 'b') {
                this.forB+=e.intt_amt;
                console.log(e)
                this.counter1 = this.counter1 + 1;
              }

            },
              this.matureIntForMis = this.rdInstallamentOption[this.rdInstallamentOption.length - 1]
            );
            console.log(this.counter)
            console.log(this.matureIntForMis)

            this.showOnClose = true;
            console.log(this.accNoEnteredForTransaction, this.diff)
            console.log(this.counter)
            this.td.amount.disable();
            // this.showTransModeForR=f;
            this.showtransmodeforC = true
            var d = {
              ardb_cd:this.sys.ardbCD,
              acc_type_cd: 2,
              catg_cd: this.resBrnCatgCd,
              no_of_days: this.diff
            }
            const temp_gen_param = new p_gen_param();

            this.svc.addUpdDel<any>('Deposit/GetInttRate', d).subscribe(
              res_rt => {
                console.log(res_rt)
                this.res_rt = res_rt
                temp_gen_param.ad_acc_type_cd = 2;
                temp_gen_param.ad_prn_amt = this.accNoEnteredForTransaction.prn_amt;
                temp_gen_param.adt_temp_dt = this.accNoEnteredForTransaction.opening_dt;
                temp_gen_param.ai_period = this.diff;
                // temp_gen_param.ad_intt_rt=res_rt-this.sys.PenalInttRtFrAccPreMatureClosing //marker subjected to change
                temp_gen_param.ad_intt_rt = accTypCode == 5 && isMatured == false?4: res_rt
                this.effInt = temp_gen_param.ad_intt_rt > 0 ? temp_gen_param.ad_intt_rt : 0
                // this.effInt=res_rt
                // temp_gen_param.ad_intt_rt=this.effInt
                this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
                  result => {
                    console.log(result)
                    this.preCloseMIS=result
                    console.log(d)
                    console.log(this.matureIntForMis)
                    this.matureIntForMis = this.matureIntForMis ? this.matureIntForMis : 0
                    // if(accTypCode == 5){
                    //   console.log("MIS PRE CLOSE")
                    //   this.tdDefTransFrm.patchValue({
                    //     amount: (this.accNoEnteredForTransaction.prn_amt),
                    //     curr_intt_recov: isMatured ? this.accNoEnteredForTransaction.intt_amt : this.MIScloseInt,
                    //     ovd_intt_recov: 0,
                    //     bonus_amt: 0,
                    //     curr_prn_recov: 0,
                    //     td_def_mat_amt: isMatured ? this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt : this.accNoEnteredForTransaction.prn_amt + this.closeInt
                       
                    //   })
                    //   this.td.amount.disable();
                    // }
                    if (isMatured == false && (accTypCode == 5)) {
                      isMatured == false && (accTypCode == 5)?this.misPreMatClose=true:this.misPreMatClose=false;
                      this.modalRefClose = this.modalService.show(this.preClose,
                        { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
                    }
                    if(accTypCode==5){//MISCLOSE
                      this.tdDefTransFrm.patchValue({
                        interest: +result,
                        // amount: this.accNoEnteredForTransaction.prn_amt
                        // + this.accNoEnteredForTransaction.intt_amt,
                        amount: this.accNoEnteredForTransaction.prn_amt,
                        curr_intt_recov: isMatured ? this.matureIntForMis :(this.accNoEnteredForTransaction.intt_amt * this.counter)>Number(this.preCloseMIS)?(-this.accNoEnteredForTransaction.intt_amt * this.counter)+Number(this.preCloseMIS):this.counter>0?Number(this.preCloseMIS)-(this.accNoEnteredForTransaction.intt_amt * this.counter):Number(this.preCloseMIS),
                        // ovd_intt_recov: isMatured?'':this.sys.PenalInttRtFrAccPreMatureClosing, //marker subjected to change
                        ovd_intt_recov: 0,
                        // curr_prn_recov: +result,
                        curr_prn_recov: 0,
                        td_def_mat_amt: isMatured ? (this.accNoEnteredForTransaction.prn_amt + this.matureIntForMis) : (this.accNoEnteredForTransaction.prn_amt
                           - ((this.accNoEnteredForTransaction.intt_amt * this.counter)-Number(this.preCloseMIS))),
                        // trans_mode:'Close'
                      });
                      this.mat_val = Number(temp_gen_param.ad_prn_amt) + Number(this.tdDefTransFrm.controls.interest.value);
                    }
                    debugger
                    if(accTypCode==2 && (this.resbrnCD1[0].intt_trf_type=='H'||this.resbrnCD1[0].intt_trf_type=='Q'||this.resbrnCD1[0].intt_trf_type=='Y'))
                   {
                    this.fdSum=0
                    // this.misInstallemntsForSelectedAcc.forEach(e=>this.fdSum+=this.counter1*Number(this.accDtlsFrm.controls.intt_amt.value))

                    // this.misInstallemntsForSelectedAcc.forEach(e=>this.fdSum+=e.intt_amt)
                    this.fdSum=this.forB;
                    
                    this.tdDefTransFrm.patchValue({
                      interest: +result,
                      // amount: this.accNoEnteredForTransaction.prn_amt
                      // + this.accNoEnteredForTransaction.intt_amt,
                      amount: this.accNoEnteredForTransaction.prn_amt,
                      // curr_intt_recov: this.accNoEnteredForTransaction.intt_amt * this.counter1,
                      curr_intt_recov: this.fdSum,
                      // ovd_intt_recov: isMatured?'':this.sys.PenalInttRtFrAccPreMatureClosing, //marker subjected to change
                      ovd_intt_recov: 0,
                      // curr_prn_recov: +result,
                      curr_prn_recov: 0,
                      td_def_mat_amt:(this.accNoEnteredForTransaction.prn_amt 
                        + this.fdSum),
                      // trans_mode:'Close'
                    });
                    this.mat_val = Number(temp_gen_param.ad_prn_amt )+ Number(this.tdDefTransFrm.controls.interest.value);
                   }

                  })
              })
          })
          if(accTypCode==2 && this.tdDefTransFrm.controls.trans_mode.value=='C'){
            this.tdDefTransFrm.controls.curr_intt_recov.enable();

          }
      }
      if (accTypCode === 6) {
        

        console.log("special logic for rd") // Special logic for RD on close
        var rdDt = {
          acc_num: this.accNoEnteredForTransaction.acc_num,
          ardb_cd: this.sys.ardbCD
        }
        this.isLoading=true;
        this.svc.addUpdDel<any>('Deposit/GetRDInstallment', rdDt).subscribe(
          rdInstallamentRes => {
            this.isLoading=false;
            this.rdInstallemntsForSelectedAcc = [];
            this.rdInstallemntsForSelectedAcc = Utils.ChkArrNotEmptyRetrnEmptyArr(rdInstallamentRes);
            let i = 1;
            this.rdInstallemntsForSelectedAcc.forEach(e => {
              if (e.status.toLocaleLowerCase() === 'p') {
                this.counter = this.counter + 1
              }
            });
            console.log(this.counter)
            let param = new p_gen_param();
            param.as_acc_num = this.accNoEnteredForTransaction.acc_num;
            param.ad_instl_amt = this.accNoEnteredForTransaction.instl_amt;
            console.log(param.ad_instl_amt)
            param.an_instl_no = this.counter;
            param.an_intt_rate = isMatured ? this.accNoEnteredForTransaction.intt_rt : (this.accNoEnteredForTransaction.intt_rt - this.sys.PenalInttRtFrAccPreMatureClosing);
            param.ardb_cd = this.sys.ardbCD;
            param.ai_period = this.diff;
            this.effInt = param.an_intt_rate
            console.log(this.effInt);
            this.isLoading=true;
            this.svc.addUpdDel<any>('Deposit/F_CALCRDINTT_REG', param).subscribe(
              res => {
                console.log(res)
                this.rdInClose = res;
                if (undefined !== res
                  && null !== res ) {
                  this.isLoading=false;
                  console.log(this.effInt)
                  this.tdDefTransFrm.patchValue({
                    penal_rt: this.sys.PenalInttRtFrAccPreMatureClosing,
                    eff_int: param.an_intt_rate,
                    curr_intt_recov: res.toFixed(2),
                    // amount: isMatured ? '' : param.ad_instl_amt * this.counter,
                    amount:  param.ad_instl_amt * this.counter,
                    //  curr_intt_recov: isMatured ?this.accNoEnteredForTransaction.intt_amt :this.closeInt,
                    ovd_intt_recov: 0,
                    bonus_amt: 0,
                    curr_prn_recov: 0,
                    // td_def_mat_amt: isMatured ? this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt : param.ad_instl_amt * this.counter + res
                    td_def_mat_amt: param.ad_instl_amt * this.counter + res ,
                  })
                  debugger
                  console.log(this.tdDefTransFrm.controls.eff_int.value)
                  console.log(this.accNoEnteredForTransaction)
                  // debugger;
                }

                param = new p_gen_param();
                param.as_acc_num = this.accNoEnteredForTransaction.acc_num;
                param.ardb_cd = this.sys.ardbCD;
                this.isLoading=true;
                this.svc.addUpdDel<any>('Deposit/F_CAL_RD_PENALTY', param).subscribe(
                  res => {
                    this.rdPenal=0
                    console.log(res)
                    if (undefined !== res
                      && null !== res) {
                        this.isLoading=false;
                        this.rdPenal=res;
                        this.tdDefTransFrm.patchValue({
                        ovd_intt_recov: res.toFixed(2)
                      });
                      this.inttCalOnClose()
                      // if premature closing show warning of how many days month and yr left
                if (!isMatured) {
                  const crDt = this.sys.CurrentDate;
                  const matuDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString());
                  // let diff=Math.abs(crDt.getTime() - matuDt.getTime())
                  const diff = Math.ceil((Math.abs(crDt.getTime() - matuDt.getTime())) / (1000 * 3600 * 24));

                  // console.log(crDt+" "+matuDt)
                  // let diff = Math.abs(crDt.getTime() - matuDt.getTime());
                  // console.log(diff)
                  // let diffYear = diff / 1000;
                  // console.log(diffYear)
                  // diffYear /= (60 * 60 * 24);
                  // console.log(diffYear)
                  // console.log((diffYear / 365.25)>1?true:false)
                  // let diffYear1 = (diffYear / 365.25)>1?Math.abs(Math.round(diffYear / 365.25)): Math.abs(Math.floor(diffYear / 365.25));
                  // diffYear = Math.abs(Math.round(diffYear / 365.25));
                  // console.log(diffYear)

                  // if (diffYear > 0) { crDt.setFullYear(crDt.getFullYear() + diffYear1); }
                  // diff = Math.abs(crDt.getTime() - matuDt.getTime());
                  // console.log(crDt.getFullYear()+diffYear1)
                  // let diffMonth = diff / 1000;
                  // diffMonth /= (60 * 60 * 24 * 7 * 4);
                  // console.log(diffMonth)
                  // diffMonth = Math.abs(Math.round(diffMonth));
                  // console.log(diffMonth)
                  // if (diffMonth > 0) { crDt.setMonth(diffMonth); }
                  // diff = Math.abs(crDt.getTime() - matuDt.getTime());
                  // const daysDiff = diff / (1000 * 3600 * 24);
                  // const msg = `Account# ${this.accNoEnteredForTransaction.acc_num}, will mature in ${diffYear1} year(s), ${diffMonth} month(s) and ${daysDiff} day(s) .`;
                  // const msg = `Account# ${this.accNoEnteredForTransaction.acc_num}, will mature in ${diff} day(s) .`;
                  const msg = "It will be a Premature Closing for " + diff + " Days with Interest Accrued : Rs. " + this.rdInClose +", and Penalty Accrued: Rs."+this.rdPenal
                  this.HandleMessage(true, MessageType.Warning, msg);
                  // alert(msg);
                }
                    }
                    //marker
                    
                  },
                  err => { console.log(err); }
                );

                
              },
              err => { console.log(err); }
            );
          },
          rdInstallamentErr => { console.log(rdInstallamentErr); }
        );
      }
      this.hideOnClose = true;
      if (accTypCode === 1 || accTypCode === 8) { // Special logic for Saving on close
        //////////////debugger;
        this.F_CALC_SB_INTT();
        debugger
        
        
        this.hideOnClose = false;
        console.log(this.tdDefTransFrm)
      }
      if (accTypCode === 11) {
       debugger 
      this.inttCalOnClose();
      console.log(this.rdInClose);
      this.rdInClose=this.rdInClose?this.rdInClose:0;
      
      debugger
      this.accNoEnteredForTransaction.ShowClose = true;
      this.tdDefTransFrm.controls.amount.disable()
        // this.tdDefTransFrm.patchValue({
        //   paid_to: 'SELF',
        //   particulars: 'To Closing',
        // }); marker for future use
     
        if (!isMatured) {
          const crDt = this.sys.CurrentDate;
          const matuDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString());
          // let diff=Math.abs(crDt.getTime() - matuDt.getTime())
          const diff = Math.ceil((Math.abs(crDt.getTime() - matuDt.getTime())) / (1000 * 3600 * 24));
          const msg = "It will be a Premature Closing for " + diff + " Days with Interest Accrued : Rs. " + this.rdInClose
          debugger
          // this.HandleMessage(true, MessageType.Warning, msg);//..........PARTHA
          // alert(msg);
        }
          if(this.rdInClose){
            this.showOnClose = true;
          this.tdDefTransFrm.patchValue({
            amount: this.accNoEnteredForTransaction.prn_amt,
            curr_intt_recov: this.rdInClose,
            td_def_mat_amt:Number(this.accNoEnteredForTransaction.prn_amt)+Number(this.rdInClose)//tobe change

          })
          }
          debugger
          // this.showCloseInterest=true;
        }
        if (accTypCode === 10) {
          debugger
          this.inttCalOnClose();
        }
      }
     } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
        this.showTransMode = false; //marker
        this.showTransModeForR = true; //marker
        // this.showTransModeForR=false //marker
        console.log(this.selectedCust.substring(0, 3) + " " + this.sys.BranchCode+"  "+this.custBrnCd)
        /** hide transfer type for renewal of FD */
        if (this.custBrnCd != this.sys.BranchCode) {
          this.HandleMessage(true, MessageType.Error, 'Account Renewal will only be possible on Home Branch.');
          this.onResetClick();

          return;
        }
        else {
          this.showTransModeForR = true
          if (accTypCode === 2) {
            // this.showTransfrTyp = false;
          } else {
            this.showTransfrTyp = true;
          }
          /* check if for acct_type 2,4,5 mat is past today date
                 pre mature acctype shpuld not be shown */

          if ((accTypCode === 2 || accTypCode == 3 || accTypCode === 4 || accTypCode === 5)) {
            const cDt = this.sys.CurrentDate.getTime();
            const chDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime();
            const opDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.opening_dt.toString()).getTime();
            console.log((chDt - opDt) / (1000 * 3600 * 24))

            if (chDt > cDt) {
              this.HandleMessage(true, MessageType.Error,
                `Cannot Renew, account number ${this.f.acct_num.value} is not matured yet.`);
              this.onResetClick();
              return;
            }
          }
          console.log(this.td)
          this.transType.key = accTypCode == 5 ? 'W' : 'D';
          // debugger;
          const constitution = AccounTransactionsComponent.constitutionList.filter(e => e.constitution_cd
            === this.accNoEnteredForTransaction.constitution_cd)[0];
          this.transType.Description = accTypCode == 5 ? 'Withdraw' : 'Deposit';
          this.accNoEnteredForTransaction.ShowClose = true;
          this.showOnRenewal = true;
          // this.showTranferType = false;
          this.hideOnClose = true;
          // this.accNoEnteredForTransaction.acc_close_dt = new Date();
          // console.log(this.accNoEnteredForTransaction);
          // this.refresh = false;
          // this.msg.sendCommonTmDepositAll(this.accNoEnteredForTransaction);
          // this.refresh = true;
          const chDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime();
          const opDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.opening_dt.toString()).getTime();
          console.log((chDt - opDt) / (1000 * 3600 * 24))
          
          this.tdDefTransFrm.patchValue({
            trans_type: this.transType.Description,
            trans_type_key: this.transType.key,
            trans_mode: 'R',
            trans_mode1: 'Renewal',
            constitution_cd: this.accNoEnteredForTransaction.constitution_cd,
            constitution_cd_desc: (undefined !== constitution && null !== constitution
              && undefined !== constitution.constitution_desc && null !== constitution.constitution_desc) ?
              constitution.constitution_desc : null,
            cert_no: this.accNoEnteredForTransaction.cert_no,
            // opening_dt: this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10),
            opening_dt: ((chDt - opDt) / (1000 * 3600 * 24)) > 15 ? this.datepipe.transform(this.sys.CurrentDate, 'dd/MM/yyy') : this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10),
            mat_dt: chDt,
            dep_period_y: this.accNoEnteredForTransaction.dep_period.split(';')[0].split('=')[1],
            dep_period_m: this.accNoEnteredForTransaction.dep_period.split(';')[1].split('=')[1],
            dep_period_d: this.accNoEnteredForTransaction.dep_period.split(';')[2].split('=')[1],
            amount: this.accNoEnteredForTransaction.prn_amt
              + this.accNoEnteredForTransaction.intt_amt
          });
          console.log(this.tdDefTransFrm.controls)
          ///
          this.showOnClose = false;
          //PARTHA
          if(accTypCode===4){
            this.tdDefTransFrm.patchValue({
              intt_trf_type: 'O'
            })
            this.td.intt_trf_type.disable();
          }
          //PARTHA
          if (accTypCode === 2 && (this.resbrnCD1[0].intt_trf_type=='H' ||this.resbrnCD1[0].intt_trf_type=='Q'||this.resbrnCD1[0].intt_trf_type=='Y')) {
            this.tdDefTransFrm.patchValue({
              intt_trf_type:'O'
            })
            const misInstalments = new td_intt_dtls();
            misInstalments.ardb_cd = this.sys.ardbCD
            misInstalments.brn_cd = this.sys.BranchCode;
            misInstalments.acc_num = this.accNoEnteredForTransaction.acc_num;
            misInstalments.acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
            this.svc.addUpdDel<any>('Deposit/GetInttDetails', misInstalments).subscribe(
              misInstalmentsRes => {
                console.log(misInstalmentsRes)
                this.misInstallemntsForSelectedAcc = [];
                this.misInstallemntsForSelectedAcc = Utils.ChkArrNotEmptyRetrnEmptyArr(misInstalmentsRes);

                // this.misInstallemntsFor_B = [];
                // this.misInstallemntsFor_B = Utils.ChkArrNotEmptyRetrnEmptyArr(misInstalmentsRes);

                let i = 1;
                this.misInstallemntsForSelectedAcc.forEach(e => {
                  if (e.paid_status.toLocaleLowerCase() === 'p') {
                    this.counter = this.counter + 1;
                  }
                })
                this.forB=0;
                this.misInstallemntsForSelectedAcc.forEach(e => {
                  if (e.paid_status.toLocaleLowerCase() === 'b') {
                    this.forB+= e.intt_amt;
                    console.log(e)
                    this.counter1 = this.counter1 + 1;
                  }
                },
                  // this.matureIntForMis = this.rdInstallamentOption[this.rdInstallamentOption.length - 1]
                );
                console.log(this.counter,this.forB);
                debugger
          // this.onDepositePeriodChange();
      let afterMatured = false;
      this.afMat = afterMatured
      const cDt1 = this.sys.CurrentDate.getTime();
      const matDt1 = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime();
      this.diff1=Math.ceil((Math.abs(cDt1 - matDt1)) / (1000 * 3600 * 24));
      this.diff1=this.diff1
      console.log(cDt1,matDt1,this.diff1);
      if (this.diff1>15) {
        afterMatured = true;
        this.afMat = afterMatured
        debugger
        console.log(afterMatured)
        this.sys.ardbCD!='20'&& this.sys.ardbCD!='21'?this.tdDefTransFrm.controls.opening_dt.setValue(this.datepipe.transform(this.sys.CurrentDate,"dd/MM/yyyy")):this.tdDefTransFrm.controls.opening_dt.setValue(this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10))
        this.onDepositePeriodChange()
      }
      else{
        debugger
        this.sys.ardbCD!='20'&& this.sys.ardbCD!='21'?this.tdDefTransFrm.controls.opening_dt.setValue(this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10),):this.tdDefTransFrm.controls.opening_dt.setValue(this.datepipe.transform(this.sys.CurrentDate,"dd/MM/yyyy"))
        this.onDepositePeriodChange();
        debugger
        
      }
      if(( this.sys.ardbCD!='21'&& this.sys.ardbCD!='20' && this.sys.ardbCD!='3' && this.sys.ardbCD!='7') && (afterMatured == true && (accTypCode === 2 && (this.resbrnCD1[0].intt_trf_type=='H' ||this.resbrnCD1[0].intt_trf_type=='Q'||this.resbrnCD1[0].intt_trf_type=='Y')))) {

        //  if(afterMatured == true && (accTypCode === 2 || accTypCode == 4)) {
          this.modalRefClose = this.modalService.show(this.afterMatRenewal,
            { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
        
            const prn_amt_for_renew=(this.sys.ardbCD=='4'&& (accTypCode === 2))?
            this.accNoEnteredForTransaction.prn_amt:(accTypCode === 2 && (this.resbrnCD1[0].intt_trf_type=='H' ||this.resbrnCD1[0].intt_trf_type=='Q'||this.resbrnCD1[0].intt_trf_type=='Y'))?
            (+this.accNoEnteredForTransaction.prn_amt)+(+this.forB?this.forB:0)+(+this.afMat?(this.matInt?this.matInt:0):0):
            this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt;
           
           
            console.log(this.accNoEnteredForTransaction.prn_amt+this.forB+this.matInt);
            console.log(this.accNoEnteredForTransaction.intt_amt);
            console.log(this.forB);
            console.log(this.afMat);
            console.log(this.matInt);
            

            const temp_gen_param = new p_gen_param();
            temp_gen_param.ad_acc_type_cd=2;//for simple interest calculation like FD //PARTHA
            temp_gen_param.ad_prn_amt= +prn_amt_for_renew
             temp_gen_param.ai_period=this.diff1-1;//for subtract current date //PARTHA
            temp_gen_param.ad_intt_rt = 4 //Need to be change in future
            temp_gen_param.as_intt_type = "O" 
debugger
            this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
              res => {
                console.log(res)
                this.matInt = res;
                  if (this.sys.ardbCD!='20' && this.sys.ardbCD!='3' && (accTypCode == 2||accTypCode == 4 ||accTypCode == 3)) {

                //  if (accTypCode == 2||accTypCode == 4) {
                  const intt_amt_acc=(accTypCode === 2 && (this.resbrnCD1[0].intt_trf_type=='H' ||this.resbrnCD1[0].intt_trf_type=='Q'||this.resbrnCD1[0].intt_trf_type=='Y'))?
                  this.forB:this.accNoEnteredForTransaction.intt_amt;
                  console.log(intt_amt_acc)
                  debugger
                  this.tdDefTransFrm.patchValue({
                    
                    amount: this.accNoEnteredForTransaction.prn_amt + intt_amt_acc+this.matInt,
                    // curr_intt_recov:this.accNoEnteredForTransaction.intt_amt+this.matInt
                  });
                  

                  this.accDtlsFrm.controls.mat_amt.setValue(this.accNoEnteredForTransaction.prn_amt +intt_amt_acc+this.matInt)
                  this.accDtlsFrm.controls.intt_amt.setValue(+intt_amt_acc+this.matInt)
                  // marker for change, to be uncommented
                  // const cDt = this.sys.CurrentDate.getTime();
                  // const matDt=Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime()
                  // const diffDays = Math.ceil((Math.abs(matDt - cDt)) / (1000 * 3600 * 24))/365;
                  // console.log(diffDays)
                  // const inttRt=3.5
                  // this.intt= this.accNoEnteredForTransaction.prn_amt * inttRt * diffDays 
                  // this.intt=this.intt/100
                  // console.log(this.intt)
                 
                  // this.tdDefTransFrm.patchValue({
                  //   curr_intt_recov: isMatured ? +this.accNoEnteredForTransaction.intt_amt + (+Math.round(this.intt)) : +this.closeInt + (+Math.round(this.intt)),
                  //   td_def_mat_amt: isMatured ? +this.accNoEnteredForTransaction.prn_amt + (+this.accNoEnteredForTransaction.intt_amt) + (+Math.round(this.intt)): +this.accNoEnteredForTransaction.prn_amt + (+this.closeInt) + (+Math.round(this.intt))

                  // })
                  // this.inttMsg='The additional interest of Rs '+ Math.round(this.intt) +' with an interest rate of '+ inttRt + '% for '+ diffDays*365 + ' days has been accrued.'
                  // // this.HandleMessage(true, MessageType.Info, );


                  // this.modalRefClose = this.modalService.show(this.interestMsg,
                  //   { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
                  // marker for change, to be uncommented
                }
              })
            }
            else{
              const prn_amt_for_renew=(this.sys.ardbCD=='4'&& (accTypCode === 2))?
            this.accNoEnteredForTransaction.prn_amt:(accTypCode === 2 && (this.resbrnCD1[0].intt_trf_type=='H' ||this.resbrnCD1[0].intt_trf_type=='Q'||this.resbrnCD1[0].intt_trf_type=='Y'))?
            this.accNoEnteredForTransaction.prn_amt+this.forB+(+this.afMat?(this.matInt?this.matInt:0):0):
            this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt;
            this.tdDefTransFrm.patchValue({
                    
              amount: prn_amt_for_renew
              // curr_intt_recov:this.accNoEnteredForTransaction.intt_amt+this.matInt
            });
            
            }    
              })
          }
          if (accTypCode === 5 || (accTypCode === 2 && this.resbrnCD1[0].intt_trf_type=='O')){ // Special logic for MIS on renewal
            console.log(this.diff)
            debugger
            this.tdDefTransFrm.patchValue({
              intt_trf_type: accTypCode==5? 'M':'O'
            })
            if(this.resbrnCD1[0].intt_trf_type=='O'){
              const mat_amt_mis=this.accNoEnteredForTransaction.prn_amt+ this.accNoEnteredForTransaction.intt_amt
              this.showOnClose = false; 
              debugger
              this.td.amount.enable();
              this.td.amount.setValue(mat_amt_mis);
              this.mat_val=mat_amt_mis;
              if(Number(this.td.amount.value)==mat_amt_mis){
                this.showBalance=false;
                this.transType.key = 'D';
                this.transType.Description = 'Deposit'
                this.tdDefTransFrm.patchValue({
                  trans_type: this.transType.Description,
                  trans_type_key: this.transType.key,
                  curr_intt_recov:0,
                  balance:0
                })
              }
              else{
                this.transType.key = 'W';
                this.transType.Description = 'withdraw'
                this.tdDefTransFrm.patchValue({
                  trans_type: this.transType.Description,
                  trans_type_key: this.transType.key,
                  curr_intt_recov:this.accNoEnteredForTransaction.intt_amt,
                  balance:this.accNoEnteredForTransaction.intt_amt
                })
                
              }
            }
            else{
            // this.tdDefTransFrm.controls.intt_trf_type.disable()
            const misInstalments = new td_intt_dtls();
            misInstalments.ardb_cd = this.sys.ardbCD
            misInstalments.brn_cd = this.sys.BranchCode;
            misInstalments.acc_num = this.accNoEnteredForTransaction.acc_num;
            misInstalments.acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
            this.svc.addUpdDel<any>('Deposit/GetInttDetails', misInstalments).subscribe(
              misInstalmentsRes => {
                console.log(misInstalmentsRes)
                this.misInstallemntsForSelectedAcc = [];
                this.misInstallemntsForSelectedAcc = Utils.ChkArrNotEmptyRetrnEmptyArr(misInstalmentsRes);

                // this.misInstallemntsFor_B = [];
                // this.misInstallemntsFor_B = Utils.ChkArrNotEmptyRetrnEmptyArr(misInstalmentsRes);

                let i = 1;
                this.showMisInstalment = true;
                this.misInstallemntsForSelectedAcc.forEach(e => {
                  if (e.paid_status.toLocaleLowerCase() === 'p') {
                    this.counter = this.counter + 1
                  }
                })
                this.forB=0;
                this.misInstallemntsForSelectedAcc.forEach(e => {
                  if (e.paid_status.toLocaleLowerCase() === 'b') {
                    this.forB+= e.intt_amt;
                    console.log(e)
                    this.counter1 = this.counter1 + 1;
                  }
                },
                  this.matureIntForMis = this.rdInstallamentOption[this.rdInstallamentOption.length - 1]
                );
                console.log(this.counter)
                console.log(this.matureIntForMis)

                // this.showOnClose = true;
                console.log(this.accNoEnteredForTransaction, this.diff)
                console.log(this.counter1)
                this.td.amount.disable();
                // this.showTransModeForR=f;
                this.showTransModeForR = true
                this.showOnClose = true; //marker
                this.mat_val = Number(this.accNoEnteredForTransaction.prn_amt)
                console.log(this.counter + " " + this.counter1)
                console.log(this.accNoEnteredForTransaction)

                this.tdDefTransFrm.patchValue({
                  // amount: this.accNoEnteredForTransaction.prn_amt
                  // + this.accNoEnteredForTransaction.intt_amt,
                  amount: this.accNoEnteredForTransaction.prn_amt,
                  curr_intt_recov: (this.accDtlsFrm.controls.intt_amt.value * this.counter1),
                  // curr_intt_recov:5,
                  // ovd_intt_recov: isMatured?'':this.sys.PenalInttRtFrAccPreMatureClosing, //marker subjected to change
                  ovd_intt_recov: 0,
                  curr_prn_recov: '',
                  td_def_mat_amt: (this.accNoEnteredForTransaction.prn_amt
                    + (this.accDtlsFrm.controls.intt_amt.value * this.counter1)),
                  // trans_mode:'Close'
                });
                if (this.accDtlsFrm.controls.intt_amt.value * this.counter1 == 0) {
                   debugger;
                  if (accTypCode == 5) {
                    this.transType.key = 'D';
                    this.transType.Description = 'Deposit'
                    this.tdDefTransFrm.patchValue({
                      trans_type: this.transType.Description,
                      trans_type_key: this.transType.key,
                    })
                  }
                }
                const mat_amt_mis=this.accNoEnteredForTransaction.prn_amt+ this.forB
                if(accTypCode==5 && this.tdDefTransFrm.controls.trans_mode.value=='R' && !this.editDeleteMode){
                  this.showOnClose = false; 
                  debugger
                  this.td.amount.enable();
                  this.td.amount.setValue(mat_amt_mis);
                  this.mat_val=mat_amt_mis;
                  if(Number(this.td.amount.value)==mat_amt_mis){
                    this.showBalance=false;
                    this.transType.key = 'D';
                    this.transType.Description = 'Deposit'
                    this.tdDefTransFrm.patchValue({
                      trans_type: this.transType.Description,
                      trans_type_key: this.transType.key,
                      curr_intt_recov:0,
                      balance:0
                    })
                  }
                  else{
                    this.transType.key = 'W';
                    this.transType.Description = 'withdraw'
                    this.tdDefTransFrm.patchValue({
                      trans_type: this.transType.Description,
                      trans_type_key: this.transType.key,
                      curr_intt_recov:this.forB,
                      balance:this.forB
                    })
                    
                  }                 
              }
                debugger
                console.log(this.resbrnCD1[0])
             
                
               
                // marker
                //     var d={
                //       acc_type_cd:2,
                //       catg_cd:this.resBrnCatgCd,
                //       no_of_days:this.diff
                //      }
                //   const temp_gen_param = new p_gen_param();

                //      this.svc.addUpdDel<any>('Deposit/GetInttRate', d).subscribe(
                //       res_rt => {
                //         console.log(res_rt)
                //         this.res_rt=res_rt
                //         temp_gen_param.ad_acc_type_cd=2;
                //         temp_gen_param.ad_prn_amt=this.accNoEnteredForTransaction.prn_amt;
                //         temp_gen_param.adt_temp_dt=this.accNoEnteredForTransaction.opening_dt;
                //         temp_gen_param.ai_period=this.diff;
                //         // temp_gen_param.ad_intt_rt=res_rt-this.sys.PenalInttRtFrAccPreMatureClosing //marker subjected to change
                //         temp_gen_param.ad_intt_rt=res_rt
                //         this.effInt=temp_gen_param.ad_intt_rt>0?temp_gen_param.ad_intt_rt:0
                //         // this.effInt=res_rt
                //         // temp_gen_param.ad_intt_rt=this.effInt
                //         this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
                //           result => {
                //             console.log(result)

                //      console.log(d)
                //      console.log(this.matureIntForMis)
                //     this.tdDefTransFrm.patchValue({

                //       // amount: this.accNoEnteredForTransaction.prn_amt
                //       // + this.accNoEnteredForTransaction.intt_amt,
                //       amount: this.accNoEnteredForTransaction.prn_amt,
                //       curr_intt_recov:result-(this.accNoEnteredForTransaction.intt_amt * this.counter),
                //       // ovd_intt_recov: isMatured?'':this.sys.PenalInttRtFrAccPreMatureClosing, //marker subjected to change
                //       ovd_intt_recov: 0,
                //       curr_prn_recov:'',
                //       td_def_mat_amt: (this.accNoEnteredForTransaction.prn_amt
                //         + result-(this.accNoEnteredForTransaction.intt_amt * this.counter)),
                //         // trans_mode:'Close'
                //     });
                //   })
                // })
              })
          }
        }
          ///
          debugger
          this.onDepositePeriodChange();
      let afterMatured = false;
      this.afMat = afterMatured
      const cDt1 = this.sys.CurrentDate.getTime();
      const matDt1 = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime();
      this.diff1=Math.ceil((Math.abs(cDt1 - matDt1)) / (1000 * 3600 * 24));
      this.diff1=this.diff1
      console.log(cDt1,matDt1,this.diff1);
      if (this.diff1>15) {
        afterMatured = true;
        this.afMat = afterMatured
        debugger
        console.log(afterMatured)
        this.sys.ardbCD!='20'&& this.sys.ardbCD!='21'?this.tdDefTransFrm.controls.opening_dt.setValue(this.datepipe.transform(this.sys.CurrentDate,"dd/MM/yyyy")):this.tdDefTransFrm.controls.opening_dt.setValue(this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10))
        this.onDepositePeriodChange()
      }
      else{
        debugger
        this.sys.ardbCD!='20'&& this.sys.ardbCD!='21'?this.tdDefTransFrm.controls.opening_dt.setValue(this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10),):this.tdDefTransFrm.controls.opening_dt.setValue(this.datepipe.transform(this.sys.CurrentDate,"dd/MM/yyyy"))
        this.onDepositePeriodChange();
        debugger
        
      }
        if(( this.sys.ardbCD!='21'&& this.sys.ardbCD!='20' && this.sys.ardbCD!='3' && this.sys.ardbCD!='7') && (afterMatured == true && (accTypCode === 2 && this.resbrnCD1[0].intt_trf_type=='O' || accTypCode == 4||accTypCode == 3||accTypCode == 5))) {

        //  if(afterMatured == true && (accTypCode === 2 || accTypCode == 4)) {
          this.modalRefClose = this.modalService.show(this.afterMatRenewal,
            { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
        
            const prn_amt_for_renew=(this.sys.ardbCD=='4'&&(accTypCode === 2 || accTypCode == 4))?
            this.accNoEnteredForTransaction.prn_amt:this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt;
            const temp_gen_param = new p_gen_param();
            temp_gen_param.ad_acc_type_cd=2;//for simple interest calculation like FD //PARTHA
            temp_gen_param.ad_prn_amt= +prn_amt_for_renew
             temp_gen_param.ai_period=this.diff1-1;//for subtract current date //PARTHA
            temp_gen_param.ad_intt_rt = 4 //Need to be change in future
            temp_gen_param.as_intt_type = "O" 
debugger
            this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
              res => {
                console.log(res)
                this.matInt = res;
                  if (this.sys.ardbCD!='20' && this.sys.ardbCD!='3' && (accTypCode == 2||accTypCode == 4 ||accTypCode == 3)) {

                //  if (accTypCode == 2||accTypCode == 4) {
                  const intt_amt_acc=this.accNoEnteredForTransaction.intt_amt;
                  console.log(intt_amt_acc)
                  debugger
                  this.tdDefTransFrm.patchValue({
                    
                    amount: this.accNoEnteredForTransaction.prn_amt + intt_amt_acc+this.matInt,
                    // curr_intt_recov:this.accNoEnteredForTransaction.intt_amt+this.matInt
                  });
                  

                  this.accDtlsFrm.controls.mat_amt.setValue(this.accNoEnteredForTransaction.prn_amt +intt_amt_acc+this.matInt)
                  this.accDtlsFrm.controls.intt_amt.setValue(+intt_amt_acc+this.matInt)
                  // marker for change, to be uncommented
                  // const cDt = this.sys.CurrentDate.getTime();
                  // const matDt=Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime()
                  // const diffDays = Math.ceil((Math.abs(matDt - cDt)) / (1000 * 3600 * 24))/365;
                  // console.log(diffDays)
                  // const inttRt=3.5
                  // this.intt= this.accNoEnteredForTransaction.prn_amt * inttRt * diffDays 
                  // this.intt=this.intt/100
                  // console.log(this.intt)
                 
                  // this.tdDefTransFrm.patchValue({
                  //   curr_intt_recov: isMatured ? +this.accNoEnteredForTransaction.intt_amt + (+Math.round(this.intt)) : +this.closeInt + (+Math.round(this.intt)),
                  //   td_def_mat_amt: isMatured ? +this.accNoEnteredForTransaction.prn_amt + (+this.accNoEnteredForTransaction.intt_amt) + (+Math.round(this.intt)): +this.accNoEnteredForTransaction.prn_amt + (+this.closeInt) + (+Math.round(this.intt))

                  // })
                  // this.inttMsg='The additional interest of Rs '+ Math.round(this.intt) +' with an interest rate of '+ inttRt + '% for '+ diffDays*365 + ' days has been accrued.'
                  // // this.HandleMessage(true, MessageType.Info, );


                  // this.modalRefClose = this.modalService.show(this.interestMsg,
                  //   { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
                  // marker for change, to be uncommented
                }
              })
            }
            
    this.calculateInterestRate();//PARTHA
         }
      } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment') {
        this.showTransModeForR = false;
        this.showtransmodeforC = false;
        console.log(this.accDtlsFrm)
        this.transType.key = 'W';
        this.showAmtDrpDn = true;
        this.transType.Description = 'Interest Payment';
        this.showTransMode = false
        console.log(this.rdInstallamentOption[this.rdInstallamentOption.length - 1])
        // this.accNoEnteredForTransaction.ShowClose = true;
        // this.showOnRenewal = true;
        // this.hideOnClose = true;
        // this.accNoEnteredForTransaction.acc_close_dt = new Date();
        // this.msg.sendCommonTmDepositAll(this.accNoEnteredForTransaction);
        this.hideOnClose = false //marker
        this.tdDefTransFrm.patchValue({

          trans_type: this.transType.Description,
          // trans_type: this.transType.Description,
          trans_type_key: this.transType.key,
          trans_mode: 'I',
          trans_mode1: 'Interest',
          paid_to: 'SELF',
          particulars: 'TO INTEREST ',
          // particulars: 'TO INTEREST ' + this.td.acc_type_desc.value + ' A/C :'
          // + this.f.acct_num.value,
          // amount: this.accNoEnteredForTransaction.instl_amt
          // amount: this.rdInstallamentOption[this.rdInstallamentOption.length - 1]
          amount: accTypCode==5? this.misSum : this.rdInstallamentOption[this.rdInstallamentOption.length - 1]
        });
        this.tdDefTransFrm.controls.amount.disable()
        // this.hideOnClose = true;
        this.showAmtDrpDn = true;
      } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'rd installment') {
        this.transType.key = 'D';
        this.showTransMode = false
        // this.showTransModeForR=true
        // this.showtransmodeforC=true
        this.transType.Description = 'Deposit';
        this.hideOnClose = true;
        this.tdDefTransFrm.patchValue({
          trans_type: this.transType.Description,
          trans_type_key: this.transType.key,
          trans_mode: '',
          particulars: 'BY RD INSTALLMENT'
          // trans_mode1:'rd'

        });

      }
      this.patchtdDefTransFrm();
    }

    CloseDPenalty(){
      debugger
      if(this.f.acc_type_cd.value==11 ){
        this.tdDefTransFrm.patchValue({
          td_def_mat_amt: ((this.accNoEnteredForTransaction.prn_amt+Number(this.td.curr_intt_recov.value))-(+this.td.ovd_intt_recov.value?+this.td.ovd_intt_recov.value:0)),
        });
      }
      if(this.f.acc_type_cd.value==6){
        this.tdDefTransFrm.patchValue({
          td_def_mat_amt: ((this.td.amount.value+Number(this.td.curr_intt_recov.value))-(+this.td.ovd_intt_recov.value?+this.td.ovd_intt_recov.value:0)),
        });
      }
      if(this.f.acc_type_cd.value==2 || this.f.acc_type_cd.value==3 || this.f.acc_type_cd.value==4 ){
        debugger
        this.tdDefTransFrm.patchValue({
          
          td_def_mat_amt:((+this.tdDefTransFrm.controls.amount.value) + (+this.tdDefTransFrm.controls.curr_intt_recov.value)-(+this.tdDefTransFrm.controls.ovd_intt_recov.value? +this.tdDefTransFrm.controls.ovd_intt_recov.value:0))
        })
      }
      if(this.f.acc_type_cd.value==5 ){
        this.tdDefTransFrm.patchValue({
          td_def_mat_amt: ((Number(this.td.amount.value)+Number(this.td.curr_intt_recov.value)+Number(this.td.curr_prn_recov))-(+this.td.ovd_intt_recov.value?+this.td.ovd_intt_recov.value:0)),
        });
      }
    }
  public inttCalOnClose(): void {
    if (this.f.acc_type_cd.value != 5 && this.f.acc_type_cd.value != 6 && this.f.acc_type_cd.value != 11 && this.f.acc_type_cd.value != 10) {
     debugger;
      const temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = (this.sys.ardbCD=='23' && this.accNoEnteredForTransaction.acc_type_cd==3)?4:(this.sys.ardbCD!='23' && this.accNoEnteredForTransaction.acc_type_cd==3)?2:this.accNoEnteredForTransaction.acc_type_cd;
      temp_gen_param.ad_prn_amt = this.accNoEnteredForTransaction.prn_amt;
      temp_gen_param.adt_temp_dt = this.accNoEnteredForTransaction.opening_dt;
      const cDt = this.sys.CurrentDate.getTime();
      const opDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.opening_dt.toString()).getTime();
      // const o = Utils.convertStringToDt(this.td.opening_dt.value);
      const matDt=Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime()
      console.log(this.accNoEnteredForTransaction.intt_rt, this.tdDefTransFrm.controls.ovd_intt_recov.value)
      // const diffDays = Math.ceil((Math.abs(cDt - opDt)) / (1000 * 3600 * 24));
      const diffDays = Math.ceil((Math.abs(matDt - opDt)) / (1000 * 3600 * 24));
      temp_gen_param.ai_period = this.isMat?diffDays:this.diff;
      console.log(this.tdDefTransFrm.controls.eff_int.value)
      console.log(this.effInt)
      // temp_gen_param.ad_intt_rt=this.accNoEnteredForTransaction.intt_rt-this.tdDefTransFrm.controls.ovd_intt_recov.value
      temp_gen_param.ad_intt_rt = this.tdDefTransFrm.controls.eff_int.value!=null?this.tdDefTransFrm.controls.eff_int.value:this.effInt
      // this.isLoading = true;
      if (temp_gen_param.ad_intt_rt <= 0) {
        console.log(temp_gen_param.ad_intt_rt)
        this.HandleMessage(true, MessageType.Error, 'Default penalty cannot be more than the actual interest rate');
        return;
      }
    
    
      this.effInt = temp_gen_param.ad_intt_rt > 0 ? temp_gen_param.ad_intt_rt : 1
     //marker to change the interest on calculation 
     this.isLoading=true;
      this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
        res => {
          this.isLoading=false;
          debugger
          console.log(res)
          this.closeInt = res;
          console.log(res)
          this.td.td_def_mat_amt.setValue(this.accNoEnteredForTransaction.prn_amt + this.closeInt);
          this.td.curr_intt_recov.setValue(this.closeInt)
        })

    // marker to change the interest on calculation ends here
    }
    else if (this.f.acc_type_cd.value == 5) {
      console.log(this.counter)
      const temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
      temp_gen_param.ad_prn_amt = this.accNoEnteredForTransaction.prn_amt;
      temp_gen_param.adt_temp_dt = this.accNoEnteredForTransaction.opening_dt;
      const cDt = this.sys.CurrentDate.getTime();
      const opDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.opening_dt.toString()).getTime();
      // const o = Utils.convertStringToDt(this.td.opening_dt.value);
      console.log(this.accNoEnteredForTransaction.intt_rt, this.tdDefTransFrm.controls.ovd_intt_recov.value)
      const diffDays = Math.ceil((Math.abs(cDt - opDt)) / (1000 * 3600 * 24));
      temp_gen_param.ai_period = diffDays;
      console.log(this.tdDefTransFrm.controls.eff_int.value)
      console.log(this.effInt)

      // temp_gen_param.ad_intt_rt=this.accNoEnteredForTransaction.intt_rt-this.tdDefTransFrm.controls.ovd_intt_recov.value
      // temp_gen_param.ad_intt_rt=this.res_rt-(+this.tdDefTransFrm.controls.ovd_intt_recov.value)
      temp_gen_param.ad_intt_rt = this.tdDefTransFrm.controls.eff_int.value

      // this.isLoading = true;
      if (temp_gen_param.ad_intt_rt < 0) {
        console.log(temp_gen_param.ad_intt_rt)
        this.HandleMessage(true, MessageType.Error, 'Default penalty cannot be more than the actual interest rate');
        return;
      }
      this.effInt = temp_gen_param.ad_intt_rt > 0 ? temp_gen_param.ad_intt_rt : 0
      // this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
      //   res => {
      //     console.log(res)
      //     this.closeInt=res;
      //     console.log(res)
      //     this.td.td_def_mat_amt.setValue(this.accNoEnteredForTransaction.prn_amt+this.closeInt);
      //     this.td.curr_intt_recov.setValue(this.closeInt)
      //   })
      temp_gen_param.ad_acc_type_cd = 2;
      temp_gen_param.ad_prn_amt = this.accNoEnteredForTransaction.prn_amt;
      temp_gen_param.adt_temp_dt = this.accNoEnteredForTransaction.opening_dt;
      temp_gen_param.ai_period = this.diff;
      temp_gen_param.ad_intt_rt = this.tdDefTransFrm.controls.eff_int.value
      this.effInt = temp_gen_param.ad_intt_rt > 0 ? temp_gen_param.ad_intt_rt : 0
      // this.effInt=res_rt
      // temp_gen_param.ad_intt_rt=this.effInt
      this.isLoading=true;
      this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
        result => {
          console.log(result)

          this.isLoading=false;
          this.tdDefTransFrm.patchValue({

            // amount: this.accNoEnteredForTransaction.prn_amt
            // + this.accNoEnteredForTransaction.intt_amt,
            amount: this.accNoEnteredForTransaction.prn_amt,
            curr_intt_recov: result - (this.accNoEnteredForTransaction.intt_amt * this.counter),
            ovd_intt_recov: 0,
            // curr_prn_recov: '',
            td_def_mat_amt: (this.accNoEnteredForTransaction.prn_amt
              + result - (this.accNoEnteredForTransaction.intt_amt * this.counter)),
            // trans_mode:'Close'
          });
        })
    }
    else {
      debugger
      if(this.f.acc_type_cd.value==11){
        this.isLoading=true;
        this.showOnClose=true;
        var dt={
          "acc_num":this.accNoEnteredForTransaction.acc_num,
          "ardb_cd":this.sys.ardbCD,
          "from_dt":this.sys.CurrentDate
        }
                this.svc.addUpdDel<any>('Deposit/GetDdsInterest', dt).subscribe(
                  res => {
                    console.log(res)
                    if (undefined !== res
                      && null !== res) {
                        this.isLoading=false
                        this.rdInClose=res
                        debugger
                      this.tdDefTransFrm.patchValue({
                        ovd_intt_recov: (+this.td.ovd_intt_recov.value?this.td.ovd_intt_recov.value:0),
                        amount:+this.accNoEnteredForTransaction.prn_amt,
                        curr_intt_recov: (+ res.toFixed(2)),
                        td_def_mat_amt: ((+(+this.accNoEnteredForTransaction.prn_amt)+(+ res.toFixed(2)))-(+this.td.ovd_intt_recov.value?this.td.ovd_intt_recov.value:0)),
                      });
                      console.log(((+this.accNoEnteredForTransaction.prn_amt)-(+this.td.ovd_intt_recov.value?this.td.ovd_intt_recov.value:0)));
                      console.log((+this.td.curr_intt_recov.value?this.td.curr_intt_recov.value:0 + res.toFixed(2)));
                      console.log(((+this.accNoEnteredForTransaction.prn_amt)+(+this.td.curr_intt_recov.value?this.td.curr_intt_recov.value:0 + res.toFixed(2))));
                      
                      this.isLoading=false;
                    }
                  },
                  err => { console.log(err); }
                );
      }
      else if(this.f.acc_type_cd.value==10 && this.sys.ardbCD=='9'){
        this.isLoading=true;
        this.showOnClose=true;
        var dt={
          "acc_num":this.accNoEnteredForTransaction.acc_num,
          "ardb_cd":this.sys.ardbCD,
          "from_dt":this.sys.CurrentDate
        }
                this.svc.addUpdDel<any>('Deposit/GetDdsInterest', dt).subscribe(
                  (res:number) => {
                    console.log(res)
                    if (res>0) {
                        alert('It will be a premature Closing'+(res)+'Interest Received ')
                        this.isLoading=false
                        this.rdInClose=res;
                        debugger
                      this.tdDefTransFrm.patchValue({
                        ovd_intt_recov: (+this.td.ovd_intt_recov.value?this.td.ovd_intt_recov.value:0),
                        amount:+this.accNoEnteredForTransaction.clr_bal,
                        curr_intt_recov: (+ res.toFixed(2)),
                        td_def_mat_amt: ((+(+this.accNoEnteredForTransaction.clr_bal)+(+ res.toFixed(2)))-(+this.td.ovd_intt_recov.value?this.td.ovd_intt_recov.value:0)),
                      });
                      console.log(((+this.accNoEnteredForTransaction.clr_bal)-(+this.td.ovd_intt_recov.value?this.td.ovd_intt_recov.value:0)));
                      console.log((+this.td.curr_intt_recov.value?this.td.curr_intt_recov.value:0 + res.toFixed(2)));
                      console.log(((+this.accNoEnteredForTransaction.clr_bal)+(+this.td.curr_intt_recov.value?this.td.curr_intt_recov.value:0 + res.toFixed(2))));
                      
                      this.isLoading=false;
                    }
                    else{
                      alert('It will be a premature Closing '+(res)+' Panalty received')
                      
                      const positiveValue = Math.abs(res);
                      this.isLoading=false
                        this.rdInClose=res
                        debugger
                      this.tdDefTransFrm.patchValue({
                        ovd_intt_recov: (positiveValue.toFixed(2)),
                        amount:+this.accNoEnteredForTransaction.clr_bal,
                        curr_intt_recov: 0,
                        td_def_mat_amt: ((+(+this.accNoEnteredForTransaction.clr_bal)-(+positiveValue.toFixed(2)))),
                      });
                     
                      this.isLoading=false;
                    }
                  },
                  err => { console.log(err); }
                );
      }
      else if(this.f.acc_type_cd.value==6){
        this.isLoading=true;
        let param = new p_gen_param();
      param.as_acc_num = this.accNoEnteredForTransaction.acc_num;
      param.ad_instl_amt = this.accNoEnteredForTransaction.instl_amt;
      console.log(param.ad_instl_amt)
      param.an_instl_no = this.counter;
      param.an_intt_rate = (+this.tdDefTransFrm.controls.eff_int.value)

      param.ardb_cd = this.sys.ardbCD;
      param.ai_period = this.diff;
      // this.effInt=param.an_intt_rate
      this.svc.addUpdDel<any>('Deposit/F_CALCRDINTT_REG', param).subscribe(
        res => {
          console.log(res)
          this.rdInClose = res;
          if (undefined !== res
            && null !== res
            && res > 0) {
            this.tdDefTransFrm.patchValue({
              // eff_int:this.effInt,
              curr_intt_recov: res.toFixed(2),
              amount: param.ad_instl_amt * this.counter,
              //  curr_intt_recov: res,
              ovd_intt_recov: this.rdPenal?this.rdPenal:0,
              bonus_amt: 0,
              curr_prn_recov: 0,
              td_def_mat_amt: (+param.ad_instl_amt * this.counter + res)-(+this.rdPenal)
            })
            this.isLoading=false;
          }
          else{
            this.isLoading=false; 
          }

          param = new p_gen_param();
          param.as_acc_num = this.accNoEnteredForTransaction.acc_num;
          param.ardb_cd = this.sys.ardbCD;
        },
        err => { console.log(err); }
      );
    //marker for default penalty, bonus

      this.td.td_def_mat_amt.setValue((this.td.amount.value +
        (+this.td.curr_intt_recov.value) - (+this.td.ovd_intt_recov.value)
        + (+this.td.curr_prn_recov.value)).toFixed(2));
      }
      else{
        this.isLoading=true
      let param = new p_gen_param();
      param.as_acc_num = this.accNoEnteredForTransaction.acc_num;
      param.ad_instl_amt = this.accNoEnteredForTransaction.instl_amt;
      console.log(param.ad_instl_amt)
      param.an_instl_no = this.counter;
      param.ad_intt_rt = (+this.tdDefTransFrm.controls.eff_int.value)

      param.ardb_cd = this.sys.ardbCD;
      param.ai_period = this.diff;
      // this.effInt=param.an_intt_rate
      this.svc.addUpdDel<any>('Deposit/F_CALCRDINTT_REG', param).subscribe(
        res => {
          console.log(res)
          this.rdInClose = res;
          if (undefined !== res
            && null !== res
            && res > 0) {
            this.tdDefTransFrm.patchValue({
              // eff_int:this.effInt,
              curr_intt_recov: res.toFixed(2),
              amount: param.ad_instl_amt * this.counter,
              //  curr_intt_recov: res,
              ovd_intt_recov: 0,
              bonus_amt: 0,
              curr_prn_recov: 0,
              td_def_mat_amt: param.ad_instl_amt * this.counter + res
            })
            this.isLoading=false;
          }
          else{
            this.isLoading=false;
          }
          param = new p_gen_param();
          param.as_acc_num = this.accNoEnteredForTransaction.acc_num;
          param.ardb_cd = this.sys.ardbCD;

        },
        err => { console.log(err); }
      );
    //marker for default penalty, bonus

      this.td.td_def_mat_amt.setValue((this.td.amount.value +
        (+this.td.curr_intt_recov.value) - (+this.td.ovd_intt_recov.value)
        + (+this.td.curr_prn_recov.value)).toFixed(2));
    }
  }
    this.td.td_def_mat_amt.setValue((this.td.amount.value +
      (+this.td.curr_intt_recov.value) - (+this.td.ovd_intt_recov.value)
      + (+this.td.curr_prn_recov.value)).toFixed(2));

      
  }
  addBonus(){
    this.tdDefTransFrm.patchValue({

      td_def_mat_amt: (+this.accNoEnteredForTransaction.prn_amt
        + (+this.td.curr_intt_recov.value)+(+this.td.curr_prn_recov.value)),
      // trans_mode:'Close'
    });
  
  }

  async getInttRate(acc_cd: number): Promise<any> {
    const dt = {
      acc_type_cd: acc_cd,
      catg_cd: this.resBrnCatgCd,
      no_of_days: this.diff1,
      ardb_cd: this.sys.ardbCD
    };
    
    this.isLoading = true;
  
    try {
      const res = await this.svc.addUpdDel<any>('Deposit/GetInttRate', dt).toPromise();
      console.log(res);
      return res;
    } finally {
      this.isLoading = false;
    }
  }
  private patchtdDefTransFrm(): void {

    const acctTypCdTofilter = +this.f.acc_type_cd.value;
    const acctTypeDesription = AccounTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter)[0].acc_type_desc;
    this.tdDefTransFrm.patchValue({
      acc_num: this.accNoEnteredForTransaction.acc_num,
      acc_type_desc: acctTypeDesription,
      acc_type_cd: acctTypCdTofilter,
      trans_type: this.transType.Description,
      trans_type_key: this.transType.key
    });
    console.log(this.tdDefTransFrm.value)
  }

  private enableSave(): void {
    // check all the rules to enable save
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
      if (((+this.td.amount.value) <= 0)) {
        this.disableSave = true;
      } else {
        this.disableSave = false;
      }
    }
  }

  onDepositePeriodChange(): void {
    let matDt = 0;
    this.tdDefTransFrm.patchValue({
      mat_dt: ''
    });
    const d = Utils.convertStringToDt(this.td.opening_dt.value);
    if ((+this.td.dep_period_y.value) > 0) {
      matDt = d.setFullYear(d.getFullYear() + (+this.td.dep_period_y.value));
    }
    if ((+this.td.dep_period_m.value) > 0) {
      matDt = d.setMonth(d.getMonth() + (+this.td.dep_period_m.value));
    }
    if ((+this.td.dep_period_d.value) > 0) {
      matDt = d.setDate(d.getDate() + (+this.td.dep_period_d.value));
    }
    if (matDt > 0) {
      this.processInterest();
      this.tdDefTransFrm.patchValue({
        mat_dt: Utils.convertDtToString(new Date(matDt))
      });
    }
    this.calculateInterestRate();
  }
  onInterestChange(){
    debugger
    console.log(this.tdDefTransFrm.controls.amount.value +" "+this.tdDefTransFrm.controls.closeIntrest.value)
    if(this.f.acc_type_cd.value==1 || this.f.acc_type_cd.value==8){
    this.tdDefTransFrm.patchValue({//PARTHA***
      // amount:(+this.accDtlsFrm.controls.clr_bal.value) + (+this.tdDefTransFrm.controls.closeIntrest.value),
      amount:(+this.accDtlsFrm.controls.clr_bal.value),
      td_def_mat_amt:(+this.accDtlsFrm.controls.clr_bal.value) + (+this.tdDefTransFrm.controls.closeIntrest.value)
    })
  }
  
  }
  onTransModeChange(): void {
    const selectedTransMode = this.td.trans_mode.value;
    if ('Q' === selectedTransMode) {
      // check if cheque facility is available or not
      if (this.accNoEnteredForTransaction.cheque_facility_flag === 'N') {
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
    debugger;
    
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    console.log(selectedOperation.oprn_desc.toLocaleLowerCase());
    if((this.f.acc_type_cd.value==2 || this.f.acc_type_cd.value==3|| this.f.acc_type_cd.value==4 ) && (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal')) {
      this.onAmtChngDuringRenewal();
    }
    const accTypeCd = +this.f.acc_type_cd.value;
    if (accTypeCd !== 2
      && accTypeCd !== 3
      && accTypeCd !== 4
      && accTypeCd !== 5) {
      this.showtransdetails = true;
      if(accTypeCd == 10){
        this.tdDefTransFrm.patchValue({
          paid_to: 'SELF',
          particulars: this.td.trf_type.value == 'C' ? 'TO CASH ' : 'TO TRANSFER'
        });
      }
      if (this.td.trf_type.value === 'C') {
        this.showtransdetails = false;
        if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
          this.tdDefTransFrm.patchValue({
            paid_to: 'SELF',
            particulars: 'TO CASH '
          });
        } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
          this.tdDefTransFrm.patchValue({
            paid_to: 'SELF',
            particulars: 'BY CASH '
          });
        }
        
debugger

      } else {
        debugger
        console.log(selectedOperation.oprn_desc.toLocaleLowerCase(), this.td.trans_mode.value)
        if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
          debugger
          this.tdDefTransFrm.patchValue({
            paid_to: 'SELF',
            particulars: this.td.trans_mode.value == 'C' ? 'To Closing' : 'To Transfer'
          });
        } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
          this.tdDefTransFrm.patchValue({
            paid_to: 'SELF',
            particulars: 'BY TRANSFER'
          });
        }
      }
    }

    if (this.td.trf_type.value === 'C') {
      this.showtransdetails = false;

      this.addDenomination();
    }
    else {
      // console.log(this.tdDefTransFrm.controls.amount.value+" "+this.accDtlsFrm.controls.mat_amt.value)
      // debugger;
      if (accTypeCd != 5 && accTypeCd !=2) {
        if(this.sys.ardbCD=='26' && this.afMat == true){
          this.showtransdetails = (this.tdDefTransFrm.controls.amount.value  == this.accDtlsFrm.controls.mat_amt.value) && this.tdDefTransFrm.controls.trans_mode.value == 'R' ? false : true
        this.td.trf_type.value === 'T'
        }
        // this.showtransdetails = (this.tdDefTransFrm.controls.amount.value == this.accDtlsFrm.controls.mat_amt.value) && this.tdDefTransFrm.controls.trans_mode.value == 'R' ? false : true
        else{
          this.showtransdetails = (this.tdDefTransFrm.controls.amount.value + this.tdDefTransFrm.controls.curr_intt_recov.value == this.accDtlsFrm.controls.mat_amt.value) && this.tdDefTransFrm.controls.trans_mode.value == 'R' ? false : true
          this.td.trf_type.value === 'T'
        }

      }
      else if(accTypeCd ==2){//PARTHA
        if(this.sys.ardbCD=='26' && this.afMat == true){
        this.showtransdetails = (this.tdDefTransFrm.controls.amount.value == this.accDtlsFrm.controls.mat_amt.value) && this.tdDefTransFrm.controls.trans_mode.value == 'R' ? false : true 
        this.td.trf_type.value === 'T'
        }
        else{
        this.showtransdetails = (this.tdDefTransFrm.controls.amount.value == this.accDtlsFrm.controls.mat_amt.value) && this.tdDefTransFrm.controls.trans_mode.value == 'R' ? false : true
        this.td.trf_type.value === 'T'
        }
      }
      else if(accTypeCd ==5){//PARTHA
        const mat_amt_mis=this.accNoEnteredForTransaction.prn_amt+ this.forB
        this.showtransdetails = (this.tdDefTransFrm.controls.amount.value == mat_amt_mis) && this.tdDefTransFrm.controls.trans_mode.value == 'R' ? false : true
        this.td.trf_type.value === 'T'
      }
      else {
        this.showtransdetails = (this.tdDefTransFrm.controls.curr_intt_recov.value == 0) && this.tdDefTransFrm.controls.trans_mode.value == 'R' ? false : true
        this.td.trf_type.value === 'T'
      }

    }
  }

  // private checkUnaprovedTransactionExixts(): boolean {
  //   this.GetUnapprovedDepTrans();
  //   const unapprovedTrans = this.unApprovedTransactionLst.filter(e => e.acc_num
  //     === this.f.acct_num.value.toString())[0];

  //   if (undefined === unapprovedTrans || Object.keys(unapprovedTrans).length === 0) {
  //     return false;
  //   }
  //   return true;
  // }

  onAmtChng(): void {
    debugger
    this.HandleMessage(false);
    if ((+this.td.amount.value) < 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be negative.');
      this.td.amount.setValue('');
      return;
    }
    const accTypeCd = +this.f.acc_type_cd.value;
    if (accTypeCd === 1 ||accTypeCd === 7 ||accTypeCd === 8) { // check Shadow balance for saving only
      if (this.td.trans_type_key.value === 'W') {
        const tmDep = new tm_deposit();
        let shadowBalance = 0;
        tmDep.acc_type_cd = accTypeCd;
        tmDep.brn_cd = this.sys.BranchCode;
        tmDep.acc_num = this.f.acct_num.value;
        this.isLoading=true;
        this.svc.addUpdDel<any>('Deposit/GetShadowBalance', tmDep).subscribe(
          res => {
            if (undefined !== res && null !== res && !isNaN(+res)) {
              this.isLoading = false;
              shadowBalance = res;
              if (shadowBalance - (+this.td.amount.value) < 0) {
                this.HandleMessage(true, MessageType.Error, 'Amount can not be withdrawn more than balanace amount in Account.');
                this.td.amount.setValue('');
                return;
              } else {
                if(this.accNoEnteredForTransaction.ext_instl_tot==null||this.accNoEnteredForTransaction.ext_instl_tot==undefined||this.accNoEnteredForTransaction.ext_instl_tot==0)
                {
                let minBal = 0;
                if (this.accNoEnteredForTransaction.cheque_facility_flag === 'Y') 
                { minBal = +this.sys.MinBalanceWithCheque; }
                else { minBal = +this.sys.MinBalanceWithOutCheque; }
                if (shadowBalance - (+this.td.amount.value) < minBal && (accTypeCd === 1 ||accTypeCd === 8) && this.sys.ardbCD!='2') {
                  this.HandleMessage(true, MessageType.Error, 'Withdrawal Amount is executed your A/C minimum balance ' + minBal + '.');
                  this.td.amount.setValue('');
                  return;
                  // const cnfrm = confirm('Amount is less than minimum balance ' + minBal + '. Press Ok to continue, else Cancel');
                  // if (cnfrm) {
                  //   if (this.td.trans_type_key.value === 'W') {
                  //     // todo need to change
                  //     this.msg.sendShdowBalance(-(+this.td.amount.value));
                  //   } else if (this.td.trans_type_key.value === 'D') {
                  //     // todo need to change
                  //     this.msg.sendShdowBalance((+this.td.amount.value));
                  //   }
                  // } else {
                  //   this.td.amount.setValue('');
                  // }
                  // return;
                }
               else if (shadowBalance - (+this.td.amount.value) < minBal && (accTypeCd === 1 )&& this.sys.ardbCD=='1') {
                  this.HandleMessage(true, MessageType.Error, 'Withdrawal Amount is executed your A/C minimum balance ' + minBal + '.');
                  this.td.amount.setValue('');
                  return;
                  // const cnfrm = confirm('Amount is less than minimum balance ' + minBal + '. Press Ok to continue, else Cancel');
                  // if (cnfrm) {
                  //   if (this.td.trans_type_key.value === 'W') {
                  //     // todo need to change
                  //     this.msg.sendShdowBalance(-(+this.td.amount.value));
                  //   } else if (this.td.trans_type_key.value === 'D') {
                  //     // todo need to change
                  //     this.msg.sendShdowBalance((+this.td.amount.value));
                  //   }
                  // } else {
                  //   this.td.amount.setValue('');
                  // }
                  // return;
                } else {
                  // check this.td.trans_type_key === 'W' / 'D'
                  // todo need to change
                  this.msg.sendShdowBalance(-(+this.td.amount.value));
                  // if (this.td.trans_type_key.value === 'W') {

                  // } else if (this.td.trans_type_key.value === 'D') {

                  // }
                }
                debugger
              }
              else {
                if( this.sys.ardbCD !='2'&& this.sys.ardbCD !='2'&&(accTypeCd==1||accTypeCd==8) && this.td.trans_type_key.value=='W'){
                  let minBal = 0;
                  minBal=this.accNoEnteredForTransaction.ext_instl_tot
                  debugger
                  if (shadowBalance - (+this.td.amount.value) < minBal) {
                    debugger
                  this.HandleMessage(true, MessageType.Error, 'Withdrawal Amount is executed your A/C minimum balance ' + minBal + '.');
                  this.td.amount.setValue('');
                  return;
                  }
                }
                else if(this.sys.ardbCD=='1' && (accTypeCd==1) && this.td.trans_type_key.value=='W'){
                  let minBal = 0;
                  minBal=this.accNoEnteredForTransaction.ext_instl_tot
                  debugger
                  if (shadowBalance - (+this.td.amount.value) < minBal) {
                    debugger
                  this.HandleMessage(true, MessageType.Error, 'Withdrawal Amount is executed your A/C minimum balance ' + minBal + '.');
                  this.td.amount.setValue('');
                  return;
                  }
                }
                }
              }
            }
          },
          err => {
            this.isLoading = false; console.log(err);
            this.HandleMessage(true, MessageType.Warning, 'Account shadow balance can not be determined');
          }
        );
      } else {
        // todo need to change
        this.msg.sendShdowBalance((+this.td.amount.value));
      }
    } else {
      const selectedOperation2 = this.operations.filter
      (e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    this.selOprn2 = selectedOperation2;
      debugger
      /** if amount is debited less than the min balance then a confirmation need to be shown */
      let minBal = 0;
      if (this.accNoEnteredForTransaction.cheque_facility_flag === 'Y') {
         minBal = +this.sys.MinBalanceWithCheque; 
        }
      else { minBal = +this.sys.MinBalanceWithOutCheque; }
      debugger

      if ((accTypeCd === 9 )
      && this.td.trans_type_key.value === 'W') {
        debugger
        if ((+this.td.amount.value) > this.accNoEnteredForTransaction.clr_bal) {
          debugger
        this.HandleMessage(true, MessageType.Error,
          'Amount can not be greater than Balance amount.');
        this.td.amount.setValue('');
        return;
      }
    }
    else if(accTypeCd === 6 && this.selOprn2?.oprn_desc.toLocaleLowerCase() == 'rd installment'){
      debugger
      if(this.td.amount.value>this.totalDueRD){
        this.HandleMessage(true, MessageType.Error,
          'Amount can not be greater than total due Amount.');
        this.td.amount.setValue('');
      }
     
    }
      // if (minBal > 0) {     
      //   if ((+this.td.amount.value) < minBal) {
      //     const cnfrm = confirm('Amount is less than minimum balance ' + minBal + '. Press Ok to continue, else Cancel');
      //     if (cnfrm) {
      //       if (this.td.trans_type_key.value === 'W') {
      //         // todo need to change
      //         this.msg.sendShdowBalance(-(+this.td.amount.value));
      //       } else if (this.td.trans_type_key.value === 'D') {
      //         // todo need to change
      //         this.msg.sendShdowBalance((+this.td.amount.value));
      //       }
      //     } else {
      //       this.td.amount.setValue('');
      //     }
      //     return;
      //   }
      // }
      this.checkEnteredAmt();
    }

    // this.td_deftranstrfList[0].amount = this.td.amount.value;
  }

  checkEnteredAmt(): void {
    const accTypeCd = +this.f.acc_type_cd.value;
    // For Term Deposit operation close
    // check amount can not be greater than maturity amount.
    if ((accTypeCd === 4 || accTypeCd === 2 )
      && this.td.trans_type_key.value === 'W') {
      const matAmt = this.accNoEnteredForTransaction.prn_amt
        + this.accNoEnteredForTransaction.intt_amt;
      if ((+this.td.amount.value) > matAmt) {
        this.HandleMessage(true, MessageType.Error,
          'Amount can not be greater than maturity amount.');
        this.td.amount.setValue('');
        return;
      }
    }
  }

  onAmtChngDuringRenewal(): void {
    debugger;
    const accTypeCd = +this.f.acc_type_cd.value;
    // this.showTranferType = false;
    this.HandleMessage(false);
    if ((+this.td.amount.value) <= 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be negative Or 0.');
      this.td.amount.setValue('');
      return;
    }
    console.log(this.td.amount.value, this.accDtlsFrm.controls.prn_amt.value)
    if(this.matInt>0){
      //do Nothing
    }
    else{
      if ((this.td.amount.value != this.accDtlsFrm.controls.prn_amt.value) && (this.f.acc_type_cd.value == 2 || this.f.acc_type_cd.value == 4|| this.f.acc_type_cd.value == 5) && (this.td.amount.value != this.accDtlsFrm.controls.mat_amt.value)) {
        this.HandleMessage(true, MessageType.Error, 'Amount should be equal to principal amount.');
        this.td.amount.setValue('');
        return;
      }
    }
    
    if (this.td.trans_type_key.value === 'D' || this.td.trans_type_key.value === 'W') {
      if(this.matInt==undefined){
        this.matInt=0
      }
      ///partha-19/07/2024 this.afMat
      const mat_amt =
      (accTypeCd == 2)?(this.afMat?(this.resbrnCD1[0].intt_trf_type=='O'?this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt +this.matInt
      :this.accNoEnteredForTransaction.prn_amt + this.forB +this.matInt):(this.resbrnCD1[0].intt_trf_type=='O'?this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt
      :this.accNoEnteredForTransaction.prn_amt + this.forB)):
      (accTypeCd==5)?this.accNoEnteredForTransaction.prn_amt+this.forB:
      (this.afMat && accTypeCd==4)?this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt+this.matInt
      :this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt;
      const balance=mat_amt-Number(this.td.amount.value)
      console.log(mat_amt,this.td.amount.value);
      debugger
    if(this.td.amount.value!=mat_amt){
      this.tdDefTransFrm.patchValue({
        trans_type: 'Withdraw',
        trans_type_key: 'W',
        balance:balance

      })
      this.showBalance = true;//PARTHA
        this.showTransfrTyp = this.f.acc_type_cd.value!=11? false:true;
      if(accTypeCd==5){
        this.mat_val=this.accNoEnteredForTransaction.prn_amt
      }
      
      
    }
    else{
      this.tdDefTransFrm.patchValue({
        trans_type: 'deposit',
        trans_type_key: 'D'
      })
      if(accTypeCd==5){
        this.mat_val=mat_amt
      }
      this.showtransdetails=false;
    }
      
      if(this.f.acc_type_cd.value!=11) //marker, can be removed
      this.showtransdetails = this.tdDefTransFrm.controls.trans_mode.value == 'R' && this.tdDefTransFrm.controls.trf_type.value == 'T' && this.tdDefTransFrm.controls.trans_type_key.value=='W' ? true : false;//PARTHA add W
      //  this.mat_val=this.tdDefTransFrm.controls.interest.value? (this.f.prn_amt.value+this.tdDefTransFrm.controls.interest.value):'';
      //  console.log(this.mat_val)
      if ((mat_amt - (+this.td.amount.value)) > 0) {
        debugger
        this.showBalance = true;
        this.showTransfrTyp = true;
        this.td.balance.setValue((mat_amt - (+this.td.amount.value)));
      } else if ((mat_amt - (+this.td.amount.value)) === 0) {
        debugger
        this.showBalance = false;
        this.showTransfrTyp = this.f.acc_type_cd.value!=11? false:true;
        this.td.balance.setValue((mat_amt - (+this.td.amount.value)));
      } else if (((+this.td.amount.value) - mat_amt) > 0) {
        debugger
        if (accTypeCd !== 2) {
        this.HandleMessage(true, MessageType.Error, 'Amount can not be greater than maturity amount.');
        this.td.amount.setValue('');
        this.showBalance = false;
        this.td.balance.setValue('');
        }
        else{//PARTHA
          debugger
          if( this.td.amount.value==mat_amt){
            this.tdDefTransFrm.patchValue({
              trans_type: 'deposit',
              trans_type_key: 'D'
            })
          }
          else{
            this.tdDefTransFrm.patchValue({
              trans_type: 'deposit',
              trans_type_key: 'D'
            })
          }
          this.td.amount.setValue(mat_amt);
          this.showTransfrTyp = false;
        }
        return;
      }
    }
    // this.td_deftranstrfList[0].amount = this.td.amount.value;
    this.processInterest()
  }

  onSaveClick(): void {
   
    console.log(this.td_deftranstrfList);
    let exists = this.td_deftranstrfList.some(item => item.cust_acc_number == this.td.acc_num.value);
    if (exists) {
      this.HandleMessage(true, MessageType.Error, 'Same account debit credit can not be possible,');
        return;
    }

    const accTypeCd = +this.f.acc_type_cd.value;
    const selectedOperation2 = this.operations.filter
      (e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    this.selOprn2 = selectedOperation2;
    //for FD INTREST PAYMENT
    if((accTypeCd == 2 || accTypeCd == 5) && this.td.trf_type.value === 'T' && selectedOperation2.oprn_desc.toLocaleLowerCase() == 'interest payment'){
      if(this.td.amount.value!=this.TrfTotAmt){
        this.HandleMessage(true, MessageType.Error, 'Transaction amount dose not match with transfer amount..');
        return;
      }
    }
    if((accTypeCd == 2 || accTypeCd == 3|| accTypeCd == 4 || accTypeCd == 5) && this.showBalance && this.td.trf_type.value === 'T' && selectedOperation2.oprn_desc.toLocaleLowerCase() == 'renewal'){
      if(this.td.balance.value!=this.TrfTotAmt){
        this.HandleMessage(true, MessageType.Error, 'Balance amount dose not match with transfer amount..');
        return;
      }
    }
    if((accTypeCd == 6 ) && this.td.trf_type.value === 'T' && selectedOperation2.oprn_desc.toLocaleLowerCase() == 'rd installment'){
      if(this.td.amount.value!=this.TrfTotAmt){
        this.HandleMessage(true, MessageType.Error, 'Transaction amount dose not match with transfer amount..');
        return;
      }
    }
    if((accTypeCd == 6 || accTypeCd == 5 || accTypeCd == 4 || accTypeCd == 3 ) && this.td.trf_type.value === 'T' && selectedOperation2.oprn_desc.toLocaleLowerCase() == 'close'){
      if(this.td.td_def_mat_amt.value!=this.TrfTotAmt){
        this.HandleMessage(true, MessageType.Error, 'Maturity amount dose not match with transfer amount..');
        return;
      }
    }
    debugger;
      if(this.f.acc_type_cd.value == 11 && this.td.trf_type.value === 'T' && this.showtransdetails == true && this.TrfTotAmt !== (+this.tdDefTransFrm.controls.amount.value+(+this.tdDefTransFrm.controls.curr_intt_recov.value))){
       
       debugger;
        this.HandleMessage(true, MessageType.Error,
          `Transfer total amount ₹${this.TrfTotAmt}, ` +
          // ` does not match with transaction amount ₹${this.tdDefTransFrm.controls.amount.value+this.tdDefTransFrm.controls.closeIntrest.value}`);
          ` does not match with transaction amount ₹${this.tdDefTransFrm.controls.amount.value}`);
        return;
      }
   
    //for FD INTREST PAYMENT
    if ((accTypeCd !== 1 && accTypeCd !== 7 && accTypeCd !== 8 && accTypeCd !== 9 && accTypeCd !== 11)&&(+this.td.amount.value) <= 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be blank');
      return;
    }
    else if (this.td.trf_type.value === 'T' && (this.TrfTotAmt==0||this.TrfTotAmt==null||this.TrfTotAmt==undefined)&& (accTypeCd==1||accTypeCd==8)){
      this.HandleMessage(true, MessageType.Error, 'Please select correct Transaction  type or put Transaction  value');
      return;
    }
    // else if (this.td.trf_type.value === 'T' ){
    //   this.td_def_trans_trf.forEach(e=>{
    //     if (e.cust_acc_type){
    //       if(e.cust_acc_number){
    //         this.HandleMessage(true, MessageType.Error, 'Please select customer in transfer screen..');
    //         return;
    //       }
    //     }
    //   })
    // }
    else if(this.td.trf_type.value === 'T' && (this.accTransFrm.controls.acc_type_cd.value==9||this.accTransFrm.controls.acc_type_cd.value==1||this.accTransFrm.controls.acc_type_cd.value==8||this.accTransFrm.controls.acc_type_cd.value==7)){
        if((Number(this.td.closeIntrest.value)>0?Number(this.td.amount.value)+Number(this.td.closeIntrest.value):Number(this.td.amount.value))!=this.TrfTotAmt){
          this.HandleMessage(true, MessageType.Error, 'Total Amount can not be more than Transaction amount');
          return;
        }
      }
    /** do not check Transaction  type for FD renewal which doesnt have balance */
    else if (accTypeCd !== 2 && !this.showBalance) {
      if (undefined === this.td.trf_type.value
        || null === this.td.trf_type.value
        || this.td.trf_type.value === '') {
        this.HandleMessage(true, MessageType.Error, 'Please choose Transaction  type.');
        return;
      }
    }
    else if (accTypeCd !== 2 && !this.showBalance) {
      // if (this.td.trf_type.value === 'C' && this.denominationGrandTotal !== (+this.td.amount.value)) {
      //   this.HandleMessage(true, MessageType.Error,
      //     `Denomination total amount ₹${this.denominationGrandTotal}, ` +
      //     ` do not match with transaction amount ₹${this.td.amount.value}`);
      //   return;
      // }
      console.log(this.TrfTotAmt+" "+this.td.amount.value)
      
      if (this.td.trf_type.value === 'T' && this.showtransdetails == true && this.TrfTotAmt !== (+this.td.amount.value)) {
        debugger;
        console.log(this.tdDefTransFrm.controls.acc_type_cd.value)
        if (accTypeCd == 1 && this.tdDefTransFrm.controls.closeIntrest.value>0) {
          // console.log("here in 1 or 8")
          // if(this.TrfTotAmt!=(this.tdDefTransFrm.controls.amount.value+this.tdDefTransFrm.controls.closeIntrest.value))
          if (this.TrfTotAmt != ((+this.tdDefTransFrm.controls.amount.value) + (+this.tdDefTransFrm.controls.closeIntrest.value))) {
            console.log(this.tdDefTransFrm.controls.amount.value + " " + this.tdDefTransFrm.controls.closeIntrest.value)
            this.HandleMessage(true, MessageType.Error,
              `Transfer total amount ₹${this.TrfTotAmt}, ` +
              // ` does not match with transaction amount ₹${this.tdDefTransFrm.controls.amount.value+this.tdDefTransFrm.controls.closeIntrest.value}`);
              ` does not match with transaction amount ₹${this.tdDefTransFrm.controls.amount.value}`);
            return;
          }
        }
        else {
          debugger
          console.log(this.tdDefTransFrm.controls.amount.value + " " + this.tdDefTransFrm.controls.closeIntrest.value)
          if (accTypeCd == 6 || accTypeCd==4) {
            // console.log("here inside 2354")
            if (this.tdDefTransFrm.controls.td_def_mat_amt.value != this.TrfTotAmt) {
              this.HandleMessage(true, MessageType.Error,
                `Transfer total amount ₹${this.TrfTotAmt}, ` +
                ` do not match with balance amount ₹${this.tdDefTransFrm.controls.td_def_mat_amt.value}`);
              return;
            }
          }
          if (accTypeCd == 11) {
            // console.log("here inside 2354")
            // debugger;
            console.log(this.tdDefTransFrm.controls.amount.value+(+this.tdDefTransFrm.controls.curr_intt_recov.value))
            debugger;
            if (this.tdDefTransFrm.controls.amount.value+Number(this.tdDefTransFrm.controls.curr_intt_recov.value) != this.TrfTotAmt) {
              this.HandleMessage(true, MessageType.Error,
                `Transfer total amount ₹${this.TrfTotAmt}, ` +
                ` do not match with the amount ₹${this.tdDefTransFrm.controls.td_def_mat_amt.value}`);
              return;
            }
          }
          if (accTypeCd==7) {
      
            this.HandleMessage(true, MessageType.Error,
              `Transfer total amount ₹${this.TrfTotAmt}, ` +
              ` do not match with Transaction amount ₹${this.td.amount.value}`);
            return;
          
     }
     
         
          // this.HandleMessage(true, MessageType.Error,
          //   `Transfer total amount ₹${this.TrfTotAmt}, ` +
          //   ` does not match with transaction amount ₹${this.td.amount.value}`);
          // return;
        }

      }
    } else {
      // if (this.td.trf_type.value === 'C' && this.denominationGrandTotal !== (+this.td.balance.value)) {
      //   this.HandleMessage(true, MessageType.Error,
      //     `Denomination total amount ₹${this.denominationGrandTotal}, ` +
      //     ` do not match with balance amount ₹${this.td.balance.value}`);
      //   return;
      // }

      if (this.td.trf_type.value === 'T' && this.TrfTotAmt !== (+this.td.balance.value)) {
        console.log(this.accTransFrm.controls.oprn_cd.value)
        // console.log()
        console.log(this.tdDefTransFrm.controls.acc_type_cd.value)
        if (this.accTransFrm.controls.oprn_cd.value == 5) {
          console.log("here inside 2183")
          if (this.tdDefTransFrm.controls.td_def_mat_amt.value != this.TrfTotAmt) {
            this.HandleMessage(true, MessageType.Error,
              `Transfer total amount ₹${this.TrfTotAmt}, ` +
              ` do not match with balance amount ₹${this.tdDefTransFrm.controls.td_def_mat_amt.value}`);
            return;
          }
        }
     }
     
    }
    if (accTypeCd == 6 && this.td.amount.value % this.accDtlsFrm.controls.instl_amt.value != 0) {
      console.log(this.td.acc_cd.value + " " + this.td.amount.value + " " + this.accDtlsFrm.controls.instl_amt.value)
      this.HandleMessage(true, MessageType.Error,
        `Total amount ₹${this.td.amount.value}, ` +
        ` does not match with installment amount ₹${this.accDtlsFrm.controls.instl_amt.value}`);
      return;
    }
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    console.log(this.f.oprn_cd, this.operations)
    // console.log({"SelectedOPRN":selectedOperation,"OPRN": this.operations});
    //////////////debugger;
    if (!this.editDeleteMode) {
      this.isLoading = true; const saveTransaction = new AccOpenDM();
      const tdDefTrans = this.mappTddefTransFromFrm();
      console.log(tdDefTrans);
      debugger
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
        saveTransaction.tmdepositrenew = this.mapRenewData();
      }
      saveTransaction.tddeftrans = tdDefTrans;
      if (this.td.trf_type.value === 'C') {
        // saveTransaction.tmdenominationtrans = this.tm_denominationList;  
        //for denomination somnath comment
      } else if (this.td.trf_type.value === 'T') {
        let i = 0;

        this.td_deftranstrfList.forEach(e => {
          if (e.amount != null && e.amount != 0) {
            const tdDefTransAndTranfer = this.mappTddefTransAndTransFrFromFrm();
            console.log(tdDefTransAndTranfer)
            
            //markar
            // if(tdDefTransAndTranfer.acc_num !== '0000'){
            //   if ((+tdDefTransAndTranfer.clr_bal < (+tdDefTransAndTranfer.amount) && this.f.oprn_cd.value == 1)) {
            //   debugger;
            //   this.HandleMessage(true, MessageType.Warning, 'Insufficient Balance');
            //   tdDefTransAndTranfer.amount = null;
            //   return;
            // }

            // else {
            // }
            // }

            if (e.trans_type === 'cust_acc') {
              tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
              tdDefTransAndTranfer.acc_num = e.cust_acc_number;
              tdDefTransAndTranfer.acc_name = e.cust_name;
              tdDefTransAndTranfer.instrument_num = e.instrument_num;
              tdDefTransAndTranfer.acc_cd = e.acc_cd;
              // tdDefTransAndTranfer.remarks = 'D';
              tdDefTransAndTranfer.remarks = selectedOperation.oprn_desc.toLocaleLowerCase();
              tdDefTransAndTranfer.disb_id = ++i;
              if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
                tdDefTransAndTranfer.trans_type = 'D'  //marker
              }
              if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal' || selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
                const desc = this.accTransFrm.controls.acc_type_cd.value == 2 ? 'FD ' : (this.accTransFrm.controls.acc_type_cd.value === 3 ? 'DBS' : (this.accTransFrm.controls.acc_type_cd.value == 4 ? 'TD' : (this.accTransFrm.controls.acc_type_cd.value == 5 ? 'MIS ' : '')))
                console.log(this.accTransFrm.controls.acc_type_cd.value + " " + desc)


                tdDefTransAndTranfer.particulars = 'By Trf from ' + desc + 'A/C: ' + this.td.acc_num.value //marker
              }
            } else {
              tdDefTransAndTranfer.acc_type_cd = +e.gl_acc_code;
              tdDefTransAndTranfer.acc_num = '0000';
              tdDefTransAndTranfer.acc_name = e.gl_acc_desc;
              tdDefTransAndTranfer.instrument_num = e.instrument_num;
              tdDefTransAndTranfer.acc_cd = +e.gl_acc_code;
              // tdDefTransAndTranfer.remarks = 'X';
              tdDefTransAndTranfer.remarks = selectedOperation.oprn_desc.toLocaleLowerCase();
              tdDefTransAndTranfer.disb_id = ++i;
              if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal' || selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
                const desc = this.accTransFrm.controls.acc_type_cd.value == 2 ? 'FD ' : (this.accTransFrm.controls.acc_type_cd.value === 3 ? 'DBS' : (this.accTransFrm.controls.acc_type_cd.value == 4 ? 'TD' : (this.accTransFrm.controls.acc_type_cd.value == 5 ? 'MIS ' : '')))
                console.log(this.accTransFrm.controls.acc_type_cd.value + " " + desc)
                tdDefTransAndTranfer.particulars = 'By Trf from ' + desc + 'A/C: ' + this.td.acc_num.value //marker
              }
            }
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'rd installment') {
              tdDefTransAndTranfer.trans_type = 'W';
              tdDefTransAndTranfer.trans_mode = '';
              tdDefTransAndTranfer.particulars = 'TO RD INSTALLMENT A/C: ' + this.td.acc_num.value

            }
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment') {
              tdDefTransAndTranfer.trans_type = tdDefTransAndTranfer.trf_type == 'C' ? 'W' : 'D';//marker
              tdDefTransAndTranfer.trans_mode = 'I';//marker
            }
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
              if (accTypeCd == 5 || accTypeCd == 5) {
                for (let i = 0; i < AccounTransactionsComponent.constitutionList.length; i++) {
                  if (AccounTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd == this.tddefAccTypCd) {
                    tdDefTransAndTranfer.acc_cd = AccounTransactionsComponent.constitutionList[i].acc_cd
                    console.log(tdDefTransAndTranfer.acc_cd)
                  }
                }
              }
            } //marker
            tdDefTransAndTranfer.amount = e.amount;
            console.log(tdDefTransAndTranfer);
            tdDefTransAndTranfer.home_brn_cd = tdDefTransAndTranfer.brn_cd;
            tdDefTransAndTranfer.intra_branch_trn = tdDefTransAndTranfer.brn_cd != this.sys.BranchCode ? 'Y' : 'N'
            // toReturn.home_brn_cd=toReturn.acc_num.substring(0,3);
            // toReturn.intra_branch_trn=toReturn.acc_num.substring(0,3)!=this.sys.BranchCode?'Y':'N'
            saveTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
            // this.checkDebitBalance(this.td_deftranstrfList[0])
            debugger
          }
          else {
            if(this.accDtlsFrm.controls.mat_amt.value!=this.tdDefTransFrm.controls.amount.value){
              this.HandleMessage(true, MessageType.Error, 'Amount can not be null');
              return
            }
          }

          
        });
        

        const tmTrnsfr = new tm_transfer();
        tmTrnsfr.brn_cd = this.sys.BranchCode;
        tmTrnsfr.trf_dt = this.sys.CurrentDate;
        tmTrnsfr.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
        tmTrnsfr.approval_status = 'U';

        if (this.showtransdetails)
          saveTransaction.tmtransfer.push(tmTrnsfr);

      }
      
      console.log(saveTransaction)
      if(this.errorFlag){
        this.HandleMessage(true, MessageType.Error, 'Please Check Transfer Amount');
        this.isLoading = false;
        return
      }
      debugger;
      this.svc.addUpdDel<AccOpenDM>('Deposit/InsertAccountOpeningData', saveTransaction).subscribe(
        res => {
          this.HandleMessage(true, MessageType.Sucess, 'Saved sucessfully, your transaction code is :' + res);
          this.tdDefTransFrm.reset(); this.f.oprn_cd.reset();
          this.getShadowBalance();
          this.mat_val=null;
          this.td_deftranstrfList=null;
          this.TrfTotAmt=0;
          this.isLoading = false;
        
          if(this.accTransFrm.controls.acc_type_cd.value==2 || this.accTransFrm.controls.acc_type_cd.value==3 || this.accTransFrm.controls.acc_type_cd.value==4|| this.accTransFrm.controls.acc_type_cd.value==5 || this.accTransFrm.controls.acc_type_cd.value==6){
            this.onResetClick();
          }
        },
        err => { this.isLoading = false; console.error('Error on onSaveClick' + JSON.stringify(err)); }
      );
    } else {
      const updateTransaction = new LoanOpenDM();
      updateTransaction.tddeftrans = this.mappTddefTransFromFrm();
      // if (null !== this.td.trans_mode
      //   && this.td.trans_mode.value.toLowerCase() === 'r') {
      //   updateTransaction.tmdepositrenew = this.mapRenewData();
      // }
      if (this.td.trans_mode.value && this.td.trans_mode.value.toLocaleLowerCase() === 'r') {
        // debugger;
        updateTransaction.tmdepositrenew = this.mapRenewData();
        if (!this.td.trans_mode.value && this.td.acc_type_cd.value == 6)
          updateTransaction.tmdepositrenew = this.mapRenewData();

      }
      console.log(updateTransaction.tddeftrans);
      // //debugger;
      if (this.td.trf_type.value === 'C') {

        console.log(this.f.oprn_cd.value)
        // this.td.trans_cd.value;
        this.tm_denominationList.forEach(ele => {
          ele.trans_cd = this.td.trans_cd.value;
        });
        updateTransaction.tmdenominationtrans = this.tm_denominationList;

      } else if (this.td.trf_type.value === 'T') {
        let i = 0;
        console.log(this.f.oprn_cd.value)
        //debugger;
        this.td_deftranstrfList.forEach(e => {
          if (e.amount != null) {

            // const tdDefTransAndTranfer = this.mappTddefTransFromFrm();
            const tdDefTransAndTranfer = this.mappTddefTransAndTransFrFromFrm();
            console.log(tdDefTransAndTranfer);
            console.log(selectedOperation)
            // debugger;  //marker 2660
            if (this.td.trf_type.value === 'T' && (this.td.trans_mode.value == 'C' || this.td.trans_mode.value == 'W') && this.editDeleteMode && (accTypeCd == 1 || accTypeCd == 8 || accTypeCd == 2 || accTypeCd == 4)) {
              const desc = this.accTransFrm.controls.acc_type_cd.value == 2 ? 'FD ' : (this.accTransFrm.controls.acc_type_cd.value === 3 ? 'DBS' : (this.accTransFrm.controls.acc_type_cd.value == 4 ? 'Cash Certificate ' : (this.accTransFrm.controls.acc_type_cd.value == 5 ? 'MIS ' : '')))
              tdDefTransAndTranfer.particulars = 'By Trf from ' + desc + 'A/C:' + this.td.acc_num.value
            }
            else {
              if (this.editDeleteMode && accTypeCd != 2 && accTypeCd != 4 && accTypeCd != 5 && accTypeCd != 6 && accTypeCd != 11)
                tdDefTransAndTranfer.particulars = this.td.particulars.value.split(' ')[0] === "BY" ? this.td.particulars.value.replace("BY", "TO") : this.td.particulars.value.replace("TO", "BY");
              else {
                if ((accTypeCd == 4 || accTypeCd == 5 || accTypeCd == 6) && (this.td.trans_mode.value == 'R' || this.td.trans_mode.value == 'C')) { //marker
                  const desc = this.accTransFrm.controls.acc_type_cd.value == 2 ? 'FD ' : (this.accTransFrm.controls.acc_type_cd.value === 3 ? 'DBS' : (this.accTransFrm.controls.acc_type_cd.value == 4 ? 'TD ' : (this.accTransFrm.controls.acc_type_cd.value == 5 ? 'MIS ' : '')))

                  tdDefTransAndTranfer.particulars = 'By Trf from ' + desc + 'A/C:' + this.td.acc_num.value
                }
                else
                  tdDefTransAndTranfer.particulars = this.tdDefTransFrm.controls.particulars.value

              }
            }
            console.log(tdDefTransAndTranfer.particulars)
            // //debugger;
            if (e.trans_type === 'cust_acc') {
              tdDefTransAndTranfer.trans_cd = this.td.trans_cd.value;
              tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
              tdDefTransAndTranfer.acc_num = e.cust_acc_number;
              tdDefTransAndTranfer.acc_name = e.cust_name;
              tdDefTransAndTranfer.instrument_num = e.instrument_num;
              tdDefTransAndTranfer.acc_cd = e.acc_cd;
              // tdDefTransAndTranfer.particulars=e.particulars

              // tdDefTransAndTranfer.remarks = 'D';
              tdDefTransAndTranfer.remarks = selectedOperation.oprn_desc.toLocaleLowerCase()  //marker
              tdDefTransAndTranfer.disb_id = ++i;
              // //debugger;
              console.log("if" + " " + tdDefTransAndTranfer.acc_cd, this.td_deftranstrfList)
              // //debugger;

            } else {
              tdDefTransAndTranfer.trans_cd = this.td.trans_cd.value;
              tdDefTransAndTranfer.acc_type_cd = +e.gl_acc_code;
              tdDefTransAndTranfer.acc_num = '0000';
              tdDefTransAndTranfer.acc_name = e.gl_acc_desc;
              tdDefTransAndTranfer.instrument_num = e.instrument_num;
              tdDefTransAndTranfer.acc_cd = +e.gl_acc_code;
              tdDefTransAndTranfer.remarks = selectedOperation.oprn_desc.toLocaleLowerCase(); //marker
              // tdDefTransAndTranfer.remarks = 'X';
              tdDefTransAndTranfer.disb_id = ++i;
              // //debugger;
              console.log("else" + " " + tdDefTransAndTranfer.acc_cd)
              // //debugger;
              
            }
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'rd installment') {
              tdDefTransAndTranfer.trans_type = 'W';
              tdDefTransAndTranfer.trans_mode = '';
              tdDefTransAndTranfer.particulars = 'TO RD INSTALLMENT A/C: ' + this.td.acc_num.value
            }
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment') {
              tdDefTransAndTranfer.trans_type = tdDefTransAndTranfer.trf_type == 'C' ? 'W' : 'D'; //marker
              tdDefTransAndTranfer.trans_mode = 'I'; //marker
              const desc = accTypeCd == 5 ? ' MIS ' : ' Savings ' //marker

              tdDefTransAndTranfer.particulars = tdDefTransAndTranfer.particulars + desc + "A/C: " + this.td.acc_num.value //marker

              // for(let i=0;i<AccounTransactionsComponent.constitutionList.length;i++){
              //   if(AccounTransactionsComponent.constitutionList[i].constitution_cd==this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd==accTypeCd)
              //  { tdDefTransAndTranfer.acc_cd=AccounTransactionsComponent.constitutionList[i].intt_acc_cd
              //   console.log(tdDefTransAndTranfer.acc_cd)}
              // }
              // //debugger;
            }
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
              if (accTypeCd == 5) {
                console.log("3162 ln")
                for (let i = 0; i < AccounTransactionsComponent.constitutionList.length; i++) {
                  if (AccounTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd == this.tddefAccTypCd) {
                    tdDefTransAndTranfer.acc_cd = AccounTransactionsComponent.constitutionList[i].acc_cd
                    console.log(tdDefTransAndTranfer.acc_cd)
                  }
                }
              } //marker
              if (accTypeCd == 11) {
                console.log("3162 ln")
                for (let i = 0; i < AccounTransactionsComponent.constitutionList.length; i++) {
                  if (AccounTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd == this.tddefAccTypCd) {
                    tdDefTransAndTranfer.acc_cd = AccounTransactionsComponent.constitutionList[i].acc_cd
                    console.log(tdDefTransAndTranfer.acc_cd)
                  }
                }
              } 
              // //debugger;
            }
            tdDefTransAndTranfer.amount = e.amount;
            tdDefTransAndTranfer.home_brn_cd = this.sys.ardbCD=='1'? tdDefTransAndTranfer.acc_num.substring(2, 3):tdDefTransAndTranfer.acc_num.substring(0, 3);
            tdDefTransAndTranfer.intra_branch_trn = this.sys.ardbCD=='1'? tdDefTransAndTranfer.acc_num.substring(2, 3):tdDefTransAndTranfer.acc_num.substring(0, 3) != this.sys.BranchCode ? 'Y' : 'N'
            console.log(tdDefTransAndTranfer.particulars)
            //  debugger;
            updateTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
            // this.checkDebitBalance(this.td_deftranstrfList[0])
          }
          else {
            if(this.accDtlsFrm.controls.mat_amt.value!=this.tdDefTransFrm.controls.amount.value){
              this.HandleMessage(true, MessageType.Error, 'Amount can not be null');
              return
            }
            
          }

        });
      }
      
      if(this.errorFlag ||updateTransaction.tddeftranstrf[0].amount==0){
        this.HandleMessage(true, MessageType.Error, 'Please Check Transfer Amount');
        this.isLoading = false;
        return
      }
      this.svc.addUpdDel<LoanOpenDM>('Common/UpdateTransactionDetails', updateTransaction).subscribe(
        res => {
          console.log(this.td_deftranstrfList)
          // debugger;
          const accNum = this.f.acct_num.value;
          if ((+res) === -1) {
            this.HandleMessage(true, MessageType.Error, `Transaction for Acc# ${accNum},
            Not updated sucessfully.`);
          } else {
            this.HandleMessage(true, MessageType.Sucess, `Transaction for Acc# ${accNum},
            updated sucessfully.`);
            this.onResetClick();
            this.mat_val=null;
          this.td_deftranstrfList=null;
          this.TrfTotAmt=0;
          }
          this.isLoading = false;
        },
        err => { this.isLoading = false; console.error('Error on Update Transaction' + JSON.stringify(err)); }
      );
    }

  }

  mappTddefTransFromFrm(): td_def_trans_trf {
    // //////////////debugger;
    const toReturn = new td_def_trans_trf();
    const accTypeCd = +this.f.acc_type_cd.value;

    if (!this.editDeleteMode) {
      const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
      console.log(selectedOperation.oprn_desc)
      //  debugger
      const accTypeCd = +this.f.acc_type_cd.value;
      // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
      toReturn.trans_dt = this.sys.CurrentDate;
      toReturn.acc_type_cd = this.td.acc_type_cd.value;
      toReturn.acc_num = this.td.acc_num.value;
      toReturn.trans_type = this.td.trans_type_key.value;
      toReturn.trans_mode = this.td.trans_mode.value;
      toReturn.paid_to = this.td.paid_to.value;
      toReturn.token_num = this.td.token_num.value;
      toReturn.trf_type = this.td.trf_type.value;
      toReturn.home_brn_cd = this.resBrnCd != this.sys.BranchCode ? this.resBrnCd : this.sys.BranchCode;
      toReturn.remarks = selectedOperation.oprn_desc.toLocaleLowerCase()
      toReturn.intra_branch_trn = this.resBrnCd != this.sys.BranchCode ? 'Y' : 'N'
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close' && (accTypeCd === 2 || accTypeCd === 3 || accTypeCd === 4 || accTypeCd === 5 || accTypeCd === 6 || accTypeCd === 10|| accTypeCd === 11)) {
      debugger
        toReturn.amount = accTypeCd !== 6 ? this.accNoEnteredForTransaction.prn_amt : this.tdDefTransFrm.controls.amount.value-this.tdDefTransFrm.controls.ovd_intt_recov.value+this.tdDefTransFrm.controls.curr_prn_recov.value;
       if(accTypeCd==6){
       toReturn.amount=this.tdDefTransFrm.controls.amount.value }  //marker
       if(accTypeCd==10){
        toReturn.paid_amt= ((+this.tdDefTransFrm.controls.amount.value) + (+this.tdDefTransFrm.controls.curr_prn_recov.value))-(+this.tdDefTransFrm.controls.ovd_intt_recov.value);
        toReturn.amount =  this.accNoEnteredForTransaction.clr_bal;
        toReturn.ovd_prn_recov = this.accNoEnteredForTransaction.clr_bal;
        console.log(this.td.trans_type_key.value);
        toReturn.trans_type='W';
       }
        toReturn.curr_intt_recov = +this.td.curr_intt_recov.value;
        toReturn.ovd_intt_recov = (accTypeCd === 5) ? 0 : +this.td.ovd_intt_recov.value;
        toReturn.curr_prn_recov = +this.td.curr_prn_recov.value;
      } else {
        if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
          // toReturn.amount=+this.td.interest.value
          // console.log(toReturn.trf_type)
          console.log(this.constCd + " " + this.td.trans_type.value)
          console.log(AccounTransactionsComponent.constitutionList)
          // debugger;
          for (let i = 0; i < AccounTransactionsComponent.constitutionList.length; i++) {
            if (AccounTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd == 5 && (this.td.trans_type.value.toLocaleLowerCase() == 'withdraw')) {
              toReturn.acc_cd = AccounTransactionsComponent.constitutionList[i].intt_acc_cd
              console.log(toReturn.acc_cd)
              // debugger;
            }
            if (AccounTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd == 5 && (this.td.trans_type.value.toLocaleLowerCase() == 'deposit')) {
              toReturn.acc_cd = AccounTransactionsComponent.constitutionList[i].acc_cd
              console.log(toReturn.acc_cd)
              //  debugger;
            }
          } //marker
          const desc = accTypeCd == 2 ? 'FD ' : (accTypeCd === 3 ? 'DBS' : (accTypeCd == 4 ? 'TD' : (accTypeCd == 5 ? 'MIS ' : (accTypeCd == 6 ? 'RD ' : (accTypeCd == 7 ? 'Share ' : (accTypeCd == 8 ? 'Flexi ' : 'DSP'))))))
          toReturn.particulars = toReturn.trf_type == 'T' ? 'By Trf ' + desc + ' A/C No: ' + this.td.acc_num.value : ''
          console.log(toReturn.particulars)
          toReturn.trf_type = toReturn.trf_type == null && this.tdDefTransFrm.controls.amount.value == this.accDtlsFrm.controls.mat_amt.value ? 'T' : toReturn.trf_type;
          // console.log(toReturn.trf_type)
          toReturn.amount = (accTypeCd == 2 && this.td.balance.value>0)?this.td.balance.value: this.td.amount.value == this.accDtlsFrm.controls.mat_amt.value ? this.accDtlsFrm.controls.intt_amt.value:0

          // toReturn.amount = this.tdDefTransFrm.controls.amount.value == this.accDtlsFrm.controls.mat_amt.value ? this.accDtlsFrm.controls.intt_amt.value:0
          // console.log(toReturn.amount)
          // toReturn.amount = this.tdDefTransFrm.controls.balance.value>0?;
        } else {
          // toReturn.amount = +this.td.amount.value.trim(); PARTHA
          toReturn.amount = +this.td.amount.value;

        }
      }

      toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
      toReturn.instrument_dt = this.td.instrument_dt.value === '' ? null : this.td.instrument_dt.value;
      if (this.td.particulars.value === null ||
        this.td.particulars.value === '') {
        if (selectedOperation.oprn_desc.toLocaleLowerCase() !== 'close') {
          if (accTypeCd === 2
            || accTypeCd === 3
            || accTypeCd === 4
            || accTypeCd === 5
          ) {
            toReturn.particulars = this.td.particulars.value;
          } else {
            if (this.td.trf_type.value === 'C') {
              if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
                toReturn.particulars = 'TO CASH ';
              } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
                toReturn.particulars = 'BY CASH ';
              }

            } else {
              if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
                ////////////debugger;
                // console.log('2813')
                toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
              } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit' || selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
                ////////////debugger;
                toReturn.particulars = 'BY TRANSFER :' + this.td.acc_num.value;
              }
            }
          }
        } else {
          if (this.td.trf_type.value === 'C') {
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              toReturn.particulars = 'TO CASH ';
            } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
              toReturn.particulars = 'BY CASH ';
            }

          } else {
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              // console.log('2831')
              toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
            } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit' || selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
              toReturn.particulars = 'BY TRANSFER :' + this.td.acc_num.value;
            }
          }
        }
      } else {
        toReturn.particulars = this.td.particulars.value;
        console.log(this.td.particulars.value)

        //   if(accTypeCd==5) //marker
        // toReturn.particulars = this.td.particulars.value.split(' ')[0]==="BY"?  this.td.particulars.value.replace("BY","TO"):this.td.particulars.value.replace("TO","BY");
        ////////////debugger;
        console.log({ "toReturn.remarks": toReturn.remarks, " this.td.particulars.value": this.td.particulars.value })
        debugger
      }

      // if (selectedOperation.oprn_desc.toLocaleLowerCase() !== 'close' &&
      //   accTypeCd === 1) {
      //   toReturn.particulars = 'To Closing';
      //   toReturn.curr_intt_recov = +this.td.closeIntrest.value;
      // }

      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close' &&
        (accTypeCd === 1 || accTypeCd === 8)) {
        toReturn.particulars = 'To Closing';
        // debugger
        this.tdDefTransFrm.patchValue({
          particulars: 'By closing of A/C No:' + this.td.acc_num.value
        })
        toReturn.curr_intt_recov = +this.td.closeIntrest.value;
      }
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close' && (accTypeCd === 10)||(accTypeCd === 11)) {
      toReturn.particulars = this.tdDefTransFrm.controls.trf_type.value=='C'?'To Cash':'To Transfer';
      // debugger
      this.tdDefTransFrm.patchValue({
        particulars: this.tdDefTransFrm.controls.trf_type.value=='C'?'To Cash':'To Transfer'
      })
      // toReturn.curr_intt_recov = +this.td.closeIntrest.value;
    }

      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal'
        && this.td.trf_type.value === '') {
        toReturn.trans_type = 'T';
      }
      toReturn.approval_status = 'U';
      toReturn.brn_cd = this.sys.BranchCode;

      if (this.td.trf_type.value === 'T') {
        toReturn.tr_acc_cd = 10000;
      } else if (this.td.trf_type.value === 'C') {
        toReturn.tr_acc_cd = 21101;
      }
      // if ((+this.f.acc_type_cd.value) === 2) {
      //   toReturn.acc_cd = 14301;
      // }
      if (accTypeCd != 5 && this.td.trans_type.value.toLocaleLowerCase() != 'withdraw')  //might have to change
        toReturn.acc_cd = this.resbrnCD1[0].acc_cd;

      console.log(this.resbrnCD1[0].acc_cd)
      if ((+this.f.acc_type_cd.value) === 6) {
        // toReturn.acc_cd = 14302;
        // debugger;
        for (let i = 0; i < AccounTransactionsComponent.constitutionList.length; i++) {
          if (AccounTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd == accTypeCd) {
            toReturn.acc_cd = AccounTransactionsComponent.constitutionList[i].acc_cd
            console.log(toReturn.acc_cd)
          }
        }
      }

      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment') {
        // debugger
        for (let i = 0; i < AccounTransactionsComponent.constitutionList.length; i++) {
          if (AccounTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd == accTypeCd) {
            toReturn.acc_cd = AccounTransactionsComponent.constitutionList[i].intt_acc_cd
            console.log(toReturn.acc_cd)
            // debugger;
          }
        } //marker

        //   else {
        // toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;

      } //marker
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
        if (accTypeCd == 5) {
          // debugger;
          for (let i = 0; i < AccounTransactionsComponent.constitutionList.length; i++) {
            if (AccounTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd == accTypeCd) {
              toReturn.acc_cd = AccounTransactionsComponent.constitutionList[i].acc_cd
              console.log(toReturn.acc_cd)
              // debugger;
            }
          } //marker
        }
        //   else {
        // toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;

      }
      ///here else if is made a marker for making intt cd 
      else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
        debugger
        console.log(toReturn)
        toReturn.curr_prn_recov = accTypeCd === 5 ? this.td.td_def_mat_amt.value: ((+this.td.amount.value) + (+this.td.interest.value));
        toReturn.ovd_prn_recov = accTypeCd === 5 ? this.accNoEnteredForTransaction.prn_amt : this.accNoEnteredForTransaction.prn_amt;
        toReturn.curr_intt_recov = accTypeCd === 5 ? (this.matInt>0? +this.misSum+this.matInt:this.misSum): this.accNoEnteredForTransaction.intt_amt;
        toReturn.ovd_intt_recov = 0;
        if(accTypeCd==2 && this.accDtlsFrm.controls.intt_trf_type.value.toLowerCase()=='on maturity'){
          console.log(this.accDtlsFrm.controls.intt_trf_type.value.toLowerCase())
          
          console.log(this.accDtlsFrm.controls.intt_amt.value);
          console.log(this.accDtlsFrm.controls.prn_amt.value);
          console.log(this.td.curr_intt_recov.value);
          console.log(this.td.balance.value);
          console.log(this.matInt);
          console.log(this.forB);
          console.log(this.afMat);
          console.log(this.accNoEnteredForTransaction.intt_amt);
          
          toReturn.curr_prn_recov = Number(this.td.balance.value)==0?(+this.accNoEnteredForTransaction.intt_amt) + (+this.accNoEnteredForTransaction.prn_amt) + (this.matInt?this.matInt:0)
          :this.td.balance.value+(+this.accNoEnteredForTransaction.prn_amt)

          toReturn.curr_intt_recov = Number(this.td.balance.value)==0?(+this.accNoEnteredForTransaction.intt_amt) + (this.matInt?this.matInt:0)
          :this.td.balance.value//PARTHA
          toReturn.ovd_prn_recov= this.accNoEnteredForTransaction.prn_amt
          toReturn.amount=Number(this.td.balance.value)==0?(+this.accNoEnteredForTransaction.intt_amt) + (this.matInt?this.matInt:0):0
          toReturn.acc_cd = this.resbrnCD1[0].acc_cd; 
          debugger
        }
        
        debugger;
        if(accTypeCd==2 && (this.accDtlsFrm.controls.intt_trf_type.value.toLowerCase()=='yearly' || this.accDtlsFrm.controls.intt_trf_type.value.toLowerCase()=='half yearly' || this.accDtlsFrm.controls.intt_trf_type.value.toLowerCase()=='quarterly')){
           
          console.log(this.accDtlsFrm.controls.intt_trf_type.value.toLowerCase())
          
          debugger;
          console.log(this.accDtlsFrm.controls.intt_amt.value);
          console.log(this.accDtlsFrm.controls.prn_amt.value);
          console.log(this.td.curr_intt_recov.value);
          console.log(this.td.balance.value);
          console.log(this.matInt);
          console.log(this.forB);
          console.log(this.afMat);
          console.log(this.accNoEnteredForTransaction.intt_amt);
          
          // toReturn.curr_prn_recov = this.td.td_def_mat_amt.value+this.td.interest.value
          //PARTHA afMat1
          // toReturn.curr_prn_recov = this.td.amount.value
          toReturn.curr_prn_recov = Number(this.td.balance.value)==0?(+this.forB) + (+this.accDtlsFrm.controls.prn_amt.value) + (this.matInt?this.matInt:0)
          :this.td.balance.value+(+this.accDtlsFrm.controls.prn_amt.value)

          toReturn.curr_intt_recov = Number(this.td.balance.value)==0?(+this.forB) + (this.matInt?this.matInt:0)
          :this.td.balance.value//PARTHA
          toReturn.ovd_prn_recov= this.accDtlsFrm.controls.prn_amt.value
          toReturn.amount=Number(this.td.balance.value)==0?(+this.forB) + (this.matInt?this.matInt:0):0
debugger
        
        }
        if(accTypeCd===5){
          toReturn.amount=(this.td.trans_type_key.value=='D'&&this.afterMatRenewal)?this.td.curr_intt_recov.value+this.misSum:(this.td.trans_type_key.value=='D')?this.misSum:0
        }
        //to be change (this.sys.ardbCD=='26') && 
        if(accTypeCd === 4 &&  this.afMat==true){
          toReturn.curr_prn_recov =  this.td.amount.value ;
          toReturn.curr_intt_recov =  this.accDtlsFrm.controls.intt_amt.value;
        
        }
      }
      debugger;
      console.log(toReturn)
      debugger;
    } else {
      console.log(this.td.particulars.value)
      debugger;
      toReturn.trans_dt = this.td.trans_dt.value;
      toReturn.trans_cd = this.td.trans_cd.value;
      toReturn.acc_type_cd = this.td.acc_type_cd.value;
      toReturn.acc_num = this.td.acc_num.value;
      toReturn.trans_type = this.td.trans_type_key.value;
      toReturn.trans_mode = this.td.trans_mode.value;
      if (this.td.trans_mode.value && this.td.trans_mode.value.toLocaleLowerCase() == 'r' && (!this.afMat)){
        if (this.td.acc_type_cd.value != 5)
          toReturn.amount = this.tdDefTransFrm.controls.amount.value == this.accDtlsFrm.controls.mat_amt.value ? this.accDtlsFrm.controls.intt_amt.value : 0
        if (this.td.acc_type_cd.value == 5)
          toReturn.amount = 0
        //  debugger;
      }
      else if(this.td.trans_mode.value && this.td.trans_mode.value.toLocaleLowerCase() == 'r' && this.afMat){
        if (this.td.acc_type_cd.value != 5)
        toReturn.amount = (+this.tdDefTransFrm.controls.amount.value == (+this.accDtlsFrm.controls.mat_amt.value +(+this.matInt))) ? (+this.accDtlsFrm.controls.intt_amt.value)+(+this.matInt) : 0
      if (this.td.acc_type_cd.value == 5)
        toReturn.amount = 0
      }
      else
        toReturn.amount = this.td.amount.value;
      // debugger;
      toReturn.instrument_dt = this.td.instrument_dt.value;
      toReturn.instrument_num = this.td.instrument_num.value;
      toReturn.paid_to = this.td.paid_to.value;
      toReturn.token_num = this.td.token_num.value;
      toReturn.approval_status = this.td.approval_status.value;
      toReturn.approved_by = this.td.approved_by.value;
      toReturn.approved_dt = this.td.approved_dt.value;
      console.log(this.td.particulars.value)
      // if(this.td.trans_mode.value=='C'){  //marker

      // if(this.td.trf_type.value=='T'){
      //   toReturn.particulars='To Closing'
      // }

      //      }
      toReturn.particulars = this.td.particulars.value;
      // toReturn.particulars = this.td.particulars.value; //marker
      // //debugger;
      console.log(this.td.acc_cd.value)
      // //debugger;
      console.log(toReturn.particulars)
      toReturn.tr_acc_type_cd = this.td.tr_acc_type_cd.value;
      toReturn.tr_acc_num = this.td.tr_acc_num.value;
      toReturn.voucher_dt = this.td.voucher_dt.value;
      toReturn.voucher_id = this.td.voucher_id.value;
      toReturn.trf_type = this.td.trf_type.value;
      toReturn.tr_acc_cd = this.td.tr_acc_cd.value;
      for (let i = 0; i < AccounTransactionsComponent.constitutionList.length; i++) {
        if (AccounTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd == 5 && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw') {
          if (this.td.trans_mode.value.toLocaleLowerCase() == 'r')
            toReturn.acc_cd = AccounTransactionsComponent.constitutionList[i].intt_acc_cd
          else if (this.td.trans_mode.value.toLocaleLowerCase() == 'c')
            toReturn.acc_cd = AccounTransactionsComponent.constitutionList[i].acc_cd
          console.log(toReturn.acc_cd)
          // debugger;
        }
      }
      for (let i = 0; i < AccounTransactionsComponent.constitutionList.length; i++) {
        if (AccounTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd == 5 && this.td.trans_type.value.toLocaleLowerCase() == 'deposit') {
          toReturn.acc_cd = AccounTransactionsComponent.constitutionList[i].acc_cd
          console.log(toReturn.acc_cd)
          // debugger;
        }
      }
      if (this.td.tr_acc_type_cd.value != 5 && this.td.trans_type.value.toLocaleLowerCase() != 'withdraw')
        toReturn.acc_cd = this.resbrnCD1[0].acc_cd; //marker
      debugger;
      if (this.td.acc_type_cd.value == 6 && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw')
        toReturn.acc_cd = this.resbrnCD1[0].acc_cd; //marker
        if (this.td.acc_type_cd.value == 1 && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw')
        toReturn.acc_cd = this.resbrnCD1[0].acc_cd; //marker
        if (this.td.acc_type_cd.value == 8 && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw')
        toReturn.acc_cd = this.resbrnCD1[0].acc_cd; //marker
        if (this.td.acc_type_cd.value == 11 && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw')
        {toReturn.acc_cd = this.resbrnCD1[0].acc_cd; 
          
          toReturn.particulars=this.tdDefTransFrm.controls.trf_type.value=='T'?"To Transfer":"To Cash"} //marker
      debugger
      console.log(toReturn.acc_cd + " " + this.resbrnCD1[0].acc_cd + " " + this.td.tr_acc_type_cd.value + " " + this.td.trans_type.value.toLocaleLowerCase())
      debugger;
      toReturn.share_amt = this.td.share_amt.value;
      toReturn.sum_assured = this.td.sum_assured.value;
      toReturn.paid_amt = this.td.paid_amt.value;
      // toReturn.curr_prn_recov = this.td.acc_type_cd.value!=5? this.td.curr_prn_recov.value : this.td.amount.value;
      toReturn.curr_prn_recov = this.td.acc_type_cd.value != 5 ? this.td.curr_prn_recov.value : this.td.amount.value; //marker
      toReturn.ovd_prn_recov = this.td.acc_type_cd.value != 5 ? this.td.ovd_prn_recov.value:this.accNoEnteredForTransaction.prn_amt;
      if (this.td.trans_mode.value.toLocaleLowerCase() == 'r' && (!this.afMat)){
       debugger 
       toReturn.curr_intt_recov = this.td.acc_type_cd.value != 5 ? this.td.curr_intt_recov.value:this.misSum;
        debugger
      }
      else if(this.td.trans_mode.value.toLocaleLowerCase() == 'r' && this.afMat){
        toReturn.curr_intt_recov = this.td.acc_type_cd.value != 5 ? ((+this.accDtlsFrm.controls.intt_amt.value)+(+this.matInt)):this.misSum;//RED VOUCHER
        debugger
        console.log(this.afMat);
      }
      else{
        debugger
        toReturn.curr_intt_recov = this.td.curr_intt_recov.value;
          }
      // toReturn.curr_intt_recov = this.td.acc_type_cd.value != 5 ? this.td.curr_intt_recov.value:this.misSum;
      toReturn.ovd_intt_recov = this.td.ovd_intt_recov.value;
      // toReturn.remarks = this.td.remarks.value;
      toReturn.remarks = this.td.remarks.value;
      // console.log()
      toReturn.crop_cd = this.td.crop_cd.value;
      toReturn.activity_cd = this.td.activity_cd.value;
      toReturn.curr_intt_rate = this.td.curr_intt_rate.value;
      toReturn.ovd_intt_rate = this.td.ovd_intt_rate.value;
      toReturn.instl_no = this.td.instl_no.value;
      toReturn.instl_start_dt = this.td.instl_start_dt.value;
      toReturn.periodicity = this.td.periodicity.value;
      toReturn.disb_id = this.td.disb_id.value;
      toReturn.comp_unit_no = this.td.comp_unit_no.value;
      toReturn.ongoing_unit_no = this.td.ongoing_unit_no.value;
      toReturn.mis_advance_recov = this.td.mis_advance_recov.value;
      toReturn.audit_fees_recov = this.td.audit_fees_recov.value;
      toReturn.sector_cd = this.td.sector_cd.value;
      toReturn.spl_prog_cd = this.td.spl_prog_cd.value;
      toReturn.borrower_cr_cd = this.td.borrower_cr_cd.value;
      toReturn.intt_till_dt = this.td.intt_till_dt.value;
      toReturn.acc_name = this.td.acc_name.value;
      toReturn.brn_cd = this.td.brn_cd.value;
      toReturn.trf_type_desc = this.td.trf_type_desc.value;
      if (this.td.trans_mode.value && this.td.trans_mode.value.toLocaleLowerCase() === 'i') {
        for (let i = 0; i < AccounTransactionsComponent.constitutionList.length; i++) {
          if (AccounTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd == accTypeCd) {
            toReturn.acc_cd = AccounTransactionsComponent.constitutionList[i].intt_acc_cd
            console.log(toReturn.acc_cd)
          }
        }
      } //marker
      //  else if(!this.td.trans_mode.value && this.td.acc_type_cd.value==6){
      //   for(let i=0;i<AccounTransactionsComponent.constitutionList.length;i++){
      //     if(AccounTransactionsComponent.constitutionList[i].constitution_cd==this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd==accTypeCd)
      //    { toReturn.acc_cd=AccounTransactionsComponent.constitutionList[i].acc_cd
      //     console.log(toReturn.acc_cd)}
      //    } //marker
      //  }
      console.log(toReturn.trans_type);
      this.trans = toReturn.trans_type

      // //debugger
      // toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd //marker was kept outside in marker1 not working for update
    }
    // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment')
    ; //marker1
    if ((this.td.tr_acc_type_cd.value == 2 || this.td.tr_acc_type_cd.value == 4) && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw'){
      toReturn.acc_cd = this.resbrnCD1[0].acc_cd;
    }
    toReturn.disb_id = 1;
    toReturn.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    toReturn.home_brn_cd = this.resBrnCd != this.sys.BranchCode ? this.resBrnCd : this.sys.BranchCode;
    toReturn.intra_branch_trn = this.resBrnCd != this.sys.BranchCode ? 'Y' : 'N'
    ////////////debugger;
    // console.log({"ss":toReturn.particulars,"sss":this.td.particulars.value.split(' ')[0],"replace":this.td.particulars.value})
    console.log(toReturn)
    return toReturn;
    // return;
  }

  mappTddefTransAndTransFrFromFrm(): td_def_trans_trf {
    //debugger;
    console.log(this.f.oprn_cd.value + " " + this.f.trans_type + " " + this.remarks)
    // debugger;
    // if(!this.editDeleteMode){
    // selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    // selectedOperation=selectedOperation.oprn_cd
    // }
    // else{
    // const selectedOperation =this.f.trans_type;

    // }
    let k = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0]
    const selectedOperation = this.editDeleteMode ? this.remarks : k.oprn_desc;
    const toReturn = new td_def_trans_trf();
    const accTypeCd = +this.f.acc_type_cd.value;
    // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
    toReturn.trans_dt = this.sys.CurrentDate;
    toReturn.acc_type_cd = this.td.acc_type_cd.value;
    // toReturn.home_brn_cd=toReturn.acc_num.substring(0,3);
    // toReturn.intra_branch_trn=toReturn.acc_num.substring(0,3)!=this.sys.BranchCode?'Y':'N'
    // console.log(toReturn.home_brn_cd+" "+toReturn.intra_branch_trn)
    toReturn.acc_num = this.td.acc_num.value;
    //////////debugger;
    // toReturn.trans_mode = this.td.trans_mode.value;
    toReturn.paid_to = this.td.paid_to.value;
    toReturn.token_num = this.td.token_num.value;
    toReturn.trf_type = this.td.trf_type.value;
    toReturn.trans_type = this.td.trans_type_key.value=='D'?'W':'D';
    // toReturn.home_brn_cd=this.resBrnCd!=this.sys.BranchCode? this.resBrnCd:this.sys.BranchCode;
    // toReturn.intra_branch_trn=this.resBrnCd!=this.sys.BranchCode? 'Y':'N'
    /*Logic to populate transation type of td_def_trans_Trf */
    if (toReturn.acc_type_cd == 1 || toReturn.acc_type_cd == 8) {
      if (selectedOperation.toLocaleLowerCase() === 'close') {
        toReturn.particulars = this.td.particulars.value;
        console.log(toReturn.particulars)
        // debugger;
      }

    }
    // switch (selectedOperation.oprn_desc.toLocaleLowerCase()) {
    // switch (selectedOperation.toLocaleLowerCase()) {
    //   case 'close':
    //   case 'withdraw':
    //     toReturn.trans_type = 'D';
    //     break;
    //   case 'renewal':
    //   case 'deposit':
    //     toReturn.trans_type = 'W';
    //     break;
    // }

    if (selectedOperation.toLocaleLowerCase() === 'close'
      // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close'
      && (accTypeCd === 2
        || accTypeCd === 3
        || accTypeCd === 4
        || accTypeCd === 5
        || accTypeCd === 6)) {
      toReturn.amount = this.accNoEnteredForTransaction.prn_amt;
      toReturn.curr_intt_recov = this.accNoEnteredForTransaction.intt_amt;
    } else {
      // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
      if (selectedOperation.toLocaleLowerCase() === 'renewal') {
        debugger
        console.log(toReturn.amount + " " + toReturn.curr_intt_recov)
        debugger
        toReturn.amount = +this.td.interest.value;
        if (toReturn.acc_type_cd == 4 && this.editDeleteMode && this.td.trf_type.value == 'T') {
          toReturn.trans_type = 'D'  //marker (while renewal send deposit trans type)
        } else if (toReturn.acc_type_cd == 5 && this.editDeleteMode && this.td.trf_type.value == 'T' && this.td.trans_type.value.toLocaleLowerCase() == 'withdraw') {
          toReturn.trans_type = 'D'  //marker (while renewal send deposit trans type)

        }
      } else {
        toReturn.amount = +this.td.amount.value;
      }
    }
    toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
    toReturn.instrument_dt = this.td.instrument_dt.value === '' ? null : this.td.instrument_dt.value;
    if (this.td.particulars.value === null ||
      this.td.particulars.value === '') {
      if (selectedOperation.toLocaleLowerCase() !== 'close') {
        // if (selectedOperation.oprn_desc.toLocaleLowerCase() !== 'close') {
        if (accTypeCd === 2
          || accTypeCd === 3
          || accTypeCd === 4
          || accTypeCd === 5
          || accTypeCd === 11
          || accTypeCd === 10
          ) {
          toReturn.particulars = this.td.particulars.value;
        } else {
          // if (this.td.trf_type.value === 'T') {
          //   toReturn.particulars = 'BY TRANSFER TO ' + this.td.particulars.value + ':' + this.td.acc_num.value;
          // } else if (this.td.trf_type.value === 'C') {
          //   toReturn.particulars = 'BY CASH';
          // }
          if (this.td.trf_type.value === 'C') {
            if (selectedOperation.toLocaleLowerCase() === 'withdraw') {
              // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              toReturn.particulars = 'TO CASH ';
              // } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
            } else if (selectedOperation.toLocaleLowerCase() === 'deposit') {
              toReturn.particulars = 'BY CASH ';
            }

          } else {
            // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
            if (selectedOperation.toLocaleLowerCase() === 'withdraw') {
              // console.log()
              console.log('3102')
              toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
              // } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
            } else if (selectedOperation.toLocaleLowerCase() === 'deposit') {
              toReturn.particulars = 'BY TRANSFER FROM :' + this.td.acc_num.value;
            }
          }
        }
      } else {
        //debugger;
        // if (this.td.trf_type.value === 'T') {
        //   toReturn.particulars = 'BY TRANSFER TO ' + this.td.particulars.value + ':' + this.td.acc_num.value;
        // } else if (this.td.trf_type.value === 'C') {
        //   toReturn.particulars = 'BY CASH';
        // }
        if (this.td.trf_type.value === 'C') {
          // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
          if (selectedOperation.toLocaleLowerCase() === 'withdraw') {
            //debugger;
            toReturn.particulars = 'TO CASH ';
            // } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
          } else if (selectedOperation.toLocaleLowerCase() === 'deposit') {
            toReturn.particulars = 'BY CASH ';
          }

        } else {
          // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
          if (selectedOperation.toLocaleLowerCase() === 'withdraw') {
            console.log(this.td.trans_mode.value)
            console.log('3131')
            toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
            // } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
          } else if (selectedOperation.toLocaleLowerCase() === 'deposit') {
            toReturn.particulars = 'BY TRANSFER FROM :' + this.td.acc_num.value;
          }
        }
      }
    } else {
      // console.log("2706")
      //debugger;
      console.log(toReturn.particulars + " " + selectedOperation.toLocaleLowerCase() + " " + toReturn.trf_type)
      //debugger;
      //  if(selectedOperation.toLocaleLowerCase()=='close' && accTypeCd === 7){
      //   toReturn.particulars='To Closing'
      //  }
      //  else
      //     { console.log('3148')
      if (!this.editDeleteMode && this.td.trans_mode.value != 'C')
        toReturn.particulars = this.td.particulars.value.split(' ')[0] === "BY" ? this.td.particulars.value.replace("BY", "TO") : this.td.particulars.value.replace("TO", "BY");
    }
    // toReturn.particulars = this.td.particulars.value.split(' ')[1]==="BY"?  this.td.particulars.value.replace("BY","TO"):this.td.particulars.value.replace("TO","BY");
    console.log(toReturn.particulars + " " + selectedOperation.toLocaleLowerCase() + " " + toReturn.trf_type)

    //  }

    if (selectedOperation.toLocaleLowerCase() === 'renewal' && this.td.trf_type.value === '') {
      toReturn.trans_type = 'T';
    }
    toReturn.approval_status = 'U';
    toReturn.brn_cd = this.sys.BranchCode;

    if (this.td.trf_type.value === 'T') {
      toReturn.tr_acc_cd = 10000;
    } else if (this.td.trf_type.value === 'C') {
      toReturn.tr_acc_cd = 21101;
    }
    // if ((+this.f.acc_type_cd.value) === 2) {
    //   toReturn.acc_cd = 14301;
    // }
    // if ((+this.f.acc_type_cd.value) === 6) {
    //   toReturn.acc_cd = 14302;
    // }
    if (selectedOperation.toLocaleLowerCase() === 'renewal') {
      debugger;

      toReturn.curr_prn_recov = ((+this.td.amount.value) + (+this.td.interest.value));
      toReturn.ovd_prn_recov = this.accNoEnteredForTransaction.prn_amt;
      toReturn.curr_intt_recov = this.accNoEnteredForTransaction.intt_amt;
      toReturn.ovd_intt_recov = 0;
    }
    if (selectedOperation.toLocaleLowerCase() === 'interest payment') {
      const desc = accTypeCd == 5 ? ' MIS ' : ' Savings ' //marker
      toReturn.particulars = toReturn.particulars + desc + "A/C: " + this.td.acc_num.value //marker
      // toReturn.acc_cd=AccounTransactionsComponent.constitutionList.filter((x)=>{
      //   x.acc_type_cd==accTypeCd
      // })[0].intt_acc_cd //marker
      for (let i = 0; i < AccounTransactionsComponent.constitutionList.length; i++) {
        if (AccounTransactionsComponent.constitutionList[i].constitution_cd == this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd == accTypeCd) {
          toReturn.acc_cd = AccounTransactionsComponent.constitutionList[i].intt_acc_cd
          console.log(toReturn.acc_cd)
        }
      }
      // if(selectedOperation.oprn_desc.toLocaleLowerCase() === 'rd installment')
    }
    // console.log(toReturn.acc_num)
    // toReturn.home_brn_cd=toReturn.acc_num.substring(0,3)
    // toReturn.intra_branch_trn=toReturn.acc_num.substring(0,3)!=this.sys.BranchCode?'Y':'N'
    else {
      toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;

      //to be removed in case the other acc type cd gets interchanged
      // for(let i=0;i<AccounTransactionsComponent.constitutionList.length;i++){
      //   if(AccounTransactionsComponent.constitutionList[i].constitution_cd==this.constCd && AccounTransactionsComponent.constitutionList[i].acc_type_cd==6)
      //  { toReturn.acc_cd=AccounTransactionsComponent.constitutionList[i].intt_acc_cd
      //   console.log(toReturn.acc_cd)
      // }
      // }
    } //marker
    toReturn.disb_id = 1;
    toReturn.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    // console.log( {"toReturn.particulars":toReturn.particulars," this.td.particulars.value": this.td.particulars.value})
    console.log(toReturn)
    return toReturn;
  }

  mapRenewData(): tm_deposit {

    const toReturn = new tm_deposit();
    // Year=0;Month=0;Day=313
    const depPrd = 'Year=' + (this.td.dep_period_y.value === '' ? '0' : this.td.dep_period_y.value) +
      ';Month=' + (this.td.dep_period_m.value === '' ? '0' : this.td.dep_period_m.value) +
      ';Day=' + (this.td.dep_period_d.value === '' ? '0' : this.td.dep_period_d.value);
    if (this.editDeleteMode) {
      toReturn.trans_cd = this.td.trans_cd.value
    }
    toReturn.brn_cd = this.accNoEnteredForTransaction.brn_cd;
    toReturn.acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
    toReturn.acc_num = this.accNoEnteredForTransaction.acc_num;
    toReturn.renew_id = this.accNoEnteredForTransaction.renew_id + 1;
    toReturn.cust_cd = this.accNoEnteredForTransaction.cust_cd;
    toReturn.intt_trf_type = this.td.intt_trf_type.value;
    toReturn.constitution_cd = (+this.td.constitution_cd.value);
    toReturn.oprn_instr_cd = this.accNoEnteredForTransaction.oprn_instr_cd;
    toReturn.opening_dt = Utils.convertStringToDt(this.td.opening_dt.value);
    // toReturn.prn_amt = (+this.td.amount.value);
    toReturn.prn_amt = (this.td.acc_type_cd.value==5&& this.afterMatRenewal)?((+this.td.amount.value) + (+this.td.curr_intt_recov.value)):(+this.td.amount.value); //PARTHA
    toReturn.intt_amt = (+this.td.interest.value);
    toReturn.dep_period = depPrd;
    toReturn.instl_amt = this.accNoEnteredForTransaction.instl_amt;
    toReturn.instl_no = this.accNoEnteredForTransaction.instl_no;
    toReturn.mat_dt = Utils.convertStringToDt(this.td.mat_dt.value);
    toReturn.intt_rt = (+this.td.intt_rate.value);
    toReturn.tds_applicable = this.accNoEnteredForTransaction.tds_applicable;
    toReturn.last_intt_calc_dt = this.accNoEnteredForTransaction.last_intt_calc_dt;
    // toReturn.acc_close_dt = this.accNoEnteredForTransaction.acc_close_dt;
    // toReturn.closing_prn_amt = this.accNoEnteredForTransaction.closing_prn_amt;
    // toReturn.closing_intt_amt = this.accNoEnteredForTransaction.closing_intt_amt;
    // toReturn.penal_amt = this.accNoEnteredForTransaction.penal_amt;
    // toReturn.ext_instl_tot = this.accNoEnteredForTransaction.ext_instl_tot;
    // toReturn.mat_status = this.accNoEnteredForTransaction.mat_status;
    // toReturn.acc_status = this.accNoEnteredForTransaction.acc_status;
    // toReturn.curr_bal = this.accNoEnteredForTransaction.curr_bal;
    // toReturn.clr_bal = this.accNoEnteredForTransaction.clr_bal;
    toReturn.standing_instr_flag = this.accNoEnteredForTransaction.standing_instr_flag;
    toReturn.cheque_facility_flag = this.accNoEnteredForTransaction.cheque_facility_flag;
    toReturn.approval_status = 'A';
    // toReturn.approval_status = this.accNoEnteredForTransaction.approval_status;
    // toReturn.approved_by = this.accNoEnteredForTransaction.approved_by;
    toReturn.approved_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    // toReturn.approved_dt = this.accNoEnteredForTransaction.approved_dt;
    toReturn.approved_dt = this.sys.CurrentDate;
    toReturn.user_acc_num = this.accNoEnteredForTransaction.user_acc_num;
    // toReturn.lock_mode = this.accNoEnteredForTransaction.lock_mode;
    // toReturn.loan_id = this.accNoEnteredForTransaction.loan_id;
     toReturn.cert_no = this.td.cert_no.value;
    // toReturn.bonus_amt = this.accNoEnteredForTransaction.bonus_amt;
    // toReturn.penal_intt_rt = this.accNoEnteredForTransaction.penal_intt_rt;
    // toReturn.bonus_intt_rt = this.accNoEnteredForTransaction.bonus_intt_rt;
    // toReturn.transfer_flag = this.accNoEnteredForTransaction.transfer_flag;
    // toReturn.transfer_dt = this.accNoEnteredForTransaction.transfer_dt;
    toReturn.agent_cd = this.accNoEnteredForTransaction.agent_cd;
    toReturn.cust_name = this.accNoEnteredForTransaction.cust_name;
    toReturn.cust_type = this.accNoEnteredForTransaction.cust_type;
    toReturn.sex = this.accNoEnteredForTransaction.sex;
    toReturn.phone = this.accNoEnteredForTransaction.phone;
    toReturn.occupation = this.accNoEnteredForTransaction.occupation;
    toReturn.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    toReturn.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    toReturn.constitution_desc = this.accNoEnteredForTransaction.constitution_desc;
    toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;


    return toReturn;
  }

  // mapDenominationToTmdenominationtrans(): void {

  // }
  CloseInttChange(){
    this.td.td_def_mat_amt.setValue(+(+(+this.td.amount.value)+(+this.td.curr_intt_recov.value)+(+this.td.curr_prn_recov.value))-(+this.td.ovd_intt_recov.value))
  console.log();
  
  }
  onResetClick(): void {
    // this.showMsg = null;
    this.showNW=true;
    this.showInterestDtls=false
    this.showRdInstalment=false
    // this.HandleMessage(false);
    this.suggestedCustomerCr = null
    this.disabledTrfOnNull = true
    this.suggestedCustomer = [];
    this.showtransdetails = false;
    this.resetClicked = true;
    this.disabledOnNull = true
    this.shownoresult = false;
    this.custUCIC=0
    this.trftype = ''
    // console.log(this.f.acct_num.value.length)
    // this.f.acct_num.value.length=0
    this.editDeleteMode = false;
    this.showBalance = false
    this.accTransFrm.reset();
    this.tdDefTransFrm.reset(); this.showTransactionDtl = false;
    // this.getOperationMaster();
    this.f.oprn_cd.disable();
    this.f.acct_num.disable();
    this.accNoEnteredForTransaction = undefined;
    // this.msg.sendCommonTmDepositAll(null);
    this.tm_denominationList = [];
    this.td_deftranstrfList = [];
    this.mat_val = 0
    this.showCloseInterest = false;
    this.TrfTotAmt = 0;  //marker
    this.closeInt=0;
    this.matInt=0;
    this.aftmatInt=0;
    this.effInt=0;
    this.matureIntForMis=0;
    this.accNoEnteredForTransaction.intt_amt=0;
    this.preCloseMIS=null;
    this.td.balance.setValue(0)
  }

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
    this.accountTypeList2 = [];
    this.accountTypeList3 = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {

        this.accountTypeList2 = res;
        this.accountTypeList3 = res;
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
       
       
      });
  }
  onChangeTrf(i: any) {
    this.suggestedCustomerCr = null;
    if (this.td_deftranstrfList[i].cust_name.length > 2) {
      this.disabledTrfOnNull = false;
    }
    else {
      this.disabledTrfOnNull = true
    }
  }
  public suggestCustomerCr(i: number): void {
    //////////////debugger;
    this.isLoading = true;
    if (this.td_deftranstrfList[i].cust_name.length > 2) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.td_deftranstrfList[i].cust_name.toLowerCase();
      prm.ad_acc_type_cd = +this.td_deftranstrfList[i].cust_acc_type;
      console.log(prm);
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          console.log(res)
          this.isLoading = false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomerCr = res;
            this.indxsuggestedCustomerCr = i;
          } else {
            this.suggestedCustomerCr = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.isLoading = false;
      this.suggestedCustomerCr = null;
    }
  }
  setCustDtlsCr(acc_num: string, cust_name: string, indx: number, c: any) {
    this.suggestedCustomerCr = null;
    // console.log(this.suggestedCustomerCr.length)
    console.log(this.selectedCust)
    this.td_deftranstrfList[indx].cust_acc_number = acc_num;
      this.td_deftranstrfList[indx].cust_name = cust_name;
      this.setDebitAccDtls(this.td_deftranstrfList[indx]);
    // if (this.selectedCust != acc_num) {PMAITY
    //   this.td_deftranstrfList[indx].cust_acc_number = acc_num;
    //   this.td_deftranstrfList[indx].cust_name = cust_name;
    //   this.setDebitAccDtls(this.td_deftranstrfList[indx]);
    // }
    // else {
    //   this.HandleMessage(true, MessageType.Error, "You cannot choose the same account!");
    // }
  }

  setDebitAccDtls(tdDefTransTrnsfr: td_def_trans_trf) {
    //////////////debugger;
    console.log(tdDefTransTrnsfr)
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
    temp_deposit.ardb_cd = this.sys.ardbCD;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', temp_deposit).subscribe(
      res => {
        this.isLoading = false;
        console.log(res);
        console.log(this.tdDefTransFrm.controls.amount.value)
        // debugger;

        let foundOneUnclosed = false;
        if (undefined !== res && null !== res && res.length > 0) {
          temp_deposit_list = res;
          temp_deposit_list.forEach(element => {
            if (element.acc_status === null || element.acc_status.toUpperCase() !== 'C') {
              foundOneUnclosed = true;
              tdDefTransTrnsfr.cust_name = element.cust_name;
              tdDefTransTrnsfr.acc_cd = element.acc_cd;
              tdDefTransTrnsfr.clr_bal = element.clr_bal;
              console.log(tdDefTransTrnsfr.particulars)
              // debugger;
            }
          });
          if (temp_deposit_list.length === 0) {
            this.HandleMessage(true, MessageType.Error, 'Invalid Account Number in Transfer Details');
            tdDefTransTrnsfr.cust_acc_number = null;
            return;
          }
          if (!foundOneUnclosed) {
            this.HandleMessage(true, MessageType.Error,
              `Transfer details account number ${this.f.acct_num.value} is closed.`);
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
    this.tddefAccTypCd = tdDefTransTrnsfr.acc_type_cd
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
          this.HandleMessage(true, MessageType.Error, 'Invalid Account Type');
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
//Gl portion
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
                this.acc_master= this.acc_master1.filter(x => x.acc_cd.toString().includes(tdDefTransTrnsfr.gl_acc_code) || x.acc_name.toLowerCase().includes(tdDefTransTrnsfr.gl_acc_code.toLowerCase())  );
              // }
              // temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString().includes(tdDefTransTrnsfr.gl_acc_code) || x.acc_name.toString().includes(tdDefTransTrnsfr.gl_acc_code)  );
              
              // if (temp_acc_master === undefined || temp_acc_master === null) {
              //   tdDefTransTrnsfr.gl_acc_desc = null;
              //   this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
              //   return;
              // }
              // else {
                console.log( this.acc_master.filter(x => x.acc_cd.toString().includes(tdDefTransTrnsfr.gl_acc_code) || x.acc_name.toString().includes(tdDefTransTrnsfr.gl_acc_code)))
                tdDefTransTrnsfr.gl_acc_desc = this.acc_master.filter(x => x.acc_cd.toString().includes(tdDefTransTrnsfr.gl_acc_code) || x.acc_name.toString().includes(tdDefTransTrnsfr.gl_acc_code))[0].acc_name;
                // tdDefTransTrnsfr.gl_acc_desc = temp_acc_master.acc_name;
                tdDefTransTrnsfr.trans_type = tfrType;
                if(this.editDeleteMode && this.acc_master.length==1){//PARTHA
                  this.hidegl=true;
                }
                
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
    
    if (this.selectedCust != acc_cd) {
      this.td_deftranstrfList[indx].gl_acc_code = acc_cd;
      this.td_deftranstrfList[indx].gl_acc_desc = acc_name;
      // this.setDebitAccDtls(this.td_deftranstrfList[indx]);
    }
    
  }

  checkDebitBalance(tdDefTransTrnsfr: td_def_trans_trf) {
   debugger
    console.log(tdDefTransTrnsfr.amount)
    this.HandleMessage(false);
    console.log(this.td.trans_type_key)

    if (tdDefTransTrnsfr.amount === undefined
      || tdDefTransTrnsfr.amount === null) {
      return;
    }

    if ((+tdDefTransTrnsfr.amount) < 0) {debugger
      this.HandleMessage(true, MessageType.Error, 'Negative amount can not be entered.');
      tdDefTransTrnsfr.amount = 0;
      return;
    }

    if ((tdDefTransTrnsfr.cust_acc_number === undefined
      || tdDefTransTrnsfr.cust_acc_number === null
      || tdDefTransTrnsfr.cust_acc_number === '')
      && (tdDefTransTrnsfr.gl_acc_code === undefined
        || tdDefTransTrnsfr.gl_acc_code === null
        || tdDefTransTrnsfr.gl_acc_code === '')) {debugger
      this.HandleMessage(true, MessageType.Error, 'Please enter Account Number or GL Code');
      tdDefTransTrnsfr.amount = 0;
      return;
    }


    if (tdDefTransTrnsfr.clr_bal === undefined
      || tdDefTransTrnsfr.clr_bal === null) {
      tdDefTransTrnsfr.clr_bal = 0;
    }
    
    console.log(tdDefTransTrnsfr,tdDefTransTrnsfr.gl_acc_code);
    
    if(tdDefTransTrnsfr.gl_acc_code === null || tdDefTransTrnsfr.gl_acc_code === ''|| tdDefTransTrnsfr.gl_acc_code === undefined)
  {
      if ((+tdDefTransTrnsfr.clr_bal < (+tdDefTransTrnsfr.amount) && this.f.oprn_cd.value == 1)) {
      
      this.HandleMessage(true, MessageType.Error, 'Insufficient Balance');
      tdDefTransTrnsfr.amount = 0;
     
      return;
    }
    else {
      this.sumTransfer();
      if(this.td.trans_mode.value == 'R' && (this.f.acc_type_cd.value == 4 || this.f.acc_type_cd.value == 5) && this.TrfTotAmt!=Number(this.td.balance.value)){
        debugger
        this.HandleMessage(true, MessageType.Error, 'You should be transfer your Balance amount only');
        tdDefTransTrnsfr.amount=0;
        this.TrfTotAmt=0;
        this.errorFlag=true;
        return;
      } 
      else if(this.td.trans_mode.value == 'C' && (this.f.acc_type_cd.value ==7) && this.TrfTotAmt!=Number(this.td.amount.value)){//PARTHA
        debugger
        this.HandleMessage(true, MessageType.Error, 'You should be transfer your Balance amount only');
        tdDefTransTrnsfr.amount=0;
        this.errorFlag=true;
        this.TrfTotAmt=0
        return;
      }
      else if(this.td.trans_mode.value == 'C' && (this.f.acc_type_cd.value !=1 && this.f.acc_type_cd.value !=8 && this.f.acc_type_cd.value !=7) && this.TrfTotAmt!=Number(this.td.td_def_mat_amt.value)){//PARTHA
        debugger
        this.HandleMessage(true, MessageType.Error, 'You should be transfer your Mature amount only');
        tdDefTransTrnsfr.amount=0;
        this.errorFlag=true;
        this.TrfTotAmt=0
        return;
      }
      else if(this.td.trans_mode.value == 'C' && (this.sys.ardbCD=='26') && (this.f.acc_type_cd.value == 1 ||this.f.acc_type_cd.value == 8) && this.TrfTotAmt!=Number(this.td.td_def_mat_amt.value)){//PARTHA
        debugger
        this.HandleMessage(true, MessageType.Error, 'You should be transfer your Mature amount only');
        tdDefTransTrnsfr.amount=0;
        this.errorFlag=true;
        this.TrfTotAmt=0
        return;
      }
      else if(this.td.trans_mode.value == 'W' && this.f.acc_type_cd.value ==9 && this.TrfTotAmt!=Number(this.td.amount.value)){//PARTHA
        debugger
        this.HandleMessage(true, MessageType.Error, 'You should be withdrawal Transaction amount only');
        tdDefTransTrnsfr.amount=0;
        this.errorFlag=true;
        this.TrfTotAmt=0
        return;
      }
      else if(this.td.trans_mode.value == 'I' && (this.f.acc_type_cd.value ==2 ||this.f.acc_type_cd.value ==5) && this.TrfTotAmt!=Number(this.td.amount.value)){//PARTHA
        debugger
        this.HandleMessage(true, MessageType.Error, 'You should be Transaction Interest amount only');
        tdDefTransTrnsfr.amount=0;
        this.errorFlag=true;
        this.TrfTotAmt=0
        return;
      }
      else if(this.td.trans_mode.value == 'W' && (this.f.acc_type_cd.value ==1 ||this.f.acc_type_cd.value ==8) && this.TrfTotAmt!=Number(this.td.amount.value)){//PARTHA
        debugger
        this.HandleMessage(true, MessageType.Error, 'You should be Transaction Withdrawal amount only');
        tdDefTransTrnsfr.amount=0;
        this.errorFlag=true;
        this.TrfTotAmt=0
        return;
      }
      else if(this.td.trans_type.value == 'Deposit' && (this.f.acc_type_cd.value ==1 ||this.f.acc_type_cd.value ==8) && this.TrfTotAmt!=Number(this.td.amount.value)){//PARTHA
        debugger
        this.HandleMessage(true, MessageType.Error, 'You should be Transaction Deposit amount only');
        tdDefTransTrnsfr.amount=0;
        this.errorFlag=true;
        this.TrfTotAmt=0
        return;
      }
      else if(this.td.trans_mode.value == 'C' && (this.f.acc_type_cd.value ==1 ||this.f.acc_type_cd.value ==8) && this.TrfTotAmt!=Number(this.td.amount.value)){//PARTHA
        debugger
        this.HandleMessage(true, MessageType.Error, 'You should be Transaction Withdrawal amount only');
        tdDefTransTrnsfr.amount=0;
        this.errorFlag=true;
        this.TrfTotAmt=0
        return;
      }
      else{
        this.errorFlag=false;
      }
      
    }
  }
  else {
    this.sumTransfer();
    debugger
  console.log(tdDefTransTrnsfr.amount,Number(this.td.balance.value),this.td.trans_mode.value);
  if(this.td.trans_mode.value == 'R' &&(this.f.acc_type_cd.value == 4 || this.f.acc_type_cd.value == 5) && this.TrfTotAmt!=Number(this.td.balance.value)){
    debugger
    this.HandleMessage(true, MessageType.Error, 'You should be transfer your Balance amount only');
    tdDefTransTrnsfr.amount=0;
    this.TrfTotAmt=0;
    this.errorFlag=true;
    return;
  } 
  
  else if(this.td.trans_mode.value == 'C' && (this.f.acc_type_cd.value !=1 && this.f.acc_type_cd.value !=8 && this.f.acc_type_cd.value !=7)  && this.TrfTotAmt!=Number(this.td.td_def_mat_amt.value)){//PARTHA
    debugger
    this.HandleMessage(true, MessageType.Error, 'You should be transfer your Mature amount only');
    this.errorFlag=true;
    tdDefTransTrnsfr.amount=0;
    this.TrfTotAmt=0
    return;
  }
  else if(this.td.trans_mode.value == 'I' && (this.f.acc_type_cd.value ==2 ||this.f.acc_type_cd.value ==5) && this.TrfTotAmt!=Number(this.td.amount.value)){//PARTHA
    debugger
    this.HandleMessage(true, MessageType.Error, 'You should be Transaction Interest amount only');
    this.errorFlag=true;
    tdDefTransTrnsfr.amount=0;
    this.TrfTotAmt=0
    return;
  }
  else if(this.td.trans_mode.value == 'W' && (this.f.acc_type_cd.value ==1 ||this.f.acc_type_cd.value ==8) && this.TrfTotAmt!=Number(this.td.amount.value)){//PARTHA
    debugger
    this.HandleMessage(true, MessageType.Error, 'You should be Transaction Withdrawal amount only');
    this.errorFlag=true;
    tdDefTransTrnsfr.amount=0;
    this.errorFlag=true;
    this.TrfTotAmt=0
    return;
  }
  else if(this.td.trans_type.value == 'Deposit' && (this.f.acc_type_cd.value ==1 ||this.f.acc_type_cd.value ==8) && this.TrfTotAmt!=Number(this.td.amount.value)){//PARTHA
    debugger
    this.HandleMessage(true, MessageType.Error, 'You should be Transaction Deposit amount only');
    tdDefTransTrnsfr.amount=0;
    this.errorFlag=true;
    this.TrfTotAmt=0
    return;
  }
  else if(this.td.trans_mode.value == 'C' && (this.f.acc_type_cd.value ==1 ||this.f.acc_type_cd.value ==8) && this.TrfTotAmt!=Number(this.td.amount.value)){//PARTHA
    debugger
    this.HandleMessage(true, MessageType.Error, 'You should be Transaction Withdrawal amount only');
    tdDefTransTrnsfr.amount=0;
    this.errorFlag=true;
    this.TrfTotAmt=0
    return;
  }
  
  }
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
    sumAmount(i:number){
      let insufbal=this.td_deftranstrfList[i]?.clr_bal < Number(this.td_deftranstrfList[i]?.amount);
      if(insufbal && this.td_deftranstrfList[i]?.clr_bal!=null && (this.td_deftranstrfList[i]?.cust_acc_type =='1' ||this.td_deftranstrfList[i]?.cust_acc_type =='7' ||this.td_deftranstrfList[i]?.cust_acc_type =='8') && this.td.trans_type.value == 'Deposit'){
        this.HandleMessage(true, MessageType.Error, `Warning! , Insufficient Balance at ${this.td_deftranstrfList[i]?.cust_name} A/C`)
        this.td_deftranstrfList[i].amount=0;
        debugger
      }
      else{
        debugger
      }
      this.sumTransfer();

    }
  private sumTransfer(): void {
    this.TrfTotAmt = 0;
    this.td_deftranstrfList.forEach(e => {
      this.TrfTotAmt += (+e.amount);
    });
    // if(this.TrfTotAmt>0 && (this.accTransFrm.controls.acc_type_cd.value==9||this.accTransFrm.controls.acc_type_cd.value==1||this.accTransFrm.controls.acc_type_cd.value==8)){
    //   if(this.td.amount.value!=this.TrfTotAmt){
    //     this.TrfTotAmt=0;
    //     this.td_deftranstrfList[0].amount=0;
    //     this.HandleMessage(true, MessageType.Error, 'Total Amount can not be more than Transaction amount');
    //   }
    // }
    // console.log(this.td.amount.value+" "+this.TrfTotAmt)
    // if ((+this.td.amount.value) < this.TrfTotAmt) {
    //   this.HandleMessage(true, MessageType.Error, 'Total Amount can not be more than Transaction amount');
    //   // this.td_deftranstrfList[(this.td_deftranstrfList.length - 1)].amount = 0;
    // }
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
  // ngAfterViewInit() {
  //   if(this.f.acct_num.value.length>0)
  //   {
  //    console.log(this.f.acct_num.value)

  //      this.f.acct_num.valueChanges.pipe(
  //     debounceTime(500),
  //     distinctUntilChanged(),
  //     switchMap(res => this.suggestCustomer())
  //   ).subscribe(res => {
  //     // console.log(res);

  //   })}
  // }
  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  onAmtformat(e:any){//PARTHA
    console.log(e.target.value);
    
    console.log(this.Formatamount)
    if(e.target.value.length>1 && e.target.value.length%2==0)
     {this.Formatamount+=','}
     console.log(this.Formatamount)
    
    //  this.Formatamount=this._decimalPipe.transform(e.target.value, '1.0-2')
  }

  chkAmount() {

  }
  compareDate(e:any){
    // console.log(e.target.value)
    // console.log(this.accDtlsFrm.controls.mat_dt.value);
    // console.log(this.sys.CurrentDate.toDateString())
    // console.log(new Date(e.target.value)>new Date(this.accDtlsFrm.controls.mat_dt.value))
    // console.log(new Date(e.target.value)>new Date(this.sys.CurrentDate))
    // if(new Date(e.target.value)>=new Date(this.tdDefTransFrm.controls.mat_dt.value) && new Date(e.target.value)<=new Date(this.sys.CurrentDate))
    // console.log(true)
    // else
    // console.log(false)
    console.log("e>mat ", Utils.convertStringToDt(e.target.value)>Utils.convertStringToDt(this.accDtlsFrm.controls.mat_dt.value))
    console.log("e>curr", Utils.convertStringToDt(e.target.value)>this.sys.CurrentDate)
    if(Utils.convertStringToDt(e.target.value)>=Utils.convertStringToDt(this.accDtlsFrm.controls.mat_dt.value) && Utils.convertStringToDt(e.target.value)<=this.sys.CurrentDate )
    {
     this.onDepositePeriodChange()
    }
    else{
      this.HandleMessage(true, MessageType.Error,
        'Opening date should be greater than the maturity date and less than the operation date!');
     this.tdDefTransFrm.controls.opening_dt.setValue(this.datepipe.transform(this.sys.CurrentDate,"dd/MM/yyyy"))

    }
  
  }
  
 
  setAccFlag(openDT:any, currDt:any){
    if(openDT){
      const [day, month, yearTime] = openDT?.split(/[\/\s:]/); // Splitting by '/', space, and ':'
      const [year, hours, minutes] = yearTime.split(' ');
      
      const date1=new Date(`${year}/${month}/${day} 00:00`)
      debugger
      const formattedDate1 = this.datepipe.transform(date1, 'yyyy-MM-dd');
      const formattedDate2 = this.datepipe.transform(currDt, 'yyyy-MM-dd');
  
      const diff = Math.abs(new Date(formattedDate2).getTime() - new Date(formattedDate1).getTime());
  
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      debugger
      if(diffDays>180){
        this.new_acc_status=false;
      }
      else{this.new_acc_status=true;}
      debugger
      console.log(`Difference in months: ${diffDays}`);
    }
    else{this.new_acc_status=false}
    
  }

  
}
export class DynamicSelect {
  key: any;
  Description: any;
}