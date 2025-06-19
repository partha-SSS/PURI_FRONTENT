// import { isNumeric } from 'rxjs/internal-compatibility';
import { SystemValues } from './../../Models/SystemValues';

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { InAppMessageService, RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, mm_category, mm_customer, m_acc_master, ShowMessage, td_def_trans_trf } from '../../Models';
import { AccOpenDM } from '../../Models/deposit/AccOpenDM';
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

@Component({
  selector: 'app-acc-opening-view',
  templateUrl: './acc-opening-view.component.html',
  styleUrls: ['./acc-opening-view.component.css']
})
export class AccOpeningViewComponent implements OnInit {

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
  allAgent:any;
  transTypeFlg = '';
  accountTypeDiv = 1;
  branchCode = '0';
  savingsDepoSpclPeriod = 0;
  openDate: Date;
  cashAccountCode = -1;
  showMsg: ShowMessage;
  suspanceAccCd: number;
  cashAccCd: number;
  _len:number= 0;
  // isOpenFromDp = false;
  modalRef: BsModalRef;
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  disablejoinholder:boolean=true;
  hidejoin:boolean=false;
  disableConst:boolean=true;
  enableConst:boolean=true;
  showNoResult=false
  shownoresult:boolean=false
  createUser = '';
  updateUser = '';
  createDate: Date;
  updateDate: Date;
  disabledOnNull=true;
  sys = new SystemValues();
  denominationGrandTotal = 0;
  userType:any
  isLoading = false;
  // disableCustNameFlg = true;
  // disableCustomerName = true;
  disableAll = true;
  disableAccountTypeAndNo = true;

  operationType = '';
  agentName: string = '';
  showAlert = false;
  alertMsg: string;
  alertMsgType: string;

  x1 = 1;
  y1 = 1;


  // Declaration of model for each Div
  masterModel = new AccOpenDM();
  tm_deposit = new tm_deposit();
  masterModel2 = new AccOpenDM();//PARTHA

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
  suggestedSBCustomer: mm_customer[];
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

  acc_master: m_acc_master[] = [];

  p_gen_param = new p_gen_param();
  relStatus:any;
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
    { id: 10, val: 'Others' }];

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
    { instr_code: '0', instr_dscr: 'None' },
    { instr_code: 'N', instr_dscr: 'No SI' },
    { instr_code: 'Y', instr_dscr: 'SI' }

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


    this.getAgentList();
    this.branchCode = this.sys.BranchCode;
    this.createUser = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
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

    this.getDenominationList();
    this.getAccountTypeList();
    this.getConstitutionList();
    this.getOperationalInstr();
    this.retrieveData()
    this.getRelations();

    // console.log(this.constitutionDtParser('YEAR=1;Month=10;Days=25;'));
  }
  getRelations(){
    this.svc.getlbr(environment.relUrl,null).subscribe(data=>{
      this.relStatus=data;
    })
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
    // this.disableCustomerName = true;
    this.disableAccountTypeAndNo = true;

    this.operationType = '';

    this.showAlert = false;
    this.alertMsg = '';
    this.alertMsgType = '';

    this.denominationGrandTotal = 0;
    this.masterModel = new AccOpenDM();



  }

  public suggestCustomer2(): Observable<mm_customer> {
    this.isLoading = true;
    console.log("here")
    // console.log(this.f.acct_num.value.length)
    //  console.log(this.accDtlsFrm.get('home_brn_cd').value)
    if (this.tm_deposit.user_acc_num.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = localStorage.getItem("sbAccType");
      // (this.sys.ardbCD=="20" ||this.sys.ardbCD=="11" || this.sys.ardbCD=="26"||this.sys.ardbCD=="10"||this.sys.ardbCD=="22"||this.sys.ardbCD=="23")? 1:8;
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
  initializeModels() {

    this.tm_deposit = new tm_deposit();
    // this.tm_deposit.opening_dt = this.openDate  ; // this.DateFormatting(this.openDate);
    // this.tm_deposit.opening_dt = this.sys.CurrentDate;
    this.tm_deposit.opening_dt = null;

    this.tm_deposit.acc_num = null;
    this.tm_deposit.cheque_facility_flag = 'N';
    this.tm_deposit.tds_applicable = 'N';
    this.tm_deposit.standing_instr_flag = 'N';

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

    this.masterModel.tmdeposit = this.tm_deposit;
    this.masterModel.tdintroducer = this.td_introducerlist;

    this.masterModel.tdnominee = this.td_nomineeList;
    this.masterModel.tdsignatory = this.td_signatoryList;
    this.masterModel.tdaccholder = this.td_accholderList;

    this.p_gen_param = new p_gen_param();
  }


  assignModelsFromMasterData() {

      //debugger;
    if ( this.masterModel.tmdeposit.acc_close_dt !== undefined
      && this.masterModel.tmdeposit.acc_close_dt !== null
      && this.masterModel.tmdeposit.acc_close_dt.toString() !== '01/01/0001 00:00'
      && this.masterModel.tmdeposit.acc_status.toUpperCase() === 'C' )
      {
        this.HandleMessage(true, MessageType.Warning, 'The Account#'+ this.masterModel.tmdeposit.acc_num +' is Closed !!');
        return;
      }

    let retDepositPeriodArr = [];

    this.tm_deposit = new tm_deposit();

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


    this.tm_deposit = this.masterModel.tmdeposit;
    this.td_signatoryList = this.masterModel.tdsignatory;
    console.log(this.td_signatoryList);
    this.tm_deposit.cust_name
      
    this.setCustDtls(this.tm_deposit.cust_cd);
    this.setAccountType(this.tm_deposit.acc_type_cd);
    this.setIntTfrType(this.tm_deposit.intt_trf_type);
    this.setConstitutionType(this.tm_deposit.constitution_cd);
    this.setOperationalInstr(this.tm_deposit.oprn_instr_cd);

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


    if (this.tm_deposit.standing_instr_flag) {
      this.setStandingInstrAfterMatu(this.tm_deposit.standing_instr_flag);
    }


    this.td_nomineeList = this.masterModel.tdnominee;
    this.td_signatoryList = this.masterModel.tdsignatory;
    this.td_accholderList = this.masterModel.tdaccholder.reverse();
    this._len = this.td_accholderList.length > 0 ? this.td_accholderList.length : this._len;
    for (const idx in this.td_accholderList) {
      this.setRelationship(this.td_accholderList[idx].relation, Number(idx));
    }
    // debugger
    // this.tm_deposit.prn_amt = this.masterModel2.tmdeposit.prn_amt;
    // this.tm_deposit.intt_amt = this.masterModel2.tmdeposit.intt_amt;

    // debugger

  }


  getCustomerList() {
    const cust = new mm_customer();
    cust.cust_cd = 0;
    cust.brn_cd = this.branchCode;

    if (this.customerList === undefined || this.customerList === null || this.customerList.length === 0) {
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
        res => {
          debugger
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

    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
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

  getOperationalInstr() {

    if (this.operationalInstrList.length > 0) {
      return;
    }

    this.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
      res => {

        this.operationalInstrList = res;
        this.operationalInstrList = this.operationalInstrList.sort((a, b) => (a.oprn_cd > b.oprn_cd) ? 1 : -1);
      },
      err => {

      }
    );
  }


  getDenominationList() {

    let denoList: tt_denomination[] = [];
    this.svc.addUpdDel<any>('Common/GetDenomination', null).subscribe(
      res => {

        denoList = res;
        this.denominationList = denoList.sort((a, b) => (a.value < b.value) ? 1 : -1);
      },
      err => {
      }
    );
  }



  clearData() {
    this.operationType = '';
    this.disabledOnNull=true;
    this.suggestedCustomer=null;
    this.showNoResult=false;
    this._len = 0;
    this.initializeMasterDataAndFlags();
    this.initializeModels();
    this.closeAlertMsg();
  }

  retrieveData() {

    this.clearData();

    this.operationType = '';

    this.disableAll = true;
    // this.disableCustomerName = true;
    this.disableAccountTypeAndNo = false;
    this.tm_deposit.brn_cd = this.branchCode;
  }


  getAccountOpeningData(cust: mm_customer) {

    if (this.tm_deposit.acc_type_cd === null || this.tm_deposit.acc_type_cd === undefined) {
      this.HandleMessage(true, MessageType.Warning, 'Please select Account Type');
      this.tm_deposit.acc_num = null;
      exit(0);
    }

    this.tm_deposit.acc_num = cust.acc_num;
    this.suggestedCustomer = null;

    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetAccountOpeningData', this.tm_deposit).subscribe(
      res => {

        //debugger;
        this.isLoading = false;
        this.masterModel = res;
        this.masterModel2=res//PARTHA
        console.log(this.masterModel2);
        
        if (this.masterModel === undefined || this.masterModel === null) {
          // this.showAlertMsg('WARNING', 'No record found!!');
          this.HandleMessage(true, MessageType.Warning, 'No record found!!');
        }
        else {
          if (this.masterModel.tmdeposit.acc_num !== null) {
            this.agentName=''
            if(this.masterModel.tmdeposit.acc_type_cd==10){
              const agent = this.allAgent.find(a => a.agent_cd === this.masterModel.tmdeposit.agent_cd);
              this.agentName = agent ? agent.agent_name : '';
            }
            this.disableAccountTypeAndNo = true;
            this.assignModelsFromMasterData();
            if(this.tm_deposit.acc_type_cd==6){
              this.processInstallmentAmount()//To Be Change PARTHA
             }
             this.getUserType();

            console.log(this.masterModel.tmdeposit);
            
            debugger
            this.operationType = 'Q';

          }
          else {
            // this.showAlertMsg('WARNING', 'No record found!!!');
            this.HandleMessage(true, MessageType.Warning, 'No record found!!');
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
  getUserType ()
  {
   
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('__userId');
    // 
    // login.user_id=login.user_id.split('/')[0]
    login.brn_cd = this.sys.BranchCode;
    login.ardb_cd=this.sys.ardbCD,
    
        this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
            res => {
              console.log(res)
              this.userType=res[0].user_type
             debugger
            }
        )

  }


  modifyData() {

    // if (this.operationType !== 'Q') {
    //   this.HandleMessage(true, MessageType.Warning, 'Record not retrived to modify');
    //   return;
    // }
    this.operationType = 'U';
    this.disableAll = false;
    if(this.userType=="A"){
      this.disableConst=false;
      // if(this.tm_deposit.constitution_cd==101){
      //   this.enableConst=false
      // }
      // else{
      //   this.enableConst=true
      // }
    }
    else{
      this.disableConst=true

    }
  }


  saveData() {   
    if (this.operationType !== 'U') {
      this.HandleMessage(true, MessageType.Warning, 'Record not Updated to Save');
      return;
    }
    if((this.tm_deposit.oprn_instr_cd == 2 || this.tm_deposit.oprn_instr_cd == 3) && this.td_accholderList.length == 1){
      if(this.td_accholderList[0].acc_holder == null && this.td_accholderList[0].acc_num == null && this.td_accholderList[0].relationId == null){
        this.HandleMessage(true, MessageType.Error, 'Joint holder details are mandatory for operational instruction type "All Joint" and "Either Or Survivour"');
        return;
      }
    }

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

    this.tm_deposit.modified_by = this.updateUser;
    this.tm_deposit.modified_dt = this.updateDate;
    this.UpdateAccountOpenData();

    this.disableAll = true;
    this.disableAccountTypeAndNo = false;
  }

  validateData() {
    let nomPercent = 0;
    if (this.tm_deposit.oprn_instr_cd === null || this.tm_deposit.oprn_instr_cd === undefined) {
      this.HandleMessage(true, MessageType.Warning, 'Operational Instruction can not be blank');
      exit(0);
    }

    for (const l in this.td_signatoryList) {
      if (this.td_signatoryList[l].signatory_name === null || this.td_signatoryList[l].signatory_name === undefined) {
        this.HandleMessage(true, MessageType.Warning, 'Signatory Name is Blank');
        exit(0);
      }

      this.td_signatoryList[l].acc_num = this.tm_deposit.acc_num;
      this.td_signatoryList[l].brn_cd = this.branchCode;
      this.td_signatoryList[l].acc_type_cd = Number(this.tm_deposit.acc_type_cd);

    }


    for (const l in this.td_accholderList) {
      if (this.td_accholderList[l].acc_holder === null || this.td_accholderList[l].acc_holder === undefined) {
        this.td_accholderList = this.td_accholderList.splice(Number(l), 1);
      }
      else {
        if (this.td_accholderList[l].relation === null || this.td_accholderList[l].relation === undefined) {
          this.HandleMessage(true, MessageType.Warning, 'Joint Holder Relation is Blank');
          exit(0);
        }
debugger
        this.td_accholderList[l].acc_type_cd = this.tm_deposit.acc_type_cd;
        this.td_accholderList[l].acc_num = this.tm_deposit.acc_num;
        this.td_accholderList[l].brn_cd = this.branchCode;
        this.td_accholderList[l].upd_ins_flag = this.operationType;
        debugger
      }
    }

    if ((this.tm_deposit.acc_type_cd === 2 || this.tm_deposit.acc_type_cd === 5 || this.tm_deposit.acc_type_cd === 6)
      && this.tm_deposit.cheque_facility_flag === 'Y'
      && (this.tm_deposit.user_acc_num === undefined || this.tm_deposit.user_acc_num === null || this.tm_deposit.user_acc_num === "")) {
      this.HandleMessage(true, MessageType.Warning, 'Enter Account Number for Standing Instruction');
      exit(0);
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
          this.HandleMessage(true, MessageType.Warning, 'Nominee Percentage is blank');
          exit(0);
        }
        this.td_nomineeList[l].acc_num = this.masterModel.tmdeposit.acc_num;
        this.td_nomineeList[l].acc_type_cd = this.tm_deposit.acc_type_cd;
        this.td_nomineeList[l].brn_cd = this.branchCode;
        this.td_nomineeList[l].upd_ins_flag = this.operationType;

        nomPercent = nomPercent + Number(this.td_nomineeList[l].percentage);
        debugger
      }
    }

    if (nomPercent > 0 && nomPercent < 100) {
      // this.showAlertMsg('WARNING', 'Nominee Total Percentage < 100');
      this.HandleMessage(true, MessageType.Warning, 'Nominee Total Percentage < 100');
      exit(0);
    }

    if ((this.tm_deposit.user_acc_num === undefined || this.tm_deposit.user_acc_num === null || this.tm_deposit.user_acc_num === "")
    && (this.tm_deposit.acc_type_cd === 6)) {
    this.HandleMessage(true, MessageType.Warning, 'S/B Account Number not present to update the Account Type- '
      + this.tm_deposit.acc_type_desc);
    exit(0);
  }

    if ((this.tm_deposit.acc_type_cd === 1 || this.tm_deposit.acc_type_cd === 7
      || this.tm_deposit.acc_type_cd === 8 || this.tm_deposit.acc_type_cd === 9)) {
      this.tm_deposit.user_acc_num = null;
      
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
    temp_deposit.acc_type_cd = localStorage.getItem("sbAccType");
    // (this.sys.ardbCD=="20" || this.sys.ardbCD=="26"||this.sys.ardbCD=="10"||this.sys.ardbCD=="11"||this.sys.ardbCD=="22"||this.sys.ardbCD=="23")? 1:8;

    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
      res => {
        //debugger;
        temp_deposit_list = res;
        this.isLoading = false;

        if (temp_deposit_list.length > 0)
        {
          temp_deposit_list = temp_deposit_list.filter( x => x.acc_status.toUpperCase() !== 'C')
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

  UpdateAccountOpenData() {
    let ret = -1;
    this.validateData();
    this.isLoading = true;
    this.masterModel.tmdeposit.ext_instl_tot=this.tm_deposit.ext_instl_tot
    this.masterModel.tmdeposit.constitution_cd=this.tm_deposit.constitution_cd
    this.masterModel.tmdeposit.constitution_desc=this.selectedConstitutionList.filter(e=>e.constitution_cd==this.tm_deposit.constitution_cd)[0].constitution_desc
    
    console.log(this.masterModel)
    console.log(this.tm_deposit)
    debugger
    this.svc.addUpdDel<any>('Deposit/UpdateAccountOpeningDataOrg', this.masterModel).subscribe(
      res => {

        ret = Number(res);
        this.isLoading = false;

        if (ret === 0) {
          this.HandleMessage(true, MessageType.Sucess, 'Record Set Updated Successfully');

          // this.disableCustomerName = true;
          this.operationType = '';
        }
        else {
          this.HandleMessage(true, MessageType.Error, 'Unable to Save Record Set');
        }
      },
      err => {
        this.isLoading = false;
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

    if (accType === 0) {
      accType = 1;
    }
    this.accountTypeDiv = Number(accType);
    this.tm_deposit.acc_type_cd = Number(accType);
    this.tm_deposit.acc_type_desc = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;
    console.log({"AccType:":accType});
    this.SetInttTfrType(accType);
  }
  SetInttTfrType(_accType:any){
     console.log(_accType);
        
    switch(_accType){
      case '5': this.tm_deposit.intt_trf_type = this.intTransferType[0].tfr_type;
              this.tm_deposit.intt_tfr_type_dscr = this.intTransferType[0].tfr_desc;
              break;
      case '2': console.log(_accType);this.tm_deposit.intt_trf_type = this.intTransferType[4].tfr_type;
              this.tm_deposit.intt_tfr_type_dscr = this.intTransferType[4].tfr_desc;
              break;   
      case '3':this.tm_deposit.intt_trf_type = this.intTransferType[4].tfr_type;
             this.tm_deposit.intt_tfr_type_dscr = this.intTransferType[4].tfr_desc;
             break;
      case '4':this.tm_deposit.intt_trf_type = this.intTransferType[4].tfr_type;
             this.tm_deposit.intt_tfr_type_dscr = this.intTransferType[4].tfr_desc;
             break;
      default:break;   
    }
  }
  

  setRelationship(relation: string, idx: number) {
    if(relation==null||relation==undefined||relation==''){
      return;
    }
    else{
      relation = relation.trim();
      this.td_accholderList[idx].cust_cd = Number(this.td_accholderList[idx].cust_cd);
      this.td_accholderList[idx].relation = relation;
      this.td_accholderList[idx].relationId = this.relationship.filter(x => x.val.toLocaleLowerCase() === relation.toLocaleLowerCase())[0]?.id;
      // this.td_signatoryList[idx+1].cust_cd = Number(this.td_accholderList[idx].cust_cd); 
      }
    }

  setIntTfrType(tfr_type: string) {
    if (tfr_type == null) {
      return;
    }
    this.tm_deposit.intt_trf_type = tfr_type;
    this.tm_deposit.intt_tfr_type_dscr = this.intTransferType.filter(x => x.tfr_type.toString()
      === tfr_type.toString())[0].tfr_desc;
  }

  setConstitutionType(val: number) {

    this.tm_deposit.constitution_cd = Number(val);
    this.selectedConstitutionList = this.constitutionList.filter(x => x.acc_type_cd.toString() === this.tm_deposit.acc_type_cd.toString());
    this.tm_deposit.constitution_desc = this.selectedConstitutionList.
      filter(x => x.constitution_cd.toString() === val.toString())[0].constitution_desc;

    this.tm_deposit.acc_cd = this.constitutionList.
      filter(x => x.constitution_cd.toString() === val.toString())[0].acc_cd;
  }

  setOperationalInstr(val: number) {
    this.tm_deposit.oprn_instr_cd = Number(val);
    this.tm_deposit.oprn_instr_desc = this.operationalInstrList.filter(x => x.oprn_cd.toString() === val.toString())[0].oprn_desc;
  }


  getCategoryList() {
    this.svc.addUpdDel<any>('Mst/GetCategoryMaster', null).subscribe(
      res => {
        this.categoryList = res;
      },
      err => {
      }
    );
  }


  onChangeNull(){
    this.suggestedCustomer = null;
    this.showNoResult=false
    if (this.tm_deposit.acc_num.length > 2){
      this.disabledOnNull=false;
    }
    else{
      this.disabledOnNull=true
    }
  }
  public suggestCustomer(): void {
    //debugger;
    this.isLoading=true;
    if (this.tm_deposit.acc_num.length > 2)
      {
        if (this.tm_deposit.acc_type_cd === undefined || this.tm_deposit.acc_type_cd === null) {
          this.isLoading=false
        this.HandleMessage(true, MessageType.Warning, 'Please select Account Type');
        this.tm_deposit.acc_num = null;
        exit(0);
      }

      const prm = new p_gen_param();
      prm.ad_acc_type_cd = this.tm_deposit.acc_type_cd;
      prm.as_cust_name = this.tm_deposit.acc_num.toLowerCase();

      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          this.isLoading=false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res
            this.showNoResult=false
            
          } else {
            this.showNoResult=true
            this.suggestedCustomer = [];
            this.HandleMessage(true, MessageType.Warning, 'The Account#'+ this.masterModel.tmdeposit.acc_num +' does not match with any active account !!');
            return;
          }

        },
        err => { this.isLoading = false; }
      );
    } else {
      this.showNoResult=true
      this.suggestedCustomer = null;
    }
  }



  public suggestCustomerSignatories(idx: number): void {

    this.suggestedCustomerSignatoriesIdx = idx;

    if (this.td_signatoryList[idx].signatory_name.toString().length > 2) {
      const prm = new p_gen_param();
      prm.as_cust_name = this.td_signatoryList[idx].signatory_name.toString().toLowerCase();
      this.isLoading = true;
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {

          this.isLoading = false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomerSignatories = res
          } else {
            this.suggestedCustomerSignatories = null;
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomerSignatories = null;
    }
  }

  public setCustDtlsSignatories(cust_cd: number, idx: number): void {
    this.td_signatoryList[idx].signatory_name = this.suggestedCustomerSignatories
    .filter(c => c.cust_cd.toString() === cust_cd.toString())[0].cust_name;
    this.suggestedCustomerSignatories = null;
  }


  // public suggestCustomerJointHolder(idx: number): void {
  //   this.suggestedCustomerJointHolderIdx = idx;

  //   if (this.td_accholderList[idx].acc_holder.toString().length > 2) {
  //     const prm = new p_gen_param();
  //     prm.as_cust_name = this.td_accholderList[idx].acc_holder.toString().toLowerCase();
  //     this.isLoading = true;
  //     this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
  //       res => {

  //         this.isLoading = false;
  //         if (undefined !== res && null !== res && res.length > 0) {
  //           this.suggestedCustomerJointHolder = res
  //           this.hidejoin=false;
  //         } else {
  //           this.suggestedCustomerJointHolder = null;
  //           this.hidejoin=true;
  //         }
  //       },
  //       err => { this.isLoading = false; }
  //     );
  //   } else {
  //     this.suggestedCustomerJointHolder = null;
  //   }
  // }
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


  // public setCustDtlsJointHolder(cust_cd: number, idx: number): void {
     
    
  //   this.td_accholderList[idx].cust_cd = cust_cd;
  //   this.getSetJointHolderName(idx);
  //   this.hidejoin=true;
  //   this.suggestedCustomerJointHolder = null;
  //   if(this._len != this.td_accholderList.length){
  //   this.addSignatory();this._len =  this.td_accholderList.length}
  //   this.td_signatoryList[idx+1].signatory_name =  this.td_accholderList[idx].acc_holder;
  //   this.td_signatoryList[idx+1].ardb_cd = this.sys.ardbCD;
  //   this.td_signatoryList[idx+1].brn_cd = this.branchCode;
  //   this.td_signatoryList[idx+1].cust_cd = cust_cd;
  //   console.log({"Cust_id":cust_cd,"Index":idx,"Name":this.td_signatoryList});
  // }
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
  getSetJointHolderName(idx: number) {
    let temp_mm_cust = new mm_customer();

    if (this.suggestedCustomerJointHolder !== undefined
      && this.suggestedCustomerJointHolder !== null
      && this.suggestedCustomerJointHolder.length > 0) {
        this.hidejoin=false;
      temp_mm_cust = this.suggestedCustomerJointHolder
      .filter(c => c.cust_cd.toString() === this.td_accholderList[idx].cust_cd.toString())[0];
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
    this.msg.sendcustomerCodeForKyc(cust_cd);
    console.log(this.masterModel.tmdeposit);
    debugger
    this.getSetCustDtls(cust_cd);
  }

  getSetCustDtls(cust_cd: number) {
    console.log(this.masterModel.tmdeposit);
    debugger
    let temp_mm_cust = new mm_customer();
    const temp_tm_deposit = new tm_deposit();
    temp_tm_deposit.cust_cd = cust_cd;

    if (this.suggestedCustomer !== undefined && this.suggestedCustomer != null && this.suggestedCustomer.length > 0) {
      temp_mm_cust = this.suggestedCustomer.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
      this.suggestedCustomer = null;
      this.populateCustDtls(temp_mm_cust);
    }
    else {

      this.isLoading = true;
      temp_mm_cust.cust_cd = cust_cd;
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', temp_mm_cust).subscribe(
        res => {

          this.suggestedCustomer = res;
          if(this.suggestedCustomer){
            if(this.td_signatoryList){
              const fromIndex = this.td_signatoryList.findIndex(obj => obj.signatory_name == this.suggestedCustomer[0].cust_name);
              const toIndex = 0;
              debugger
              const element =  this.td_signatoryList.splice(fromIndex, 1)[0];
              console.log(element); // ['css']
      
              this.td_signatoryList.splice(toIndex, 0, element);
      
              console.log( this.td_signatoryList); // 👉️ ['js', 'ts', 'css']
            }
            else{
              
              alert('Add Main Acc Holder Signature Fast..')
            }
      debugger
          }
          if (this.suggestedCustomer !== undefined && this.suggestedCustomer != null && this.suggestedCustomer.length > 0) {
            temp_mm_cust = this.suggestedCustomer.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
            this.suggestedCustomer = null;
            this.populateCustDtls(temp_mm_cust);
            console.log(temp_mm_cust);
            console.log(this.masterModel);
            // for(let i=0;i=this.td_signatoryList.length;){
            //   debugger
            //   this.td_signatoryList.pop()
            // }
            // console.log(this.masterModel2.tdsignatory.length);
            // console.log(this.masterModel2.tdsignatory);
            // console.log(this.masterModel2);
            
            // for(let i=0;i<this.masterModel2.tdsignatory.length;i++){
            //   debugger
            //   if (this.masterModel2.tdsignatory[i].signatory_name.toLocaleLowerCase() == temp_mm_cust.cust_name.toLocaleLowerCase())
            // {
            //    this.td_signatoryList.push()
            // }
            // else{
            //    this.td_signatoryList.push()
            // }
            // }
            // console.log(this.td_signatoryList);
            
            
          }
          this.isLoading = false;
        },
        err => { this.isLoading = false; }
      );
    }

    // temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];

    if (this.operationType === 'I') {
      this.isLoading = true;
      this.svc.addUpdDel<any>('Deposit/GetCustMinSavingsAccNo', temp_tm_deposit).subscribe(
        res => {

          this.isLoading = false;
          const x = res;
          this.tm_deposit.user_acc_num = x.toString();
          // this.tm_deposit.user_acc_num = this.tm_deposit.user_acc_num.toString();
        },
        err => {
          this.isLoading = false;
          this.tm_deposit.user_acc_num = null;
        }
      );
    }
  }

  populateCustDtls(temp_mm_cust: mm_customer) {

    this.tm_deposit.cust_name = temp_mm_cust.cust_name;
    if (temp_mm_cust.cust_type === 'M') {
      this.tm_deposit.cust_type = 'Member';
    }
    else {
      this.tm_deposit.cust_type = 'Non-Member';
    }
    this.tm_deposit.gurdain_name = temp_mm_cust.guardian_name;

    this.tm_deposit.date_of_birth = temp_mm_cust.dt_of_birth;

    this.tm_deposit.sex = temp_mm_cust.sex;
    this.tm_deposit.sexType = this.sexType.filter(c => c.type?.toString() === this.tm_deposit.sex?.toString())[0]?.desc;

    this.tm_deposit.phone = temp_mm_cust.phone;

    this.tm_deposit.occupation = temp_mm_cust.occupation;
    this.tm_deposit.email = temp_mm_cust.email;
    this.tm_deposit.present_addr = temp_mm_cust.present_address;

    this.tm_deposit.category_cd = temp_mm_cust.catg_cd;
    this.setCategoryDesc(this.tm_deposit.category_cd);

    

    if (this.operationType === 'I') {
      this.td_signatoryList[0].cust_cd = temp_mm_cust.cust_cd;
      this.td_signatoryList[0].signatory_name = temp_mm_cust.cust_name;
      this.td_signatoryList[0].brn_cd = this.branchCode;
    }
    if(this.masterModel.tdsignatory[0]==undefined){
      const sig: td_signatory[]=[];
      this.td_signatoryList=sig
      debugger
      this.masterModel.tdsignatory=this.td_signatoryList
    }
    
    console.log(this.masterModel.tmdeposit);

    debugger
    
  }

  setCategoryDesc(category: number) {
    this.tm_deposit.category_desc = this.categoryList.filter(x => x.catg_cd?.toString()
      === category?.toString())[0]?.catg_desc;
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
      this.td_accholderList.pop();
    }
    // if (this.td_accholderList.length > 1) {
    //   console.log({"td_signatory":  this.td_signatoryList});
    //   this.removeSignatoryByIndex(this.td_accholderList[(this.td_accholderList.length-1)].cust_cd);
    //   this.td_accholderList.pop();
    //   this._len = this.td_accholderList.length
    // }
  }
  removeSignatoryByIndex(cust_cd:Number){
    console.log({"cust_cd": cust_cd,"td_signatory":  this.td_signatoryList,"joint_holder":this.td_accholderList});
    
    var Index = this.td_signatoryList.findIndex((x:td_signatory) => x.cust_cd == cust_cd );
    console.log(Index);
    
    this.td_signatoryList.splice(Index,1);   
  }

  checkSignatory(name: string, idx: number) {
    debugger
    const x = this.td_accholderList.filter(c => c.acc_holder?.toString() === name?.toString())[0]?.cust_cd;


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
        .filter(x => x.introducer_acc_type_cd?.toString() ===
          intro_acc_typ_cd?.toString())[0].introducer_acc_type_desc;
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

    this.isLoading = true;

    this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
      res => {

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

        this.isLoading = false;
      }
    );
  }

  getIntroducerName(cust_cd: number, idx: number) {

    let temp_mm_cust = new mm_customer();
    let temp_mm_cust_list: mm_customer[] = [];
    temp_mm_cust.cust_cd = cust_cd;
    this.isLoading = true;
    this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', temp_mm_cust).subscribe(
      res => {

        temp_mm_cust_list = res;

        if (temp_mm_cust_list !== undefined && temp_mm_cust_list != null && temp_mm_cust_list.length > 0) {
          temp_mm_cust = temp_mm_cust_list.filter(c => c.cust_cd?.toString() === cust_cd?.toString())[0];
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
        temp_acc_type = this.accountTypeList.filter(x => x.acc_type_cd?.toString() === accType?.toString())[0];

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

      if (this.td_deftranstrfList[0]?.gl_acc_code === this.cashAccCd?.toString()) {
        // this.showAlertMsg('WARNING', 'GL Code can not be Cash Account Code');
        this.HandleMessage(true, MessageType.Warning, 'GL Code can not be Cash Account Code');
        return;
      }


      this.td_deftranstrfList[0].acc_cd = Number(this.td_deftranstrfList[0]?.gl_acc_code);

      if (this.td_deftranstrfList[0].cust_acc_type === undefined ||
        this.td_deftranstrfList[0].cust_acc_type === null ||
        this.td_deftranstrfList[0].cust_acc_type === '') {
        if (this.acc_master === undefined || this.acc_master === null || this.acc_master.length === 0) {
          this.isLoading = true;
          let temp_acc_master = new m_acc_master();
          this.svc.addUpdDel<any>('Mst/GetAccountMaster', null).subscribe(
            res => {

              this.acc_master = res;
              this.isLoading = false;
              temp_acc_master = this.acc_master.filter(x => x.acc_cd?.toString() === this.td_deftranstrfList[0]?.gl_acc_code)[0];
              if (temp_acc_master === undefined || temp_acc_master === null) {
                this.td_deftranstrfList[0].gl_acc_desc = null;
                // this.showAlertMsg('WARNING', 'Invalid GL Code');
                this.HandleMessage(true, MessageType.Warning, 'Invalid GL Code');
                return;
              }
              else {
                this.td_deftranstrfList[0].gl_acc_desc = temp_acc_master.acc_name;
              }
            },
            err => {

              this.isLoading = false;
            }
          );
        }
        else {
          let temp_acc_master = new m_acc_master();
          temp_acc_master = this.acc_master.filter(x => x.acc_cd?.toString() === this.td_deftranstrfList[0]?.gl_acc_code)[0];
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

    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
      res => {

        temp_deposit_list = res;
        this.isLoading = false;

        if (temp_deposit_list.length === 0) {
          // this.showAlertMsg('WARNING', '');
          this.HandleMessage(true, MessageType.Warning, 'Invalid Account Number in Transfer Details');
          this.td_deftranstrfList[0].cust_acc_number = null;
          exit(0);
        }

        let temp_mm_cust = new mm_customer();
        temp_mm_cust = this.customerList.filter(c => c.cust_cd?.toString() === temp_deposit_list[0]?.cust_cd?.toString())[0];
        this.td_deftranstrfList[0].cust_name = temp_mm_cust.cust_name;

        this.td_deftranstrfList[0].clr_bal = temp_deposit_list[0].clr_bal;
        this.td_deftranstrfList[0].acc_cd = this.constitutionList.filter(x => x.acc_type_cd?.toString() ===
          temp_deposit.acc_type_cd.toString()
          && x.constitution_cd?.toString() === temp_deposit_list[0].constitution_cd?.toString())[0].acc_cd;

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
      if (this.tm_deposit.instl_amt?.toString() !== amount?.toString()) {
        // this.showAlertMsg('WARNING', 'Debit Amount is not matching with Installment Amount');
        this.HandleMessage(true, MessageType.Warning, 'Debit Amount is not matching with Installment Amount');
        exit(0);
      }
    }
    else {
      if (this.tm_deposit.prn_amt?.toString() !== amount?.toString()) {
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
      if (parseInt(this.td_deftranstrfList[0].clr_bal?.toString()) < parseInt(amount?.toString())) {
        // this.showAlertMsg('WARNING', 'Insufficient Balance');
        this.HandleMessage(true, MessageType.Warning, 'Insufficient Balance');
        this.td_deftranstrfList[0].amount = null;
        exit(0);
      }
    }

  }

  xxxxxxxx(val: any) {
    null;
  }

  setStandingInstrAfterMatu(val: any) {

    this.tm_deposit.standing_instr_flag = val?.toString();
    this.tm_deposit.standing_instr_dscr = this.standingInstrAfterMaturity.filter(x => x.instr_code === val?.toString())[0].instr_dscr;
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
    this.calCrdIntReg(temp_gen_param);
  }


  calCrdIntReg(tempGenParam: p_gen_param) {
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

      if (this.tm_deposit.year === 0 && this.tm_deposit.month === 0 && this.tm_deposit.day === 0) {
        this.tm_deposit.prn_amt = 0;
        // this.showAlertMsg('Warning', 'Please enter Deposit period');
        this.HandleMessage(true, MessageType.Error, 'Please enter Deposit period');
        return;
      }

      if (this.tm_deposit.acc_type_cd === undefined ||
        this.tm_deposit.acc_type_cd === null ||
        this.tm_deposit.acc_type_cd < 0) {
        this.tm_deposit.prn_amt = 0;
        // this.showAlertMsg('Warning', 'Account Type can not be blank');
        this.HandleMessage(true, MessageType.Error, 'Account Type can not be blank');
        return;
      }

      if (this.tm_deposit.intt_trf_type === undefined ||
        this.tm_deposit.intt_trf_type === null) {
        this.tm_deposit.prn_amt = 0;
        // this.showAlertMsg('Warning', 'Interest Transfer Type can not be blank');
        this.HandleMessage(true, MessageType.Error, 'Interest Transfer Type can not be blank');
        return;
      }

      if (this.tm_deposit.intt_rt === undefined || this.tm_deposit.intt_rt === null || this.tm_deposit.intt_rt <= 0) {
        this.tm_deposit.prn_amt = 0;
        // this.showAlertMsg('Warning', 'Please set the Interest Rate..');
        this.HandleMessage(true, MessageType.Error, 'Please set the Interest Rate..');
        return;
      }

      if (this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null || this.tm_deposit.prn_amt <= 0) {
        this.tm_deposit.prn_amt = 0;
        this.tm_deposit.intt_amt = 0;
        // this.showAlertMsg('Warning', 'Please set the Principal..');
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

      // this.f_calctdintt_reg(temp_gen_param);
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

    // this.f_calctdintt_reg(temp_gen_param);
  }

  calculateInterestRate() {
    const temp_gen_param2 = new p_gen_param();
    temp_gen_param2.acc_cd = this.tm_deposit.acc_type_cd;
    temp_gen_param2.from_dt = this.sys.CurrentDate;
    temp_gen_param2.ls_catg_cd = this.tm_deposit.category_cd;
    temp_gen_param2.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(),
      this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) -
      (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(),
        this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24)) - 1;
    this.svc.addUpdDel<any>('Deposit/GET_INT_RATE', temp_gen_param2).subscribe(
      res => {

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
      this.HandleMessage(true, MessageType.Warning, 'Record not retrived to delete');
      return;
    }


    temp_def_trans_trf.brn_cd = this.tm_deposit.brn_cd;
    temp_def_trans_trf.acc_num = this.tm_deposit.acc_num;
    temp_def_trans_trf.acc_type_cd = this.tm_deposit.acc_type_cd;
    temp_def_trans_trf.trans_cd = this.td_deftrans.trans_cd;
    temp_def_trans_trf.trans_dt = this.td_deftrans.trans_dt;

    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/DeleteAccountOpeningData', temp_def_trans_trf).subscribe(
      res => {

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

    if (this.operationType === 'U') {
      this.disableAll = false;
      this.disableAccountTypeAndNo = false;
    }
  }
  getAgentList() {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode
    }
    this.svc.addUpdDel('Deposit/GetAgentData', dt).subscribe(res => {
      // this.agentRes=res
      this.allAgent=res
    })
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
    this.disableAll = true;
    this.disableAccountTypeAndNo = true;
    // On below for dissapearing message
    // setTimeout(() => {
    //   this.showMsg = new ShowMessage();
    // }, 3000);
  }

}
