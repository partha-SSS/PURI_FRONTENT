import { Component, OnInit } from '@angular/core';
import { exit } from 'process';
//  
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mm_category, mm_customer, td_def_trans_trf } from 'src/app/bank-resolver/Models';
import { AccOpenDM } from 'src/app/bank-resolver/Models/deposit/AccOpenDM';
import { mm_acc_type } from 'src/app/bank-resolver/Models/deposit/mm_acc_type';
import { mm_constitution } from 'src/app/bank-resolver/Models/deposit/mm_constitution';
import { mm_oprational_intr } from 'src/app/bank-resolver/Models/deposit/mm_oprational_intr';
import { td_accholder } from 'src/app/bank-resolver/Models/deposit/td_accholder';
import { td_introducer } from 'src/app/bank-resolver/Models/deposit/td_introducer';
import { td_nominee } from 'src/app/bank-resolver/Models/deposit/td_nominee';
import { td_signatory } from 'src/app/bank-resolver/Models/deposit/td_signatory';
import { tm_denomination_trans } from 'src/app/bank-resolver/Models/deposit/tm_denomination_trans';
import { tm_transfer } from 'src/app/bank-resolver/Models/deposit/tm_transfer';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tm_deposit } from 'src/app/bank-resolver/Models/tm_deposit';
import { RestService } from 'src/app/_service';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})

export class TestComponent implements OnInit {
  constructor(
    // private frmBldr: FormBuilder,
    private svc: RestService
  ) { }

  static accTypes: mm_acc_type[] = [];
  // selectedTransType = '';
  transTypeFlg = '';
  accountTypeDiv = 1;
  branchCode = '0';
  savingsDepoSpclPeriod = 0;
  openDate: Date;
  createUser = '';
  updateUser = '';
  createDate: Date;
  updateDate: Date;

  denominationGrandTotal = 0;

  isLoading = false;
  // disableCustNameFlg = true;
  disableCustomerName = true;
  disableAll = true;
  disableAccountTypeAndNo = true;

  operationType = '';

  showAlert = false;
  alertMsg: string;
  alertMsgType: string;

  x1 = 1;
  y1 = 1;


  // Declaration of model for each Div
  masterModel = new AccOpenDM();
  tm_deposit = new tm_deposit();
  td_nomineeList: td_nominee[] = [];
  td_signatoryList: td_signatory[] = [];
  td_accholderList: td_accholder[] = [];
  td_introducerlist: td_introducer[] = [];
  tm_denominationList : tm_denomination_trans[] = [];
  tm_transferList: tm_transfer[] = [];
  td_deftranstrfList: td_def_trans_trf[] = [];
  td_deftrans= new td_def_trans_trf();

  dummyList: string[] = [];


  // tempAccountTypeDscr = null;

  customerList: mm_customer[] = [];
  suggestedCustomer: mm_customer[];
  selectedCustomer = new mm_customer();

  categoryList: mm_category[] = [];
  accountTypeList: mm_acc_type[] = [];
  constitutionList: mm_constitution[] = [];
  selectedConstitutionList: mm_constitution[] = [];
  operationalInstrList: mm_oprational_intr[] = [];
  p_gen_param = new p_gen_param();

  relationship = [
    { id: 1, val: 'Father' },
    { id: 2, val: 'Mother' },
    { id: 3, val: 'Sister' },
    { id: 4, val: 'Brother' },
    { id: 5, val: 'Friend' },
    { id: 6, val: 'Son' },
    { id: 7, val: 'Daughter' },
    { id: 8, val: 'Others' }];

  intTransferType = [
    { tfr_type: 'M', tfr_desc: 'Monthly' },
    { tfr_type: 'Q', tfr_desc: 'Quarterly' },
    { tfr_type: 'H', tfr_desc: 'Half-Yearly' },
    { tfr_type: 'Y', tfr_desc: 'Yearly' },
    { tfr_type: 'O', tfr_desc: 'On-Maturity' },
  ];

  introducerAccTypeList = [
    { acc_type_cd: 1, acc_type_desc: 'Savings A/C' },
    { acc_type_cd: 8, acc_type_desc: 'Current A/C' }
  ];

  standingInstrAfterMaturity = [
    { instr_code: '1', instr_dscr: 'Auto Close' },
    { instr_code: '2', instr_dscr: 'Auto Renew' }
  ]


  introducerAccTypeListTemp = [];

  denominations = [
    { rupees: '2000', desc: 'Two Thousand (Rs.2000)' },
    { rupees: '500' , desc: 'Five Hundred (Rs.500)' },
    { rupees: '100' , desc: 'Hundred (Rs.100)' },
    { rupees: '50'  , desc: 'Fifty (Rs.50)' }];

    transferTypeList = [
      { trf_type: 'C', trf_type_desc: 'Cash' },
      { trf_type: 'T', trf_type_desc: 'Transfer' }];

      transferTypeListTemp = this.transferTypeList;

  ngOnInit(): void {

    ;
    this.branchCode = localStorage.getItem('__brnCd');
    // this.openDate = this.convertDate( localStorage.getItem('__currentDate'));
    this.openDate = new Date(localStorage.getItem('__currentDate'));
    this.savingsDepoSpclPeriod = Number(localStorage.getItem('__ddsPeriod'));

    this.createUser = localStorage.getItem('__userId');
    this.updateUser = localStorage.getItem('__userId');

    this.createDate = this.convertDate(Date.UTC( new Date().getDate() , new Date().getMonth(),  new Date().getFullYear()).toString());
    this.updateDate = this.convertDate(Date.UTC( new Date().getDate() , new Date().getMonth(),  new Date().getFullYear()).toString());

    this.suggestedCustomer = null;

    ;

    this.getCustomerList();
    this.getCategoryList();

    this.isLoading = true;

    this.initializeMasterDataAndFlags();
    this.initializeModels();

    ;
    this.getAccountTypeList();
    this.getConstitutionList();
    this.getOperationalInstr();

    // console.log(this.constitutionDtParser('YEAR=1;Month=10;Days=25;'));
  }

  private convertDate(datestring: string): Date {
    var parts = datestring.match(/(\d+)/g);
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }


  initializeMasterDataAndFlags()
  {
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

    ;

  }



  initializeModels()
  {
    ;
    this.tm_deposit = new tm_deposit();
    this.tm_deposit.opening_dt = this.DateFormatting(this.openDate);
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

    const deno: tm_denomination_trans[] = [];
    this.tm_denominationList = deno;
    this.addDenomination();

    const tm_trns: tm_transfer[] = [];
    this.tm_transferList = tm_trns;
    ;
    const td_deftrans: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftrans;
    // this.selectedTransType = '';

    this.td_deftrans = new td_def_trans_trf();

    this.masterModel.tmdeposit = this.tm_deposit;
    this.masterModel.tdintroducer = this.td_introducerlist;
    this.masterModel.tdnominee = this.td_nomineeList;
    this.masterModel.tdsignatory = this.td_signatoryList;
    this.masterModel.tdaccholder = this.td_accholderList;
    // this.masterModel.tmdenominationtrans = this.tm_denominationList;
    //somnath comment
    this.masterModel.tmtransfer = this.tm_transferList;
    this.masterModel.tddeftranstrf = this.td_deftranstrfList;
    this.masterModel.tddeftrans = this.td_deftrans;

    this.p_gen_param = new p_gen_param();
  }


  assignModelsFromMasterData()
  {

    var retDepositPeriodArr = [];

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

    const deno: tm_denomination_trans[] = [];
    this.tm_denominationList = deno;
    this.addDenomination();

    const tm_trns: tm_transfer[] = [];
    this.tm_transferList = tm_trns;

    const td_deftrans: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftrans;

    this.td_deftrans = new td_def_trans_trf();


    this.tm_deposit = this.masterModel.tmdeposit ;
    this.td_signatoryList = this.masterModel.tdsignatory;
    this.setCustDtls(this.tm_deposit.cust_cd);
    this.setAccountType(this.tm_deposit.acc_type_cd);
    this.setIntTfrType(this.tm_deposit.intt_trf_type);
    this.setConstitutionType(this.tm_deposit.constitution_cd);
    this.setOperationalInstr(this.tm_deposit.oprn_instr_cd);

    this.td_introducerlist = this.masterModel.tdintroducer;

    if ( this.tm_deposit.dep_period != undefined && this.tm_deposit.dep_period != null)
    {
    retDepositPeriodArr =  this.depositPeriodParser(this.tm_deposit.dep_period);
    this.tm_deposit.year = Number(retDepositPeriodArr[0]);
    this.tm_deposit.month = Number(retDepositPeriodArr[1]);
    this.tm_deposit.day = Number(retDepositPeriodArr[2]);
    }

    // tslint:disable-next-line: forin
    for (var idx in this.td_introducerlist) {
      this.setIntroducerAccountType(this.td_introducerlist[idx].introducer_acc_type, Number(idx));
    }

    ;
    this.td_nomineeList = this.masterModel.tdnominee;
    this.td_signatoryList = this.masterModel.tdsignatory;

    this.td_accholderList = this.masterModel.tdaccholder;
    // tslint:disable-next-line: forin
    for (var idx in this.td_accholderList) {
      this.setRelationship( this.td_accholderList[idx].relation, Number(idx));
      }

    // this.tm_denominationList = this.masterModel.tmdenominationtrans;
    //somnath comment 
    this.tm_transferList = this.masterModel.tmtransfer;
    this.td_deftranstrfList = this.masterModel.tddeftranstrf;

    this.td_deftrans = this.masterModel.tddeftrans;
    this.setTransType(this.td_deftrans.trf_type);
  }


  getCustomerList() {
    ;
    const cust = new mm_customer();
    cust.cust_cd = 0;
    cust.brn_cd = this.branchCode;

    if (this.customerList === undefined || this.customerList === null || this.customerList.length === 0) {
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
        res => {
          ;
          this.isLoading = false;
          this.customerList = res;
        },
        err => {
          this.isLoading = false;
          ;
        }
      );
    }
    else
    {this.isLoading = false;}
  }

  getConstitutionList() {

    if(this.constitutionList.length > 0)
    {
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
    ;
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        ;
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        ;
      }
    );
  }

  getOperationalInstr() {

    if (this.operationalInstrList.length > 0)
    {
      return;
    }

    this.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
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


  clearData()
  {
    this.initializeMasterDataAndFlags();
    this.initializeModels();
  }

  retrieveData()
  {
    ;
    this.clearData();

    this.operationType = 'Q';

    this.isLoading = true;
    this.getCustomerList();

    this.disableAll = true;
    this.disableCustomerName = true;
    this.disableAccountTypeAndNo = false;
    this.tm_deposit.brn_cd = this.branchCode;
  }

  getAccountOpeningTempData()
  {
    if (this.tm_deposit.acc_type_cd === null || this.tm_deposit.acc_type_cd === undefined) {
      this.showAlertMsg('WARNING' , 'Please select Account Type');
      this.tm_deposit.acc_num = null;
      exit(0);
    }

    ;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetAccountOpeningTempData', this.tm_deposit).subscribe(
      res => {
        ;
        this.isLoading = false;
        this.masterModel = res;

        if (this.masterModel.tmdeposit.acc_num !== null)
        {
        this.disableAccountTypeAndNo = true;
        this.assignModelsFromMasterData();
        ;
        }
        else
        {
          this.showAlertMsg('WARNING' , 'No record found!!');
        }

      },
      err => { this.isLoading = false;
        this.showAlertMsg('ERROR' , 'Unable to find record!!' );
        ;}

    );
  }


  modifyData() {
    if ( this.operationType !== 'Q' )
    {
      this.showAlertMsg('WARNING' , 'Record not retrived to modify');
      return;
    }
    this.operationType = 'U';
    this.disableAll = false;
  }

  newAccount() {    // document.getElementById('account_type').id = '';

    this.clearData();

    this.operationType = 'I';
    this.disableAll = true;
    this.isLoading = true;
    ;
    this.getCustomerList();
    // this.disableCustNameFlg = false;
    this.disableCustomerName = false;
    this.disableAll = false;
    this.disableAccountTypeAndNo = false;


  }

saveData()
  {
    ;

    this.validateData();

    if (this.tm_deposit.acc_num === null || this.operationType === 'I') {
      this.tm_deposit.acc_status = 'O';
      this.tm_deposit.created_by = this.createUser;
      this.tm_deposit.created_dt = this.createDate;
      this.tm_deposit.modified_by = this.updateUser;
      this.tm_deposit.modified_dt = this.updateDate;

      this.getNewAccountNoAndSaveData();
    }
    else
    {
      this.tm_deposit.modified_by = this.updateUser;
      this.tm_deposit.modified_dt = this.updateDate;
      this.InsertAccountOpenData();
    }

    this.disableAll = true;
    this.disableAccountTypeAndNo = false;
  }

  validateData()
  {
   // ;
    let nomPercent = 0;

    if (this.tm_deposit.year === null || this.tm_deposit.year === undefined )
    { this.tm_deposit.year = 0; }

    if (this.tm_deposit.month === null || this.tm_deposit.month === undefined )
    { this.tm_deposit.month = 0; }

    if (this.tm_deposit.day === null || this.tm_deposit.day === undefined )
    { this.tm_deposit.day = 0; }

    if (this.tm_deposit.year === 0 && this.tm_deposit.month === 0 && this.tm_deposit.day === 0)
    { this.tm_deposit.dep_period = null; }
    else {
      this.tm_deposit.dep_period = 'Year=' + this.tm_deposit.year + ';Month=' + this.tm_deposit.month + ';Day=' + this.tm_deposit.day;
    }

    if (this.tm_deposit.cust_cd === null || this.tm_deposit.cust_cd === undefined)
    {
      this.showAlertMsg('WARNING' , 'Customer Information is Blank');
        exit(0);
    }

    if (this.tm_deposit.acc_type_cd === null || this.tm_deposit.acc_type_cd === undefined)
    {
      this.showAlertMsg('WARNING' , 'Account Type can not be blank');
        exit(0);
    }

    if (this.tm_deposit.constitution_cd === null || this.tm_deposit.constitution_cd === undefined)
    {
      this.showAlertMsg('WARNING' , 'Constitution can not be blank');
        exit(0);
    }

    if (this.tm_deposit.oprn_instr_cd === null || this.tm_deposit.oprn_instr_cd === undefined)
    {
      this.showAlertMsg('WARNING' , 'Operational Instruction can not be blank');
        exit(0);
    }


    // tslint:disable-next-line: forin
    for (let l in this.td_signatoryList) {
      if (this.td_signatoryList[l].signatory_name === null || this.td_signatoryList[l].signatory_name === undefined) {
        this.showAlertMsg('WARNING' , 'Signatory Name is Blank');
        exit(0);
      }

      this.td_signatoryList[l].acc_num = this.tm_deposit.acc_num;
      this.td_signatoryList[l].brn_cd = this.branchCode;
      this.td_signatoryList[l].acc_type_cd = Number(this.tm_deposit.acc_type_cd);
      this.td_signatoryList[l].upd_ins_flag = this.operationType;
    }

    // ;
    // tslint:disable-next-line: forin
    for (let l in this.td_accholderList) {
      if (this.td_accholderList[l].acc_holder === null || this.td_accholderList[l].acc_holder === undefined) {
        this.td_accholderList = this.td_accholderList.splice(Number(l), 1);
      }
      else {
        if (this.td_accholderList[l].relation === null || this.td_accholderList[l].relation === undefined) {
          this.showAlertMsg('WARNING' , 'Joint Holder Relation is Blank');
          exit(0);
        }
        this.td_accholderList[l].acc_type_cd = this.tm_deposit.acc_type_cd;
        this.td_accholderList[l].acc_num = this.tm_deposit.acc_num;
        this.td_accholderList[l].brn_cd = this.branchCode;
        this.td_accholderList[l].upd_ins_flag = this.operationType;
      }
    }

    // tslint:disable-next-line: forin
    for (let l in this.td_introducerlist) {
      if (this.td_introducerlist[l].introducer_acc_num === null || this.td_introducerlist[l].introducer_acc_num === undefined) {
        this.td_introducerlist = this.td_introducerlist.splice(Number(l), 1);
      }
      else {
        this.td_introducerlist[l].acc_num = this.tm_deposit.acc_num;
        this.td_introducerlist[l].acc_type_cd = this.tm_deposit.acc_type_cd;
        this.td_introducerlist[l].brn_cd = this.branchCode;
        this.td_introducerlist[l].upd_ins_flag = this.operationType;
      }

    }

    for (let l in this.tm_denominationList) {
      if (this.tm_denominationList[l].rupees === null || this.tm_denominationList[l].rupees === undefined) {
        this.tm_denominationList = this.tm_denominationList.splice(Number(l), 1);
      }
      else {
        null;
      }
    }


    if ( ( this.td_deftrans.trf_type === null || this.td_deftrans.trf_type === undefined) &&  this.operationType === 'I')
    {
      this.showAlertMsg('WARNING' , 'Please supply required value in transaction details');
      exit(0);
    }
    else
    {
      this.td_deftrans.acc_type_cd = this.tm_deposit.acc_type_cd;
      this.td_deftrans.upd_ins_flag = this.operationType;
    }


    for (let l in this.td_nomineeList) {
      if (this.td_nomineeList[l].nom_name === null || this.td_nomineeList[l].nom_name === undefined) {
        this.td_nomineeList = this.td_nomineeList.splice(Number(l), 1);
      }
      else {
        if (this.td_nomineeList[l].percentage === null || this.td_nomineeList[l].percentage === 0 || this.td_nomineeList[l].percentage === undefined)
        { this.showAlertMsg('WARNING' , 'Nominee Percentage is blank');
          exit(0); }
        this.td_nomineeList[l].acc_num = this.masterModel.tmdeposit.acc_num;
        this.td_nomineeList[l].acc_type_cd = this.tm_deposit.acc_type_cd;
        this.td_nomineeList[l].brn_cd = this.branchCode;
        this.td_nomineeList[l].upd_ins_flag = this.operationType;

        nomPercent = nomPercent + Number(this.td_nomineeList[l].percentage);
      }
    }

    if (nomPercent > 0 && nomPercent < 100)
    {
      this.showAlertMsg('WARNING' , 'Nominee Total Percentage < 100');
      exit(0);
    }

    ;


    if ((this.operationType === 'I') && ( this.tm_deposit.user_acc_num === undefined || this.tm_deposit.user_acc_num === null) &&
    ( this.tm_deposit.acc_type_cd ===  2 || this.tm_deposit.acc_type_cd ===  3 ||
      this.tm_deposit.acc_type_cd ===  4 || this.tm_deposit.acc_type_cd ===  5
      || this.tm_deposit.acc_type_cd ===  6  ) )
    {
      this.showAlertMsg('WARNING' , 'S/B Account Number not present to create the Account Type- '+ this.tm_deposit.acc_type_desc);
      exit(0);
    }

    if ((this.operationType === 'I') && ( this.tm_deposit.acc_type_cd === 1 || this.tm_deposit.acc_type_cd === 7 ||
      this.tm_deposit.acc_type_cd === 8 || this.tm_deposit.acc_type_cd === 9 ) )
      {
        this.tm_deposit.user_acc_num = null;
      }

      if (this.operationType === 'I')
      {
        for (let l in this.tm_denominationList)
        {
        this.tm_denominationList[l].brn_cd = this.branchCode;
        }

        var v= 0;
        for (let l in this.td_introducerlist) {
          v = v + 1;
          this.td_introducerlist[l].srl_no = v;
          this.td_introducerlist[l].acc_type_cd = this.tm_deposit.acc_type_cd;
          this.td_introducerlist[l].acc_num = this.tm_deposit.acc_num;
        }

      }

  }

  getNewAccountNoAndSaveData() {
    ;
    this.isLoading = true;

    this.p_gen_param.brn_cd = this.branchCode; // String
    this.p_gen_param.gs_acc_type_cd = this.masterModel.tmdeposit.acc_type_cd; // Integer
    this.p_gen_param.ls_catg_cd = this.masterModel.tmdeposit.category_cd; // Integer
    this.p_gen_param.ls_cons_cd = this.masterModel.tmdeposit.constitution_cd; // Integer

    this.svc.addUpdDel<any>('Deposit/PopulateAccountNumber', this.p_gen_param).subscribe(
      res => {
        ;
        let val = '0';
        this.isLoading = false;
        val = res;
        this.masterModel.tmdeposit.acc_num = val.toString();
        this.masterModel.tmdeposit.brn_cd = this.branchCode;

        ;
        this.InsertAccountOpenData();
      },
      err => { this.isLoading = false;
        ;}

    );

  }


  InsertAccountOpenData() {
    let ret = -1;

    this.validateData();

    this.td_deftrans.acc_num = this.masterModel.tmdeposit.acc_num;
    this.td_deftrans.brn_cd = this.branchCode;
    // ;
    this.td_deftrans.trans_dt = this.DateFormatting(this.openDate);
    this.td_deftrans.approval_status = 'U';
    this.td_deftrans.acc_type_cd = this.tm_deposit.acc_type_cd;

    ;
    this.isLoading = true;
    if (this.operationType === 'I') // For New Account
    {
      this.svc.addUpdDel<any>('Deposit/InsertAccountOpeningData', this.masterModel).subscribe(
        res => {
          ;
          this.td_deftrans.trans_cd = Number(res);
          this.isLoading = false;
          this.disableAccountTypeAndNo = true;
          this.showAlertMsg('INFORMATION' , 'Record Saved Successfully');
        },
        err => {
          this.isLoading = false;
          this.showAlertMsg('ERROR' , 'Record Not Saved !!!');
          if (this.operationType === 'I') {
            this.masterModel.tmdeposit.acc_num = null;
          }
          ;
        }
      );
    }
    else // Modify the Account opening Data
    {
      this.svc.addUpdDel<any>('Deposit/UpdateAccountOpeningData', this.masterModel).subscribe(
        res => {
          ;
          ret = Number(res);
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
          this.showAlertMsg('ERROR' , 'Unable to Create Account Number');
          ;
        }
      );
    }
  }


  public DateFormatting(dateVal: Date): any {
    let dt: Date;
    dt = new Date(Date.UTC(dateVal.getFullYear(), dateVal.getMonth(), dateVal.getDate(), dateVal.getHours(), dateVal.getMinutes()));
    return dt;
  }

  public showAlertMsg(msgTyp: string , msg: string) {
    this.alertMsgType = msgTyp;
    this.alertMsg     = msg;
    this.showAlert = true;
    this.disableAll = true;
    this.disableAccountTypeAndNo = true;
  }

  public closeAlertMsg() {
    this.showAlert = false;
    this.disableAll = false;
    this.disableAccountTypeAndNo = false;
  }


  setAccountType(accType: number) {
    ;
    if (accType === 0) {
      accType = 1;
    }

    if (this.operationType === 'I')
    {
      this.tm_deposit.constitution_cd = null;
      this.tm_deposit.constitution_desc = null;
      this.tm_deposit.oprn_instr_cd = null;
      this.tm_deposit.oprn_instr_desc = null;
    }

    this.accountTypeDiv = Number(accType);

    this.tm_deposit.acc_type_cd = Number(accType);
    //this.tm_deposit.acc_type_desc = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;

    // this.selectedConstitutionList = null;
    this.selectedConstitutionList = this.constitutionList.filter(x => x.acc_type_cd.toString() === accType.toString());
    ;

    if (this.operationType === 'I' && this.tm_deposit.acc_type_cd === 11 )
    {
      this.tm_deposit.month = this.savingsDepoSpclPeriod;
      this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;

      this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
    }

    if (this.operationType === 'I' &&
        (this.tm_deposit.acc_type_cd === 2  ||
          this.tm_deposit.acc_type_cd === 3 ||
          this.tm_deposit.acc_type_cd === 4 ||
          this.tm_deposit.acc_type_cd === 5 ||
          this.tm_deposit.acc_type_cd === 6))
          {
            this.tm_deposit.standing_instr_flag = this.standingInstrAfterMaturity[0].instr_code;
            this.tm_deposit.standing_instr_dscr = this.standingInstrAfterMaturity[0].instr_dscr;
          }

    if (this.operationType === 'I' && this.tm_deposit.acc_type_cd === 5) {
      this.tm_deposit.intt_trf_type = this.intTransferType[0].tfr_type;
      this.tm_deposit.intt_tfr_type_dscr = this.intTransferType[0].tfr_desc;
    }

  }

  setTransType(tt: any) {
    // this.transTypeFlg = val;
    ;
    this.td_deftrans.trf_type = tt;
    this.td_deftrans.trf_type_desc = this.transferTypeList.filter( x => x.trf_type.toString() === tt)[0].trf_type_desc;

  }


  setRelationship(relation: string, idx: number) {
    ;
    this.td_accholderList[idx].cust_cd = Number(this.td_accholderList[idx].cust_cd);
    this.td_accholderList[idx].relation = relation;
    this.td_accholderList[idx].relationId = this.relationship.filter(x => x.val.toString() === relation)[0].id;
    ;
  }

  setIntTfrType(tfr_type: string) {
    ;

    if (tfr_type == null) {
    return;
    }

    this.tm_deposit.intt_trf_type = tfr_type;
    this.tm_deposit.intt_tfr_type_dscr = this.intTransferType.filter(x => x.tfr_type.toString() === tfr_type.toString())[0].tfr_desc;
  }

  setConstitutionType(val: number) {
    ;
    this.tm_deposit.constitution_cd = Number(val);
    this.tm_deposit.constitution_desc = this.constitutionList.filter(x => x.constitution_cd.toString() === val.toString())[0].constitution_desc;
  }

  setOperationalInstr(val: number) {
    this.tm_deposit.oprn_instr_cd = Number(val);
    this.tm_deposit.oprn_instr_desc = this.operationalInstrList.filter(x => x.oprn_cd.toString() === val.toString())[0].oprn_desc;
  }


  getCategoryList() {
    this.svc.addUpdDel<any>('Mst/GetCategoryMaster', null).subscribe(
      res => {
        // ;
        this.categoryList = res;
      },
      err => {
        // ;
      }
    );
  }


  public suggestCustomer(): void {
    this.suggestedCustomer = this.customerList
      .filter(c => c.cust_name.toLowerCase().startsWith(this.tm_deposit.cust_name.toLowerCase()))
      .slice(0, 20);
  }

  public setCustDtls(cust_cd: number): void {
    this.tm_deposit.cust_cd = cust_cd;
    this.populateCustDtls(cust_cd);
    this.suggestedCustomer = null;
  }

  populateCustDtls(cust_cd: number) {
    ;
    var temp_mm_cust = new mm_customer();
    var temp_tm_deposit = new tm_deposit();

    temp_tm_deposit.cust_cd = cust_cd;

    temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];

    this.tm_deposit.cust_name = temp_mm_cust.cust_name;
    this.tm_deposit.cust_type = temp_mm_cust.cust_type;
    this.tm_deposit.gurdain_name = temp_mm_cust.guardian_name;

    this.tm_deposit.date_of_birth = temp_mm_cust.dt_of_birth;
    this.tm_deposit.sex = temp_mm_cust.sex;
    this.tm_deposit.phone = temp_mm_cust.phone;

    this.tm_deposit.occupation = temp_mm_cust.occupation;
    this.tm_deposit.email = temp_mm_cust.email;
    this.tm_deposit.present_addr = temp_mm_cust.present_address;

    this.tm_deposit.category_cd = temp_mm_cust.catg_cd;
    this.setCategoryDesc(this.tm_deposit.category_cd);

    if (this.operationType === 'I') {
      this.td_signatoryList[0].cust_cd = cust_cd;
      this.td_signatoryList[0].signatory_name = temp_mm_cust.cust_name;
      this.td_signatoryList[0].brn_cd = this.branchCode;
    }

    ;

    if (this.operationType === 'I') {
      this.svc.addUpdDel<any>('Deposit/GetCustMinSavingsAccNo', temp_tm_deposit).subscribe(
        res => {
          ;
          this.tm_deposit.user_acc_num = res;
          this.tm_deposit.user_acc_num = this.tm_deposit.user_acc_num.toString();
        },
        err => {
          ;
          this.tm_deposit.user_acc_num = null;
        }
      );
    }

  }

setCategoryDesc(category: number) {
    this.tm_deposit.category_desc = this.categoryList.filter(x => x.catg_cd.toString() === category.toString())[0].catg_desc;
  }

addSignatory()
  {
    var temp_td_signatory = new td_signatory();
    this.td_signatoryList.push(temp_td_signatory);
  }

removeSignatory()
{
    if (this.td_signatoryList.length > 1)
    this.td_signatoryList.pop();
  }

  addJointHolder() {
    var temp_td_accholder = new td_accholder();
    this.td_accholderList.push(temp_td_accholder);
  }

  removeJointHolder() {
    if (this.td_accholderList.length > 1)
      this.td_accholderList.pop();
  }

  checkSignatory(name: string, idx: number)
  {
    var x = this.td_accholderList.filter(c => c.acc_holder.toString() === name.toString())[0].cust_cd;

    ;
    if (!x)
    {
      this.td_signatoryList[idx].signatory_name = null;
      this.showAlertMsg('ERROR' , 'Signatory is not a Joint Holder');
    }
  }

  getSetJointHolderName(idx: number) {
    var temp_mm_cust = new mm_customer();
    temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === this.td_accholderList[idx].cust_cd.toString())[0];

    if (!temp_mm_cust) {
      this.td_accholderList[idx].cust_cd = null;
      this.td_accholderList[idx].acc_holder = null;
      this.showAlertMsg('ERROR' , 'Joint Holder Customer Not Found');
      return;
    }

    if ( temp_mm_cust.cust_cd ===  this.tm_deposit.cust_cd)
    {
      this.td_accholderList[idx].cust_cd = null;
      this.td_accholderList[idx].acc_holder = null;
      this.showAlertMsg('ERROR' , 'First Holder and Joint Holder can not be same');
      return;
    }


    this.td_accholderList[idx].cust_cd = Number(this.td_accholderList[idx].cust_cd);
    this.td_accholderList[idx].acc_holder = temp_mm_cust.cust_name;

    // this.addSignatory();
    // let l = this.td_signatoryList.length;

    // this.td_signatoryList[l - 1].cust_cd = this.td_accholderList[idx].cust_cd;
    // this.td_signatoryList[l - 1].signatory_name = this.td_accholderList[idx].acc_holder;
  }


  addIntroducer() {
    let temp_td_introducer = new td_introducer();
    this.td_introducerlist.push(temp_td_introducer);
  }

  removeIntroducer() {
    if (this.td_introducerlist.length > 1){
      this.td_introducerlist.pop();}
  }

  setIntroducerAccountType(intro_acc_typ_cd: number, idx: number) {
    ;
    if (intro_acc_typ_cd != null && intro_acc_typ_cd > 0) {
      this.td_introducerlist[idx].introducer_acc_type = Number(intro_acc_typ_cd);
      this.td_introducerlist[idx].introducer_acc_type_desc = this.introducerAccTypeList.filter(x => x.acc_type_cd.toString() === intro_acc_typ_cd.toString())[0].acc_type_desc;
    }
  }


  setIntroducerName(idx: number) {
    ;

    if (this.td_introducerlist[idx].acc_type_cd === null || this.td_introducerlist[idx].acc_type_cd === undefined)
    {
      this.showAlertMsg('ERROR' , 'Introducer Account Type can not be blank');
      this.td_introducerlist[idx].introducer_acc_num = null;
      return;
    }

    var temp_deposit_list: tm_deposit[] = [];
    var temp_deposit = new tm_deposit();

    temp_deposit.brn_cd = this.branchCode;
    temp_deposit.acc_num = this.td_introducerlist[idx].introducer_acc_num;
    temp_deposit.acc_type_cd = this.td_introducerlist[idx].acc_type_cd;

    this.isLoading = true;

    this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
      res => {
        ;
        temp_deposit_list = res;
        this.isLoading = false;

        if (temp_deposit_list.length === 0) {
          this.td_introducerlist[idx].introducer_acc_num = null;
          this.td_introducerlist[idx].introducer_name = null;
          this.td_introducerlist[idx].acc_type_cd = null;
          this.showAlertMsg('ERROR' , 'Introducer Not Found');
          return;
        }

        var temp_mm_cust = new mm_customer();
        temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === temp_deposit_list[0].cust_cd.toString())[0];

        this.td_introducerlist[idx].introducer_name = temp_mm_cust.cust_name;
      },
      err => {
        this.isLoading = false;
      }
    );
  }


  addNominee()
  {
    var temp_td_nominee = new td_nominee();
    this.td_nomineeList.push(temp_td_nominee);
  }

  removeNominee() {
    if (this.td_nomineeList.length > 1)
      this.td_nomineeList.pop();
  }

  addDenomination()
  {
    var temp_denomination= new tm_denomination_trans();
    this.tm_denominationList.push(temp_denomination);
  }

  removeDenomination()
  {
    if (this.tm_denominationList.length > 1)
    this.tm_denominationList.pop();
  }

  setDenomination(val: number, idx: number)
  {
    ;
    this.tm_denominationList[idx].rupees = Number(val);
    this.tm_denominationList[idx].rupees_desc = this.denominations.filter( x => x.rupees === val.toString() )[0].desc;
    this.calculateTotalDenomination(idx);
  }


  calculateTotalDenomination(idx: number) {
    ;
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
    for (let l of this.tm_denominationList) {
      this.denominationGrandTotal = this.denominationGrandTotal + l.total;
    }
  }

  checkNomineePercentage(idx: number) {
    ;
    let tot = 0;

    for (let l of this.td_nomineeList) {
      tot = tot + Number(l.percentage);
    }

    if (tot > 100) {
      this.showAlertMsg('ERROR' , 'Nominee Total Percentage exceeding 100');
      this.td_nomineeList[idx].percentage = 0;
    }

    this.td_nomineeList[idx].nom_id = Number(idx) + 1;
    this.td_nomineeList[idx].percentage = Number(this.td_nomineeList[idx].percentage);

  }


  xxxxxxxx(val: any)
  {
    null;
  }

  setStandingInstrAfterMatu(val: number)
  {
     this.tm_deposit.standing_instr_flag = val.toString();
     this.tm_deposit.standing_instr_dscr = this.standingInstrAfterMaturity.filter( x => x.instr_code === val.toString())[0].instr_dscr;
  }

  private depositPeriodParser(constitutionText: string) {
    /// YEAR=1;Month=10;Days=25;
    if (constitutionText == null)
    {
      return null;
    }
    let arr = constitutionText.split(';');
    let arrToReturn = [];
    arr.forEach(element => {
      arrToReturn.push(element.split('=').pop());
    });

    return arrToReturn;
  }


processInstallmentNo() {
    ;
    var temp_gen_param1 = new p_gen_param();
    var temp_gen_param2 = new p_gen_param();


    if (this.tm_deposit.category_cd === undefined || this.tm_deposit.category_cd === null) {
      this.showAlertMsg('ERROR', 'Interest Rate Cannot Be Fixed!!!...Category Not Yet Mentioned.');
      return;
    }

    // const dt = this.tm_deposit.opening_dt;
    // this.tm_deposit.mat_dt = null;

    this.td_deftrans.amount = Number(this.tm_deposit.instl_amt);
    this.tm_deposit.mat_dt = this.DateFormatting(this.openDate);
    this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + Number(this.tm_deposit.instl_no));

    this.tm_deposit.prn_amt = Number(this.tm_deposit.instl_no) * Number(this.tm_deposit.instl_amt);

    temp_gen_param1.ad_instl_amt = Number(this.tm_deposit.instl_amt);
    temp_gen_param1.an_instl_no = Number(this.tm_deposit.instl_no);
    temp_gen_param1.an_intt_rate = Number(this.tm_deposit.intt_rt);

    temp_gen_param2.acc_cd = this.tm_deposit.acc_type_cd;
    temp_gen_param2.from_dt = this.DateFormatting(this.openDate);
    temp_gen_param2.ls_catg_cd = this.tm_deposit.category_cd;
    ;
    // tslint:disable-next-line: max-line-length
    //temp_gen_param2.ai_period = Math.floor(Date.UTC(this.tm_deposit.mat_dt.getFullYear(), this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) - (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(), this.tm_deposit.opening_dt.getDate()) ) / (1000 * 60 * 60 * 24));
    temp_gen_param2.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(), this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) - (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(), this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24));


    if (temp_gen_param1.an_intt_rate > 0) {
      this.calCrdIntReg(temp_gen_param1);
    }
    else {
      //                               uf_GetInttRate
      this.svc.addUpdDel<any>('Deposit/GET_INT_RATE', temp_gen_param2).subscribe(
        res => {
          ;
          this.tm_deposit.intt_rt = Number(res);
          temp_gen_param1.an_intt_rate = this.tm_deposit.intt_rt;
          this.calCrdIntReg(temp_gen_param1);
        },
        err => {
          ;
        }
      );
    }
  }


  processInstallmentAmount( )
  {
    ;
    var temp_gen_param = new p_gen_param();

    this.tm_deposit.prn_amt = Number(this.tm_deposit.instl_no) * Number(this.tm_deposit.instl_amt);

    temp_gen_param.ad_instl_amt = Number(this.tm_deposit.instl_amt);
    temp_gen_param.an_instl_no = Number(this.tm_deposit.instl_no);
    temp_gen_param.an_intt_rate = Number(this.tm_deposit.intt_rt);
    this.calCrdIntReg(temp_gen_param);
  }


  calCrdIntReg(tempGenParam: p_gen_param )
  {
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/F_CALCRDINTT_REG', tempGenParam).subscribe(
      res => {
        ;
        this.tm_deposit.intt_amt = res;
        this.tm_deposit.mat_val = Number(this.tm_deposit.intt_amt) + Number(this.tm_deposit.prn_amt);
        this.isLoading = false;
      },
      err => {
        this.tm_deposit.intt_amt = 0;
        this.isLoading = false;
        ;
      }
    );
  }


  reProcessPrincipal()
  {
    if ( (this.tm_deposit.acc_type_cd !== 1) &&
    (this.tm_deposit.acc_type_cd !== 7) &&
    (this.tm_deposit.acc_type_cd !== 13) &&
    (this.tm_deposit.prn_amt > 0) )
    {
      this.processPrincipal();
    }
  }

  processPrincipal( )
  {
    ;
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
        this.showAlertMsg('Warning', 'Please enter Deposit period');
        return;
      }

      if (this.tm_deposit.acc_type_cd === undefined ||
        this.tm_deposit.acc_type_cd === null ||
        this.tm_deposit.acc_type_cd < 0) {
        this.tm_deposit.prn_amt = 0;
        this.showAlertMsg('Warning', 'Account Type can not be blank');
        return;
      }

      if (this.tm_deposit.intt_trf_type === undefined ||
        this.tm_deposit.intt_trf_type === null) {
        this.tm_deposit.prn_amt = 0;
        this.showAlertMsg('Warning', 'Interest Transaction Type can not be blank');
        return;
      }

      if (this.tm_deposit.intt_rt === undefined || this.tm_deposit.intt_rt === null || this.tm_deposit.intt_rt <= 0 )
      {
        this.tm_deposit.prn_amt = 0;
        this.showAlertMsg('Warning', 'Please set the Interest Rate..');
        return;
      }

      if (this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null || this.tm_deposit.prn_amt <= 0 )
      {
        this.tm_deposit.prn_amt = 0;
        this.showAlertMsg('Warning', 'Please set the Interest Principal..');
        return;
      }


      ;
      this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
      this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
      this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);


      var temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;
      temp_gen_param.ad_prn_amt = this.tm_deposit.prn_amt;
      temp_gen_param.adt_temp_dt = this.tm_deposit.opening_dt;
      temp_gen_param.as_intt_type = this.tm_deposit.intt_trf_type;
      // tslint:disable-next-line: max-line-length
      temp_gen_param.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(), this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) - (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(), this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24));
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

f_calctdintt_reg(temp_gen_param : p_gen_param )
{
  this.isLoading = true;
  this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
    res => {
      ;
      this.tm_deposit.intt_amt = res;
      this.tm_deposit.mat_val = Number(this.tm_deposit.intt_amt) + Number(this.tm_deposit.prn_amt);
      ;
      this.isLoading = false;
    },
    err => {
      this.isLoading = false;
      ;
    }
  );
}

  processInterest() {
    var temp_gen_param = new p_gen_param();

    temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;

    if (this.tm_deposit.acc_type_cd === 6)
    {
      if ( this.tm_deposit.instl_amt === undefined || this.tm_deposit.instl_amt === null ||
        this.tm_deposit.instl_no === undefined || this.tm_deposit.instl_no ===  null ||
        temp_gen_param.an_intt_rate === undefined || temp_gen_param.an_intt_rate === null )
      {
        return;
      }

      temp_gen_param.ad_instl_amt = Number(this.tm_deposit.instl_amt);
      temp_gen_param.an_instl_no = Number(this.tm_deposit.instl_no);
      temp_gen_param.an_intt_rate = Number(this.tm_deposit.intt_rt);
      this.calCrdIntReg(temp_gen_param);
    }
    else
    {

      if (  ( (this.tm_deposit.year === undefined || this.tm_deposit.year === null ) &&
              (this.tm_deposit.month === undefined || this.tm_deposit.month === null) &&
              (this.tm_deposit.day === undefined || this.tm_deposit.day === null) ) ||
        this.tm_deposit.prn_amt === undefined ||  this.tm_deposit.prn_amt === null || this.tm_deposit.prn_amt === 0 ||
        this.tm_deposit.intt_trf_type === undefined || this.tm_deposit.intt_trf_type === null )
      {
        return;
      }

      ;
      this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
      this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
      this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);


      // var temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;
      temp_gen_param.ad_prn_amt = this.tm_deposit.prn_amt;
      temp_gen_param.adt_temp_dt = this.tm_deposit.opening_dt;
      temp_gen_param.as_intt_type = this.tm_deposit.intt_trf_type;
      // tslint:disable-next-line: max-line-length
      temp_gen_param.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(), this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) - (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(), this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24));
      temp_gen_param.ad_intt_rt = this.tm_deposit.intt_rt;

      this.f_calctdintt_reg(temp_gen_param);
    }
  }

  processYearMonthDay() {
    var temp_gen_param = new p_gen_param();

    if (  ( (this.tm_deposit.year === undefined || this.tm_deposit.year === null ) &&
              (this.tm_deposit.month === undefined || this.tm_deposit.month === null) &&
              (this.tm_deposit.day === undefined || this.tm_deposit.day === null) ) ||
        this.tm_deposit.prn_amt === undefined ||  this.tm_deposit.prn_amt === null ||
        this.tm_deposit.intt_trf_type === undefined || this.tm_deposit.intt_trf_type === null ||
        this.tm_deposit.intt_rt === undefined || this.tm_deposit.intt_rt === null)
      {
        return;
      }

    ;
    this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
    this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
    this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
    this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);


    // var temp_gen_param = new p_gen_param();
    temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;
    temp_gen_param.ad_prn_amt = this.tm_deposit.prn_amt;
    temp_gen_param.adt_temp_dt = this.tm_deposit.opening_dt;
    temp_gen_param.as_intt_type = this.tm_deposit.intt_trf_type;
    // tslint:disable-next-line: max-line-length
    temp_gen_param.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(), this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) - (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(), this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24));
    temp_gen_param.ad_intt_rt = this.tm_deposit.intt_rt;

    this.f_calctdintt_reg(temp_gen_param);
    }


}
