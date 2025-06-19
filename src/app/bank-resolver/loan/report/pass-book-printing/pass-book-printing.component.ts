import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { sm_parameter } from 'src/app/bank-resolver/Models/sm_parameter';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { PrintServiceService } from './print-service.service';
import { Subscription } from 'rxjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import jspdf from 'jspdf';
@Component({
  selector: 'app-pass-book-printing',
  templateUrl: './pass-book-printing.component.html',
  styleUrls: ['./pass-book-printing.component.css'],
  providers:[ExportAsService]
})
export class LoanPassBookPrintingComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('nextpage', { static: true }) nextpage: TemplateRef<any>;
  @ViewChild('fullpageUpdate', { static: true }) fullpageUpdate: TemplateRef<any>;
  @ViewChild('UpdateSuccess', { static: true }) UpdateSuccess: TemplateRef<any>;
  loanId: string;
  tm_loan_all = new tm_loan_all();
  masterModel = new LoanOpenDM();
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
  date_msg:any;
  trailbalance: tt_trial_balance[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  printID:any;
  fromdate: Date;
  toDate: Date;
  suggestedCustomer: mm_customer[];
  disabledOnNull=true;
  counter=0;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[];
  passBookData:any=[];
  printData:any=[];
  afterPrint:any=[];
  systemParam: sm_parameter[] = [];
  lastRowNo:any;
  ardbName=localStorage.getItem('ardb_name');
  branchName=this.sys.BranchName;
  shoFastPage:boolean=false;
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
  showWait=false
  restItem:any
  notvalidate:boolean=false;
  custNm:any;
  addr:any;
  joinHold:any=[]
  subscription: Subscription;
  recPrn=0;
  recIntt=0;
  balPrn=0;
  balIntt=0;
  constructor(public pServ: PrintServiceService,private svc: RestService, private formBuilder: FormBuilder,private comSer: CommonServiceService,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router) { }
  ngOnInit(): void {
    this.getSMParameter();
    // this.fromdate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      acct_num: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time;
       if(this.sys.ardbCD=="26"){
        this.printID="hiddenTab"
         
       }
       else if(this.sys.ardbCD=='1'){
         this.printID="hiddenTabContai"
       }
       else{
         this.printID="hiddenTab"
       }
  }
  
  onLoadScreen(content) {
    this.shoFastPage=false;
    this.notvalidate=false
    this.passBookData=[];
    this.printData=[];
    this.afterPrint=[];
    this.modalRef = this.modalService.show(content, this.config);
  }
  FastpageScreen() {
    this.shoFastPage=true;
  }
  
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  public onAccountTypeChange(): void {
    this.reportcriteria.controls.acct_num.setValue('');
    this.suggestedCustomer = null;
    if (+this.reportcriteria.controls.acc_type_cd.value > 0) {
      this.reportcriteria.controls.acct_num.enable();
    }
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
    this.custNm=cust.cust_name
    this.addr=cust.present_address 
    this.reportcriteria.controls.acct_num.setValue(cust.loan_id);
    this.suggestedCustomer = null;
    this.getLoanAccountData();
  }
    getLoanAccountData() {

    this.isLoading = true;
    this.tm_loan_all.loan_id = this.reportcriteria.controls.acct_num.value;
    this.tm_loan_all.brn_cd = this.sys.BranchCode;
    this.tm_loan_all.ardb_cd=this.sys.ardbCD;
    this.svc.addUpdDel<any>('Loan/GetLoanData', this.tm_loan_all).subscribe(
      res => {

        this.isLoading = false;
        this.masterModel = res;
        console.log(res)
        if (this.masterModel === undefined || this.masterModel === null) {
          this.showAlert = true;
          this.alertMsg = 'No record found!!!';
          
        }
        else {
          debugger
        this.joinHold=[];
       for (let i = 0; i <=  this.masterModel.tdaccholder.length; i++) {
         console.log( this.masterModel);
        debugger 
       this.joinHold+=( this.masterModel.tdaccholder.length==0?'': this.masterModel.tdaccholder[i].acc_holder+',')
       console.log(this.joinHold);
       }
      
        debugger 

        }

      },
      err => {
        this.isLoading = false;
        this.showAlert = true;
          this.alertMsg = 'Unable to find record!!';
       
      }

    );
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
      this.loanId=this.reportcriteria.controls.acct_num.value;
      // this.accType=this.reportcriteria.controls.acc_type_cd.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "loan_id": this.reportcriteria.controls.acct_num.value,
        // "acc_num":this.reportcriteria.controls.acct_num.value,
        // "acc_type_cd":this.reportcriteria.controls.acc_type_cd.value,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString()
      }
      this.svc.addUpdDel('Loan/LoanPassBookPrint',dt).subscribe(data=>{
        console.log(data);
        this.reportData=[];
        debugger
        let Trans = [];
        Trans = Utils.ChkArrNotEmptyRetrnEmptyArr(data)
        for(let i = 0; i<Trans.length ; i ++) {
        this.recPrn= Trans[i].curr_prn_recov+Trans[i].ovd_prn_recov+Trans[i].adv_prn_recov
        this.recIntt=Trans[i].curr_intt_recov+Trans[i].ovd_intt_recov+Trans[i].penal_intt_recov
        this.balPrn=Trans[i].curr_prn_bal+Trans[i].ovd_prn_bal
        this.balIntt=Trans[i].curr_intt_bal+Trans[i].ovd_intt_bal+Trans[i].penal_intt_bal
        
        debugger
        Trans[i].recPrn=this.recPrn
        Trans[i].recIntt=this.recIntt
        Trans[i].balPrn=this.balPrn
        Trans[i].balIntt=this.balIntt
        
        this.reportData.push(Trans[i]);
        
        

      }
        debugger
        if(!this.reportData){
          this.isLoading=false
          this.showAlert = true;
          this.alertMsg = 'No record found, Passbook already updated'; 

          return;
        }
        // else if(this.reportData.length==1){
        //   debugger
        //   this.isLoading=false
        //   let prTrans = [];
        //   prTrans = Utils.ChkArrNotEmptyRetrnEmptyArr(data);
        //   this.passBookData = [];
        //   let tot1 = data[0].balance_amt;
        //   let tot = data[0].balance_amt;
  
        //   console.log(tot);
        //    prTrans[0].balance=tot1
        //   console.log( prTrans);
        //   this.passBookData.push(prTrans[0]);
        //   debugger
        
        // }
        else{
          // let prTrans = [];
          // prTrans = Utils.ChkArrNotEmptyRetrnEmptyArr(data);
          this.passBookData = [];
          this.passBookData=this.reportData;
          debugger
          // let tot1 = data[0].balance_amt;
          // let tot = data[0].balance_amt;
  
          // console.log(tot);
          //  prTrans[prTrans.length-1].balance=tot1
          // console.log( prTrans);
          // debugger
          // for (let i = prTrans.length-1; i >= 0; i--) {
          //   if (i > 0) {
          //     if(i==prTrans.length-1){
          //       prTrans[i].balance = tot1
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
          
          debugger
          //  console.log(this.passBookData);
          //  this.passBookData.reverse();
          //  this.passBookData.pop();
           this.passBookData.filter(element => {
            return element !== null && element !== undefined;
          });
        }
        
        this.passBookPrint();
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
        if(this.reportData.length<50){
          this.pagedItems=this.reportData
        }
        this.pageChange=document.getElementById('chngPage');
        // this.pageChange.click()
        this.setPage(2);
        this.setPage(1)
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
      debugger
      this.pServ.accNum=this.loanId;
      this.pServ.joinHold=this.joinHold;
      debugger
    }
  }
  getSMParameter(){
    this.svc.addUpdDel('Mst/GetSystemParameter', null).subscribe(
      sysRes => {console.log(sysRes);
        this.systemParam = sysRes;})
  }
  updateLineNo(){
        var dt={
          "ardb_cd":this.sys.ardbCD,
          "loan_id":this.reportcriteria.controls.acct_num.value,
          "acc_cd":this.masterModel.tmloanall.acc_cd,
          "lines_printed":this.lastRowNo
         }
        this.svc.addUpdDel('Loan/LoanUpdatePassbookline',dt).subscribe(res=>{console.log(res);
        })

  }
  updatePassbookStatus(){
    debugger
    for (let i = 0; i < this.reportData.length; i++) {
        this.reportData[i].printed_flag = 'Y';
        this.reportData[i].ardb_cd= this.sys.ardbCD;
        this.reportData[i].acc_cd=this.masterModel.tmloanall.acc_cd;// Push 'Y' into data array
    }
    debugger
    this.svc.addUpdDel<any>('Loan/LoanUpdatePassbookData', this.reportData).subscribe(
    res => {console.log(res);
      setTimeout(() => {
        this.modalRef = this.modalService.show(this.UpdateSuccess, this.config);
        this.reportData=[];
        this.printData=[];
      }, 6000);
      
    })
  }
  passBookPrint(){
    var o = {
      trans_dt  : null,
      particulars   : null,
      issue_amt : null,
      curr_prn_recov : null,
      curr_intt_recov : null,
      curr_prn_bal : null,
      curr_intt_bal : null,
      ovd_prn_bal : null,

      }
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "loan_id":this.reportcriteria.controls.acct_num.value,
      "acc_cd":this.masterModel.tmloanall.acc_cd,
     }
     debugger
    this.svc.addUpdDel('Loan/LoanGetPassbookline',dt).subscribe(lRowNo=>{
      this.lastRowNo = lRowNo;
      for(let i = 0; i< this.passBookData.length ; i ++) 
      {this.printData.push(this.passBookData[i]);}
      debugger
      // this.printData=this.passBookData.length>1?this.passBookData.slice():this.passBookData;
      // this.printData=this.passBookData;
      if(this.lastRowNo == 30){
        this.modalRef = this.modalService.show(this.fullpageUpdate, this.config);
        console.log( this.printData);
      if(this.printData.length>13){
        this.printData.splice(14, 0, o);
        this.printData.splice(15, 0, o);
        this.printData.splice(16, 0, o);
        console.log( this.printData);
        this.lastRowNo=this.printData.length-3
      }
      else{
        this.lastRowNo=this.printData.length
        // this.updateLineNo();
        // this.updatePassbookStatus();
      }
      if(this.printData.length >32) {
        for(let i = 0; i< this.printData.length ; i ++) 
        {
          if(i>32){
          this.afterPrint.push(this.printData[i]);
          this.restItem=this.afterPrint.length;
          }
        }
          this.printData.splice(33,this.printData.length-33);
          debugger;
      }
      
      else{
        if(this.printData.length>13 && this.printData.length<32){
          this.lastRowNo=this.printData.length-3
          // this.updateLineNo();
          // this.updatePassbookStatus();
        }
      }
      console.log(this.lastRowNo);
      }
      else{
      
      for (let index = 0; index <= this.lastRowNo; index++) {
        this.printData.unshift(o);
      } 
      console.log( this.printData);
      if(this.printData.length>13){
        this.printData.splice(14, 0, o);
        this.printData.splice(15, 0, o);
        this.printData.splice(16, 0, o);
        console.log( this.printData);
        this.lastRowNo=this.printData.length-3
      }
      else{
        this.lastRowNo=this.printData.length
        // this.updateLineNo();
        // this.updatePassbookStatus();
      }
      if(this.printData.length >32) {
        for(let i = 0; i< this.printData.length ; i ++) 
        {
          if(i>32){
          this.afterPrint.push(this.printData[i]);
          this.restItem=this.afterPrint.length;
          }
        }
          this.printData.splice(33,this.printData.length-33);
          debugger;
      }
      
      else{
        if(this.printData.length>13 && this.printData.length<32){
          this.lastRowNo=this.printData.length-3
          // this.updateLineNo();
          // this.updatePassbookStatus();
        }
      }
      console.log(this.lastRowNo);
      
      
      console.log(this.printData);
      debugger;
       
    }
       
    })
  }
  printCall(){
  // if(this.printData.length<=33){ 
  //   debugger
  //   this.printData=this.printData
  //   let printContents = document.getElementById('hiddenTab').innerHTML;
  //   let originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents
  //   document.body.innerHTML = originalContents;
    if(this.afterPrint.length>0){
      this.PrintNext()
      debugger
        setTimeout(() => {
        this.modalRef = this.modalService.show(this.nextpage, this.config);
        }, 5000);
      
    }
    else{
      debugger
       this.updateLineNo()
       this.updatePassbookStatus()
      // this.showAlert = true;
      // this.alertMsg = 'Passbook Already Update ...';
      
    }
    // }
    

    // if(this.afterPrint.length>0){


    //   debugger
    //   this.printData=this.printData
    //   let printContents = document.getElementById('hiddenTab').innerHTML;
    //   let originalContents = document.body.innerHTML;
    //   document.body.innerHTML = printContents
    //   document.body.innerHTML = originalContents;
    // }
    // else{
    //   debugger
    //   this.printData=this.printData
    //   let printContents = document.getElementById('hiddenTab').innerHTML;
    //   let originalContents = document.body.innerHTML;
    //   document.body.innerHTML = printContents
    //   document.body.innerHTML = originalContents;
    //   this.showAlert = true;
    //   this.alertMsg = 'Passbook Update Successfully...';
    // }
    
  }
  PrintNext(){
    var o = {
      trans_dt  : null,
      particulars   : null,
      balance : null,
      amount : null,
      trans_type : null,
      instrument_num : null,
      }
    this.modalRef.hide();
    this.printData=[];
    for(let i = 0; i< this.afterPrint.length ; i ++) 
      {
        this.printData.push(this.afterPrint[i]);
      }
      debugger;
      console.log( this.printData);
      if(this.printData.length>0 && this.printData.length<13){
        debugger
        this.restItem=0;
        this.restItem=this.printData.length;

      }
      if(this.printData.length>13){
        this.printData.splice(14, 0, o);
        this.printData.splice(15, 0, o);
        this.printData.splice(16, 0, o);
        console.log( this.printData);
      }
      else{
        this.lastRowNo=0;
        this.lastRowNo=this.printData.length
        // this.updateLineNo();
        // this.updatePassbookStatus();
      }
      debugger;
      if(this.printData.length >32) {
        this.afterPrint=[];
        this.restItem=0;
        for(let i = 0; i< this.printData.length ; i ++) 
          { if(i>32){
            this.afterPrint.push(this.printData[i]);
            this.lastRowNo=this.afterPrint.length
            this.restItem=this.afterPrint.length;

          }
          }
          this.printData.splice(33,this.printData.length-33);
          debugger;
      }
      else{
        this.afterPrint=[];
        
        if(this.printData.length>13 && this.printData.length<32){
        this.restItem=0;
        this.lastRowNo=this.printData.length-3
        this.restItem=this.printData.length-3;

        // this.updateLineNo();
        // this.updatePassbookStatus();
        }
      }
      console.log(this.lastRowNo);
      debugger;
      
      console.log(this.printData);
      
      // let el: HTMLElement = this.print.nativeElement;
      // el.click();
  }
  public oniframeLoad(): void {
    this.counter++;
    if(this.counter==2){
      this.isLoading=false;
      this.counter=0;
    }
    else{
      this.isLoading=true;
    }
    // this.isLoading = false;
    this.modalRef.hide();
  }
  public closeAlert() {
    this.showAlert = false;
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); //Retrieve items for page
    console.log(this.pagedItems)
  
    this.cd.detectChanges();
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'csv',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'hiddenTab'
    }
    this.exportAsService.save(this.exportAsConfig, 'cashcumtrial').subscribe(() => {
      // save started
      console.log("hello")
    });
  }

download(){
  // const doc = new jsPDF();
  // const content = document.getElementById('trial');
  // html2canvas(content).then(canvas => {
  //   const imgData = canvas.toDataURL('image/png');
  //   doc.addImage(imgData, 'PNG', 0, 0, 600, 400);
  //   doc.save('document.pdf');
  // });
  let data = document.getElementById('trial');
    html2canvas(data).then(canvas => {
    // Few necessary setting options
    const imgWidth = 250;
    const pageHeight = 295;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    const heightLeft = imgHeight;

    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    pdf.save('new-file.pdf'); // Generated PDF
    });
  
}
  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
}
