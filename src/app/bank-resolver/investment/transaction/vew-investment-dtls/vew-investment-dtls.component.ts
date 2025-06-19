// import { isNumeric } from 'rxjs/internal-compatibility';
import { SystemValues } from '../../../../../app/bank-resolver/Models/SystemValues';

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { InAppMessageService, RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, mm_category, mm_customer, m_acc_master, ShowMessage, td_def_trans_trf } from '../../../../../app/bank-resolver/Models';
import { AccOpenDM } from '../../../../../app/bank-resolver/Models/deposit/AccOpenDM';
import { mm_acc_type } from '../../../../../app/bank-resolver/Models/deposit/mm_acc_type';
import { mm_constitution } from '../../../../../app/bank-resolver/Models/deposit/mm_constitution';
import { mm_oprational_intr } from '../../../../../app/bank-resolver/Models/deposit/mm_oprational_intr';
import { td_accholder } from '../../../../../app/bank-resolver/Models/deposit/td_accholder';
import { td_introducer } from '../../../../../app/bank-resolver/Models/deposit/td_introducer';
import { td_nominee } from '../../../../../app/bank-resolver/Models/deposit/td_nominee';
import { td_signatory } from '../../../../../app/bank-resolver/Models/deposit/td_signatory';
import { tm_denomination_trans } from '../../../../../app/bank-resolver/Models/deposit/tm_denomination_trans';
import { tm_transfer } from '../../../../../app/bank-resolver/Models/deposit/tm_transfer';
import { p_gen_param } from '../../../../../app/bank-resolver/Models/p_gen_param';
import { tm_deposit } from '../../../../../app/bank-resolver/Models/tm_deposit';
import { exit } from 'process';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Utils from 'src/app/_utility/utils';
import { Router } from '@angular/router';
import { tt_denomination } from '../../../../../app/bank-resolver/Models/deposit/tt_denomination';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vew-investment-dtls',
  templateUrl: './vew-investment-dtls.component.html',
  styleUrls: ['./vew-investment-dtls.component.css']
})
export class VewInvestmentDtlsComponent implements OnInit {
  td_deftransfer: any;

  constructor(
    // private frmBldr: FormBuilder,
    private svc: RestService,
    private modalService: BsModalService,
    private router: Router,
    private msg: InAppMessageService,
  ) { }

  static accTypes: mm_acc_type[] = [];
  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;
  // selectedTransType = '';
  hidegl:boolean=true;
  opeIns:boolean=true;
  glHead:any;
  glcdHide:boolean=false;
  transTypeFlg = '';
  agentData:any;
  accountTypeDiv =23;
  dspPrn=0
  branchCode = '0';
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
  selectedCust: any;

  disabledOnNull=true;
  suggestedCustomerCr: mm_customer[];
  indxsuggestedCustomerCr = 0;
  hidejoin:boolean=false;
  createUser = '';
  updateUser = '';
  createDate: Date;
  updateDate: Date;

  sys = new SystemValues();
  denominationGrandTotal = 0;
  // new comment

  isLoading = false;
  // disableCustNameFlg = true;
  disableCustomerName = true;
  disableAll = true;
  disableAccountTypeAndNo = true;

  operationType = '';

  showAlert = false;
  alertMsg: string;
  alertMsgType: string;
  showNoResult=false;
  x1 = 1;
  y1 = 1;

 bankData=[]
  // Declaration of model for each Div
  masterModel = new AccOpenDM();
  tm_deposit = new tm_deposit();
  td_nomineeList: td_nominee[] = [];
  td_signatoryList: td_signatory[] = [];
  td_accholderList: td_accholder[] = [];
  td_introducerlist: td_introducer[] = [];
  tm_denominationList: tm_denomination_trans[] = [];

  td_deftrans = new td_def_trans_trf();
  td_deftranstrfList: td_def_trans_trf[] = [];
  tm_transferList: tm_transfer[] = [];

  dummyList: string[] = [];


  denominationList: tt_denomination[] = [];

  customerList: mm_customer[] = [];
  suggestedCustomer: mm_customer[];
  suggestedCustomerSignatories: mm_customer[];
  suggestedCustomerSignatoriesIdx: number;
  suggestedCustomerJointHolder: mm_customer[];
  suggestedCustomerJointHolderIdx: number;

  selectedCustomer = new mm_customer();

  categoryList: mm_category[] = [];
  accountTypeList: mm_acc_type[] = [];
  constitutionList: mm_constitution[] = [];
  selectedConstitutionList: mm_constitution[] = [];
  operationalInstrList: mm_oprational_intr[] = [];
  branch:any=[];
  branch1:any=[];
  acc_master: m_acc_master[] = [];
  acc_master1: m_acc_master[] = [];

  p_gen_param = new p_gen_param();

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
    this.getAgentList()
     this.getBankName()
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
    // this.newAccount();
    this.getRelations();
    // console.log(this.constitutionDtParser('YEAR=1;Month=10;Days=25;'));
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
    this.masterModel = new AccOpenDM();
  }
  initializeModels() {

    this.tm_deposit = new tm_deposit();
    // this.tm_deposit.opening_dt = this.openDate  ; // this.DateFormatting(this.openDate);
    this.tm_deposit.opening_dt = this.sys.CurrentDate;

    this.tm_deposit.acc_num = null;
    this.tm_deposit.cheque_facility_flag = 'N';
    this.tm_deposit.tds_applicable = 'N';
    this.tm_deposit.standing_instr_flag = 'N';

    // const sig: td_signatory[] = [];
    // this.td_signatoryList = sig;
    // this.addSignatory();

    // const acc: td_accholder[] = [];
    // this.td_accholderList = acc;
    // this.addJointHolder();

    // const intr: td_introducer[] = [];
    // this.td_introducerlist = intr;
    // this.addIntroducer();

    // const nom: td_nominee[] = [];
    // this.td_nomineeList = nom;
    // this.addNominee();

    // const deno: tm_denomination_trans[] = [];
    // this.tm_denominationList = deno;
    // this.addDenomination();

    this.td_deftrans = new td_def_trans_trf();

    const td_deftranstrf: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftranstrf;
    const temp_deftranstrf = new td_def_trans_trf();
    this.td_deftranstrfList.push(temp_deftranstrf);

    const tm_trns: tm_transfer[] = [];
    this.tm_transferList = tm_trns;
    const temp_transfer = new tm_transfer();
    this.tm_transferList.push(temp_transfer);
    console.log(this.tm_transferList);
    



    this.masterModel.tmdepositInv = this.tm_deposit;
    this.masterModel.tdintroducer = this.td_introducerlist;
    this.masterModel.tdnominee = this.td_nomineeList;
    this.masterModel.tdsignatory = this.td_signatoryList;
    this.masterModel.tdaccholder = this.td_accholderList;
    // this.masterModel.tmdenominationtrans = this.tm_denominationList;

    this.masterModel.tddeftrans = this.td_deftrans;
    this.masterModel.tddeftranstrf = this.td_deftranstrfList;
    this.masterModel.tmtransfer = this.tm_transferList;
    console.log(this.masterModel.tmtransfer);
    



    this.p_gen_param = new p_gen_param();
  }


  assignModelsFromMasterData() {
    let retDepositPeriodArr = [];
    this.tm_deposit = new tm_deposit();
    // const sig: td_signatory[] = [];
    // this.td_signatoryList = sig;
    // this.addSignatory();
    // const acc: td_accholder[] = [];
    // this.td_accholderList = acc;
    // this.addJointHolder();
    // const intr: td_introducer[] = [];
    // this.td_introducerlist = intr;
    // this.addIntroducer();
    // const nom: td_nominee[] = [];
    // this.td_nomineeList = nom;
    // this.addNominee();
    // const deno: tm_denomination_trans[] = [];
    // this.tm_denominationList = deno;
    // this.addDenomination();
    this.td_deftrans = new td_def_trans_trf();
    const td_deftrans: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftrans;
    const tm_trns: tm_transfer[] = [];
    this.tm_transferList = tm_trns;
    this.tm_deposit = this.masterModel.tmdepositInv;
    this.td_deftrans = this.masterModel.tddeftrans;
    console.log({"TDDEFTRANS": this.td_deftrans});

    // this.setTransType(this.td_deftrans.trf_type);
    this.td_deftranstrfList = this.masterModel.tddeftranstrf;
    console.log({"TD_DEFTRANSTRFLIST":this.td_deftranstrfList,"suggestedCustomerCr":this.suggestedCustomerCr});
    this.tm_transferList = this.masterModel.tmtransfer;
    

    if (this.td_deftrans.trf_type === 'T') {
      if (this.td_deftranstrfList[0].acc_num === '0000') {
        debugger
        this.td_deftranstrfList[0].gl_acc_code = this.td_deftranstrfList[0].acc_type_cd.toString();
        this.checkAndSetDebitAccType('gl_acc', this.td_deftranstrfList[0].gl_acc_code);
        this.td_deftranstrfList[0].cust_acc_number=this.td_deftranstrfList[0].acc_num;


      }
      else {
        this.td_deftranstrfList[0].cust_acc_type = this.td_deftranstrfList[0].acc_type_cd.toString();
        this.td_deftranstrfList[0].cust_acc_number = this.td_deftranstrfList[0].acc_num;
        this.checkAndSetDebitAccType('cust_acc', this.td_deftranstrfList[0].cust_acc_type);
        this.setDebitAccDtls(this.td_deftranstrfList[0].acc_num);
      }
    }
    console.log({"TDDEFTRANS!": this.td_deftrans});

    this.setAccountType(this.tm_deposit.acc_type_cd);
    this.setIntTfrType(this.tm_deposit.intt_trf_type);
    this.setConstitutionType(this.tm_deposit.constitution_cd);
    this.setOperationalInstr(this.tm_deposit.oprn_instr_cd);
    this.getBranchName();
    this.td_introducerlist = this.masterModel.tdintroducer;

    if (this.tm_deposit.intt_amt !== undefined && this.tm_deposit.intt_amt != null) {
      this.tm_deposit.mat_val = Number(this.tm_deposit.intt_amt) + Number(this.tm_deposit.prn_amt);
    }

    if (this.tm_deposit.dep_period !== undefined && this.tm_deposit.dep_period != null) {
      retDepositPeriodArr = this.depositPeriodParser(this.tm_deposit.dep_period);
      this.tm_deposit.year = Number(retDepositPeriodArr[0]);
      this.tm_deposit.month = Number(retDepositPeriodArr[1]);
      this.tm_deposit.day = Number(retDepositPeriodArr[2]);
    }

    // if (this.tm_deposit.standing_instr_flag !== undefined && this.tm_deposit.standing_instr_flag !== null) {
    //   this.setStandingInstrAfterMatu(Number(this.tm_deposit.standing_instr_flag));
    // }

    // tslint:disable-next-line: forin
    for (const idx in this.td_introducerlist) {
      this.setIntroducerAccountType(this.td_introducerlist[idx].introducer_acc_type, Number(idx));
    }


    this.td_nomineeList = this.masterModel.tdnominee;
    this.td_signatoryList = this.masterModel.tdsignatory;
    this.td_accholderList = this.masterModel.tdaccholder;

    // tslint:disable-next-line: forin
    for (const idx in this.td_accholderList) {
      this.setRelationship(this.td_accholderList[idx].relation, Number(idx));
    }

    // this.tm_denominationList = this.masterModel.tmdenominationtrans;
    if (this.tm_denominationList === undefined || this.tm_denominationList === null || this.tm_denominationList.length === 0) {
      null;
    }
    else {
      for (const idx in this.tm_denominationList) {
        this.setDenomination(this.tm_denominationList[idx].rupees, Number(idx));
      }

    }

    this.td_deftrans = this.masterModel.tddeftrans;
    console.log({"TDDEFTRANS": this.td_deftrans});

    // this.setTransType(this.td_deftrans.trf_type);
    this.td_deftranstrfList = this.masterModel.tddeftranstrf;
    console.log({"TD_DEFTRANSTRFLIST":this.td_deftranstrfList,"suggestedCustomerCr":this.suggestedCustomerCr});
    // this.tm_transferList = this.masterModel.tmtransfer;

    

  }
 getBankName(){
  var dt = {
    "ardb_cd": this.sys.ardbCD,
  }
  this.svc.addUpdDel<any>('Mst/GetBankInvMaster', dt).subscribe(
    res => {
      console.log(res)
      this.bankData=res
    
      
    },
    err => { }
  );
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

  setBankName(val: number){
    console.log(val);
    this.branch=null
      var dt = {
        "ardb_cd": this.sys.ardbCD,
        "bank_cd":this.tm_deposit.bank_cd
      }
      this.svc.addUpdDel<any>('Mst/GetBranchInvMaster', dt).subscribe(
        res => {
          this.branch=res
           console.log(this.branch)
           
         })
    this.tm_deposit.branch_cd=null
    
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
        // this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'I');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {

      }
    );
  }

  getOperationalInstr() {

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
    this.operationType = '';
    this.disabledOnNull=true;
    this.suggestedCustomer=null
    this.showNoResult=false
    this.initializeMasterDataAndFlags();
    this.initializeModels();
    this.closeAlertMsg();
  }

  retrieveData() {

     this.clearData();

    this.operationType = 'U';

    // this.isLoading = true;
    // this.getCustomerList();
this.glcdHide=true
    this.disableAll = true;
    this.disableAccountTypeAndNo = false;
    this.tm_deposit.brn_cd = this.branchCode;
  }

  getAccountOpeningTempData() {
    if(this.operationType==='I'){
      return;
    }
    else{
      console.log(this.tm_deposit.acc_num)
      if (this.tm_deposit.acc_type_cd === null || this.tm_deposit.acc_type_cd === undefined) {
        // this.showAlertMsg('WARNING', 'Please select Account Type');
        this.HandleMessage(true, MessageType.Warning, 'Please select Account Type');
        this.tm_deposit.acc_num = null;
        return;
      }
     else{ 
      this.tm_deposit.ardb_cd=this.sys.ardbCD
      this.isLoading = true;
      this.svc.addUpdDel<any>('INVESTMENT/GetInvOpeningData', this.tm_deposit).subscribe(
        res => {
          console.log(res);
          this.isLoading = false;
          this.masterModel = res;
          this.opeIns=true;
  
          if (this.masterModel === undefined || this.masterModel === null) {
            // this.showAlertMsg('WARNING', 'No record found!!');
            this.HandleMessage(true, MessageType.Warning, 'No record found!!');
            this.clearData();
          }
          else if(this.masterModel.tddeftrans.approval_status=='U'){
            this.HandleMessage(true, MessageType.Warning, 'Account dose not approved!');
            this.tm_deposit.acc_num = null;
             return;
          }
          else {
            if (this.masterModel.tmdepositInv.acc_num !== null) {
              this.disableAccountTypeAndNo = true;
              this.assignModelsFromMasterData();
              // this.operationType = 'Q';
              this.hidegl=true
  
            }
            else {
              // this.showAlertMsg('WARNING', 'No record found!!!');
              this.HandleMessage(true, MessageType.Warning, 'No record found!!');
              this.clearData();
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
    }
    
  }


  modifyData() {

    if (this.operationType !== 'U') {
      // this.showAlertMsg('WARNING', 'Record not retrived to modify');
      this.HandleMessage(true, MessageType.Warning, 'Record not retrieved to modify');
      return;
    }
    this.opeIns=false;
    this.disableAll = true;
    this.disableCustomerName = true;
    this.disableAccountTypeAndNo = true;
  }

  newAccount() {    // document.getElementById('account_type').id = '';

    this.clearData();

    this.operationType = 'I';
    this.disableAll = true;
    // this.isLoading = true;
    // this.getCustomerList();
    // this.disableCustNameFlg = false;
    this.disableCustomerName = false;
    this.disableAll = false;
    this.disableAccountTypeAndNo = false;


  }

  saveData() {
    console.log(this.td_deftranstrfList);
    
    console.log(this.tm_transferList);
   
    console.log(this.tm_deposit);
    
    if (this.operationType !== 'I' && this.operationType !== 'U') {
      // this.showAlertMsg('WARNING', 'Record not Created or Updated to Save');
      this.HandleMessage(true, MessageType.Warning, 'Record not Created or Updated to Save');
      return;
    }
    // if((this.tm_deposit.oprn_instr_cd == 2 || this.tm_deposit.oprn_instr_cd == 3) && this.td_accholderList.length == 1){
    //   if(this.td_accholderList[0].acc_holder == null && this.td_accholderList[0].acc_num == null && this.td_accholderList[0].relationId == null){
    //     this.HandleMessage(true, MessageType.Warning, 'Joint holder details are mandatory for operational instruction type "All Joint" and "Either Or Survivour"');
    //     return;
    //   }
    // }
    if((this.tm_deposit.acc_type_cd == 2 || 
      this.tm_deposit.acc_type_cd == 3 || 
      this.tm_deposit.acc_type_cd == 4 || 
      this.tm_deposit.acc_type_cd == 5 || 
      this.tm_deposit.acc_type_cd == 6) && (this.tm_deposit.standing_instr_flag == "1")){
    if(this.tm_deposit.user_acc_num == undefined || this.tm_deposit.user_acc_num == null){
      this.HandleMessage(true, MessageType.Warning, "This customer don't have a savings account to take the auto close facility, please choose either 'auto renew' or 'none'");
      return;
    }
  }
    this.validateData();
    if (this.tm_deposit.acc_num === null || this.operationType === 'I') {
      this.tm_deposit.acc_status = 'O';
      this.tm_deposit.created_by = this.createUser;
      this.tm_deposit.created_dt = this.createDate;
      this.tm_deposit.modified_by = this.updateUser;
      this.tm_deposit.modified_dt = this.updateDate;

      this.getNewAccountNoAndSaveData();
    }
    else {
      this.tm_deposit.created_by = this.createUser;
      this.tm_deposit.created_dt = this.createDate;
      // this.tm_deposit.modified_by = this.updateUser;
      // this.tm_deposit.modified_dt = this.updateDate;
      this.InsertAccountOpenData();
    }

    this.disableAll = true;
    this.disableAccountTypeAndNo = false;
  }

  validateData() {

    let nomPercent = 0;

    if (this.tm_deposit.year === null || this.tm_deposit.year === undefined) { this.tm_deposit.year = 0; }

    if (this.tm_deposit.month === null || this.tm_deposit.month === undefined) { this.tm_deposit.month = 0; }

    if (this.tm_deposit.day === null || this.tm_deposit.day === undefined) { this.tm_deposit.day = 0; }

    if (this.tm_deposit.year === 0 && this.tm_deposit.month === 0 && this.tm_deposit.day === 0) { this.tm_deposit.dep_period = null; }
    else {
      this.tm_deposit.dep_period = 'Year=' + this.tm_deposit.year + ';Month=' + this.tm_deposit.month + ';Day=' + this.tm_deposit.day;
    }
    console.log(this.td_deftrans.trf_type);
debugger
    // Populating data for TD_DEP_TRANS_TRF =============================================================
    if (this.td_deftrans.trf_type === 'T') {

      // if (this.tm_deposit.acc_type_cd === 23) {
      //   if (this.td_deftranstrfList[0].amount === undefined || this.td_deftranstrfList[0].amount === null ||
      //     (this.tm_deposit.instl_amt.toString() !== this.td_deftranstrfList[0].amount.toString())) {
          
      //     this.HandleMessage(true, MessageType.Warning, 'Debit Amount is not matching with Installment Amount');
          
      //     exit(0);
      //   }
      // }
      // else {
      //   if (this.td_deftranstrfList[0].amount === undefined || this.td_deftranstrfList[0].amount === null ||
      //     (this.tm_deposit.prn_amt.toString() !== this.td_deftranstrfList[0].amount.toString())) {
        
      //     this.HandleMessage(true, MessageType.Warning, 'Debit Amount is not matching with Principal Amount');
          
      //     exit(0);
      //   }
      // }

      this.td_deftranstrfList[0].brn_cd = this.branchCode;
      this.td_deftranstrfList[0].trans_dt = this.sys.CurrentDate;
debugger
      if (this.td_deftranstrfList[0].cust_acc_type === undefined ||
        this.td_deftranstrfList[0].cust_acc_type === null ||
        this.td_deftranstrfList[0].cust_acc_type === '') {
        this.td_deftranstrfList[0].cust_acc_type = this.td_deftranstrfList[0].gl_acc_code;
        this.td_deftranstrfList[0].cust_acc_number = '0000';
        console.log(this.td_deftranstrfList[0].cust_acc_type,this.td_deftranstrfList[0].cust_acc_number);
        
        // this.td_deftranstrfList[0].remarks = 'D';
      }
      else {
        this.td_deftranstrfList[0].acc_type_cd = parseInt(this.td_deftranstrfList[0].cust_acc_type);
        this.td_deftranstrfList[0].acc_num = this.td_deftranstrfList[0].cust_acc_number;
        // this.td_deftranstrfList[0].remarks = 'X';
      }
      this.td_deftranstrfList[0].remarks = 'D';

      this.td_deftranstrfList[0].trans_type = 'W';
      this.td_deftranstrfList[0].trans_mode = 'V';
      this.td_deftranstrfList[0].approval_status = 'U';
      this.td_deftranstrfList[0].particulars = 'BY TRANSFER TO ' + this.tm_deposit.acc_type_desc + ': ' + this.tm_deposit.acc_num;
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
      // this.tm_transferList[0].brn_cd = this.branchCode;
      // this.tm_transferList[0].trf_dt = this.sys.CurrentDate;
      // this.tm_transferList[0].approval_status = 'U';
      if (this.operationType === 'I') {
        this.tm_transferList[0].created_by = this.createUser;
        this.tm_transferList[0].created_dt = this.createDate;
        this.tm_transferList[0].brn_cd = this.branchCode;
        this.tm_transferList[0].trf_dt = this.sys.CurrentDate;
      }
    }
    else {
      // this.td_deftranstrfList = this.td_deftranstrfList.splice(0, 1);
      // this.tm_transferList = this.tm_transferList.splice(0, 1);
        this.td_deftranstrfList = this.td_deftranstrfList;
      this.tm_transferList = this.tm_transferList;

    }
    // if (this.tm_deposit.cust_cd === null || this.tm_deposit.cust_cd === undefined) {
    //   this.HandleMessage(true, MessageType.Warning, 'Customer Information is Blank');
    //   return;
    // }

    if (this.tm_deposit.acc_type_cd === null || this.tm_deposit.acc_type_cd === undefined) {
      this.HandleMessage(true, MessageType.Warning, 'Account Type can not be blank');
      exit(0);
    }

    if (this.tm_deposit.constitution_cd === null || this.tm_deposit.constitution_cd === undefined) {
      // this.showAlertMsg('WARNING', 'Constitution can not be blank');
      this.HandleMessage(true, MessageType.Warning, 'Constitution can not be blank');
      exit(0);
    }

    if (this.tm_deposit.oprn_instr_cd === null || this.tm_deposit.oprn_instr_cd === undefined) {
      // this.showAlertMsg('WARNING', 'Operational Instruction can not be blank');
      this.HandleMessage(true, MessageType.Warning, 'Operational Instruction can not be blank');
      exit(0);
    }


    // tslint:disable-next-line: forin
    for (const l in this.td_signatoryList) {
      if (this.td_signatoryList[l].signatory_name === null || this.td_signatoryList[l].signatory_name === undefined) {
      
        this.HandleMessage(true, MessageType.Warning, 'Signatory Name is Blank');
        exit(0);
      }

      this.td_signatoryList[l].acc_num = this.tm_deposit.acc_num;
      this.td_signatoryList[l].brn_cd = this.branchCode;
      this.td_signatoryList[l].acc_type_cd = Number(this.tm_deposit.acc_type_cd);
      this.td_signatoryList[l].upd_ins_flag = this.operationType;
    }


    // ;
    // tslint:disable-next-line: forin
    for (const l in this.td_accholderList) {
      console.log({"Index":l,"td_accholderListLength":this.td_accholderList.length});
      if (this.td_accholderList[l].acc_holder === null || this.td_accholderList[l].acc_holder === undefined) {
        this.td_accholderList = this.td_accholderList.splice(Number(l), 1);
      }
      else {
        if (this.td_accholderList[l].relation === null || this.td_accholderList[l].relation === undefined) {
          // this.showAlertMsg('WARNING', 'Joint Holder Relation is Blank');
          this.HandleMessage(true, MessageType.Warning, 'Joint Holder Relation is Blank');
          exit(0);
        }
        this.td_accholderList[l].acc_type_cd = this.tm_deposit.acc_type_cd;
        this.td_accholderList[l].acc_num = this.tm_deposit.acc_num;
        this.td_accholderList[l].brn_cd = this.branchCode;
        this.td_accholderList[l].upd_ins_flag = this.operationType;
      }
    }
    console.log(this.td_accholderList);

    if ((this.tm_deposit.acc_type_cd === 2 || this.tm_deposit.acc_type_cd === 5 || this.tm_deposit.acc_type_cd === 6)
      && this.tm_deposit.cheque_facility_flag === 'Y'
      && (this.tm_deposit.user_acc_num === undefined || this.tm_deposit.user_acc_num === null || this.tm_deposit.user_acc_num === "")) {
      this.HandleMessage(true, MessageType.Warning, 'Enter Account Number for Standing Instruction');
      exit(0);
    }


    if ((this.td_deftrans.trf_type === null || this.td_deftrans.trf_type === undefined) && this.operationType === 'I') {
      // this.showAlertMsg('WARNING', 'Please supply required value in transaction details');
      this.HandleMessage(true, MessageType.Warning, 'Please supply required value in transaction details');
      exit(0);
    }


    // if (this.td_deftrans.trf_type === 'C') {
    //   if (this.tm_deposit.acc_type_cd === 6) {
    //     if (this.denominationGrandTotal !== this.tm_deposit.instl_amt) {
    //       this.HandleMessage(true, MessageType.Warning, 'Installment Amount and Total Denomination Amount not matching!!');
    //       exit(0);
    //     }
    //   }
    //   else
    //     if (this.denominationGrandTotal !== this.tm_deposit.prn_amt) {
    //       this.HandleMessage(true, MessageType.Warning, 'Principal Amount and Total Denomination Amount not matching!!');
    //       exit(0);
    //     }
    // }

    // Populating data for TD_DEP_TRANS ================================================================
    this.td_deftrans.brn_cd = this.branchCode;
    this.td_deftrans.trans_dt = this.sys.CurrentDate;
    this.td_deftrans.acc_type_cd = this.tm_deposit.acc_type_cd;
    this.td_deftrans.acc_num = this.masterModel.tmdepositInv.acc_num;
    this.td_deftrans.trans_type = 'D';
    this.td_deftrans.trans_mode = 'O';
    this.td_deftrans.tr_acc_num = 'N';

    if (this.tm_deposit.acc_type_cd === 6) {
      this.td_deftrans.amount = this.tm_deposit.instl_amt;
    }
    else {
      this.td_deftrans.amount = this.tm_deposit.prn_amt;
    }

    this.td_deftrans.approval_status = 'U';
    this.td_deftrans.acc_cd = this.tm_deposit.acc_cd;

    if (this.td_deftrans.trf_type === 'T') {
      this.td_deftrans.particulars = 'BY TRANSFER';
      this.td_deftrans.tr_acc_cd = this.suspanceAccCd;
    }
    else {
      this.td_deftrans.particulars = 'BY CASH';
      this.td_deftrans.tr_acc_cd = this.cashAccCd;
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



    // For Nominee ====================================================================================

    for (const l in this.td_nomineeList) {
      if (this.td_nomineeList[l].nom_name === null || this.td_nomineeList[l].nom_name === undefined) {
        this.td_nomineeList = this.td_nomineeList.splice(Number(l), 1);
      }
      else {
        if (this.td_nomineeList[l].percentage === null ||
          this.td_nomineeList[l].percentage === 0 ||
          this.td_nomineeList[l].percentage === undefined) {
          // this.showAlertMsg('WARNING', 'Nominee Percentage is blank');
          this.HandleMessage(true, MessageType.Warning, 'Nominee Percentage is blank');
          exit(0);
        }
        this.td_nomineeList[l].acc_num = this.masterModel.tmdepositInv.acc_num;
        this.td_nomineeList[l].acc_type_cd = this.tm_deposit.acc_type_cd;
        this.td_nomineeList[l].brn_cd = this.branchCode;
        this.td_nomineeList[l].upd_ins_flag = this.operationType;

        nomPercent = nomPercent + Number(this.td_nomineeList[l].percentage);
      }
    }

    if (nomPercent > 0 && nomPercent < 100) {
      // this.showAlertMsg('WARNING', 'Nominee Total Percentage < 100');
      this.HandleMessage(true, MessageType.Warning, 'Nominee Total Percentage < 100');
      exit(0);
    }


    if ((this.operationType === 'I') && (this.tm_deposit.user_acc_num === undefined || this.tm_deposit.user_acc_num === null || this.tm_deposit.user_acc_num === "")
      && (this.tm_deposit.acc_type_cd === 6)) {
      this.HandleMessage(true, MessageType.Warning, 'S/B Account Number not present to create the Account Type- '
        + this.tm_deposit.acc_type_desc);
      exit(0);
    }

    if ((this.operationType === 'I') && (this.tm_deposit.acc_type_cd === 1 || this.tm_deposit.acc_type_cd === 7 ||
      this.tm_deposit.acc_type_cd === 8 || this.tm_deposit.acc_type_cd === 9)) {
      this.tm_deposit.user_acc_num = null;
    }



    for (const l in this.tm_denominationList) {

      if (this.tm_denominationList[l].rupees === null || this.tm_denominationList[l].rupees === undefined) {
        this.tm_denominationList = this.tm_denominationList.splice(Number(l), 1);
      }
      else {
        this.tm_denominationList[l].brn_cd = this.branchCode;
        this.tm_denominationList[l].trans_dt = this.sys.CurrentDate;
      }
    }



    // tslint:disable-next-line: forin
    let v = 0;
    for (const l in this.td_introducerlist) {
      if (this.td_introducerlist[l].introducer_acc_num === null || this.td_introducerlist[l].introducer_acc_num === undefined) {
        // Removing the blank element
        this.td_introducerlist = this.td_introducerlist.splice(Number(l), 1);
      }
      else {
        v = v + 1;
        this.td_introducerlist[l].srl_no = v;
        this.td_introducerlist[l].acc_type_cd = this.tm_deposit.acc_type_cd;
        this.td_introducerlist[l].acc_num = this.tm_deposit.acc_num;
        this.td_introducerlist[l].brn_cd = this.branchCode;

      }
    }


    // if (this.operationType === 'I')
    // {
    //   for (let l in this.tm_denominationList)
    //   {
    //   this.tm_denominationList[l].brn_cd = this.branchCode;
    //   this.tm_denominationList[l].trans_dt = this.sys.CurrentDate;
    //   }

    //   var v= 0;
    //   for (let l in this.td_introducerlist) {
    //     v = v + 1;
    //     this.td_introducerlist[l].srl_no = v;
    //     this.td_introducerlist[l].acc_type_cd = this.tm_deposit.acc_type_cd;
    //     this.td_introducerlist[l].acc_num = this.tm_deposit.acc_num;
    //     this.td_introducerlist[l].brn_cd = this.branchCode;
    //   }

    // }

  }
  getBranchName(){
    this.branch=null
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "bank_cd":this.tm_deposit.bank_cd
    }
    this.svc.addUpdDel<any>('Mst/GetBranchInvMaster', dt).subscribe(
      res => {
        this.branch=res
         console.log(this.branch)
         
       })
    
   }
  getNewAccountNoAndSaveData() {
    this.InsertAccountOpenData();
//     this.p_gen_param.brn_cd = this.branchCode; // String
//     this.p_gen_param.gs_acc_type_cd = this.masterModel.tmdepositInv.acc_type_cd; // Integer
//     this.p_gen_param.ls_catg_cd = this.masterModel.tmdepositInv.category_cd; // Integer
//     this.p_gen_param.ls_cons_cd = this.masterModel.tmdepositInv.constitution_cd; // Integer
//     this.p_gen_param.ardb_cd=this.sys.ardbCD;
//     this.isLoading = true;
//     debugger
//     this.svc.addUpdDel<any>('Deposit/PopulateAccountNumber', this.p_gen_param).subscribe(
//       res => {
// debugger
//         let val = '0';
//         this.isLoading = false;
//         val = res;
//         this.masterModel.tmdepositInv.acc_num = val.toString();
//         this.masterModel.tmdepositInv.brn_cd = this.branchCode;
// console.log(this.masterModel.tmdepositInv.acc_num);


//         this.InsertAccountOpenData();
//       },
//       err => {
//         this.isLoading = false;

//       }

//     );

  }


  InsertAccountOpenData() {
    this.validateData();
    let ret = -1;
       
    this.masterModel.tmdepositInv.ardb_cd=this.sys.ardbCD;
    this.masterModel.tmdepositInv.brn_cd=this.sys.BranchCode;

    this.masterModel.tddeftrans.ardb_cd=this.sys.ardbCD;
    this.isLoading = true;
    debugger

debugger
      this.svc.addUpdDel<any>('INVESTMENT/UpdateInvOpeningData', this.masterModel).subscribe(
        res => {
console.log(res);

          ret = Number(res);
          this.isLoading = false;

          if (ret === 0) {
            // this.showAlertMsg('INFORMATION', 'Record Set Updated Successfully');
            this.HandleMessage(true, MessageType.Sucess, 'Record Set Updated Successfully');
            this.disableCustomerName = true;
            this.operationType = '';
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


  public DateFormatting(dateVal: Date): any {
    let dt: Date;
    dt = new Date(Date.UTC(dateVal.getFullYear(), dateVal.getMonth(), dateVal.getDate(), dateVal.getHours(), dateVal.getMinutes()));
    return dt;
  }






  setAccountType(accType: number) {
    // console.log(v)
   console.log(accType)
    if (accType === 0) {
      accType = 1;
    }

    if (this.operationType === 'I') {
      // this.setTmDepositModel();
    }

    this.accountTypeDiv = Number(accType);
    console.log(accType)
    this.tm_deposit.acc_type_cd = Number(accType);
    this.tm_deposit.acc_type_desc = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;

    // this.selectedConstitutionList = null;
    this.selectedConstitutionList = this.constitutionList.filter(x => x.acc_type_cd.toString() === accType.toString());


    if (this.operationType === 'I' && this.tm_deposit.acc_type_cd === 11) {
      this.tm_deposit.month = this.savingsDepoSpclPeriod;
      this.tm_deposit.prn_amt=0
      // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      this.tm_deposit.mat_dt = this.sys.CurrentDate;


      this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
    }

    if (this.operationType === 'I' &&
      (this.tm_deposit.acc_type_cd === 2 ||
        this.tm_deposit.acc_type_cd === 3 ||
        this.tm_deposit.acc_type_cd === 4 ||
        this.tm_deposit.acc_type_cd === 5 ||
        this.tm_deposit.acc_type_cd === 6)) {
          console.log(this.standingInstrAfterMaturity)
      this.tm_deposit.standing_instr_flag = this.standingInstrAfterMaturity[0].instr_code;
      this.tm_deposit.standing_instr_dscr = this.standingInstrAfterMaturity[0].instr_dscr;
      // this.tm_deposit.standing_instr_flag = this.standingInstrAfterMaturity[8].instr_code;
      // this.tm_deposit.standing_instr_dscr = this.standingInstrAfterMaturity[8].instr_dscr;
    }

    // if (this.operationType === 'I' && this.tm_deposit.acc_type_cd === 5) {
    //   this.tm_deposit.intt_trf_type = this.intTransferType[0].tfr_type;
    //   this.tm_deposit.intt_tfr_type_dscr = this.intTransferType[0].tfr_desc;
    // }
    
    // if(this.operationType === 'I' && this.tm_deposit.acc_type_cd === 2){
    //   this.tm_deposit.intt_trf_type = this.intTransferType[4].tfr_type;
    //   this.tm_deposit.intt_tfr_type_dscr = this.intTransferType[4].tfr_desc;
    // }
          this.SetInttTfrType(this.operationType,this.tm_deposit.acc_type_cd);
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


  

  setTmDepositModel() {
    this.tm_deposit.ardb_cd=undefined
    this.tm_deposit.acc_type_cd = undefined;
    this.tm_deposit.acc_num = undefined;
    this.tm_deposit.renew_id = undefined;
    this.tm_deposit.intt_trf_type = undefined;
    this.tm_deposit.constitution_cd = undefined;
    this.tm_deposit.oprn_instr_cd = undefined;
    this.tm_deposit.prn_amt = undefined;
    this.tm_deposit.intt_amt = undefined;
    this.tm_deposit.dep_period = undefined;
    this.tm_deposit.instl_amt = undefined;
    this.tm_deposit.instl_no = undefined;
    this.tm_deposit.mat_dt = undefined;
    this.tm_deposit.intt_rt = undefined;
    this.tm_deposit.tds_applicable = undefined;
    this.tm_deposit.last_intt_calc_dt = undefined;
    this.tm_deposit.acc_close_dt = undefined;
    this.tm_deposit.closing_prn_amt = undefined;
    this.tm_deposit.closing_intt_amt = undefined;
    this.tm_deposit.penal_amt = undefined;
    this.tm_deposit.ext_instl_tot = undefined;
    this.tm_deposit.mat_status = undefined;
    this.tm_deposit.acc_status = undefined;
    this.tm_deposit.curr_bal = undefined;
    this.tm_deposit.clr_bal = undefined;
    this.tm_deposit.standing_instr_flag = undefined;
    this.tm_deposit.cheque_facility_flag = undefined;
    this.tm_deposit.approval_status = undefined;
    this.tm_deposit.approved_by = undefined;
    this.tm_deposit.approved_dt = undefined;
    this.tm_deposit.lock_mode = undefined;
    this.tm_deposit.loan_id = undefined;
    this.tm_deposit.cert_no = undefined;
    this.tm_deposit.bonus_amt = undefined;
    this.tm_deposit.penal_intt_rt = undefined;
    this.tm_deposit.bonus_intt_rt = undefined;
    this.tm_deposit.transfer_flag = undefined;
    this.tm_deposit.transfer_dt = undefined;
    this.tm_deposit.agent_cd = undefined;
    this.tm_deposit.created_by = undefined;
    this.tm_deposit.created_dt = undefined;
    this.tm_deposit.modified_by = undefined;
    this.tm_deposit.modified_dt = undefined;
    this.tm_deposit.acc_type_desc = undefined;
    this.tm_deposit.constitution_desc = undefined;
    this.tm_deposit.oprn_instr_desc = undefined;
    this.tm_deposit.intt_tfr_type_dscr = undefined;
    this.tm_deposit.standing_instr_dscr = undefined;
    this.tm_deposit.year = undefined;
    this.tm_deposit.month = undefined;
    this.tm_deposit.day = undefined;
    this.tm_deposit.mat_val = undefined;

    // this.tm_deposit.constitution_cd = null;
    // this.tm_deposit.constitution_desc = null;
    // this.tm_deposit.oprn_instr_cd = null;
    // this.tm_deposit.oprn_instr_desc = null;


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
    this.td_deftrans.trf_type_desc = this.transferTypeList.filter(x => x.trf_type.toString() === tt)[0].trf_type_desc;
     console.log(this.td_deftranstrfList);
     this.masterModel.tmtransfer=this.tm_transferList
     console.log(this.tm_transferList);
     
  }


  setRelationship(relation: string, idx: number) {

    this.td_accholderList[idx].cust_cd = Number(this.td_accholderList[idx].cust_cd);
    this.td_accholderList[idx].relation = relation;
    this.td_accholderList[idx].relationId = this.relationship.filter(x => x.val.toString() === relation)[0].id;

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
    this.tm_deposit.oprn_instr_cd = Number(val);
    this.tm_deposit.oprn_instr_desc = this.operationalInstrList.filter(x => x.oprn_cd.toString() === val.toString())[0].oprn_desc;
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
  //     .filter(c => c.cust_name.toLowerCase().startsWith(this.tm_deposit.cust_name.toLowerCase())
  //       || c.cust_cd.toString().startsWith(this.tm_deposit.cust_name)
  //       || (c.phone !== null && c.phone.startsWith(this.tm_deposit.cust_name)))
  //     .slice(0, 20);
  // }
  onChangeNull(){
    this.suggestedCustomer = null;
    this.showNoResult=false;
    if(this.tm_deposit.cust_name.length > 2){this.disabledOnNull=false}
    else{this.disabledOnNull=true}
  }
  public suggestCustomer(): void {
    if (this.tm_deposit.cust_name.length > 2) {
      const prm = new p_gen_param();
      this.isLoading=true;
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.tm_deposit.cust_name.toLowerCase();
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

  public suggestCustomerJointHolder(idx: number): void {
    this.suggestedCustomerJointHolderIdx = idx;

    if (this.td_accholderList[idx].cust_cd.toString().length > 2) {
      const prm = new p_gen_param();
      prm.as_cust_name = this.td_accholderList[idx].cust_cd.toString().toLowerCase();
      prm.ardb_cd=this.sys.ardbCD
      // this.isLoading = true;
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          console.log(res);
          
          //debugger;
          // this.isLoading = false;
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

  //   if (temp_mm_cust.cust_cd === this.tm_deposit.cust_cd) {
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

    if (temp_mm_cust.cust_cd === this.tm_deposit.cust_cd) {
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
    this.tm_deposit.cust_cd = cust_cd;
    this.tm_deposit.ardb_cd=this.sys.ardbCD
    this.msg.sendcustomerCodeForKyc(cust_cd);
    // this.getSetCustDtls(cust_cd);
  }

  // getSetCustDtls(cust_cd: number) {

  //   let temp_mm_cust = new mm_customer();
  //   const temp_tm_deposit = new tm_deposit();
  //   temp_tm_deposit.cust_cd = cust_cd;
  //   temp_tm_deposit.ardb_cd=this.sys.ardbCD
  //   if (this.suggestedCustomer != undefined && this.suggestedCustomer != null && this.suggestedCustomer.length > 0) {
  //     temp_mm_cust = this.suggestedCustomer.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
  //     this.suggestedCustomer = null;
  //     this.populateCustDtls(temp_mm_cust);
  //   }
  //   else {
  //     // //debugger;
  //   console.log("saas")
  //     this.isLoading = true;
  //     temp_mm_cust.cust_cd = cust_cd;
  //     temp_mm_cust.ardb_cd=this.sys.ardbCD
  //     this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', temp_mm_cust).subscribe(
  //       res => {
  //         //debugger;
  //         this.suggestedCustomer = res;

  //         if (this.suggestedCustomer != undefined && this.suggestedCustomer != null && this.suggestedCustomer.length > 0) {
  //           temp_mm_cust = this.suggestedCustomer.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
  //           this.suggestedCustomer = null;
  //           this.populateCustDtls(temp_mm_cust);
  //         }
  //         this.isLoading = false;
  //       },
  //       err => { this.isLoading = false; }
  //     );
  //   }

  //   // temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];

  //   if (this.operationType === 'I') {
  //     console.log("asdasdasd")
  //     this.isLoading = true;
  //     this.svc.addUpdDel<any>('Deposit/GetCustMinSavingsAccNo', temp_tm_deposit).subscribe(
  //       res => {
  //         //debugger;
  //         this.isLoading = false;
  //         const x = res;
  //         this.tm_deposit.user_acc_num = x.toString();
  //         console.log(this.tm_deposit)
  //         // this.tm_deposit.user_acc_num = this.tm_deposit.user_acc_num.toString();
  //       },
  //       err => {
  //         this.isLoading = false;
  //         this.tm_deposit.user_acc_num = null;
  //       }
  //     );
  //   }
  // }

  // populateCustDtls(temp_mm_cust: mm_customer) {
  //   console.log(temp_mm_cust.acc_num)
  //   this.tm_deposit.cust_name = temp_mm_cust.cust_name;
  //   if (temp_mm_cust.cust_type === 'M') {
  //     this.tm_deposit.cust_type = 'Member';
  //   }
  //   else {
  //     this.tm_deposit.cust_type = 'Non-Member';
  //   }
  //   this.tm_deposit.gurdain_name = temp_mm_cust.guardian_name;

  //   this.tm_deposit.date_of_birth = temp_mm_cust.dt_of_birth;

  //   this.tm_deposit.sex = temp_mm_cust.sex;
  //   this.tm_deposit.sexType = this.sexType.filter(c => c.type.toString() === this.tm_deposit.sex.toString())[0].desc;

  //   this.tm_deposit.phone = temp_mm_cust.phone;
  //   this.tm_deposit.ardb_cd=this.sys.ardbCD
  //   this.tm_deposit.occupation = temp_mm_cust.occupation;
  //   this.tm_deposit.email = temp_mm_cust.email;
  //   this.tm_deposit.present_addr = temp_mm_cust.present_address;

  //   this.tm_deposit.category_cd = temp_mm_cust.catg_cd;
  //   this.setCategoryDesc(this.tm_deposit.category_cd);
  //   console.log(this.tm_deposit)
  //   if (this.operationType === 'I') {
  //     this.td_signatoryList[0].cust_cd = temp_mm_cust.cust_cd;
  //     this.td_signatoryList[0].signatory_name = temp_mm_cust.cust_name;
  //     this.td_signatoryList[0].brn_cd = this.branchCode;
  //   }
  // }

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


  checkAndSetDebitAccType(tfrType: string, accType: string) {

    if (tfrType === 'cust_acc') {
      if (this.td_deftranstrfList[0].cust_acc_type === undefined ||
        this.td_deftranstrfList[0].cust_acc_type === null ||
        this.td_deftranstrfList[0].cust_acc_type === '') {
        this.td_deftranstrfList[0].cust_name = null;
        this.td_deftranstrfList[0].clr_bal = null;
        this.td_deftranstrfList[0].cust_acc_desc = null;
        this.td_deftranstrfList[0].cust_acc_number = null;
        return;
      }

      if (this.td_deftranstrfList[0].gl_acc_code === undefined ||
        this.td_deftranstrfList[0].gl_acc_code === null ||
        this.td_deftranstrfList[0].gl_acc_code === '') {
        let temp_acc_type = new mm_acc_type();
        temp_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0];

        if (temp_acc_type === undefined || temp_acc_type === null) {
          this.td_deftranstrfList[0].cust_acc_type = null;
          // this.showAlertMsg('WARNING', 'Invalid Account Type');
          this.HandleMessage(true, MessageType.Warning, 'Invalid Account Type');
          return;
        }
        else {
          this.td_deftranstrfList[0].cust_acc_desc = temp_acc_type.acc_type_desc;
        }
      }
      else {
        // this.showAlertMsg('WARNING', 'GL Code and Account Type can not have value simultaneously');
        this.HandleMessage(true, MessageType.Warning, 'GL Code and Account Type can not have value simultaneously');
        this.td_deftranstrfList[0].cust_acc_type = null;
        return;
      }
    }

    if (tfrType === 'gl_acc') {
      if (this.td_deftranstrfList[0].gl_acc_code === undefined ||
        this.td_deftranstrfList[0].gl_acc_code === null ||
        this.td_deftranstrfList[0].gl_acc_code === '') {
        this.td_deftranstrfList[0].gl_acc_desc = null;
        return;
      }

      if (this.td_deftranstrfList[0].gl_acc_code === this.cashAccCd.toString()) {
        // this.showAlertMsg('WARNING', 'GL Code can not be Cash Account Code');
        this.HandleMessage(true, MessageType.Warning, 'GL Code can not be Cash Account Code');
        return;
      }


      // this.td_deftranstrfList[0].acc_cd = Number(this.td_deftranstrfList[0].gl_acc_code);

      if (this.td_deftranstrfList[0].cust_acc_type === undefined ||
        this.td_deftranstrfList[0].cust_acc_type === null ||
        this.td_deftranstrfList[0].cust_acc_type === '') {
        if (this.acc_master === undefined || this.acc_master === null || this.acc_master.length === 0) {
          this.isLoading = true;
          let temp_acc_master = new m_acc_master();
          var dt={
            "ardb_cd":this.sys.ardbCD
          }
          this.svc.addUpdDel<any>('Mst/GetAccountMaster', dt).subscribe(
            res => {
               this.acc_master = res;
               this.acc_master1 = res;
              this.isLoading = false;
              // if(tdDefTransTrnsfr.acc_cd!=null){
                // debugger;
                console.log(res)
                this.hidegl=false;
                this.acc_master= this.acc_master1.filter(x => x.acc_cd.toString().includes(this.td_deftranstrfList[0].gl_acc_code) || x.acc_name.toString().toLowerCase().includes(this.td_deftranstrfList[0].gl_acc_code.toString().toLowerCase())  );
              // }
              // temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString().includes(this.td_deftranstrfList[0].gl_acc_code) || x.acc_name.toString().includes(this.td_deftranstrfList[0].gl_acc_code)  );
              
              // if (temp_acc_master === undefined || temp_acc_master === null) {
              //   this.td_deftranstrfList[0].gl_acc_desc = null;
              //   this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
              //   return;
              // }
              // else {
                console.log( this.acc_master.filter(x => x.acc_cd.toString().includes(this.td_deftranstrfList[0].gl_acc_code) || x.acc_name.toString().includes(this.td_deftranstrfList[0].gl_acc_code)))
                this.td_deftranstrfList[0].gl_acc_desc = this.acc_master.filter(x => x.acc_cd.toString().includes(this.td_deftranstrfList[0].gl_acc_code) || x.acc_name.toString().includes(this.td_deftranstrfList[0].gl_acc_code))[0].acc_name;
                // this.td_deftranstrfList[0].gl_acc_desc = temp_acc_master.acc_name;
                this.td_deftranstrfList[0].trans_type = this.td_deftrans.trf_type;
                console.log( this.td_deftranstrfList[0].trans_type, this.td_deftranstrfList[0].gl_acc_desc);
                if(this.operationType=='U' || this.td_deftranstrfList[0].trans_type=='T'){
                  this.hidegl=true;
                }
              // }
            },
            err => {

              this.isLoading = false;
            }
          )
        }
        else {
          let temp_acc_master = new m_acc_master();
          temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === this.td_deftranstrfList[0].gl_acc_code)[0];
          if (temp_acc_master === undefined || temp_acc_master === null) {
            this.td_deftranstrfList[0].gl_acc_desc = null;
            // this.showAlertMsg('WARNING', 'GL Code and Account Type can not have value simultaneously');
            this.HandleMessage(true, MessageType.Warning, 'GL Code and Account Type can not have value simultaneously');
            return;
          }
          else {
            this.td_deftranstrfList[0].gl_acc_desc = temp_acc_master.acc_name;
          }
        }
      }
      else {
        // this.showAlertMsg('WARNING', 'Account Type in Transfer Details is not blank');
        this.HandleMessage(true, MessageType.Warning, 'Account Type in Transfer Details is not blank');
        this.td_deftranstrfList[0].gl_acc_code = null;
        return;
      }
    }
  }
  hidetab(e){
    if(!e.target.value.length){
      // debugger;
      // this.acc_master.length=null
      this.acc_master=null
      // this.glHead=document.getElementById('debit_gl_ac')
      // this.glHead.value=
      this.td_deftranstrfList[0].gl_acc_desc=null
      this.hidegl=true
    }
  }
  setGLCode(acc_cd: string, acc_name: string, indx: number, c: any){
    this.acc_master = null;
    this.hidegl=true;
    // console.log(this.suggestedCustomerCr.length)
    console.log(acc_cd,acc_name,indx);
    
    if (this.selectedCust != acc_cd) {
      debugger
      this.td_deftranstrfList[indx].gl_acc_code = acc_cd;
      this.td_deftranstrfList[indx].gl_acc_desc = acc_name;
      

      // this.setDebitAccDtls(this.td_deftranstrfList[indx]);
    }
    if( this.td_deftranstrfList[0].amount==null && this.td_deftranstrfList[0].amount==undefined){
      this.HandleMessage(true, MessageType.Warning, 'Amount in Transfer Details can not be blank');

    }
    
    
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

    if (this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null) {
      // this.showAlertMsg('WARNING', 'Principal Amount is blank');
      this.HandleMessage(true, MessageType.Warning, 'Principal Amount is blank');
      // this.td_deftranstrfList[0].amount = null;
      exit(0);
    }

    if (this.tm_deposit.acc_type_cd === 6) {
      if (this.tm_deposit.instl_amt.toString() !== amount.toString()) {
        // this.showAlertMsg('WARNING', 'Debit Amount is not matching with Installment Amount');
        this.HandleMessage(true, MessageType.Warning, 'Debit Amount is not matching with Installment Amount');
        exit(0);
      }
    }
    else {
      if (this.tm_deposit.prn_amt.toString() !== amount.toString()) {
        // this.showAlertMsg('WARNING', 'Debit Amount is not matching with Principal Amount');
        this.HandleMessage(true, MessageType.Warning, 'Debit Amount is not matching with Principal Amount');
        exit(0);
      }
    }

    if (this.td_deftranstrfList[0].clr_bal === undefined || this.td_deftranstrfList[0].clr_bal === null) {
      this.td_deftranstrfList[0].clr_bal = 0;
    }

    if (this.td_deftranstrfList[0].gl_acc_code === undefined ||
      this.td_deftranstrfList[0].gl_acc_code === null ||
      this.td_deftranstrfList[0].gl_acc_code === '') {
        console.log({"CLR_BAL":this.td_deftranstrfList[0].clr_bal.toString(),"Amount":amount.toString()});
        
      if (parseInt(this.td_deftranstrfList[0].clr_bal.toString()) < parseInt(amount.toString())) {
        // this.showAlertMsg('WARNING', 'Insufficient Balance');
        this.HandleMessage(true, MessageType.Warning, 'Insufficient Balance');
        this.td_deftranstrfList[0].amount = null;
        exit(0);
      }
    }

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
    temp_deposit.acc_type_cd = 1;
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
    this.svc.addUpdDel<any>('INVESTMENT/F_CALCRDINTT_INV_REG', tempGenParam).subscribe(
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
    this.svc.addUpdDel<any>('INVESTMENT/F_CALCTDINTT_INV_REG', temp_gen_param).subscribe(
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

    if (this.operationType === 'I' && this.tm_deposit.acc_type_cd === 4) {

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
    temp_gen_param2.acc_cd = this.tm_deposit.acc_type_cd;
    temp_gen_param2.from_dt = this.sys.CurrentDate;
    temp_gen_param2.ls_catg_cd = this.tm_deposit.category_cd;
    temp_gen_param2.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(),
      this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) -
      (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(),
        this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24)) - 1;
    this.svc.addUpdDel<any>('Deposit/GET_INT_RATE', temp_gen_param2).subscribe(
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

    let n = 1;
    const temp_def_trans_trf = new td_def_trans_trf();

    if (this.operationType !== 'Q') {
      // this.showAlertMsg('WARNING', 'Record not retrived to delete');
      this.HandleMessage(true, MessageType.Warning, 'Record not retrieved to delete');
      return;
    }


    temp_def_trans_trf.brn_cd = this.tm_deposit.brn_cd;
    temp_def_trans_trf.acc_num = this.tm_deposit.acc_num;
    temp_def_trans_trf.acc_type_cd = this.tm_deposit.acc_type_cd;
    temp_def_trans_trf.trans_cd = this.td_deftrans.trans_cd;
    temp_def_trans_trf.trans_dt = this.td_deftrans.trans_dt;
    temp_def_trans_trf.ardb_cd=this.sys.ardbCD;
    this.isLoading = true;
    console.log(temp_def_trans_trf);
    
    this.svc.addUpdDel<any>('INVESTMENT/DeleteInvOpeningData', temp_def_trans_trf).subscribe(
      res => {
      console.log(res);

        this.isLoading = false;
        n = res;

        if (n === 0) {
          this.clearData();
          this.operationType = '';
          this.operationType = 'Q';
          // this.showAlertMsg('INFORMATION', 'Account opening data deleted successfully');
          this.HandleMessage(true, MessageType.Sucess, 'Account opening data deleted successfully');
        }
        if (n === -1) {
          // this.showAlertMsg('WARNING', 'Account opening data NOT deleted');
          this.HandleMessage(true, MessageType.Warning, 'Account opening data NOT deleted');
        }

      },
      err => {
        this.isLoading = false;
        // this.showAlertMsg('WARNING', 'Account opening data NOT deleted');
        this.HandleMessage(true, MessageType.Warning, 'Account opening data NOT deleted');
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
