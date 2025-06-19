import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-profit-and-loss-new',
  templateUrl: './profit-and-loss-new.component.html',
  styleUrls: ['./profit-and-loss-new.component.css'],
  providers:[ExportAsService]

})
export class ProfitAndLossNewComponent implements OnInit {

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  // trailbalance: tt_trial_balance[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  ReportUrl: SafeResourceUrl;
  exportAsConfig:ExportAsConfig;
  format2:boolean=false;
  mainFormat:boolean=true;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  counter=0;
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
  lastLi:any;
  lastAss:any;
  li=0;
  ass=0;
  
  revenueData: any[] = [];
  expenseData: any[] = [];

  groupedrevenueData: any[] = [];
  groupedexpenseData: any[] = [];

  totalRevenue = { cr_amount: 0, prev_cr_amount: 0};
  totalExpense = { dr_amount: 0, prev_dr_amount: 0};

  constructor(private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService,
              private modalService: BsModalService, private _domSanitizer: DomSanitizer, private cd: ChangeDetectorRef,
              private router: Router, private comser:CommonServiceService) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      // toDate: [null, null]
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
    this.modalRef = this.modalService.show(content, this.config);
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }

  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.opdrSum=0;
      this.opcrSum=0
      this.modalRef.hide()
      this.reportData.length=0;
      this.pagedItems.length=0
      this.showAlert = false;
      this.fromdate=this.reportcriteria.value['fromDate'];
      // this.todate=this.reportcriteria.value['toDate'];
      //this.isLoading=true;
      //this.onReportComplete();
      // this.modalService.dismissAll(this.content);
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        // "to_dt":this.todate.toISOString()
      }
      this.svc.addUpdDel('Finance/PopulateProfitandLoss',dt).subscribe(data=>{console.log(data)
      this.reportData=data
      if(this.reportData.length==0){
        this.comser.SnackBar_Nodata()
      } 
      else{
        
        const { revenueArray, expenseArray } = this.transformData(this.reportData);
          this.revenueData = revenueArray;
          this.expenseData = expenseArray;

        this.groupedrevenueData = this.groupByScheduleR(this.revenueData);
        this.groupedexpenseData = this.groupByScheduleE(this.expenseData);
    
        this.calculateGrandTotalR(this.revenueData, this.totalRevenue);
        this.calculateGrandTotalE(this.expenseData, this.totalExpense);
        console.log(this.groupedrevenueData,this.groupedexpenseData);
        
      }
      this.isLoading=false

      this.pageChange=document.getElementById('chngPage');
      // this.pageChange.click()
      // this.setPage(2);
      // this.setPage(1)
      this.modalRef.hide();
      // for(let i=0;i<this.reportData.length;i++){
      //   if(this.reportData[i].type=='Liability'){
      //     this.opdrSum+=this.reportData[i].curr_bal; this.li++ 
      //     this.lastLi=this.reportData[i].acc_cd
      //   }
      //   else{
      //     this.opcrSum+=this.reportData[i].curr_bal;; this.ass++
      //     this.lastAss=this.reportData[i].acc_cd

      //   }
      // }
      // console.log(this.li,this.ass)
      // this.lastLi=this.reportData[this.li-1].acc_cd
      // this.lastAss=this.reportData[(this.ass+this.li)-1].acc_cd
      // console.log(this.lastLi,this.lastAss)
     
      },
      err => {
         this.isLoading = false;
         this.comser.SnackBar_Error(); 
        })
      
      // this.UrlString=this.svc.getReportUrl()
      // this.UrlString=this.UrlString+"WebForm/Fin/cashcumtrail?" + 'ardb_cd=' + this.sys.ardbCD+"&brn_cd="+this.sys.BranchCode+"&from_dt="+Utils.convertDtToString(this.fromdate)+"&to_dt="+Utils.convertDtToString(this.todate)
      ;
      this.isLoading = true;
      this.ReportUrl=this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString)

      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 10000);
    }
  }

  transformData(data: any[]) {
    const revenueArray: any[] = [];
    const expenseArray: any[] = [];
  
    data.forEach(item => {
      // Create the Revenue (Credit) object
      if (item.schedule_desc_cr) {
        const revenueItem = {
          sch_cd_cr: item.sch_cd_cr,
          schedule_desc_cr: item.schedule_desc_cr,
          cr_acc_cd: item.cr_acc_cd,
          cr_acc_desc: item.cr_acc_desc,
          cr_amount: item.cr_amount,
          prev_cr_amount: item.prev_cr_amount
        };
        revenueArray.push(revenueItem);
      }
      // Create the Expense (Debit) object
      if (item.schedule_desc_dr) {
        const expenseItem = {
          sch_cd_dr: item.sch_cd_dr,
          schedule_desc_dr: item.schedule_desc_dr,
          dr_acc_cd: item.dr_acc_cd,
          dr_acc_desc: item.dr_acc_desc,
          dr_amount: item.dr_amount,
          prev_dr_amount: item.prev_dr_amount
        };
        expenseArray.push(expenseItem);
      }
    });
  

    
    return { revenueArray, expenseArray };
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
    this.modalRef.hide();
  }
  public closeAlert() {
    this.showAlert = false;
  }

  groupByScheduleE(data: any[]) {
    const grouped = data.reduce((acc, curr) => {
      const key = curr.schedule_desc_dr;
      if (!acc[key]) {
        acc[key] = { schedule_desc_dr: key, items: [], subtotal: { dr_amount: 0, prev_dr_amount: 0} };
      }
      acc[key].items.push(curr);
      acc[key].subtotal.dr_amount += curr.dr_amount;
      acc[key].subtotal.prev_dr_amount += curr.prev_dr_amount;
      return acc;
    }, {});
    return Object.values(grouped);
  }
  groupByScheduleR(data: any[]) {
    const grouped = data.reduce((acc, curr) => {
      const key = curr.schedule_desc_cr;
      if (!acc[key]) {
        acc[key] = { schedule_desc_cr: key, items: [], subtotal: { cr_amount: 0, prev_cr_amount: 0} };
      }
      acc[key].items.push(curr);
      acc[key].subtotal.cr_amount += curr.cr_amount;
      acc[key].subtotal.prev_cr_amount += curr.prev_cr_amount;
      return acc;
    }, {});
    return Object.values(grouped);
  }
  calculateGrandTotalR(data: any[], total: any) {
    data.forEach(item => {
      total.cr_amount += item.cr_amount;
      total.prev_cr_amount += item.prev_cr_amount;
    });
  }
  calculateGrandTotalE(data: any[], total: any) {
    data.forEach(item => {
      total.dr_amount += item.dr_amount;
      total.prev_dr_amount += item.prev_dr_amount;
    });
  }
  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); //Retrieve items for page
    this.cd.detectChanges();
  }
  Format2(){
    this.format2=true;
  }
  Format1(){
    this.format2=false;
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'hiddenTab'
    }
    this.exportAsService.save(this.exportAsConfig, 'BalanceSheet').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
}
