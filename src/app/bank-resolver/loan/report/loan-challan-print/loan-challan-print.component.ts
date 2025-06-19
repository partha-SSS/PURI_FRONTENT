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
import { ChallanPrintServiceService } from './print-service.service';
import { Subscription } from 'rxjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import jspdf from 'jspdf';
@Component({
  selector: 'app-loan-challan-print',
  templateUrl: './loan-challan-print.component.html',
  styleUrls: ['./loan-challan-print.component.css'],
  providers:[ExportAsService]
})
export class LoanChalanPrintComponent implements OnInit {
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

  main_text:string= '';
  sub_text:string= '';
  principalAmount: string = '';
  interestAmount: string = '';
  totalAmount: string = '';
  amount_in_word:string= '';

  constructor(public pServ: ChallanPrintServiceService,private svc: RestService, private formBuilder: FormBuilder,private comSer: CommonServiceService,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router) { }
  ngOnInit(): void {
    // this.getSMParameter();
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
         this.printID="hiddenTab"
       
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
    // this.getLoanAccountData();
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
      this.svc.addUpdDel('Loan/GetLoanCertificate',dt).subscribe(data=>{
        
        if(data){
          console.log(data[0]);
          this.isLoading = false;
          this.printData = data[0];
  
  
          console.log(data[0])
          if (this.printData == undefined || this.printData === null) {
            this.showAlert = true;
            this.alertMsg = 'No record found!!!';
            
          }
          else {
            debugger
         
            const fullText = this.printData.arg;
            // Extract para1 and para2
            const para1End = fullText.indexOf("He/She/Group");
            const para2End = fullText.indexOf("Principal");

            this.main_text  = fullText.substring(0, para1End).trim();
            this.sub_text  = fullText.substring(para1End, para2End).trim();
            // Split before repayment breakdown


            // const splitIndex = fullText.indexOf("Principal");
            // this.main_text = fullText.substring(0, splitIndex).trim();
            // const repaymentText = fullText.substring(splitIndex).trim();
            


            // Extract amounts using regex
            const principalMatch = fullText.match(/Principal\s+Rs\.?([\d,.]+)/i);
            const interestMatch = fullText.match(/Interest\s+Rs\.?([\d,.]+)/i);
            const totalMatch = fullText.match(/Total\s+Rs\.?([\d,.]+)/i);
            const amountInWordsMatch = fullText.match(/\((.*?)\)/);
            
            this.principalAmount = principalMatch ? principalMatch[1] : '0.00';
            this.interestAmount = interestMatch ? interestMatch[1] : '0.00';
            this.totalAmount = totalMatch ? totalMatch[1] : '0.00';
            this.amount_in_word = amountInWordsMatch ? amountInWordsMatch[1] : '';
            
          }
        }else{

          this.isLoading = false;
          this.showAlert = true;
            this.alertMsg = 'Unable to find record!!';
        }
         
  
        },
        err => {
          console.log(err);
          
          this.isLoading = false;
          this.showAlert = true;
            this.alertMsg = 'Unable to find record!!';
         
        })

    }
       
  }
 
  getSMParameter(){
    this.svc.addUpdDel('Mst/GetSystemParameter', null).subscribe(
      sysRes => {console.log(sysRes);
        this.systemParam = sysRes;})
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
