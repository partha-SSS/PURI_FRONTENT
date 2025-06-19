import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { MessageType, mm_acc_type, m_acc_master, ShowMessage, SystemValues, td_def_trans_trf, tm_deposit } from '../../Models';
import { tm_transfer } from '../../Models/deposit/tm_transfer';
import { p_gen_param } from '../../Models/p_gen_param';
import { TransferDM } from '../../Models/TransferDM';
@Component({
  selector: 'app-trans-approve',
  templateUrl: './trans-approve.component.html',
  styleUrls: ['./trans-approve.component.css']
})
export class TransApproveComponent implements OnInit {

  constructor(private router: Router,private frmBldr: FormBuilder, private modalService: BsModalService,private svc: RestService) { }
  isLoading=false;
  showMsg: ShowMessage;
  maccmasterRet: m_acc_master[] = [];
  maccmaster: m_acc_master[] = [];
  //td_deftrans = new td_def_trans_trf();
  get f() { return this.tmtransfer.controls; }
  @ViewChild('contentbatch', { static: true }) contentbatch: TemplateRef<any>;
  @ViewChild('MakerChecker', { static: true }) MakerChecker: TemplateRef<any>;
  modalRef: BsModalRef;
  tmtransfer: FormGroup;
  td_deftranstrfList: td_def_trans_trf[] = [];
  cr_td_deftranstrfList: td_def_trans_trf[] = [];
  tm_transfer = new tm_transfer();
  unApprovedTransactionLst : tm_transfer[] = [];
  accountTypeList: mm_acc_type[] = [];
  sys = new SystemValues();
  acc_master: m_acc_master[] = [];
  TrfTotAmt = 0;
  CrTrfTotAmt = 0;
  isOpenFromDp = false;
  isRetrieve=true;
  getHead:any=[];
  createUser:any;
  logUser:any;
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  ngOnInit(): void {
    this.logUser=localStorage.getItem('itemUX');
    this.tmtransfer = this.frmBldr.group({
      trf_dt : [],
      trf_cd : [],
      trans_cd : [],
      created_by : [],
      created_dt : [],
      approval_status : [],
      approval_status1 :[],
      approved_by : [],
      approved_dt : [],
      brn_cd : [],
      particulars :[]
    });
    this.f.trf_dt.setValue(this.sys.CurrentDate);
    this.getAccountTypeList();
    this.getmAccMaster()
    this.isRetrieve=true;
   this.tmtransfer.controls.trans_cd.disable();
  }
  retrieve()
  {
    this.isRetrieve=false;
   this.tmtransfer.controls.trans_cd.enable();
   
  }
  PopulateTransfer()
  {
    if(this.f.trans_cd.value ===null || this.f.trans_cd.value===undefined)
   {
    this.HandleMessage(true, MessageType.Error, 'Please Enter Unapprove Transaction Code first');
    return;
   }
   else if(this.f.trf_dt.value ===null || this.f.trf_dt.value===undefined)
   {
    this.HandleMessage(true, MessageType.Error, 'Please Enter a valid date');
    return;
   }
   else
   {
   this.getTransferData();
   }
  }
  Approve()
  {
    //debugger;
    if(this.f.trans_cd.value ===null || this.f.trans_cd.value===undefined)
    {
     this.HandleMessage(true, MessageType.Error, 'Please Enter Unapprove Transaction Code first');
     return;
    }
    else if(this.f.trf_dt.value ===null || this.f.trf_dt.value===undefined)
    {
     this.HandleMessage(true, MessageType.Error, 'Please Enter a valid date');
     return;
    }
    else if (this.TrfTotAmt===0 || this.TrfTotAmt===undefined||this.TrfTotAmt===null)
    {
    this.HandleMessage(true, MessageType.Error, 'One of the Debit amount is missing. Please cross check !!!');
      return;
    }
    else if (this.CrTrfTotAmt===0 || this.CrTrfTotAmt===undefined||this.CrTrfTotAmt===null)
    {
    this.HandleMessage(true, MessageType.Error, 'One of the Credit amount is missing. Please cross check !!!');
      return;
    }
    else if (this.TrfTotAmt!=this.CrTrfTotAmt)
    {
        this.HandleMessage(true, MessageType.Error, 'Total Debit Not Matching With Total Credit');
        return;
    }
    else if(this.f.trans_cd.value>0 && this.f.approval_status.value==='A')
    {
      this.HandleMessage(true, MessageType.Error, 'This Transaction is already approved !!!');
      return;
    }
    else if(this.f.trans_cd.value ===null || this.f.trans_cd.value===undefined)
   {
    this.HandleMessage(true, MessageType.Error, 'Please Retrieve a Unapprove Transaction first');
    return;
   }
   else if(this.f.trf_dt.value ===null || this.f.trf_dt.value===undefined)
   {
    this.HandleMessage(true, MessageType.Error, 'Please Retrieve a Unapprove Transaction first');
    return;
   }
   else if(this.td_deftranstrfList.length<=0)
   {
    this.HandleMessage(true, MessageType.Error, 'Please Retrieve a Unapprove Transaction first');
    return;
   }
   else
   {
    if(this.createUser.toLowerCase()==this.logUser.toLowerCase()){
      this.modalRef = this.modalService.show(this.MakerChecker, this.config);
    }
    else{
    const tddeftranstrf= new p_gen_param();
    tddeftranstrf.ad_trans_cd=this.f.trans_cd.value;
    tddeftranstrf.gs_user_id=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    tddeftranstrf.adt_trans_dt=this.f.trf_dt.value;
    tddeftranstrf.brn_cd=this.sys.BranchCode;
    tddeftranstrf.ardb_cd=this.sys.ardbCD
    this.svc.addUpdDel<any>('Common/ApproveTransfer', tddeftranstrf).subscribe(
      res => {
          this.HandleMessage(true, MessageType.Sucess, 'Transfer Data Approved Successfully !!!');
          this.clear();
          this.isLoading=false;
      },
      err => {
        this.HandleMessage(true, MessageType.Error, 'Transfer Data Approve Failed !!!');
        this.isLoading=false;

      }
    );

   }
  }
  }
  clear()
  {
    this.tmtransfer.reset();
    this.f.trf_dt.setValue(this.sys.CurrentDate);
    const td_deftranstrf: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftranstrf;
    this.cr_td_deftranstrfList=td_deftranstrf;
    this.CrTrfTotAmt=0;
    this.TrfTotAmt=0;
    this.isRetrieve=true;
   this.tmtransfer.controls.trans_cd.disable();
  }
  getAccountTypeList() {
    //debugger;
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        // //debugger;
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
    temp_deposit.acc_type_cd = parseInt(tdDefTransTrnsfr.cust_acc_type);
    temp_deposit.ardb_cd=this.sys.ardbCD 
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', temp_deposit).subscribe(
      res => {
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
              tdDefTransTrnsfr.acc_cd=element.acc_cd;
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

  checkAndSetDebitAccType(tfrType: string, tdDefTransTrnsfr: td_def_trans_trf) {
    //debugger;
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
    //debugger;
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
    temp_deposit.acc_type_cd = parseInt(tdDefTransTrnsfr.cust_acc_type);
    temp_deposit.ardb_cd=this.sys.ardbCD
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', temp_deposit).subscribe(
      res => {
        this.isLoading = false;
       //debugger;
        let foundOneUnclosed = false;
        if (undefined !== res && null !== res && res.length > 0) {
          temp_deposit_list = res;
          temp_deposit_list.forEach(element => {
            if (element.acc_status === null || element.acc_status.toUpperCase() !== 'C') {
              foundOneUnclosed = true;
              tdDefTransTrnsfr.cust_name = element.cust_name;
              tdDefTransTrnsfr.acc_cd = element.acc_cd;
              tdDefTransTrnsfr.clr_bal = element.clr_bal;
              tdDefTransTrnsfr.acc_cd=element.acc_cd;
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
      // else {
      //   this.HandleMessage(true, MessageType.Error, 'Account Type in Transfer Details is not blank');
      //   tdDefTransTrnsfr.gl_acc_code = null;
      //   return;
      // }
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

  public CrremoveTransfer(tdDefTransTrnsfr: td_def_trans_trf): void {
    this.cr_td_deftranstrfList.forEach((e, i) => {
      if (undefined !== e.cust_acc_type
        && e.cust_acc_type === tdDefTransTrnsfr.cust_acc_type
        && e.cust_acc_number === tdDefTransTrnsfr.cust_acc_number) {
        this.cr_td_deftranstrfList.splice(i, 1);
      } else if (undefined !== e.gl_acc_code
        && e.gl_acc_code === tdDefTransTrnsfr.gl_acc_code) {
        this.cr_td_deftranstrfList.splice(i, 1);
      }
    });
    this.CrsumTransfer();
  }
  private CrresetTransfer() {
    const td_deftranstrf: td_def_trans_trf[] = [];
    this.cr_td_deftranstrfList = td_deftranstrf;
    const temp_deftranstrf = new td_def_trans_trf();
    this.cr_td_deftranstrfList.push(temp_deftranstrf);
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
  ////////////////////////////////////////////////////
  getTransferData() {
    //debugger;
    const tddeftranstrf= new td_def_trans_trf();
    tddeftranstrf.trans_cd=this.f.trans_cd.value;
    tddeftranstrf.trans_dt=this.f.trf_dt.value;
    tddeftranstrf.brn_cd=this.sys.BranchCode;
    tddeftranstrf.ardb_cd=this.sys.ardbCD;
    this.isLoading=true;
    this.svc.addUpdDel<any>('Common/GetTransferData', tddeftranstrf).subscribe(
      res => {
        //debugger;
        if (res===null || res===undefined || res.tddeftranstrf.length===0)
        {
          this.HandleMessage(true, MessageType.Error, 'No Data found !!!');
          this.clear();
          this.isLoading=false;
          return;
        }
      
        if (res.tddeftrans){
          const inputString=res.tddeftrans.created_by
          const parts = inputString.split('/');
          if (parts.length > 0) {
            const result = parts[0];
            this.createUser=result;
            console.log(result); // This will output: username
          } else {
            this.createUser="no"
            console.log("No '/' found in the string.");
          }
        }
        this.isRetrieve=true;
       this.tmtransfer.controls.trans_cd.disable();
        this.isLoading=false;
        this.tm_transfer = res.tmtransfer;
        this.td_deftranstrfList=res.tddeftranstrf.filter(x=>x.trans_type==='W');
        this.cr_td_deftranstrfList=res.tddeftranstrf.filter(x=>x.trans_type==='D');
        if (this.cr_td_deftranstrfList.length===0 || this.td_deftranstrfList.length===0)
        {
          this.HandleMessage(true, MessageType.Error, 'No Data found !!!');
          this.clear();
          this.isLoading=false;
          return;
        }
        this.tmtransfer.patchValue({approval_status:this.tm_transfer.approval_status,
                                   approval_status1:this.tm_transfer.approval_status==='A'?"Approved":"Unapproved",
                                    particulars:this.td_deftranstrfList[0].particulars})
        for (let i = 0; i < this.td_deftranstrfList.length; i++) {
          if (this.td_deftranstrfList[i].acc_num === '0000') {
            this.td_deftranstrfList[i].gl_acc_code = this.td_deftranstrfList[i].acc_type_cd.toString();
            this.td_deftranstrfList[i].cust_acc_type = this.td_deftranstrfList[i].acc_type_cd.toString(); //marker
            this.getHead[i]=this.maccmaster.find(e=>e.acc_cd==this.td_deftranstrfList[i].acc_type_cd)
            console.log(this.getHead[i])
            this.td_deftranstrfList[i].cust_acc_desc=this.getHead[i].acc_name
            this.td_deftranstrfList[i].cust_acc_number = this.td_deftranstrfList[i].acc_num;

            this.checkAndSetDebitAccType('gl_acc', this.td_deftranstrfList[i]);

          }
          else {
            this.td_deftranstrfList[i].cust_acc_type = this.td_deftranstrfList[i].acc_type_cd.toString();
            this.td_deftranstrfList[i].cust_acc_number = this.td_deftranstrfList[i].acc_num;
            this.checkAndSetDebitAccType('cust_acc', this.td_deftranstrfList[i]);
            this.setDebitAccDtls(this.td_deftranstrfList[i]);

          }
        }
          this.sumTransfer();
          //////////////////////////////
          for (let i = 0; i < this.cr_td_deftranstrfList.length; i++) {
            if (this.cr_td_deftranstrfList[i].acc_num === '0000') {
              // this.cr_td_deftranstrfList[i].gl_acc_code = this.cr_td_deftranstrfList[i].acc_type_cd.toString();
              this.cr_td_deftranstrfList[i].cust_acc_type = this.cr_td_deftranstrfList[i].acc_type_cd.toString();
              this.cr_td_deftranstrfList[i].cust_acc_number = this.cr_td_deftranstrfList[i].acc_num;
              // console.log(this.cr_td_deftranstrfList[i].acc_type_cd.length)
              // if(this.cr_td_deftranstrfList[i].acc_type_cd.length==5){
              this.getHead[i]=this.maccmaster.find(e=>e.acc_cd==this.cr_td_deftranstrfList[i].acc_type_cd)
              console.log(this.getHead[i])
              this.cr_td_deftranstrfList[i].cust_acc_desc=this.getHead[i].acc_name
              // }
              this.checkAndSetCreditAccType('gl_acc', this.cr_td_deftranstrfList[i]);
  
            }
            else {
              this.cr_td_deftranstrfList[i].cust_acc_type = this.cr_td_deftranstrfList[i].acc_type_cd.toString();
              this.cr_td_deftranstrfList[i].cust_acc_number = this.cr_td_deftranstrfList[i].acc_num;

              this.checkAndSetCreditAccType('cust_acc', this.cr_td_deftranstrfList[i]);
              this.setCreditAccDtls(this.cr_td_deftranstrfList[i]);
  
            }
            this.CrsumTransfer();
        }
      },
      err => {
        //debugger;
        this.HandleMessage(true, MessageType.Error, 'No Data found !!!');
          this.clear();
          this.isRetrieve=true;
         this.tmtransfer.controls.trans_cd.disable();
          this.isLoading=false;
      }
    );
  }
  
  InsertTransferData()
  {
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
    //tdDefTrans.acc_num=this.td_deftranstrfList[0].acc_num;
    tdDefTrans.amount=this.td_deftranstrfList[0].amount;
    tdDefTrans.created_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    tdDefTrans.acc_cd=this.td_deftranstrfList[0].acc_cd;
    if (this.td_deftranstrfList[0].trans_type==='cust_acc')
    {
    tdDefTrans.remarks="D";
    tdDefTrans.acc_num=this.td_deftranstrfList[0].cust_acc_number;
    tdDefTrans.acc_type_cd = +this.td_deftranstrfList[0].cust_acc_type;
    tdDefTrans.acc_cd=this.td_deftranstrfList[0].acc_cd;
    }
    else
    {
    tdDefTrans.remarks="X";
    tdDefTrans.acc_num='0000';
    tdDefTrans.acc_type_cd = +this.td_deftranstrfList[0].gl_acc_code;
    tdDefTrans.acc_cd=+this.td_deftranstrfList[0].gl_acc_code;
    }
    saveTransaction.tddeftrans = tdDefTrans;
    ///Debit Data
    let i = 0;
    this.td_deftranstrfList.forEach(e => {
    const tdDefTransAndTranfer =  new td_def_trans_trf();
    if (e.trans_type === 'cust_acc') {
          tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
          tdDefTransAndTranfer.acc_num = e.cust_acc_number;
          tdDefTransAndTranfer.acc_name = e.cust_name;
          tdDefTransAndTranfer.instrument_num = e.instrument_num;
          tdDefTransAndTranfer.acc_cd = e.acc_cd;
          tdDefTransAndTranfer.remarks = 'D';
          tdDefTransAndTranfer.disb_id = ++i;
        } else {
          tdDefTransAndTranfer.acc_type_cd = +e.gl_acc_code;
          tdDefTransAndTranfer.acc_num = '0000';
          tdDefTransAndTranfer.acc_name = e.gl_acc_desc;
          tdDefTransAndTranfer.instrument_num = e.instrument_num;
          tdDefTransAndTranfer.acc_cd = +e.gl_acc_code;
          tdDefTransAndTranfer.remarks = 'X';
          tdDefTransAndTranfer.disb_id = ++i;
        }
        tdDefTransAndTranfer.amount = +e.amount;
        tdDefTransAndTranfer.brn_cd = this.sys.BranchCode;
        tdDefTransAndTranfer.trans_dt = this.f.trf_dt.value;
        tdDefTransAndTranfer.trans_type = "W"; //D/W
        tdDefTransAndTranfer.trans_mode = "V";
        tdDefTransAndTranfer.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
        tdDefTransAndTranfer.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
        tdDefTransAndTranfer.approval_status = 'U';
        tdDefTransAndTranfer.particulars = 'S';///////
        tdDefTransAndTranfer.tr_acc_cd = 10000;
        tdDefTransAndTranfer.trf_type = "T";
        tdDefTransAndTranfer.particulars = this.f.particulars.value;
        if (this.f.trans_cd.value > 0) 
        tdDefTransAndTranfer.trans_cd = this.f.trans_cd.value;
        //debugger;
        saveTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
      });
       ///Credit Data
      let j = 0;
      this.cr_td_deftranstrfList.forEach(e => {
      const tdDefTransAndTranfer =  new td_def_trans_trf();
      if (e.trans_type === 'cust_acc') {
          tdDefTransAndTranfer.acc_type_cd = +e.cust_acc_type;
          tdDefTransAndTranfer.acc_num = e.cust_acc_number;
          tdDefTransAndTranfer.acc_name = e.cust_name;
          tdDefTransAndTranfer.instrument_num = e.instrument_num;
          tdDefTransAndTranfer.acc_cd = e.acc_cd;
          tdDefTransAndTranfer.remarks = 'D';
          tdDefTransAndTranfer.disb_id = ++j;
        } else {
          tdDefTransAndTranfer.acc_type_cd = +e.gl_acc_code;
          tdDefTransAndTranfer.acc_num = '0000';
          tdDefTransAndTranfer.acc_name = e.gl_acc_desc;
          tdDefTransAndTranfer.instrument_num = e.instrument_num;
          tdDefTransAndTranfer.acc_cd = +e.gl_acc_code;
          tdDefTransAndTranfer.remarks = 'X';
          tdDefTransAndTranfer.disb_id = ++j;
        }
        tdDefTransAndTranfer.amount = +e.amount;
        tdDefTransAndTranfer.brn_cd = this.sys.BranchCode;
        tdDefTransAndTranfer.trans_dt =this.f.trf_dt.value;
        tdDefTransAndTranfer.trans_type = "D"; 
        tdDefTransAndTranfer.trans_mode = "V";
        tdDefTransAndTranfer.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
        tdDefTransAndTranfer.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
        tdDefTransAndTranfer.approval_status = 'U';
        tdDefTransAndTranfer.particulars = 'S';
        tdDefTransAndTranfer.tr_acc_cd = 10000;
        tdDefTransAndTranfer.trf_type = "T";
        tdDefTransAndTranfer.particulars = this.f.particulars.value;
        if (this.f.trans_cd.value > 0) 
        tdDefTransAndTranfer.trans_cd = this.f.trans_cd.value;
        //debugger;
        saveTransaction.tddeftranstrf.push(tdDefTransAndTranfer);
      });

      const tmTrnsfr = new tm_transfer();
      if (this.f.trans_cd.value > 0) {
        tmTrnsfr.trans_cd = this.f.trans_cd.value;
      }
      tmTrnsfr.brn_cd = this.sys.BranchCode;
      tmTrnsfr.trf_dt = this.sys.CurrentDate;
      tmTrnsfr.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      tmTrnsfr.approval_status = 'U';
      tmTrnsfr.ardb_cd=this.sys.ardbCD
      saveTransaction.tmtransfer=tmTrnsfr;
    
    // //debugger;
    if (this.f.trans_cd.value > 0) {
      this.svc.addUpdDel<any>('Common/UpdateTransferData', saveTransaction).subscribe(
        res => {
          //debugger;
          // this.unApprovedTransactionLst.push(tdDefTrans);
          const TransCd = this.f.trans_cd.value;
          this.HandleMessage(true, MessageType.Sucess, `Transaction for Trans Cd ${TransCd}, updated sucessfully !!!!`);
          this.isLoading = false;
          this.isRetrieve=true;
         this.tmtransfer.controls.trans_cd.disable();
          //this.onResetClick();
          // this.tdDefTransFrm.reset();
          // this.accTransFrm.reset();
        },
        err => {
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, 'Update Failed !!!!');
          console.error('Error on onSaveClick' + JSON.stringify(err));
          this.isRetrieve=true;
         this.tmtransfer.controls.trans_cd.disable();
        }
        );
         }
        else {
        this.svc.addUpdDel<any>('Common/InsertTransferData', saveTransaction).subscribe(
        res => {
          // //debugger;
          tdDefTrans.trans_cd=+res;
          this.HandleMessage(true, MessageType.Sucess, 'Saved sucessfully, your transaction code is -' + res);
          this.tmtransfer.patchValue({
            trans_cd: res
          });
          this.isLoading = false;
          this.isRetrieve=true;
         this.tmtransfer.controls.trans_cd.disable();
        },
        err => {
          this.isLoading = false;
          this.isRetrieve=true;
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
        this.unApprovedTransactionLst.forEach(e=>{
          const inputString=e.created_by
          const parts = inputString.split('/');
          var name;
          if (parts.length > 0) {
            const result = parts[0];
            name=result;
            console.log(result); // This will output: username
          } else {
           name=e.created_by
            console.log("No '/' found in the string.");
          }
          e.created_by=name;
        })
        this.modalRef = this.modalService.show(this.contentbatch, this.config);
      },
      err => { this.isLoading = false; }
    );
  }
  Submit(tmtransfer:any)
  {
    this.f.trans_cd.setValue(tmtransfer.trans_cd);
    this.f.trf_dt.setValue(tmtransfer.trf_dt);
    this.tmtransfer.controls.trans_cd.disable();
    this.getTransferData(); 
    this.modalRef.hide();
  }    
  
  closeScreen()
  {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}
