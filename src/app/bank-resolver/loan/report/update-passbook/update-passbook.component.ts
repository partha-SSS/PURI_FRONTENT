import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { YEAR } from 'ngx-bootstrap/chronos/units/constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { MessageType, mm_acc_type, mm_customer, m_acc_master, p_loan_param, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { InAppMessageService, RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';

@Component({
  selector: 'app-update-passbook',
  templateUrl: './update-passbook.component.html',
  styleUrls: ['./update-passbook.component.css']
})
export class LoanUpdatePassbookComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true, // disable backdrop click to close the modal
    class: 'modal-lg'
  };
  passBookData:any[]=[];
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  toDate: Date;
  suggestedCustomer: mm_customer[];
  disabledOnNull=true
  counter=0
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName

  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  clsdrSum=0;
  clscrSum=0;
  lastAccCD:any;
  today:any
  cName:any
  cAddress:any
  cAcc:any
  showWait=false;
  notvalidate:boolean=false;
  date_msg:any;

  constructor(private svc: RestService, private elementRef: ElementRef,private formBuilder: FormBuilder,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router, private comSer:CommonServiceService) { }
    accountTypeList: mm_acc_type[]= [];
    param :any[]=[];
    isTrade: boolean = false;
    showMsg: ShowMessage;
    asOnDate : any;

  ngOnInit(): void {
    console.log(window.location.hostname)

    // this.getAccountTypeList();
    this.asOnDate =this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      acct_num: [null, Validators.required],
      // acc_type_cd: [null, Validators.required],
      // cust_name: [null, Validators.required]
      
    });
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }
  onLoadScreen(content) {
    this.notvalidate=false

    this.modalRef = this.modalService.show(content, this.config);
  }
  cancelOnNull() {
    this.suggestedCustomer = null;
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      this.disabledOnNull = false;
    }
    else {
      this.disabledOnNull = true
    }
  }
  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  public closeAlert() {
    this.showAlert = false;
  }
  public onAccountTypeChange(): void {
    this.reportcriteria.controls.acct_num.setValue('');
    this.suggestedCustomer = null;
    if (+this.reportcriteria.controls.acc_type_cd.value > 0) {
      this.reportcriteria.controls.acct_num.enable();
    }
  }
  onChangeNull(){
    this.suggestedCustomer = null

    if (this.reportcriteria.controls.acct_num.value.length > 0) 
      this.disabledOnNull=false
    else 
      this.disabledOnNull=true
  }

  public suggestCustomer(): void {
    // debugger;
    this.showWait=true
    this.isLoading = true;
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      prm.as_cust_name = this.reportcriteria.controls.acct_num.value.toLowerCase();
      prm.ardb_cd = this.sys.ardbCD
      this.svc.addUpdDel<any>('Loan/GetLoanDtlsByID', prm).subscribe(
        res => {
          this.isLoading = false
          console.log(res)
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res;
          } else {
            this.isLoading = false
            this.suggestedCustomer = [];
          }
          this.showWait=false;
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.isLoading = false;
      this.suggestedCustomer = null;
    }
  }
  public SelectCustomer(cust: any): void {
    console.log(cust)
    const date = Utils.convertStringToDt(cust.disb_dt);
    this.fromdate = date
    this.toDate=this.sys.CurrentDate
    // this.loanId=cust.loan_id
    // this.custNm=cust.cust_name
    // this.addr=cust.present_address 1014007857
    this.reportcriteria.controls.acct_num.setValue(cust.loan_id);
    this.suggestedCustomer = null;
  }

  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else if(this.reportcriteria.controls.fromDate.value>this.reportcriteria.controls.toDate.value){
      this.date_msg= this.comSer.date_msg
      this.notvalidate=true
    }

    else {
      this.modalRef.hide();
      this.reportData.length=0
      this.pagedItems.length=0;
      this.isLoading=true
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "loan_id":this.reportcriteria.controls.acct_num.value,
        // "acc_type_cd":this.reportcriteria.controls.acc_type_cd.value,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString()
      }
      this.svc.addUpdDel('Loan/LoanGetUpdatePassbookData',dt).subscribe(data=>{
        console.log(data);
        this.reportData=data
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.isLoading=false
        // let prTrans = [];
        // prTrans = Utils.ChkArrNotEmptyRetrnEmptyArr(data);
        // prTrans = Utils.ChkArrNotEmptyRetrnEmptyArr(data);
        this.passBookData = [];
        // let tot = data[0].balance_amt;
        // console.log(tot);
        // prTrans[length].balance= data[0].balance_amt
        // console.log( prTrans);
        // this.passBookData.push(prTrans[length]);
        // for (let i = prTrans.length-1; i >= 0; i--) {
        //   if (i !=0) {
        //     if (prTrans[i - 1].trans_type === 'D') { // deposit
        //       tot -= +(prTrans[i - 1].amount);
        //     } else {
        //       tot += +(prTrans[i - 1].amount);
        //     }
        //      prTrans[i].balance = tot;
        //      this.passBookData.push(prTrans[i]);
        //   }
        // }
        // for (let i = prTrans.length-1; i >= 0; i--) {
        //   if (i > 0) {
        //     if(i==prTrans.length-1){
        //       prTrans[i].balance = tot
        //      this.passBookData.push(prTrans[i]);
        //     }
        //     else{
        //        if (prTrans[i+1].trans_type === 'D') { 
        //         tot -= Number(prTrans[i+1].amount);
        //       } else {
        //         tot += Number(prTrans[i+1].amount);
        //       }
        //     }
            
        //      prTrans[i].balance = tot
        //      this.passBookData.push(prTrans[i]);
        //   }
          // else{
          //   if (prTrans[i].trans_type === 'D') { 
          //     tot -= Number(prTrans[i+1].amount);
          //   } else {
          //     tot += Number(prTrans[i+1].amount);
          //   }
          //    prTrans[i].balance = tot;
          //    this.passBookData.push(prTrans[i]);
          // }
        // }
        this.passBookData=this.reportData
        //  this.passBookData.splice(0,this.passBookData.length-1)
         console.log(this.passBookData);
         debugger
        //  this.passBookData.reverse();
        //  this.passBookData.pop();
        //  this.passBookData.pop();

        //  debugger
        //  this.passBookData.reverse();
        //  console.log(this.passBookData[length-1]);
        
          // console.log(this.passBookData);
       
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
        if(this.reportData.length<50){
          this.pagedItems=this.reportData
        }
        this.pageChange=document.getElementById('chngPage');
        // this.pageChange.click()
        // this.setPage(2);
        // this.setPage(1)
        this.modalRef.hide();
      })
      this.showAlert = false;
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      // this.UrlString = this.svc.getReportUrl();
      // this.UrlString = this.UrlString + 'WebForm/Deposit/passbookprint?'
      //   + 'ardb_cd='+this.sys.ardbCD
      //   + '&brn_cd=' + this.sys.BranchCode
      //   + '&acc_type_cd=' + (+this.reportcriteria.controls.acc_type_cd.value)
      //   + '&acc_num=' + this.reportcriteria.controls.acct_num.value
      //   + '&from_dt=' + Utils.convertDtToString(this.fromdate)
      //   + '&to_dt=' + Utils.convertDtToString(this.toDate);
      // this.isLoading = true;
      // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 10000);
    }
  }
  getAccountTypeList() {
    ;

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        ;
        this.accountTypeList = res;
        this.passBookData = this.passBookData.filter(c => c.printed_flag === 'L');
        this.accountTypeList.forEach(x=>x.calc=false);
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        ;
      }
    );
  }
  changeTradesByCategory(isChecked: boolean,i:any) {
    console.log(i);
    console.log(isChecked);
    
    if(isChecked){
      this.passBookData[i].printed_flag='Y';

    }
    else{
      this.passBookData[i].printed_flag='N';

    }
    console.log( this.passBookData); 
    
  }

  allTrades(event) {
    ;
    const checked = event.target.checked;
    if(checked)
    this.accountTypeList.forEach(item => item.calc = true);
    else
    this.accountTypeList.forEach(item => item.calc = false);
  }
  onApproveClick()
  {
    this.passBookData.forEach(element => {
      element.ardb_cd=this.sys.ardbCD
      // element.acc_type_cd=Number(this.reportcriteria.controls.acc_type_cd.value)
      
    });
      this.isLoading=true;
      this.svc.addUpdDel<any>('Loan/LoanUpdatePassbookData', this.passBookData).subscribe(
        res => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'Passbook Update Successfull!!!!!!!!!!');
        },
        err => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'Passbook Update Failed!!!!!!!!!!');
        }
      );

   }

  /** Below method handles message show/hide */
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}
