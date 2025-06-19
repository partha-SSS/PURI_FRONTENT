import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer, mm_acc_type } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-near-maturity',
  templateUrl: './near-maturity.component.html',
  styleUrls: ['./near-maturity.component.css'],
  providers:[ExportAsService]

})
export class INearMaturityComponent implements OnInit,AfterViewInit  {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['bank','branch','acc_type_desc', 'acc_num', 'const_name','opening_dt','mat_dt', 'prn_amt','intt_amt','intt_rt'];
  notvalidate:boolean=false;
  date_msg:any;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
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
  counter=0
  suggestedCustomer: mm_customer[];
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  accountTypeList: mm_acc_type[] = [];

  lastAccCD:any;
  today:any
  prnSum=0;
  inttSum=0
  filteredArray:any=[]
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router, private comser:CommonServiceService) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    this.getAccountTypeList()
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }
  getAccountTypeList() {

    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];
    var dt={
      "ardb_cd":this.sys.ardbCD
    }
    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', dt).subscribe(
      res => {
      
        this.accountTypeList = res;
        // this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'I');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {

      }
    );
  }
  onLoadScreen(content) {
    this.notvalidate=false
    this.modalRef = this.modalService.show(content, this.config);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  public SubmitReport() {
    this.comser.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else if(this.comser.diff<0){
      this.date_msg= this.comser.date_msg
      this.notvalidate=true
    }
    else {
      this.prnSum=0;
      this.inttSum=0
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.modalRef.hide();
      this.isLoading=true;
      var dt={
       "ardb_cd": this.sys.ardbCD,
       "brn_cd":  this.sys.BranchCode,
       "from_dt" : this.fromdate.toISOString(),
       "to_dt" : this.toDate.toISOString()
      }
      this.svc.addUpdDel('Investment/PopulateNearInvReport',dt).subscribe(data=>{console.log(data)
        this.reportData=data;
        if(this.reportData.length==0){
          this.comser.SnackBar_Nodata()
        } 
        this.dataSource.data=this.reportData
        for(let i=0;i<this.reportData.length;i++){
          this.reportData[i].acc_type_desc=this.accountTypeList.filter(e=>e.acc_type_cd==this.reportData[i].acc_type_cd)[0].acc_type_desc
        }
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
    
        this.isLoading=false
        // if(this.reportData.length<50){
        //   this.pagedItems=this.reportData
        // }
        // this.pageChange=document.getElementById('chngPage');
        // // this.pageChange.click()
        this.setPage(2);
        this.setPage(1);
        this.modalRef.hide();
        this.reportData.forEach(e=>{
          this.prnSum+=e.prN_AMT;
          this.inttSum+=e.proV_INTT_AMT
        })
        },
        err => {
           this.isLoading = false;
           this.comser.SnackBar_Error(); 
          })
        this.showAlert = false;
      // this.showAlert = false;
      // this.fromdate = this.reportcriteria.controls.fromDate.value;
      // this.toDate = this.reportcriteria.controls.toDate.value;
      // this.UrlString = this.svc.getReportUrl();
      // this.UrlString = this.UrlString + 'WebForm/Deposit/nearmatdetails?'
      //   + 'ardb_cd='+this.sys.ardbCD
      //   + '&from_dt=' + Utils.convertDtToString(this.fromdate)
      //   + '&to_dt=' + Utils.convertDtToString(this.toDate)
      //   + '&brn_cd=' + this.sys.BranchCode;

      // this.isLoading = true;
      // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 10000);
    }
  }
  public oniframeLoad(): void {
    this.counter++
    if(this.counter==2){
      this.isLoading=false;
      this.counter=0
    }
    else{
      this.isLoading = true;

    }
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getTotal()
  }
  getTotal(){
    this.prnSum=0;
    this.inttSum=0
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      
      this.prnSum+=this.filteredArray[i].prN_AMT;
      this.inttSum+=this.filteredArray[i].proV_INTT_AMT
      // console.log(this.filteredArray[i].dr_amt)
    
      // this.crSum+=this.filteredArray[i].cr_amount
    }
  }
}
