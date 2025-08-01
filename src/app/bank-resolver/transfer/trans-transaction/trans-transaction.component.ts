import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { AccountDetailsComponent } from '../../Common/account-details/account-details.component';
import { AccounTransactionsComponent } from '../../deposit/accoun-transactions/accoun-transactions.component';
import { MessageType, mm_acc_type, mm_customer, mm_operation, m_acc_master, ShowMessage, SystemValues, td_def_trans_trf, tm_deposit } from '../../Models';
import { mm_constitution } from '../../Models/deposit/mm_constitution';
import { tm_transfer } from '../../Models/deposit/tm_transfer';
import { p_gen_param } from '../../Models/p_gen_param';
import { TransferDM } from '../../Models/TransferDM';

@Component({
  selector: 'app-trans-transaction',
  templateUrl: './trans-transaction.component.html',
  styleUrls: ['./trans-transaction.component.css']
})
export class TransTransactionComponent implements OnInit {

  constructor(private router: Router, private frmBldr: FormBuilder, private modalService: BsModalService, private svc: RestService) { }
  isLoading = false;
  showMsg: ShowMessage;
  //td_deftrans = new td_def_trans_trf();
  get f() { return this.tmtransfer.controls; }
  @ViewChild('contentbatch', { static: true }) contentbatch: TemplateRef<any>;
  modalRef: BsModalRef;
  tmtransfer: FormGroup;
  td_deftranstrfList: td_def_trans_trf[] = [];
  cr_td_deftranstrfList: td_def_trans_trf[] = [];
  tm_transfer = new tm_transfer();
  unApprovedTransactionLst: tm_transfer[] = [];
  accountTypeList: mm_acc_type[] = [];
  sys = new SystemValues();
  acc_master: m_acc_master[] = [];
  suggestedCustomerCr: mm_customer[];
  indxsuggestedCustomerCr = 0;
  suggestedCustomerDr: mm_customer[];
  indxsuggestedCustomerDr = 0;
  showGlHeadDr=false;
  showGlHeadCr=false;
  TrfTotAmt = 0;
  CrTrfTotAmt = 0;
  isOpenFromDp = false;
  isRetrieve = true;
  maccmaster: m_acc_master[] = [];
  maccmasterRet: m_acc_master[] = [];
  constitutionList: mm_constitution[] = [];
  getCodeDr:any
  getCodeCr:any
  disabledOnNulldr=true;
  disabledOnNullcr=true;
  constCdDr:any;
  constCdCr:any;
  isGLinDr=null;
  isGLinCr=null;
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  ngOnInit(): void {
    this.getmAccMaster();
    this.getConstitutionList()
    console.log(this.constitutionList)
    this.tmtransfer = this.frmBldr.group({
      trf_dt: [],
      trf_cd: [],
      trans_cd: [],
      created_by: [],
      created_dt: [],
      approval_status: [],
      approval_status1: [],
      approved_by: [],
      approved_dt: [],
      brn_cd: [],
      particulars: []
    });
    this.f.trf_dt.setValue(this.sys.CurrentDate);
    this.getAccountTypeList();
    this.isRetrieve = true;
    this.tmtransfer.controls.trans_cd.disable();
  }
  getConstitutionList() {
   
    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
      res => {
        console.log(res)
        this.constitutionList = res;
      },
      err => { // ;
      }
    );
    // console.log(this.constitutionList)
  }

  onInputChangeDr(i:any){
    this.suggestedCustomerDr=null;
    if (this.td_deftranstrfList[i].cust_name.length > 2) {
      this.disabledOnNulldr=false;
    }
    else{
      this.disabledOnNulldr=true;
    }
  }
  onInputChangeCr(i:any){
    this.suggestedCustomerCr=null;
    if (this.cr_td_deftranstrfList[i].cust_name.length > 2) {
      this.disabledOnNullcr=false;
    }
    else{
      this.disabledOnNullcr=true;
    }
  }
  getTypeValDr(e:any,indx:any){
    console.log(e.target.value+" "+indx)
    this.setDebitAccDtls(this.td_deftranstrfList[indx])
    if(e.target.value >= 1 && e.target.value <=11){
      this.showGlHeadDr=false;
      this.td_deftranstrfList[indx].cust_name =''
      this.td_deftranstrfList[indx].cust_acc_number = ''
      this.td_deftranstrfList[indx].acc_num = ''
      if(this.isGLinCr==false){
        this.HandleMessage(true, MessageType.Error, 'PL to PL transfer is not possible.');
        this.drremoveTransfer(this.td_deftranstrfList[indx]);
        this.showGlHeadDr=true;
        return;
      }
      this.isGLinDr=false;
      this.isGLinCr=true;
 
    }
    else if(e.target.value.length==5){
     
      this.showGlHeadDr=true;
      this.getCodeDr=this.maccmaster.filter(cd=> cd.acc_cd==e.target.value);
      console.log(this.getCodeDr)
      if(this.isGLinCr==true){
        this.HandleMessage(true, MessageType.Error, 'GL to GL transfer is not possible.');
        this.drremoveTransfer(this.td_deftranstrfList[indx])
        this.showGlHeadDr=false;
        return;
      }
      if(this.getCodeDr.length){
        this.td_deftranstrfList[indx].cust_name = this.getCodeDr[0].acc_name;
        this.td_deftranstrfList[indx].cust_acc_number = '0000'
        this.td_deftranstrfList[indx].acc_num = '0000'
        this.td_deftranstrfList[indx].acc_cd=this.getCodeDr[0].acc_cd
      }
      else{
        this.td_deftranstrfList[indx].cust_name =''
        this.td_deftranstrfList[indx].cust_acc_number = ''
        this.td_deftranstrfList[indx].acc_num = ''

        this.HandleMessage(true, MessageType.Error, 'Please Enter a valid code');
        return;
      }
      this.isGLinDr=true;
      this.isGLinCr=false;
    }
    else{
      this.td_deftranstrfList[indx].cust_name =''
      this.td_deftranstrfList[indx].cust_acc_number = ''
      this.td_deftranstrfList[indx].acc_num = ''

      this.HandleMessage(true, MessageType.Error, 'Please Enter a valid code');
      return;
    }
  }
  getTypeValCr(e:any,indx:any){
    console.log(e.target.value+" "+indx)
    // this.setDebitAccDtls()
    this.setCreditAccDtls( this.cr_td_deftranstrfList[indx])
    if(e.target.value >= 1 && e.target.value <= 11){
      this.showGlHeadCr=false;
      this.cr_td_deftranstrfList[indx].cust_name =''
      this.cr_td_deftranstrfList[indx].cust_acc_number = ''
      this.cr_td_deftranstrfList[indx].acc_num = ''
      if(this.isGLinDr==false){
        this.crremoveTransfer(this.cr_td_deftranstrfList[indx])
        this.HandleMessage(true, MessageType.Error, 'PL to PL transfer is not possible.');
        this.showGlHeadCr=true;
        return;
      }
      this.isGLinCr=false;
      this.isGLinDr=true;

    }
    else if(e.target.value.length==5){
      this.showGlHeadCr=true;
      
      this.getCodeCr=this.maccmaster.filter(cd=> cd.acc_cd==e.target.value);
      console.log(this.getCodeCr)
      if(this.isGLinDr==true){
        this.HandleMessage(true, MessageType.Error, 'GL to GL transfer is not possible.');
        this.crremoveTransfer(this.cr_td_deftranstrfList[indx])
      this.showGlHeadCr=false;

        return;
      }
      if(this.getCodeCr.length){

        this.cr_td_deftranstrfList[indx].cust_name = this.getCodeCr[0].acc_name;
        this.cr_td_deftranstrfList[indx].cust_acc_number = '0000'
        this.cr_td_deftranstrfList[indx].acc_num = '0000'
        this.cr_td_deftranstrfList[indx].acc_cd=this.getCodeCr[0].acc_cd
      }
      else{
        this.HandleMessage(true, MessageType.Error, 'Please Enter a valid code');
        this.cr_td_deftranstrfList[indx].cust_name =''
        this.cr_td_deftranstrfList[indx].cust_acc_number = ''
        this.cr_td_deftranstrfList[indx].acc_num = ''

        return;
      }
      this.isGLinCr=true;
      this.isGLinDr=false;
    }
    else{
      this.cr_td_deftranstrfList[indx].cust_name =''
      this.cr_td_deftranstrfList[indx].cust_acc_number = ''
      this.cr_td_deftranstrfList[indx].acc_num = ''

      this.HandleMessage(true, MessageType.Error, 'Please Enter a valid code');
        return;
    }
  }
  private getmAccMaster(): void {
    ;
    var dt = {
      "ardb_cd": this.sys.ardbCD
    }
    this.svc.addUpdDel<any>('Mst/GetAccountMaster', dt).subscribe(
      res => {
        console.log(res)
          ;
        this.maccmasterRet = res;
        this.maccmaster = this.maccmasterRet;
         let Index = this.maccmaster.findIndex(el => el.acc_cd == 21101);
       console.log(Index);
       
      },
      err => { }
    );
  }
  retrieve() {
    this.isRetrieve = false;
    this.tmtransfer.controls.trans_cd.enable();

  }
  PopulateTransfer() {
    if (this.f.trans_cd.value === null || this.f.trans_cd.value === undefined) {
      this.HandleMessage(true, MessageType.Error, 'Please Enter Unapprove Transaction Code first');
      return;
    }
    else if (this.f.trf_dt.value === null || this.f.trf_dt.value === undefined) {
      this.HandleMessage(true, MessageType.Error, 'Please Enter a valid date');
      return;
    }
    else {
      this.getTransferData();
    }
  }
  save() {
    ////debugger;
    if (this.td_deftranstrfList.length === 0) {
      this.HandleMessage(true, MessageType.Error, 'Debit Details Can not be BLANK');
      return;
    }
    else if (this.cr_td_deftranstrfList.length === 0) {
      this.HandleMessage(true, MessageType.Error, 'Credit Details Can not be BLANK');
      return;
    }
    else if (this.TrfTotAmt === 0 || this.TrfTotAmt === undefined || this.TrfTotAmt === null) {
      this.HandleMessage(true, MessageType.Error, 'One of the Debit amount is missing. Please cross check !!!');
      return;
    }
    else if (this.CrTrfTotAmt === 0 || this.CrTrfTotAmt === undefined || this.CrTrfTotAmt === null) {
      this.HandleMessage(true, MessageType.Error, 'One of the Credit amount is missing. Please cross check !!!');
      return;
    }
    else if (this.TrfTotAmt != this.CrTrfTotAmt) {
      this.HandleMessage(true, MessageType.Error, 'Total Debit Not Matching With Total Credit');
      return;
    }
    else if (this.f.trans_cd.value > 0 && this.f.approval_status.value === 'A') {
      this.HandleMessage(true, MessageType.Error, 'This Transaction is already approved !!!');
      return;
    }
    else if (this.f.particulars.value == null || this.f.particulars.value == ''|| this.f.particulars.value == undefined) {
      this.HandleMessage(true, MessageType.Error, 'Please write a valid particulars and save again !!!');
      return;
    }
    else {
      this.InsertTransferData();
      ////debugger;
    }
  }
  delete() {
    if (this.f.trans_cd.value > 0 && this.f.approval_status.value === 'A') {
      this.HandleMessage(true, MessageType.Error, 'This Transaction is already approved !!!');
      return;
    }
    else if (this.f.trans_cd.value === null || this.f.trans_cd.value === undefined) {
      this.HandleMessage(true, MessageType.Error, 'Please Retrieve a Unapprove Transaction first');
      return;
    }
    else if (this.f.trf_dt.value === null || this.f.trf_dt.value === undefined) {
      this.HandleMessage(true, MessageType.Error, 'Please Retrieve a Unapprove Transaction first');
      return;
    }
    else if (this.td_deftranstrfList.length <= 0) {
      this.HandleMessage(true, MessageType.Error, 'Please Retrieve a Unapprove Transaction first');
      return;
    }
    else {
      const tddeftranstrf = new td_def_trans_trf();
      tddeftranstrf.trans_cd = this.f.trans_cd.value;
      tddeftranstrf.trans_dt = this.f.trf_dt.value;
      tddeftranstrf.brn_cd = this.sys.BranchCode;
      tddeftranstrf.ardb_cd = this.sys.ardbCD 
      this.svc.addUpdDel<any>('Common/DeleteTransferData', tddeftranstrf).subscribe(
        res => {
          this.HandleMessage(true, MessageType.Sucess, 'Transfer Data Deleted Successfully !!!');
          this.clear();
          this.isLoading = false;
        },
        err => {
          this.HandleMessage(true, MessageType.Error, 'Transfer Data Deleted Failed !!!');
          this.isLoading = false;

        }
      );

    }
  }
  clear() {
    this.isGLinDr=null;
    this.isGLinCr=null;
    this.tmtransfer.reset();
    this.showGlHeadCr=false;
    this.showGlHeadDr=false;
    this.f.trf_dt.setValue(this.sys.CurrentDate);
    const td_deftranstrf: td_def_trans_trf[] = [];
    const cr_td_deftranstrf: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftranstrf;
    this.cr_td_deftranstrfList = cr_td_deftranstrf;
    this.CrTrfTotAmt = 0;
    this.TrfTotAmt = 0;
    this.isRetrieve = true;
    this.tmtransfer.controls.trans_cd.disable();
    this.disabledOnNullcr=true;
    this.disabledOnNulldr=true;
  }
  getAccountTypeList() {
    ////debugger;
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        // ////debugger;
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
    // temp_deposit.acc_type_cd = parseInt(tdDefTransTrnsfr.cust_acc_type);
    temp_deposit.acc_type_cd = tdDefTransTrnsfr.cust_acc_type;
    temp_deposit.ardb_cd=this.sys.ardbCD
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', temp_deposit).subscribe(
      res => {
        if(res){
          console.log(res)
        this.constCdDr=res[0]?.constitution_cd;
        console.log(this.constCdDr)
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
              tdDefTransTrnsfr.acc_cd = element.acc_cd;
            }
          });
          if (temp_deposit_list.length === 0) {
            this.HandleMessage(true, MessageType.Error, 'Invalid ACC NUM in Transfer Details');
            tdDefTransTrnsfr.cust_acc_number = null;
            return;
          }
          if (!foundOneUnclosed) {
            this.HandleMessage(true, MessageType.Error,
              `Transfer details ACC NUM is closed.`);
            tdDefTransTrnsfr.cust_acc_number = null;
            return;
          }
        }
        }

      },
      err => {
        this.isLoading = false;
      }
    );
  }

  checkAndSetDebitAccType(tfrType: string, tdDefTransTrnsfr: td_def_trans_trf) {
    debugger;
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
      if (tdDefTransTrnsfr.gl_acc_code === undefined
        || tdDefTransTrnsfr.gl_acc_code === null
        || tdDefTransTrnsfr.gl_acc_code === '') {
        tdDefTransTrnsfr.gl_acc_desc = null;
        return;
      }

      if (tdDefTransTrnsfr.gl_acc_code === this.sys.CashAccCode.toString()) {
        this.HandleMessage(true, MessageType.Error, this.sys.CashAccCode.toString() +
          ' cash acount code is not permissible.');
        tdDefTransTrnsfr.gl_acc_desc = null;
        tdDefTransTrnsfr.gl_acc_code = '';
        return;
      }

      if (tdDefTransTrnsfr.cust_acc_type === undefined
        || tdDefTransTrnsfr.cust_acc_type === null
        || tdDefTransTrnsfr.cust_acc_type === '') {
        if (this.acc_master === undefined || this.acc_master === null || this.acc_master.length === 0) {
          this.isLoading = true;
          let temp_acc_master = new m_acc_master();
          this.svc.addUpdDel<any>('Mst/GetAccountMaster', null).subscribe(
            res => {

              this.acc_master = res;
              this.isLoading = false;
              temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tdDefTransTrnsfr.gl_acc_code)[0];
              if (temp_acc_master === undefined || temp_acc_master === null) {
                tdDefTransTrnsfr.gl_acc_desc = null;
                this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
                return;
              }
              else {
                tdDefTransTrnsfr.gl_acc_desc = temp_acc_master.acc_name;
                tdDefTransTrnsfr.acc_cd = temp_acc_master.acc_cd;
                tdDefTransTrnsfr.trans_type = tfrType;
              }
            },
            err => {

              this.isLoading = false;
            }
          );
        }
        else {
          let temp_acc_master = new m_acc_master();
          temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tdDefTransTrnsfr.gl_acc_code)[0];
          if (temp_acc_master === undefined || temp_acc_master === null) {
            tdDefTransTrnsfr.gl_acc_desc = null;
            this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
            return;
          }
          else {
            tdDefTransTrnsfr.gl_acc_desc = temp_acc_master.acc_name;
            tdDefTransTrnsfr.trans_type = tfrType;
          }
        }
      }
      else {
        this.HandleMessage(true, MessageType.Error, 'Loan Type in Transfer Details is not blank');
        tdDefTransTrnsfr.gl_acc_code = null;
        return;
      }
    }

  }

  checkDebitBalance(tdDefTransTrnsfr: td_def_trans_trf) {
    this.HandleMessage(false);
    if (tdDefTransTrnsfr.amount === undefined
      || tdDefTransTrnsfr.amount === null) {
      return;
    }

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
    // ////debugger;
    let emptyTranTranferExist = false;
    this.td_deftranstrfList.forEach(e => {
      if (undefined !== e && null !== e
        && (undefined === e.cust_acc_type && undefined === e.gl_acc_code
          || (undefined === e.amount || null === e.amount))) {
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


  }

  public drremoveTransfer(tdDefTransTrnsfr: td_def_trans_trf): void {
    const ind: number = this.td_deftranstrfList.indexOf(tdDefTransTrnsfr);
      console.log(ind);
      debugger
      this.td_deftranstrfList.splice(ind,1);
      
    // this.td_deftranstrfList.forEach((e, i) => {
    //   if (undefined !== e.cust_acc_type
    //     && e.cust_acc_type === tdDefTransTrnsfr.cust_acc_type
    //     && e.cust_acc_number === tdDefTransTrnsfr.cust_acc_number) {
    //       debugger
    //     this.td_deftranstrfList.splice(i, 1);
    //   } else if (undefined !== e.gl_acc_code
    //     && e.gl_acc_code === tdDefTransTrnsfr.gl_acc_code) {
    //       debugger
    //     this.td_deftranstrfList.splice(i, 1);
    //   }
    // });
    this.sumTransfer();
  }
  private resetTransfer() {
    const td_deftranstrf: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftranstrf;
    const temp_deftranstrf = new td_def_trans_trf();
    this.td_deftranstrfList.push(temp_deftranstrf);
  }
  ////////////////CREDIT///////////////////////////////
  setCreditAccDtls(tdDefTransTrnsfr: td_def_trans_trf) {
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
    temp_deposit.acc_type_cd = tdDefTransTrnsfr.cust_acc_type;
    // temp_deposit.acc_type_cd = parseInt(tdDefTransTrnsfr.cust_acc_type);
    temp_deposit.ardb_cd=this.sys.ardbCD
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', temp_deposit).subscribe(
      res => {
        this.constCdCr=res[0].constitution_cd;
        console.log(this.constCdCr)
        this.isLoading = false;
        ////debugger;
        let foundOneUnclosed = false;
        if (undefined !== res && null !== res && res.length > 0) {
          temp_deposit_list = res;
          temp_deposit_list.forEach(element => {
            if (element.acc_status === null || element.acc_status.toUpperCase() !== 'C') {
              foundOneUnclosed = true;
              tdDefTransTrnsfr.cust_name = element.cust_name;
              tdDefTransTrnsfr.acc_cd = element.acc_cd;
              tdDefTransTrnsfr.clr_bal = element.clr_bal;
              tdDefTransTrnsfr.acc_cd = element.acc_cd;
            }
          });
          if (temp_deposit_list.length === 0) {
            this.HandleMessage(true, MessageType.Error, 'Invalid ACC NUM in Transfer Details');
            tdDefTransTrnsfr.cust_acc_number = null;
            return;
          }
          if (!foundOneUnclosed) {
            this.HandleMessage(true, MessageType.Error,
              `Transfer details ACC NUM is closed.`);
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

  checkAndSetCreditAccType(tfrType: string, tdDefTransTrnsfr: td_def_trans_trf) {
    this.HandleMessage(false);
    debugger
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
      if (tdDefTransTrnsfr.gl_acc_code === undefined
        || tdDefTransTrnsfr.gl_acc_code === null
        || tdDefTransTrnsfr.gl_acc_code === '') {
        tdDefTransTrnsfr.gl_acc_desc = null;
        return;
      }

      if (tdDefTransTrnsfr.gl_acc_code === this.sys.CashAccCode.toString()) {
        this.HandleMessage(true, MessageType.Error, this.sys.CashAccCode.toString() +
          ' cash acount code is not permissible.');
        tdDefTransTrnsfr.gl_acc_desc = null;
        tdDefTransTrnsfr.gl_acc_code = '';
        return;
      }

      if (tdDefTransTrnsfr.cust_acc_type === undefined
        || tdDefTransTrnsfr.cust_acc_type === null
        || tdDefTransTrnsfr.cust_acc_type === '') {
        if (this.acc_master === undefined || this.acc_master === null || this.acc_master.length === 0) {
          this.isLoading = true;
          let temp_acc_master = new m_acc_master();
          this.svc.addUpdDel<any>('Mst/GetAccountMaster', null).subscribe(
            res => {
              this.acc_master = res;
              this.isLoading = false;
              temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tdDefTransTrnsfr.gl_acc_code)[0];
              if (temp_acc_master === undefined || temp_acc_master === null) {
                tdDefTransTrnsfr.gl_acc_desc = null;
                this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
                return;
              }
              else {
                tdDefTransTrnsfr.gl_acc_desc = temp_acc_master.acc_name;
                tdDefTransTrnsfr.acc_cd = temp_acc_master.acc_cd;
                tdDefTransTrnsfr.trans_type = tfrType;
              }
            },
            err => {

              this.isLoading = false;
            }
          );
        }
        else {
          let temp_acc_master = new m_acc_master();
          temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tdDefTransTrnsfr.gl_acc_code)[0];
          if (temp_acc_master === undefined || temp_acc_master === null) {
            tdDefTransTrnsfr.gl_acc_desc = null;
            this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
            return;
          }
          else {
            tdDefTransTrnsfr.gl_acc_desc = temp_acc_master.acc_name;
            tdDefTransTrnsfr.trans_type = tfrType;
          }
        }
      }
      else {
        // this.HandleMessage(true, MessageType.Error, 'Account Type in Transfer Details is not blank');
        // tdDefTransTrnsfr.gl_acc_code = null;
        // return;
      }
    }
  }

  checkCreditBalance(tdDefTransTrnsfr: td_def_trans_trf) {
    this.HandleMessage(false);
    if (tdDefTransTrnsfr.amount === undefined
      || tdDefTransTrnsfr.amount === null) {
      return;
    }

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
    this.CrsumTransfer();
  }

  public CraddTransfer(): void {
    let emptyTranTranferExist = false;
    this.cr_td_deftranstrfList.forEach(e => {
      if (undefined !== e && null !== e
        && (undefined === e.cust_acc_type && undefined === e.gl_acc_code
          || (undefined === e.amount || null === e.amount))) {
        emptyTranTranferExist = true;
      }
    });
    if (!emptyTranTranferExist) {
      this.cr_td_deftranstrfList.push(new td_def_trans_trf());
    }
  }

  private CrsumTransfer(): void {
    this.CrTrfTotAmt = 0;
    this.cr_td_deftranstrfList.forEach(e => {
      this.CrTrfTotAmt += (+e.amount);
    });


  }

  public crremoveTransfer(tdDefTransTrnsfr: td_def_trans_trf): void {
    const ind: number = this.cr_td_deftranstrfList.indexOf(tdDefTransTrnsfr);
      console.log(ind);
      debugger
      this.cr_td_deftranstrfList.splice(ind,1);
      
      // this.cr_td_deftranstrfList.forEach((e, ind) => {
      // if (undefined !== e.cust_acc_type
      //   && e.cust_acc_type === tdDefTransTrnsfr.cust_acc_type
      //   && e.cust_acc_number === tdDefTransTrnsfr.cust_acc_number) {
      //    debugger
      //   this.cr_td_deftranstrfList.splice(i,1);
      // }
      //  else if (undefined !== e.gl_acc_code
      //   && e.gl_acc_code === tdDefTransTrnsfr.gl_acc_code) {
      //     debugger
      //   this.cr_td_deftranstrfList.splice(i,1);
      // }
    // });
    this.CrsumTransfer();
  }
  private CrresetTransfer() {
    const td_deftranstrf: td_def_trans_trf[] = [];
    this.cr_td_deftranstrfList = td_deftranstrf;
    const temp_deftranstrf = new td_def_trans_trf();
    this.cr_td_deftranstrfList.push(temp_deftranstrf);
  }
  ////////////////////////////////////////////////////
  getTransferData() {
    ////debugger;
    const tddeftranstrf = new td_def_trans_trf();
    tddeftranstrf.trans_cd = this.f.trans_cd.value;
    tddeftranstrf.trans_dt = this.f.trf_dt.value;
    tddeftranstrf.brn_cd = this.sys.BranchCode;
    tddeftranstrf.ardb_cd=this.sys.ardbCD
    this.isLoading = true;
    this.svc.addUpdDel<any>('Common/GetTransferData', tddeftranstrf).subscribe(
      res => {
        console.log(res)
        ////debugger;
        if (res === null || res === undefined || res.tddeftranstrf.length === 0) {
          this.HandleMessage(true, MessageType.Error, 'No Data found !!!');
          this.clear();
          this.isLoading = false;
          return;
        }
        this.isRetrieve = true;
        this.tmtransfer.controls.trans_cd.disable();
        this.isLoading = false;
        this.tm_transfer = res.tmtransfer;
        res.tddeftranstrf.forEach(element => {
          element.trans_type=element.trans_type == null ? res.tddeftrans.trans_type:element.trans_type
        });
        // res.tddeftranstrf[0].trans_type=res.tddeftrans.trans_type
        this.td_deftranstrfList = res.tddeftranstrf.filter(x => x.trans_type === 'W');
        this.cr_td_deftranstrfList = res.tddeftranstrf.filter(x => x.trans_type === 'D');
        console.log(res.tddeftranstrf,this.cr_td_deftranstrfList);
        debugger;
        if (this.cr_td_deftranstrfList.length === 0 || this.td_deftranstrfList.length === 0) {
          debugger;
          this.HandleMessage(true, MessageType.Error, 'No Data found !!!');
          this.clear();
          this.isLoading = false;
          return;
        }
        this.tmtransfer.patchValue({
          approval_status: this.tm_transfer.approval_status,
          approval_status1: this.tm_transfer.approval_status === 'A' ? "Approved" : "Unapproved",
          particulars: this.td_deftranstrfList[0].particulars
        })
        for (let i = 0; i < this.td_deftranstrfList.length; i++) {
          if (this.td_deftranstrfList[i].acc_num === '0000') {
            this.getCodeDr=this.maccmaster.filter(cd=> cd.acc_cd==this.td_deftranstrfList[i].acc_cd);
            // console.log(this.getCodeDr)
            this.td_deftranstrfList[i].cust_name = this.getCodeDr[0].acc_name;
            this.td_deftranstrfList[i].gl_acc_code = this.td_deftranstrfList[i].acc_type_cd.toString();
            this.td_deftranstrfList[i].cust_acc_type= this.td_deftranstrfList[i].acc_type_cd.toString();
            this.td_deftranstrfList[i].cust_acc_number = this.td_deftranstrfList[i].acc_num;
            this.showGlHeadDr=true;
            this.checkAndSetDebitAccType('gl_acc', this.td_deftranstrfList[i]);

          }
          else {
            // this.showGlHeadDr=false
            this.td_deftranstrfList[i].cust_acc_type = this.td_deftranstrfList[i].acc_type_cd.toString();
            this.td_deftranstrfList[i].cust_acc_number = this.td_deftranstrfList[i].acc_num;
            
            this.checkAndSetDebitAccType('cust_acc', this.td_deftranstrfList[i]);
            this.setDebitAccDtls(this.td_deftranstrfList[i]);

          }
        }
        this.sumTransfer();
        for (let i = 0; i < this.cr_td_deftranstrfList.length; i++) {
          if (this.cr_td_deftranstrfList[i].acc_num === '0000') {
            this.getCodeCr=this.maccmaster.filter(cd=> cd.acc_cd==this.cr_td_deftranstrfList[i].acc_cd);
       
            this.cr_td_deftranstrfList[i].cust_name = this.getCodeCr[0].acc_name;

            this.cr_td_deftranstrfList[i].gl_acc_code = this.cr_td_deftranstrfList[i].acc_type_cd.toString();
            this.cr_td_deftranstrfList[i].cust_acc_type= this.cr_td_deftranstrfList[i].acc_type_cd.toString();
            this.cr_td_deftranstrfList[i].cust_acc_number = this.cr_td_deftranstrfList[i].acc_num;
            this.showGlHeadCr=true
            this.checkAndSetCreditAccType('gl_acc', this.cr_td_deftranstrfList[i]);

          }
          else {
            // this.showGlHeadCr=false;
            this.cr_td_deftranstrfList[i].cust_acc_type = this.cr_td_deftranstrfList[i].acc_type_cd.toString();
            this.cr_td_deftranstrfList[i].cust_acc_number = this.cr_td_deftranstrfList[i].acc_num;
            this.checkAndSetCreditAccType('cust_acc', this.cr_td_deftranstrfList[i]);
            this.setCreditAccDtls(this.cr_td_deftranstrfList[i]);

          }
          this.CrsumTransfer();
        }
      },
      err => {
        // ////debugger;
        this.HandleMessage(true, MessageType.Error, 'No Data found !!!');
        this.clear();
        this.isRetrieve = true;
        this.tmtransfer.controls.trans_cd.disable();
        this.isLoading = false;
      }
    );
  }

  InsertTransferData() {
    const saveTransaction = new TransferDM();
    const tdDefTrans = new td_def_trans_trf();
    tdDefTrans.trans_dt = this.f.trf_dt.value;
    tdDefTrans.brn_cd = this.sys.BranchCode;
    tdDefTrans.trf_type = "T";
    tdDefTrans.trans_type = "W"
    tdDefTrans.particulars = "TO TRANSFER";
    tdDefTrans.approval_status = 'U';
    if (this.f.trans_cd.value > 0)
    tdDefTrans.trans_cd = this.f.trans_cd.value;
    tdDefTrans.amount = this.td_deftranstrfList[0].amount;
    tdDefTrans.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    tdDefTrans.acc_cd = this.td_deftranstrfList[0].acc_cd;
    if (this.td_deftranstrfList[0].trans_type === 'cust_acc') {
      tdDefTrans.remarks = "D";
      // tdDefTrans.acc_num = this.td_deftranstrfList[0].cust_acc_number;
      // tdDefTrans.acc_type_cd = +this.td_deftranstrfList[0].cust_acc_type;
      // tdDefTrans.acc_cd = this.td_deftranstrfList[0].acc_cd;
      tdDefTrans.acc_num = '0000';
      tdDefTrans.acc_type_cd = 10000;
      tdDefTrans.acc_cd = 0;
      debugger;
    }
    else {
      console.log(tdDefTrans.trans_type);
      debugger;
      tdDefTrans.remarks = this.td_deftranstrfList[0].cust_acc_type.length==1? tdDefTrans.trans_type: "X";
      tdDefTrans.acc_num = '0000';
      tdDefTrans.acc_type_cd = 10000;
      tdDefTrans.acc_cd = 0;
      tdDefTrans.acc_name=this.td_deftranstrfList[0].cust_name
      if (this.f.trans_cd.value > 0){
        this.td_deftranstrfList[0].trans_type=tdDefTrans.trans_type;
        debugger;
        
      }
    }
    saveTransaction.tddeftrans = tdDefTrans;
    ///Debit Data
    let i = 0;
    debugger
    this.td_deftranstrfList.forEach(e => {
      const tdDefTransAndTranfer = new td_def_trans_trf();
      if (e.trans_type === 'cust_acc') {
        tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
        tdDefTransAndTranfer.acc_num = e.cust_acc_number;
        tdDefTransAndTranfer.acc_name = e.cust_name;
        tdDefTransAndTranfer.instrument_num = e.instrument_num;
        tdDefTransAndTranfer.acc_cd = e.acc_cd;
        // tdDefTransAndTranfer.remarks = 'D';
        tdDefTransAndTranfer.remarks = +e.cust_acc_type.length<=2?tdDefTrans.trans_type:'X';

        tdDefTransAndTranfer.disb_id = ++i;
        if(this.f.trans_cd.value > 0)
          tdDefTransAndTranfer.trans_type=tdDefTrans.trans_type //marker
        debugger;

      } else {
        console.log(e.acc_name+" "+e.cust_name)
       
        tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
        // tdDefTransAndTranfer.acc_type_cd = +e.gl_acc_code;
        tdDefTransAndTranfer.acc_num = e.cust_acc_number?e.cust_acc_number:'0000';

        // tdDefTransAndTranfer.acc_num = '0000';
        tdDefTransAndTranfer.acc_name = e.cust_name;
        tdDefTransAndTranfer.instrument_num = e.instrument_num;
        tdDefTransAndTranfer.acc_cd = +e.acc_cd
        // tdDefTransAndTranfer.acc_cd = +e.gl_acc_code;
        tdDefTransAndTranfer.remarks =  tdDefTrans.trans_type
        tdDefTransAndTranfer.disb_id = ++i;
        tdDefTransAndTranfer.trans_type=tdDefTrans.trans_type //marker
        tdDefTransAndTranfer.remarks = +e.cust_acc_type.length<=2?tdDefTrans.trans_type:'X';

        console.log(tdDefTransAndTranfer.trans_type);
        // debugger;
      }
      tdDefTransAndTranfer.amount = +e.amount;
      tdDefTransAndTranfer.brn_cd = this.sys.BranchCode;
      tdDefTransAndTranfer.trans_dt = this.f.trf_dt.value;
      // tdDefTransAndTranfer.trans_type = "W"; //D/W  //marker
      tdDefTransAndTranfer.trans_mode = "V";
      tdDefTransAndTranfer.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      tdDefTransAndTranfer.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      tdDefTransAndTranfer.approval_status = 'U';
      tdDefTransAndTranfer.particulars = 'S';///////
      tdDefTransAndTranfer.tr_acc_cd = 10000;
      tdDefTransAndTranfer.trf_type = "T";
      //marker commented the following line, may uncomment later
      // tdDefTransAndTranfer.remarks = e.cust_acc_type.length == 1 ? tdDefTrans.trans_type=='W'?'D':'W': "X";
      tdDefTransAndTranfer.particulars = this.f.particulars.value;
      if (this.f.trans_cd.value > 0)
        tdDefTransAndTranfer.trans_cd = this.f.trans_cd.value;
      ////debugger;
      saveTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
    });
    ///Credit Data
    let j = 0;
    debugger
    this.cr_td_deftranstrfList.forEach(e => {
      const tdDefTransAndTranfer = new td_def_trans_trf();
      if (e.trans_type === 'cust_acc' ) {
        tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
        tdDefTransAndTranfer.acc_num = e.cust_acc_number;
        tdDefTransAndTranfer.acc_name = e.cust_name;
        tdDefTransAndTranfer.instrument_num = e.instrument_num;
        tdDefTransAndTranfer.acc_cd = e.acc_cd;
        tdDefTransAndTranfer.remarks = 'D';
        tdDefTransAndTranfer.disb_id = ++j;
      } else {
        console.log(e.acc_name+" "+e.cust_name)
        // debugger;
        tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
        // tdDefTransAndTranfer.acc_type_cd = +e.gl_acc_code;
        tdDefTransAndTranfer.acc_num = e.cust_acc_number? e.cust_acc_number:'0000';
        // tdDefTransAndTranfer.acc_num = '0000';
        tdDefTransAndTranfer.acc_name = e.cust_name;
        tdDefTransAndTranfer.instrument_num = e.instrument_num;
        tdDefTransAndTranfer.remarks = +e.cust_acc_type.length<=2?tdDefTransAndTranfer.trans_type:'X';
        // console.log(tdDefTransAndTranfer.remarks);
        // debugger;
        // tdDefTransAndTranfer.acc_cd = +e.gl_acc_code;
        tdDefTransAndTranfer.acc_cd = +e.acc_cd;
        tdDefTransAndTranfer.disb_id = ++j;
      }
      tdDefTransAndTranfer.amount = +e.amount;
      tdDefTransAndTranfer.brn_cd = this.sys.BranchCode;
      tdDefTransAndTranfer.trans_dt = this.f.trf_dt.value;
      tdDefTransAndTranfer.trans_type = "D";
      tdDefTransAndTranfer.trans_mode = "V";
      tdDefTransAndTranfer.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      tdDefTransAndTranfer.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      tdDefTransAndTranfer.approval_status = 'U';
      tdDefTransAndTranfer.particulars = 'S';
      tdDefTransAndTranfer.tr_acc_cd = 10000;
      tdDefTransAndTranfer.trf_type = "T";
      tdDefTransAndTranfer.remarks = +e.cust_acc_type.length<=2?tdDefTransAndTranfer.trans_type:'X';
      // console.log(tdDefTransAndTranfer.remarks);
      // debugger;
      tdDefTransAndTranfer.particulars = this.f.particulars.value;
      if (this.f.trans_cd.value > 0)
        tdDefTransAndTranfer.trans_cd = this.f.trans_cd.value;
      ////debugger;
      saveTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
    });

    const tmTrnsfr = new tm_transfer();
    if (this.f.trans_cd.value > 0) {
      tmTrnsfr.trans_cd = this.f.trans_cd.value;
      console.log(this.f.trans_cd.value)
      debugger
    }
    tmTrnsfr.brn_cd = this.sys.BranchCode;
    tmTrnsfr.trf_dt = this.sys.CurrentDate;
    tmTrnsfr.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    tmTrnsfr.ardb_cd=this.sys.ardbCD
    tmTrnsfr.approval_status = 'U';
    saveTransaction.tmtransfer = tmTrnsfr;

    // ////debugger;
    if (this.f.trans_cd.value > 0) {
      this.svc.addUpdDel<any>('Common/UpdateTransferData', saveTransaction).subscribe(
        res => {
          // ////debugger;
          // this.unApprovedTransactionLst.push(tdDefTrans);
          const TransCd = this.f.trans_cd.value;
          this.HandleMessage(true, MessageType.Sucess, `Transaction for Trans Cd ${TransCd}, updated sucessfully !!!!`);
          this.isLoading = false;
          this.isRetrieve = true;
          this.tmtransfer.controls.trans_cd.disable();
          //this.onResetClick();
          // this.tdDefTransFrm.reset();
          // this.accTransFrm.reset();
        },
        err => {
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, 'Update Failed !!!!');
          console.error('Error on onSaveClick' + JSON.stringify(err));
          this.isRetrieve = true;
          this.tmtransfer.controls.trans_cd.disable();
        }
      );
    }
    else {
      console.log(saveTransaction)
      console.log(this.cr_td_deftranstrfList);
      console.log(this.td_deftranstrfList);
      console.log(this.cr_td_deftranstrfList);
      console.log(this.cr_td_deftranstrfList);
      console.log(this.cr_td_deftranstrfList);
      if(this.cr_td_deftranstrfList[0].amount==this.CrTrfTotAmt){
        const tdDefTrans = new td_def_trans_trf();
        tdDefTrans.trans_dt = this.f.trf_dt.value;
        tdDefTrans.brn_cd = this.sys.BranchCode;
        tdDefTrans.trf_type = "T";
        tdDefTrans.trans_type = "D"
        tdDefTrans.particulars = "BY TRANSFER";
        tdDefTrans.approval_status = 'U';
        if (this.f.trans_cd.value > 0)
        tdDefTrans.trans_cd = this.f.trans_cd.value;
        tdDefTrans.amount = this.cr_td_deftranstrfList[0].amount;
        tdDefTrans.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
        tdDefTrans.acc_cd = this.cr_td_deftranstrfList[0].acc_cd;
        if (this.cr_td_deftranstrfList[0].trans_type === 'cust_acc') {
          tdDefTrans.remarks = "D";
          tdDefTrans.acc_num = this.cr_td_deftranstrfList[0].cust_acc_number;
          tdDefTrans.acc_type_cd = +this.cr_td_deftranstrfList[0].cust_acc_type;
          tdDefTrans.acc_cd = this.cr_td_deftranstrfList[0].acc_cd;
          debugger;
        }
        else {
          console.log(tdDefTrans.trans_type);
          debugger;
          tdDefTrans.remarks = this.cr_td_deftranstrfList[0].cust_acc_type.length==1? tdDefTrans.trans_type: "X";
          tdDefTrans.acc_num = this.cr_td_deftranstrfList[0].cust_acc_number;
          tdDefTrans.acc_type_cd = +this.cr_td_deftranstrfList[0].cust_acc_type;
          tdDefTrans.acc_cd = +this.cr_td_deftranstrfList[0].acc_cd;
          tdDefTrans.acc_name=this.cr_td_deftranstrfList[0].cust_name
          if (this.f.trans_cd.value > 0){
            this.cr_td_deftranstrfList[0].trans_type=tdDefTrans.trans_type;
            debugger;
            
          }
        }
        saveTransaction.tddeftrans = tdDefTrans;
      }
      
      debugger;
     this.svc.addUpdDel<any>('Common/InsertTransferData', saveTransaction).subscribe(
        res => {
          // ////debugger;
          tdDefTrans.trans_cd = +res;
          this.HandleMessage(true, MessageType.Sucess, 'Saved sucessfully, your transaction code is -' + res);
          this.tmtransfer.patchValue({
            trans_cd: res
          });
          this.isLoading = false;
          this.isRetrieve = true;
          this.tmtransfer.controls.trans_cd.disable();
        },
        err => {
          ////debugger;
          this.isLoading = false;
          this.isRetrieve = true;
          this.tmtransfer.controls.trans_cd.disable();
          this.HandleMessage(true, MessageType.Error, 'Save Failed !!!!');
          console.error('Error on onSaveClick' + JSON.stringify(err));
        }
      );
    }
  }
  public GetUnapproveTransfer(): void {
    const tdDepTrans = new tm_transfer();
    tdDepTrans.brn_cd = this.sys.BranchCode;
    tdDepTrans.trf_dt = this.f.trf_dt.value;
    tdDepTrans.ardb_cd=this.sys.ardbCD
    this.svc.addUpdDel<any>('Common/GetUnapproveTransfer', tdDepTrans).subscribe(
      res => {
        this.unApprovedTransactionLst = res;
        this.modalRef = this.modalService.show(this.contentbatch, this.config);
      },
      err => { this.isLoading = false; }
    );
  }
  Submit(tmtransfer: any) {
    this.f.trans_cd.setValue(tmtransfer.trans_cd);
    this.f.trf_dt.setValue(tmtransfer.trf_dt);
    this.tmtransfer.controls.trans_cd.disable();
    this.getTransferData();
    this.modalRef.hide();
  }

  closeScreen() {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }

  public suggestCustomerCr(i: number): void {
    // ////debugger;
    this.isLoading=true;
    if (this.cr_td_deftranstrfList[i].cust_name.length > 2) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.cr_td_deftranstrfList[i].cust_name.toLowerCase();
      prm.ad_acc_type_cd = +this.cr_td_deftranstrfList[i].cust_acc_type;
      prm.ardb_cd=this.sys.ardbCD
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
  setCustDtlsCr(acc_num: string, cust_name: string, indx: number) {
    this.suggestedCustomerCr = null;
    this.cr_td_deftranstrfList[indx].cust_acc_number = acc_num;
    this.cr_td_deftranstrfList[indx].cust_name = cust_name;

    this.setCreditAccDtls(this.cr_td_deftranstrfList[indx]);

  }
  public suggestCustomerDr(i: number): void {
    // ////debugger;
    this.isLoading=true;
    if (this.td_deftranstrfList[i].cust_name.length > 2) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.as_cust_name = this.td_deftranstrfList[i].cust_name.toLowerCase();
      prm.ad_acc_type_cd = +this.td_deftranstrfList[i].cust_acc_type;
      prm.ardb_cd=this.sys.ardbCD
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          this.isLoading=false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomerDr = res;
            this.indxsuggestedCustomerDr = i;
          } else {
            this.suggestedCustomerDr = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomerDr = null;
    }
  }
  setCustDtlsDr(acc_num: string, cust_name: string, indx: number) {
    this.suggestedCustomerDr = null;
    this.td_deftranstrfList[indx].cust_acc_number = acc_num;
    this.td_deftranstrfList[indx].cust_name = cust_name;
    this.setDebitAccDtls(this.td_deftranstrfList[indx]);
  }

 private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  
    if (show) {
      setTimeout(() => {
        this.showMsg.Show = false;
      }, 6000); // auto-close after 4 sec
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

}
