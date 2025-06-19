import { Router } from '@angular/router';
import { InvOpenDM } from '../../../../Models/deposit/InvOpenDM';
import { Component,  Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestService, InAppMessageService } from 'src/app/_service';
import {
  MessageType, mm_acc_type, mm_customer,
  mm_operation, m_acc_master, ShowMessage, SystemValues,
  td_def_trans_trf, tm_deposit
} from '../../../../Models';
import { tm_denomination_trans } from '../../../../Models/deposit/tm_denomination_trans';
import { DatePipe } from '@angular/common';
import { tm_transfer } from '../../../../Models/deposit/tm_transfer';
import { tt_denomination } from '../../../../Models/deposit/tt_denomination';
import { mm_constitution } from '../../../../Models/deposit/mm_constitution';
import Utils from 'src/app/_utility/utils';
import { p_gen_param } from '../../../../Models/p_gen_param';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { mm_oprational_intr } from '../../../../Models/deposit/mm_oprational_intr';

import { Subscription } from 'rxjs';
import { InvTranServService } from '../inv-tran-serv.service';
import { HttpClientModule } from '@angular/common/http';
import { InvestmentTransactionsComponent } from '../investment-transactions.component';
@Component({
  selector: 'app-cc-trans',
  templateUrl: './cc-trans.component.html',
  styleUrls: ['./cc-trans.component.css']
})
export class CcTransComponent implements OnInit {
  acc_close_dt:Date;
  voucher_dt:Date;
  isOpenODT:boolean=false;
  isOpenVDT:boolean=false;
  clickSave:Subscription
  manualInterestPut:boolean=false;
  isLoading: boolean;
  showIns:boolean=true;
  showPTrns:boolean=true;
  accDtlsFrm: FormGroup;
  tdDefTransFrm:FormGroup;
  tdDefTransFrmC:FormGroup;
  td_deftranstrfList: td_def_trans_trf[] = [];
  tm_denominationList: tm_denomination_trans[] = [];
  denominationList: tt_denomination[] = [];
  constitutionList: mm_constitution[] = [];
  static operationalInstrList: mm_oprational_intr[] = [];
  interestPeriod=0
  sys = new SystemValues();
  AcctTypes: mm_operation[];
  bankData=[];
  branch:any=[];
  branch1:any=[];
  masterModel = new InvOpenDM();
  tm_deposit = new tm_deposit();
  @Input() showTranDtlRe:boolean;
  @Input() showTranDtlCl:boolean;
  @Input() editDeleteMode:boolean;
  // @Input() showOnClose:boolean;
  get td() { return this.tdDefTransFrm.controls; }
  // get tc() { return this.tdDefTransFrmC.controls; }
  @ViewChild('preClose', { static: true }) preClose: TemplateRef<any>;
  modalRefClose: BsModalRef;
  suggestedCustomerCr: mm_customer[];
  disabledTrfOnNull = true
  indxsuggestedCustomerCr = 0;
  selectedCust: any;
  TrfTotAmt = 0;
  diff: any;
  effInt:any;
  isMat: any;
  showtransdetails:boolean=false;
  tddefAccTypCd: any;
  accountTypeList: mm_acc_type[] = [];
  acc_master: m_acc_master[] = [];
  acc_master1: m_acc_master[] = [];
  hidegl:boolean=true;
  glHead:any;
  showBalance:boolean=false;
  // public accNoEnteredForTransaction2:any=this.invComServ.accNoEnteredForTransaction2;......MARKAR
  public accNoEnteredForTransaction2:any;
  public accNoEnteredForTransaction:any;
  public accNoEnteredForTransaction3:any;
  showTransModeForR:boolean
  showMsg: ShowMessage;
  mat_val = 0;
  counter1 = 0;
  counter = 0;
  newIntt=0;
  public static operations: mm_operation[] = []
  operations: mm_operation[];
  resBrnCd: any;
  remarks: any;
  ShowHide:boolean=false;
  closeInt: any;
  showOnTDS:boolean=false;
  exeintt:number=0
  constructor(public invComServ:InvTranServService ,private svc: RestService, private msg: InAppMessageService,
    private frmBldr: FormBuilder, public datepipe: DatePipe, private router: Router,
    private modalService: BsModalService, private http:HttpClientModule, public i_trans:InvestmentTransactionsComponent) {
      this.clickSave=this.invComServ.getSave().subscribe(()=>{

        this.onSaveClick();
      })
      this.accNoEnteredForTransaction2=this.invComServ.masterModel.tddeftrans;
      this.accNoEnteredForTransaction3=this.invComServ.masterModel.tmdepositInv;
     }

  ngOnInit(): void {
    this.masterModel=this.invComServ.masterModel;
    if(this.editDeleteMode){
      this.acc_close_dt = this.masterModel.tddeftrans.instl_start_dt;
      this.voucher_dt = this.masterModel.tddeftrans.voucher_dt;
    }
    else{
      this.acc_close_dt = this.sys.CurrentDate;
      this.voucher_dt = this.sys.CurrentDate;
    }
    if(this.editDeleteMode==true && this.accNoEnteredForTransaction2.trans_mode=='R'){
      this.accNoEnteredForTransaction=this.masterModel.tmdepositrenewInv;
    }
   
    else{
      this.accNoEnteredForTransaction=this.masterModel.tmdepositInv;

    }
    
    if (this.invComServ.saveVar==undefined) {    
      this.invComServ.saveVar = this.invComServ.    
      callSave.subscribe((name:string) => {
        console.log(this.editDeleteMode);
        debugger    
        this.onSaveClick();  
      }); 
    }
    if (this.invComServ.deleteVar==undefined) {  
      this.invComServ.deleteVar = this.invComServ.    
      callDelete.subscribe((name:string) => {
        console.log(this.accNoEnteredForTransaction2);
        console.log(this.masterModel);
        debugger    
        this.onDeleteClick()});
    } 
    if (this.invComServ.resetVar==undefined) {  
      this.invComServ.resetVar = this.invComServ.    
      callReset.subscribe((name:string) => {
        debugger    
        this.onResetClick()});
    }
    
     this.showTranDtlRe=this.invComServ.showTranDtlRe;
     this.showTranDtlCl=this.invComServ.showTranDtlCl;
    console.log(this.showTranDtlRe,this.showTranDtlCl);
    
    this.accDtlsFrm = this.frmBldr.group({
      opening_dt: [''],
      constitution_cd: [''],
      constitution_cd_desc:[''],
      oprn_instr_cd: [''],
      oprn_instr_desc:[''],
      intt_trf_type: [''],
      intt_rt: [''],
      prn_amt: [''],
      intt_amt: [''],
      dep_period: [''],
      dep_period_y:[''],
      dep_period_m:[''],
      dep_period_d:[''],
      mat_dt: [''],
      mat_amt: [''],
      bank_nm: [''],
      branch_nm: ['']

    })
    this.tdDefTransFrm = this.frmBldr.group({
      trans_dt: [''],
      trans_cd:[''],
      acc_type_cd:[''],
      acc_type_desc:[''],
      acc_num:[''],
      trans_type:[''],
      trans_mode1:[''],
      trans_mode:[''],
      trans_type_key:[''],
      trf_type:[''],
      amount:[''],
      balance:[''],
      opening_dt: [''],
      constitution_cd: [''],
      constitution_cd_desc:[''],
      oprn_instr_cd: [''],
      oprn_instr_desc:[''],
      intt_trf_type: [''],
      intt_rate: [''],
      interest:[''],
      prn_amt: [''],
      intt_amt: [''],
      dep_period: [''],
      dep_period_y:[''],
      dep_period_m:[''],
      dep_period_d:[''],
      mat_dt: [''],
      mat_amt: [''],
      particulars: [''],
      curr_intt_recov:[''],
      ovd_intt_recov:[''],
      curr_prn_recov:[''],
      bank_cd:[''],
      branch_cd:[''],
      approval_status: [''],
      mat_val:[''],
      voucher_dt:[this.voucher_dt],
      prev_prn_amt:[0],
      prev_intt_amt:[0]

    })
    this.tdDefTransFrmC = this.frmBldr.group({
      trans_dt: [''],
      trans_cd:[''],
      acc_type_cd:[''],
      acc_type_desc:[''],
      acc_close_dt:[this.acc_close_dt],
      acc_num:[''],
      trans_type:[''],
      trans_mode1:[''],
      trans_mode:[''],
      trans_type_key:[''],
      trf_type:[''],
      amount:[''],
      balance:[''],
      opening_dt: [''],
      constitution_cd: [''],
      constitution_cd_desc:[''],
      oprn_instr_cd: [''],
      oprn_instr_desc:[''],
      intt_trf_type: [''],
      intt_rate: [''],
      interest:[''],
      prn_amt: [''],
      intt_amt: [''],
      mat_dt: [''],
      mat_amt: [''],
      particulars: [''],
      curr_intt_recov:[''],
      ovd_intt_recov:[''],
      curr_prn_recov:[''],
      bank_cd:[''],
      branch_cd:[''],
      approval_status: [''],
      matVal:[''],
      penal_rt:[''],
      eff_intt:[0],
      voucher_dt:[this.voucher_dt],
    })
    this.showMsg = null;
     this.getOperationMaster();
    this.setAccDtlsFrmForm();
    if(this.editDeleteMode && this.accNoEnteredForTransaction2.trans_mode=='R'){
      this.setTrnsDtlsFrmForm();
      this.showTranDtlRe=true;
      this.showTranDtlCl=false;
      this.invComServ.showTranDtlRe=true;
      this.invComServ.showTranDtlCl=false;
      debugger
    }
    if(this.editDeleteMode && this.accNoEnteredForTransaction2.trans_mode=='C'){
      // this.setTrnsDtlsCloseFrm()
      this.onCloseSelect()
      this.showTranDtlRe=false;
      this.showTranDtlCl=true;
      this.invComServ.showTranDtlRe=false;
      this.invComServ.showTranDtlCl=true;
      // this.showtransdetails=true;
      debugger}
    }
 public setAccDtlsFrmForm() {
      this.isLoading = false;
    
    console.log(this.invComServ.bankName,this.invComServ.branchName,this.invComServ.constitutionDes);
    
    debugger;

    if (undefined !== this.accNoEnteredForTransaction3 && Object.keys(this.accNoEnteredForTransaction3).length !== 0) {
      // this.resetAccDtlsFrmFormData();
      // if (this.accNoEnteredForTransaction.acc_type_cd === 2
      //   || this.accNoEnteredForTransaction.acc_type_cd === 3
      //   || this.accNoEnteredForTransaction.acc_type_cd === 4) {
      //   this.showInterestDtls = true;
      //   this.accNoEnteredForTransaction.ShowClose = true;
      // }
      if (this.accNoEnteredForTransaction3.acc_type_cd === 23) {
        debugger
        this.accNoEnteredForTransaction3.ShowClose = true;
      }
      const OprnInstrDesc = CcTransComponent.operationalInstrList.filter(e => e.oprn_cd
        === this.accNoEnteredForTransaction3.oprn_instr_cd)[0];

      let intrestType = '';
      this.interestPeriod=0
      if (this.accNoEnteredForTransaction3.intt_trf_type === 'O') {
        intrestType = 'On Maturity';
        
      } else if (this.accNoEnteredForTransaction3.intt_trf_type === 'H') {
        intrestType = 'Half Yearly'; this.interestPeriod=2
      } else if (this.accNoEnteredForTransaction3.intt_trf_type === 'Q') {
        intrestType = 'Quarterly'; this.interestPeriod=4
      } else if (this.accNoEnteredForTransaction3.intt_trf_type === 'M') {
        intrestType = 'Monthly'; this.interestPeriod=12
      }
      // console.log(this.td.amount.value)
      // console.log(this.accNoEnteredForTransaction.intt_trf_type=='H' || this.accNoEnteredForTransaction.intt_trf_type=='Q'? this.td.amount.value :this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt)
      
      console.log(this.accDtlsFrm);
      console.log(this.accNoEnteredForTransaction);
      console.log(this.accNoEnteredForTransaction2);
      console.log(this.accNoEnteredForTransaction3);
      this.invComServ.getConstitutionList();
      debugger
      this.accDtlsFrm.patchValue({
        
        // brn_cd: this.accNoEnteredForTransaction.brn_cd,
        // acc_type_cd: this.accNoEnteredForTransaction.acc_type_cd,
        // acc_num: this.accNoEnteredForTransaction.acc_num,
        // renew_id: this.accNoEnteredForTransaction.renew_id,
        // cust_cd: this.accNoEnteredForTransaction.cust_cd,
        // cust_name: this.accNoEnteredForTransaction.cust_name,
        intt_trf_type: intrestType,
        // constitution_cd: this.accNoEnteredForTransaction.constitution_cd,
        // constitution_cd_desc: (undefined !== constitution && null !== constitution
        //   && undefined !== constitution.constitution_desc && null !== constitution.constitution_desc) ?
        //   constitution.constitution_desc : null,
        // oprn_instr_cd: this.accNoEnteredForTransaction.oprn_instr_cd,
        oprn_instr_desc: this.invComServ.operInsDESC,
        oprn_instr_cd: this.invComServ.operInsCD,

        opening_dt: this.accNoEnteredForTransaction3.opening_dt.toString().substr(0, 10),
        constitution_cd_desc:this.invComServ.constitutionDes,
        constitution_cd:this.invComServ.constitutionCd,

        prn_amt: this.accNoEnteredForTransaction3.prn_amt,
        intt_amt: this.accNoEnteredForTransaction3.intt_amt,
        // mat_amt:this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt,
        mat_amt: this.accNoEnteredForTransaction3.intt_trf_type === 'H'  ||this.accNoEnteredForTransaction3.intt_trf_type === 'Q'? this.accNoEnteredForTransaction3.prn_amt + this.interestPeriod*this.accNoEnteredForTransaction3.intt_amt : this.accNoEnteredForTransaction3.prn_amt + this.accNoEnteredForTransaction3.intt_amt,
        
        
        dep_period_y: null === this.accNoEnteredForTransaction3.dep_period ? ''
          : (this.accNoEnteredForTransaction3.dep_period.split(';')[0].split('=')[1]),
        dep_period_m: null === this.accNoEnteredForTransaction3.dep_period ? ''
          : (this.accNoEnteredForTransaction3.dep_period.split(';')[1].split('=')[1]),
        dep_period_d: null === this.accNoEnteredForTransaction3.dep_period ? ''
          : (this.accNoEnteredForTransaction3.dep_period.split(';')[2].split('=')[1]),
        instl_amt: this.accNoEnteredForTransaction3.instl_amt,
        instl_no: this.accNoEnteredForTransaction3.instl_no,
        mat_dt: this.accNoEnteredForTransaction3.mat_dt.toString().substr(0, 10),
        intt_rt: this.accNoEnteredForTransaction3.intt_rt,
        
        bank_nm:this.invComServ.bankName,
        branch_nm:this.invComServ.branchName
      });
    // this.getBranchName(this.accNoEnteredForTransaction.bank_name)

      console.log(this.accDtlsFrm.controls.mat_amt.value);
      console.log();
      

      
    } 
  }
  public setTrnsDtlsFrmForm() {
    this.tdDefTransFrm.controls.prev_prn_amt.setValue(this.accNoEnteredForTransaction.prn_amt);
    this.tdDefTransFrm.controls.prev_intt_amt.setValue(this.accNoEnteredForTransaction.intt_amt);
    debugger
    // if(this.masterModel.tmdepositInv.acc_status=='O'){
    //   this.editDeleteMode =false;
    // }else{this.editDeleteMode=true}........MARKAR
  // this.editDeleteMode = this.invComServ.editDeleteMode;
  console.log(this.editDeleteMode);

    this.isLoading = true;
    
   
  debugger;

  if (undefined !== this.accNoEnteredForTransaction && Object.keys(this.accNoEnteredForTransaction).length !== 0) {
    
    if (this.accNoEnteredForTransaction.acc_type_cd === 23) {
      this.accNoEnteredForTransaction.ShowClose = true;
    }
    const OprnInstrDesc = CcTransComponent.operationalInstrList.filter(e => e.oprn_cd
      === this.accNoEnteredForTransaction.oprn_instr_cd)[0];

    let intrestType = '';
    this.interestPeriod=0
    if (this.accNoEnteredForTransaction.intt_trf_type === 'O') {
      intrestType = 'On Maturity';
      
    } else if (this.accNoEnteredForTransaction.intt_trf_type === 'H') {
      intrestType = 'Half Yearly'; this.interestPeriod=2
    } else if (this.accNoEnteredForTransaction.intt_trf_type === 'Q') {
      intrestType = 'Quarterly'; this.interestPeriod=4
    } else if (this.accNoEnteredForTransaction.intt_trf_type === 'M') {
      intrestType = 'Monthly'; this.interestPeriod=12
    }
    let acc_desc=''
    if (this.accNoEnteredForTransaction.acc_type_cd ==22) {
      acc_desc = 'Fixed Deposit';
    }
    else if (this.accNoEnteredForTransaction.acc_type_cd ==23) {
      acc_desc = 'Term Deposit';
    }
    else if (this.accNoEnteredForTransaction.acc_type_cd ==24) {
      acc_desc = 'Special TD';
    }
    else if (this.accNoEnteredForTransaction.acc_type_cd ==25) {
      acc_desc = 'RD';
    }
    // console.log(this.td.amount.value)
    // console.log(this.accNoEnteredForTransaction.intt_trf_type=='H' || this.accNoEnteredForTransaction.intt_trf_type=='Q'? this.td.amount.value :this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt)
    
    console.log(this.accDtlsFrm);
    console.log(this.accNoEnteredForTransaction);
    console.log(this.accNoEnteredForTransaction2);//
    console.log(this.masterModel);
    console.log(this.showTranDtlRe);
    console.log(this.editDeleteMode);
    
    debugger
    this.tdDefTransFrm.patchValue({
      trans_dt: this.accNoEnteredForTransaction.trans_dt,
      trans_cd:this.editDeleteMode?this.accNoEnteredForTransaction2.trans_cd:'',
      acc_type_desc: acc_desc,
      acc_type_cd: this.accNoEnteredForTransaction.acc_type_cd,
      acc_num: this.accNoEnteredForTransaction.acc_num,
      trans_mode1:'Renewal',
      trans_mode:'R',
      amount:this.editDeleteMode?this.accNoEnteredForTransaction.prn_amt:this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt,
      // amount:this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt,
      // trans_type_key:'D',
      // trans_type:this.editDeleteMode?'Deposit',

      trf_type:this.editDeleteMode? this.accNoEnteredForTransaction2.trf_type:'',
      intt_trf_type: this.accNoEnteredForTransaction.intt_trf_type,
      curr_intt_recov:this.accNoEnteredForTransaction.intt_amt,
      opening_dt:this.editDeleteMode?this.accNoEnteredForTransaction.opening_dt.toString().substr(0, 10):this.datepipe.transform(this.sys.CurrentDate,"dd/MM/yyyy"), 
      constitution_cd_desc:this.invComServ.constitutionDes,
      constitution_cd:this.invComServ.constitutionCd,
      // mat_dt: this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10),
      ovd_intt_recov:this.masterModel.tddeftrans.ovd_intt_recov>0?this.masterModel.tddeftrans.ovd_intt_recov:0,
      curr_prn_recov:0,
      dep_period_y: null === this.accNoEnteredForTransaction.dep_period ? ''
        : (this.accNoEnteredForTransaction.dep_period.split(';')[0].split('=')[1]),
      dep_period_m: null === this.accNoEnteredForTransaction.dep_period ? ''
        : (this.accNoEnteredForTransaction.dep_period.split(';')[1].split('=')[1]),
      dep_period_d: null === this.accNoEnteredForTransaction.dep_period ? ''
        : (this.accNoEnteredForTransaction.dep_period.split(';')[2].split('=')[1]),
      particulars: this.accNoEnteredForTransaction.particulars,
      intt_rate: this.masterModel.tmdepositrenewInv.intt_rt,
      mat_amt: this.accNoEnteredForTransaction.intt_trf_type === 'H'  ||this.accNoEnteredForTransaction.intt_trf_type === 'Q'? this.accNoEnteredForTransaction.prn_amt + this.interestPeriod*this.accNoEnteredForTransaction.intt_amt : this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt,
      approval_status: this.accNoEnteredForTransaction.approval_status,
      bank_nm:this.invComServ.bankName,
      branch_nm:this.invComServ.branchName
    });
    // const mat_amt =this.editDeleteMode?this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTrsaction.intt_amt:this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt
    const mat_amt =(this.masterModel.tmdepositInv.prn_amt+this.masterModel.tmdepositInv.intt_amt)-Number(this.masterModel.tddeftrans.ovd_intt_recov>=0?this.masterModel.tddeftrans.ovd_intt_recov:0)
    console.log(mat_amt,this.td.amount.value);
    debugger
    if(Number(mat_amt)===Number(this.td.amount.value)){
      debugger
      this.tdDefTransFrm.patchValue({
        trans_type: 'Deposit',
        trans_type_key: 'D',
        balance:0
      })
      this.showBalance=false;
      this.td_deftranstrfList=[];
      this.showtransdetails=false;
    }
    else{
      debugger
      this.tdDefTransFrm.patchValue({
        trans_type: 'Withdraw',
        trans_type_key: 'W',
        //balance:this.editDeleteMode?0:this.accNoEnteredForTransaction2.amount,//this.accDtlsFrm.controls.intt_amt.value
        ovd_intt_recov:this.accNoEnteredForTransaction2.ovd_intt_recov,
        trf_type:'T'
      })
      this.showBalance=true
      this.showtransdetails=true;
      if(Number(this.td.amount.value)+Number(this.td.ovd_intt_recov.value)==Number(mat_amt)){
        this.showtransdetails=false;this.showBalance=false
        this.tdDefTransFrm.patchValue({balance:this.editDeleteMode?0:this.accNoEnteredForTransaction2.amount})
      }
      else{
        this.tdDefTransFrm.patchValue({balance:this.accNoEnteredForTransaction2.amount})

      }
      
    }
    
    if(this.editDeleteMode==true){
      if(this.accNoEnteredForTransaction2.trf_type=='T' && this.accNoEnteredForTransaction2.trans_type=='W'){
        debugger
        this.acc_master= this.invComServ.acc_master
        this.showtransdetails=true;
        this.addTransfer();
        console.log(this.invComServ.acc_master);
        console.log(this.acc_master);
        this.td_deftranstrfList=this.masterModel.tddeftranstrf;

        this.td_deftranstrfList[0].gl_acc_code = this.masterModel.tddeftranstrf[0].acc_cd;
        this.acc_master1= this.acc_master.filter(x => x.acc_cd.toString().includes(this.td_deftranstrfList[0].gl_acc_code));
        this.td_deftranstrfList[0].gl_acc_desc=this.acc_master1[0].acc_name;
        console.log(this.acc_master1);
        this.sumTransfer()
        console.log(this.td_deftranstrfList);
      }
      
    }
    this.onDepositePeriodChange();
    // this.getBranchName(this.accNoEnteredForTransaction.bank_name)
    this.isLoading=false;
    console.log(this.accDtlsFrm.controls.mat_amt.value);
    console.log();
    
    
  } 
}
applyTDS(){
  if(this.td.amount.value==this.accDtlsFrm.controls.mat_amt.value){
    // this.td.amount.setValue((this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt)-this.td.ovd_intt_recov.value)
    // this.accDtlsFrm.controls.mat_amt.setValue((this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt)-this.td.ovd_intt_recov.value)
    this.td.ovd_intt_recov.value>0?this.td.amount.setValue((this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt)-this.td.ovd_intt_recov.value):0
    this.td.ovd_intt_recov.value>0?this.accDtlsFrm.controls.mat_amt.setValue((this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt)-this.td.ovd_intt_recov.value):0

  debugger
  }
  else{
    
    this.td.ovd_intt_recov.value>0?this.td.balance.setValue(this.td.balance.value-this.td.ovd_intt_recov.value):0
  }
  debugger
}
applyTDSonclose(){
  debugger
  // if(this.isMat){
  //   this.tdDefTransFrmC.controls.matVal.setValue( Number(this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt)- Number(this.tdDefTransFrmC.controls.ovd_intt_recov.value))
  // }
  // else{
    this.tdDefTransFrmC.controls.matVal.setValue(( Number(this.tdDefTransFrmC.controls.amount.value)+Number(this.tdDefTransFrmC.controls.curr_intt_recov.value))- Number(this.tdDefTransFrmC.controls.ovd_intt_recov.value))

  
  // Number(this.tdDefTransFrmC.controls.ovd_intt_recov.value)>0?this.tdDefTransFrmC.controls.matVal.setValue( Number(this.tdDefTransFrmC.controls.matVal.value)- Number(this.tdDefTransFrmC.controls.ovd_intt_recov.value))
  // :this.isMat==false?Number(this.tdDefTransFrmC.controls.amount.value)+this.closeInt:this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt
  // console.log(this.tdDefTransFrmC.controls.trf_type.value);
  
  debugger
}
ChangeinttClose(){
 this.tdDefTransFrmC.controls.matVal.setValue(( Number(this.tdDefTransFrmC.controls.amount.value)+ Number(this.tdDefTransFrmC.controls.curr_intt_recov.value))-(Number(this.tdDefTransFrmC.controls.ovd_intt_recov.value)>0?this.tdDefTransFrmC.controls.ovd_intt_recov.value:0))
  debugger
}

public setTrnsDtlsCloseFrm(){
  console.log(this.editDeleteMode);

  this.isLoading = true;
  debugger;

if (undefined !== this.accNoEnteredForTransaction && Object.keys(this.accNoEnteredForTransaction).length !== 0) {
  
  if (this.accNoEnteredForTransaction.acc_type_cd === 23) {
    this.accNoEnteredForTransaction.ShowClose = true;
  }
  const OprnInstrDesc = CcTransComponent.operationalInstrList.filter(e => e.oprn_cd
    === this.accNoEnteredForTransaction.oprn_instr_cd)[0];

  let acc_desc=''
  if (this.accNoEnteredForTransaction.acc_type_cd ==22) {
    acc_desc = 'Fixed Deposit';
  }
  else if (this.accNoEnteredForTransaction.acc_type_cd ==23) {
    acc_desc = 'Term Deposit';
  }
  else if (this.accNoEnteredForTransaction.acc_type_cd ==24) {
    acc_desc = 'Special TD';
  }
  else if (this.accNoEnteredForTransaction.acc_type_cd ==25) {
    acc_desc = 'RD';
  }
  // console.log(this.td.amount.value)
  // console.log(this.accNoEnteredForTransaction.intt_trf_type=='H' || this.accNoEnteredForTransaction.intt_trf_type=='Q'? this.td.amount.value :this.accNoEnteredForTransaction.prn_amt + this.accNoEnteredForTransaction.intt_amt)
  
  console.log(this.accDtlsFrm);
  console.log(this.accNoEnteredForTransaction);
  console.log(this.accNoEnteredForTransaction2);//
  console.log(this.masterModel);
  console.log(this.showTranDtlRe);
  console.log(this.editDeleteMode);
  
  debugger
  this.tdDefTransFrmC.patchValue({
    trans_dt: this.accNoEnteredForTransaction.trans_dt,
    trans_cd:this.editDeleteMode?this.accNoEnteredForTransaction2.trans_cd:'',
    acc_type_desc: acc_desc,
    acc_type_cd: this.accNoEnteredForTransaction.acc_type_cd,
    acc_num: this.accNoEnteredForTransaction.acc_num,
    amount:this.accNoEnteredForTransaction.prn_amt,
    // amount:this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt,
    // trans_type_key:'D',
    // trans_type:this.editDeleteMode?'Deposit',
    trf_type:this.editDeleteMode? this.accNoEnteredForTransaction2.trf_type:'',
    intt_trf_type: this.accNoEnteredForTransaction.intt_trf_type,
    curr_intt_recov:this.accNoEnteredForTransaction.intt_amt,
    opening_dt:this.accNoEnteredForTransaction.opening_dt.toString().substr(0, 10), 
    constitution_cd_desc:this.invComServ.constitutionDes,
    constitution_cd:this.invComServ.constitutionCd,
    ovd_intt_recov:0,
    curr_prn_recov:0,
      trans_mode1:'Close',
      trans_mode: 'C',
      trans_type: 'withdrawal',
      trans_type_key: 'W',
      penal_rt:0,
      matVal:this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt,
      approval_status: this.accNoEnteredForTransaction.approval_status,
      bank_nm:this.invComServ.bankName,
      branch_nm:this.invComServ.branchName
  });
  if(this.editDeleteMode==true){//XXX
    if(this.accNoEnteredForTransaction2.trf_type=='T' && this.accNoEnteredForTransaction2.trans_type=='W'){
      debugger
      this.acc_master= this.invComServ.acc_master
      this.showtransdetails=true;
      this.addTransfer();
      console.log(this.invComServ.acc_master);
      console.log(this.acc_master);
      this.td_deftranstrfList=this.masterModel.tddeftranstrf;
      this.td_deftranstrfList[0].gl_acc_code = this.masterModel.tddeftranstrf[0]?.acc_cd;
      this.acc_master1= this.acc_master.filter(x => x.acc_cd.toString().includes(this.td_deftranstrfList[0]?.gl_acc_code));
      this.td_deftranstrfList[0].gl_acc_desc=this.acc_master1[0]?.acc_name;
      console.log(this.acc_master1);
      this.sumTransfer()
      console.log(this.td_deftranstrfList);
    }
    
  }
 } this.isLoading =false;
}
onTransTypeChange(){
  debugger
  if(Number(this.accDtlsFrm.controls.mat_amt.value)===Number(this.tdDefTransFrm.controls.amount.value)){
    this.showtransdetails=false;
  }
  else{
    if(this.tdDefTransFrm.controls.trans_mode.value=='R'){
      // this.invComServ.transfer_TYPE=this.tdDefTransFrm.controls.trf_type.value
    if(this.td.trf_type.value=='T'){
      debugger
      this.showtransdetails=true;
      this.addTransfer();
      this.onDepositePeriodChange();
     
    }
    else if(this.td.trf_type.value=='C'){
      this.showtransdetails=false;
      debugger
      this.inttCalOnClose()
    
    }
    else{
      this.showtransdetails=false;
    }
  }
  else{
    if(this.tdDefTransFrmC.controls.trf_type.value=='T' && this.tdDefTransFrmC.controls.trans_mode.value=='C' && !this.editDeleteMode){
      this.invComServ.transfer_TYPE=this.tdDefTransFrmC.controls.trf_type.value
      debugger
      this.showtransdetails=true;
      this.addTransfer();
      debugger
    }
  }
  }
 

}
onAmtChngDuringRenewal(): void {
  //////////////debugger;
  // const accTypeCd = +this.f.acc_type_cd.value;
  // this.showTranferType = false;
  this.HandleMessage(false);
  if ((+this.td.amount.value) <= 0) {
    this.HandleMessage(true, MessageType.Error, 'Amount can not be negative Or 0.');
    this.td.amount.setValue('');
    return;
  }
  console.log(this.td.amount.value, this.accDtlsFrm.controls.prn_amt.value)
  // if ((this.td.amount.value + Number(this.td.ovd_intt_recov.value>=0?this.td.ovd_intt_recov.value:0) != this.accDtlsFrm.controls.prn_amt.value) && (this.td.amount.value + Number(this.td.ovd_intt_recov.value>=0?this.td.ovd_intt_recov.value:0) != this.accDtlsFrm.controls.mat_amt.value) ) {
  //   this.HandleMessage(true, MessageType.Error, 'Amount should be equal to principal or maturity amount');
  //   this.td.amount.setValue(this.accDtlsFrm.controls.mat_amt.value);
  //   return;
  // }
  if (this.td.trans_type_key.value === 'D' || this.td.trans_type_key.value === 'W') {
    const mat_amt =(this.masterModel.tmdepositInv.prn_amt
      + this.masterModel.tmdepositInv.intt_amt)-Number(this.td.ovd_intt_recov.value>=0?this.td.ovd_intt_recov.value:0)
      ;
if(Number(mat_amt)===Number(this.td.amount.value)){
  this.tdDefTransFrm.patchValue({
    trans_type: 'Deposit',
    trans_type_key: 'D',
    balance:0
  })
  this.showBalance=false;
  this.td_deftranstrfList=[];
  this.showtransdetails=false;
}
else{
  this.tdDefTransFrm.patchValue({
    trans_type: 'Withdraw',
    trans_type_key: 'W',
    balance:this.accNoEnteredForTransaction.intt_amt
  })
  this.showBalance=true
  if(this.td.trf_type.value=='T'){
    this.showtransdetails=true;
    this.addTransfer();
  }
  else{
    this.td_deftranstrfList=[];
  this.showtransdetails=false;
  }
}
    
  //  this.showtransdetails = this.tdDefTransFrm.controls.trans_mode.value == 'R' && this.tdDefTransFrm.controls.trf_type.value == 'T' ? true : false;
    //  this.mat_val=this.tdDefTransFrm.controls.interest.value? (this.f.prn_amt.value+this.tdDefTransFrm.controls.interest.value):'';
    //  console.log(this.mat_val)
    if ((Number(mat_amt) < Number(this.td.amount.value))) {
      
    //   this.td.balance.setValue((mat_amt - (+this.td.amount.value)));
    // } else if ((mat_amt - (+this.td.amount.value)) === 0) {
      
    //   this.td.balance.setValue((mat_amt - (+this.td.amount.value)));
    // } else if (((+this.td.amount.value) - mat_amt) > 0) {
      // close transfer area
      this.HandleMessage(true, MessageType.Error, 'Amount can not be greater than maturity amount.');
      this.td.amount.setValue('');
      
      // this.td.balance.setValue('');
      
      return;
    }
  }
  // this.td_deftranstrfList[0].amount = this.td.amount.value;
}
public inttCalOnClose(): void {
  if (this.accNoEnteredForTransaction.acc_type_cd == 25) {
    debugger;
    const temp_gen_param = new p_gen_param();
    temp_gen_param.ad_acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
    temp_gen_param.ad_prn_amt = this.accNoEnteredForTransaction.prn_amt;
    temp_gen_param.adt_temp_dt = this.accNoEnteredForTransaction.opening_dt;
    const cDt = this.sys.CurrentDate.getTime();
    const opDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.opening_dt.toString()).getTime();
    // const o = Utils.convertStringToDt(this.td.opening_dt.value);
    const matDt=Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime()
    console.log(this.accNoEnteredForTransaction.intt_rt, this.tdDefTransFrm.controls.ovd_intt_recov.value)
    // const diffDays = Math.ceil((Math.abs(cDt - opDt)) / (1000 * 3600 * 24));
    const diffDays = Math.ceil((Math.abs(matDt - opDt)) / (1000 * 3600 * 24));
    temp_gen_param.ai_period = diffDays;
    console.log(this.tdDefTransFrm.controls.eff_int.value)
    console.log(this.effInt)
    // temp_gen_param.ad_intt_rt=this.accNoEnteredForTransaction.intt_rt-this.tdDefTransFrm.controls.ovd_intt_recov.value
    temp_gen_param.ad_intt_rt = this.tdDefTransFrm.controls.eff_int.value!=null?this.tdDefTransFrm.controls.eff_int.value:this.effInt
    // this.isLoading = true;
    if (temp_gen_param.ad_intt_rt < 0) {
      console.log(temp_gen_param.ad_intt_rt)
      this.HandleMessage(true, MessageType.Error, 'Default penalty cannot be more than the actual interest rate');
      return;
    }
  
  
    this.effInt = temp_gen_param.ad_intt_rt > 0 ? temp_gen_param.ad_intt_rt : 0
   //marker to change the interest on calculation 
  

  // marker to change the interest on calculation ends here
  }
  
  else {
    debugger
    if(Number(this.tdDefTransFrmC.controls.eff_intt.value)>Number(this.accDtlsFrm.controls.intt_rt.value)){
      debugger
      this.HandleMessage(true, MessageType.Error, 'Modified Interest Rt. should not be greater than actual interest Rt.');
      this.tdDefTransFrmC.controls.eff_intt.setValue(0);
      this.tdDefTransFrmC.controls.matVal.setValue(this.accNoEnteredForTransaction.prn_amt);
      return
    }
    else{
      debugger
    let param = new p_gen_param();
    param.ad_acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
    param.ad_prn_amt = this.accNoEnteredForTransaction.prn_amt;
    param.adt_temp_dt = this.accNoEnteredForTransaction.opening_dt;
    param.as_acc_num = this.accNoEnteredForTransaction.acc_num;
    param.ad_instl_amt = this.accNoEnteredForTransaction.instl_amt;
    console.log(param.ad_instl_amt)
    param.an_instl_no = this.counter;
    if(this.showTranDtlCl==true){
      param.ad_intt_rt = (this.tdDefTransFrmC.controls.eff_intt.value)
    }
    else{param.ad_intt_rt = (this.tdDefTransFrm.controls.intt_rate.value)
    }
    param.ardb_cd = this.sys.ardbCD;
    param.ai_period = this.diff;
    // this.effInt=param.an_intt_rate
    this.svc.addUpdDel<any>('INVESTMENT/F_CALCTDINTT_INV_REG', param).subscribe(
      res => {
        console.log(res)
        this.newIntt = res;
        if (undefined !== res
          && null !== res
          && res > 0) {
          
          if(this.showTranDtlCl==true){
            this.tdDefTransFrmC.patchValue({
              // eff_int:this.effInt,
              curr_intt_recov: res.toFixed(2),
              matVal:Number(this.newIntt)+Number(this.tdDefTransFrmC.controls.amount.value),
              ovd_intt_recov: this.tdDefTransFrmC.controls.ovd_intt_recov.value,
              bonus_amt: 0,
              curr_prn_recov: 0,
              penal_rt: 0
            })
            if(this.editDeleteMode&&this.tdDefTransFrmC.controls.trf_type.value=='T'){
              this.td_deftranstrfList.forEach(e =>e.amount=this.tdDefTransFrmC.controls.matVal.value)
            }
          }
          else{
            this.tdDefTransFrm.patchValue({
            // eff_int:this.effInt,
            interest: res.toFixed(2),
            amount: param.ad_instl_amt * this.counter,
            //  interest: res,
            ovd_intt_recov: this.tdDefTransFrmC.controls.ovd_intt_recov.value,
            bonus_amt: 0,
            curr_prn_recov: 0,
            td_def_mat_amt: param.ad_instl_amt * this.counter + res
          })
          }
        }

        param = new p_gen_param();
        param.as_acc_num = this.accNoEnteredForTransaction.acc_num;
        param.ardb_cd = this.sys.ardbCD;
       

      },
      err => { console.log(err); }
    );
  //marker for default penalty, bonus

    // this.td.td_def_mat_amt.setValue((this.td.amount.value +
    //   (+this.td.interest.value) - (+this.td.ovd_intt_recov.value)
    //   + (+this.td.curr_prn_recov.value)).toFixed(2));
  }
}
  // this.td.td_def_mat_amt.setValue((this.td.amount.value +
  //   (+this.td.interest.value) - (+this.td.ovd_intt_recov.value)
  //   + (+this.td.curr_prn_recov.value)).toFixed(2));
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
  
  if (this.selectedCust != acc_cd) {
    this.td_deftranstrfList[indx].gl_acc_code = acc_cd;
    this.td_deftranstrfList[indx].gl_acc_desc = acc_name;
    // this.setDebitAccDtls(this.td_deftranstrfList[indx]);
  }
  console.log(this.tdDefTransFrmC.controls.trf_type.value);
  debugger
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
public addTransfer(): void {
if(this.editDeleteMode==false){
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
else{
  return
}
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
    console.log(acc_num.substring(0, 3))
    if (this.selectedCust != acc_num) {
      this.td_deftranstrfList[indx].cust_acc_number = acc_num;
      this.td_deftranstrfList[indx].cust_name = cust_name;
      this.setDebitAccDtls(this.td_deftranstrfList[indx]);
    }
    else {
      this.HandleMessage(true, MessageType.Error, "You cannot choose the same account!");
    }
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
          // if (!foundOneUnclosed) {
          //   this.HandleMessage(true, MessageType.Error,
          //     `Transfer details account number ${this.f.acct_num.value} is closed.`);
          //   tdDefTransTrnsfr.cust_acc_number = null;
          //   return;
          // }
        }

      },
      err => {
        this.isLoading = false;
      }
    );
  }
  checkDebitBalance(tdDefTransTrnsfr: td_def_trans_trf) {
    console.log(tdDefTransTrnsfr.amount)
    this.HandleMessage(false);
    console.log(this.td.trans_type_key)
    debugger

    if (tdDefTransTrnsfr.amount === undefined
      || tdDefTransTrnsfr.amount === null) {
        debugger
      return;
    }

    else if ((+tdDefTransTrnsfr.amount) < 0) {
      debugger
      this.HandleMessage(true, MessageType.Error, 'Negative amount can not be entered.');
      tdDefTransTrnsfr.amount = 0;
      return;
    }

    else if ((tdDefTransTrnsfr.cust_acc_number === undefined
      || tdDefTransTrnsfr.cust_acc_number === null
      || tdDefTransTrnsfr.cust_acc_number === '')
      && (tdDefTransTrnsfr.gl_acc_code === undefined
        || tdDefTransTrnsfr.gl_acc_code === null
        || tdDefTransTrnsfr.gl_acc_code === '')) {
          debugger
      this.HandleMessage(true, MessageType.Warning, 'Please enter Account Number or GL Code');
      tdDefTransTrnsfr.amount = null;
      return;
    }


    // else if (tdDefTransTrnsfr.clr_bal === undefined
    //   || tdDefTransTrnsfr.clr_bal === null) {
    //     debugger
    //   tdDefTransTrnsfr.clr_bal = 0;
    // console.log(tdDefTransTrnsfr,tdDefTransTrnsfr.gl_acc_code);

    // }
    
    
  //   else if(tdDefTransTrnsfr.gl_acc_code === null || tdDefTransTrnsfr.gl_acc_code === ''|| tdDefTransTrnsfr.gl_acc_code === undefined){
  //     if ((+tdDefTransTrnsfr.clr_bal < (+tdDefTransTrnsfr.amount) )) {
      
  //     this.HandleMessage(true, MessageType.Warning, 'Insufficient Balance');
  //     tdDefTransTrnsfr.amount = null;
  //     return;
  //   }

  // }
  

  else if(this.showTranDtlRe && Number(tdDefTransTrnsfr.amount)+Number(this.td.amount.value)+Number(this.td.ovd_intt_recov.value)===Number(this.accDtlsFrm.controls.mat_amt.value)) {
      debugger
    this.sumTransfer();
      return;
  }
  else if( this.showTranDtlCl ){
    debugger
    this.sumTransfer();
  }
//   else if( this.showTranDtlCl && Number(tdDefTransTrnsfr.amount)===Number(this.tdDefTransFrmC.controls.matVal.value)) {
//   debugger
//   this.sumTransfer();
//     return;
// }
  else{
    console.log(Number(tdDefTransTrnsfr.amount)+Number(this.td.amount.value),this.accDtlsFrm.controls.mat_amt.value);
    if(this.showTranDtlCl ){ //PARTHA
      debugger
      // this.HandleMessage(true, MessageType.Warning, 'You should be Transfer Mature amount only!!!!');
      //   tdDefTransTrnsfr.amount = null;
    }
    else{
      debugger
      this.HandleMessage(true, MessageType.Warning, 'You should be Transfer Interest amount only!!!!');
        tdDefTransTrnsfr.amount = null;
    }
  }
    this.invComServ.sendCloseFromData(this.tdDefTransFrmC.controls, tdDefTransTrnsfr)
    console.log(this.tdDefTransFrmC.controls.trf_type.value);
    debugger
    
  }
  private sumTransfer(): void {
    if(this.editDeleteMode==false){
    this.TrfTotAmt = 0;
    this.td_deftranstrfList.forEach(e => {
      this.TrfTotAmt += (+e.amount);
    });
    debugger
    if(this.TrfTotAmt!=Number(this.tdDefTransFrmC.controls.matVal.value) ){
      if(this.showTranDtlCl==true){
        debugger
        this.HandleMessage(true, MessageType.Warning, 'You should be Transfer Mature amount only!!!!');
        this.TrfTotAmt = null;
      }
      // else{
      //   if( Number(tdDefTransTrnsfr.amount)===Number(this.tdDefTransFrmC.controls.matVal.value))
      //   debugger
      //   this.HandleMessage(true, MessageType.Warning, 'You should be Transfer Interest amount only!!!!');
      //   this.TrfTotAmt = null;
      // }
    }
    debugger

    console.log(this.TrfTotAmt);
  }
  else{return}
    // console.log(this.td.amount.value+" "+this.TrfTotAmt)
    // if ((+this.td.amount.value) < this.TrfTotAmt) {
    //   this.HandleMessage(true, MessageType.Error, 'Total Amount can not be more than Transaction amount');
    //   // this.td_deftranstrfList[(this.td_deftranstrfList.length - 1)].amount = 0;
    // }
    console.log(this.tdDefTransFrmC.controls.trf_type.value);
    debugger
    
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
  onDepositePeriodChange(): void {
    debugger
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
      console.log(matDt);
      
      debugger
      
      this.tdDefTransFrm.patchValue({
        mat_dt: Utils.convertDtToString(new Date(matDt))
      });
      this.processInterest();
    }
  }
  processInterest(): void {
    console.log(this.td);
    
    
    debugger
    const temp_gen_param = new p_gen_param();

    temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;

    

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
console.log(this.td.amount.value,this.td.interest.value);
debugger


      // var temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
      // temp_gen_param.ad_prn_amt = this.td.intt_trf_type.value!='O'? +this.td.amount.value:this.td.td_def_mat_amt.value;
      // temp_gen_param.ad_prn_amt =Number(this.td.amount.value)+Number(this.td.interest.value);
      temp_gen_param.ad_prn_amt =Number(this.td.amount.value);
      temp_gen_param.adt_temp_dt = Utils.convertStringToDt(this.td.opening_dt?.value);
      temp_gen_param.as_intt_type = this.td.intt_trf_type.value;
      // tslint:disable-next-line: max-line-length
      // if (typeof (this.td.opening_dt) === 'string') {
      //   this.tm_deposit.opening_dt = Utils.convertStringToDt(this.td.opening_dt.value);
      // }

      // if (typeof (this.tm_deposit.mat_dt) === 'string') {
      //   this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
      // }
      //const m = Utils.convertStringToDt(this.masterModel.tmdepositrenewInv.mat_dt.toString());
      const o = Utils.convertStringToDt(this.td.opening_dt.value);
      const m = Utils.convertStringToDt(this.td.mat_dt.value);
      console.log(o,m);
      
      const diffDays = Math.ceil((Math.abs(m.getTime() - o.getTime())) / (1000 * 3600 * 24));
      temp_gen_param.ai_period = diffDays;
      temp_gen_param.ad_intt_rt = +Number(this.td.intt_rate.value);

      this.f_calctdintt_reg(temp_gen_param);
    
  }


  f_calctdintt_reg(temp_gen_param: p_gen_param): void {
    debugger
    console.log(temp_gen_param);
    
    this.svc.addUpdDel<any>('INVESTMENT/F_CALCTDINTT_INV_REG', temp_gen_param).subscribe(
      res => {
        console.log(res);
        
        this.tdDefTransFrm.patchValue({
          interest: +res
        });
        this.mat_val =  Number(temp_gen_param.ad_prn_amt) + Number(this.tdDefTransFrm.controls.interest.value);
        console.log(this.mat_val);
        
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;

      }
    );
  }
  onSaveClick(): void {
    // this.processInterest();
    console.log(this.editDeleteMode);
    // this.tdDefTransFrmC.controls=this.invComServ.closeFrm.controls;
    // this.td_deftranstrfList[0]=this.invComServ.td_deftranstrfList[0];
  
    const accTypeCd = this.accNoEnteredForTransaction.acc_type_cd;
    
    // console.log(this.invComServ.transfer_TYPE);
    // this.tdDefTransFrmC.controls.trf_type.setValue(this.invComServ.transfer_TYPE)
    this.showTranDtlCl=this.invComServ.showTranDtlCl
    this.showTranDtlRe=this.invComServ.showTranDtlRe
    console.log(this.tdDefTransFrmC.controls);
    // if((this.tdDefTransFrmC.controls.trf_type.value == 'T'||this.tdDefTransFrm.controls.trf_type.value == 'T') && this.TrfTotAmt){
    //   this.HandleMessage(true, MessageType.Error, 'Please Insert Tranaction Amount.');
    //   return;
    // }

    debugger;
    if (this.editDeleteMode==false) {
      debugger
    if(this.showTranDtlCl==true){
        //for Close
        console.log(this.tdDefTransFrmC.controls.trf_type.value);
        debugger
        if (undefined === this.tdDefTransFrmC.controls.trf_type.value
            || null === this.tdDefTransFrmC.controls.trf_type.value
            || this.tdDefTransFrmC.controls.trf_type.value === '') {
            this.HandleMessage(true, MessageType.Error, 'Please choose tranaction type.');
            
          }
          else{
            debugger
        this.isLoading = true; 
      const saveTransaction = new InvOpenDM();
      
      debugger
      const tdDefTrans = this.mappTddefTransFrClose();
      console.log(tdDefTrans);
      saveTransaction.tddeftrans = tdDefTrans;
      if (this.tdDefTransFrmC.controls.trf_type.value === 'C') {
        // saveTransaction.tmdenominationtrans = this.tm_denominationList;  
        //for denomination somnath comment
      } else if (this.tdDefTransFrmC.controls.trf_type.value === 'T') {
        let i = 0;

        this.td_deftranstrfList.forEach(e => {
          if (e.amount != null) {
            const tdDefTransAndTranfer = this.mappTddefTransAndTransFrClose();
            console.log(tdDefTransAndTranfer)
              tdDefTransAndTranfer.acc_type_cd = e.gl_acc_code;
              tdDefTransAndTranfer.acc_num = '0000';
              tdDefTransAndTranfer.acc_name = e.gl_acc_desc;
              tdDefTransAndTranfer.instrument_num = e.instrument_num;
              tdDefTransAndTranfer.acc_cd = e.gl_acc_code;
              // tdDefTransAndTranfer.remarks = 'X';
              tdDefTransAndTranfer.remarks = 'Close';
              tdDefTransAndTranfer.disb_id = ++i;
              if (this.showTranDtlRe==true || this.showTranDtlCl==true) {
                const desc =this.accNoEnteredForTransaction.acc_type_cd.value == 23 ? 'Term Deposit' : this.accNoEnteredForTransaction.acc_type_cd.value == 22 ?'Fixed Deposit':this.accNoEnteredForTransaction.acc_type_cd.value == 24 ?'Special TD':'RD';
                console.log(this.accNoEnteredForTransaction.acc_type_cd.value + " " + desc)
                tdDefTransAndTranfer.particulars = 'By Transfer from ' + desc + 'A/C: ' + this.tdDefTransFrmC.controls.acc_num.value //marker
              }
            
            
            // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
            //   if (accTypeCd == 23) {
            //     for (let i = 0; i < CcTransComponent.constitutionList.length; i++) {
            //       if (CcTransComponent.constitutionList[i].constitution_cd == this.constCd && CcTransComponent.constitutionList[i].acc_type_cd == this.tddefAccTypCd) {
            //         tdDefTransAndTranfer.acc_cd = CcTransComponent.constitutionList[i].acc_cd
            //         console.log(tdDefTransAndTranfer.acc_cd)
            //       }
            //     }
            //   }
            // } //marker
            tdDefTransAndTranfer.amount = e.amount;
            console.log(tdDefTransAndTranfer);
            tdDefTransAndTranfer.home_brn_cd = tdDefTransAndTranfer.acc_num.substring(0, 3);
            tdDefTransAndTranfer.intra_branch_trn = tdDefTransAndTranfer.acc_num.substring(0, 3) != this.sys.BranchCode ? 'Y' : 'N'
            // toReturn.home_brn_cd=toReturn.acc_num.substring(0,3);
            // toReturn.intra_branch_trn=toReturn.acc_num.substring(0,3)!=this.sys.BranchCode?'Y':'N'
            saveTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
          }
          else {
            this.HandleMessage(true, MessageType.Error, 'Amount can not be null');
            return
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
      debugger;
      this.svc.addUpdDel<InvOpenDM>('INVESTMENT/InsertInvOpeningData', saveTransaction).subscribe(
        res => {
          this.HandleMessage(true, MessageType.Sucess, 'Saved sucessfully, your transaction code is :' + res);
          // this.tdDefTransFrmC.reset();
          // this.accDtlsFrm.reset();
          // this.td_deftranstrfList=[];
          // this.showtransdetails=false;
          this.isLoading = false;
        },
        err => { this.isLoading = false; console.error('Error on onSaveClick' + JSON.stringify(err)); }
      );
    }
    }
      //for renewal
    else{
      debugger
    if(+this.td.intt_rate.value<=0){
      debugger
      this.HandleMessage(true, MessageType.Error, 'Interest rate should be greater than ZERO');
      this.td.intt_rate.setValue('');
    return;
    }
    debugger
    if(this.td.trans_mode1.value=='Renewal' && (this.td.amount.value) <= 0){
      this.HandleMessage(true, MessageType.Error, 'Amount can not be blank');
      return;
    } 
    debugger
    if(this.td.trans_mode1.value=='Close' && (this.td.amount.value) <= 0){
      this.HandleMessage(true, MessageType.Error, 'Amount can not be blank');
      return;
    }
    debugger
    if (undefined === this.td.trf_type.value
        || null === this.td.trf_type.value
        || this.td.trf_type.value === '') {
        this.HandleMessage(true, MessageType.Error, 'Please choose tranaction type.');
        return;
      }
      this.isLoading = true; 
      const saveTransaction = new InvOpenDM();
      
      debugger
      if (this.showTranDtlRe==true) {
        debugger
        this.tdDefTransFrm.patchValue({ 
        trans_mode1:this.showTranDtlRe?'Renewal':'Close',
        trans_mode:this.showTranDtlRe?'R':'C',
        // amount:this.td.amount.value,
        })
       console.log(
        this.td.trans_mode1.value,
        this.td.trans_mode.value,
        this.td.amount.value);
       
        debugger
        saveTransaction.tmdepositrenewInv = this.mapRenewData();
      }
      
      const tdDefTrans = this.mappTddefTransFrom();
      console.log(tdDefTrans);
      saveTransaction.tddeftrans = tdDefTrans;
      if (this.td.trf_type.value === 'C') {
        // saveTransaction.tmdenominationtrans = this.tm_denominationList;  
        //for denomination somnath comment
      } else if (this.td.trf_type.value === 'T') {
        let i = 0;

        this.td_deftranstrfList.forEach(e => {
          if (e.amount != null) {
            const tdDefTransAndTranfer = this.mappTddefTransAndTransFrFromFrm();
            console.log(tdDefTransAndTranfer)
            if (e.trans_type === 'cust_acc') {
              tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
              tdDefTransAndTranfer.acc_num = e.cust_acc_number;
              tdDefTransAndTranfer.acc_name = e.cust_name;
              tdDefTransAndTranfer.instrument_num = e.instrument_num;
              tdDefTransAndTranfer.acc_cd = e.acc_cd;
              // tdDefTransAndTranfer.remarks = 'D';
              tdDefTransAndTranfer.remarks = 'renewal';
              tdDefTransAndTranfer.disb_id = ++i;
              if (this.showTranDtlRe==true) {
                tdDefTransAndTranfer.trans_type = 'D'  //marker
              }
              if (this.showTranDtlRe==true || this.showTranDtlCl==true) {
                const desc = this.accNoEnteredForTransaction.acc_type_cd == 22 ? 'FD ' : (this.accNoEnteredForTransaction.acc_type_cd.value === 25 ? 'RD' : (this.accNoEnteredForTransaction.acc_type_cd.value == 23 ? 'Term Deposit' : (this.accNoEnteredForTransaction.acc_type_cd.value == 24 ? 'Special TD ' : '')))
                console.log(this.accNoEnteredForTransaction.acc_type_cd.value + " " + desc)


                tdDefTransAndTranfer.particulars = 'By Transfer from ' + desc + 'A/C: ' + this.td.acc_num.value //marker
              }
            } else {
              tdDefTransAndTranfer.acc_type_cd = e.gl_acc_code;
              tdDefTransAndTranfer.acc_num = '0000';
              tdDefTransAndTranfer.acc_name = e.gl_acc_desc;
              tdDefTransAndTranfer.instrument_num = e.instrument_num;
              tdDefTransAndTranfer.acc_cd = e.gl_acc_code;
              // tdDefTransAndTranfer.remarks = 'X';
              tdDefTransAndTranfer.remarks = 'Renewal';
              tdDefTransAndTranfer.disb_id = ++i;
              if (this.showTranDtlRe==true || this.showTranDtlCl==true) {
                const desc = this.accNoEnteredForTransaction.acc_type_cd == 22 ? 'FD ' : (this.accNoEnteredForTransaction.acc_type_cd.value === 25 ? 'RD' : (this.accNoEnteredForTransaction.acc_type_cd.value == 23 ? 'Term Deposit ' : (this.accNoEnteredForTransaction.acc_type_cd.value == 24 ? 'Special TD ' : '')))
                console.log(this.accNoEnteredForTransaction.acc_type_cd.value + " " + desc)
                tdDefTransAndTranfer.particulars = 'By Transfer from ' + desc + 'A/C: ' + this.td.acc_num.value //marker
              }
            }
            
            // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
            //   if (accTypeCd == 23) {
            //     for (let i = 0; i < CcTransComponent.constitutionList.length; i++) {
            //       if (CcTransComponent.constitutionList[i].constitution_cd == this.constCd && CcTransComponent.constitutionList[i].acc_type_cd == this.tddefAccTypCd) {
            //         tdDefTransAndTranfer.acc_cd = CcTransComponent.constitutionList[i].acc_cd
            //         console.log(tdDefTransAndTranfer.acc_cd)
            //       }
            //     }
            //   }
            // } //marker
            tdDefTransAndTranfer.amount = e.amount;
            console.log(tdDefTransAndTranfer);
            tdDefTransAndTranfer.home_brn_cd = tdDefTransAndTranfer.acc_num.substring(0, 3);
            tdDefTransAndTranfer.intra_branch_trn = tdDefTransAndTranfer.acc_num.substring(0, 3) != this.sys.BranchCode ? 'Y' : 'N'
            // toReturn.home_brn_cd=toReturn.acc_num.substring(0,3);
            // toReturn.intra_branch_trn=toReturn.acc_num.substring(0,3)!=this.sys.BranchCode?'Y':'N'
            saveTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
          }
          else {
            this.HandleMessage(true, MessageType.Error, 'Amount can not be null');
            return
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
      debugger;
      this.svc.addUpdDel<InvOpenDM>('INVESTMENT/InsertInvOpeningData', saveTransaction).subscribe(
        res => {
          debugger
          this.HandleMessage(true, MessageType.Sucess, 'Saved sucessfully, your transaction code is :' + res);
          // this.onResetClick();
          // this.tdDefTransFrm.reset();
          // this.accDtlsFrm.reset();
          // this.td_deftranstrfList=[]
          this.isLoading = false;
        },
        
        err => {debugger
           this.isLoading = false; console.error('Error on onSaveClick' + JSON.stringify(err)); }
      );
    } 
  }
    else {
      //for close Update
    if(this.showTranDtlCl==true){
      debugger
      this.isLoading = true;

      const updateTransaction = new InvOpenDM();
      const tdDefTrans = this.mappTddefTransFrClose();
      console.log(tdDefTrans);
      updateTransaction.tddeftrans = tdDefTrans;
     
      console.log(updateTransaction.tddeftrans);
      
      if (this.tdDefTransFrmC.controls.trf_type.value === 'T') {
        debugger
        let i = 0;
      
        this.td_deftranstrfList.forEach(e => {console.log(e);
        
          if (e.amount != null) {
            debugger
            const tdDefTransAndTranfer = this.mappTddefTransAndTransFrClose();
            console.log(tdDefTransAndTranfer);
            if ( this.tdDefTransFrmC.controls.trans_mode.value == 'C') { 
                  const desc = 'Term Deposit '
                  tdDefTransAndTranfer.particulars = 'By Transfer from ' + desc + 'A/C:' + this.tdDefTransFrmC.controls.acc_num.value
           }
            else{ tdDefTransAndTranfer.particulars = this.tdDefTransFrmC.controls.particulars.value}
                 

            console.log(tdDefTransAndTranfer.particulars)
            
              tdDefTransAndTranfer.trans_cd = this.tdDefTransFrmC.controls.trans_cd.value;
              tdDefTransAndTranfer.acc_type_cd = +e.gl_acc_code;
              tdDefTransAndTranfer.acc_num = '0000';
              tdDefTransAndTranfer.acc_name = e.gl_acc_desc;
              tdDefTransAndTranfer.acc_cd = +e.gl_acc_code;
              tdDefTransAndTranfer.remarks = 'Close';
              
              tdDefTransAndTranfer.disb_id = ++i;
              
              console.log("else" + " " + tdDefTransAndTranfer.acc_cd)
            
            tdDefTransAndTranfer.amount = e.amount;
            tdDefTransAndTranfer.home_brn_cd = tdDefTransAndTranfer.acc_num.substring(0, 3);
            tdDefTransAndTranfer.intra_branch_trn = tdDefTransAndTranfer.acc_num.substring(0, 3) != this.sys.BranchCode ? 'Y' : 'N'
            console.log(tdDefTransAndTranfer.particulars)
            
            updateTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
          }
          else {
            this.HandleMessage(true, MessageType.Error, 'Amount can not be null');
            return
          }

        });
      }
      console.log(updateTransaction);
      debugger
      this.svc.addUpdDel<InvOpenDM>('INVESTMENT/UpdateInvOpeningData', updateTransaction).subscribe(
        res => {
          console.log(this.td_deftranstrfList)
          
          const accNum = this.tdDefTransFrmC.controls.acc_num.value;
          if ((+res) === -1) {
            this.HandleMessage(true, MessageType.Error, `Transaction for Acc# ${accNum},
            Not updated sucessfully.`);
          } else {
            this.HandleMessage(true, MessageType.Sucess, `Transaction for Acc# ${accNum},
            updated sucessfully.`);
            // this.onResetClick();
            // this.tdDefTransFrmC.reset();
            // this.accDtlsFrm.reset();
            // this.td_deftranstrfList=[];
            // this.showtransdetails=false;
            this.isLoading = false;
          }
          this.isLoading = false;
        },
        err => { this.isLoading = false; console.error('Error on Update Transaction' + JSON.stringify(err)); }
      );
    }
    else{this.isLoading = true;
      debugger
      this.tdDefTransFrm.patchValue({ 
        trans_mode1:this.showTranDtlRe?'Renewal':'Close',
        trans_mode:this.showTranDtlRe?'R':'C',
        // amount:this.td.amount.value,
        })
      const updateTransaction = new InvOpenDM();
      const tdDefTrans = this.mappTddefTransFrom();
      console.log(tdDefTrans);
      updateTransaction.tddeftrans = tdDefTrans;
     if (this.td.trans_mode.value.toLocaleLowerCase() === 'r') {
      debugger
       updateTransaction.tmdepositrenewInv = this.mapRenewData();
      }
      console.log(updateTransaction.tddeftrans);
      
      if (this.td.trf_type.value === 'C') {
      this.tm_denominationList.forEach(ele => {
          ele.trans_cd = this.td.trans_cd.value;
        });

      } else if (this.td.trf_type.value === 'T') {
        debugger
        let i = 0;
      
        this.td_deftranstrfList.forEach(e => {console.log(e);
        
          if (e.amount != null) {

            const tdDefTransAndTranfer = this.mappTddefTransAndTransFrFromFrm();
            console.log(tdDefTransAndTranfer);
            
            if (this.td.trf_type.value === 'T' && (this.td.trans_mode.value == 'C' || this.td.trans_mode.value == 'W') && this.editDeleteMode && ( accTypeCd == 22|| accTypeCd == 23|| accTypeCd == 24)) {
              const desc = this.accNoEnteredForTransaction.acc_type_cd == 22 ? 'FD ' : (this.accNoEnteredForTransaction.acc_type_cd.value === 25 ? 'RD' : (this.accNoEnteredForTransaction.acc_type_cd.value == 23 ?(this.sys.ardbCD=="26"?'Cash Certificate':'TD') : (this.accNoEnteredForTransaction.acc_type_cd.value == 24 ? 'SPECIAL TD ' : '')))
              tdDefTransAndTranfer.particulars = 'By Transfer from ' + desc + 'A/C:' + this.td.acc_num.value
            }
            else {
              if (this.editDeleteMode && accTypeCd != 22 && accTypeCd != 23 && accTypeCd != 24 && accTypeCd != 25)
                tdDefTransAndTranfer.particulars = this.td.particulars.value.split(' ')[0] === "BY" ? this.td.particulars.value.replace("BY", "TO") : this.td.particulars.value.replace("TO", "BY");
              else {
                if ((accTypeCd == 22 || accTypeCd == 23 || accTypeCd == 24) && (this.td.trans_mode.value == 'R' || this.td.trans_mode.value == 'C')) { //marker
                  const desc = this.accNoEnteredForTransaction.acc_type_cd == 22 ? 'FD ' : (this.accNoEnteredForTransaction.acc_type_cd.value === 25 ? 'RD' : (this.accNoEnteredForTransaction.acc_type_cd.value == 23 ? (this.sys.ardbCD=="26"?'Cash Certificate':'TD') : (this.accNoEnteredForTransaction.acc_type_cd.value == 24 ? 'SPECIAL TD ' : '')))

                  tdDefTransAndTranfer.particulars = 'By Transfer from ' + desc + 'A/C:' + this.td.acc_num.value
                }
                else
                  tdDefTransAndTranfer.particulars = this.tdDefTransFrm.controls.particulars.value

              }
            }
            console.log(tdDefTransAndTranfer.particulars)
            
            if (e.trans_type === 'cust_acc') {
              tdDefTransAndTranfer.trans_cd = this.td.trans_cd.value;
              // tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
              // tdDefTransAndTranfer.acc_num = e.cust_acc_number;
              // tdDefTransAndTranfer.acc_name = e.cust_name;
              tdDefTransAndTranfer.instrument_num = e.instrument_num;
              tdDefTransAndTranfer.acc_cd = e.acc_cd;
              
              tdDefTransAndTranfer.remarks = 'Renewal'
              tdDefTransAndTranfer.disb_id = ++i;
              
              console.log("if" + " " + tdDefTransAndTranfer.acc_cd, this.td_deftranstrfList)
              

            } else {
              tdDefTransAndTranfer.trans_cd = this.td.trans_cd.value;
              tdDefTransAndTranfer.acc_type_cd = +e.gl_acc_code;
              tdDefTransAndTranfer.acc_num = '0000';
              tdDefTransAndTranfer.acc_name = e.gl_acc_desc;
              tdDefTransAndTranfer.instrument_num = e.instrument_num;
              tdDefTransAndTranfer.acc_cd = +e.gl_acc_code;
              tdDefTransAndTranfer.remarks = 'Renewal';
              
              tdDefTransAndTranfer.disb_id = ++i;
              
              console.log("else" + " " + tdDefTransAndTranfer.acc_cd)
            }
            tdDefTransAndTranfer.amount = e.amount;
            tdDefTransAndTranfer.home_brn_cd = tdDefTransAndTranfer.acc_num.substring(0, 3);
            tdDefTransAndTranfer.intra_branch_trn = tdDefTransAndTranfer.acc_num.substring(0, 3) != this.sys.BranchCode ? 'Y' : 'N'
            console.log(tdDefTransAndTranfer.particulars)
            
            updateTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
          }
          else {
            this.HandleMessage(true, MessageType.Error, 'Amount can not be null');
            return
          }

        });
      }
      console.log(updateTransaction);
      debugger
      this.svc.addUpdDel<InvOpenDM>('INVESTMENT/UpdateInvOpeningData', updateTransaction).subscribe(
        res => {
          console.log(this.td_deftranstrfList)
          
          const accNum = updateTransaction.tddeftrans.acc_num;//PARTHA
          if ((+res) === -1) {
            this.HandleMessage(true, MessageType.Error, `Transaction for Acc# ${accNum},
            Not updated sucessfully.`);
          } else {
            this.HandleMessage(true, MessageType.Sucess, `Transaction for Acc# ${accNum},
            updated sucessfully.`);
            // this.tdDefTransFrm.reset();
            // this.accDtlsFrm.reset();
            // this.td_deftranstrfList=[]
            this.isLoading = false;
          }
          this.isLoading = false;
        },
        err => { this.isLoading = false; console.error('Error on Update Transaction' + JSON.stringify(err)); }
      );
    }
    }
  }
  onDeleteClick(): void {
    if (!(confirm('Are you sure you want to Delete Transaction of Acc '
      + this.accNoEnteredForTransaction2.acc_num
      + ' with Transancation Cd ' + this.accNoEnteredForTransaction2.trans_cd))) {
      return;
    }

    this.isLoading = true;
    const param = new td_def_trans_trf();
    param.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    param.trans_cd = this.accNoEnteredForTransaction2.trans_cd;
    param.ardb_cd=this.sys.ardbCD;
    param.trans_dt = this.sys.CurrentDate;
    param.acc_type_cd = this.accNoEnteredForTransaction2.acc_type_cd;
    param.acc_num = this.accNoEnteredForTransaction2.acc_num;

    this.svc.addUpdDel<any>('INVESTMENT/DeleteInvOpeningData', param).subscribe(
      res => {
        this.isLoading = false;
        if (res === 0) {
          debugger
          this.HandleMessage(true, MessageType.Sucess, this.accNoEnteredForTransaction2.acc_num
            + '\'s Transaction with Transacation Cd ' + this.accNoEnteredForTransaction2.trans_cd
            + ' is deleted.');
            // this.onResetClick();
          // this.accDtlsFrm.reset();
          // this.tdDefTransFrm.reset();
          // this.tdDefTransFrmC.reset();
          // this.td_deftranstrfList=[]
          // this.showtransdetails=false;

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
    toReturn.constitution_cd = this.td.constitution_cd.value;
    toReturn.oprn_instr_cd = this.accNoEnteredForTransaction.oprn_instr_cd;
    toReturn.opening_dt = Utils.convertStringToDt(this.td.opening_dt.value);
    // toReturn.prn_amt = (+this.td.amount.value);
    toReturn.prn_amt = Number(this.td.amount.value) ;//+ Number(this.td.curr_intt_recov.value); 
    toReturn.intt_amt = this.td.interest.value;
    toReturn.dep_period = depPrd;
    // toReturn.instl_amt = this.accNoEnteredForTransaction.instl_amt;
    // toReturn.instl_no = this.accNoEnteredForTransaction.instl_no;
    toReturn.mat_dt = Utils.convertStringToDt(this.td.mat_dt.value);
    toReturn.intt_rt = (+this.td.intt_rate.value);
    // toReturn.tds_applicable = this.accNoEnteredForTransaction.tds_applicable;
    // toReturn.last_intt_calc_dt = this.accNoEnteredForTransaction.last_intt_calc_dt;
    // toReturn.acc_close_dt = this.accNoEnteredForTransaction.acc_close_dt;
    // toReturn.closing_prn_amt = this.accNoEnteredForTransaction.closing_prn_amt;
    // toReturn.closing_intt_amt = this.accNoEnteredForTransaction.closing_intt_amt;
    // toReturn.penal_amt = this.accNoEnteredForTransaction.penal_amt;
    // toReturn.ext_instl_tot = this.accNoEnteredForTransaction.ext_instl_tot;
    // toReturn.mat_status = this.accNoEnteredForTransaction.mat_status;
    // toReturn.acc_status = this.accNoEnteredForTransaction.acc_status;
    // toReturn.curr_bal = this.accNoEnteredForTransaction.curr_bal;
    // toReturn.clr_bal = this.accNoEnteredForTransaction.clr_bal;
    // toReturn.standing_instr_flag = this.accNoEnteredForTransaction.standing_instr_flag;
    // toReturn.cheque_facility_flag = this.accNoEnteredForTransaction.cheque_facility_flag;
    toReturn.approval_status = 'A';
    // toReturn.approval_status = this.accNoEnteredForTransaction.approval_status;
    // toReturn.approved_by = this.accNoEnteredForTransaction.approved_by;
    toReturn.approved_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    // toReturn.approved_dt = this.accNoEnteredForTransaction.approved_dt;
    toReturn.approved_dt = this.sys.CurrentDate;
    // toReturn.user_acc_num = this.accNoEnteredForTransaction.user_acc_num;
    // toReturn.lock_mode = this.accNoEnteredForTransaction.lock_mode;
    // toReturn.loan_id = this.accNoEnteredForTransaction.loan_id;
    // toReturn.cert_no = this.td.cert_no.value;
    // toReturn.bonus_amt = this.accNoEnteredForTransaction.bonus_amt;
    // toReturn.penal_intt_rt = this.accNoEnteredForTransaction.penal_intt_rt;
    // toReturn.bonus_intt_rt = this.accNoEnteredForTransaction.bonus_intt_rt;
    // toReturn.transfer_flag = this.accNoEnteredForTransaction.transfer_flag;
    // toReturn.transfer_dt = this.accNoEnteredForTransaction.transfer_dt;
    // toReturn.agent_cd = this.accNoEnteredForTransaction.agent_cd;
    // toReturn.cust_name = this.accNoEnteredForTransaction.cust_name;
    // toReturn.cust_type = this.accNoEnteredForTransaction.cust_type;
    // toReturn.sex = this.accNoEnteredForTransaction.sex;
    // toReturn.phone = this.accNoEnteredForTransaction.phone;
    // toReturn.occupation = this.accNoEnteredForTransaction.occupation;
    toReturn.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    toReturn.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    toReturn.constitution_desc = this.accNoEnteredForTransaction.constitution_desc;
    // toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;
    toReturn.acc_cd = this.invComServ.selectedconstitution.filter(e=>e.acc_type_cd==this.accNoEnteredForTransaction.acc_type_cd)[0].acc_cd;

    toReturn.bank_cd=this.accNoEnteredForTransaction.bank_cd;
    toReturn.branch_cd=this.accNoEnteredForTransaction.branch_cd;


    return toReturn;
  }
  private getOperationMaster(): void {
    CcTransComponent.operations=this.invComServ.operations;
    console.log(CcTransComponent.operations);
    this.operations=this.invComServ.operations;
    console.log( this.operations);
    
    debugger

      this.isLoading = false;
          this.AcctTypes = CcTransComponent.operations.filter(e => e.module_type === 'INVESTMENT')
            .filter((thing, i, arr) => {
              return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
            });
          this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
          debugger
    
    console.log(this.AcctTypes);

  }
  mappTddefTransFrom(): td_def_trans_trf {
    debugger;
    const toReturn = new td_def_trans_trf();
    // const accTypeCd = this.accNoEnteredForTransaction.acc_type_cd;

    // if (!this.editDeleteMode) {
      const selectedOperation = CcTransComponent.operations.filter(e => e.oprn_cd === (this.showTranDtlRe==true?38:39))[0];
      console.log(selectedOperation)
        debugger
      const accTypeCd = this.accNoEnteredForTransaction.acc_type_cd;
      // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
      toReturn.trans_dt = this.sys.CurrentDate;
      toReturn.acc_type_cd = this.td.acc_type_cd.value;
      toReturn.acc_num = this.td.acc_num.value;
      toReturn.trans_type = this.td.trans_type_key.value;
      toReturn.trans_mode = this.td.trans_mode.value;
      toReturn.voucher_dt = this.td.voucher_dt.value;
      // toReturn.paid_to = this.td.paid_to.value;
      // toReturn.token_num = this.td.token_num.value;
      toReturn.trf_type = this.td.trf_type.value;
      toReturn.home_brn_cd = this.resBrnCd != this.sys.BranchCode ? this.resBrnCd : this.sys.BranchCode;
      toReturn.remarks = selectedOperation.oprn_desc.toLocaleLowerCase()=='renewal'?'renewal':'close'
      toReturn.intra_branch_trn = this.resBrnCd != this.sys.BranchCode ? 'Y' : 'N'
      debugger
        console.log(toReturn)
        toReturn.curr_prn_recov = Number(this.td.amount.value) + Number(this.td.interest.value);
        toReturn.ovd_prn_recov = this.accNoEnteredForTransaction3.prn_amt;
        // toReturn.curr_intt_recov = Number(this.accDtlsFrm.controls.mat_amt.value)==Number(this.td.amount)?this.accDtlsFrm.controls.intt_amt.value:'';
        toReturn.curr_intt_recov =this.exeintt?(this.exeintt):0+(+this.masterModel.tmdepositInv.intt_amt);
        toReturn.ovd_intt_recov = Number(this.td.ovd_intt_recov.value);
        console.log(this.td.amount.value,this.accDtlsFrm.controls.mat_amt.value);
        
        toReturn.amount = Number(this.td.amount.value)===Number(this.accDtlsFrm.controls.mat_amt.value)?0:Number(this.accDtlsFrm.controls.mat_amt.value)-Number(this.td.amount.value)-Number(this.td.ovd_intt_recov.value);
        console.log( toReturn.amount);
        debugger

        if (this.tdDefTransFrmC.controls.trans_mode.value == 'C') {
          toReturn.amount = this.tdDefTransFrmC.controls.amount.value;
          toReturn.curr_intt_recov = this.tdDefTransFrmC.controls.curr_intt_recov.value;
        } 
        // else {
          
        //   if (this.td.trans_mode.value == 'R') {
        //     debugger
        //     console.log(toReturn.amount + " " + toReturn.curr_intt_recov)
        //     debugger
        //     toReturn.amount = (this.td.amount.value==this.accNoEnteredForTransaction.mat_amt)?0:this.td_deftranstrfList[0].amount;
        //     if (toReturn.acc_type_cd == 23 && this.editDeleteMode && this.td.trf_type.value == 'T') {
        //       toReturn.trans_type = 'D' 
        //     } 
        //   } else {
        //     toReturn.amount = this.td.amount.value;
        //   }
        // }

      // toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
      // toReturn.instrument_dt = this.td.instrument_dt.value === '' ? null : this.td.instrument_dt.value;
      if (this.td.particulars.value === null ||
        this.td.particulars.value === ''|| this.td.particulars.value === undefined) {
          debugger
        if (selectedOperation.oprn_desc.toLocaleLowerCase() !== 'close') {
          // if (accTypeCd === 22
          //   || accTypeCd === 23
          //   || accTypeCd === 24
          //   || accTypeCd === 25
          // ) {
          //   toReturn.particulars = this.td.particulars.value;
          // } else {
            console.log(this.td.trf_type.value);
            
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
        else {
          debugger
          if (this.tdDefTransFrmC.controls.trf_type.value === 'C') {
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              toReturn.particulars = 'TO CASH ';
            } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
              toReturn.particulars = 'BY CASH ';
            }

          } else {
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              // console.log('2831')
              toReturn.particulars = 'TO TRANSFER :' + this.tdDefTransFrmC.controls.acc_num.value;
            } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit' || selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
              toReturn.particulars = 'BY TRANSFER :' + this.tdDefTransFrmC.controls.acc_num.value;
            }
          }
        }
      } else {
        debugger
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

      // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close' &&
      //   (accTypeCd === 1 || accTypeCd === 8)) {
      //   toReturn.particulars = 'To Closing';
      //   // debugger
      //   this.tdDefTransFrm.patchValue({
      //     particulars: 'By closing of A/C No:' + this.td.acc_num.value
      //   })
      //   toReturn.curr_intt_recov = +this.td.closeIntrest.value;
      // }
      

      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal'
        && this.td.trf_type.value === '') {
        toReturn.trans_type = 'T';
      }
      toReturn.approval_status = 'U';
      toReturn.brn_cd = this.sys.BranchCode;

      if (this.td.trf_type.value === 'T') {
        toReturn.tr_acc_cd = 10000;
        debugger
      } else if (this.td.trf_type.value === 'C') {
        toReturn.tr_acc_cd = 21101;
      }
      // if ((+this.f.acc_type_cd.value) === 2) {
      //   toReturn.acc_cd = 14301;
      // }
      
      ///here else if is made a marker for making intt cd 
      
        debugger
        console.log(toReturn)
        toReturn.curr_prn_recov = Number(this.td.amount.value) + Number(this.td.interest.value);
        toReturn.ovd_prn_recov = this.accNoEnteredForTransaction3.prn_amt;
        // toReturn.curr_intt_recov = this.td.interest.value;
        //toReturn.curr_intt_recov = this.masterModel.tmdepositInv.intt_amt//to be change
        //toReturn.curr_intt_recov = this.td.interest.value;//to be change
debugger
        toReturn.ovd_intt_recov = Number(this.td.ovd_intt_recov.value);
        console.log(this.tdDefTransFrm.controls.amount.value)
        console.log( toReturn.curr_intt_recov);
        
        
      // }
      this.accNoEnteredForTransaction;
      this.accNoEnteredForTransaction;
      this.accNoEnteredForTransaction3;
      debugger;
      console.log(toReturn)
      debugger;
    if(this.editDeleteMode==true){
      toReturn.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      toReturn.modified_dt = this.sys.CurrentDate;
      toReturn.trans_cd=this.td.trans_cd.value;
     }
   
    
    // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment')
     //marker1
    toReturn.acc_cd = this.invComServ.selectedconstitution.filter(e=>e.acc_type_cd==accTypeCd)[0].acc_cd;
     console.log(toReturn.acc_cd)
     debugger
    toReturn.disb_id = 1;
    toReturn.home_brn_cd = this.resBrnCd != this.sys.BranchCode ? this.resBrnCd : this.sys.BranchCode;
    toReturn.intra_branch_trn = this.resBrnCd != this.sys.BranchCode ? 'Y' : 'N'
    ////////////debugger;
    // console.log({"ss":toReturn.particulars,"sss":this.td.particulars.value.split(' ')[0],"replace":this.td.particulars.value})
    console.log(toReturn)
    return toReturn;
    // return;
  }
  mappTddefTransAndTransFrFromFrm(): td_def_trans_trf {
    debugger;
    // debugger;
    // if(!this.editDeleteMode){
    // selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    // selectedOperation=selectedOperation.oprn_cd
    // }
    // else{
    // const selectedOperation =this.f.trans_type;

    // }
    let k = this.operations.filter(e => e.oprn_cd === (this.showTranDtlRe==true?38:39))[0]
    console.log(k);
    this.remarks=this.accNoEnteredForTransaction2.remarks;
    const selectedOperation = this.editDeleteMode ? this.remarks : k.oprn_desc;
    console.log(selectedOperation);
    debugger
    const toReturn = new td_def_trans_trf();
    const accTypeCd = this.accNoEnteredForTransaction.acc_type_cd;
    // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
    toReturn.trans_dt = this.sys.CurrentDate;
    toReturn.acc_type_cd = this.td.acc_type_cd.value;
    // toReturn.home_brn_cd=toReturn.acc_num.substring(0,3);
    // toReturn.intra_branch_trn=toReturn.acc_num.substring(0,3)!=this.sys.BranchCode?'Y':'N'
    // console.log(toReturn.home_brn_cd+" "+toReturn.intra_branch_trn)
    toReturn.acc_num = this.td.acc_num.value;
    //////////debugger;
    // toReturn.trans_mode = this.td.trans_mode.value;
    // toReturn.paid_to = this.td.paid_to.value;
    // toReturn.token_num = this.td.token_num.value;
    toReturn.trf_type = this.td.trf_type.value;
    toReturn.voucher_dt = this.td.voucher_dt.value;

    
    // switch (selectedOperation.oprn_desc.toLocaleLowerCase()) {
    switch (selectedOperation.toLocaleLowerCase()) {
      case 'close':
      case 'withdraw':
        toReturn.trans_type = 'D';
        break;
      case 'renewal':
      case 'deposit':
        toReturn.trans_type = 'W';
        break;

      
    }

    if (selectedOperation.toLocaleLowerCase() === 'close') {
      toReturn.amount = this.accNoEnteredForTransaction.prn_amt;
      toReturn.curr_intt_recov = this.accNoEnteredForTransaction.intt_amt;
    } else {
      // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
      if (selectedOperation.toLocaleLowerCase() === 'renewal') {
        debugger
        console.log(toReturn.amount + " " + toReturn.curr_intt_recov)
        debugger
        toReturn.amount = this.td.interest.value;
        if (this.editDeleteMode && this.td.trf_type.value == 'T') {
          toReturn.trans_type = 'D'  //marker (while renewal send deposit trans type)
        } 
      } else {
        toReturn.amount = this.td.amount.value;
      }
    }
    // toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
    // toReturn.instrument_dt = this.td.instrument_dt.value === '' ? null : this.td.instrument_dt.value;
    if (this.td.particulars.value === null ||
      this.td.particulars.value === ''|| this.td.particulars.value === undefined) {
      if (selectedOperation.toLocaleLowerCase() !== 'close') {
        // if (selectedOperation.oprn_desc.toLocaleLowerCase() !== 'close') {
        // if (accTypeCd === 2
        //   || accTypeCd === 3
        //   || accTypeCd === 4
        //   || accTypeCd === 5
        //   || accTypeCd === 11
        //   ) {
        //   toReturn.particulars = this.td.particulars.value;
        // } else {
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
          if (selectedOperation.oprn_desctoLocaleLowerCase() === 'withdraw') {
            console.log(this.td.trans_mode.value)
            console.log('1721')
            toReturn.particulars = 'TO TRANSFER :' + this.td.acc_num.value;
            // } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
          } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
            toReturn.particulars = 'BY TRANSFER FROM :' + this.td.acc_num.value;
          }
          else{
            toReturn.particulars ='ABX'
          }
        }
      }
    } else {
      // console.log("2706")
      //debugger;
      console.log(toReturn.particulars + " " + selectedOperation.toLocaleLowerCase() + " " + toReturn.trf_type)
      //debugger;
      //  if(selectedOperation.toLocaleLowerCase()=='close' && toReturn.trf_type=='T'){
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
    // && this.invComServ.selectedconstitution[0].acc_type_cd == accTypeCd
      if (this.invComServ.selectedconstitution[0].constitution_cd == this.accNoEnteredForTransaction.constitution_cd ) {
        toReturn.acc_cd = this.invComServ.selectedconstitution[0].acc_cd
        console.log(toReturn.acc_cd)
        debugger
      }
    
      debugger
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

      //...................... toReturn.curr_prn_recov = Number(this.td.amount.value) + Number(this.td.interest.value);
      //....................... toReturn.curr_intt_recov = this.accNoEnteredForTransaction.intt_amt;
      
      toReturn.curr_prn_recov = Number(this.td.amount.value) + Number(this.td.interest.value);
      toReturn.ovd_prn_recov = this.accNoEnteredForTransaction.prn_amt;
      toReturn.curr_intt_recov = this.td.interest.value;
      toReturn.ovd_intt_recov = 0;
    }
    else {
      toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;

      //to be removed in case the other acc type cd gets interchanged
      // for(let i=0;i<CcTransComponent.constitutionList.length;i++){
      //   if(CcTransComponent.constitutionList[i].constitution_cd==this.constCd && CcTransComponent.constitutionList[i].acc_type_cd==6)
      //  { toReturn.acc_cd=CcTransComponent.constitutionList[i].intt_acc_cd
      //   console.log(toReturn.acc_cd)
      // }
      // }
    } //marker
    toReturn.disb_id = 1;
    toReturn.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    toReturn.acc_cd = this.invComServ.selectedconstitution[0].acc_cd
    console.log(toReturn.acc_cd)
    debugger
    // console.log( {"toReturn.particulars":toReturn.particulars," this.td.particulars.value": this.td.particulars.value})
    console.log(toReturn)
    return toReturn;
  }
  mappTddefTransFrClose(): td_def_trans_trf {
    console.log(this.tdDefTransFrmC.controls);

    debugger;
    const toReturn = new td_def_trans_trf();
    // const accTypeCd = this.accNoEnteredForTransaction.acc_type_cd;

    // if (!this.editDeleteMode) {
      const selectedOperation = CcTransComponent.operations.filter(e => e.oprn_cd === (this.showTranDtlRe==true?38:39))[0];
      console.log(selectedOperation)
        debugger
      const accTypeCd = this.accNoEnteredForTransaction.acc_type_cd;
      // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
      toReturn.trans_dt = this.sys.CurrentDate;
      toReturn.instl_start_dt=this.tdDefTransFrmC.controls.acc_close_dt.value;
      toReturn.acc_type_cd = this.tdDefTransFrmC.controls.acc_type_cd.value;
      toReturn.acc_num = this.tdDefTransFrmC.controls.acc_num.value;
      toReturn.trans_type = this.tdDefTransFrmC.controls.trans_type_key.value;
      toReturn.trans_mode = this.tdDefTransFrmC.controls.trans_mode.value;
      toReturn.voucher_dt = this.tdDefTransFrmC.controls.voucher_dt.value;
      // toReturn.paid_to = this.td.paid_to.value;
      // toReturn.token_num = this.td.token_num.value;
      toReturn.trf_type = this.tdDefTransFrmC.controls.trf_type.value;
      toReturn.home_brn_cd = this.resBrnCd != this.sys.BranchCode ? this.resBrnCd : this.sys.BranchCode;
      toReturn.remarks = selectedOperation.oprn_desc.toLocaleLowerCase()=='renewal'?'renewal':'close'
      toReturn.intra_branch_trn = this.resBrnCd != this.sys.BranchCode ? 'Y' : 'N'
      debugger
        console.log(toReturn)
        toReturn.curr_prn_recov =this.tdDefTransFrmC.controls.amount.value;
        toReturn.ovd_prn_recov = this.accNoEnteredForTransaction3.prn_amt;
        // toReturn.curr_intt_recov = Number(this.accDtlsFrm.controls.mat_amt.value)==Number(this.td.amount)?this.accDtlsFrm.controls.intt_amt.value:'';
        toReturn.curr_intt_recov = this.tdDefTransFrmC.controls.curr_intt_recov.value;
        toReturn.ovd_intt_recov = this.tdDefTransFrmC.controls.ovd_intt_recov.value;
        console.log(this.tdDefTransFrmC.controls.amount.value,this.accDtlsFrm.controls.mat_amt.value);
        toReturn.curr_intt_rate=this.accNoEnteredForTransaction3.intt_rt;
        // toReturn.curr_intt_rate=this.editDeleteMode?this.tdDefTransFrmC.controls.eff_intt.value:this.accNoEnteredForTransaction3.intt_rt;
        // toReturn.amount =  Number(this.tdDefTransFrmC.controls.amount.value) + Number(this.tdDefTransFrmC.controls.curr_intt_recov.value);
        toReturn.amount = this.tdDefTransFrmC.controls.amount.value;
        console.log("pppp",this.tdDefTransFrmC.controls.acc_close_dt.value);
        
        console.log( toReturn.amount);
        debugger

        if (this.tdDefTransFrmC.controls.particulars.value === null ||
        this.tdDefTransFrmC.controls.particulars.value === ''|| this.tdDefTransFrmC.controls.particulars.value === undefined) {
        
          debugger
          if (this.tdDefTransFrmC.controls.trf_type.value === 'C') {
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              toReturn.particulars = 'TO CASH ';
            } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
              toReturn.particulars = 'BY CASH ';
            }

          } else {
            if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
              // console.log('2831')
              toReturn.particulars = 'TO TRANSFER :' + this.tdDefTransFrmC.controls.acc_num.value;
            }
          }
        
      } else {
        debugger
        toReturn.particulars = this.tdDefTransFrmC.controls.particulars.value;
        console.log(this.tdDefTransFrmC.controls.particulars.value)

        //   if(accTypeCd==5) //marker
        // toReturn.particulars = this.td.particulars.value.split(' ')[0]==="BY"?  this.td.particulars.value.replace("BY","TO"):this.td.particulars.value.replace("TO","BY");
        ////////////debugger;
        console.log({ "toReturn.remarks": toReturn.remarks, " this.tdDefTransFrmC.controls.particulars.value": this.tdDefTransFrmC.controls.particulars.value })
        debugger
      }
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close'
        && this.tdDefTransFrmC.controls.trf_type.value === '') {
        toReturn.trans_type = 'T';
      }
      toReturn.approval_status = 'U';
      toReturn.brn_cd = this.sys.BranchCode;

      if (this.tdDefTransFrmC.controls.trf_type.value === 'T') {
        toReturn.tr_acc_cd = 10000;
        debugger
      } else if (this.tdDefTransFrmC.controls.trf_type.value === 'C') {
        toReturn.tr_acc_cd = 21101;
      }
      debugger;
      console.log(toReturn)
      debugger;
    if(this.editDeleteMode==true){
      toReturn.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      toReturn.modified_dt = this.sys.CurrentDate;
      toReturn.trans_cd=this.tdDefTransFrmC.controls.trans_cd.value;

    }
    
    // if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment')
     //marker1
    toReturn.acc_cd = this.invComServ.selectedconstitution.filter(e=>e.acc_type_cd==accTypeCd)[0].acc_cd;

    //  toReturn.acc_cd = this.invComServ.selectedconstitution[0].acc_cd
     console.log(toReturn.acc_cd)
     debugger
    toReturn.disb_id = 1;
    toReturn.home_brn_cd = this.resBrnCd != this.sys.BranchCode ? this.resBrnCd : this.sys.BranchCode;
    toReturn.intra_branch_trn = this.resBrnCd != this.sys.BranchCode ? 'Y' : 'N'
    ////////////debugger;
    // console.log({"ss":toReturn.particulars,"sss":this.td.particulars.value.split(' ')[0],"replace":this.td.particulars.value})
    console.log(toReturn)
    return toReturn;
    // return;
  }
  mappTddefTransAndTransFrClose(): td_def_trans_trf {
    console.log(this.tdDefTransFrmC.controls);
    
    debugger;
    // debugger;
    // if(!this.editDeleteMode){
    // selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    // selectedOperation=selectedOperation.oprn_cd
    // }
    // else{
    // const selectedOperation =this.f.trans_type;

    // }
    let k = this.operations.filter(e => e.oprn_cd === (this.showTranDtlRe==true?38:39))[0]
    console.log(k);
    this.remarks=this.accNoEnteredForTransaction2.remarks;
    const selectedOperation = this.editDeleteMode ? this.remarks : k.oprn_desc;
    console.log(selectedOperation);
    debugger
    const toReturn = new td_def_trans_trf();
    const accTypeCd = this.accNoEnteredForTransaction.acc_type_cd;
    // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
    toReturn.trans_dt = this.sys.CurrentDate;
    toReturn.acc_type_cd = this.tdDefTransFrmC.controls.acc_type_cd.value;
    // toReturn.home_brn_cd=toReturn.acc_num.substring(0,3);
    // toReturn.intra_branch_trn=toReturn.acc_num.substring(0,3)!=this.sys.BranchCode?'Y':'N'
    // console.log(toReturn.home_brn_cd+" "+toReturn.intra_branch_trn)
    toReturn.acc_num = this.tdDefTransFrmC.controls.acc_num.value;
    //////////debugger;
    // toReturn.trans_mode = this.td.trans_mode.value;
    // toReturn.paid_to = this.td.paid_to.value;
    // toReturn.token_num = this.td.token_num.value;
    toReturn.trf_type = this.tdDefTransFrmC.controls.trf_type.value;

    
    // switch (selectedOperation.oprn_desc.toLocaleLowerCase()) {
    switch (selectedOperation.toLocaleLowerCase()) {
      case 'close':
      case 'withdraw':
        toReturn.trans_type = 'D';
        break;
      case 'renewal':
      case 'deposit':
        toReturn.trans_type = 'W';
        break;

      
    }

    if (selectedOperation.toLocaleLowerCase() === 'close' && (accTypeCd === 22||accTypeCd === 23||accTypeCd === 24)) {
      toReturn.amount = this.accNoEnteredForTransaction.prn_amt;
      toReturn.curr_intt_recov = this.accNoEnteredForTransaction.intt_amt;
    }
    // toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
    // toReturn.instrument_dt = this.td.instrument_dt.value === '' ? null : this.td.instrument_dt.value;
    if (this.tdDefTransFrmC.controls.particulars.value === null ||
      this.tdDefTransFrmC.controls.particulars.value === ''|| this.tdDefTransFrmC.controls.particulars.value === undefined) 
      
      // console.log("2706")
      //debugger;
      console.log(toReturn.particulars + " " + selectedOperation.toLocaleLowerCase() + " " + toReturn.trf_type)
      debugger;
       if(selectedOperation.toLocaleLowerCase()=='close' && toReturn.trf_type=='T'){
        toReturn.particulars='To Closing'
       }
      //  else
      //     { console.log('3148')
      if (!this.editDeleteMode && this.tdDefTransFrmC.controls.trans_mode.value != 'C')
        toReturn.particulars = this.tdDefTransFrmC.controls.particulars.value.split(' ')[0] === "BY" ? this.tdDefTransFrmC.controls.particulars.value.replace("BY", "TO") : this.tdDefTransFrmC.controls.particulars.value.replace("TO", "BY");
    
    // toReturn.particulars = this.td.particulars.value.split(' ')[1]==="BY"?  this.td.particulars.value.replace("BY","TO"):this.td.particulars.value.replace("TO","BY");
    console.log(toReturn.particulars + " " + selectedOperation.toLocaleLowerCase() + " " + toReturn.trf_type)

    //  }

    if (selectedOperation.toLocaleLowerCase() === 'close' && this.tdDefTransFrmC.controls.trf_type.value === '') {
      toReturn.trans_type = 'T';
    }
    toReturn.approval_status = 'U';
    toReturn.brn_cd = this.sys.BranchCode;
    // && this.invComServ.selectedconstitution[0].acc_type_cd == accTypeCd
      if (this.invComServ.selectedconstitution[0].constitution_cd == this.accNoEnteredForTransaction.constitution_cd ) {
        toReturn.acc_cd = this.invComServ.selectedconstitution[0].acc_cd
        console.log(toReturn.acc_cd)
        debugger
      }
    
      debugger
    if (this.tdDefTransFrmC.controls.trf_type.value === 'T') {
      toReturn.tr_acc_cd = 10000;
      
    } else if (this.tdDefTransFrmC.controls.trf_type.value === 'C') {
      toReturn.tr_acc_cd = 21101;
    }
    // if ((+this.f.acc_type_cd.value) === 2) {
    //   toReturn.acc_cd = 14301;
    // }
    // if ((+this.f.acc_type_cd.value) === 6) {
    //   toReturn.acc_cd = 14302;
    // }
    
      toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;

      //to be removed in case the other acc type cd gets interchanged
      // for(let i=0;i<CcTransComponent.constitutionList.length;i++){
      //   if(CcTransComponent.constitutionList[i].constitution_cd==this.constCd && CcTransComponent.constitutionList[i].acc_type_cd==6)
      //  { toReturn.acc_cd=CcTransComponent.constitutionList[i].intt_acc_cd
      //   console.log(toReturn.acc_cd)
      // }
      // }
     //marker
    toReturn.disb_id = 1;
    toReturn.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    toReturn.acc_cd = this.invComServ.selectedconstitution.filter(e=>e.acc_type_cd==accTypeCd)[0].acc_cd;

    console.log(toReturn.acc_cd)
    debugger
    // console.log( {"toReturn.particulars":toReturn.particulars," this.td.particulars.value": this.td.particulars.value})
    console.log(toReturn)
    return toReturn;
  }
  onResetClick(): void {
  debugger
  this.accNoEnteredForTransaction=[]
  this.accNoEnteredForTransaction2=[]
  this.accNoEnteredForTransaction3=[]
  this.invComServ.accNoEnteredForTransaction=[]
  this.invComServ.accNoEnteredForTransaction2=null
  this.showtransdetails = false;
  this.showTranDtlCl=false;
  this.showTranDtlRe=false;
  this.invComServ.showTranDtlCl=false;
  this.invComServ.showTranDtlRe=false;
  this.editDeleteMode = false;
  this.masterModel=null;
  this.showBalance = false
  this.accDtlsFrm.reset();
  this.tdDefTransFrm.reset();
  this.tdDefTransFrmC.reset();
  
  this.td_deftranstrfList = [];
  this.TrfTotAmt=0
  this.mat_val = 0 
  this.i_trans.onResetClick();
  this.router.navigate([this.sys.BankName + '/la']);
  this.i_trans.ngOnInit();
}
  onRenewalSelect(){
    debugger
    this.setTrnsDtlsFrmForm();
    this.showTranDtlRe=true;
    this.invComServ.showTranDtlRe=true;
  }
  onCloseSelect(){
    
    this.counter = 0;
    this.counter1 = 0;
    let isMatured = false;
    this.isMat = isMatured
    const cDt = this.sys.CurrentDate.getTime();
    const matDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString()).getTime();
    if (cDt >= matDt) {
      isMatured = true;
      this.isMat = isMatured

      console.log(isMatured)

    }
    else {
      isMatured = false;
      this.isMat = isMatured

      console.log(isMatured)
      }
      let acc_desc=''
      if (this.accNoEnteredForTransaction.acc_type_cd ==22) {
        acc_desc = 'Fixed Deposit';
      }
      else if (this.accNoEnteredForTransaction.acc_type_cd ==23) {
        acc_desc = 'Term Deposit';
      }
      else if (this.accNoEnteredForTransaction.acc_type_cd ==24) {
        acc_desc = 'Special TD';
      }
      else if (this.accNoEnteredForTransaction.acc_type_cd ==25) {
        acc_desc = 'RD';
      }
    if( this.isMat==false){
        
            console.log(Number(this.accNoEnteredForTransaction.prn_amt),Number(this.closeInt));
            
            debugger
            this.tdDefTransFrmC.patchValue({
                  trans_dt: this.accNoEnteredForTransaction.trans_dt,
                  trans_cd:this.editDeleteMode?this.accNoEnteredForTransaction2.trans_cd:'',
                  acc_type_desc: acc_desc,
                  acc_type_cd: this.accNoEnteredForTransaction.acc_type_cd,
                  acc_num: this.accNoEnteredForTransaction.acc_num,
                  trf_type:this.editDeleteMode?this.accNoEnteredForTransaction2.trf_type:'',
                  trans_mode1:this.editDeleteMode?(this.accNoEnteredForTransaction2.trans_mode=='C'?'Close':'Renewal'):'Close',
                  trans_mode: this.editDeleteMode?this.accNoEnteredForTransaction2.trans_mode:'C',
                  trans_type: this.editDeleteMode?(this.accNoEnteredForTransaction2.trans_type=='W'?'withdrawal':'Deposit'):'withdrawal',
                  trans_type_key:this.editDeleteMode? this.accNoEnteredForTransaction2.trans_type:'W',
              penal_rt:0
            });
            
              console.log("inside cc Close")
              
              console.log(this.accNoEnteredForTransaction.intt_rt + " " + this.sys.PenalInttRtFrAccPreMatureClosing)
              const cDtC = this.sys.CurrentDate.getTime();
              const opDt = Utils.convertStringToDt(this.accNoEnteredForTransaction.opening_dt.toString()).getTime();
              const diffDays = Math.ceil((Math.abs(cDtC - opDt)) / (1000 * 3600 * 24));
              this.diff = diffDays
              console.log(cDtC + " " + opDt + " " + diffDays)
              console.log(this.accNoEnteredForTransaction)
              const temp_gen_param = new p_gen_param();

              temp_gen_param.ad_acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
              temp_gen_param.ad_prn_amt = this.accNoEnteredForTransaction.prn_amt;
              temp_gen_param.adt_temp_dt = this.accNoEnteredForTransaction.opening_dt;
              temp_gen_param.ai_period = diffDays;
              temp_gen_param.ad_intt_rt = this.accNoEnteredForTransaction.intt_rt - this.sys.PenalInttRtFrAccPreMatureClosing
              this.effInt = temp_gen_param.ad_intt_rt > 0 ? temp_gen_param.ad_intt_rt : 0
              console.log(this.effInt)
              
              if (isMatured == false && this.editDeleteMode==false ) {
                this.modalRefClose = this.modalService.show(this.preClose,
                  { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: true })
              }
            
              this.effInt = this.editDeleteMode?this.accNoEnteredForTransaction2.curr_intt_rate: 3.5
                  temp_gen_param.ad_intt_rt = this.effInt

                  this.svc.addUpdDel<any>('INVESTMENT/F_CALCTDINTT_INV_REG', temp_gen_param).subscribe(
                    res => {
                      console.log(res)
                      this.closeInt = res;

                        console.log("hello")
                        
                        if(this.editDeleteMode){////////////////////////////////kk
                          debugger
                          this.tdDefTransFrmC.patchValue({
                              amount: (this.accNoEnteredForTransaction.prn_amt),
                              curr_intt_recov:this.accNoEnteredForTransaction2.curr_intt_recov,
                              ovd_intt_recov: this.accNoEnteredForTransaction2.ovd_intt_recov,
                              matVal:(Number(this.accNoEnteredForTransaction.prn_amt)+Number(this.accNoEnteredForTransaction2.curr_intt_recov))-Number(this.accNoEnteredForTransaction2.ovd_intt_recov),
                              bonus_amt: 0,
                              curr_prn_recov: 0,
                            });
                        }
                        else{
                          debugger
                        this.tdDefTransFrmC.patchValue({
                          amount: (this.accNoEnteredForTransaction.prn_amt),
                          curr_intt_recov: isMatured ? this.accNoEnteredForTransaction.intt_amt : this.closeInt,
                          ovd_intt_recov: 0,
                          matVal:!isMatured?(Number(this.accNoEnteredForTransaction.prn_amt)+Number(this.closeInt))-Number(this.accNoEnteredForTransaction2.ovd_intt_recov):(Number(this.accNoEnteredForTransaction.prn_amt)+Number(this.accNoEnteredForTransaction.intt_amt))-Number(this.accNoEnteredForTransaction2.ovd_intt_recov),
                          bonus_amt: 0,
                          curr_prn_recov: 0,
                        });
                      }
                    })
                
              this.tdDefTransFrmC.controls.amount.disable();
              console.log(this.tdDefTransFrmC.controls.amount.value, this.closeInt, this.accNoEnteredForTransaction.prn_amt, this.accNoEnteredForTransaction.intt_amt)
              this.showTranDtlCl=true;
              this.invComServ.showTranDtlCl=true;
              
             }
            else{
              this.setTrnsDtlsCloseFrm();
              // this.showTranDtlCl=true;
            }
            if(this.editDeleteMode==true){
              this.tdDefTransFrmC.patchValue({
                  trans_dt: this.accNoEnteredForTransaction.trans_dt,
                  trans_cd:this.editDeleteMode?this.accNoEnteredForTransaction2.trans_cd:'',
                  acc_type_desc: acc_desc,
                  acc_type_cd: this.accNoEnteredForTransaction.acc_type_cd,
                  acc_num: this.accNoEnteredForTransaction.acc_num,
                  amount: this.accNoEnteredForTransaction2.curr_prn_recov,
                  curr_intt_recov: this.accNoEnteredForTransaction2.curr_intt_recov,
                  ovd_intt_recov:this.accNoEnteredForTransaction2.ovd_intt_recov,
                  bonus_amt: 0,
                  curr_prn_recov: 0,
                  trf_type:this.accNoEnteredForTransaction2.trf_type,
                  trans_mode1:this.accNoEnteredForTransaction2.trans_mode=='C'?'Close':'Renewal',
                  trans_mode: this.accNoEnteredForTransaction2.trans_mode,
                  trans_type: this.accNoEnteredForTransaction2.trans_type=='W'?'withdrawal':'Deposit',
                  trans_type_key: this.accNoEnteredForTransaction2.trans_type,
                  matVal:(Number(this.accNoEnteredForTransaction2.amount) + Number(this.accNoEnteredForTransaction2.curr_intt_recov)-Number(this.accNoEnteredForTransaction2.ovd_intt_recov)),

                });
              if(this.accNoEnteredForTransaction2.trf_type=='T' && this.accNoEnteredForTransaction2.trans_type=='W'){
                debugger
                this.acc_master= this.invComServ.acc_master
                this.addTransfer();
                console.log(this.invComServ.acc_master);
                console.log(this.acc_master);
                this.td_deftranstrfList=this.masterModel.tddeftranstrf;
                // for(let i=0; i<this.td_deftranstrfList.length; i++){
                  
                //   this.td_deftranstrfList[i].gl_acc_code = this.masterModel.tddeftranstrf[i].acc_cd;
                //   this.acc_master1= this.acc_master.filter(x => x.acc_cd.toString().includes(this.td_deftranstrfList[i].gl_acc_code));
                //   this.td_deftranstrfList[i].gl_acc_desc=this.acc_master1[i].acc_name;
                //   debugger
                // }
                this.td_deftranstrfList[0].gl_acc_code = this.masterModel.tddeftranstrf[0].acc_cd;
                this.acc_master1= this.acc_master.filter(x => x.acc_cd.toString().includes(this.td_deftranstrfList[0].gl_acc_code));
                this.td_deftranstrfList[0].gl_acc_desc=this.acc_master1[0].acc_name;
                console.log(this.acc_master1);
                // this.sumTransfer()
                console.log(this.td_deftranstrfList);
                this.showtransdetails=true;
              }
             }
    
    }
    
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
  hideModalForClose() {
    this.modalRefClose.hide()
  }
  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  AddExtraIntt(i:any){
    if(this.td.amount.value){
      this.exeintt=0;
      if(i<0){
        this.exeintt=(Number(this.accNoEnteredForTransaction.intt_amt)- Number(i.target.value));
        this.td.prev_intt_amt.setValue(Number(this.accNoEnteredForTransaction.intt_amt)- Number(i.target.value));
        this.td.amount.setValue(Number(this.accNoEnteredForTransaction.prn_amt) + (Number(this.accNoEnteredForTransaction.intt_amt))-(i.target.value)-(this.td.ovd_intt_recov.value?this.td.ovd_intt_recov.value:0))
      }
      else{
        this.exeintt=(Number(this.accNoEnteredForTransaction.intt_amt)+ Number(i.target.value));
        this.td.prev_intt_amt.setValue( Number(this.accNoEnteredForTransaction.intt_amt)+ Number(i.target.value));
        this.td.amount.setValue(Number(this.accNoEnteredForTransaction.prn_amt)+(Number(this.accNoEnteredForTransaction.intt_amt))+ (Number(i.target.value)) - Number(this.td.ovd_intt_recov.value?this.td.ovd_intt_recov.value:0))
      }
      // this.td.amount.setValue((this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt)-this.td.ovd_intt_recov.value)
      // this.accDtlsFrm.controls.mat_amt.setValue((this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt)-this.td.ovd_intt_recov.value)
      
    debugger
    }
  }
  ChangeRenewintt(i:any){
    if(this.accNoEnteredForTransaction.intt_amt!=i){
      this.manualInterestPut=true;
      debugger
      this.tdDefTransFrm.patchValue({
        trans_type: 'Deposit',
        trans_type_key: 'D',
        balance:0,
        amount:((+this.accNoEnteredForTransaction.prn_amt +(+this.tdDefTransFrm.controls.prev_intt_amt.value)))-(this.td.ovd_intt_recov.value?this.td.ovd_intt_recov.value:0)
      })
      this.showBalance=false;
      this.td_deftranstrfList=[];
      this.showtransdetails=false;
      // this.td.amount.setValue(((this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt)-(+i.target.value))-(this.td.ovd_intt_recov.value?this.td.ovd_intt_recov.value:0))
      
    debugger
    }else{
      this.manualInterestPut=false;
      this.td.amount.setValue((this.accNoEnteredForTransaction.prn_amt+this.accNoEnteredForTransaction.intt_amt+(+i.target.value))-(this.td.ovd_intt_recov.value?this.td.ovd_intt_recov.value:0))
    }
  }
}
