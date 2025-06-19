import { Component, OnInit, ViewChild,  TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { mm_customer } from 'src/app/bank-resolver/Models';
import { SystemValues } from '../../Models/SystemValues';
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { mm_acc_type } from 'src/app/bank-resolver/Models/deposit/mm_acc_type';
import { mm_instalment_type } from 'src/app/bank-resolver/Models/loan/mm_instalment_type';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { exit } from 'process';
import { tm_deposit } from 'src/app/bank-resolver/Models/tm_deposit';


import { p_loan_param } from 'src/app/bank-resolver/Models/loan/p_loan_param';
import Utils from 'src/app/_utility/utils';
import { m_acc_master, MessageType, mm_customer, ShowMessage, td_def_trans_trf } from 'src/app/bank-resolver/Models';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { sm_parameter } from 'src/app/bank-resolver/Models/sm_parameter';
import { tm_transfer } from '../../Models/deposit/tm_transfer';


@Component({
  selector: 'app-view-borrowing',
  templateUrl: './view-borrowing.component.html',
  styleUrls: ['./view-borrowing.component.css']
})
export class ViewBorrowingComponent implements OnInit {

  constructor(private svc: RestService,
    private modalService: BsModalService,
    private router: Router,
    private msg: InAppMessageService,

) { }
@ViewChild('MakerChecker', { static: true }) MakerChecker: TemplateRef<any>;
@ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;
actDesc:any;
SecaccNum:any;
SecaccCD:any;
branchCode = '0';
createUser = '';
updateUser = '';
operationType = '';
disableAll = 'N';
// disablePersonal ='Y';
custNameForAcc:any;
// createDate: Date;
updateDate: Date;
newtm_deposit:any;
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


systemParam: sm_parameter[] = [];
penalIntt:number;

// showAlert = false;
// alertMsg: string;
// alertMsgType: string;
accName:boolean
CustomerName:any;
suggestedCustomer: mm_customer[];
suggestedJointCustomer: mm_customer[];
suggestedCustomerJointHolderIdx: number;
kycEnable = false;
allLoanDtls:any=[]
masterModel = new LoanOpenDM();
tm_loan_all = new tm_loan_all();



tm_deposit = new tm_deposit();
td_deftrans = new td_def_trans_trf();
td_deftranstrfList: td_def_trans_trf[] = [];
tm_transferList: tm_transfer[] = [];
tm_transfer: tm_transfer[] = [];
allUnApproveData:any[]=[];
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

repaymentFormulaList = [
{ id: 1, val: 'EMI' },
{ id: 2, val: 'REDUCING' },
];

modalRef: BsModalRef;
config = {
keyboard: false, // ensure esc press doesnt close the modal
backdrop: true, // enable backdrop shaded color
ignoreBackdropClick: true // disable backdrop click to close the modal
};
createUser1:any;
logUser:any;
branch:any=[];
branch1:any=[];
bankData:any=[];
acc_master: m_acc_master[] = [];
acc_master1: m_acc_master[] = [];
hidegl:boolean=true;
glHead:any;
glcdHide:boolean=false;
selectedCust: any;
cashAccCd: number;
filterData:any
currISODate:any
transferTypeList = [
  { trf_type: 'C', trf_type_desc: 'Cash' },
  { trf_type: 'T', trf_type_desc: 'Transfer' }];

transferTypeListTemp = this.transferTypeList;
ngOnInit(): void {
this.operationType ='R'
this.getsystemParam();
this.logUser=localStorage.getItem('itemUX');
this.branchCode = this.sys.BranchCode;
this.createUser = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
// this.sys.CurrentDate = this.sys.CurrentDate;
this.updateUser = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
this.updateDate = this.sys.CurrentDate;
setTimeout(() => {
// this.getCustomerList();
this.getAccountTypeList();
this.getInstalmentTypeList();

}, 150);

this.initializeModels();
this.newAccount();
this.getBankName();
this.getBranchName();
this.cashAccCd = this.sys.CashAccCode;

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
 getBranchName(){
  this.branch=null
  var dt = {
    "ardb_cd": this.sys.ardbCD,
    "bank_cd":this.tm_loan_all.party_cd
  }
  this.svc.addUpdDel<any>('Mst/GetBranchInvMaster', dt).subscribe(
    res => {
      this.branch=res
       console.log(this.branch)
       
     })
  
 }
 setBankName(val: number){
  console.log(val);
  this.branch=null
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "bank_cd":this.tm_loan_all.party_cd
    }
    this.svc.addUpdDel<any>('Mst/GetBranchInvMaster', dt).subscribe(
      res => {
        this.branch=res
         console.log(this.branch)
         
       })
  // this.tm_deposit.branch_cd=null
  
  }
  setTransType(tt: any) {
    // this.transTypeFlg = val;

    
    
    this.td_deftrans.trf_type = tt;
    this.td_deftrans.trf_type_desc = this.transferTypeList.filter(x => x.trf_type.toString() === tt)[0].trf_type_desc;
     console.log(this.td_deftranstrfList);
     this.masterModel.tmtransfer=this.tm_transferList
     console.log(this.tm_transferList);
     
  }
  checkAndSetDebitAccType(tfrType: string, tdDefTransTrnsfr: td_def_trans_trf) {

    if (tfrType === 'gl_acc') {
      if (tdDefTransTrnsfr.gl_acc_code === undefined ||
        tdDefTransTrnsfr.gl_acc_code === null ||
        tdDefTransTrnsfr.gl_acc_code === '') {
        tdDefTransTrnsfr.gl_acc_desc = null;
        return;
      }

      if (tdDefTransTrnsfr.gl_acc_code === this.cashAccCd.toString()) {
        // this.showAlertMsg('WARNING', 'GL Code can not be Cash Account Code');
        this.HandleMessage(true, MessageType.Warning, 'GL Code can not be Cash Account Code');
        return;
      }


      // tdDefTransTrnsfr.acc_cd = Number(tdDefTransTrnsfr.gl_acc_code);

      if (tdDefTransTrnsfr.cust_acc_type === undefined ||
        tdDefTransTrnsfr.cust_acc_type === null ||
        tdDefTransTrnsfr.cust_acc_type === '') {
          debugger
        // if (this.acc_master === undefined || this.acc_master === null || this.acc_master.length === 0) {
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
                 debugger;
                console.log(res)
                if(this.operationType=='R'){
                  debugger
                  this.acc_master=null
                  this.hidegl=true;
                }
                else{
                  debugger
                this.hidegl=false;
                }
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
                tdDefTransTrnsfr.gl_acc_desc = this.acc_master.filter(x => x.acc_cd.toString().includes(tdDefTransTrnsfr.gl_acc_code) || x.acc_name.toString().includes(tdDefTransTrnsfr.gl_acc_code))[0].acc_name;
                // tdDefTransTrnsfr.gl_acc_desc = temp_acc_master.acc_name;
                tdDefTransTrnsfr.trf_type = this.td_deftrans.trf_type;
                console.log( tdDefTransTrnsfr.trans_type, tdDefTransTrnsfr.gl_acc_desc);
                // if(this.operationType=='U' || this.td_deftranstrfList[0].trans_type=='T'){
                //   this.hidegl=true;
                // }
              // }
            },
            err => {

              this.isLoading = false;
            }
          )
        
        // else {
          
        //   let temp_acc_master = new m_acc_master();
        //   var dt={
        //     "ardb_cd":this.sys.ardbCD
        //   }
        //   this.svc.addUpdDel<any>('Mst/GetAccountMaster', dt).subscribe(
        //     res => {
        //        this.acc_master = res;
        //       })
        //   temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === this.td_deftranstrfList[0].gl_acc_code)[0];
        //   debugger
        //   if (temp_acc_master === undefined || temp_acc_master === null) {
        //     this.td_deftranstrfList[0].gl_acc_desc = null;
        //     this.HandleMessage(true, MessageType.Warning, 'GL Code and Account Type can not have value simultaneously');
        //     return;
        //   }
        //   else {
        //     this.td_deftranstrfList[0].gl_acc_desc = temp_acc_master.acc_name;
        //   }
        // }
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
    // if( this.td_deftranstrfList[0].amount==null && this.td_deftranstrfList[0].amount==undefined){
    //   this.HandleMessage(true, MessageType.Warning, 'Amount in Transfer Details can not be blank');

    // }
    
    
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
this.masterModel.tddeftrans = this.td_deftrans;
this.masterModel.tddeftranstrf = this.td_deftranstrfList;
this.masterModel.tmtransfer = this.tm_transferList;
}
assignModelsFromMasterData() {
  this.setLoanAccountType(this.tm_loan_all.acc_cd);

// const loan = new tm_loan_all();
// this.tm_loan_all = loan;
// this.tm_loan_all = this.masterModel.tmloanall;
// const trfList = new td_def_trans_trf();
// this.td_deftrans = trfList;
// this.td_deftrans = this.masterModel.tddeftrans;
// const depTrans = new td_def_trans_trf();
// this.td_deftranstrfList[0] = depTrans;
// this.td_deftranstrfList[0] = this.masterModel.tddeftranstrf[0];
// const tm_deftranstrf = new tm_transfer();
// this.tm_transferList[0]=tm_deftranstrf;
// this.tm_transferList[0]=this.masterModel.tmtransfer[0];
// this.setInstalPeriod(this.tm_loan_all.piriodicity);
// this.setRepaymentFormula(this.tm_loan_all.emi_formula_no);
// for (let i = 0; i < this.td_deftranstrfList.length; i++) {
//   if (this.td_deftranstrfList[i].acc_num === '0000') {
//     this.td_deftranstrfList[i].gl_acc_code = this.td_deftranstrfList[i].acc_type_cd.toString();
//     this.checkAndSetDebitAccType('gl_acc',this.td_deftranstrfList[i]);
//   }

// }

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

if (this.accountTypeList.length > 0) {
return;
}
this.accountTypeList = [];

this.isLoading = true;
this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
res => {

this.isLoading = false;
this.accountTypeList = res;
this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'B');
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


public suggestJointCustomer(idx: number): void {
this.isLoading=true;
this.suggestedCustomerJointHolderIdx = idx;


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



}



public setInstalPeriod(instlType: string): void {

this.tm_loan_all.piriodicity = instlType;
this.tm_loan_all.instalmentTypeDesc = this.instalmentTypeList.filter(x => x.desc_type.toString() === instlType)[0].ins_desc;
}


public setRepaymentFormula(formula: number): void {

this.tm_loan_all.emi_formula_no = Number(formula);
this.tm_loan_all.emiFormulaDesc = this.repaymentFormulaList.filter(x => x.id.toString() === formula.toString())[0].val;
}



getSanctionAmountAndValidity(loan_param: p_loan_param, idx: number): any {

let temp_p_loan_param = new p_loan_param();
temp_p_loan_param.ardb_cd=this.sys.ardbCD
this.isLoading = true;
this.svc.addUpdDel<any>('Loan/PopulateCropAmtDueDt', loan_param).subscribe(
res => {

temp_p_loan_param = res;
this.isLoading = false;
},
err => {
this.isLoading = false;

}
);
return temp_p_loan_param;
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
// this.GetUnapprovedDepTrans();
// this.disablePersonal = 'Y';

// this.isLoading = true;
// this.getCustomerList();
}

clearData() {
  this.disableAll = 'N'
this.operationType = 'R';
this.disableLoanId=true
// this.closeAlertMsg();
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
this.SecaccCD=false;
this.newtm_deposit=null;

}


modifyData() {
    debugger
    console.log(this.operationType)
      if (this.operationType !== 'R') {
      this.HandleMessage(true, MessageType.Warning, 'Record not retrived to modify');
      return;
      }
     this.operationType = 'U';
    // this.disableAll = 'N';

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
this.tm_loan_all.created_dt = this.sys.CurrentDate;
this.tm_loan_all.approval_status = 'U';

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
this.tm_loan_all.modified_dt = this.updateDate;
this.tm_loan_all.approval_status = 'U';
this.UpdateLoanAccountOpeningData(saveType);
}

}
}

GetLoanAccountNumberAndInsertData() {
this.ValidateLoanOpenHeaderData();     // Validation for Loan Account Header
// this.ValidateLoanUpdateData();     // Validation for Loan Account Child
this.p_gen_param.brn_cd = this.branchCode;
this.isLoading = true;
this.masterModel.tmloanall=this.tm_loan_all;
this.masterModel.tddeftrans=this.td_deftrans;
this.masterModel.tddeftranstrf=this.td_deftranstrfList;
this.masterModel.tmtransfer=this.tm_transferList;
debugger
this.svc.addUpdDel<any>('Borrowing/InsertBorrowingOpeningData', this.masterModel).subscribe(
res => {
// debugger;
let val = '';
this.isLoading = false;
val = res;
if (val === '' || val == null) {
// this.showAlertMsg('ERROR', 'Loan Account Number not created !!');
this.HandleMessage(true, MessageType.Error, 'Borrowing Account not created !!');
return;
}
else{
this.HandleMessage(true, MessageType.Sucess, 'Borrowing Account Created Successfully. BorrowingId: ' + this.tm_loan_all.loan_id);
this.td_deftrans.trans_cd = Number(val);
}


// this.masterModel.tmguaranter = null;
// this.masterModel.tdaccholder = null;
// this.masterModel.tmlaonsanction = null;
// this.masterModel.tmlaonsanctiondtls = null;

// this.InsertLoanAccountOpeningData();
},
err => {
this.isLoading = false;
// this.showAlertMsg('ERROR', 'Loan Account Number not created !!!');
this.HandleMessage(true, MessageType.Error, 'Borrowing Account not created !!!');

}

);
}

// InsertLoanAccountOpeningData() {
// debugger;
// this.masterModel.tmloanall.approval_status = 'U';


// this.isLoading = true;
// this.svc.addUpdDel<any>('Loan/InsertLoanAccountOpeningData', this.masterModel).subscribe(
// res => {
// // debugger;
// this.isLoading = false;
// // this.disablePersonal = 'Y';
// this.operationType = 'U';
// // this.showAlertMsg('INFORMATION', 'Loan Account Created Successfully. LoanId: ' + this.tm_loan_all.loan_id);
// this.HandleMessage(true, MessageType.Sucess, 'Loan Account Created Successfully. LoanId: ' + this.tm_loan_all.loan_id);
// },
// err => {
// // debugger;
// this.isLoading = false;
// console.error('Error on SaveClick' + JSON.stringify(err));
// // this.showAlertMsg('ERROR', 'Record Not Saved !!!');
// this.HandleMessage(true, MessageType.Error, 'Record Not Saved !!!');

// }
// );
// }


UpdateLoanAccountOpeningData(saveType: string) {
  this.ValidateLoanOpenHeaderData()
debugger;
this.isLoading = true;
this.svc.addUpdDel<any>('Borrowing/UpdateBorrowingOpeningData', this.masterModel).subscribe(
res => {
// debugger;
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
// private GetUnapprovedDepTrans(i:any): void {
//   this.isLoading = true;
//   this.td_deftrans.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
//   // this.td_deftrans.trans_type = 'B';
//   this.td_deftrans.ardb_cd = this.sys.ardbCD
//   this.svc.addUpdDel<any>('Borrowing/GetBorrowingDataView', this.td_deftrans).subscribe(
//     res => {
//       console.log(res);
//       this.allUnApproveData=res
//       if(this.allUnApproveData){
//         this.isLoading = false;
//       }
//       else{
//         this.HandleMessage(true, MessageType.Warning, 'No record found!!')
//       }
//       debugger
//     },
//     err => { this.isLoading = false; }
//   );
// }
getBorrowing(e:any){
if(e.target.value.length>0 && this.operationType == 'R')
{ 
  // this.allUnApproveData
  //   debugger
  //   for(let i=0;i<this.allUnApproveData.length;i++){
  //     if(this.allUnApproveData[i].acc_num==e.target.value){
  //       this.filterData=this.allUnApproveData[i]
  //     }
  //     debugger
  //   }
  //  this.filterData
   debugger
  
  
  // this.tm_loan_all.acc_cd=this.filterData.acc_type_cd;
    this.tm_loan_all.loan_id=e.target.value;
    this.tm_loan_all.ardb_cd=this.sys.ardbCD;
  // this.tm_loan_all.brn_cd=this.sys.BranchCode;
  // this.tm_loan_all.trans_cd=this.filterData.trans_cd;
  // this.tm_loan_all.trans_dt=this.filterData.trans_dt;
  this.getBorrowingCall();
}
else{
  this.HandleMessage(true, MessageType.Warning, 'No record found!!')
}

console.log(this.disableLoanId)

}
getBorrowingCall(){
  debugger
this.svc.addUpdDel<any>('Borrowing/GetBorrowingDataView', this.tm_loan_all).subscribe(
res => {
debugger
this.isLoading = false;
// this.masterModel.tmloanall = res;
this.tm_loan_all=res;
// if (this.masterModel.tmloanall){
// const inputString=this.masterModel.tmloanall.created_by
// const parts = inputString.split('/');
// if (parts.length > 0) {
//   const result = parts[0];
//   this.createUser1=result;
//   console.log(result); // This will output: username
// } else {
//   this.createUser1="no"
//   console.log("No '/' found in the string.");
// }
// }
console.log(res)
if (this.tm_loan_all.acc_cd==0) {
  this.HandleMessage(true, MessageType.Warning, 'No record found!!')
this.clearData();
return
}
else {
if (res) {
  this.allLoanDtls=[]
  this.assignModelsFromMasterData();
  this.operationType = 'R';
  this.disableAll = 'Y';
}
else {
  if(this.operationType = 'R'){
    this.HandleMessage(true, MessageType.Warning, 'No record found!!!');
  }
  else{return}
  
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
setTdDepTrans(){
  this.td_deftrans.acc_cd=this.tm_loan_all.acc_cd;
  this.td_deftrans.acc_num=this.tm_loan_all.loan_id;
  this.td_deftrans.acc_type_cd=this.tm_loan_all.acc_cd;
  this.td_deftrans.amount=this.tm_loan_all.disb_amt;
  this.td_deftrans.approval_status='U';
  this.td_deftrans.brn_cd=this.tm_loan_all.brn_cd;
  this.td_deftrans.created_by=this.tm_loan_all.created_by;
  this.td_deftrans.created_dt=this.tm_loan_all.created_dt;
  this.td_deftrans.particulars=this.td_deftranstrfList[0].particulars;
  this.td_deftrans.remarks=this.td_deftranstrfList[0].particulars;
  this.td_deftrans.trans_type='B'
  this.td_deftrans.trans_dt=this.sys.CurrentDate;
  this.td_deftrans.trans_mode='W';
  this.td_deftrans.tr_acc_cd=10000;
debugger
}
ValidateLoanOpenHeaderData() {
  this.setTdDepTrans();
if (this.tm_loan_all.loan_id === null || this.tm_loan_all.loan_id === undefined ||
this.tm_loan_all.party_cd === null || this.tm_loan_all.party_cd === undefined ||
this.tm_loan_all.loan_acc_type === null || this.tm_loan_all.loan_acc_type === undefined ||
// this.tm_loan_all.loan_acc_no === null || this.tm_loan_all.loan_acc_no === undefined ||
this.tm_loan_all.instl_start_dt === null || this.tm_loan_all.instl_start_dt === undefined ||
this.tm_loan_all.curr_intt_rate === null || this.tm_loan_all.curr_intt_rate === undefined ||
this.tm_loan_all.ovd_intt_rate === null || this.tm_loan_all.ovd_intt_rate === undefined ||
this.tm_loan_all.instl_no === null || this.tm_loan_all.instl_no === undefined ||
this.tm_loan_all.piriodicity === null || this.tm_loan_all.piriodicity === undefined ||
this.tm_loan_all.emi_formula_no === null || this.tm_loan_all.emi_formula_no === undefined||
this.tm_loan_all.disb_amt === null || this.tm_loan_all.disb_amt === undefined) {
// this.showAlertMsg('WARNING', 'Please provide all the required data in Personal Information');
this.HandleMessage(true, MessageType.Warning, 'Please provide all the required data in BORROWING Information');
exit(0);
}
if (this.td_deftrans.trf_type === 'T') {

  this.td_deftranstrfList[0].acc_cd = this.td_deftranstrfList[0].gl_acc_code;
  this.td_deftranstrfList[0].acc_type_cd = this.td_deftranstrfList[0].gl_acc_code;
  this.td_deftranstrfList[0].trans_type='D'
  this.td_deftranstrfList[0].acc_num = '0000';
  this.td_deftranstrfList[0].tr_acc_cd = 10000;
  this.td_deftranstrfList[0].particulars = 'BY BORROWING DISBURSEMENT';
  this.td_deftranstrfList[0].approval_status = 'U';
  this.td_deftranstrfList[0].brn_cd = this.branchCode;
  this.td_deftranstrfList[0].trans_dt = this.sys.CurrentDate;
  this.td_deftranstrfList[0].created_by = this.createUser;
  // this.td_deftranstrfList[0].amount = ;

      this.tm_transferList[0].brn_cd = this.branchCode;
      this.tm_transferList[0].trf_dt = this.sys.CurrentDate;
      this.tm_transferList[0].approval_status = 'U';
      if (this.operationType === 'N') {
        this.tm_transferList[0].created_by = this.createUser;
        this.tm_transferList[0].created_dt = this.sys.CurrentDate;
      }
      else{
        this.td_deftranstrfList[0].modified_by= this.createUser;
        this.td_deftranstrfList[0].modified_dt = this.sys.CurrentDate;
      }
}
this.masterModel.tmloanall=this.tm_loan_all;
this.masterModel.tddeftrans=this.td_deftrans;
this.masterModel.tddeftranstrf=this.td_deftranstrfList;
this.masterModel.tmtransfer=this.tm_transferList;
}



setValidityDate(idx: number) {

const dt = this.sys.CurrentDate;
dt.setMonth(dt.getMonth() + 2);
dt.setDate(0);

// var dt= new Date( this.sys.CurrentDate.getFullYear() , this.sys.CurrentDate.getMonth() + 2 , 0);

this.masterModel.tmlaonsanctiondtls[idx].due_dt = dt;
}

checkAndSetOverdueInterest() {
if(this.tm_loan_all.curr_intt_rate>100){
this.HandleMessage(true, MessageType.Warning, 'Interest rate should be lower than 100%');
this.tm_loan_all.curr_intt_rate = 0;
this.tm_loan_all.ovd_intt_rate = 0;
}
else{
this.tm_loan_all.ovd_intt_rate = this.tm_loan_all.curr_intt_rate + this.penalIntt;

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

private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
this.showMsg = new ShowMessage();
this.showMsg.Show = show;
this.showMsg.Type = type;
this.showMsg.Message = message;

}


public closeAlertMsg() {

this.HandleMessage(false);
this.disableAll = 'N';
}


backScreen() {
this.router.navigate([this.sys.BankName + '/la']);
}

getAccountData() {
debugger
for (const i in this.masterModel.tdloansancsetlist) {
for (const j in this.masterModel.tdloansancsetlist[i].tdloansancset) {
if(this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_cd == '115'){
this.SecaccCD=this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value
}
if(this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_cd == '116'){
this.SecaccNum=this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value
}
}
}
if(this.SecaccNum){
const usr = new tm_deposit();
usr.ardb_cd=this.sys.ardbCD
usr.brn_cd = this.sys.BranchCode;
usr.acc_type_cd= this.SecaccCD
usr.acc_num = this.SecaccNum


this.isLoading = true;
this.svc.addUpdDel<any>('Deposit/GetAccountOpeningData', usr).subscribe(
res => {
console.log(res);
this.newtm_deposit = new tm_deposit();
//  this.custNameForAcc=this.comserv.customerList.forEach(element =>element.cust_cd===Number(res.tm_deposit.cust_cd))
// console.log(this.comserv.customerList);

debugger;
this.isLoading = false;

if (res === undefined || res === null) {
  // this.showAlertMsg('WARNING', 'No record found!!');
  this.HandleMessage(true, MessageType.Warning, 'No Account Details found!!');
}
else {
  if (res.tmdeposit.acc_num !== null) {
    if(res.tmdeposit.lock_mode=='L'){
      for (const i in this.masterModel.tdloansancsetlist) {
        for (const j in this.masterModel.tdloansancsetlist[i].tdloansancset) {
          if(this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_cd == '115'){
            this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value=null
          }
          if(this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_cd == '116'){
           this.masterModel.tdloansancsetlist[i].tdloansancset[j].param_value=null
          }
        }
      }
      this.HandleMessage(true, MessageType.Warning, 'this Account is already added into another loan security');
    }
    else{
      this.newtm_deposit=res.tmdeposit;
      console.log(this.newtm_deposit);
      this.getCustomer();
    }
  }
  else {
    // this.showAlertMsg('WARNING', 'No record found!!!');
    this.HandleMessage(true, MessageType.Warning, 'No record found for getting Account Details!!');
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
else{
return
}


}

getISODate(){
var inputDate = localStorage.getItem('__currentDate');
var parsedDate = new Date(inputDate);

parsedDate.setDate(parsedDate.getDate()-1);
parsedDate.setHours(18);
parsedDate.setMinutes(30);
parsedDate.setSeconds(0);
parsedDate.setMilliseconds(0);
var isoDateString = parsedDate.toISOString();
this.currISODate=isoDateString
console.log(isoDateString);
}
public getCustomer() {
debugger
this.isLoading=true;
const prm = new p_gen_param();
// prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
prm.as_cust_name = this.newtm_deposit.cust_cd.toString();
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
}
