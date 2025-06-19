import { Router } from '@angular/router';
import { AccOpenDM } from '../../../Models/deposit/AccOpenDM';
import {  Component, ElementRef,  OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestService} from 'src/app/_service';
import {
  MessageType, mm_acc_type, mm_customer,
  mm_operation, m_acc_master, ShowMessage, SystemValues,
  td_def_trans_trf, td_intt_dtls, td_rd_installment, tm_deposit, tm_depositall
} from '../../../Models';
import { tm_denomination_trans } from '../../../Models/deposit/tm_denomination_trans';
import { DatePipe } from '@angular/common';
import { tm_transfer } from '../../../Models/deposit/tm_transfer';
import { tt_denomination } from '../../../Models/deposit/tt_denomination';
import { mm_constitution } from '../../../Models/deposit/mm_constitution';
import Utils from 'src/app/_utility/utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { mm_oprational_intr } from '../../../Models/deposit/mm_oprational_intr';

import { InvTranServService } from './inv-tran-serv.service';
import { CcTransComponent } from './cc-trans/cc-trans.component';
@Component({
  selector: 'app-investment-transactions',
  templateUrl: './investment-transactions.component.html',
  styleUrls: ['./investment-transactions.component.css'],
  providers: [DatePipe]
})
export class InvestmentTransactionsComponent implements OnInit {

  constructor(private invComServ:InvTranServService ,private svc: RestService,
    private frmBldr: FormBuilder, public datepipe: DatePipe, private router: Router,
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
  @ViewChild('preClose', { static: true }) preClose: TemplateRef<any>;
  @ViewChild('preCloseDbs', { static: true }) preCloseDbs: TemplateRef<any>;
  @ViewChild('interestMsg', { static: true }) interestMsg: TemplateRef<any>;
  @ViewChild('effint', { static: true }) effint: ElementRef;
  @ViewChild(CcTransComponent) cc_comp:CcTransComponent;
  operations: mm_operation[];
  unApprovedTransactionLst: td_def_trans_trf[] = [];
  unApprovedTransactionLstOfAcc: td_def_trans_trf[] = [];
  selectedUnapprovedTransactionToEdit: td_def_trans_trf;
  disableOperation = true;
  AcctTypes: mm_operation[];
  // transType: DynamicSelect;
  isLoading: boolean;
  resetClicked = false;
  closeInt: any;
  sys = new SystemValues();
  accTransFrm: FormGroup;
  tdDefTransFrm: FormGroup;
  showTransMode = false;
  showTransModeForR = false;
  hideOnClose = false;
  showAmtDrpDn = false;
  disableSave = true;
  TrfTotAmt = 0;
  showInterestDtls = false;
  showRdInstalment = false;
  showMisInstalment = false;
  accDtlsFrm: FormGroup;
  ShadowBalance: number;
  showBalance = false;
  showTransfrTyp = true;
  masterModel = new AccOpenDM();
  suggestedCustomer: any;
  customerList: mm_customer[] = [];
  td_deftrans = new td_def_trans_trf();
  td_deftranstrfList: td_def_trans_trf[] = [];
  tm_transferList: tm_transfer[] = [];
  accountTypeList: mm_acc_type[] = [];
  acc_master: m_acc_master[] = [];
  acc_master1: m_acc_master[] = [];
  tm_deposit = new tm_deposit();
  selectedCust: any;
  accNoEnteredForTransaction: tm_depositall;
  rdInstallemntsForSelectedAcc: td_rd_installment[] = [];
  misInstallemntsForSelectedAcc: td_intt_dtls[] = [];
  preTransactionDtlForSelectedAcc: td_def_trans_trf[] = [];
  rdInstallamentOption: any[] = [];
  showOnRenewal = false;
  showOnClose = false;
  mat_val = 0;
  isMat: any;
  lastInst: any;
  prevTransForDsp: any
  showtransmodeforC = false
  // showTranferType = true;
  showMsg: ShowMessage;
  tm_denominationList: tm_denomination_trans[] = [];
  denominationList: tt_denomination[] = [];
  denominationGrandTotal = 0;
  modalRef: BsModalRef;
  modalRefClose: BsModalRef;
  diff: any;
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
  hidegl:boolean=true;
  glHead:any;
  interestPeriod=0
  intt=0
  inttMsg=''
  joinHold:any=[];
  joinHolddtls:any;
  opnTyp:boolean=true;
  sel_cc:boolean=false;
  sel_mis:boolean=false;
  sel_fd:boolean=false;
  sel_rd:boolean=false;
  showTransactionDtlR:boolean=false;
  showTransactionDtlC:boolean=false;
  resetClick:boolean=false
  ngOnInit(): void {
    this.resetClick=false
    this.isLoading = false;
    setTimeout(() => {
      this.getOperationMaster();
      this.getAccountTypeList();
      // this.getCustomerList();
      this.getDenominationList();
      this.getConstitutionList();
      this.getOperationalInstr();
      this.invComServ.getAllGL();
      // this.getAllCustomer();
    }, 150);
    this.accTransFrm = this.frmBldr.group({
      acc_type_cd: [''],
      oprn_cd: [''],
      acct_num: ['']
    })
  }
  callSaveFunction(){ 
    console.log(this.invComServ.transfer_TYPE);
    
    debugger   
    this.invComServ.SaveButtonClick();    
  } 
  callDeleteFunction(){    
    this.invComServ.DeleteButtonClick(); 
    this.editDeleteMode=false; 
    this.f.acc_type_cd.setValue('');
    this.f.acct_num.setValue('');
  }
  onOperationTypeChange(){
    debugger
    this.accNoEnteredForTransaction=this.masterModel.tmdepositInv;
    console.log(typeof(Number(this.f.oprn_cd.value)));
    console.log(Number(this.f.oprn_cd.value));
    debugger
    // this.onUpapprovedConfirm(this.unApprovedTransactionLstOfAcc[0])
    //for renewal
    if(Number(this.f.oprn_cd.value)===36 ||Number(this.f.oprn_cd.value)===38 ||Number(this.f.oprn_cd.value)===41){
      const m = Utils.convertStringToDt(this.accNoEnteredForTransaction.mat_dt.toString());
      const c = this.sys.CurrentDate;
      const diffDays = Math.ceil((m.getTime() - c.getTime()) / (1000 * 3600 * 24)); 
     
      console.log(c);
      console.log(m);
      console.log(diffDays);
      if(diffDays>0){
        this.HandleMessage(true, MessageType.Error, 'Pre-Mature Renewal is not possible');
        this.showTransactionDtlC = false;
        this.showTransactionDtlR = false;
        this.invComServ.showTranDtlCl=false;
        this.invComServ.showTranDtlRe=false;


       }
      else{
        this.cc_comp.onRenewalSelect();
        this.showTransactionDtlR = true;
        this.showTransactionDtlC = false;
        this.invComServ.showTranDtlCl=false;
      this.invComServ.showTranDtlRe=true;

      }
      
        

    }
    //for close
    if(Number(this.f.oprn_cd.value)===37 ||Number(this.f.oprn_cd.value)===39||Number(this.f.oprn_cd.value)===42){
      this.showTransactionDtlR = false;
      this.invComServ.showTranDtlRe=false;
      this.showTransactionDtlC = true;
      this.invComServ.showTranDtlCl=true;

      this.cc_comp.onCloseSelect();
      
  
      }
  }
  
  /** method fires on account type change */
  public onAcctTypeChange(): void {
    
    this.suggestedCustomer=null
    console.log(this.f.acc_type_cd.value)
    this.tm_denominationList = [];
    this.accNoEnteredForTransaction = undefined;
    this.resetTransfer();
    this.f.acct_num.reset(); this.f.oprn_cd.reset();
     
    
    // this.tdDefTransFrm.reset();
    this.HandleMessage(false);
    const acctTypCdTofilter = +this.f.acc_type_cd.value;
    const acctTypeDesription = InvestmentTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter)[0].acc_type_desc;
      console.log(this.tdDefTransFrm);
      
    // this.tdDefTransFrm.patchValue({
    //   acc_type_desc: acctTypeDesription,
    //   acc_type_cd: acctTypCdTofilter
    // });
    this.operations = InvestmentTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter);
    // this.f.oprn_cd.enable();
    // this.f.acct_num.enable();
    // this.f.oprn_cd.disable();
    // this.refresh = false;
    // this.msg.sendCommonTmDepositAll(null);
    // this.refresh = true;
  }
enable(e:any){
  debugger
  if (e) {
    this.disabledOnNull = false;
  }
  else {
    this.disabledOnNull = true;
  }
}
  SelectCustomer(){
   if(this.masterModel.tddeftrans.approval_status=='U'){
      this.getUnapprovedDepTransAskViewEditOption()
      this.suggestedCustomer=null
    }
   else{
    this.suggestedCustomer=null
    this.getAccountOpeningTempData();
   }
  }
  loadInvData(){
    this.isLoading=true;
    console.log(this.f.acc_type_cd)
    if (this.f.acc_type_cd === null || this.f.acc_type_cd === undefined) {
      // this.showAlertMsg('WARNING', 'Please select Account Type');
      this.HandleMessage(true, MessageType.Warning, 'Please select Account Type');
      this.f.acct_num = null;
      this.isLoading=false;
      return;
    }
    else{
        this.isLoading=true;
      this.tm_deposit.acc_num=this.f.acct_num.value
      this.tm_deposit.ardb_cd=this.sys.ardbCD
      this.svc.addUpdDel<any>('INVESTMENT/GetInvOpeningData', this.tm_deposit).subscribe(
        res => {
          if(res){
            console.log(res);
          this.invComServ.masterModel=res;
          this.masterModel = res;
          this.opnTyp=false;
          if (this.masterModel === undefined || this.masterModel === null) {
            // this.showAlertMsg('WARNING', 'No record found!!');
            this.HandleMessage(true, MessageType.Warning, 'No record found!!');
         
          }
          else if(this.masterModel.tmdepositInv.approval_status=='U'){
            this.HandleMessage(true, MessageType.Warning, 'Account still not approved!');
            this.f.acct_num = null;
           return;}
           if (this.masterModel.tmdepositInv.acc_num !== null) {

            this.invComServ.getBankName();
            this.invComServ.getBranchName(this.masterModel.tmdepositInv.bank_cd);
            this.invComServ.getConstitutionList();
            this.invComServ.getOperationalInstr();
            this.suggestedCustomer=res.tmdepositInv;
            if(this.suggestedCustomer){
              this.isLoading=false;
            }
          }
          }
          else{
            this.isLoading=false
            this.HandleMessage(true, MessageType.Error, 'No record found with this account number !!');
          }
          },
        err => {
          this.isLoading = false;
          // this.showAlertMsg('ERROR', 'Unable to find record!!');
          this.HandleMessage(true, MessageType.Error, 'Unable to find record, Internal Server Error !!');
        }
  
      );
    }
  }
  getAccountOpeningTempData() {
    this.editDeleteMode=false;
    this.isLoading=true
    this.resetClick=false
    console.log(this.invComServ.bankName,this.invComServ.branchName,this.invComServ.constitutionDes,this.invComServ.operInsDESC);
    
      console.log(this.f.acct_num.value);
      
            if (this.masterModel.tmdepositInv.acc_num !== null) {
              if(this.f.acc_type_cd.value==23){
                debugger
                this.sel_cc=true;
                this.sel_fd=false;
                this.sel_mis=false;
                this.sel_rd=false;
                this.isLoading=false;
                }
              else if(this.f.acc_type_cd.value==22){
                  this.sel_fd=false;
                  this.sel_cc=true;
                  this.sel_mis=false;
                  this.sel_rd=false;
                  this.isLoading=false;
                  }
              else if(this.f.acc_type_cd.value==24){
                    this.sel_mis=false;
                    this.sel_fd=false;
                    this.sel_cc=true;
                    this.sel_rd=false;
                    this.isLoading=false;
          
                    }
              else if(this.f.acc_type_cd.value==25){
                      this.sel_rd=true;
                      this.sel_mis=false;
                      this.sel_fd=false;
                      this.sel_cc=false;
                      this.isLoading=false;
                      }
              
  
            }
           
    
    
    
  }
  // clearSuggestedCust() {
  //   this.suggestedCustomer = null;
  //   this.shownoresult = false;
  //   if (this.f.acct_num.value.length > 0) {
  //     this.disabledOnNull = false;
  //   }
  //   else {
  //     this.disabledOnNull = true;
  //   }


  // }
  public onAccountNumTabOff(): void {
    this.tm_denominationList = [];
    this.resetTransfer();
    this.tdDefTransFrm.reset(); 
    // this.invComServ.showTransactionDtl = true;
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

    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', acc).subscribe(
      res => {
        debugger
        console.log(res, this.rdInstallamentOption)
        this.resBrnCd = res;
        this.resbrnCD1 = res;
        this.resBrnCatgCd = res;
        this.constCd = this.resBrnCd[0].constitution_cd
        this.resBrnCatgCd = this.resBrnCd[0].catg_cd;
        console.log(this.resBrnCatgCd)
        this.resBrnCd = this.resBrnCd[0].brn_cd
        console.log(this.resBrnCd)
        //////////////debugger;
        this.isLoading = false;
        let foundOneUnclosed = false;
        if (undefined !== res && null !== res && res.length > 0) {
          res.forEach(element => {
            if (element.acc_status === null || element.acc_status.toUpperCase() !== 'C') {
              foundOneUnclosed = true;
              acc = element;
              // if (this.validationOnAcctTabOff(acc)) {
              //   this.disableOperation = false;
              //   this.accNoEnteredForTransaction = acc;
              //   this.setAccDtlsFrmForm();
              //   if (this.accTransFrm.controls.acc_type_cd.value != 11)
              //     this.getPreviousTransactionDtl(acc);
              //   else {
              //     this.getPreviousTransactionDtl_dsp(acc);
              //   }
              //   this.tdDefTransFrm.patchValue({
              //     acc_num: acc.acc_num,
              //   });
              //   this.f.oprn_cd.enable();
              // }
            }
          });
          // if (!foundOneUnclosed) {
          //   this.HandleMessage(true, MessageType.Error,
          //     'Account number ' + this.f.acct_num.value + ' is closed.');
          //   this.onResetClick();
          //   return;
          // }
        } 
        // else {
        //   this.HandleMessage(true, MessageType.Error,
        //     'Account number does not exists.');
        //   this.onResetClick();
        //   return;
        // }
      },
      err => {
        this.f.oprn_cd.disable(); this.isLoading = false;
        console.log(err);
        // this.resetAccDtlsFrmFormData();
      }
    );
    this.svc.addUpdDel<any>('Deposit/getAccountOpeningData', acc).subscribe(
      res => {
        this.joinHold=[];
        for (let i = 0; i <= res.tdaccholder.length; i++) {
        this.joinHold+=(res.tdaccholder[i].acc_holder+',')
        console.log(this.joinHold);
        }
       
      },
      err => { this.isLoading = false; }
    );

  }

  private getOperationMaster(): void {
    console.log(InvestmentTransactionsComponent.operations);

    this.isLoading = true;
    // if (undefined !== InvestmentTransactionsComponent.operations &&
    //   null !== InvestmentTransactionsComponent.operations &&
    //   InvestmentTransactionsComponent.operations.length > 0) {
    //   this.isLoading = false;
    //   this.AcctTypes = InvestmentTransactionsComponent.operations.filter(e => e.module_type === 'INVESTMENT')
    //     .filter((thing, i, arr) => {
    //       return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
    //     });
    //   this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
    // } else {
      this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
        res => {
          console.log(res)
          InvestmentTransactionsComponent.operations = res;
          this.invComServ.operations=res;
          this.isLoading = false;
          this.AcctTypes = InvestmentTransactionsComponent.operations.filter(e => e.module_type === 'INVESTMENT')
            .filter((thing, i, arr) => {
              return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
            });
          this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
        },
        err => { this.isLoading = false; }
      );
    // }
    console.log(this.AcctTypes);

  }
  getAccountTypeList() {
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {

        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'I');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      });
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
  getConstitutionList() {
    if (InvestmentTransactionsComponent.constitutionList.length > 0) {
      return;
    }

    InvestmentTransactionsComponent.constitutionList = [];
    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
      res => {
        console.log(res)
        // //////////////debugger;
        InvestmentTransactionsComponent.constitutionList = res;
      },
      err => { // ;
      }
    );
    console.log(InvestmentTransactionsComponent.constitutionList)
  }
  getOperationalInstr() {
    // //////////////debugger;
    if (InvestmentTransactionsComponent.operationalInstrList.length > 0) {
      return;
    }

    InvestmentTransactionsComponent.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
      res => {
        InvestmentTransactionsComponent.operationalInstrList = res;
      },
      err => { }
    );
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
  
  
  onResetClick(): void {
    if(this.f.acc_type_cd.value==22 ||this.f.acc_type_cd.value==23||this.f.acc_type_cd.value==24){
      debugger
      this.editDeleteMode=false;
      this.accTransFrm.reset();
      this.sel_cc=false;
      this.sel_fd=false;
      this.sel_mis=false;
      this.sel_rd=false;
      }
}
  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  private getUnapprovedDepTransAskViewEditOption(): void {
    console.log('getUnapprovedDepTransAskViewEditOption')
    this.isLoading = true;
    const tdDepTrans = new td_def_trans_trf();
    tdDepTrans.trans_type='I'
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
              { class: 'modal-lg', keyboard: false, backdrop: true, ignoreBackdropClick: false });
          }
        }
      },
      err => { this.isLoading = false; }
    );
  }
  public onUpapprovedConfirm(selectedTransactionToEdit: td_def_trans_trf): void {
    debugger
    console.log(selectedTransactionToEdit)
    this.remarks = selectedTransactionToEdit.remarks
    this.editDeleteMode = true;
    // this.selectedUnapprovedTransactionToEdit = selectedTransactionToEdit;
    this.modalRef.hide();
    // this.getAccountOpeningTempData().....MARKAR
    if (this.masterModel.tmdepositInv.acc_num !== null) {
      if(this.f.acc_type_cd.value==23){
        debugger
        this.sel_cc=true;
        this.sel_fd=false;
        this.sel_mis=false;
        this.sel_rd=false;
        }
      else if(this.f.acc_type_cd.value==22){
          this.sel_fd=false;
          this.sel_cc=true;
          this.sel_mis=false;
          this.sel_rd=false;
          }
      else if(this.f.acc_type_cd.value==24){
            this.sel_mis=false;
            this.sel_fd=false;
            this.sel_cc=true;
            this.sel_rd=false;
  
            }
      else if(this.f.acc_type_cd.value==25){
              this.sel_rd=true;
              this.sel_mis=false;
              this.sel_fd=false;
              this.sel_cc=false;
              }
     }
    if(this.masterModel.tddeftrans.trans_mode=='R'){
      this.showTransactionDtlR==true;
      this.showTransactionDtlC==false;
      
    }
    else{
      this.showTransactionDtlR==false;
      this.showTransactionDtlC==true;
      }
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
        debugger
        this.invComServ.accNoEnteredForTransaction2=res[0]
        
        this.getAccountOpeningTempData()

        // this.deptransData=res[0]
        // console.log(this.deptransData.trans_mode)
        // this.selectedVm.td_def_trans_trf = res[0];
        // this.msg.sendCommonTransactionInfo(res[0]); // show transaction details
        // this.setTransactionDtl(res[0]);
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
    // console.log(this.deptransData)

  }
  public onUpapprovedCancel(): void {
    console.log("close modal")
    this.editDeleteMode = false;
    this.selectedUnapprovedTransactionToEdit = null;
    this.modalRef.hide();
    // this.showTransactionDtlR = false;
    // this.showTransactionDtlC = false;
  }
}