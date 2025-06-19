import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from 'src/app/_service';
import { T_VOUCHER_DTLS, m_acc_master, SystemValues, ShowMessage, MessageType } from '../../Models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-voucherapproval',
  templateUrl: './voucherapproval.component.html',
  styleUrls: ['./voucherapproval.component.css']
})
export class VoucherapprovalComponent implements OnInit {
  tvd = new T_VOUCHER_DTLS();
  tvdRet: T_VOUCHER_DTLS[] = [];
  tvn = new T_VOUCHER_DTLS();
  tvnRet: T_VOUCHER_DTLS[] = [];
  tvnRetFilter: T_VOUCHER_DTLS[] = [];
  maccmaster: m_acc_master[] = [];
  maccmasterRet: m_acc_master[] = [];
  keyword = 'acc_name';
  tvdGroupRes: any;
  reportcriteria: FormGroup;
  closeResult = '';
  alertMsg = '';
  alertMsg1 = '';
  showAlert = false;
  onVoucherCreation: FormGroup;
  VoucherF: FormArray;
  _voucherId: any;
  _voucherDt:any;
  _voucherTyp: any;
  _approvalSts: any;
  _totalCr: number = 0;
  _totalDr: number = 0;
  _voucherNarration: string = '';
  insertMode = false;
  app_flg: any;
  isDel = true;
  isAddNew = true;
  isRetrieve = true;
  isRetrieveBatch = true;
  isNew = true;
  isRemove = true;
  isSave = true;
  isApprove = true;
  isClear = false;
  isLoading = false;
  fromdate: Date;
  showMsg: ShowMessage;
  createUser:any;
  logUser:any;
  sys = new SystemValues();
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService,
              private router: Router) { }
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('MakerChecker', { static: true }) MakerChecker: TemplateRef<any>;
  @ViewChild('contentbatch', { static: true }) contentbatch: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  ngOnInit(): void {
    this.logUser=localStorage.getItem('itemUX');
    this.fromdate=this.convertDate(localStorage.getItem('__currentDate'));
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      voucherNo: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])]
    });

    this.onVoucherCreation = this.formBuilder.group({
      'VoucherF': this.formBuilder.array([
        this.addVoucherFromGroup()
      ])
    });
    ;
    this.isRetrieve = false;
    this.isRetrieveBatch = false;
    this.isNew = false;
    this.getmAccMaster();
  }
  Initialize() {
    ;
    this.insertMode = false;
    this._voucherId = null;
    //this._voucherDt = null;
    this._voucherTyp = null;
    this._approvalSts = null;
    this._totalCr = 0;
    this._totalDr = 0;
    this._voucherNarration = '';
    try {
      let VoucherFCnt = this.VoucherF.value.length;
      for (var i = 0; i < VoucherFCnt; i++) {
        this.RemoveItem(0);
      }
    }
    catch (exception) { let x = 0; }

    //this.Add();

    // this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
    // this.VoucherF.push(this.editVoucherFromGroup(this.tvdRet[x].acc_cd,this.tvdRet[x].debit_credit_flag,this.tvdRet[x].cr_amount,this.tvdRet[x].dr_amount));
  }
  InitializeListOnly() {
    try {
      let VoucherFCnt = this.VoucherF.value.length;
      for (var i = 0; i < VoucherFCnt; i++) {
        this.RemoveItem(0);
      }
    }
    catch (exception) { let x = 0; }
  }

  Retrieve() {
    this.Initialize();
    this.modalRef = this.modalService.show(this.content, this.config);
    // this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    // },
    //   (reason) => {
    //     this.closeResult = 'Dismissed ${this.getDismissReason(reason)}';
    //   });
  }
  RetrieveBatch() {
    this.app_flg = 'U';
    this.Initialize();
    this.isLoading=true;
    this.getVoucherNarration();
    this.modalRef = this.modalService.show(this.contentbatch, this.config);0
    
    
  }
  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }

  AddNew() {
    this.Add();
  }
  New() {
    this.isDel = false;
    this.isAddNew = false;
    this.isRetrieve = true;
    this.isRetrieveBatch = true;
    this.isNew = true;
    this.isRemove = true;
    this.isSave = false;
    this.isApprove = true;
    this.isClear = false;
    this.Initialize();
    //this._voucherDt = this.sys.CurrentDate;//TBD
    //Date.UTC(this._voucherDt.getFullYear(), this._voucherDt.getMonth(), this._voucherDt.getDate());
    this._voucherTyp = "C";
    this.insertMode = true;
  }
  Remove() {

  }
  Approve() {
    this.modalRef.hide();
    if(this.createUser.toLowerCase()==this.logUser.toLowerCase()){
      this.modalRef = this.modalService.show(this.MakerChecker, this.config);
    }
    else{
      this.UpdateVoucher();
    }
    debugger
  }
  Submit() {
    ;
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg1 = "Error : Invalid Input.";
      this.HandleMessage(true, MessageType.Error, this.alertMsg1);
      return false;
    }
    else
    {
      
      this.isLoading = true;
      this.getVoucher(this.reportcriteria.value['fromDate'], this.reportcriteria.value['voucherNo']);
    }
  }

  Clear() {
    this.Initialize();
    this.isDel = true;
    this.isAddNew = true;
    this.isRetrieve = false;
    this.isRetrieveBatch = false;
    this.isNew = false;
    this.isRemove = true;
    this.isSave = true;
    this.isApprove = true;
    this.isClear = false;
  }
  // Save() {
  //   ;
  //   this.showAlert = false;
  //   let isAccCDBlank = false;
  //   if (this._voucherNarration == null || this._voucherNarration == '') {
  //     this.showAlert = true;
  //     this.alertMsg = "Narration can not be blank !"
  //   }
  //   else if (this.getTotalDr() == 0) {
  //     this.showAlert = true;
  //     this.alertMsg = "Debit Amount Can not be Zero !"
  //   }
  //   else if (this.getTotalCr() == 0) {
  //     this.showAlert = true;
  //     this.alertMsg = "Credit Amount Can not be Zero !"
  //   }
  //   else if (this.getTotalCr() != this.getTotalDr()) {
  //     this.showAlert = true;
  //     this.alertMsg = "Debit and Credit Amount must be equal !"
  //   }

  //   else {
  //     for (let x = 0; x < this.VoucherF.length; x++) {
  //       if (this.voucherData.value[x].acc_cd == null || this.voucherData.value[x].acc_cd == '') {
  //         isAccCDBlank = true;
  //         break;
  //       }
  //     }
  //     if (isAccCDBlank) {
  //       this.showAlert = true;
  //       this.alertMsg = "Account Code Can not be Blank !"
  //     }
  //     else {
  //       this.InsertVoucher();
  //     }
  //   }
  // }
  OpenVoucher(item) {
    ;
    console.log(typeof(item.voucher_dt))
    this.Initialize();
    this.getVoucherDtl(this.sys.BranchCode, item.voucher_dt, item.voucher_id, item.narrationdtl)
  }
  closeAlert() {
    this.showAlert = false;
  }
  get voucherData() { return <FormArray>this.onVoucherCreation.get('VoucherF'); }

  addVoucherFromGroup(): FormGroup {
    return this.formBuilder.group({
      'dr_cr': [null, Validators.compose([Validators.required])],
      'acc_cd': [null, Validators.compose([Validators.required])],
      'desc': [null, null],
      'cr_amt': [null, null],
      'dr_amt': [null, null]
    });
  }

  editVoucherFromGroup(acc_cd: number, dr_cr: string, cr_amount: number, dr_amount: number): FormGroup {
    let accNames = this.maccmaster.filter(function (el) { return (el.acc_cd === acc_cd); }).map(function (el) { return el.acc_name; }).sort().toString();
    return this.formBuilder.group({
      'dr_cr': [dr_cr, Validators.compose([Validators.required])],
      'acc_cd': [acc_cd, Validators.compose([Validators.required])],
      'desc': [accNames, null],
      'cr_amt': [cr_amount, null],
      'dr_amt': [dr_amount, null]
    });
  }

  Add() {
    this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
    this.VoucherF.push(this.addVoucherFromGroup());
  }
  RemoveItem(deleteindex: number): void {
    (<FormArray>this.onVoucherCreation.get('VoucherF')).removeAt(deleteindex);
  }

  selectEvent(item, i) {
    // do something with selected item
    ;
    try {
      this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
      this.VoucherF.controls[i].get('acc_cd').setValue(item.acc_cd);
    }
    catch (exception) { let x = 0; }
  }

  onChangeSearch(search, i) {
    // do something with selected item
  }
  onChange(event) {
    ;

    this._voucherTyp = event;
    if (this._voucherTyp=='T'){
    this.InitializeListOnly();
    this.maccmaster=this.maccmasterRet.filter(x=>x.acc_cd!=28101);}
    else if (this._voucherTyp=='C'){
    this.InitializeListOnly();
    this.Add()
    this.maccmaster=this.maccmasterRet.filter(x=>x.acc_cd!=28101);
    this.VoucherF.controls[0].get('acc_cd').setValue(28101);
    this.VoucherF.controls[0].get('desc').setValue(this.maccmasterRet.find(x=>x.acc_cd===28101).acc_name);
    }
    else{
      this.InitializeListOnly();
      this.maccmaster=this.maccmasterRet;}
  }
  changeAppFlg() {
    ;
    this.tvnRetFilter = [];
    //this.tvnRetFilter = this.tvnRet.filter(x => x.approval_status == this.app_flg);
    this.tvnRetFilter = this.tvnRet.filter(x => x.approval_status == this.app_flg).sort((a , b) => (a.voucher_id < b.voucher_id ? -1 : 1));;
  }

  onFocused(e) {
    // do something
  }

  private getVoucher(vDt: any, vID: any): void {
    this.tvd = new T_VOUCHER_DTLS();
    this.tvd.brn_cd = this.sys.BranchCode;
    this.tvd.voucher_dt = vDt;
    
    //this.tvd.voucher_dt = new Date(Date.UTC(this._voucherDt.getFullYear(), this._voucherDt.getMonth(), this._voucherDt.getDate(), this._voucherDt.getHours(), this._voucherDt.getMinutes()));
    //this.tvd.voucher_dt = new Date(Date.UTC(vDt.getFullYear(), vDt.getMonth(),vDt.getDate(),vDt.getHours(), vDt.getMinutes()));
    this.tvd.voucher_id = Number(vID);
    this.tvd.ardb_cd=this.sys.ardbCD;
    this.tvdRet = [];
    ;
    this.svc.addUpdDel<any>('Voucher/GetTVoucherDtls', this.tvd).subscribe(
      res => {
        this.isLoading = false;
        if(res.length==0){ 
          this.showAlert = true;
          this.alertMsg1 = "This voucher has either been deleted or does not exist !";
          this.HandleMessage(true, MessageType.Error, this.alertMsg1);
          return;
        }
        this.tvdRet = res;
        console.log(this.tvdRet)
        this.tvdGroupRes = this.groupBy(this.tvdRet, function (item) {
         
          console.log(item.voucher_dt)
          console.log(typeof(item.voucher_dt))
          return [item.transaction_type, item.voucher_id, item.voucher_dt.substr(0,10), item.approval_status];
        });

        for (let x = 0; x < this.tvdRet.length; x++) {
          this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
          this.VoucherF.push(this.editVoucherFromGroup(this.tvdRet[x].acc_cd, this.tvdRet[x].debit_credit_flag=='D'?'Debit':'Credit', this.tvdRet[x].cr_amount, this.tvdRet[x].dr_amount));
        }
        if (this.VoucherF.value.length > 0)
          if (this.VoucherF.value[0].acc_cd == null)
            this.RemoveItem(0);
        this._voucherId = this.tvdRet[0].voucher_id;
        this._voucherDt=this.fromdate.toDateString()
       // this._voucherDt = this.convertDate(this.tvdRet[0].voucher_dt.toString());
        // this._voucherTyp = this.tvdRet[0].transaction_type == "C" ? "Cash" : this.tvdRet[0].transaction_type == "L" ? "Clearing" : "Transfer";
        // this._voucherTyp = this.tvdRet[0].transaction_type == "C" ? (this.tvdRet[0].cr_amount > 0 && this.tvdRet[0].dr_amount == 0  ? "Cash Payment" : "Cash Receipt") : "Transfer";
        debugger
        this._voucherTyp = this.tvdRet[0].transaction_type == "C" ? (this.tvdRet[this.tvdRet.findIndex(x => x.acc_cd == 21101)].cr_amount > 0 && this.tvdRet[this.tvdRet.findIndex(x => x.acc_cd == 21101)].dr_amount == 0  ?  "Cash Payment":"Cash Receipt" ) : "Transfer";
        this._approvalSts = this.tvdRet[0].approval_status == "A" ? "Approved" : "Unapproved";
        this._totalCr = 0;
        this._totalDr = 0;
        if (this.tvdRet[0].approval_status == 'U')
          this.isApprove = false;
        this._voucherNarration = this.tvdRet[0].narrationdtl;//this.tvdRet[0].narration+
        this.modalRef.hide();
        console.log(this.tvdRet[0].cr_amount);
        
        // this.modalService.dismissAll(this.content);
      },
      err => { this.isLoading = false;this.modalRef.hide();}
    );
  }
  private getVoucherDtl(brncd: any, voudt: any, vouid: any, narr: any): void {
    this.tvd = new T_VOUCHER_DTLS();
    this.tvd.brn_cd = brncd;
    this.tvd.voucher_dt = voudt;

    this._voucherDt=voudt.substr(0,10);
    //  this._voucherDt=new Date(voudt).toDateString();

    
    console.log(voudt);
    this.tvd.ardb_cd=this.sys.ardbCD
    //this.tvd.voucher_dt = new Date(Date.UTC(voudt.getFullYear(), voudt.getMonth(), voudt.getDate()));
    this.tvd.voucher_id = vouid;
    this.tvdRet = [];
    ;
    this.svc.addUpdDel<any>('Voucher/GetTVoucherDtls', this.tvd).subscribe(
      res => {
        ;
        this.tvdRet = res;
        if (this.tvdRet[0].created_by){
          const inputString=this.tvdRet[0].created_by
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
        for (let x = 0; x < this.tvdRet.length; x++) {
          this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
          this.VoucherF.push(this.editVoucherFromGroup(this.tvdRet[x].acc_cd, this.tvdRet[x].debit_credit_flag=='D'?'Debit':'Credit', this.tvdRet[x].cr_amount, this.tvdRet[x].dr_amount));
        }
        if (this.VoucherF.value.length > 0)
          if (this.VoucherF.value[0].acc_cd == null)
            this.RemoveItem(0);
        this._voucherId = this.tvdRet[0].voucher_id;
        debugger
        console.log(this.tvdRet[this.tvdRet.findIndex(x => x.acc_cd == 21101)]);
        
        //this._voucherDt = this.convertDate(this.tvdRet[0].voucher_dt.toString());
        // this._voucherTyp = this.tvdRet[0].transaction_type == "C" ? "Cash" : this.tvdRet[0].transaction_type == "L" ? "Clearing" : "Transfer";
        this._voucherTyp = this.tvdRet[0].transaction_type == "C" ?(this.tvdRet[this.tvdRet.findIndex(x => x.acc_cd == 21101)].cr_amount > 0 && this.tvdRet[this.tvdRet.findIndex(x => x.acc_cd == 21101)].dr_amount == 0  ?  "Cash Payment":"Cash Receipt" ) : "Transfer";
      //  console.log(this._voucherTyp,this.tvdRet[this.tvdRet.findIndex(x => x.acc_cd == 21101)].cr_amount > 0 && this.tvdRet[0].dr_amount == 0);
       
        this._approvalSts = this.tvdRet[0].approval_status == "A" ? "Approved" : "Unapproved";
        this._totalCr = 0;
        this._totalDr = 0;
        this._voucherNarration = narr;
        if (this.tvdRet[0].approval_status == 'U')
          this.isApprove = false;
          this.modalRef.hide();
        // this.modalService.dismissAll(this.content);
      },
      err => {this.modalRef.hide(); }
    );
  }
  private getVoucherNarration(): void {
    this.tvn.brn_cd = this.sys.BranchCode;
    this.tvn.ardb_cd=this.sys.ardbCD
    //this.tvn.voucher_dt = new Date(localStorage.getItem('__currentDate'));
    // this.tvn.voucher_dt =null;
   
    //tvdSave.voucher_dt = new Date(Date.UTC(this._voucherDt.getFullYear(), this._voucherDt.getMonth(), this._voucherDt.getDate(), this._voucherDt.getHours(), this._voucherDt.getMinutes()));
   // this.tvn.voucher_dt = new Date(Date.UTC(this.tvn.voucher_dt.getFullYear(), this.tvn.voucher_dt.getMonth(), this.tvn.voucher_dt.getDate()));
    
    this.svc.addUpdDel<any>('Voucher/GetTVoucherNarration', this.tvn).subscribe(
      res => {
        ;
        console.log(res)
        this.tvnRet = res;
        this.tvnRet.forEach(e=>{
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
        //this.tvnRetFilter = this.tvnRet.filter(x => x.approval_status == this.app_flg);
        this.tvnRetFilter = this.tvnRet.filter(x => x.approval_status == this.app_flg).sort((a , b) => (a.voucher_id < b.voucher_id ? -1 : 1));;
        
        this.isLoading=false;
        // this.modalService.open(this.contentbatch, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: 'static' }).result.then((result) => {
        // },
        //   (reason) => {
        //     this.closeResult = 'Dismissed ${this.getDismissReason(reason)}';
        //   });
      },
      err => { this.isLoading=false;}
    );
  }

  // private InsertVoucher(): void {
  //   try {
  //     this.isLoading=true;
  //     let tvdSaveAll: T_VOUCHER_DTLS[] = [];
  //     for (let x = 0; x < this.VoucherF.length; x++) {
  //       let tvdSave = new T_VOUCHER_DTLS();
  //       tvdSave.approval_status = 'U';
  //       tvdSave.brn_cd =  this.sys.BranchCode;
  //       tvdSave.cr_amount = Number(this.voucherData.value[x].cr_amt == null ? 0 : this.voucherData.value[x].cr_amt);
  //       tvdSave.dr_amount = Number(this.voucherData.value[x].dr_amt == null ? 0 : this.voucherData.value[x].dr_amt);
  //       tvdSave.debit_credit_flag = this.voucherData.value[x].dr_cr=='Debit'? 'D' : 'C';
  //       tvdSave.narrationdtl = this._voucherNarration;
  //       tvdSave.transaction_type = this._voucherTyp;
  //       tvdSave.voucher_dt = new Date(Date.UTC(this._voucherDt.getFullYear(), this._voucherDt.getMonth(), this._voucherDt.getDate(), this._voucherDt.getHours(), this._voucherDt.getMinutes()));
  //       //tvdSave.voucher_dt = this._voucherDt;
  //       tvdSave.acc_cd = this.voucherData.value[x].acc_cd;
  //       tvdSave.amount = Number(tvdSave.cr_amount == 0 ? tvdSave.dr_amount : tvdSave.cr_amount);
  //       tvdSaveAll.push(tvdSave);
  //     }
  //     ;
  //     this.svc.addUpdDel<any>('Voucher/InsertTVoucherDtls', tvdSaveAll).subscribe(
  //       res => {
  //         ;
  //         this._voucherId = res;
  //         this._approvalSts = "Unapproved";
  //         this.insertMode = false;
  //         this.isDel = true;
  //         this.isAddNew = true;
  //         this.isRetrieve = false;
  //         this.isRetrieveBatch = false;
  //         this.isNew = false;
  //         this.isRemove = true;
  //         this.isSave = true;
  //         this.isApprove = true;
  //         this.isClear = false;
  //         this.isLoading=false;
  //       },
  //       err => {this.isLoading=false; }
  //     );
  //   }
  //   catch (exception) { let x = 0; }
  // }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  private UpdateVoucher(): void {
    try {
      this.isLoading=true;
      let tvdSaveAll: T_VOUCHER_DTLS[] = [];
      for (let x = 0; x < this.VoucherF.length; x++) {
        let tvdSave = new T_VOUCHER_DTLS();
        tvdSave.approval_status = 'A';
        tvdSave.brn_cd =  this.sys.BranchCode;
        tvdSave.approved_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress')
        tvdSave.approved_dt = new Date();
        tvdSave.ardb_cd=this.sys.ardbCD
        tvdSave.voucher_dt = this.tvd.voucher_dt;
        tvdSave.voucher_id = this._voucherId;//Merge
        tvdSave.acc_cd = this.voucherData.value[x].acc_cd;
        tvdSave.narrationdtl = this._voucherNarration;
        tvdSaveAll.push(tvdSave);
      }
      ;
      this.svc.addUpdDel<any>('Voucher/UpdateTVoucherDtls', tvdSaveAll).subscribe(
        res => {
          ;
          let x = res;
          //this._voucherDt = this._voucherDt
          //this._voucherTyp = "C";
          //this._voucherTyp = this._voucherTyp == "Cash" ? "C" : this._voucherTyp == "Clearing" ? "L" : "T";
          this._approvalSts = res!=-1? "Approved" : "Unapproved";
          this.insertMode = false;
          this.isDel = true;
          this.isAddNew = true;
          this.isRetrieve = false;
          this.isRetrieveBatch = false;
          this.isNew = false;
          this.isRemove = true;
          this.isSave = true;
          this.isApprove = true;
          this.isClear = false;
          this.isLoading=false;
          this.showAlert = true;
          if(res!=-1)
         { this.alertMsg = "INFORMATION : Voucher Approved Successfully.";
        this.HandleMessage(true, MessageType.Sucess, this.alertMsg);
         }
         else{
          { this.alertMsg = "ERROR : Approval Failed.";
          this.HandleMessage(true, MessageType.Error, this.alertMsg);
           }
         }

        },
        err => {this.isLoading=false;
          this.showAlert = true;
          this.alertMsg = "ERROR : Approval Failed.";
          this.HandleMessage(true,MessageType.Error,this.alertMsg)
        }
      );
    }
    catch (exception) { let x = 0; }
  }
  public getTotalCr() {
    let total = 0;
    try {
      for (var i = 0; i < this.VoucherF.value.length; i++) {
        if (this.VoucherF.value[i].cr_amt > 0) {
          total = total + Number(this.VoucherF.value[i].cr_amt);
          this._totalCr = total;
        }
      }
    }
    catch (exception) { return 0; }
    return Math.round((total + Number.EPSILON) * 100) / 100;
  }
  public getTotalDr() {
    let total = 0;
    try {
      for (var i = 0; i < this.VoucherF.value.length; i++) {
        if (this.VoucherF.value[i].dr_amt > 0) {
          total = total + Number(this.VoucherF.value[i].dr_amt);
          //this._totalDr = total;
        }
      }
    }
    catch (exception) {
      return 0;
    }
    return Math.round((total + Number.EPSILON) * 100) / 100;
  }

  public drAmountInput(row, event) {
    this.showAlert = false;
    if (this.voucherData.value[row].acc_cd == null || this.voucherData.value[row].acc_cd == '') {
      this.showAlert = true;
      this.VoucherF.controls[row].get('dr_amt').setValue(null);
      this.VoucherF.controls[row].get('cr_amt').setValue(null);
      this.alertMsg = "ERROR : Account Code Can not be Blank !"
      this.HandleMessage(true, MessageType.Error, this.alertMsg);

      return;
    }
   try {
      ;
      if (this.VoucherF.controls[row].get('dr_amt').value > 0) {
        this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
        this.VoucherF.controls[row].get('dr_cr').setValue("Debit");
        this.VoucherF.controls[row].get('cr_amt').setValue(null);
        if(this._voucherTyp=='C')
        {
          this.VoucherF.controls[0].get('dr_amt').setValue(null);
          this.VoucherF.controls[0].get('dr_cr').setValue("Credit");
          ;
          this.VoucherF.controls[0].get('cr_amt').setValue(this.getTotalDr());

        }
      }
    }
    catch (exception) { let x = 0; }
  }
  public crAmountInput(row, event) {
    this.showAlert = false;
    if (this.voucherData.value[row].acc_cd == null || this.voucherData.value[row].acc_cd == '') {
      this.showAlert = true;
      this.VoucherF.controls[row].get('dr_amt').setValue(null);
      this.VoucherF.controls[row].get('cr_amt').setValue(null);
      this.alertMsg = "ERROR : Account Code Can not be Blank !"
      this.HandleMessage(true, MessageType.Error, this.alertMsg);
      
      return;
    }
    try {
      ;
      if (this.VoucherF.controls[row].get('cr_amt').value > 0) {
        this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
        this.VoucherF.controls[row].get('dr_cr').setValue("Credit");
        this.VoucherF.controls[row].get('dr_amt').setValue(null);
        if(this._voucherTyp=='C')
        {
          this.VoucherF.controls[0].get('cr_amt').setValue(null);
          this.VoucherF.controls[0].get('dr_cr').setValue("Debit");
          ;
          this.VoucherF.controls[0].get('dr_amt').setValue(this.getTotalCr());

        }
      }
    }
    catch (exception) { let x = 0; }
  }
  public groupBy(array, f) {
    let groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      f.transaction_type, f.voucher_dt, f.voucher_id, f.approval_status
      return groups[group];
    })
  }

  private getmAccMaster(): void {
    ;
    var dt = {
      "ardb_cd": this.sys.ardbCD
    }
    this.svc.addUpdDel<any>('Mst/GetAccountMaster', dt).subscribe(
      res => {
        ;
        this.maccmasterRet = res;
        this.maccmaster=this.maccmasterRet;
      },
      err => { }
    );
  }
  closeScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}
private  convertDate(datestring:string):Date
{
var parts = datestring.match(/(\d+)/g);
// new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
//return new Date(year, month, day);
}
private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
  this.showMsg = new ShowMessage();
  this.showMsg.Show = show;
  this.showMsg.Type = type;
  this.showMsg.Message = message;
}
}
