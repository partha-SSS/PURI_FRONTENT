import { SystemValues } from './../../Models/SystemValues';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { InAppMessageService, RestService } from 'src/app/_service';
import { MessageType, mm_category, mm_customer, m_acc_master, ShowMessage, td_def_trans_trf, mm_operation } from '../../Models';
import { LockerOpenDM } from '../../Models/locker/LockerOpenDM';
import { mm_acc_type } from '../../Models/deposit/mm_acc_type';
import { mm_constitution } from '../../Models/deposit/mm_constitution';
import { mm_oprational_intr } from '../../Models/deposit/mm_oprational_intr';
import { td_accholder } from '../../Models/deposit/td_accholder';
import { td_introducer } from '../../Models/deposit/td_introducer';
import { td_nominee } from '../../Models/deposit/td_nominee';
import { td_signatory } from '../../Models/deposit/td_signatory';
import { tm_denomination_trans } from '../../Models/deposit/tm_denomination_trans';
import { tm_transfer } from '../../Models/deposit/tm_transfer';
import { p_gen_param } from '../../Models/p_gen_param';
import { tm_deposit } from '../../Models/tm_deposit';
import { exit } from 'process';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Utils from 'src/app/_utility/utils';
import { Router } from '@angular/router';
import { tt_denomination } from '../../Models/deposit/tt_denomination';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { tm_locker } from '../../Models/locker/tm_locker';
import { AccOpenDM } from '../../Models/deposit/AccOpenDM';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-locker-transaction',
  templateUrl: './locker-transaction.component.html',
  styleUrls: ['./locker-transaction.component.css']
})
export class LockerTransactionComponent implements OnInit {
  constructor(
    // private frmBldr: FormBuilder,
    private svc: RestService,
    private modalService: BsModalService,
    private router: Router,
    private msg: InAppMessageService,
    private frmBldr: FormBuilder,
  ) { }
  @ViewChild('unappconfirm', { static: true }) unappconfirm: TemplateRef<any>;
  public static operations: mm_operation[] = [];
  static accTypes: mm_acc_type[] = [];
  AcctTypes: mm_operation[];
  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;
  L_ACC_TYPE_CD:number;
  disablejoinholder:boolean=true;
  transTypeFlg = '';
  agentData:any;
  accountTypeDiv = 1;
  dspPrn=0
  branchCode = localStorage.getItem('__brnCd');
  savingsDepoSpclPeriod = 0;
  openDate: Date;
  cashAccountCode = -1;
  showMsg: ShowMessage;
  suspanceAccCd: number;
  cashAccCd: number;
  relStatus:any;
  // isOpenFromDp = false;
  modalRef: BsModalRef;
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  editDeleteMode:boolean=false;
  lockerRent:any;
  RentAmount:any;
  shownoresult:boolean=false;
  selectedCust: any;
  disabledOnNull=true;
  suggestedCustomerCr: mm_customer[];
  indxsuggestedCustomerCr = 0;
  hidejoin:boolean=false;
  createUser = '';
  updateUser = '';
  createDate: Date;
  updateDate: Date;
  DepositModel:any = new AccOpenDM()
  sys = new SystemValues();
  denominationGrandTotal = 0;
  // new comment
  lockerMaster:any;
  isLoading = false;
  // disableCustNameFlg = true;
  disableCustomerName = true;
  disableAll = true;
  disableAccountTypeAndNo = true;
  renew:boolean=true;
  close:boolean=true;
  operationType = '';
  ddsAgent:any;
  showAlert = false;
  alertMsg: string;
  alertMsgType: string;
  showNoResult=false;
  x1 = 1;
  y1 = 1;
  disabledTrfOnNull = true
  
  operations: mm_operation[];
  // Declaration of model for each Div
  masterModel = new LockerOpenDM();
  tm_deposit = new tm_deposit();
  tm_locker = new tm_locker();
  td_nomineeList: td_nominee[] = [];
  td_signatoryList: td_signatory[] = [];
  td_accholderList: td_accholder[] = [];
  td_introducerlist: td_introducer[] = [];
  tm_denominationList: tm_denomination_trans[] = [];
  unApproveTrans:any;
  td_deftrans = new td_def_trans_trf();
  td_deftranstrfList: td_def_trans_trf[] = [];
  tm_transferList: tm_transfer[] = [];
  TrfTotAmt = 0;
  dummyList: string[] = [];

  get l() { return this.getLocker.controls; }
  get ldtf() { return this.lockerDefTransFrm.controls; }
  
  denominationList: tt_denomination[] = [];
  showtransdetails:boolean=false;
  customerList: mm_customer[] = [];
  suggestedCustomer: mm_customer[];
  suggestedLocker: tm_locker[];
  suggestedSBLocker:tm_locker[]
  suggestedSBCustomer: mm_customer[];
  suggestedCustomerSignatories: mm_customer[];
  suggestedCustomerSignatoriesIdx: number;
  suggestedCustomerJointHolder: mm_customer[];
  suggestedCustomerJointHolderIdx: number;
  getLocker: FormGroup;
  lockerDefTransFrm: FormGroup;
  selectedCustomer = new mm_customer();

  categoryList: mm_category[] = [];
  accountTypeList: mm_acc_type[] = [];
  constitutionList: mm_constitution[] = [];
  selectedConstitutionList: mm_constitution[] = [];
  operationalInstrList: mm_oprational_intr[] = [];
  hidegl:boolean=true;
  glHead:any;
  acc_master: m_acc_master[] = [];
  acc_master1: m_acc_master[] = [];
  systemParam:any;
  p_gen_param = new p_gen_param();
  lockerRt:any=[];
  loc_type:any='';
  loc_status:any='';
  sexType = [
    { type: 'M', desc: 'Male' },
    { type: 'F', desc: 'Female' },
    { type: 'O', desc: 'Other' },];

  relationship = [
    { id: 1, val: 'Father' },
    { id: 2, val: 'Mother' },
    { id: 3, val: 'Sister' },
    { id: 4, val: 'Brother' },
    { id: 5, val: 'Friend' },
    { id: 6, val: 'Son' },
    { id: 7, val: 'Daughter' },
    { id: 8, val: 'Wife' },
    { id: 9, val: 'Husband' },
    { id: 10, val: 'Others'}
  ];
  locker_type=[
    {type:"Small",id:"S"},
    {type:"Large",id:"L"},
    {type:"Mediam",id:"M"},
  ];
  locker_status=[
    {type:"Vacant",id:"V"},
    {type:"Allocated",id:"A"},
  ]

  intTransferType = [
    { tfr_type: 'M', tfr_desc: 'Monthly' },
    { tfr_type: 'Q', tfr_desc: 'Quarterly' },
    { tfr_type: 'H', tfr_desc: 'Half-Yearly' },
    { tfr_type: 'Y', tfr_desc: 'Yearly' },
    { tfr_type: 'O', tfr_desc: 'On-Maturity' },
  ];

  introducerAccTypeList = [
    { introducer_acc_type_cd: 1, introducer_acc_type_desc: 'Savings A/C' },
    { introducer_acc_type_cd: 8, introducer_acc_type_desc: 'Current A/C' }
  ];

  standingInstrAfterMaturity = [
    { instr_code: '1', instr_dscr: 'Auto Close' },
    { instr_code: '2', instr_dscr: 'Auto Renew' },
    { instr_code: '0', instr_dscr: 'None' }
  ];

  occupationList=[
                {id:'STUDENT',type:'STUDENT'},
                {id:'TEACHER',type:'TEACHER'},
                {id:'SERVICE',type:'SERVICE'},
                {id:'CULTIVATION',type:'CULTIVATION'},
                {id:'FARMER',type:'FARMER'},
                {id:'SELF_EMPLOYEE',type:'SELF_EMPLOYEE'},
                {id:'BUSSINESS',type:'BUSSINESS'},
                {id:'HOUSEWIFE',type:'HOUSEWIFE'},
                {id:'OTHERS',type:'OTHERS'}
              ]
  introducerAccTypeListTemp = [];

  // denominationList = [
  //   { value: '2000', rupees: 'Two Thousand (Rs.2000)' },
  //   { value: '500' , rupees: 'Five Hundred (Rs.500)' },
  //   { value: '200' , rupees: 'Two Hundred (Rs.200)' },
  //   { value: '100' , rupees: 'Hundred (Rs.100)' },
  //   { value: '50'  , rupees: 'Fifty (Rs.50)' },
  //   { value: '20'  , rupees: 'Twenty (Rs.20)' },
  //   { value: '5'  , rupees: 'Five (Rs.5)' },
  //   { value: '2'  , rupees: 'Two (Rs.2)' },
  //   { value: '1'  , rupees: 'One (Rs.1)' },];

  transferTypeList = [
    { trf_type: 'C', trf_type_desc: 'Cash' },
    { trf_type: 'T', trf_type_desc: 'Transfer' }];

  transferTypeListTemp = this.transferTypeList;

  ngOnInit(): void {
    this.getSystemParam();
    this.getLocker = this.frmBldr.group({
      agreement_no: [''],
      oprn_cd: ['']
    });
    this.lockerDefTransFrm = this.frmBldr.group({
      trans_dt: [''],
      trans_cd: [''],
      rent:[''],
      tot_amount: [''],
      gst: [''],
      trans_mode: [''],
      trf_type: [''],
      till_dt:[''],
      particulars:['']
    });
    
    this.getLocker.controls.oprn_cd.disable();
    this.getAgentList();
    this.getLockerMaster();
    // console.log(this.td_deftranstrfList);
  
    this.branchCode = this.sys.BranchCode;
    this.createUser = this.sys.UserId +'/'+localStorage.getItem('ipAddress');
    this.updateUser = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    this.createDate = this.sys.CurrentDate;
    this.updateDate = this.sys.CurrentDate;
    this.cashAccountCode = this.sys.CashAccCode;

    this.suspanceAccCd = this.sys.SuspanceAccCode;
    this.cashAccCd = this.sys.CashAccCode;

    // this.createDate = this.convertDate(Date.UTC( new Date().getDate() , new Date().getMonth(),  new Date().getFullYear()).toString());
    // this.updateDate = this.convertDate(Date.UTC( new Date().getDate() , new Date().getMonth(),  new Date().getFullYear()).toString());

    this.openDate = this.sys.CurrentDate;

    this.savingsDepoSpclPeriod = this.sys.DdsPeriod;
    this.suggestedCustomer = null;
    this.suggestedLocker = null;
    this.suggestedCustomerSignatories = null;
    this.suggestedCustomerJointHolder = null;

    // this.isLoading = true;
    // this.getCustomerList();
    this.getCategoryList();

    this.initializeMasterDataAndFlags();
    this.initializeModels();

    // this.getDenominationList();
    this.getAccountTypeList();
    this.getConstitutionList();
    this.getOperationalInstr();
    this.newAccount();
    this.getRelations();
    setTimeout(() => {
      this.getOperationMaster();
    
    }, 150);
    // console.log(this.constitutionDtParser('YEAR=1;Month=10;Days=25;'));
  }
    getSystemParam(){
      this.svc.addUpdDel('Mst/GetSystemParameter', null).subscribe(
        sysRes => {
          try {
            this.systemParam = sysRes;
            this.L_ACC_TYPE_CD=this.systemParam.find(x => x.param_cd === '910')?.param_value
            console.log(this.L_ACC_TYPE_CD);
            
          }
          catch(exception){
            console.log(exception)
          }
        })
    }
  private getOperationMaster(): void {
    console.log(LockerTransactionComponent.operations);

    this.isLoading = true;
    
      debugger
      this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
        res => {
          console.log(res)
          debugger
          LockerTransactionComponent.operations = res;
          this.isLoading = false;
          this.operations = LockerTransactionComponent.operations.filter(e => e.module_type.toLowerCase() == 'locker')
           
          this.operations = this.operations.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
        },
        err => { this.isLoading = false; }
      );
    
    debugger
    console.log(this.operations);

  }
  gstCalculate(){
    const Gst=Math.round((Number(this.ldtf.rent.value)*18)/100)
    this.ldtf.gst.setValue(Gst); 
    this.ldtf.tot_amount.setValue(Number(this.ldtf.rent.value)+Gst);
  }
  onOperationTypeChange(){
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.l.oprn_cd.value)[0];
    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
      this.lockerDefTransFrm.patchValue({
        trans_mode: 'Renewal'
      });
      this.ldtf.rent.disable();
      this.ldtf.rent.setValue(this.RentAmount);
      var cgst=Math.round((this.RentAmount*18)/100)
      this.ldtf.gst.setValue(cgst);
      this.ldtf.tot_amount.setValue(Number(this.RentAmount)+cgst);
      this.renew=true;
      this.close=false;

    } else {
      this.lockerDefTransFrm.patchValue({
        trans_mode: 'Close'
      });
      this.ldtf.rent.enable();
      // this.ldtf.rent.setValue(0);
      // this.ldtf.gst.setValue(0);
      // this.ldtf.tot_amount.setValue(0);
      
      this.close=true;
      this.renew=false;
    }
    
    const originalDate = new Date(this.sys.CurrentDate);
    const formattedDate = originalDate.toLocaleDateString('en-GB'); // '06/07/2023'
    const formattedTime = originalDate.toLocaleTimeString('en-US', { hour12: false });
    const result = `${formattedDate} ${formattedTime}`;
    this.ldtf.trans_dt.setValue(this.setDate(result));

    console.log(this.masterModel.tmlocker.rented_till)
    var date=this.masterModel.tmlocker.rented_till
    const [year, month, day] = date.split('-');
    const newYear=Number(year)+1
    const dt = `${day}/${month}/${newYear} 00:00:00`;
    debugger
    this.ldtf.till_dt.setValue(this.setDate(dt));
  }
  tillDTChange(){
    
    var originalDate = new Date(this.ldtf.till_dt.value);
  //   var formattedDate = originalDate.toLocaleDateString('en-GB', {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric'
  // });
  // formattedDate += " 00:00";
  // console.log(formattedDate);
  this.td_deftrans.intt_till_dt=originalDate;
    debugger
  }
    onTransTypeChange(): void {
      debugger;
      const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.l.oprn_cd.value)[0];
      
        this.showtransdetails = true;
        if (this.ldtf.trf_type.value === 'C') {
          this.showtransdetails = false;
          if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
            this.lockerDefTransFrm.patchValue({
              particulars: 'TO CASH '
            });
          } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
            this.lockerDefTransFrm.patchValue({
              particulars: 'BY CASH '
            });
          }
  
        } else {
          console.log(selectedOperation.oprn_desc.toLocaleLowerCase(), this.ldtf.trans_mode.value)
          if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
            this.lockerDefTransFrm.patchValue({
              particulars:  'TO TRANSFER'
            });
          } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
            this.lockerDefTransFrm.patchValue({
              particulars: 'BY TRANSFER'
            });
          }
        }
      
  
      
    }
  
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  private convertDate(datestring: string): Date {
    const parts = datestring.match(/(\d+)/g);
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }


  initializeMasterDataAndFlags() {
    this.getAccountTypeList();
    this.getConstitutionList();
    this.getOperationalInstr();

    this.selectedConstitutionList = [];
    this.transferTypeListTemp = [];
    this.transferTypeListTemp = this.transferTypeList;

    // this.isLoading = false;
    // this.disableCustNameFlg = true;
    this.disableAll = true;
    this.disableCustomerName = true;
    this.disableAccountTypeAndNo = true;

    this.operationType = '';

    this.showAlert = false;
    this.alertMsg = '';
    this.alertMsgType = '';

    this.denominationGrandTotal = 0;
    // this.DepositModel = new LockerOpenDM();
  }
  initializeModels() {
    this.tm_locker=new tm_locker();

    this.tm_deposit = new tm_deposit();
    // this.tm_deposit.opening_dt = this.openDate  ; // this.DateFormatting(this.openDate);
    

    const sig: td_signatory[] = [];
    this.td_signatoryList = sig;
    this.addSignatory();

    const acc: td_accholder[] = [];
    this.td_accholderList = acc;
    this.addJointHolder();

    const intr: td_introducer[] = [];
    this.td_introducerlist = intr;
    this.addIntroducer();

    const nom: td_nominee[] = [];
    this.td_nomineeList = nom;
    this.addNominee();

    const deno: tm_denomination_trans[] = [];
    this.tm_denominationList = deno;
    this.addDenomination();

    this.td_deftrans = new td_def_trans_trf();

    const td_deftranstrf: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftranstrf;
    const temp_deftranstrf = new td_def_trans_trf();
    this.td_deftranstrfList.push(temp_deftranstrf);

    const tm_trns: tm_transfer[] = [];
    this.tm_transferList = tm_trns;
    const temp_transfer = new tm_transfer();
    this.tm_transferList.push(temp_transfer);



    this.masterModel.tdnominee = this.td_nomineeList;
    this.masterModel.tdaccholder = this.td_accholderList;
    // this.DepositModel.tmdenominationtrans = this.tm_denominationList;

    this.masterModel.tddeftrans = this.td_deftrans;
    this.masterModel.tddeftranstrf = this.td_deftranstrfList;
    this.masterModel.tmtransfer = this.tm_transferList;



    this.p_gen_param = new p_gen_param();
  }
  setSecurityAccDtls()
{
  let retDepositPeriodArr = [];
  this.setIntTfrType(this.tm_deposit.intt_trf_type);
  this.setConstitutionType(this.tm_deposit.constitution_cd);
  this.setOperationalInstr(this.tm_deposit.oprn_instr_cd);

  if (this.tm_deposit.intt_amt !== undefined && this.tm_deposit.intt_amt != null) {
    this.tm_deposit.mat_val = Number(this.tm_deposit.intt_amt) + Number(this.tm_deposit.prn_amt);
  }

  if (this.tm_deposit.dep_period !== undefined && this.tm_deposit.dep_period != null) {
    retDepositPeriodArr = this.depositPeriodParser(this.tm_deposit.dep_period);
    this.tm_deposit.year = Number(retDepositPeriodArr[0]);
    this.tm_deposit.month = Number(retDepositPeriodArr[1]);
    this.tm_deposit.day = Number(retDepositPeriodArr[2]);
  }
}  
assignLockerData(){
    
    const acc: td_accholder[] = [];
    this.td_accholderList = acc;
    this.addJointHolder();
    const nom: td_nominee[] = [];
    this.td_nomineeList = nom;
    this.addNominee();
    // this.td_deftrans = new td_def_trans_trf();
    // const td_deftrans: td_def_trans_trf[] = [];
    // this.td_deftranstrfList = td_deftrans;
    // const tm_trns: tm_transfer[] = [];
    // this.tm_transferList = tm_trns;
    // this.setCustDtls(this.tm_locker.cust_cd);
    // console.log(this.tm_deposit.acc_num)
    // this.setAccountType(this.tm_deposit.acc_type_cd);
   

    // if (this.tm_deposit.standing_instr_flag !== undefined && this.tm_deposit.standing_instr_flag !== null) {
    //   this.setStandingInstrAfterMatu(Number(this.tm_deposit.standing_instr_flag));
    // }

    // tslint:disable-next-line: forin
    

    this.tm_locker=this.masterModel.tmlocker;
    // this.tm_transferList=this.masterModel.tmtransfer;
    // this.td_deftrans=this.masterModel.tddeftrans;
    // this.td_deftranstrfList=this.masterModel.tddeftranstrf;
    this.td_nomineeList=this.masterModel.tdnominee;
    this.td_accholderList=this.masterModel.tdaccholder;
    // tslint:disable-next-line: forin
    for (const idx in this.td_accholderList) {
      this.setRelationship(this.td_accholderList[idx].relation, Number(idx));
    }

    // this.tm_denominationList = this.DepositModel.tmdenominationtrans;
    if (this.tm_denominationList === undefined || this.tm_denominationList === null || this.tm_denominationList.length === 0) {
      null;
    }
    else {
      for (const idx in this.tm_denominationList) {
        this.setDenomination(this.tm_denominationList[idx].rupees, Number(idx));
      }

    }

    // this.td_deftrans = this.masterModel.tddeftrans;
    // console.log({"TDDEFTRANS": this.td_deftrans});

    // this.setTransType(this.td_deftrans.trf_type);
    // this.td_deftranstrfList = this.masterModel.tddeftranstrf;
    // console.log({"TD_DEFTRANSTRFLIST":this.td_deftranstrfList,"suggestedCustomerCr":this.suggestedCustomerCr});
    // this.tm_transferList = this.masterModel.tmtransfer;

    // if (this.td_deftrans.trf_type === 'T') {

    //   if (this.td_deftranstrfList[0].acc_num === '0000') {
    //     this.td_deftranstrfList[0].gl_acc_code = this.td_deftranstrfList[0].acc_type_cd.toString();
    //     this.checkAndSetDebitAccType('gl_acc', this.td_deftranstrfList[0].gl_acc_code);

    //   }
    //   else {
    //     this.td_deftranstrfList[0].cust_acc_type = this.td_deftranstrfList[0].acc_type_cd.toString();
    //     this.td_deftranstrfList[0].cust_acc_number = this.td_deftranstrfList[0].acc_num;
    //     this.checkAndSetDebitAccType('cust_acc', this.td_deftranstrfList[0].cust_acc_type);
    //     this.setDebitAccDtls(this.td_deftranstrfList[0].acc_num);
    //   }
    // }
    // console.log({"TDDEFTRANS!": this.td_deftrans});
  }

 
  public suggestCustomer2(): Observable<mm_customer> {
    this.isLoading = true;
    console.log("here")
    // console.log(this.f.acct_num.value.length)
    //  console.log(this.accDtlsFrm.get('home_brn_cd').value)
    if (this.tm_deposit.user_acc_num.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = 1
      prm.as_cust_name = this.tm_deposit.user_acc_num.toLowerCase();
      console.log(prm.ardb_cd);

      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          console.log(res)
          this.isLoading = false;
          console.log(this.tm_deposit.user_acc_num)
          if (undefined !== res && null !== res && res.length > 0 && res != '' && this.tm_deposit.user_acc_num) {
            this.suggestedSBCustomer = [];
            // this.suggestedCustomer = res.slice(0, 10);
            this.suggestedSBCustomer = res
            console.log(res.length + " " + this.suggestedSBCustomer.length)
            return this.suggestedSBCustomer;
          } else {
            this.shownoresult = true;
            console.log(res.length)
            this.suggestedSBCustomer = [];
            return this.suggestedSBCustomer;
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
      this.suggestedSBCustomer = null;
      return null;
    }
    // console.log(this.suggestedCustomer)
  }
  public suggestLocker(): Observable<tm_locker> {
    this.isLoading = true;
    console.log("here")
    // console.log(this.f.acct_num.value.length)
    //  console.log(this.accDtlsFrm.get('home_brn_cd').value)
    if (this.l.agreement_no.value.length > 0) {
      const prm = new p_gen_param();
      prm.ardb_cd = this.sys.ardbCD;
      prm.brn_cd = this.sys.BranchCode;
      prm.as_cust_name = this.l.agreement_no.value.toLowerCase();
      console.log(prm.ardb_cd);

      this.svc.addUpdDel<any>('Locker/GetlockerDtlsSearch', prm).subscribe(
        res => {
          console.log(res)
          this.isLoading = false;
          
          if (undefined !== res && null !== res && res.length > 0 && res != '' && this.l.agreement_no.value) {
            this.suggestedSBLocker = [];
            // this.suggestedCustomer = res.slice(0, 10);
            this.suggestedSBLocker = res
            this.suggestedLocker = res
            console.log(res.length + " " + this.suggestedSBLocker.length)
            return this.suggestedSBLocker;
          } else {
            this.shownoresult = true;
            console.log(res.length)
            this.suggestedSBLocker = [];
            return this.suggestedSBLocker;
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
      this.suggestedSBCustomer = null;
      return null;
    }
    // console.log(this.suggestedCustomer)
  }
  public SelectLocker(cust: any): void {
    // this.optionClicked=true;
    this.l.agreement_no.setValue(cust.agreement_no);
    this.shownoresult = false;
    // this.selectedCust = cust.acc_num
    console.log(cust)
    this.GetUnapprovedLockerTrans(cust)
    // this.tm_deposit.user_acc_num=cust.acc_num
    // this.f.acct_num.setValue(cust.acc_num);
    // this.onAccountNumTabOff();
    // this.f.acct_num.value.length=0;
    this.suggestedSBLocker = [];
    // this.validateSbAccount();
   
   
  }
  public SelectCustomer(cust: any): void {
    // this.optionClicked=true;
    this.shownoresult = false;
    // this.selectedCust = cust.acc_num
    console.log(cust)
    this.tm_deposit.user_acc_num=cust.acc_num
    // this.f.acct_num.setValue(cust.acc_num);
    // this.onAccountNumTabOff();
    // this.f.acct_num.value.length=0;
    this.suggestedSBCustomer = [];
    this.validateSbAccount();
   
   
  }
  clearSuggestedLocker() {
    this.suggestedSBLocker = null;
    this.shownoresult = false;
    if (this.l.agreement_no.value.length > 0) {
      this.disabledOnNull = false;
    }
    else {
      this.disabledOnNull = true;
    }


  }
  clearSuggestedCust() {
    this.suggestedSBCustomer = null;
    this.shownoresult = false;
    if (this.tm_deposit.user_acc_num.length > 0) {
      this.disabledOnNull = false;
    }
    else {
      this.disabledOnNull = true;
    }


  }
  getCustomerList() {
    
    const cust = new mm_customer();
    cust.cust_cd = 0;
    cust.brn_cd = this.branchCode;
    cust.ardb_cd=this.sys.ardbCD
    this.isLoading = true;
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

  getConstitutionList() {

    if (this.constitutionList.length > 0) {
      return;
    }

    this.constitutionList = [];
    var dt={
      "ardb_cd":this.sys.ardbCD
    }
    this.svc.addUpdDel<any>('Mst/GetConstitution', dt).subscribe(
      res => {
        // ;
        this.constitutionList = res;
      },
      err => { // ;
      }
    );
  }

  getAccountTypeList() {

    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];
    var dt={
      "ardb_cd":this.sys.ardbCD
    }
    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', dt).subscribe(
      res => {
      
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {

      }
    );
  }

  getOperationalInstr() {
    debugger
    if (this.operationalInstrList.length > 0) {
      return;
    }
    var dt={
      "ardb_cd":this.sys.ardbCD
    }
    this.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', dt).subscribe(
      res => {
        // ;
        this.operationalInstrList = res;
        this.operationalInstrList = this.operationalInstrList.sort((a, b) => (a.oprn_cd > b.oprn_cd) ? 1 : -1);
      },
      err => {
        // ;
      }
    );
  }


  getDenominationList() {
    // var dt={
    //   "ardb_cd":this.sys.ardbCD
    // }
    // let denoList: tt_denomination[] = [];
    // this.svc.addUpdDel<any>('Common/GetDenomination', dt).subscribe(
    //   res => {

    //     denoList = res;
    //     this.denominationList = denoList.sort((a, b) => (a.value < b.value) ? 1 : -1);
    //   },
    //   err => { // ;
    //   }
    // );
  }



  clearData() {
    this.RentAmount=0;
    this.operationalInstrList=[];
    this.operationType = '';
    this.disabledOnNull=true;
    this.suggestedCustomer=null;
    this.suggestedLocker=null;
    this.showNoResult=false
    this.loc_type='';
    this.loc_status='';
    this.showtransdetails=false;
    this.td_deftranstrfList=[];
    this.editDeleteMode=false;
    this.getLocker.reset();
    this.lockerDefTransFrm.reset();
    this.initializeMasterDataAndFlags();
    this.initializeModels();
    this.closeAlertMsg();
    // this.setOperationalInstr(null);

  }

  retrieveData() {

    this.clearData();

    this.operationType = 'U';
    // this.isLoading = true;
    // this.getCustomerList();

    this.disableAll = true;
    this.disableCustomerName = true;
    this.disableAccountTypeAndNo = false;
    this.tm_deposit.brn_cd = this.branchCode;
  }
  getLocType(){
    debugger
        this.loc_type=this.lockerMaster.filter(e=>e.locker_id.toLowerCase()==this.tm_locker.locker_id.toLowerCase())[0].locker_type;
        this.loc_status=this.lockerMaster.filter(e=>e.locker_id.toLowerCase()==this.tm_locker.locker_id.toLowerCase())[0].locker_status;
        if(this.editDeleteMode){
          this.lockerDefTransFrm.patchValue({
            rent:this.td_deftrans.amount-this.td_deftrans.ovd_intt_recov,
            gst:this.td_deftrans.ovd_intt_recov,
            tot_amount: this.td_deftrans.amount,
          });
        }
        else{
          this.getLockerRate();
        }
        debugger
   
  }
  getLockerRate(){
    this.svc.addUpdDel('Locker/GetLockerRentlist',null).subscribe(data=>{
      this.RentAmount=0
      this.lockerRent=data
      if(this.lockerRent){
        this.RentAmount=this.lockerRent.filter(e=>e.locker_type==this.loc_type)[0].rentamt;
        // this.masterModel.tddeftrans.ovd_intt_recov=Math.round((this.RentAmount*18)/100);
        // this.masterModel.tddeftrans.amount=Math.round((this.RentAmount*18)/100)+this.RentAmount;
        this.lockerDefTransFrm.patchValue({
          rent:this.RentAmount,
          gst:Math.round((this.RentAmount*18)/100),
          tot_amount: Math.round((this.RentAmount*18)/100)+this.RentAmount,

          
        });
        debugger
      }
      
    })
  }
  
    getLockerMaster(){
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
      
      }
      this.svc.addUpdDel('Locker/GetLockerMaster',dt).subscribe(data=>{
        
        debugger
        this.lockerMaster=data
        
      })
    }
   
    
  getLockerOpeningTempData(agreement_no:any) {
    
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "agreement_no":agreement_no
      }
    this.isLoading = true;
    this.svc.addUpdDel<any>('Locker/GetLockerOpeningData', dt).subscribe(
      res => {
        console.log(res);
        this.isLoading = false;
        this.masterModel = res;
        this.td_deftrans=this.masterModel.tddeftrans
        this.tm_locker=this.masterModel.tmlocker;
        this.tm_transferList=this.masterModel.tmtransfer;
        if ( this.masterModel.tmlocker.agreement_no === undefined || this.masterModel.tmlocker.agreement_no === null) {
          // this.showAlertMsg('WARNING', 'No record found!!');
          this.HandleMessage(true, MessageType.Warning, 'No record found!!');
          this.tm_locker.agreement_no=null;
          this.getLocker.controls.oprn_cd.disable();
          return
        }
        
       
        else {
          if(this.masterModel.tddeftrans.trans_cd>0){
            debugger
            // this.getLocker.controls.oprn_cd.enable();
            // this.assignLockerData();
            this.tm_locker.agreement_dt= this.setDate(this.tm_locker.agreement_dt)
            this.tm_locker.rented_till= this.setDate(this.tm_locker.rented_till)
            debugger
            this.disableAccountTypeAndNo = true;
            this.getLockerMaster();
            this.getLocType();
            this.setTransactionValue();
            this.operationType = 'I';
          }
          else{
            this.getLocker.controls.oprn_cd.enable();
            this.assignLockerData();
            this.tm_locker.agreement_dt= this.setDate(this.tm_locker.agreement_dt)
            this.tm_locker.rented_till= this.setDate(this.tm_locker.rented_till)
            debugger
            this.disableAccountTypeAndNo = true;
            this.getLockerMaster();
            this.getLocType();
            this.operationType = 'I';

           }
        
        }


      },
      err => {
        this.isLoading = false;
        // this.showAlertMsg('ERROR', 'Unable to find record!!');
        this.HandleMessage(true, MessageType.Warning, 'Unable to find record!!');
      }

    );
  
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
  onChangeTrf(i: any) {
    this.suggestedCustomerCr = null;
    if (this.td_deftranstrfList[i].cust_name.length > 2) {
      this.disabledTrfOnNull = false;
    }
    else {
      this.disabledTrfOnNull = true
    }
  }
    
    setDate(date:string){
      const [datePart] = date.split(' ');
      const [day, month, year] = datePart.split('/');
      const outputDate = `${year}-${month}-${day}`; 
      return outputDate;
    }
    getDate(){

    }
  modifyData() {

    if (this.operationType !== 'I') {
      // this.showAlertMsg('WARNING', 'Record not retrived to modify');
      this.HandleMessage(true, MessageType.Warning, 'Record not retrieved to modify');
      return;
    }
    this.ldtf.trf_type.enable();
    this.operationType = 'U';
    this.disableAll = false;
    this.disableCustomerName=false
  }

  newAccount() {    // document.getElementById('account_type').id = '';

    this.clearData();

    this.operationType = 'I';
    const originalDate = new Date(this.sys.CurrentDate);

// Step 2: Format the date and time components
    const formattedDate = originalDate.toLocaleDateString('en-GB'); // '06/07/2023'
    const formattedTime = originalDate.toLocaleTimeString('en-US', { hour12: false }); // '00:00:00'

    // Step 3: Combine the formatted date and time
    const result = `${formattedDate} ${formattedTime}`;
    this.tm_locker.agreement_dt=this.setDate(result)
    // this.isLoading = true;
    // this.getCustomerList();
    // this.disableCustNameFlg = false;
    this.disableCustomerName = false;
     this.disableAll = false;
    this.disableAccountTypeAndNo = false;
    // this.operationalInstrList=null;

  }
  GetUnapprovedLockerTrans(cust:any){
       var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "agreement_no":cust.agreement_no
      }
    
    this.isLoading = true;
    this.unApproveTrans=null;
    this.svc.addUpdDel<any>('Locker/GetUnapprovedLockerTrans', dt).subscribe(
      res => {
        this.unApproveTrans= res[0]
        debugger
        console.log(res);
        if(res.length>0){
          this.isLoading = false;
          this.modalRef = this.modalService.show(this.unappconfirm,
          { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: false });
          
        }
        else{
          this.getLockerOpeningTempData(cust.agreement_no);
          this.isLoading = false;
          // this.HandleMessage(true, MessageType.Warning, 'This Agreement No. dose not exist!!');
          // this.tm_locker.agreement_no=null;
        }
      })
    
  
  }
  public onUpapprovedCancel(): void {
    console.log("close modal")
    this.editDeleteMode = false;
    this.unApproveTrans = null;
    this.modalRef.hide();
  }
  public onUpapprovedConfirm(selectedTransactionToEdit: td_def_trans_trf): void {
    console.log(selectedTransactionToEdit)
    var oprncd=selectedTransactionToEdit.trans_mode=='R'?101:102;
    this.editDeleteMode = true;
    this.l.oprn_cd.setValue(oprncd);
    this.unApproveTrans = selectedTransactionToEdit;
    this.modalRef.hide();
    this.getLockerOpeningTempData(selectedTransactionToEdit.acc_num);
    
  }
  setTransactionValue(){
    debugger
    this.lockerDefTransFrm.patchValue({
      trans_cd:this.unApproveTrans.trans_cd,
      trans_dt:this.setDate(this.unApproveTrans.trans_dt),
      trans_mode:this.unApproveTrans.trans_mode=='R'?'Renewal':'Close',
      trf_type:this.unApproveTrans.trf_type

    })
    this.ldtf.trf_type.disable();
    this.ldtf.trans_dt.disable();
    this.onTransTypeChange();
    if(this.unApproveTrans.trf_type=='T'){
      this.td_deftranstrfList=this.masterModel.tddeftranstrf
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
          // debugger;
          this.setDebitAccDtls(this.td_deftranstrfList[i].acc_num);

        }
      }
      
      this.sumTransfer();
    //  this.td_deftranstrfList=this.masterModel.tddeftranstrf;
     debugger
    }
    debugger
  }
  saveData() {
    
    
   console.log(this.masterModel);
   console.log(this.tm_locker);
    debugger
    this.validateData();
    if (this.operationType === 'I') {
      
      this.td_deftrans.acc_num=this.tm_locker.agreement_no
      // this.tm_locker.ardb_cd=this.sys.ardbCD
      this.masterModel.tmlocker=new tm_locker();
      this.masterModel.tdnominee=[];
      this.masterModel.tdaccholder=[];
      this.masterModel.tmtransfer=this.tm_transferList;
    this.masterModel.tddeftrans=this.td_deftrans;
    this.masterModel.tddeftranstrf=this.td_deftranstrfList;
      // this.masterModel.tddeftrans=this.td_deftrans
debugger
    this.InsertAccountOpenData();
      // this.getNewAccountNoAndSaveData();
    }
    else {
      // this.tm_locker.ardb_cd=this.sys.ardbCD
      this.td_deftrans.acc_num=this.tm_locker.agreement_no
      this.masterModel.tmlocker=new tm_locker();
      this.masterModel.tdnominee=[];
      this.masterModel.tdaccholder=[];
    this.masterModel.tmtransfer=this.tm_transferList;
    this.masterModel.tddeftrans=this.td_deftrans;
    this.masterModel.tddeftranstrf=this.td_deftranstrfList;
      debugger
      
      this.InsertAccountOpenData();
    }

    
  }

  validateData() {
if(this.td_deftrans.trf_type=='T'){
  if (Number(this.ldtf.tot_amount.value) != this.td_deftranstrfList[0].amount) {
    // this.showAlertMsg('WARNING', 'Account Type can not be blank');
    this.HandleMessage(true, MessageType.Warning, `Amount can't matched with Total Locker Rent`);
    this.td_deftranstrfList[0].amount=0
    exit(0);
  }
}
    

   
    // Populating data for TD_DEP_TRANS ================================================================
    this.td_deftrans.brn_cd = this.branchCode;
    this.td_deftrans.trans_dt = this.sys.CurrentDate;
    this.td_deftrans.acc_type_cd = this.L_ACC_TYPE_CD;
    this.td_deftrans.acc_num = this.tm_locker.agreement_no;
    this.td_deftrans.trans_type = 'D';
    this.td_deftrans.trans_mode = this.ldtf.trans_mode.value.toLowerCase()=='renewal'?'R':'C';
    this.td_deftrans.trf_type = this.ldtf.trf_type.value;
    this.td_deftrans.trans_dt = this.ldtf.trans_dt.value;
    this.td_deftrans.amount = this.ldtf.tot_amount.value;
    this.td_deftrans.ovd_intt_recov = this.ldtf.gst.value;
  
    this.td_deftrans.approval_status = 'U';
    this.td_deftrans.acc_cd = this.L_ACC_TYPE_CD;

    if (this.td_deftrans.trf_type === 'T') {
      this.td_deftrans.particulars = 'BY TRANSFER';
    }
    else {
      this.td_deftrans.particulars = 'BY CASH';
    }
    this.td_deftrans.upd_ins_flag = this.operationType;
    if (this.operationType === 'I') {
      this.td_deftrans.created_by = this.createUser;
      this.td_deftrans.created_dt = this.createDate;
      this.td_deftrans.modified_by = this.updateUser;
      this.td_deftrans.modified_dt = this.updateDate;
    }
    else {
      this.td_deftrans.modified_by = this.updateUser;
      this.td_deftrans.modified_dt = this.updateDate;
    }


    // Populating data for TD_DEP_TRANS_TRF =============================================================
    if (this.td_deftrans.trf_type === 'T') {

      

      this.td_deftranstrfList[0].brn_cd = this.branchCode;
      this.td_deftranstrfList[0].trans_dt = this.sys.CurrentDate;

      if (this.td_deftranstrfList[0].cust_acc_type === undefined ||
        this.td_deftranstrfList[0].cust_acc_type === null ||
        this.td_deftranstrfList[0].cust_acc_type === '') {
        this.td_deftranstrfList[0].acc_type_cd = parseInt(this.td_deftranstrfList[0].gl_acc_code);
        this.td_deftranstrfList[0].acc_cd = parseInt(this.td_deftranstrfList[0].gl_acc_code);
        this.td_deftranstrfList[0].acc_num = '0000';
        // this.td_deftranstrfList[0].remarks = 'D';
      }
      else {
        this.td_deftranstrfList[0].acc_type_cd = parseInt(this.td_deftranstrfList[0].cust_acc_type);
        // this.td_deftranstrfList[0].acc_cd = parseInt(this.td_deftranstrfList[0].cust_acc_type);
        this.td_deftranstrfList[0].acc_num = this.td_deftranstrfList[0].cust_acc_number;
        // this.td_deftranstrfList[0].remarks = 'X';
      }
      this.td_deftranstrfList[0].remarks = 'D';

      this.td_deftranstrfList[0].trans_type = 'W';
      this.td_deftranstrfList[0].trans_mode = 'V';
      this.td_deftranstrfList[0].approval_status = 'U';
      this.td_deftranstrfList[0].particulars = 'BY TRANSFER TO : ' + this.tm_locker.acc_num;
      this.td_deftranstrfList[0].tr_acc_cd = 10000;
      // this.td_deftranstrfList[0].acc_cd = this.tm_deposit.acc_cd;
      this.td_deftranstrfList[0].trf_type = 'T';
      this.td_deftranstrfList[0].disb_id = 1;

      if (this.operationType === 'I') {
        this.td_deftranstrfList[0].created_by = this.createUser;
        this.td_deftranstrfList[0].created_dt = this.createDate;
        this.td_deftranstrfList[0].modified_by = this.updateUser;
        this.td_deftranstrfList[0].modified_dt = this.updateDate;
      }
      else {
        this.td_deftranstrfList[0].modified_by = this.updateUser;
        this.td_deftranstrfList[0].modified_dt = this.updateDate;

      }
      // Populating data for TM_TRANSFER =============================================================
      debugger
      this.tm_transferList[0]= new tm_transfer()
      this.tm_transferList[0].brn_cd = this.branchCode;
      this.tm_transferList[0].trf_dt = this.sys.CurrentDate;
      this.tm_transferList[0].approval_status = 'U';

      if (this.operationType === 'I') {
        this.tm_transferList[0].created_by = this.createUser;
        this.tm_transferList[0].created_dt = this.createDate;
      }
    }
    else {
      this.td_deftranstrfList = this.td_deftranstrfList.splice(0, 1);
      this.tm_transferList = this.tm_transferList.splice(0, 1);
    }


   
  }



  InsertAccountOpenData() {
    debugger
    let ret = -1;
    this.validateData();   
    this.masterModel.tddeftrans.ardb_cd=this.sys.ardbCD;
    this.isLoading = true;
    if (this.operationType === 'I') // For New Account
    {
      this.masterModel
      debugger
      this.svc.addUpdDel<any>('Locker/InsertLockerOpeningData', this.masterModel).subscribe(
        res => {
          this.td_deftrans.trans_cd=Number(res);
          this.ldtf.trans_cd.setValue(Number(res));
          this.isLoading = false;
          this.disableCustomerName = true;
          this.operationType = '';
          // this.showAlertMsg('INFORMATION', 'Account Record Created Successfully [Account Number:' +
          //   this.DepositModel.tmdeposit.acc_num + '] [Trans Code: ' + this.td_deftrans.trans_cd + ']');
          this.HandleMessage(true, MessageType.Sucess, 'Account Record Created Successfully  [Trans Code: ' + this.td_deftrans.trans_cd + ']');
        },
        err => {

          this.isLoading = false;
          // this.showAlertMsg('ERROR', 'Record Not Saved !!!');
          this.HandleMessage(true, MessageType.Error, 'Record Not Saved !!!');
          if (this.operationType === 'I') {
            this.masterModel.tmlocker.acc_num = null;
          }

        }
      );
    }
    else // Modify the Account opening Data
    {
      this.masterModel.tddeftrans.ardb_cd=this.sys.ardbCD;
      this.masterModel.tddeftrans.trans_cd=this.unApproveTrans.trans_cd;
      console.log(this.masterModel);
      debugger
      this.svc.addUpdDel<any>('Locker/UpdateLockerOpeningData', this.masterModel).subscribe(
        res => {

          ret = Number(res);
          this.isLoading = false;

          if (ret === 0) {
            // this.showAlertMsg('INFORMATION', 'Record Set Updated Successfully');
            this.HandleMessage(true, MessageType.Sucess, 'Record Set Updated Successfully');
            
          }
          else {
            // this.showAlertMsg('ERROR', 'Unable to Save Record Set');
            this.HandleMessage(true, MessageType.Error, 'Unable to Save Record Set');
          }

        },
        err => {
          this.isLoading = false;
          // this.showAlertMsg('ERROR', 'Unable to Update Data');
          this.HandleMessage(true, MessageType.Error, 'Unable to Update Data');
        }
      );
    }
  }


  public DateFormatting(dateVal: Date): any {
    let dt: Date;
    dt = new Date(Date.UTC(dateVal.getFullYear(), dateVal.getMonth(), dateVal.getDate(), dateVal.getHours(), dateVal.getMinutes()));
    return dt;
  }






 

 SetInttTfrType(_opern_Type:any,_acc_type_cd:any){
    console.log({"_opern_Type":_opern_Type,"_acc_type_cd":_acc_type_cd});
    
       if(_opern_Type == 'I'){
                switch(_acc_type_cd){
                  case 5:this.tm_deposit.intt_trf_type = this.intTransferType[0].tfr_type;
                           this.tm_deposit.intt_tfr_type_dscr = this.intTransferType[0].tfr_desc;
                          break;
                  case 2:this.tm_deposit.intt_trf_type = this.intTransferType[4].tfr_type;
                           this.tm_deposit.intt_tfr_type_dscr = this.intTransferType[4].tfr_desc;
                            break;
                  case 3:this.tm_deposit.intt_trf_type = this.intTransferType[4].tfr_type;
                          this.tm_deposit.intt_tfr_type_dscr = this.intTransferType[4].tfr_desc;
                           break;
                  case 4:this.tm_deposit.intt_trf_type = this.intTransferType[4].tfr_type;
                          this.tm_deposit.intt_tfr_type_dscr = this.intTransferType[4].tfr_desc;
                          break;
                  default:break;

                }
                // console.log({"trfType":this.tm_deposit.intt_trf_type})
       }
  }




  

  setTransType(tt: any) {
    // this.transTypeFlg = val;

    
    if (this.td_deftrans.trf_type === 'T') {
      // const deno: tm_denomination_trans[] = [];
      // this.tm_denominationList = deno;
      for (const l in this.tm_denominationList) {
        console.log(l);
        
        this.tm_denominationList = this.tm_denominationList.splice(Number(l), 1);
      }
      this.denominationGrandTotal = 0;
    }

    this.td_deftrans.trf_type = tt;
    this.td_deftrans.trf_type_desc = this.transferTypeList.filter(x => x.trf_type.toString() === tt)[0]?.trf_type_desc;
     console.log(this.td_deftranstrfList);
  }


  setRelationship(relation: string, idx: number) {

    this.td_accholderList[idx].cust_cd = Number(this.td_accholderList[idx].cust_cd);
    this.td_accholderList[idx].relation = relation;
    // this.td_accholderList[idx].relationId = this.relationship.filter(x => x.val.toString() === relation)[0].id;

  }

  setIntTfrType(tfr_type: string) {
   console.log(tfr_type);

    if (tfr_type == null) {
      return;
    }

    this.tm_deposit.intt_trf_type = tfr_type;
    this.tm_deposit.intt_tfr_type_dscr = this.intTransferType.filter(x => x.tfr_type.toString()
      === tfr_type.toString())[0].tfr_desc;
  }

  setConstitutionType(val: number) {
    console.log(this.constitutionList,this.tm_deposit.acc_type_cd)
    this.tm_deposit.constitution_cd = Number(val);
    this.tm_deposit.constitution_desc = this.constitutionList.
      filter(x => x.constitution_cd.toString() === val.toString() && this.tm_deposit.acc_type_cd === x.acc_type_cd)[0].constitution_desc;
    this.tm_deposit.acc_cd = this.constitutionList.
      filter(x => x.constitution_cd.toString() === val.toString() && this.tm_deposit.acc_type_cd === x.acc_type_cd)[0].acc_cd;
      console.log(this.tm_deposit.constitution_desc,this.tm_deposit.acc_cd)
  }

  setOperationalInstr(val: number) {
    debugger
    if(val>0){
      this.tm_deposit.oprn_instr_cd = Number(val);
      this.tm_deposit.oprn_instr_desc = this.operationalInstrList.filter(x => x.oprn_cd.toString() === val.toString())[0].oprn_desc;
    }
    else {return;}
    
    debugger
    }


  getCategoryList() {
    var dt={
      "ardb_cd":this.sys.ardbCD
    }
    this.svc.addUpdDel<any>('Mst/GetCategoryMaster', dt).subscribe(
      res => {
        // ;
        this.categoryList = res;
      },
      err => {
        // ;
      }
    );
  }


  // public suggestCustomer(): void {
  //   this.suggestedCustomer = this.customerList
  //     .filter(c => c.cust_name.toLowerCase().startsWith(this.tm_locker.name.toLowerCase())
  //       || c.cust_cd.toString().startsWith(this.tm_locker.name)
  //       || (c.phone !== null && c.phone.startsWith(this.tm_locker.name)))
  //     .slice(0, 20);
  // }
  onChangeNull(){
    this.suggestedCustomer = null;
    this.suggestedLocker = null;
    this.showNoResult=false;
    if(this.tm_locker.name.length > 2){this.disabledOnNull=false}
    else{this.disabledOnNull=true}
  }
  public suggestCustomer(): void {
    if (this.tm_locker.name.length > 2) {
      const prm = new p_gen_param();
      this.isLoading=true;
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.tm_locker.name.toLowerCase();
      prm.ardb_cd=this.sys.ardbCD
      if(prm.as_cust_name.length>0){
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          this.isLoading=false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.showNoResult=false;
            this.suggestedCustomer = res
          } else {
            this.showNoResult=false;

            this.suggestedCustomer = [];
          }
        },
        err => { this.isLoading = false; }
      );
      }
    } else {
      this.showNoResult=false;

      this.suggestedCustomer = null;
    }
  }

  // public suggestCustomerSignatories(idx: number): void {

  //   this.suggestedCustomerSignatoriesIdx = idx;
  //   this.suggestedCustomerSignatories = this.customerList
  //     .filter(c => c.cust_name.toLowerCase().startsWith(this.td_signatoryList[idx].signatory_name.toLowerCase())
  //       || c.cust_cd.toString().startsWith(this.td_signatoryList[idx].signatory_name)
  //       || (c.phone !== null && c.phone.startsWith(this.td_signatoryList[idx].signatory_name)))
  //     .slice(0, 10);
  // }

  public suggestCustomerSignatories(idx: number): void {  
    this.suggestedCustomerSignatoriesIdx = idx;
    if (this.td_signatoryList[idx].signatory_name.toString().length > 2) {
      const prm = new p_gen_param();
      prm.as_cust_name = this.td_signatoryList[idx].signatory_name.toString().toLowerCase();
      prm.ardb_cd=this.sys.ardbCD
      this.isLoading = true;
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          //debugger;
          this.isLoading = false;
          if (undefined !== res && null !== res && res.length > 0) {
            // this.suggestedCustomerSignatories = res.slice(0, 20);
            this.suggestedCustomerSignatories = res;
          } else {
            this.suggestedCustomerSignatories = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomerSignatories = null;
    }
  }

  public setCustDtlsSignatories(cust_cd: number, idx: number): void {
    console.log({"Cust_cd":cust_cd,"Index":idx,"suggestedCustomerSignatories":this.suggestedCustomerSignatories});
    
    this.td_signatoryList[idx].signatory_name = this.suggestedCustomerSignatories.filter(c => c.cust_cd.toString() === cust_cd.toString())[0].cust_name;
    this.suggestedCustomerSignatories = null;
  }

  // public suggestCustomerJointHolder(idx: number): void {
  //   this.suggestedCustomerJointHolderIdx = idx;
  //   this.suggestedCustomerJointHolder = this.customerList
  //     .filter(c => c.cust_name.toLowerCase().startsWith(this.td_accholderList[idx].cust_cd.toString())
  //       || c.cust_cd.toString().startsWith(this.td_accholderList[idx].cust_cd.toString())
  //       || (c.phone !== null && c.phone.startsWith(this.td_accholderList[idx].cust_cd.toString())))
  //     .slice(0, 10);
  // }
  enableSearch(idx: number){
    if(this.td_accholderList[idx].acc_holder.toString().length>2){
      this.disablejoinholder=false

    }
    else if(this.td_accholderList[idx].acc_holder.toString().length==0){
      this.suggestedCustomerJointHolder = null;
      this.disablejoinholder=true
      this.hidejoin=true;
    }
    else{
      this.disablejoinholder=true

    }
  }
  public suggestCustomerJointHolder(idx: number): void {
    this.suggestedCustomerJointHolderIdx = idx;

    if (this.td_accholderList[idx].acc_holder.toString().length > 2) {
      const prm = new p_gen_param();
      prm.as_cust_name = this.td_accholderList[idx].acc_holder.toString().toLowerCase();
      prm.ardb_cd=this.sys.ardbCD
       this.isLoading = true;
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          console.log(res);
          
          //debugger;
          this.isLoading = false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomerJointHolder = res
            this.hidejoin=false;
          } else {
            this.suggestedCustomerJointHolder = null;
            this.hidejoin=true;
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomerJointHolder = null;
    }
  }


  public setCustDtlsJointHolder(cust_cd: number, idx: number): void {
    console.log({"Cust_id":cust_cd,"Index":idx,"Name":this.td_accholderList[idx].acc_holder});
    this.td_accholderList[idx].cust_cd = cust_cd;
    this.getSetJointHolderName(idx);
    this.hidejoin=true;
    this.suggestedCustomerJointHolder = [];

    this.addSignatory();
    this.td_signatoryList[idx+1].signatory_name =  this.td_accholderList[idx].acc_holder;
    this.td_signatoryList[idx+1].ardb_cd = this.sys.ardbCD;
    this.td_signatoryList[idx+1].brn_cd = this.branchCode;
    this.td_signatoryList[idx+1].cust_cd = cust_cd;
    console.log({"jointHolderLength": this.td_accholderList.length, "signatoryLength":this.td_signatoryList});
    
  }


  // getSetJointHolderName(idx: number) {
  //   let temp_mm_cust = new mm_customer();
  //   temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === this.td_accholderList[idx].cust_cd.toString())[0];

  //   if (!temp_mm_cust) {
  //     this.td_accholderList[idx].cust_cd = null;
  //     this.td_accholderList[idx].acc_holder = null;
  //     // this.showAlertMsg('ERROR', 'Joint Holder Customer Not Found');
  //     this.HandleMessage(true, MessageType.Error, 'Joint Holder Customer Not Found');
  //     return;
  //   }

  //   if (temp_mm_cust.cust_cd === this.tm_locker.cust_cd) {
  //     this.td_accholderList[idx].cust_cd = null;
  //     this.td_accholderList[idx].acc_holder = null;
  //     // this.showAlertMsg('ERROR', 'First Holder and Joint Holder can not be same');
  //     this.HandleMessage(true, MessageType.Error, 'First Holder and Joint Holder can not be same');
  //     return;
  //   }

  //   this.td_accholderList[idx].cust_cd = Number(this.td_accholderList[idx].cust_cd);
  //   this.td_accholderList[idx].acc_holder = temp_mm_cust.cust_name;
  // }


  getSetJointHolderName(idx: number) {
    let temp_mm_cust = new mm_customer();

    if (this.suggestedCustomerJointHolder != undefined && this.suggestedCustomerJointHolder != null && this.suggestedCustomerJointHolder.length > 0) {
      this.hidejoin=false;
      temp_mm_cust = this.suggestedCustomerJointHolder.filter(c => c.cust_cd.toString() === this.td_accholderList[idx].cust_cd.toString())[0];
    }

    if (!temp_mm_cust) {
      this.td_accholderList[idx].cust_cd = null;
      this.td_accholderList[idx].acc_holder = null;
      this.hidejoin=true;

      // this.showAlertMsg('ERROR', 'Joint Holder Customer Not Found');
      this.HandleMessage(true, MessageType.Error, 'Joint Holder Customer Not Found');
      return;
    }

    if (temp_mm_cust.cust_cd === this.tm_locker.cust_cd) {
      this.hidejoin=true;
      this.td_accholderList[idx].cust_cd = null;
      this.td_accholderList[idx].acc_holder = null;
      // this.showAlertMsg('ERROR', 'First Holder and Joint Holder can not be same');
      this.HandleMessage(true, MessageType.Error, 'First Holder and Joint Holder can not be same');
      return;
    }

    this.td_accholderList[idx].cust_cd = Number(this.td_accholderList[idx].cust_cd);
    this.td_accholderList[idx].acc_holder = temp_mm_cust.cust_name;
    this.hidejoin=true;

  }



  public setCustDtls(cust_cd: number): void {
    this.tm_locker.cust_cd = cust_cd;
    this.tm_deposit.ardb_cd=this.sys.ardbCD
    // this.msg.sendcustomerCodeForKyc(cust_cd);
    this.getSetCustDtls(cust_cd);
  }

  getSetCustDtls(cust_cd: number) {

    let temp_mm_cust = new mm_customer();
    const temp_tm_deposit = new tm_deposit();
    temp_tm_deposit.cust_cd = cust_cd;
    temp_tm_deposit.ardb_cd=this.sys.ardbCD
    if (this.suggestedCustomer != undefined && this.suggestedCustomer != null && this.suggestedCustomer.length > 0) {
      temp_mm_cust = this.suggestedCustomer.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
      this.suggestedCustomer = null;
      this.populateCustDtls(temp_mm_cust);
    }
    else {
      // //debugger;
    console.log("saas")
      this.isLoading = true;
      temp_mm_cust.cust_cd = cust_cd;
      temp_mm_cust.ardb_cd=this.sys.ardbCD
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', temp_mm_cust).subscribe(
        res => {
          //debugger;
          this.suggestedCustomer = res;

          if (this.suggestedCustomer != undefined && this.suggestedCustomer != null && this.suggestedCustomer.length > 0) {
            temp_mm_cust = this.suggestedCustomer.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
            this.suggestedCustomer = null;
            this.populateCustDtls(temp_mm_cust);
          }
          this.isLoading = false;
        },
        err => { this.isLoading = false; }
      );
    }

    // temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];

    // if (this.operationType === 'I') {
    //   console.log("asdasdasd")
    //   this.isLoading = true;
    //   this.svc.addUpdDel<any>('Deposit/GetCustMinSavingsAccNo', temp_tm_deposit).subscribe(
    //     res => {
    //       this.isLoading = false;
    //       const x = res;
    //       this.tm_deposit.user_acc_num = x.toString();
    //       console.log(this.tm_deposit)
    //     },
    //     err => {
    //       this.isLoading = false;
    //       this.tm_deposit.user_acc_num = null;
    //     }
    //   );
    // }
  }

  populateCustDtls(temp_mm_cust: mm_customer) {
    console.log(temp_mm_cust.acc_num)
    this.tm_locker.name = temp_mm_cust.cust_name;
    this.tm_locker.occupation = temp_mm_cust.occupation;
    this.tm_locker.present_address = temp_mm_cust.present_address;
    this.tm_locker.phone = temp_mm_cust.phone;
    if (temp_mm_cust.cust_type === 'M') {
      this.tm_deposit.cust_type = 'Member';
    }
    else {
      this.tm_deposit.cust_type = 'Non-Member';
    }
    this.tm_deposit.gurdain_name = temp_mm_cust.guardian_name;

    this.tm_deposit.date_of_birth = temp_mm_cust.dt_of_birth;

    this.tm_deposit.sex = temp_mm_cust.sex;
    this.tm_deposit.sexType = this.sexType.filter(c => c.type.toString() === this.tm_deposit.sex.toString())[0].desc;

    this.tm_deposit.phone = temp_mm_cust.phone;
    this.tm_deposit.ardb_cd=this.sys.ardbCD
    this.tm_deposit.occupation = temp_mm_cust.occupation;
    this.tm_deposit.email = temp_mm_cust.email;
    this.tm_deposit.present_addr = temp_mm_cust.present_address;

    this.tm_deposit.category_cd = temp_mm_cust.catg_cd;
    this.setCategoryDesc(this.tm_deposit.category_cd);
    console.log(this.tm_deposit)

    if (this.operationType === 'I') {
      this.td_signatoryList[0].cust_cd = temp_mm_cust.cust_cd;
      this.td_signatoryList[0].signatory_name = temp_mm_cust.cust_name;
      this.td_signatoryList[0].brn_cd = this.branchCode;
    }
  }
  setAgent(){
    this.ddsAgent=this.tm_deposit.agent_cd
    debugger
  }
  setCategoryDesc(category: number) {
    this.tm_deposit.category_desc = this.categoryList.filter(x => x.catg_cd.toString()
      === category.toString())[0].catg_desc;
  }

  addSignatory() {
    const temp_td_signatory = new td_signatory();
    this.td_signatoryList.push(temp_td_signatory);
    console.log(this.td_signatoryList);
    
  }

  removeSignatory() {
    if (this.td_signatoryList.length > 1) {
      this.td_signatoryList.pop();
    }
  }

  addJointHolder() {
    const temp_td_accholder = new td_accholder();
    this.td_accholderList.push(temp_td_accholder);
  }

  removeJointHolder() {
    if (this.td_accholderList.length > 1) {
      this.removeSignatoryByIndex(this.td_accholderList[(this.td_accholderList.length-1)].cust_cd);
      this.td_accholderList.pop()
    }
  }
  removeSignatoryByIndex(cust_cd:Number){
    var Index = this.td_signatoryList.findIndex((x:td_signatory) => x.cust_cd == cust_cd );
    this.td_signatoryList.splice(Index,1);   
  }


  checkSignatory(name: string, idx: number) {
    const x = this.td_accholderList.filter(c => c.acc_holder.toString() === name.toString())[0].cust_cd;


    if (!x) {
      this.td_signatoryList[idx].signatory_name = null;
      // this.showAlertMsg('ERROR', 'Signatory is not a Joint Holder');
      this.HandleMessage(true, MessageType.Error, 'Signatory is not a Joint Holder');
    }
  }




  addIntroducer() {
    const temp_td_introducer = new td_introducer();
    this.td_introducerlist.push(temp_td_introducer);
  }

  removeIntroducer() {
    if (this.td_introducerlist.length > 1) {
      this.td_introducerlist.pop();
    }
  }

  setIntroducerAccountType(intro_acc_typ_cd: number, idx: number) {

    if (intro_acc_typ_cd != null && intro_acc_typ_cd > 0) {
      this.td_introducerlist[idx].introducer_acc_type = Number(intro_acc_typ_cd);
      this.td_introducerlist[idx].introducer_acc_type_desc = this.introducerAccTypeList
        .filter(x => x.introducer_acc_type_cd.toString() ===
          intro_acc_typ_cd.toString())[0].introducer_acc_type_desc;
    }
  }


  setIntroducerName(idx: number) {

    if (this.td_introducerlist[idx].introducer_acc_type === null || this.td_introducerlist[idx].introducer_acc_type === undefined) {
      // this.showAlertMsg('ERROR', 'Introducer Account Type can not be blank');
      this.HandleMessage(true, MessageType.Error, 'Introducer Account Type can not be blank');
      this.td_introducerlist[idx].introducer_acc_num = null;
      return;
    }

    let temp_deposit_list: tm_deposit[] = [];
    const temp_deposit = new tm_deposit();

    temp_deposit.brn_cd = this.branchCode;
    temp_deposit.acc_num = this.td_introducerlist[idx].introducer_acc_num;
    temp_deposit.acc_type_cd = this.td_introducerlist[idx].introducer_acc_type;
    temp_deposit.ardb_cd=this.sys.ardbCD
    this.isLoading = true;
    //debugger;
    this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
      res => {
        //debugger;
        temp_deposit_list = res;
        this.isLoading = false;
        if (temp_deposit_list.length === 0) {
          this.td_introducerlist[idx].introducer_acc_num = null;
          this.td_introducerlist[idx].introducer_name = null;
          this.td_introducerlist[idx].acc_type_cd = null;
          // this.showAlertMsg('ERROR', 'Introducer Not Found');
          this.HandleMessage(true, MessageType.Error, 'Introducer Not Found');
          return;
        }

        this.getIntroducerName(temp_deposit_list[0].cust_cd, idx);

        // let temp_mm_cust = new mm_customer();
        // temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === temp_deposit_list[0].cust_cd.toString())[0];
        // this.td_introducerlist[idx].introducer_name = temp_mm_cust.cust_name;
      },
      err => {
        //debugger;
        this.isLoading = false;
      }
    );
  }

  getIntroducerName(cust_cd: number, idx: number) {
    //debugger;
    let temp_mm_cust = new mm_customer();
    let temp_mm_cust_list: mm_customer[] = [];
    temp_mm_cust.cust_cd = cust_cd;
    temp_mm_cust.ardb_cd=this.sys.ardbCD
    this.isLoading = true;
    this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', temp_mm_cust).subscribe(
      res => {
        //debugger;
        temp_mm_cust_list = res;

        if (temp_mm_cust_list != undefined && temp_mm_cust_list != null && temp_mm_cust_list.length > 0) {
          temp_mm_cust = temp_mm_cust_list.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
          this.td_introducerlist[idx].introducer_name = temp_mm_cust.cust_name;
        }
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }

  addNominee() {
    const temp_td_nominee = new td_nominee();
    this.td_nomineeList.push(temp_td_nominee);
  }

  removeNominee() {
    if (this.td_nomineeList.length > 1) {
      this.td_nomineeList.pop();
    }
  }

  addDenomination() {
    const temp_denomination = new tm_denomination_trans();
    this.tm_denominationList.push(temp_denomination);
  }

  removeDenomination() {
    if (this.tm_denominationList.length > 1) {
      this.tm_denominationList.pop();
    }
  }

  setDenomination(val: number, idx: number) {

    // this.tm_denominationList[idx].rupees = Number(val);
    // this.tm_denominationList[idx].rupees_desc = this.denominationList.filter(x => x.value.toString()
    //   === val.toString())[0].rupees;
    // this.calculateTotalDenomination(idx);
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



  checkNomineePercentage(idx: number) {

    let tot = 0;

    for (const l of this.td_nomineeList) {
      tot = tot + Number(l.percentage);
    }

    if (tot > 100) {
      // this.showAlertMsg('ERROR', 'Nominee Total Percentage exceeding 100');
      this.HandleMessage(true, MessageType.Error, 'Nominee Total Percentage exceeding 100');
      this.td_nomineeList[idx].percentage = 0;
    }

    this.td_nomineeList[idx].nom_id = Number(idx) + 1;
    this.td_nomineeList[idx].percentage = Number(this.td_nomineeList[idx].percentage);

  }


  checkAndSetDebitAccType(tfrType: string, tdDefTransTrnsfr: td_def_trans_trf) {
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

  setDebitAccDtls(acc_num: string) {

    if (this.td_deftranstrfList[0].cust_acc_type === undefined ||
      this.td_deftranstrfList[0].cust_acc_type === null ||
      this.td_deftranstrfList[0].cust_acc_type === '') {
      // this.showAlertMsg('WARNING', 'Account Type in Transfer Details can not be blank');
      this.HandleMessage(true, MessageType.Warning, 'Account Type in Transfer Details can not be blank');
      this.td_deftranstrfList[0].cust_acc_number = null;
      exit(0);
    }

    if (this.td_deftranstrfList[0].cust_acc_number === undefined ||
      this.td_deftranstrfList[0].cust_acc_number === null ||
      this.td_deftranstrfList[0].cust_acc_number === '') {
      this.td_deftranstrfList[0].cust_name = null;
      this.td_deftranstrfList[0].clr_bal = null;
      exit(0);
    }


    let temp_deposit_list: tm_deposit[] = [];
    const temp_deposit = new tm_deposit();

    temp_deposit.brn_cd = this.branchCode;
    temp_deposit.acc_num = this.td_deftranstrfList[0].cust_acc_number;
    temp_deposit.acc_type_cd = parseInt(this.td_deftranstrfList[0].cust_acc_type);
    temp_deposit.ardb_cd=this.sys.ardbCD
    // //debugger;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
      res => {
        //debugger;

        temp_deposit_list = res;
        this.isLoading = false;
      
        if (temp_deposit_list.length === 0) {
          // this.showAlertMsg('WARNING', '');
          this.HandleMessage(true, MessageType.Warning, 'Invalid Account Number in Transfer Details');
          this.td_deftranstrfList[0].cust_acc_number = null;
          exit(0);
        }

        // let temp_mm_cust = new mm_customer();
        // temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === temp_deposit_list[0].cust_cd.toString())[0];
        // this.td_deftranstrfList[0].cust_name = temp_mm_cust.cust_name;
           
        this.td_deftranstrfList[0].clr_bal = temp_deposit_list[0].clr_bal;
        this.td_deftranstrfList[0].acc_cd = this.constitutionList.filter(x => x.acc_type_cd.toString() ===
          temp_deposit.acc_type_cd.toString()
          && x.constitution_cd.toString() === temp_deposit_list[0].constitution_cd.toString())[0].acc_cd;
          console.log(this.td_deftranstrfList[0].acc_cd);     
        let temp_mm_cust = new mm_customer();
        temp_mm_cust.cust_cd = temp_deposit_list[0].cust_cd;
        temp_mm_cust.ardb_cd=this.sys.ardbCD;
        this.isLoading = true;
        this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', temp_mm_cust).subscribe(
          res => {

            this.isLoading = false;
            this.customerList = res;
            if (this.customerList !== undefined && this.customerList.length > 0) {
              this.td_deftranstrfList[0].cust_name = this.customerList[0].cust_name;
              this.customerList = null;
            }
          },
          err => {
            this.isLoading = false;

          }
        );

      },
      err => {

        this.isLoading = false;
      }
    );
  }


  checkDebitBalance(amount: number) {

    if (this.td_deftranstrfList[0].amount === undefined || this.td_deftranstrfList[0].amount === null) {
      exit(0);
    }

    if ((this.td_deftranstrfList[0].cust_acc_number === undefined
      || this.td_deftranstrfList[0].cust_acc_number === null ||
      this.td_deftranstrfList[0].cust_acc_number === '')
      && (this.td_deftranstrfList[0].gl_acc_code === undefined ||
        this.td_deftranstrfList[0].gl_acc_code === null ||
        this.td_deftranstrfList[0].gl_acc_code === '')) {
      // this.showAlertMsg('WARNING', 'Please enter Account Number or GL Code');
      this.HandleMessage(true, MessageType.Warning, 'Please enter Account Number or GL Code');
      this.td_deftranstrfList[0].amount = null;
      exit(0);
    }

      if (this.td_deftranstrfList[0].amount!=this.ldtf.tot_amount.value) {
        // this.showAlertMsg('WARNING', 'Debit Amount is not matching with Installment Amount');
        this.HandleMessage(true, MessageType.Warning, 'Transaction Amount is not matching with Rent Amount');
        exit(0);
      }
      this.sumTransfer();

  }

  validateSbAccount() {
    //debugger;
    
    if (this.tm_deposit.user_acc_num === undefined
      || this.tm_deposit.user_acc_num === null
      || this.tm_deposit.user_acc_num === "") {
      return;
    }

    let temp_deposit_list: tm_deposit[] = [];
    const temp_deposit = new tm_deposit();
    temp_deposit.brn_cd = this.branchCode;
    temp_deposit.acc_num = this.tm_deposit.user_acc_num;
    temp_deposit.acc_type_cd = (this.sys.ardbCD=="20" || this.sys.ardbCD=="26")? 1:8;
    temp_deposit.ardb_cd=this.sys.ardbCD;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
      res => {
        //debugger;
        temp_deposit_list = res;
        this.isLoading = false;

        if (temp_deposit_list.length > 0) {
          temp_deposit_list = temp_deposit_list.filter(x => x.acc_status.toUpperCase() !== 'C')
        }

        if (temp_deposit_list.length === 0) {
          this.HandleMessage(true, MessageType.Warning, 'Invalid Account Number for Standing Instruction');
          this.tm_deposit.user_acc_num = null;
          exit(0);
        }

      },
      err => {
        this.isLoading = false;
      }
    );
  }

  setStandingInstrAfterMatu(val: number) {
    this.tm_deposit.standing_instr_flag = val.toString();
    console.log({"arr":this.standingInstrAfterMaturity,"checked":val.toString()});
    
    this.tm_deposit.standing_instr_dscr = this.standingInstrAfterMaturity.filter(x => x.instr_code === val.toString())[0].instr_dscr;
  }

  private depositPeriodParser(constitutionText: string) {
    /// YEAR=1;Month=10;Days=25;
    if (constitutionText == null) {
      return null;
    }
    const arr = constitutionText.split(';');
    const arrToReturn = [];
    arr.forEach(element => {
      arrToReturn.push(element.split('=').pop());
    });

    return arrToReturn;
  }


  processInstallmentNo() {

    const temp_gen_param1 = new p_gen_param();
    const temp_gen_param2 = new p_gen_param();


    if (this.tm_deposit.category_cd === undefined || this.tm_deposit.category_cd === null) {
      // this.showAlertMsg('ERROR', 'Interest Rate Cannot Be Fixed!!!...Category Not Yet Mentioned.');
      this.HandleMessage(true, MessageType.Error, 'Interest Rate Cannot Be Fixed!!!...Category Not Yet Mentioned.');
      return;
    }

    // const dt = this.tm_deposit.opening_dt;
    // this.tm_deposit.mat_dt = null;

    this.td_deftrans.amount = Number(this.tm_deposit.instl_amt);
    // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate);
    this.tm_deposit.mat_dt = this.sys.CurrentDate;
    this.tm_deposit.ardb_cd=this.sys.ardbCD
    this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + Number(this.tm_deposit.instl_no));

    this.tm_deposit.prn_amt = Number(this.tm_deposit.instl_no) * Number(this.tm_deposit.instl_amt);
 
    temp_gen_param1.ad_instl_amt = Number(this.tm_deposit.instl_amt);
    temp_gen_param1.an_instl_no = Number(this.tm_deposit.instl_no);
    temp_gen_param1.an_intt_rate = Number(this.tm_deposit.intt_rt);

    temp_gen_param2.acc_cd = this.tm_deposit.acc_type_cd;
    // temp_gen_param2.from_dt = this.DateFormatting(this.openDate);
    temp_gen_param2.from_dt = this.sys.CurrentDate;

    temp_gen_param2.ls_catg_cd = this.tm_deposit.category_cd;


    if (typeof (this.tm_deposit.opening_dt) === 'string') {
      this.tm_deposit.opening_dt = Utils.convertStringToDt(this.tm_deposit.opening_dt);
    }

    if (typeof (this.tm_deposit.mat_dt) === 'string') {
      this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
    }


    // tslint:disable-next-line: max-line-length
    // temp_gen_param2.ai_period = Math.floor(Date.UTC(this.tm_deposit.mat_dt.getFullYear(), this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) - (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(), this.tm_deposit.opening_dt.getDate()) ) / (1000 * 60 * 60 * 24));
    temp_gen_param2.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(),
      this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) -
      (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(),
        this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24));



    if (temp_gen_param1.an_intt_rate > 0) {
      this.calCrdIntReg(temp_gen_param1);
    }
    else {
      //                               uf_GetInttRate
      this.svc.addUpdDel<any>('Deposit/GET_INT_RATE', temp_gen_param2).subscribe(
        res => {

          this.tm_deposit.intt_rt = Number(res);
          temp_gen_param1.an_intt_rate = this.tm_deposit.intt_rt;
          this.calCrdIntReg(temp_gen_param1);
        },
        err => {

        }
      );
    }
  }


  processInstallmentAmount() {

    const temp_gen_param = new p_gen_param();

    this.tm_deposit.prn_amt = Number(this.tm_deposit.instl_no) * Number(this.tm_deposit.instl_amt);

    temp_gen_param.ad_instl_amt = Number(this.tm_deposit.instl_amt);
    temp_gen_param.an_instl_no = Number(this.tm_deposit.instl_no);
    temp_gen_param.an_intt_rate = Number(this.tm_deposit.intt_rt);
    temp_gen_param.ardb_cd=this.sys.ardbCD;
    this.calCrdIntReg(temp_gen_param);
  }


  calCrdIntReg(tempGenParam: p_gen_param) {
    this.isLoading = true;
    tempGenParam.ardb_cd=this.sys.ardbCD
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


  reProcessPrincipal() {
    if ((this.tm_deposit.acc_type_cd !== 1) &&
      (this.tm_deposit.acc_type_cd !== 7) &&
      (this.tm_deposit.acc_type_cd !== 13) &&
      (this.tm_deposit.prn_amt > 0)) {
      this.processPrincipal();
    }
  }
  gstChange(){
    this.ldtf.tot_amount.setValue((+this.ldtf.rent.value) + (+this.ldtf.gst.value))
  }
  processPrincipal() {

    if ((this.tm_deposit.acc_type_cd !== 1) && (this.tm_deposit.acc_type_cd !== 7) && (this.tm_deposit.acc_type_cd !== 13)) {

      if (this.tm_deposit.year === undefined || this.tm_deposit.year === null) {
        this.tm_deposit.year = 0;
      }

      if (this.tm_deposit.month === undefined || this.tm_deposit.month === null) {
        this.tm_deposit.month = 0;
      }

      if (this.tm_deposit.day === undefined || this.tm_deposit.day === null) {
        this.tm_deposit.day = 0;
      }
  
       /* FOR FLEXI*/
      // if (this.tm_deposit.year === 0 && this.tm_deposit.month === 0 && this.tm_deposit.day === 0) {
      //   this.tm_deposit.prn_amt = 0;
      //   this.HandleMessage(true, MessageType.Error, 'Please enter Deposit period');
      //   return;
      // }
      /*END*/ 

      if (this.tm_deposit.acc_type_cd === undefined ||
        this.tm_deposit.acc_type_cd === null ||
        this.tm_deposit.acc_type_cd < 0) {
        this.tm_deposit.prn_amt = 0;
        // this.showAlertMsg('Warning', 'Account Type can not be blank');
        this.HandleMessage(true, MessageType.Error, 'Account Type can not be blank');
        return;
      }

      //FLEXI DEPOSIT
      // if (this.tm_deposit.intt_trf_type === undefined ||
      //   this.tm_deposit.intt_trf_type === null) {
      //   this.tm_deposit.prn_amt = 0;
      //   this.HandleMessage(true, MessageType.Error, 'Interest Transfer Type can not be blank');
      //   return;
      // }
      //END
      
      //FLEXI DEPOSIT
      // if (this.tm_deposit.intt_rt === undefined || this.tm_deposit.intt_rt === null || this.tm_deposit.intt_rt <= 0) {
      //   this.tm_deposit.prn_amt = 0;
      //   this.HandleMessage(true, MessageType.Error, 'Please set the Interest Rate..');
      //   return;
      // }
       //END
      
      if (this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null || this.tm_deposit.prn_amt <= 0) {
        this.tm_deposit.prn_amt = 0;
        this.tm_deposit.intt_amt = 0;
        this.HandleMessage(true, MessageType.Error, 'Please set the Principal..');
        return;
      }



      // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      // this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
      // this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
      // this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);


      const temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;
      temp_gen_param.ad_prn_amt = this.tm_deposit.prn_amt;
      temp_gen_param.adt_temp_dt = this.tm_deposit.opening_dt;
      temp_gen_param.as_intt_type = this.tm_deposit.intt_trf_type;
      temp_gen_param.ardb_cd=this.sys.ardbCD
      // tslint:disable-next-line: max-line-length

      if (typeof (this.tm_deposit.opening_dt) === 'string') {
        this.tm_deposit.opening_dt = Utils.convertStringToDt(this.tm_deposit.opening_dt);
      }

      if (typeof (this.tm_deposit.mat_dt) === 'string') {
        this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
      }

      temp_gen_param.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(),
        this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) -
        (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(),
          this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24));
      temp_gen_param.ad_intt_rt = this.tm_deposit.intt_rt;


      this.f_calctdintt_reg(temp_gen_param);

      // this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
      //   res => {
      //     ;
      //     this.tm_deposit.intt_amt = res;
      //     this.tm_deposit.mat_val = Number(this.tm_deposit.intt_amt) + Number(this.tm_deposit.prn_amt);
      //     ;
      //     this.isLoading = false;
      //   },
      //   err => {
      //     this.isLoading = false;
      //     ;
      //   }
      // );
    }
  }

  f_calctdintt_reg(temp_gen_param: p_gen_param) {
    this.isLoading = true;
    // //debugger;
    this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
      res => {
        this.tm_deposit.intt_amt = res;
        this.tm_deposit.mat_val = (+this.tm_deposit.intt_amt) + (+this.tm_deposit.prn_amt);
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        console.log(err);

      }
    );
  }

  processInterest() {
    const temp_gen_param = new p_gen_param();

    temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;

    if (this.tm_deposit.acc_type_cd === 6) {
      if (this.tm_deposit.instl_amt === undefined || this.tm_deposit.instl_amt === null ||
        this.tm_deposit.instl_no === undefined || this.tm_deposit.instl_no === null ||
        this.tm_deposit.intt_rt === undefined || this.tm_deposit.intt_rt === null)
      // temp_gen_param.an_intt_rate === undefined || temp_gen_param.an_intt_rate === null )
      {
        return;
      }

      temp_gen_param.ad_instl_amt = Number(this.tm_deposit.instl_amt);
      temp_gen_param.an_instl_no = Number(this.tm_deposit.instl_no);
      temp_gen_param.an_intt_rate = Number(this.tm_deposit.intt_rt);
      this.calCrdIntReg(temp_gen_param);
    }
    else {

      if (((this.tm_deposit.year === undefined || this.tm_deposit.year === null) &&
        (this.tm_deposit.month === undefined || this.tm_deposit.month === null) &&
        (this.tm_deposit.day === undefined || this.tm_deposit.day === null)) ||
        this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null || this.tm_deposit.prn_amt === 0 ||
        this.tm_deposit.intt_trf_type === undefined || this.tm_deposit.intt_trf_type === null) {
        return;
      }


      // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      // this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
      // this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
      // this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);


      // var temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;
      temp_gen_param.ad_prn_amt = this.tm_deposit.prn_amt;
      temp_gen_param.adt_temp_dt = this.tm_deposit.opening_dt;
      temp_gen_param.as_intt_type = this.tm_deposit.intt_trf_type;
      // tslint:disable-next-line: max-line-length
      if (typeof (this.tm_deposit.opening_dt) === 'string') {
        this.tm_deposit.opening_dt = Utils.convertStringToDt(this.tm_deposit.opening_dt);
      }

      if (typeof (this.tm_deposit.mat_dt) === 'string') {
        this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
      }

      temp_gen_param.ai_period =
        Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(),
          this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) -
          (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(),
            this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24));
      temp_gen_param.ad_intt_rt = this.tm_deposit.intt_rt;

      this.f_calctdintt_reg(temp_gen_param);
    }
  }

  processYearMonthDay() {
    const temp_gen_param = new p_gen_param();


    this.tm_deposit.mat_dt = this.sys.CurrentDate;
    // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;

    if (this.tm_deposit.year === undefined || this.tm_deposit.year === null) {
      this.tm_deposit.year = 0;
    }

    if (this.tm_deposit.month === undefined || this.tm_deposit.month === null) {
      this.tm_deposit.month = 0;
    }

    if (this.tm_deposit.day === undefined || this.tm_deposit.day === null) {
      this.tm_deposit.day = 0;
    }

    this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
    this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
    this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);

    if (this.operationType === 'I' && (this.tm_deposit.acc_type_cd === 4)||(this.tm_deposit.acc_type_cd === 2)) {

      this.calculateInterestRate();
    }

    if (((this.tm_deposit.year === undefined || this.tm_deposit.year === null) &&
      (this.tm_deposit.month === undefined || this.tm_deposit.month === null) &&
      (this.tm_deposit.day === undefined || this.tm_deposit.day === null)) ||
      this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null ||
      this.tm_deposit.intt_trf_type === undefined || this.tm_deposit.intt_trf_type === null ||
      this.tm_deposit.intt_rt === undefined || this.tm_deposit.intt_rt === null) {
      return;
    }


    // var temp_gen_param = new p_gen_param();
    temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;
    temp_gen_param.ad_prn_amt = this.tm_deposit.prn_amt;
    temp_gen_param.adt_temp_dt = this.tm_deposit.opening_dt;
    temp_gen_param.as_intt_type = this.tm_deposit.intt_trf_type;
    // tslint:disable-next-line: max-line-length
    if (typeof (this.tm_deposit.opening_dt) === 'string') {
      this.tm_deposit.opening_dt = Utils.convertStringToDt(this.tm_deposit.opening_dt);
    }

    if (typeof (this.tm_deposit.mat_dt) === 'string') {
      this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
    }

    temp_gen_param.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(),
      this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) -
      (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(),
        this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24));
    temp_gen_param.ad_intt_rt = this.tm_deposit.intt_rt;

    this.f_calctdintt_reg(temp_gen_param);
  }

  calculateInterestRate() {
    const temp_gen_param2 = new p_gen_param();
    temp_gen_param2.ardb_cd=this.sys.ardbCD;
    temp_gen_param2.acc_cd = 2;
    temp_gen_param2.from_dt = this.sys.CurrentDate;
    temp_gen_param2.ls_catg_cd = this.tm_deposit.category_cd;
    temp_gen_param2.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(),
      this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) -
      (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(),
        this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24)) - 1;
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
        this.tm_deposit.intt_rt = Number(res);
      },
      err => {
        console.log(err);
      }
    );

  }

  backScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }

  deleteData() {
    this.modalRef.hide();
    let n = 1;
    const temp_def_trans_trf = new td_def_trans_trf();

    if (this.operationType !== 'I') {
      // this.showAlertMsg('WARNING', 'Record not retrived to delete');
      this.HandleMessage(true, MessageType.Warning, 'Record not retrieved to delete');
      return;
    }


    temp_def_trans_trf.brn_cd = this.tm_locker.brn_cd;
    temp_def_trans_trf.acc_num = this.tm_locker.agreement_no;
    temp_def_trans_trf.trans_cd = this.td_deftrans.trans_cd;
    temp_def_trans_trf.trans_dt = this.td_deftrans.trans_dt;
    temp_def_trans_trf.trans_mode =this.td_deftrans.trans_mode;
    temp_def_trans_trf.ardb_cd=this.sys.ardbCD;
    temp_def_trans_trf.agreement_no=this.tm_locker.agreement_no;
    this.isLoading = true;
    debugger
    this.svc.addUpdDel<any>('Locker/DeleteLockerOpeningData', temp_def_trans_trf).subscribe(
      res => {

        this.isLoading = false;
        n = res;

        if (n === 0) {
          this.operationType = '';
          // this.showAlertMsg('INFORMATION', 'Account opening data deleted successfully');
          this.HandleMessage(true, MessageType.Sucess, 'Locker opening data deleted successfully');
        }
        if (n === -1) {
          // this.showAlertMsg('WARNING', 'Account opening data NOT deleted');
          this.HandleMessage(true, MessageType.Warning, 'Locker opening data NOT deleted');
        }

      },
      err => {
        this.isLoading = false;
        // this.showAlertMsg('WARNING', 'Account opening data NOT deleted');
        this.HandleMessage(true, MessageType.Warning, 'Locker opening data NOT deleted');
      }
    );
  }
  // public showAlertMsg(msgTyp: string, msg: string) {
  //   this.alertMsgType = msgTyp;
  //   this.alertMsg = msg;
  //   this.showAlert = true;
  //   this.disableAll = true;
  //   this.disableAccountTypeAndNo = true;
  // }

  public closeAlertMsg() {
    this.HandleMessage(false);

    if (this.operationType === 'I' || this.operationType === 'U') {
      this.disableAll = false;
      this.disableAccountTypeAndNo = false;
    }
  }
  getAgentList() {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode
    }
    this.svc.addUpdDel('Deposit/GetAgentData', dt).subscribe(data => {
      this.agentData = data
      console.log(this.agentData)
      })
  }
  public suggestCustomerCr(i: number): void {
    //debugger;
    if (this.td_deftranstrfList[i].cust_name.length > 2) {
      const prm = new p_gen_param();
      prm.ardb_cd=this.sys.ardbCD;
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.td_deftranstrfList[i].cust_name.toLowerCase();
      prm.ad_acc_type_cd = +this.td_deftranstrfList[i].cust_acc_type;
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
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


  setCustDtlsCr(acc_num: string, cust_name: string, indx: number) {
    console.log({"Account Number":acc_num,"Customer Name":cust_name,"index":indx});
    
    this.suggestedCustomerCr = null;
    this.td_deftranstrfList[indx].cust_acc_number = acc_num;
    this.td_deftranstrfList[indx].cust_name = cust_name;

    this.setDebitAccDtls(this.td_deftranstrfList[indx].cust_acc_number);
  }

  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
    this.disableAll = true; this.disableAccountTypeAndNo = true;
    // On below for dissapearing message
    // setTimeout(() => {
    //   this.showMsg = new ShowMessage();
    // }, 3000);
  }

  getRelations(){
    this.svc.getlbr(environment.relUrl,null).subscribe(data=>{
      this.relStatus=data;
    })
  }
  noSpecialChars(e){
     if(!Utils.preventAlphabet(e.target.value,e.key)){
       e.preventDefault();
     }
  }
}
