import { Component, OnInit, ViewChild,  TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { mm_customer } from 'src/app/bank-resolver/Models';
import { SystemValues } from './../../../Models/SystemValues';
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { mm_acc_type } from 'src/app/bank-resolver/Models/deposit/mm_acc_type';
import { mm_instalment_type } from 'src/app/bank-resolver/Models/loan/mm_instalment_type';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { tm_guaranter } from 'src/app/bank-resolver/Models/loan/tm_guaranter';
import { td_accholder } from 'src/app/bank-resolver/Models/deposit/td_accholder';
import { tm_loan_sanction } from 'src/app/bank-resolver/Models/loan/tm_loan_sanction';
import { tm_loan_sanction_dtls } from 'src/app/bank-resolver/Models/loan/tm_loan_sanction_dtls';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { exit } from 'process';
import { tm_deposit } from 'src/app/bank-resolver/Models/tm_deposit';

import { mm_sector } from 'src/app/bank-resolver/Models/loan/mm_sector';
import { mm_activity } from 'src/app/bank-resolver/Models/loan/mm_activity';
import { mm_crop } from 'src/app/bank-resolver/Models/loan/mm_crop';
import { p_loan_param } from 'src/app/bank-resolver/Models/loan/p_loan_param';
import { sm_kcc_param } from 'src/app/bank-resolver/Models/loan/sm_kcc_param';
import { sm_loan_sanction } from 'src/app/bank-resolver/Models/loan/sm_loan_sanction';
import { td_loan_sanc } from 'src/app/bank-resolver/Models/loan/td_loan_sanc';
import { td_loan_sanc_set } from 'src/app/bank-resolver/Models/loan/td_loan_sanc_set';
import Utils from 'src/app/_utility/utils';
import { MessageType, mm_customer, ShowMessage } from 'src/app/bank-resolver/Models';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { sm_parameter } from 'src/app/bank-resolver/Models/sm_parameter';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import { LoanDetailsForSI } from 'src/app/bank-resolver/Models/loan/LoanDetailsForSI';
import { LoanAgentDetailsForSI } from 'src/app/bank-resolver/Models/loan/loanAgentDetails';
// import { catchError, forkJoin, map, Observable, of } from 'rxjs';
// import { error } from 'console';
interface SecurityType {
  sec_type: string;
  sec_desc: string;
}

interface GoldRate {
  karat: number;
  rate: number;
}
@Component({
  selector: 'app-open-loan-account',
  templateUrl: './open-loan-account.component.html',
  styleUrls: ['./open-loan-account.component.css']
})
export class OpenLoanAccountComponent implements OnInit {

  constructor(private svc: RestService,
              private modalService: BsModalService,
              private router: Router,
              private msg: InAppMessageService,
              private fb: FormBuilder

  ) { }

  @ViewChild('contentLoanStmt', { static: true }) contentLoanStmt: TemplateRef<any>;
  @ViewChild('MakerChecker', { static: true }) MakerChecker: TemplateRef<any>;
  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;
  karatOptions = [16, 18, 20, 22, 24];
  AllgoldCatat:GoldRate[]=[]
  securityForm!: FormGroup;
  securityTypes: SecurityType[] = [
    { sec_type: 'G', sec_desc: 'Gold' },
    { sec_type: 'N', sec_desc: 'Govt.Certificates(NSC/KVP/LIC)' },
    { sec_type: 'D', sec_desc: 'Deposit' },
    { sec_type: 'H', sec_desc: 'House/Land' },
    { sec_type: 'M', sec_desc: 'Guaranter' },
    { sec_type: 'L', sec_desc: 'LIC' },
    { sec_type: 'S', sec_desc: 'Stock' }
  ];
  selectedIndexForSuggestion: number | null = null;
  depositDTLS : any
  newtm_deposit:any;
  SecaccNum:any;
  SecaccCD:any;
  shownoresult:Boolean
  // selectedType = 'G'; 
  acc_data:any[]=[];
  actDesc:any;
  shownoresult3=false;
  LoanDetailsForSI = new LoanDetailsForSI();
  LoanAgentDetailsForSI = new LoanAgentDetailsForSI();
  suggestedDDCustomer:any
  suggestedAgent:any;
  allAgent:any;
  // duedateSetting:boolean=false;
  branchCode = '0';
  createUser = '';
  updateUser = '';
  operationType = '';
  disableAll = 'N';
  appvSanction:boolean=false;
  // disablePersonal ='Y';
  custNameForAcc:any;
  createDate: Date;
  updateDate: Date;
  p_gen_param = new p_gen_param();
  diff:any;
  isLoading = false;
  showNoName=false;
  showNoJoint=false;
  showMsg: ShowMessage;
  disabledOnNull=true;
  disableLoanId:boolean=true;
  disabledJointOnNull=true;
 
  accountTypeList: mm_acc_type[] = [];
  accountTypeListAll: mm_acc_type[] = [];
  depositAccountTypeList: mm_acc_type[] = [];
  instalmentTypeList: mm_instalment_type[] = [];
  fundTypeList = [
    {
      value:'O',
      name:'Owned'
    },
    {
      value:'N',
      name:'Borrowed'
    }
  ];

  smLoanSanctionList: sm_loan_sanction[] = [];
  selectedSmLoanSanctionList: sm_loan_sanction[] = [];
  systemParam: sm_parameter[] = [];
  penalIntt:number;
  sectorList: mm_sector[] = [];
  activityList: mm_activity[] = [];
  corpList: mm_crop[] = [];
  smKccParamList: sm_kcc_param[] = [];

  selectedActivityList: mm_activity[] = [];
  selectedCorpList: mm_crop[] = [];

  // showAlert = false;
  // alertMsg: string;
  // alertMsgType: string;
  accName:boolean
  CustomerName:any;
  suggestedCustomer: mm_customer[];
  suggestedCustomer2: mm_customer[];
  suggestedJointCustomer: mm_customer[];
  suggestedCustomerJointHolderIdx: number;
  kycEnable = false;
  allLoanDtls:any=[]
  masterModel = new LoanOpenDM();
  tm_loan_all = new tm_loan_all();
  tm_guaranter = new tm_guaranter();
  td_accholder: td_accholder[] = [];
  tm_loan_sanction: tm_loan_sanction[] = [];
  tm_loan_sanction_dtls: tm_loan_sanction_dtls[] = [];
  repaymentFormulaList:any[]=[]
  td_loan_sanc_set_list: td_loan_sanc_set[] = [];

  sys = new SystemValues();

  relationship = [
    { id: 1, val: 'Father' },
    { id: 2, val: 'Mother' },
    { id: 3, val: 'Sister' },
    { id: 4, val: 'Brother' },
    { id: 5, val: 'Friend' },
    { id: 6, val: 'Son' },
    { id: 7, val: 'Daughter' },
    { id: 8, val: 'Others' },
    { id: 9, val: 'Husband' },
    { id: 10,val: 'Wife' },
  ];

  // repaymentFormulaList = [
  //   { id: 1, val: 'EMI' },
  //   { id: 2, val: 'REDUCING' },
  // ];
  

  modalRef: BsModalRef;
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  createUser1:any;
  logUser:any;
  ngOnInit(): void {
    this.getAgentList();
    this.securityForm = this.fb.group({
      securities: this.fb.array([
        this.initSecurityFormGroup(1)
      ])
    });
    this.getRepFormula();
    this.getsystemParam();
    this.logUser=localStorage.getItem('itemUX');
    this.branchCode = this.sys.BranchCode;
    this.createUser = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    this.createDate = this.sys.CurrentDate;
    this.updateUser = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    this.updateDate = this.sys.CurrentDate;
    setTimeout(() => {
      // this.getCustomerList();
      this.getAccountTypeList();
      this.getInstalmentTypeList();
      this.populaterGoldRate();
      this.getSectorList();
      this.getActivityList();
      this.getCorpList();
      this.getSmKccParam();
      this.getSmLoanSanctionList();
    }, 150);

    this.initializeModels();
    this.newAccount();
    this.LoanDetailsForSI.dr_acc_type=11;
    this.LoanDetailsForSI.min_bal=100;

  }
  get securities(): FormArray {
    return this.securityForm.get('securities') as FormArray;
  }
  

   populaterGoldRate() {
  this.AllgoldCatat = [];
  this.isLoading = true;

  this.svc.addUpdDel<any>('Loan/GetGoldRates', null).subscribe(
    res => {
      if (res.length > 0) {
        this.AllgoldCatat = res; // <-- direct assignment
      } else {
        this.AllgoldCatat = [];
        this.HandleMessage(true, MessageType.Error, 'No Gold Rate Found, Please Insert New Rates');
      }
      console.log(res);
      this.isLoading = false;
    },
    err => {
      this.isLoading = false;
      this.HandleMessage(true, MessageType.Error, 'Error While Getting Rates');
    }
  );
}
  getGoldRate(karat,index2){
    console.log(karat,index2);
    this.securities.controls.forEach((group, index) => {
        const netWeight:number = group.get('gold_net_wt')?.value;
        const grossWeight:number = group.get('gold_gross_wt')?.value;
        const caratRate:number = (+this.AllgoldCatat.filter(e=>e.karat==karat)[0]?.rate)
      debugger
      if(index==index2){
        if(grossWeight<netWeight){
          this.HandleMessage(true, MessageType.Warning,"Net weight should be less than or equal to Gross weight." );
          group.get('gold_net_wt')?.setValue(0);
        }else{
          group.get('unit_rate')?.setValue(caratRate);
          group.get('gold_val')?.setValue(netWeight*caratRate);
        }
      } 
    });
  }
  changeNetWt(nt_wt,ind){
    this.securities.controls.forEach((group, index) => {
        const goldRate:number = group.get('unit_rate')?.value?group.get('unit_rate')?.value:0;
        const grossWeight:number = group.get('gold_gross_wt')?.value;
      if(grossWeight<(+nt_wt)){
          this.HandleMessage(true, MessageType.Warning,"Net weight should be less than or equal to Gross weight." );
          group.get('gold_net_wt')?.setValue(0);
        }else{
           if(index==ind && (+goldRate)>0){
        group.get('gold_val')?.setValue(goldRate*nt_wt);
      } 
    }
     
    })
  }
  initSecurityFormGroup(slNo: number): FormGroup {
    return this.fb.group({
      // ALL Fields
      loan_id: [''],
      acc_cd: [''],
      sec_type: [''],
      sl_no: [slNo],
      created_by: [''],
      created_dt: [''],
      modified_by: [''],
      modified_dt: [''],

      // GOLD (G)
      gold_gross_wt: [''],
      gold_net_wt: [''],
      karat: [''],
      gold_desc: [''],
      gold_qty: [''],
      unit_rate: [''],
      gold_val: [''],
      gold_appraiser_name: [''],
      gold_appraiser_id: [''],

      // CERTIFICATE (N)
      cert_name1: [''],
      cert_name2: [''],
      cert_no: [''],
      regn_no: [''],
      post_off: [''],
      post_pin: [''],
      post_ph: [''],
      cert_opn_dt: [''],
      cert_mat_dt: [''],
      cert_pdlg_dt: [''],
      cert_plg_no: [''],
      sum_assured: [''],

      // LIC (L)
      pol_name1: [''],
      pol_name2: [''],
      pol_type: [''],
      pol_no: [''],
      pol_opn_dt: [''],
      pol_mat_dt: [''],
      pol_sur_val: [''],
      pol_brn_name: [''],
      pol_br_ph: [''],
      pol_assgn_no: [''],
      pol_assgn_dt: [''],
      pol_money_bk: [''],
      pol_sum_assured: [''],
      // Deposit (D)
      acc_type_cd: [''],
      acc_num: [''],
      opn_dt: [''],
      prn_amt:[''],
      mat_dt: [''],
      mat_val: [''],

      // House/Land (H)
      dh_name1: [''],
      dh_name2: [''],
      dh_name3: [''],
      dh_name4: [''],
      dh_name5: [''],
      prop_type: [''],
      prop_addr: [''],
      to_lnd_area: [''],
      tot_cv_area: [''],
      deed_no: [''],
      distct: [''],
      ps: [''],
      mouza: [''],
      jl_no: [''],
      rs_kha: [''],
      lr_kha: [''],
      rs_dag: [''],
      lr_dag: [''],
      deed_muni: [''],
      ward_no: [''],
      holding_no: [''],
      boundry: [''],
      cnst_yr: [''],
      floor_area: [''],
      mkt_val: [''],
      tax_upto: [''],
      bl_ro_tax: [''],
      mort_deed_reg_no: [''],
      mort_deed_dt: [''],

      // Stock (S)
      stock_type: [''],
      stock_value: ['']
    });
  }

  addSecurity(): void {
    if( this.operationType == 'U'){
      this.securities.push(this.initSecurityFormGroup(0)); // sl_no dummy
      this.resetSlNo(); 
         this.securities.controls.forEach((group, index) => {
              group.get('loan_id')?.setValue(this.tm_loan_all.loan_id.toString());
              group.get('acc_cd')?.setValue(this.tm_loan_all.acc_cd);
              });
    }else{
      this.securities.push(this.initSecurityFormGroup(0)); // sl_no dummy
      this.resetSlNo(); 
    }
    
    // const slNo = this.securities.length + 1;
    // this.securities.push(this.initSecurityFormGroup(slNo));
  }

  removeSecurity(index: number): void {

        this.securities.controls.forEach((group: AbstractControl, i: number) => {
           if(index==i){
            if (group instanceof FormGroup) {
                group.reset(); // Resets all fields in this FormGroup to their initial/default values
              }
          this.securities.removeAt(index);
          this.resetSlNo();
          this.CustomerName=[];
        }
      
    });

  }
  resetArrayIndex(i:number){
    this.securities.controls.forEach((group: AbstractControl, index: number) => {
           if(index==i){
            if (group instanceof FormGroup) {
                group.reset(); // Resets all fields in this FormGroup to their initial/default values
              }
          this.resetSlNo();
          this.CustomerName=[];
        }
      
    });
  }
  resetSlNo(): void {
  this.securities.controls.forEach((group, index) => {
    group.get('sl_no')?.setValue(index + 1);
    });
  }
  public suggestCustomer2(index: number): void {
  this.selectedIndexForSuggestion = index;

  this.securities.controls.forEach((group, index) => {
    const secType = group.get('sec_type')?.value;
    const accTypeCd = group.get('acc_type_cd')?.value;
    const accNum = group.get('acc_num')?.value?.toLowerCase();
debugger
    if (secType === 'D' && accTypeCd && accNum?.length > 0) {
      this.SecaccCD=accTypeCd;
      // this.SecaccNum=accNum;
      const dt={
        ardb_cd:this.sys.ardbCD,
        ad_acc_type_cd:+accTypeCd,
        as_cust_name:accNum
      }
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', dt).subscribe(
      res => {
        console.log(res);
        
        this.suggestedCustomer2=res
        if (res?.length === 0) {
          this.isLoading = false;
            this.HandleMessage(true, MessageType.Warning, 'No Data Found');
            // this.securities.clear();
            return this.suggestedCustomer2=[];
          }
          else{
                this.isLoading = false;
                this.shownoresult = this.suggestedCustomer2.length === 0;
                return this.suggestedCustomer2;
          }
       },
      err=>{console.log(err);
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Warning, 'Error fetching account details');
        return this.suggestedCustomer2=[]
      })
      

    }else{
      debugger
    }
  });
  }
  public async getFulldata(cust_cd: number): Promise<any | null> {
   this.isLoading = true;
          var dt={
            "ardb_cd":this.sys.ardbCD,
            "brn_cd":this.sys.BranchCode,
            "cust_cd":cust_cd
          }

          const res = await firstValueFrom(this.svc.addUpdDel<any>('UCIC/GetDepositDtls', dt));
          this.isLoading = false;

       if(res){
                this.acc_data=res.filter(c => c.acc_type_cd ==this.SecaccCD)[0];
                console.log(this.acc_data);
                
              return this.acc_data
            } else{
              return null
            } 
             
            
}

  
async SelectCustomer(cust: any, i: number) {
  this.selectedIndexForSuggestion = null;
  this.suggestedCustomer2 = [];
  this.shownoresult = false;
  console.log(cust);

  for (let index = 0; index < this.securities.controls.length; index++) {
    const group = this.securities.controls[index];
    if (index === i) {
    let bal:any=null;
    
    debugger
      this.depositDTLS = new tm_deposit();
      this.depositDTLS = await this.getAccountData(this.SecaccCD, cust.acc_num);
      console.log(this.depositDTLS);
      
      debugger;

      if (this.depositDTLS) {
        bal= await this.getFulldata(this.depositDTLS.cust_cd);
              console.log(bal[0]);
        group.get('dh_name1')?.setValue(cust.cust_name);
        group.get('acc_num')?.setValue(cust.acc_num);
        group.get('prn_amt')?.setValue(bal?.prn_amt);
        group.get('mat_dt')?.setValue(this.convertToInputDateFormat(bal?.mat_dt));
        group.get('mat_val')?.setValue(bal?.clr_bal);
        group.get('opn_dt')?.setValue(this.convertToInputDateFormat(this.depositDTLS.opening_dt));
      }
      // else{
      //   group.get('acc_num')?.setValue(cust.acc_num);
      //   group.get('prn_amt')?.setValue(this.depositDTLS.prn_amt);
      //   group.get('mat_dt')?.setValue(this.convertToInputDateFormat(this.depositDTLS.mat_dt));
      //   group.get('mat_val')?.setValue((+this.depositDTLS?.prn_amt));
      //   group.get('opn_dt')?.setValue(this.convertToInputDateFormat(this.depositDTLS.opening_dt));
      // }
    }
  }
}
convertToInputDateFormat(dateStr: string): string | null {
  if (!dateStr) return null;

  const parts = dateStr.split(' ')[0].split('/'); // ["14", "03", "2018"]
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;
  return `${year}-${month}-${day}`; // "2018-03-14"
}
  insertSecurity(): void {
   
    console.log(this.securityForm.value?.securities);
    this.svc.addUpdDel<any>('Loan/InsertLoanSecurityList', this.securityForm.value?.securities).subscribe(
      res => {
        console.log(res);
       },
      err=>{console.log(err);
      })
  }
   updateSecurity(): void {
    console.log(this.securityForm.value?.securities);
    this.svc.addUpdDel<any>('Loan/UpdateLoanSecurityList', this.securityForm.value?.securities).subscribe(
      res => {
        console.log(res);
       },
      err=>{console.log(err);
      })
  }
  getSecurity(loan:any){
     this.svc.addUpdDel<any>(`Loan/GetLoanSecurityList?loan_id=${loan}`, null).subscribe(
      res => {
        if(res){
          this.setSecuritiesFormArray(res);
        }
      })
  }
  setSecuritiesFormArray(apiData: any[]) {
  this.securities.clear();  // optional: reset previous data

  apiData.forEach((item, i) => {
    const group = this.initSecurityFormGroup(i + 1); // reuse your initializer
    console.log(item);
    
    // Convert necessary date fields to yyyy-MM-dd
    const formattedItem = {
      ...item,
      sec_type:item.sec_type,
      opn_dt: this.convertToInputDateFormat(item.opn_dt),
      mat_dt: this.convertToInputDateFormat(item.mat_dt),
      pol_opn_dt: this.convertToInputDateFormat(item.pol_opn_dt),
      pol_mat_dt: this.convertToInputDateFormat(item.pol_mat_dt),
      pol_assgn_dt: this.convertToInputDateFormat(item.pol_assgn_dt),
      cert_opn_dt: this.convertToInputDateFormat(item.cert_opn_dt),
      cert_mat_dt: this.convertToInputDateFormat(item.cert_mat_dt),
      cert_pdlg_dt: this.convertToInputDateFormat(item.cert_pdlg_dt),
      mort_deed_dt: this.convertToInputDateFormat(item.mort_deed_dt),
      created_dt: this.convertToInputDateFormat(item.created_dt),
      modified_dt: this.convertToInputDateFormat(item.modified_dt),
    };

    group.patchValue(formattedItem);
    this.securities.push(group);
  });
}

  getRepFormula(){
    this.svc.addUpdDel<any>('Loan/GetEmiFormula', null).subscribe(
      emi => {
        this.repaymentFormulaList=emi
        console.log(this.repaymentFormulaList);
       })
  }
  openModalC1(template: TemplateRef<any>) {
    ////////debugger;
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
    // this.PopulateLoanRepSch(template);
  }
  getsystemParam(){
    this.svc.addUpdDel<any>('Mst/GetSystemParameter', null).subscribe(
      sysRes => {
        this.systemParam=sysRes
        console.log(this.systemParam);
        
        this.penalIntt=Number(this.systemParam.filter(e=>e.param_cd=="913")[0].param_value)
      })
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  rep_stDT(){
    const cDt = this.sys.CurrentDate.getTime();
    console.log(this.tm_loan_all.instl_start_dt)
    // const opDt = Utils.convertStringToDt(this.tm_loan_all.instl_start_dt.toString()).getTime();
    const opDt = this.tm_loan_all.instl_start_dt.getTime();
        // const o = Utils.convertStringToDt(this.td.opening_dt.value);
        const diffDays =(opDt-cDt ) / (1000 * 3600 * 24);
        this.diff = diffDays
        console.log(cDt + " " + opDt + " " + diffDays)
        debugger
        if(this.diff<=0){
          this.HandleMessage(true, MessageType.Warning, 'Installment start date should be getter than Operation Date!!' );
            this.tm_loan_all.instl_start_dt=null
           debugger
        }
    
  }
  // private  convertDate(datestring:string):Date
  //   {
  //   var parts = datestring.match(/(\d+)/g);
  //   return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
  //   }

  initializeModels() {

    this.masterModel = new LoanOpenDM();

    const loan = new tm_loan_all();
    this.tm_loan_all = loan;
    this.masterModel.tmloanall = this.tm_loan_all;

    const guar = new tm_guaranter();
    this.tm_guaranter = guar;
    this.masterModel.tmguaranter = this.tm_guaranter;

    const acc: td_accholder[] = [];
    this.td_accholder = acc;
    this.masterModel.tdaccholder = this.td_accholder;

    const loansanc: tm_loan_sanction[] = [];
    this.tm_loan_sanction = loansanc;
    this.masterModel.tmlaonsanction = this.tm_loan_sanction;

    const loansancdtl: tm_loan_sanction_dtls[] = [];
    this.tm_loan_sanction_dtls = loansancdtl;
    this.masterModel.tmlaonsanctiondtls = this.tm_loan_sanction_dtls;

    this.associateChildRecordsWithHeader();

    this.selectedActivityList = [];
    this.selectedCorpList = [];
    this.tm_loan_all.instl_start_dt=null;
    this.tm_loan_all.piriodicity=null;
    this.tm_loan_all.instalmentTypeDesc = null;
    this.tm_loan_all.instl_no=null;
    this.tm_loan_sanction_dtls[0].due_dt=null;
    this.tm_loan_sanction_dtls[0].sector_cd=null;
    this.tm_loan_sanction_dtls[0].activity_cd=null;
    this.tm_loan_sanction_dtls[0].crop_cd=null;
    this.tm_loan_sanction_dtls[0].sanc_amt=0;

  }


  assignModelsFromMasterData() {
    this.LoanDetailsForSI.dr_acc_type=11;
    this.LoanDetailsForSI.min_bal=100;
    
    const loan = new tm_loan_all();
    this.tm_loan_all = loan;
    this.tm_loan_all = this.masterModel.tmloanall;
    this.getSIAgentData(this.masterModel.tmloanall.loan_id)
    this.setLoanAccountType(this.tm_loan_all.acc_cd);
    this.setInstalPeriod(this.tm_loan_all.piriodicity);
    this.setRepaymentFormula(this.tm_loan_all.emi_formula_no);
    this.setActivity()

    const guar = new tm_guaranter();
    this.tm_guaranter = guar;
    this.tm_guaranter = this.masterModel.tmguaranter;

    const acc: td_accholder[] = [];
    this.td_accholder = acc;
    this.td_accholder = this.masterModel.tdaccholder;
    for (const i in this.masterModel.tdaccholder) {
      this.setJointHolderRelation(this.td_accholder[i].relation, Number(i));
    }

    const loansanc: tm_loan_sanction[] = [];
    this.tm_loan_sanction = loansanc;
    this.tm_loan_sanction = this.masterModel.tmlaonsanction;

    const loansancdtl: tm_loan_sanction_dtls[] = [];
    this.tm_loan_sanction_dtls = loansancdtl;
    this.tm_loan_sanction_dtls = this.masterModel.tmlaonsanctiondtls;

    this.td_loan_sanc_set_list = this.masterModel.tdloansancsetlist;
    this.parseSecurityDetailsRecord();

  }
setActivity(){//PARTHA
  debugger;
  console.log( this.tm_loan_sanction_dtls);
  
  this.tm_loan_sanction_dtls[0].activity_cd=this.masterModel.tmlaonsanctiondtls[0]?.activity_cd
  this.tm_loan_sanction_dtls[0].activity_desc=this.masterModel.tmlaonsanctiondtls[0]?.activity_desc
  this.tm_loan_sanction_dtls[0].sector_cd=this.masterModel.tmlaonsanctiondtls[0]?.sector_cd
  this.selectedActivityList=[];
  this.selectedActivityList = this.activityList.filter(x => x.sector_cd?.toString() === this.tm_loan_sanction_dtls[0].sector_cd?.toString());
  // const actDtls: tm_loan_sanction_dtls[] = [];
  // this.actDesc=this.activityList.filter(x => x.activity_cd.toString() === 
  // this.masterModel.tmlaonsanctiondtls[0].activity_cd.toString())[0].activity_desc;
  debugger;
  // actDtls[0].activity_cd=this.masterModel.tmlaonsanctiondtls[0].activity_cd
}
  associateChildRecordsWithHeader() {

    if (this.masterModel.tdaccholder.length === 0) {
      this.pushTdAccHolder();
    }

    if (this.masterModel.tmlaonsanction.length === 0) {
      this.pushTmLoanSanction();
    }

    if (this.masterModel.tmlaonsanctiondtls.length === 0) {
      this.pushTmLoanSanctionDtls();
    }
  }

  pushTdAccHolder() {
    this.masterModel.tdaccholder.push(new td_accholder());
  }

  pushTmLoanSanction() {

    this.masterModel.tmlaonsanction.push(new tm_loan_sanction());
    const cnt = this.masterModel.tmlaonsanction.length;
    this.masterModel.tmlaonsanction[cnt - 1].sanc_no = cnt;
  }

  pushTmLoanSanctionDtls() {
    this.masterModel.tmlaonsanctiondtls.push(new tm_loan_sanction_dtls());
    const cnt = this.masterModel.tmlaonsanctiondtls.length;
    this.masterModel.tmlaonsanctiondtls[cnt - 1].sanc_no = cnt;
  }


  parseSecurityDetailsRecord()
  {
    for (const i in this.masterModel.tdloansancsetlist) {
      for (const j in this.masterModel.tdloansancsetlist[i].tdloansancset) {
        this.masterModel.tdloansancsetlist[i].tdloansancset[j].loan_id = this.tm_loan_all.loan_id;

        if (this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_type === 'DATE') {
          // debugger;
          if (this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value === undefined ||
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value === null)
            {
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value_dt = null;
          }
          else
          {
            debugger;
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value_dt = Utils.convertStringToDt(this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value);
          }
        }
      }
    }
  }

  // getCustomerList() {

  //   const cust = new mm_customer();
  //   cust.cust_cd = 0;
  //   cust.brn_cd = this.branchCode;

  //   if (this.customerList === undefined || this.customerList === null || this.customerList.length === 0) {
  //     this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
  //       res => {
  //         console.log(res)
  //         this.isLoading = false;
  //         this.customerList = res;
  //       },
  //       err => {
  //         this.isLoading = false;

  //       }
  //     );
  //   }
  //   else { this.isLoading = false; }
  // }


  getAccountTypeList() {

    if (this.accountTypeListAll.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.isLoading = true;
    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {

        this.isLoading = false;
        this.accountTypeListAll = res;
        this.depositAccountTypeList = this.accountTypeListAll.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeListAll.filter(c => c.dep_loan_flag === 'L');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        this.isLoading = false;
      }
    );
  }


  getInstalmentTypeList() {

    if (this.instalmentTypeList.length > 0) {
      return;
    }
    this.instalmentTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetInstalmentTypeMaster', null).subscribe(
      res => {

        this.instalmentTypeList = res;
      },
      err => {

      }
    );
  }


  getSectorList() {

    if (this.sectorList.length > 0) {
      return;
    }
    this.sectorList = [];

    this.svc.addUpdDel<any>('Mst/GetSectorMaster', null).subscribe(
      res => {

        this.sectorList = res;
      },
      err => {

      }
    );

  }

  getActivityList() {

    if (this.activityList.length > 0) {
      return;
    }
    this.activityList = [];

    this.svc.addUpdDel<any>('Mst/GetActivityMaster', null).subscribe(
      res => {

        this.activityList = res;
        this.activityList = this.activityList.sort((a, b) => (a.activity_cd > b.activity_cd) ? 1 : -1);
      },
      err => {

      }
    );

  }

  getCorpList() {

    if (this.corpList.length > 0) {
      return;
    }
    this.corpList = [];

    this.svc.addUpdDel<any>('Mst/GetCropMaster', null).subscribe(
      res => {

        this.corpList = res;
      },
      err => {

      }
    );

  }


  getSmKccParam() {

    if (this.smKccParamList.length > 0) {
      return;
    }
    this.smKccParamList = [];

    this.svc.addUpdDel<any>('Loan/GetSmKccParam', null).subscribe(
      res => {

        this.smKccParamList = res;
      },
      err => {

      }
    );

  }


  getSmLoanSanctionList() {
    // debugger;
    if (this.smLoanSanctionList.length > 0) {
      return;
    }
    this.svc.addUpdDel<any>('Loan/GetSmLoanSanctionList', null).subscribe(
      res => {
        this.smLoanSanctionList = res;
      },

      err => {
      }
    );
  }

  setSmLoanSanctionList(acc_cd: number) {
    // debugger;
    // if (this.masterModel.tdloansancsetlist === undefined ||
    //   this.masterModel.tdloansancsetlist === null ||
    //   this.masterModel.tdloansancsetlist.length === 0)
    if ( this.operationType === 'N')
      {
      const loanSancSetList: td_loan_sanc_set[] = [];
      this.td_loan_sanc_set_list = loanSancSetList;
      this.masterModel.tdloansancsetlist = this.td_loan_sanc_set_list;
    }

    this.selectedSmLoanSanctionList = this.smLoanSanctionList.filter(c => c.acc_cd.toString() === acc_cd.toString());
    console.log(this.selectedSmLoanSanctionList)
    if ( this.operationType === 'N'
        && this.selectedSmLoanSanctionList !== undefined
        && this.selectedSmLoanSanctionList !== null
        && this.selectedSmLoanSanctionList.length > 0 )
      { 
      this.createSecurityDtlList();
      // debugger;
     }
  }

// createSecurityDtlList()
// {
//   debugger;
//   this.td_loan_sanc_set_list.push(this.populateTdLoanSanc());
// }

removeSecurityDtlList()
{
    // debugger;
    if (this.td_loan_sanc_set_list.length > 1)
    {
      this.td_loan_sanc_set_list.pop();
    }
  }

  createSecurityDtlList(): any {
    // debugger;
    if (this.selectedSmLoanSanctionList !== undefined && this.selectedSmLoanSanctionList !== null && this.selectedSmLoanSanctionList.length > 0)
    {
      const tdLoanSancList: td_loan_sanc[] = [];
      const tdLoanSancLocalSet = new td_loan_sanc_set();

      for (let i in this.selectedSmLoanSanctionList) {
        const tdLoanSanc = new td_loan_sanc();
        tdLoanSanc.sanc_no = 1;
        // tdLoanSanc.dataset_no = this.selectedSmLoanSanctionList[i].dataset_no;
        tdLoanSanc.dataset_no = this.td_loan_sanc_set_list.length + 1;
        tdLoanSanc.field_name = this.selectedSmLoanSanctionList[i].field_name;
        tdLoanSanc.param_cd = this.selectedSmLoanSanctionList[i].param_cd;
        tdLoanSanc.param_type = this.selectedSmLoanSanctionList[i].param_type;
        tdLoanSanc.param_desc = this.selectedSmLoanSanctionList[i].param_desc;

        tdLoanSancList.push(tdLoanSanc);
      }

      tdLoanSancLocalSet.tdloansancset = tdLoanSancList;
      // return tdLoanSancLocalSet;
      this.td_loan_sanc_set_list.push(tdLoanSancLocalSet);

    }

  }


  onChangeSearch(){
    this.suggestedCustomer=null;
    this.showNoName=false;
    if (this.tm_loan_all.cust_name.length > 2)
    this.disabledOnNull=false;
    else
    this.disabledOnNull=true;
  }
  public suggestCustomer(): void {
    // debugger;
    this.isLoading=true;
    
    if (this.tm_loan_all.cust_name.length > 2) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.tm_loan_all.cust_name.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          this.isLoading=false
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res;
            this.showNoName=false;

          } else {
            this.showNoName=true;
            this.suggestedCustomer = [];
          }
        },
        err => { 
          this.showNoName=true;

          this.isLoading = false; }
      );
    } else {
      this.showNoName=true;
      this.suggestedCustomer = null;
    }
  }

  public setCustDtls(cust_cd: number): void {
    // this.suggestedCustomer = null;
    this.showNoName=false;
    this.kycEnable = false;
    this.tm_loan_all.party_cd = cust_cd;
    this.msg.sendcustomerCodeForKyc(cust_cd);
    this.kycEnable = true;
    debugger
    this.populateCustDtls(cust_cd);

  }

  populateCustDtls(cust_cd: number) {
     debugger;
    let temp_mm_cust = new mm_customer();
    temp_mm_cust = this.suggestedCustomer.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
    this.tm_loan_all.cust_name = temp_mm_cust.cust_name;
    this.suggestedCustomer = [];
    this.suggestedCustomer = null;
   

    debugger
  }

  noJointOnNull(idx: number){
    this.suggestedJointCustomer=null
    this.showNoJoint=false;
    if (this.td_accholder[idx].acc_holder.length > 2) 
      this.disabledJointOnNull=false;
   else
      this.disabledJointOnNull=true;
}
  public suggestJointCustomer(idx: number): void {
    this.isLoading=true;
    this.suggestedCustomerJointHolderIdx = idx;
    if (this.td_accholder[idx].acc_holder.length > 2) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.td_accholder[idx].acc_holder.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          this.isLoading=false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedJointCustomer = res;
            this.showNoJoint=false;
          } else {
            this.showNoJoint=true;

            this.suggestedJointCustomer = [];
          }
        },
        err => {
          this.showNoJoint=true;

           this.isLoading = false; }
      );
    } else {
      this.showNoJoint=true;

      this.suggestedJointCustomer = null;
    }

  }

  public setJointCustDtls(cust_cd: number, idx: number): void {

    this.td_accholder[idx].cust_cd = cust_cd;
    this.populateJointCustDtls(cust_cd, idx);
    this.suggestedJointCustomer = null;
  }

  populateJointCustDtls(cust_cd: number, idx: number) {
    console.log(cust_cd)
    console.log(this.suggestedJointCustomer)
    
    debugger;
    let temp_mm_cust = new mm_customer();
    temp_mm_cust = this.suggestedJointCustomer.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
    console.log(temp_mm_cust);
    debugger;
    this.td_accholder[idx].acc_holder = temp_mm_cust.cust_name;
  }

  setJointHolderRelation(relation: string, idx: number) {

    this.td_accholder[idx].relation = relation;
    // this.td_accholder[idx].relationId =
    //   this.relationship.filter(x => x.val.toString() === relation)[0].id;
  }



  addJointHolder() {
    if (this.masterModel.tdaccholder !== undefined) {
      const temp_td_accholder = new td_accholder();
      this.masterModel.tdaccholder.push(temp_td_accholder);
    }
  }

  removeJointHolder() {
    if (this.masterModel.tdaccholder !== undefined && this.masterModel.tdaccholder.length > 1) {
      this.masterModel.tdaccholder.pop();
    }
  }


  public setLoanAccountType(accType: number): void {
    var accTyp = new mm_acc_type();

    this.tm_loan_all.acc_cd = Number(accType);
    accTyp = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0];

    // this.tm_loan_all.loan_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;
    this.tm_loan_all.loan_acc_type = accTyp.acc_type_desc;
    this.tm_loan_all.cc_flag = accTyp.cc_flag;
    this.tm_loan_all.rep_sch_flag = accTyp.rep_sch_flag;
    this.tm_loan_all.intt_calc_type = accTyp.intt_calc_type;

    if (this.operationType === 'N') {
      this.tm_loan_all.curr_intt_rate = null;
      this.tm_loan_all.ovd_intt_rate = null;
      this.tm_loan_all.instl_no = null;
    }

    if (this.tm_loan_all.acc_cd === 23103 && this.operationType === 'N') {

      this.tm_loan_all.curr_intt_rate = Number(this.smKccParamList.filter(x => x.param_cd.toString() === 'curr_intt_rt')[0].param_value);
      this.tm_loan_all.ovd_intt_rate = Number(this.smKccParamList.filter(x => x.param_cd.toString() === 'ovd_intt_rt')[0].param_value);
      this.tm_loan_all.instl_no = 1;
    }

    this.setSmLoanSanctionList(accType);
    this.securities.controls.forEach((group, index) => {
    group.get('acc_cd')?.setValue(accType);
    });

  }

  public setLoanType(accType: number): void {
    this.tm_loan_all.acc_cd = Number(accType);
    this.tm_loan_all.loan_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;
  }


  public setInstalPeriod(instlType: string): void {

    this.tm_loan_all.piriodicity = instlType;
    this.tm_loan_all.instalmentTypeDesc = this.instalmentTypeList.filter(x => x.desc_type.toString() === instlType)[0].ins_desc;
  }


  public setRepaymentFormula(formula: number): void {

    this.tm_loan_all.emi_formula_no = Number(formula);
    this.tm_loan_all.emiFormulaDesc = this.repaymentFormulaList.filter(x => x.formula_no == formula)[0].formula_desc;
  }

  public setSectorType(sec: string, idx: number): void {

    this.tm_loan_sanction_dtls[idx].sector_cd = sec;
    this.tm_loan_sanction_dtls[idx].sector_desc = this.sectorList.filter(x => x.sector_cd.toString() === sec.toString())[0].sector_desc;

    this.tm_loan_sanction_dtls[idx].activity_cd = null;
    this.tm_loan_sanction_dtls[idx].activity_desc = null;
    this.tm_loan_sanction_dtls[idx].crop_cd = null;
    this.tm_loan_sanction_dtls[idx].crop_desc = null;
    // this.tm_loan_sanction_dtls[idx].due_dt = null;
    // this.tm_loan_sanction_dtls[idx].sanc_amt = null;

    this.selectedActivityList = [];
    this.selectedCorpList = [];
    this.selectedActivityList = this.activityList.filter(x => x.sector_cd.toString() === sec.toString());
  }


getHousingOrNot(i:any): boolean {
  const allowedNumbers: string[] = ['118', '119', '120', '121', '141','39'];
  const value: string = i; // This can be from input, API, etc.

  return allowedNumbers.includes(value);
}
  public setActivityType(act: string, idx: number): void {
  
    
    this.tm_loan_sanction_dtls[idx].activity_cd = act;
    this.tm_loan_sanction_dtls[idx].activity_desc =
      this.activityList.filter(x => x.activity_cd.toString() === 
        act.toString())[0].activity_desc;
    debugger
    this.tm_loan_sanction_dtls[idx].crop_cd = null;
    this.tm_loan_sanction_dtls[idx].crop_desc = null;

    this.selectedCorpList = this.corpList.filter(x => x.activity_cd.toString() === act.toString());
    if (this.selectedCorpList === undefined || this.selectedCorpList.length === 0) {
      const tmp_corp = new mm_crop();
      tmp_corp.crop_cd = '00';
      tmp_corp.crop_desc = 'Others';
      this.selectedCorpList.push(tmp_corp);
    }
  }

  public setCorpType(corp: string, idx: number): void {

    this.tm_loan_sanction_dtls[idx].crop_cd = corp;
    this.tm_loan_sanction_dtls[idx].crop_desc = this.corpList.filter(x => x.crop_cd.toString() === corp.toString())[0].crop_desc;

    // this.tm_loan_sanction_dtls[idx].sanc_amt = null;
    // this.tm_loan_sanction_dtls[idx].due_dt = null;

    if (this.tm_loan_sanction_dtls[idx].crop_cd !== '00' && this.tm_loan_all.acc_cd === 23103) {
      const temp_p_loan_param = new p_loan_param();
      temp_p_loan_param.cust_cd = this.masterModel.tmloanall.party_cd;
      temp_p_loan_param.crop_cd = this.tm_loan_sanction_dtls[idx].crop_cd;
      this.getSanctionAmountAndValidity(temp_p_loan_param, idx);
    }
  }

  getSanctionAmountAndValidity(loan_param: p_loan_param, idx: number): any {

    let temp_p_loan_param = new p_loan_param();
    temp_p_loan_param.ardb_cd=this.sys.ardbCD
    this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/PopulateCropAmtDueDt', loan_param).subscribe(
      res => {

        temp_p_loan_param = res;
        this.isLoading = false;
        this.setSanctionAmountAndValidity(temp_p_loan_param, idx);
      },
      err => {
        this.isLoading = false;

      }
    );
    return temp_p_loan_param;
  }

  setSanctionAmountAndValidity(loan_param: p_loan_param, idx: number) {

    if (loan_param.status === 0) {
      this.tm_loan_sanction_dtls[idx].sanc_amt = +loan_param.recov_amt;
      this.tm_loan_sanction_dtls[idx].due_dt = loan_param.due_dt;
    }

    if (loan_param.status === 1) {
      // this.showAlertMsg('ERROR', 'Please Set The Disbursement Start & End Date For This Crop!!!');
      this.HandleMessage(true, MessageType.Error, 'Please Set The Disbursement Start & End Date For This Crop!!!');
    }

    if (loan_param.status === 2) {
      // this.showAlertMsg('ERROR', 'This is Not Disbursement Time For This Crop!!!');
      this.HandleMessage(true, MessageType.Warning, 'This is Not Disbursement Time For This Crop!!!');
    }

    if (loan_param.status === 3) {
      // this.showAlertMsg('ERROR', 'A loan for this crop is already sanctioned for this Member!!!');
      this.HandleMessage(true, MessageType.Warning, 'A loan for this crop is already sanctioned for this Member!!!');
    }

    if (loan_param.status === 4) {
      // this.showAlertMsg('ERROR', 'Loan for this Crop is not sanctioned in KCC Card for this Member!!!');
      this.HandleMessage(true, MessageType.Warning, 'Loan for this Crop is not sanctioned in KCC Card for this Member!!!');
    }

  }
  
  setFundType(event:any){
    console.log(event);
    
    if(event=='N' && this.sys.ardbCD=='26'){
      this.tm_loan_all.instl_start_dt=null;
      this.tm_loan_all.piriodicity=null;
      this.tm_loan_all.instalmentTypeDesc = null;
      this.tm_loan_all.instl_no=null;
      this.tm_loan_sanction_dtls[0].due_dt=null;
      this.tm_loan_sanction_dtls[0].sector_cd=null;
      this.tm_loan_sanction_dtls[0].activity_cd=null;
      this.tm_loan_sanction_dtls[0].crop_cd=null;
      this.tm_loan_sanction_dtls[0].sanc_amt=0;
    }
    else{
    this.tm_loan_all.instl_start_dt=null;
    this.tm_loan_all.piriodicity=null;
    this.tm_loan_all.instalmentTypeDesc = null;
    this.tm_loan_all.instl_no=null;
    this.tm_loan_sanction_dtls[0].due_dt=null;
    this.tm_loan_sanction_dtls[0].sector_cd=null;
    this.tm_loan_sanction_dtls[0].activity_cd=null;
    this.tm_loan_sanction_dtls[0].crop_cd=null;
    this.tm_loan_sanction_dtls[0].sanc_amt=0;
    }
    
    // this.isLoading=false;
  }
  newAccount() {

    this.clearData();
    this.disableLoanId=true
    this.operationType = 'N';
    this.disableAll = 'N';
    // this.disablePersonal = 'N';
    // this.isLoading = true;

    // this.getCustomerList();

  }

  retrieveData() {

    this.clearData();
    this.operationType = 'R';
    this.disableAll = 'Y';
    // this.disablePersonal = 'Y';

    // this.isLoading = true;
    // this.getCustomerList();
  }

  clearData() {
    this.LoanAgentDetailsForSI=new LoanAgentDetailsForSI()
    this.LoanDetailsForSI=new LoanDetailsForSI()
    this.securities.clear();
    this.securityForm = this.fb.group({
      securities: this.fb.array([
        this.initSecurityFormGroup(1)
      ])
    });
    this.operationType = '';
    this.disableLoanId=true
    this.closeAlertMsg();
    // this.disablePersonal = 'Y';
    this.initializeModels();
    this.allLoanDtls=[]
    this.showNoJoint=false;
    this.showNoName=false;
    this.suggestedCustomer=null;
    this.suggestedJointCustomer=null
    this.disabledOnNull=true;
    this.disabledJointOnNull=true;
    this.accName=true;
    // this.SecaccCD=false;
    this.newtm_deposit=null;
    this.depositDTLS=null
    this.selectedIndexForSuggestion = null;
    this.SecaccNum=null;
    this.SecaccCD=null;
    this.shownoresult=false
    
  }


  modifyData() {
    if(this.masterModel?.tmlaonsanctiondtls[0]?.approval_status=='A'){
      this.appvSanction=true;
    }else{
      this.appvSanction=false;
    }
    debugger
    console.log(this.operationType)
    if (this.operationType !== 'Q') {
      this.HandleMessage(true, MessageType.Warning, 'Record not retrived to modify');
      return;
    }
    
    this.operationType = 'U';
    this.disableAll = 'N';

  }

  approveData(idx: number) {
    if (this.masterModel.tmlaonsanction[idx].approval_status !== undefined &&
      this.masterModel.tmlaonsanction[idx].approval_status === 'A') {
      // this.showAlertMsg('WARNING', 'Loan Already Approved !!');
      this.HandleMessage(true, MessageType.Warning, 'Loan Already Approved !!');
      return;
    }
    // if(this.createUser1.toLowerCase()==this.logUser.toLowerCase()){
    //   this.modalRef = this.modalService.show(this.MakerChecker, this.config);
    // }
    // else{
    this.lienAccount();
    this.tm_loan_all.approval_status = 'A';
    this.masterModel.tmlaonsanction[idx].approval_status = 'A';
    this.masterModel.tmlaonsanction[idx].approved_dt = this.sys.CurrentDate;
    this.masterModel.tmlaonsanction[idx].approved_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    this.masterModel.tmlaonsanctiondtls[idx].approval_status = 'A';
    this.saveData('A');
    // }
  }

  lienAccount() {
    if(this.masterModel.tdloansancsetlist.length>0){
      const accCD=this.masterModel.tdloansancsetlist[0].tdloansancset.filter(e=>e.param_cd.includes('115'))
      const accNUM=this.masterModel.tdloansancsetlist[0].tdloansancset.filter(e=>e.param_cd.includes('116'))
    debugger
    if((accCD.length==0 ||accCD==undefined||accCD==null) && (accNUM.length==0 ||accNUM==undefined||accNUM==null)){
    debugger
      return
    }
  
    else{
      debugger
    this.isLoading=true;
    let lien_acc_cd=this.masterModel.tdloansancsetlist[0].tdloansancset.filter(e=>e.param_cd=='115')[0].param_value
    let lien_acc_no=this.masterModel.tdloansancsetlist[0].tdloansancset.filter(e=>e.param_cd=='116')[0].param_value
   if((lien_acc_cd!=null||lien_acc_cd!=undefined)&& (lien_acc_no!=null||lien_acc_no!=undefined)){
    var data = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode,
      "acc_type_cd": lien_acc_cd,
      "acc_num": lien_acc_no,
      "loan_id": this.masterModel.tmloanall.loan_id,
      "lock_mode": 'L',
      "modified_by": this.sys.UserId,
    }
      var ret = 0;

      this.svc.addUpdDel<any>('Deposit/UpdateDepositLockUnlock', data).subscribe(
        res => {
          // //debugger;
          ret = res;
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Sucess, 'Sucessfully added lien account !!');

        },
        err => {
          //debugger;
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, 'Error, While adding lien account !!');
        }
      );
   }
  } 
  }
  else{return}
  }
  saveData(saveType: string) {

    if (this.operationType !== 'N' && this.operationType !== 'U') {
      // this.showAlertMsg('WARNING', 'Loan Account not Created or Updated to Save');
      this.HandleMessage(true, MessageType.Warning, 'Loan Account not Created or Updated to Save');
      return;
    }

    if (this.operationType === 'N') {
      if(this.tm_loan_all.curr_intt_rate==0){
        this.HandleMessage(true, MessageType.Warning, 'Interest rate can not be zero!!!');
        this.tm_loan_all.curr_intt_rate = 0;
        this.tm_loan_all.ovd_intt_rate = 0;
      }
      else{
        this.tm_loan_all.brn_cd = this.branchCode;
        this.tm_loan_all.created_by = this.createUser;
        this.tm_loan_all.created_dt = this.createDate;
  
        this.GetLoanAccountNumberAndInsertData();
      }
      
    }

    if (this.operationType === 'U') {
      if(this.tm_loan_all.curr_intt_rate==0){
        this.HandleMessage(true, MessageType.Warning, 'Interest rate can not be zero!!!');
        this.tm_loan_all.curr_intt_rate = 0;
        this.tm_loan_all.ovd_intt_rate = 0;
      }
      else{
        this.tm_loan_all.brn_cd = this.sys.BranchCode;
        this.tm_loan_all.modified_by = this.updateUser;
        this.tm_loan_all.created_dt = this.updateDate;
        this.UpdateLoanAccountOpeningData(saveType);
      }
      
    }
  }

  GetLoanAccountNumberAndInsertData() {
    this.ValidateLoanOpenHeaderData();     // Validation for Loan Account Header
    // this.ValidateLoanUpdateData();     // Validation for Loan Account Child
    this.p_gen_param.brn_cd = this.branchCode;
    this.isLoading = true;

    this.svc.addUpdDel<any>('Loan/PopulateLoanAccountNumber', this.p_gen_param).subscribe(
      res => {
        // debugger;
        let val = '0';
        this.isLoading = false;
        val = res;
        if (val === '' || val == null) {
          // this.showAlertMsg('ERROR', 'Loan Account Number not created !!');
          this.HandleMessage(true, MessageType.Error, 'Loan Account Number not created !!');
          return;
        }
        this.tm_loan_all.loan_id = val.toString();
        
          this.securities.controls.forEach((group, index) => {
              group.get('loan_id')?.setValue(val.toString());
              group.get('acc_cd')?.setValue(this.tm_loan_all.acc_cd);
              });
        // this.masterModel.tmguaranter = null;
        // this.masterModel.tdaccholder = null;
        // this.masterModel.tmlaonsanction = null;
        // this.masterModel.tmlaonsanctiondtls = null;

        this.InsertLoanAccountOpeningData();
      },
      err => {
        this.isLoading = false;
        // this.showAlertMsg('ERROR', 'Loan Account Number not created !!!');
        this.HandleMessage(true, MessageType.Error, 'Loan Account Number not created !!!');

      }

    );
  }

  InsertLoanAccountOpeningData() {
    console.log( this.securities.value);
    this.insertSecurity();
    debugger;
    this.masterModel.tmloanall.approval_status = 'U';
    this.ValidateLoanUpdateData(); // Validation for Loan Account Child

    this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/InsertLoanAccountOpeningData', this.masterModel).subscribe(
      res => {
        this.insertLoanSIData();
        this.insertLoanAgentData();
        this.isLoading = false;
        this.operationType = 'U';
        this.associateChildRecordsWithHeader();
        this.HandleMessage(true, MessageType.Sucess, 'Loan Account Created Successfully. LoanId: ' + this.tm_loan_all.loan_id);
        
      },
      err => {
        // debugger;
        this.isLoading = false;
        console.error('Error on SaveClick' + JSON.stringify(err));
        // this.showAlertMsg('ERROR', 'Record Not Saved !!!');
        this.HandleMessage(true, MessageType.Error, 'Record Not Saved !!!');

      }
    );
  }

  insertLoanSIData(){
    this.LoanDetailsForSI.loan_id=(+this.tm_loan_all.loan_id);
    this.LoanDetailsForSI.acc_cd=(+this.tm_loan_all.acc_cd);
    this.LoanDetailsForSI.party_cd=(+this.tm_loan_all.party_cd);
    this.LoanDetailsForSI.trf_flag="Y";
    this.LoanDetailsForSI.trf_dt=this.tm_loan_all.created_dt.toISOString();
    this.LoanDetailsForSI.created_by=this.tm_loan_all.created_by;
    this.LoanDetailsForSI.created_dt=this.tm_loan_all.created_dt.toISOString();
    console.log(this.LoanDetailsForSI);
    
    this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/InsertLoanStandingInstruction',this.LoanDetailsForSI).subscribe(
      res => {
        // debugger;
        this.isLoading = false;
       
      },
      err => {
        // debugger;
        this.isLoading = false;
        console.error('Error on save SI Details' + JSON.stringify(err));
        // this.showAlertMsg('ERROR', 'Record Not Saved !!!');
        this.HandleMessage(true, MessageType.Warning, 'SI Not Saved !!!' );

      }
    );
  }

  updateLoanSIData(){
    this.LoanDetailsForSI.loan_id=(+this.tm_loan_all.loan_id);
    this.LoanDetailsForSI.acc_cd=(+this.tm_loan_all.acc_cd);
    this.LoanDetailsForSI.party_cd=(+this.tm_loan_all.party_cd);
    this.LoanDetailsForSI.trf_flag="Y";
    this.LoanDetailsForSI.trf_dt=this.tm_loan_all.created_dt.toISOString();
    this.LoanDetailsForSI.created_by=this.tm_loan_all.created_by;
    this.LoanDetailsForSI.created_dt=this.tm_loan_all.created_dt.toISOString();
    console.log(this.LoanDetailsForSI);
    
    this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/UpdateLoanStandingInstruction',this.LoanDetailsForSI).subscribe(
      res => {
        // debugger;
        this.isLoading = false;
       
      },
      err => {
        // debugger;
        this.isLoading = false;
        console.error('Error on save SI Details' + JSON.stringify(err));
        // this.showAlertMsg('ERROR', 'Record Not Saved !!!');
        this.HandleMessage(true, MessageType.Warning, 'SI Not Update !!!' );

      }
    );
  }

  insertLoanAgentData(){
    console.log(this.LoanAgentDetailsForSI);
    this.LoanAgentDetailsForSI.loan_id=(+this.tm_loan_all.loan_id);
      this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/InsertLoanAgent', this.LoanAgentDetailsForSI).subscribe(
      res => {
        // debugger;
        this.isLoading = false;
        
      },
      err => {
        // debugger;
        this.isLoading = false;
        console.error('Error on Save AgentData' + JSON.stringify(err));
        // this.showAlertMsg('ERROR', 'Record Not Saved !!!');
        this.HandleMessage(true, MessageType.Warning, 'Agent Not Saved !!!' );

      }
    );
  }
  UpdateLoanAgentData(){
    console.log(this.LoanAgentDetailsForSI);
    this.LoanAgentDetailsForSI.loan_id=(+this.tm_loan_all.loan_id);
      this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/UpdateLoanAgent', this.LoanAgentDetailsForSI).subscribe(
      res => {
        // debugger;
        this.isLoading = false;
        
      },
      err => {
        // debugger;
        this.isLoading = false;
        console.error('Error on Save AgentData' + JSON.stringify(err));
        // this.showAlertMsg('ERROR', 'Record Not Saved !!!');
        this.HandleMessage(true, MessageType.Warning, 'Agent Not Update !!!' );

      }
    );
  }
  UpdateLoanAccountOpeningData(saveType: string) {
    this.ValidateLoanUpdateData();
    this.updateSecurity();
     debugger;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/InsertLoanAccountOpeningData', this.masterModel).subscribe(
      res => {
        this.UpdateLoanAgentData();
        this.updateLoanSIData();
        this.isLoading = false;
        this.operationType = 'U';

        if (saveType === 'A') {
          // this.showAlertMsg('INFORMATION', 'LoanId: ' + this.tm_loan_all.loan_id + '  Approved Successfully.');
          this.HandleMessage(true, MessageType.Sucess, 'LoanId: ' + this.tm_loan_all.loan_id + '  Approved Successfully.');
        }
        else {
          //  this.showAlertMsg('INFORMATION', 'Record Saved Successfully for LoanId: ' + this.tm_loan_all.loan_id);
          this.HandleMessage(true, MessageType.Sucess, 'Record Saved Successfully for LoanId: ' + this.tm_loan_all.loan_id );
        }
        this.associateChildRecordsWithHeader();
      },
      err => {
        // debugger;
        this.isLoading = false;
        console.error('Error on SaveClick' + JSON.stringify(err));
        // this.showAlertMsg('ERROR', 'Record Not Saved !!!');
        this.HandleMessage(true, MessageType.Error, 'Record Not Saved !!!' );

      }
    );
  }


  // getLoanAccountData() {

  //   this.isLoading = true;
  //   this.tm_loan_all.brn_cd = this.branchCode;
  //   this.tm_loan_all.ardb_cd=this.sys.ardbCD;
  //   this.svc.addUpdDel<any>('Loan/GetLoanData', this.tm_loan_all).subscribe(
  //     res => {

  //       this.isLoading = false;
  //       this.masterModel = res;
  //       console.log(res)
  //       if (this.masterModel === undefined || this.masterModel === null) {
  //         this.HandleMessage(true, MessageType.Warning, 'No record found!!' );
  //       }
  //       else {
  //         if (this.masterModel.tmloanall.loan_id !== null) {

  //           this.assignModelsFromMasterData();
  //           this.associateChildRecordsWithHeader();
  //           this.operationType = 'Q';
  //           this.disableAll = 'Y';
  //         }
  //         else {
  //           this.HandleMessage(true, MessageType.Warning, 'No record found!!!');
  //         }

  //       }

  //     },
  //     err => {
  //       this.isLoading = false;
  //       this.HandleMessage(true, MessageType.Warning, 'Unable to find record!!' );
  //     }

  //   );
  // }
  disableonNull(e:any){
    if(e.target.value.length<=0)
    { this.allLoanDtls=[];
     this.disableLoanId=true}
    
    else if(e.target.value.length>=2){
      console.log(e.target.value.length)
      this.disableLoanId=false
    }
   else { this.allLoanDtls=[];
    this.disableLoanId=true}

    
   
      console.log(this.disableLoanId)
      
  }
  getCustforLoan(cust:any){
    this.tm_loan_all.brn_cd = this.branchCode;
    this.tm_loan_all.ardb_cd=this.sys.ardbCD;
    this.tm_loan_all.loan_id=cust.loan_id;
    this.tm_loan_all.instl_no=0;
    this.getSecurity(cust.loan_id);
    // cust.ardb_cd=this.sys.ardbCD;
    // cust.branchCode=this.sys.BranchCode
    // this.svc.addUpdDel<any>('Loan/GetLoanData', this.tm_loan_all).subscribe(
      this.svc.addUpdDel<any>('Loan/GetLoanData', this.tm_loan_all).subscribe(
      res => {

        this.isLoading = false;
        this.masterModel = res;
        if (this.masterModel.tmloanall){
          const inputString=this.masterModel.tmloanall.created_by
          const parts = inputString.split('/');
          if (parts.length > 0) {
            const result = parts[0];
            this.createUser1=result;
            console.log(result); // This will output: username
          } else {
            this.createUser1="no"
            console.log("No '/' found in the string.");
          }
        }
        console.log(res)
        if (this.masterModel === undefined || this.masterModel === null) {
          this.HandleMessage(true, MessageType.Warning, 'No record found!!' );
        }
        else {
          if (res.tmlaonsanctiondtls) {
            this.allLoanDtls=[]
            this.assignModelsFromMasterData();
            this.associateChildRecordsWithHeader();
            this.operationType = 'Q';
            this.disableAll = 'Y';
            if(res.tdloansancsetlist){
              // this.getAccountData();//for geting security acc details
            }
          }
          else {
            this.HandleMessage(true, MessageType.Warning, 'No record found!!!');
          }

        }

      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Warning, 'Unable to find record!!' );
      }

    );
      //  if (cust.loan_id !== null) {

      //       this.assignModelsFromMasterData();
      //       this.associateChildRecordsWithHeader();
      //       this.operationType = 'Q';
      //       this.disableAll = 'Y';
      //     }
      
     
  }
  getLoanAccountData(val:any) {

    this.isLoading = true;
    const prm = new p_gen_param();
    prm.brn_cd = this.branchCode;
    prm.brn_cd=this.sys.BranchCode
    prm.as_cust_name = val.toLowerCase();
    this.svc.addUpdDel<any>('Loan/GetLoanDtls1', prm).subscribe(
      res => {

        this.isLoading = false;
        this.masterModel = res
        console.log(res)
        this.allLoanDtls=res
        if (this.masterModel === undefined || this.masterModel === null) {
          this.HandleMessage(true, MessageType.Warning, 'No record found!!' );
        }
        else {
          // if (this.masterModel.tmloanall.loan_id !== null) {

          //   // this.assignModelsFromMasterData();
          //   // this.associateChildRecordsWithHeader();
          //   this.operationType = 'Q';
          //   this.disableAll = 'Y';
          // }
          // else {
          //   this.HandleMessage(true, MessageType.Warning, 'No record found!!!');
          // }

        }

      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Warning, 'Unable to find record!!' );
      }

    );
  }

  ValidateLoanOpenHeaderData() {
    if (this.tm_loan_all.party_cd === null || this.tm_loan_all.party_cd === undefined ||
      this.tm_loan_all.cust_name === null || this.tm_loan_all.cust_name === undefined ||
      this.tm_loan_all.loan_acc_type === null || this.tm_loan_all.loan_acc_type === undefined ||
      // this.tm_loan_all.loan_acc_no === null || this.tm_loan_all.loan_acc_no === undefined ||
      this.tm_loan_all.instl_start_dt === null || this.tm_loan_all.instl_start_dt === undefined ||
      this.tm_loan_all.curr_intt_rate === null || this.tm_loan_all.curr_intt_rate === undefined ||
      this.tm_loan_all.ovd_intt_rate === null || this.tm_loan_all.ovd_intt_rate === undefined ||
      this.tm_loan_all.instl_no === null || this.tm_loan_all.instl_no === undefined ||
      this.tm_loan_all.piriodicity === null || this.tm_loan_all.piriodicity === undefined ||
      this.tm_loan_all.emi_formula_no === null || this.tm_loan_all.emi_formula_no === undefined) {
      // this.showAlertMsg('WARNING', 'Please provide all the required data in Personal Information');
      this.HandleMessage(true, MessageType.Warning, 'Please provide all the required data in Personal Information');
      exit(0);
    }
  }

  ValidateLoanUpdateData() {
    debugger
    // debugger;
    // Guaranter Validation
    if (this.masterModel.tdaccholder[0].ardb_cd && !this.masterModel.tdaccholder[0].cust_cd) {
      debugger
      this.masterModel.tdaccholder.length=0
    }
    console.log(this.masterModel.tmlaonsanctiondtls[0]);
    
    if (this.masterModel.tmlaonsanctiondtls[0].ardb_cd && !this.masterModel.tmlaonsanctiondtls[0].activity_cd) {
      debugger
      this.masterModel.tmlaonsanctiondtls.length=0
    }
    // if (this.tm_guaranter.gua_name !== undefined || this.tm_guaranter.gua_name != null) {
    //   if (this.tm_guaranter.gua_name === '' ||
    //     this.tm_guaranter.gua_add === undefined || this.tm_guaranter.gua_add == null || this.tm_guaranter.gua_add === '' ||
    //     this.tm_guaranter.salary === undefined || this.tm_guaranter.salary == null ||
    //     this.tm_guaranter.mobile === undefined || this.tm_guaranter.mobile == null) {
    //     // this.showAlertMsg('WARNING', 'Please provide all the required data in Guaranter Details');
    //     this.HandleMessage(true, MessageType.Warning, 'Please provide all the required data in Guaranter Details');
    //     // return;
    //   }

    //   this.tm_guaranter.loan_id = this.tm_loan_all.loan_id;
    //   this.tm_guaranter.acc_cd = this.tm_loan_all.acc_cd;
    //   this.tm_guaranter.srl_no = 1;
    //   this.tm_guaranter.opening_dt = null; // this.sys.CurrentDate;
    // }
    // debugger;
    // if (this.masterModel.tdaccholder[0].ardb_cd && !this.masterModel.tdaccholder[0].cust_cd ) {
     
    // Joint Holder Validation
    for (const i in this.masterModel.tdaccholder) {
      debugger;
      if (this.masterModel.tdaccholder[i].ardb_cd && !this.masterModel.tdaccholder[i].cust_cd ) {
        this.masterModel.tdaccholder.splice(0, 1);
      }
      else {
        if (this.masterModel.tdaccholder[i].relation === undefined || this.masterModel.tdaccholder[i].relation == null) {
          // this.showAlertMsg('WARNING', 'Please provide all the required data for Joint Holder');
          this.HandleMessage(true, MessageType.Warning, 'Please provide all the required data for Joint Holder');
         return;
        }
        else {
          this.masterModel.tdaccholder[i].acc_num = this.tm_loan_all.loan_id;
          this.masterModel.tdaccholder[i].brn_cd = this.branchCode;
          this.masterModel.tdaccholder[i].acc_type_cd = Number(this.tm_loan_all.acc_cd);
        }
      }
    }

    // All Sanction Validation
    if (this.masterModel.tmlaonsanction[0].sanc_dt === undefined) {
      // this.showAlertMsg('WARNING', 'Please provide Sanction Date in All Sanction');
      this.HandleMessage(true, MessageType.Warning, 'Please provide Sanction Date in All Sanction');
      return
    }
    else {
      if (this.masterModel.tmlaonsanction[0].loan_id === undefined) {
        this.masterModel.tmlaonsanction[0].loan_id = this.tm_loan_all.loan_id;
        this.masterModel.tmlaonsanction[0].created_by = this.createUser;
        if (this.masterModel.tmlaonsanction[0].approval_status === undefined ||
          this.masterModel.tmlaonsanction[0].approval_status === '') {
          this.masterModel.tmlaonsanction[0].approval_status = 'U';
        }
      }
      else {
        this.masterModel.tmlaonsanction[0].modified_by = this.updateUser;
      }
    }


    // Sanction Details Validation
    if (this.masterModel.tmlaonsanctiondtls[0]?.sector_cd === undefined || this.masterModel.tmlaonsanctiondtls[0]?.sector_cd == null
      || this.masterModel.tmlaonsanctiondtls[0]?.activity_cd === undefined || this.masterModel.tmlaonsanctiondtls[0]?.activity_cd == null
      || this.masterModel.tmlaonsanctiondtls[0]?.crop_cd === undefined || this.masterModel.tmlaonsanctiondtls[0]?.crop_cd == null
      || this.masterModel.tmlaonsanctiondtls[0]?.sanc_amt === undefined || this.masterModel.tmlaonsanctiondtls[0]?.sanc_amt == null
      || this.masterModel.tmlaonsanctiondtls[0]?.due_dt === undefined
    ) {
      // this.showAlertMsg('WARNING', 'Please provide all the required data for Sanction Details');
      // this.HandleMessage(true, MessageType.Warning, 'Please provide all the required data for Sanction Details');
      // exit(0);
    }
    else {
      this.masterModel.tmlaonsanctiondtls[0].loan_id = this.tm_loan_all.loan_id;
      this.masterModel.tmloanall.activity_cd=this.masterModel.tmlaonsanctiondtls[0].activity_cd
      this.masterModel.tmlaonsanctiondtls[0].srl_no = this.masterModel.tmlaonsanctiondtls[0].sanc_no;
      if (this.masterModel.tmlaonsanctiondtls[0].approval_status === undefined ||
        this.masterModel.tmlaonsanctiondtls[0].approval_status === '') {
        this.masterModel.tmlaonsanctiondtls[0].approval_status = 'U';
      }
      this.masterModel.tmlaonsanctiondtls[0].sanc_status = 'C';
    }


    for (const i in this.masterModel.tdloansancsetlist) {
      for (const j in this.masterModel.tdloansancsetlist[i].tdloansancset) {
        this.masterModel.tdloansancsetlist[i].tdloansancset[j].loan_id = this.tm_loan_all.loan_id;

        if (this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_type === 'DATE')
        {
          debugger;
          if (this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value_dt === undefined ||
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value_dt === null)
            {
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value = null;
            }
          else
          {
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value = Utils.convertDtToString(this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value_dt);
            // this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value = this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value_dt.toString();
          }
        }
      }
    }


  }

  setValidityDate(idx: number) {
    if(this.tm_loan_all.fund_type=='O'){
      const dt = this.sys.CurrentDate;
      dt.setMonth(dt.getMonth() + 2);
      dt.setDate(0);
  
      this.masterModel.tmlaonsanctiondtls[idx].due_dt = dt;
    }
    
  }

  checkAndSetOverdueInterest() {
    if(this.tm_loan_all.curr_intt_rate>100){
      this.HandleMessage(true, MessageType.Warning, 'Interest rate should be lower than 100%');
      this.tm_loan_all.curr_intt_rate = 0;
      this.tm_loan_all.ovd_intt_rate = 0;
    }
    else{
      if(this.sys.ardbCD=='1'){
        this.tm_loan_all.ovd_intt_rate = this.tm_loan_all.curr_intt_rate
      }
      else{
        this.tm_loan_all.ovd_intt_rate = this.tm_loan_all.curr_intt_rate + this.penalIntt;
      }

    }
    // if (this.tm_loan_all.ovd_intt_rate === undefined ||
    //   this.tm_loan_all.ovd_intt_rate === null ||
    //   this.tm_loan_all.ovd_intt_rate === 0) {
    //   this.tm_loan_all.ovd_intt_rate = this.tm_loan_all.curr_intt_rate + 2;
    // }
    // if(this.sys.ardbCD=='26'){this.tm_loan_all.ovd_intt_rate = this.tm_loan_all.curr_intt_rate}
    // else{this.tm_loan_all.ovd_intt_rate = this.tm_loan_all.curr_intt_rate + 2;}

  }

  // public showAlertMsg(msgTyp: string, msg: string) {
  //   this.alertMsgType = msgTyp;
  //   this.alertMsg = msg;
  //   this.showAlert = true;
  //   this.disableAll = 'Y';

  //   // this.disablePersonal = 'Y';
  // }

      getAlertClass(type: MessageType): string {
        switch (type) {
          case MessageType.Sucess:
            return 'alert-success';
          case MessageType.Warning:
            return 'alert-warning';
          case MessageType.Info:
            return 'alert-info';
          case MessageType.Error:
            return 'alert-danger';
          default:
            return 'alert-info';
        }
      }
      private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
        this.showMsg = new ShowMessage();
        this.showMsg.Show = show;
        this.showMsg.Type = type;
        this.showMsg.Message = message;

        if (show) {
          setTimeout(() => {
            this.showMsg.Show = false;
          }, 5000); // auto-close after 4 sec
        }
      }

      getAlertIcon(type: MessageType): string {
        switch (type) {
          case MessageType.Sucess:
            return '✅';
          case MessageType.Warning:
            return '⚠️';
          case MessageType.Info:
            return 'ℹ️';
          case MessageType.Error:
            return '❌';
          default:
            return '🔔';
        }
      }

  public closeAlertMsg() {

    this.HandleMessage(false);
    this.disableAll = 'N';
  }


  backScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }

  public async getAccountData(acc_type_cd: number, acc_num: string): Promise<tm_deposit | null> {
  if (!acc_num) return null;

  const usr = new tm_deposit();
  usr.ardb_cd = this.sys.ardbCD;
  usr.brn_cd = this.sys.BranchCode;
  usr.acc_type_cd = acc_type_cd;
  usr.acc_num = acc_num;

  this.isLoading = true;

  try {
    const res = await firstValueFrom(this.svc.addUpdDel<any>('Deposit/GetAccountOpeningData', usr));
    this.isLoading = false;

    if (!res || !res.tmdeposit) {
      this.HandleMessage(true, MessageType.Warning, 'No Account Details found!!');
      return null;
    }

    this.newtm_deposit = res.tmdeposit;

    if (res.tmdeposit.acc_num !== null) {
      if (res.tmdeposit.lock_mode === 'L' && this.operationType === 'N') {
        for (const list of this.masterModel.tdloansancsetlist) {
          for (const param of list.tdloansancset) {
            if (param.param_cd === '115' || param.param_cd === '116') {
              param.param_value = null;
            }
          }
        }
        this.HandleMessage(true, MessageType.Warning, 'This Account is already added into another loan security');
        return null;
      } else if (res.tmdeposit.acc_status !== 'O') {
        this.HandleMessage(true, MessageType.Warning, 'This Account is already Closed');
        return null;
      } else {
        this.getCustomer(res.tmdeposit.cust_cd);
        return res.tmdeposit;
      }
    } else {
      this.HandleMessage(true, MessageType.Warning, 'No record found for getting Account Details!!');
      return null;
    }
  } catch (err) {
    this.isLoading = false;
    this.HandleMessage(true, MessageType.Warning, 'Unable to find record!!');
    return null;
  }
}
  public getCustomer(cust_cd) {
    debugger
    this.isLoading=true;
    const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = cust_cd?.toString();
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          debugger
          this.isLoading=false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.CustomerName = res[0];
            this.accName=false;
            debugger
            this.isLoading = false;
          } 
        },
        err => {

           this.isLoading = false; }
      );
   

  }

//for new security
  getAgentList() {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode
    }
    this.svc.addUpdDel('Deposit/GetAgentData', dt).subscribe(res => {
      this.allAgent=res
    })
  }
  suggestAgent(){
    this.suggestedAgent=[]
    this.suggestedAgent = this.allAgent.filter(agent =>
      agent.agent_name.toLowerCase().includes(this.LoanAgentDetailsForSI.agent_name.toLowerCase())
    );
    if(this.suggestedAgent){
      this.shownoresult3=true
    }

  }
  SelectAgent(agent){
    this.LoanAgentDetailsForSI.agent_cd=agent.agent_cd;
    this.LoanAgentDetailsForSI.agent_name= agent.agent_name;
    this.suggestedAgent=[];
    this.shownoresult3=false;
  }
 public suggestCustomer3(): Observable<mm_customer> {
    this.isLoading = true;
    console.log("here")
    // console.log(this.f.acct_num.value.length)
    //  console.log(this.accDtlsFrm.get('home_brn_cd').value)
    if (this.LoanDetailsForSI.dr_acc_num.length>0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = this.LoanDetailsForSI.dr_acc_type;
      prm.as_cust_name = this.LoanDetailsForSI.dr_acc_num;
      console.log(prm);

      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          console.log(res)
          this.isLoading = false;
          if (undefined !== res && null !== res && res.length > 0 && res != '') {
            this.suggestedDDCustomer = [];
            // this.suggestedCustomer = res.slice(0, 10);
            this.suggestedDDCustomer = res
            console.log(res.length + " " + this.suggestedDDCustomer.length)
            return this.suggestedDDCustomer;
          } else {
            this.shownoresult = true;
            console.log(res.length)
            this.suggestedDDCustomer = [];
            return this.suggestedDDCustomer;
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
      this.suggestedDDCustomer = null;
      return null;
    }
    // console.log(this.suggestedCustomer)
  }
  public SelectCustomer3(cust: any): void {
    this.LoanDetailsForSI.modified_by=null;
    this.shownoresult = false;
    // this.selectedCust = cust.acc_num
    console.log(cust)
    this.LoanDetailsForSI.dr_acc_num=cust.acc_num;
    this.LoanDetailsForSI.modified_by= cust.cust_name;
    // this.f.acct_num.setValue(cust.acc_num);
    // this.onAccountNumTabOff();
    // this.f.acct_num.value.length=0;
    this.suggestedDDCustomer = [];
    this.validateSbAccount();
   

  }
  validateSbAccount() {
    //debugger;
    
    if (this.LoanDetailsForSI.dr_acc_num === undefined
      || this.LoanDetailsForSI.dr_acc_num === null
      || this.LoanDetailsForSI.dr_acc_num === "") {
      return;
    }

    let temp_deposit_list: tm_deposit[] = [];
    const temp_deposit = new tm_deposit();
    temp_deposit.brn_cd = this.branchCode;
    temp_deposit.acc_num = this.LoanDetailsForSI.dr_acc_num;
    temp_deposit.acc_type_cd = this.LoanDetailsForSI.dr_acc_type;
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
          this.LoanDetailsForSI.dr_acc_num = null;
          exit(0);
        }

      },
      err => {
        this.isLoading = false;
      }
    );
  }
  clearSuggestedCust3() {
    this.suggestedDDCustomer = null;
    this.shownoresult = false;
    if (this.LoanDetailsForSI.dr_acc_num.length > 0) {
      this.disabledOnNull = false;
    }
    else {
      this.disabledOnNull = true;
    }


  }
  getSIAgentData(loan_id){

       this.svc.addUpdDel<any>(`Loan/GetLoanStandingInstruction?loan_id=${loan_id}`, null).subscribe(
        res => {
          if(res){
            this.LoanDetailsForSI=res;
            console.log(this.LoanDetailsForSI);
            
          }
        })
        this.svc.addUpdDel<any>(`Loan/GetLoanAgent?loan_id=${loan_id}`, null).subscribe(
        res => {
          if(res){
            this.LoanAgentDetailsForSI=res;
            console.log(this.LoanAgentDetailsForSI);

          }
        })


    
  }


}
