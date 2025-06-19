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
@Component({
  selector: 'app-pass-book-printing',
  templateUrl: './pass-book-printing.component.html',
  styleUrls: ['./pass-book-printing.component.css'],
  providers:[ExportAsService]
})
export class PassBookPrintingComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('nextpage', { static: true }) nextpage: TemplateRef<any>;
  @ViewChild('fullpageUpdate', { static: true }) fullpageUpdate: TemplateRef<any>;
  @ViewChild('UpdateSuccess', { static: true }) UpdateSuccess: TemplateRef<any>;
  accNum: string;
  accType: string;
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
  printDataGhatal:any=[];
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
  printID:any;
  monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"
  ];
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router) { }
  ngOnInit(): void {
    this.getSMParameter();
    // this.fromdate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      acct_num: [{ value: '', disabled: true }, Validators.required],
      acc_type_cd: [null, Validators.required]
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
      if(this.sys.ardbCD=="15"){
        this.printID="hiddenTabNP"
         
       }
      else if(this.sys.ardbCD=="4"){
        this.printID="hiddenTabGhatal"
      }
      else{
        this.printID="hiddenTab"
      }
  }
  onLoadScreen(content) {
    this.passBookData=[];
    this.printData=[];
    this.printDataGhatal=[];
    this.afterPrint=[];
    this.modalRef = this.modalService.show(content, this.config);
    this.shoFastPage=false;
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
      if(+this.reportcriteria.controls.acc_type_cd.value==6){
        this.printID="hiddenTabRD"
      }
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
    this.showWait=true;
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = (+this.reportcriteria.controls.acc_type_cd.value);
      prm.as_cust_name = this.reportcriteria.controls.acct_num.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res.slice(0, 10);
          } else {
            this.suggestedCustomer = [];
          }
          this.showWait=false
        },
        

        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }

  public SelectCustomer(cust: any): void {
    this.cName=cust.cust_name
    this.cAddress=cust.present_address
    this.cAcc=cust.acc_num
    this.reportcriteria.controls.acct_num.setValue(cust.acc_num);
    this.fromdate = Utils.convertStringToDt(cust.opening_dt);
    this.toDate = this.sys.CurrentDate;
    this.suggestedCustomer = null;
  }
  getMY(d:any){
    const [day, month, year,  hour = '00', minute = '00'] = d.split(/[/: ]/);
    const dateObject = new Date(year, month - 1, day, hour, minute);
    const formattedDate = dateObject.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    console.log(formattedDate); 
    
    return formattedDate
  }

  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      

      this.modalRef.hide();
      this.reportData.length=0
      this.pagedItems.length=0;
      this.isLoading=true
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      this.accNum=this.reportcriteria.controls.acct_num.value;
      this.accType=this.reportcriteria.controls.acc_type_cd.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "acc_num":this.reportcriteria.controls.acct_num.value,
        "acc_type_cd":this.reportcriteria.controls.acc_type_cd.value,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString()
      }
      
      this.svc.addUpdDel('Deposit/PassBookPrint',dt).subscribe(data=>{
        console.log(data);
        this.reportData=data
       
        
        if(this.reportData.length>0){
           if(this.reportData.length==1){
           for (let i = 0; i < this.reportData.length; i++) {
         this.reportData[i].ardb_cd=this.getMY(this.reportData[i].particulars)
         
        }
          this.isLoading=false
          let prTrans = [];
          prTrans = Utils.ChkArrNotEmptyRetrnEmptyArr(data);
          this.passBookData = [];
          let tot1 = data[0]?.balance_amt;
          let tot = data[0]?.balance_amt;
  
          console.log(tot);
           prTrans[0].balance=tot1
          console.log( prTrans);
          this.passBookData.push(prTrans[0]);
          
        
        }
        else{
          for (let i = 0; i < this.reportData.length; i++) {
         this.reportData[i].ardb_cd=this.getMY(this.reportData[i].particulars)
         
        }
          let prTrans = [];
          prTrans = Utils.ChkArrNotEmptyRetrnEmptyArr(data);
          this.passBookData = [];
          let tot1 = data[0]?.balance_amt;
          let tot = data[0]?.balance_amt;
  
          console.log(tot);
           prTrans[prTrans.length-1].balance=tot
          console.log( prTrans);
          
          for (let i = prTrans.length-1; i >= 0; i--) {
            
            if (i > 0) {
              if(i==prTrans.length-1){
                prTrans[i].balance = tot
               this.passBookData.push(prTrans[i]);
             
              }
              else{
                 if (prTrans[i+1].trans_type === 'D') { // deposit
                  tot -= Number(prTrans[i+1].amount);
                } else {
                  tot += Number(prTrans[i+1].amount);
                }
              }
              
               prTrans[i].balance = tot
               if(i==1){
               tot1=prTrans[i].balance;
               }
               this.passBookData.push(prTrans[i]);
            }
            else{
              if (prTrans[i+1].trans_type === 'D') { 
                tot1 -= Number(prTrans[i+1].amount);
              } else {
                tot1 += Number(prTrans[i+1].amount);
              }
               prTrans[i].balance = tot1;
               this.passBookData.push(prTrans[i]);
               
            }
          }
          
          //  this.passBookData.splice(0,this.passBookData.length-1)
           console.log(this.passBookData);
           this.passBookData.reverse();
           this.passBookData.pop();
           this.passBookData.filter(element => {
            return element !== null && element !== undefined;
          });
        }
        if(this.accType=='6'){
          this.rdPassbook()
        }
        else{
          this.passBookPrint();
        }
        }
        else{
          this.isLoading=false
          this.showAlert = true;
          this.alertMsg = 'No record found, Passbook already updated'; 

          return;
        }
        
        
       
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
          "acc_num":this.reportcriteria.controls.acct_num.value,
          "acc_type_cd":this.reportcriteria.controls.acc_type_cd.value,
          "lines_printed":this.lastRowNo
         }
        this.svc.addUpdDel('Deposit/UpdatePassbookline',dt).subscribe(res=>{console.log(res);
        })

  }
  updatePassbookStatus(){
    
    let ardbCD=this.sys.ardbCD;
    for (let i = 0; i < this.reportData.length; i++) {
        this.reportData[i].printed_flag = 'Y';
        this.reportData[i].ardb_cd= ardbCD;
        this.reportData[i].acc_type_cd=this.reportcriteria.controls.acc_type_cd.value;// Push 'Y' into data array
    }
    
    this.svc.addUpdDel<any>('Deposit/UpdatePassbookData', this.reportData).subscribe(
    res => {console.log(res);
      setTimeout(() => {
        this.modalRef = this.modalService.show(this.UpdateSuccess, this.config);
        this.reportData=[];
        this.printData=[];
      }, 6000);
      
    })
  }
  rdPassbook(){
    
    const o = {
      instrument_num : null,
      trans_dt  : null,
      ardb_cd : null,
      amount : null,
      balance : null,
      
     }
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "acc_num":this.reportcriteria.controls.acct_num.value,
      "acc_type_cd":this.reportcriteria.controls.acc_type_cd.value,
     }
     this.svc.addUpdDel('Deposit/GetPassbookline',dt).subscribe(lRowNo=>{
      this.lastRowNo = lRowNo;
      
      this.printData=this.passBookData.length>1?this.passBookData.slice():this.passBookData;
      // this.printData=this.passBookData.slice();
      if(this.lastRowNo == 35){
        this.modalRef = this.modalService.show(this.fullpageUpdate, this.config);
        console.log( this.printData);
      if(this.printData.length>16){
        this.printData.splice(17, 0, o);
        this.printData.splice(18, 0, o);
        // this.printData.splice(22, 0, o);
        // this.printData.splice(16, 0, o);
        console.log( this.printData);
        this.lastRowNo=this.printData.length-2
      }
      else{
        this.lastRowNo=this.printData.length
        // this.updateLineNo();
        // this.updatePassbookStatus();
      }
      if(this.printData.length >37) {
        for(let i = 0; i< this.printData.length ; i ++) 
        {
          this.afterPrint.push(this.printData[i]);
          this.restItem=this.afterPrint.length;
        }
          this.printData.splice(37,this.printData.length-37);
          ;
      }
      
      else{
        if(this.printData.length>16 && this.printData.length<37){
          this.lastRowNo=this.printData.length-2
          // this.updateLineNo();
          // this.updatePassbookStatus();
        }
      }
      console.log(this.lastRowNo);
      }
      else{
      
      for (let index = 1; index <= this.lastRowNo; index++) {
        this.printData.unshift(o);
      } 
      console.log( this.printData);
      if(this.printData.length<16){
        this.lastRowNo=this.printData.length
      }
      else if(this.printData.length>16 && this.printData.length<35){
        this.printData.splice(17, 0, o);
        this.printData.splice(18, 0, o);
        this.lastRowNo=this.printData.length-2;
      }
      else{
        this.printData.splice(17, 0, o);
        this.printData.splice(18, 0, o);
        this.lastRowNo=this.printData.length-2;
        for(let i = 0; i< this.printData.length ; i ++) 
        {
          if(i>36){
          this.afterPrint.push(this.printData[i]);
          this.restItem=this.afterPrint.length;
        }
        }
          this.printData.splice(37,this.printData.length-37);
      }
      
      console.log(this.lastRowNo);
      
      
      console.log(this.printData);
      ;
       
    }
       
    })
  }
  passBookPrint(){
    
    const o = {
      trans_dt  : null,
      particulars   : null,
      balance : null,
      amount : null,
      trans_type : null,
      instrument_num : null,
      }
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "acc_num":this.reportcriteria.controls.acct_num.value,
      "acc_type_cd":this.reportcriteria.controls.acc_type_cd.value,
     }
     if(this.sys.ardbCD!="2"&&this.sys.ardbCD!="3"&&this.sys.ardbCD!="4"){
    this.svc.addUpdDel('Deposit/GetPassbookline',dt).subscribe(lRowNo=>{
      this.lastRowNo = lRowNo;
      
      this.printData=this.passBookData.length>1?this.passBookData.slice():this.passBookData;
      // this.printData=this.passBookData.slice();
      if(this.lastRowNo == 29){
        this.modalRef = this.modalService.show(this.fullpageUpdate, this.config);
        console.log( this.printData);
      if(this.printData.length>13){
        this.printData.splice(14, 0, o);
        // this.printData.splice(15, 0, o);
        // this.printData.splice(16, 0, o);
        console.log( this.printData);
        this.lastRowNo=this.printData.length-1
      }
      else{
        this.lastRowNo=this.printData.length
        // this.updateLineNo();
        // this.updatePassbookStatus();
      }
      if(this.printData.length >30) {
        for(let i = 0; i< this.printData.length ; i ++) 
        {
          if(i>30){
          this.afterPrint.push(this.printData[i]);
          this.restItem=this.afterPrint.length;
          }
        }
          this.printData.splice(30,this.printData.length-30);
          ;
      }
      
      else{
        if(this.printData.length>13 && this.printData.length<30){
          this.lastRowNo=this.printData.length-1
          // this.updateLineNo();
          // this.updatePassbookStatus();
        }
      }
      console.log(this.lastRowNo);
      }
      else{
      
      for (let index = 1; index <= this.lastRowNo; index++) {
        this.printData.unshift(o);
      } 
      console.log( this.printData);
      if(this.printData.length>13){
        this.printData.splice(14, 0, o);
        // this.printData.splice(15, 0, o);
        // this.printData.splice(16, 0, o);
        console.log( this.printData);
        this.lastRowNo=this.printData.length-1
      }
      else{
        this.lastRowNo=this.printData.length
        // this.updateLineNo();
        // this.updatePassbookStatus();
      }
      if(this.printData.length >29) {
        for(let i = 0; i< this.printData.length ; i ++) 
        {
          if(i>29){
          this.afterPrint.push(this.printData[i]);
          this.restItem=this.afterPrint.length;
          }
        }
          this.printData.splice(30,this.printData.length-30);
          ;
      }
      
      else{
        if(this.printData.length>13 && this.printData.length<29){
          this.lastRowNo=this.printData.length-1
          // this.updateLineNo();
          // this.updatePassbookStatus();
        }
      }
      console.log(this.lastRowNo);
      
      
      console.log(this.printData);
      ;
       
    }
       
    })
  }
  else if(this.sys.ardbCD=="4"){
    this.svc.addUpdDel('Deposit/GetPassbookline',dt).subscribe(lRowNo=>{
      this.lastRowNo = lRowNo;
      
      this.printDataGhatal=this.passBookData.length>1?this.passBookData.slice():this.passBookData;
      // this.printData=this.passBookData.slice();
      if(this.lastRowNo == 20){
        this.modalRef = this.modalService.show(this.fullpageUpdate, this.config);
        console.log( this.printDataGhatal);
      
      if(this.printDataGhatal.length >20) {
        for(let i = 0; i< this.printDataGhatal.length ; i ++) 
        {
          if(i>19){
          this.afterPrint.push(this.printDataGhatal[i]);
          this.restItem=this.afterPrint.length;
          }
        }
          this.printDataGhatal.splice(20,this.printDataGhatal.length-20);
          ;
      }
      
      else{
        if(this.printDataGhatal.length<20){
          this.lastRowNo=this.printDataGhatal.length
          // this.updateLineNo();
          // this.updatePassbookStatus();
        }
      }
      console.log(this.lastRowNo);
      }
      else{
        for (let index = 0; index < this.lastRowNo; index++) {
          this.printDataGhatal.unshift(o);
        } 
      console.log( this.printDataGhatal);
     
        this.lastRowNo=this.printDataGhatal.length
       
      if(this.printDataGhatal.length >19) {
        for(let i = 0; i< this.printDataGhatal.length ; i ++) 
        {
          if(i>19){
          this.afterPrint.push(this.printDataGhatal[i]);
          this.restItem=this.afterPrint.length;
          }
        }
          this.printDataGhatal.splice(20,this.printDataGhatal.length-20);
          ;
      }
      
      else{
        if( this.printDataGhatal.length<20){
          this.lastRowNo=this.printDataGhatal.length
          // this.updateLineNo();
          // this.updatePassbookStatus();
        }
      }
      console.log(this.lastRowNo);
      
      
      console.log(this.printDataGhatal);
      ;
       
    }
       
    })
  }
  else{
    this.printData=[]
  }
  }
  printCall(){
  // if(this.printData.length<=33){ 
  //   
  //   this.printData=this.printData
  //   let printContents = document.getElementById('hiddenTab').innerHTML;
  //   let originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents
  //   document.body.innerHTML = originalContents;
    if(this.afterPrint.length>0){
      if(this.accType=='6'){
        this.rdPrintNext()
      }
      else{
        this.PrintNext()
      }
      
        setTimeout(() => {
        this.modalRef = this.modalService.show(this.nextpage, this.config);
        }, 5000);
      
    }
    else{
      
       this.updateLineNo()
       this.updatePassbookStatus()
      // this.showAlert = true;
      // this.alertMsg = 'Passbook Already Update ...';
      
    }
    // }
    

    // if(this.afterPrint.length>0){


    //   
    //   this.printData=this.printData
    //   let printContents = document.getElementById('hiddenTab').innerHTML;
    //   let originalContents = document.body.innerHTML;
    //   document.body.innerHTML = printContents
    //   document.body.innerHTML = originalContents;
    // }
    // else{
    //   
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
    if(this.sys.ardbCD!="2"&&this.sys.ardbCD!="3"&&this.sys.ardbCD!="4"){
      const o = {
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
        ;
        console.log( this.printData);
        if(this.printData.length>0 && this.printData.length<13){
          
          this.restItem=0;
          this.restItem=this.printData.length;
  
        }
        if(this.printData.length>13){
          this.printData.splice(14, 0, o);
          // this.printData.splice(15, 0, o);
          // this.printData.splice(16, 0, o);
          console.log( this.printData);
        }
        else{
          this.lastRowNo=0;
          this.lastRowNo=this.printData.length
          // this.updateLineNo();
          // this.updatePassbookStatus();
        }
        ;
        if(this.printData.length >29) {
          this.afterPrint=[];
          this.restItem=0;
          for(let i = 0; i< this.printData.length ; i ++) 
            { if(i>29){
              this.afterPrint.push(this.printData[i]);
              this.lastRowNo=this.afterPrint.length
              this.restItem=this.afterPrint.length;
  
            }
            }
            this.printData.splice(30,this.printData.length-30);
            ;
        }
        else{
          this.afterPrint=[];
          
          if(this.printData.length>13 && this.printData.length<29){
          this.restItem=0;
          this.lastRowNo=this.printData.length-1
          this.restItem=this.printData.length-1;
  
          // this.updateLineNo();
          // this.updatePassbookStatus();
          }
        }
        console.log(this.lastRowNo);
        ;
        
        console.log(this.printData);
        
    }
    else if(this.sys.ardbCD=="4"){
      this.modalRef.hide();
      this.printDataGhatal=[];
      for(let i = 0; i< this.afterPrint.length ; i ++) 
        {
          this.printDataGhatal.push(this.afterPrint[i]);
        }
        ;
        
          this.lastRowNo=0;
          this.lastRowNo=this.printDataGhatal.length
        
        if(this.printDataGhatal.length >19) {
          this.afterPrint=[];
          this.restItem=0;
          for(let i = 0; i< this.printDataGhatal.length ; i ++) 
            { if(i>19){
              this.afterPrint.push(this.printDataGhatal[i]);
              this.lastRowNo=this.afterPrint.length
              this.restItem=this.afterPrint.length;
  
            }
            }
            this.printDataGhatal.splice(20,this.printDataGhatal.length-20);
            ;
        }
        else{
          this.afterPrint=[];
          
        
          this.restItem=0;
          this.lastRowNo=this.printDataGhatal.length
          this.restItem=this.printDataGhatal.length;
  
          // this.updateLineNo();
          // this.updatePassbookStatus();
          
        }
    }
    else{
      this.printData=[]
    }
  }
  rdPrintNext(){
    const o = {
      instrument_num : null,
      trans_dt  : null,
      ardb_cd : null,
      amount : null,
      balance : null,
      }
      this.modalRef.hide();
      this.printData=[];
      for(let i = 0; i< this.afterPrint.length ; i ++) 
        {
          this.printData.push(this.afterPrint[i]);
        }
        
        console.log( this.printData);
        if(this.printData.length>0 && this.printData.length<16){
          
          this.restItem=0;
          this.restItem=this.printData.length;
  
        }
        else if(this.printData.length>16 && this.printData.length<35){
          this.printData.splice(17, 0, o);
          this.printData.splice(18, 0, o);
          this.restItem=0;
          this.lastRowNo=this.printData.length-2
          this.restItem=this.printData.length-2;
          console.log( this.printData);
        }
       
        
        else if(this.printData.length >36) {
          this.afterPrint=[];
          this.restItem=0;
          this.printData.splice(17, 0, o);
          this.printData.splice(18, 0, o);
          for(let i = 0; i< this.printData.length ; i ++) 
            { if(i>36){
              this.afterPrint.push(this.printData[i]);
              this.lastRowNo=this.printData.length-2
              this.restItem=this.printData.length-2
  
            }
            }
            this.printData.splice(37,this.printData.length-37);
            ;
        }
        else{
          this.afterPrint=[];
         
        }
        console.log(this.lastRowNo);
        ;
        
        console.log(this.printData);
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


  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
}
