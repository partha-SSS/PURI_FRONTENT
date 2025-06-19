import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-sub-cash-book',
  templateUrl: './sub-cash-book.component.html',
  styleUrls: ['./sub-cash-book.component.css',
  // '../../../../../assets/reportCSS.css'
],
  providers:[ExportAsService]

})
export class SubCashBookComponent implements OnInit,AfterViewInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['acc_type_desc'];
  
  // displayedColumns: string[] = ['acc_type_desc', 'constitution_desc', 'prn_intt_flag', 'acc_num','cust_name','cash_dr','trf_dr','cash_cr','trf_cr'];
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
  todate: Date;
  counter=0;
  exportAsConfig:ExportAsConfig;
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName

  firstAccCD:any
  lastAccCD:any;
  crSum=0;
  drSum=0;
  itemsPerPage = 2;
  currentPage = 1;
  pageChange: any;
  pagedItems = [];
  reportData:any=[];
  today:any
  reportData1:any=[]
  k=0;
  lastcustcd:any
  cashDr=0
  cashCr=0
  trfCr=0
  trfDr=0
  filteredArray:any=[]
  constructor(private svc: RestService, private formBuilder: FormBuilder,
              private modalService: BsModalService, private _domSanitizer: DomSanitizer, private cd: ChangeDetectorRef,
              private exportAsService: ExportAsService, private comSer:CommonServiceService,
              private router: Router) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, null]
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
  // NewWindow(){
  //   let serverIp = 'http://localhost:4200/';
  //   window.open(serverIp+[this.sys.BankName + '/la']);

  // }
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
      this.cashCr=0
      this.cashDr=0
      this.trfDr=0
      this.trfCr=0
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true;
      this.fromdate=this.reportcriteria.value['fromDate'];
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString()
      }
      this.svc.addUpdDel('Deposit/PopulateSubCashBookDeposit',dt).subscribe(data=>{
        console.log(data)
        this.reportData=data
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.dataSource.data=this.reportData.filter(x => x.acctype.acc_type_cd<=20 && x.ttdepsubcashbook.length!=0)
        console.log(this.dataSource.data);

        for(let i=0;i<this.reportData.length;i++){
          this.cashCr+=this.reportData[i].acctype.tot_acc_ovd_prn_recov
          this.cashDr+=this.reportData[i].acctype.tot_acc_curr_prn_recov
          this.trfDr+=this.reportData[i].acctype.tot_acc_curr_intt_recov
          this.trfCr+=this.reportData[i].acctype.tot_acc_ovd_intt_recov

        }
        // this.dataSource.data=this.reportData;
        if(this.reportData.length<50){
          this.pagedItems=this.reportData
        }
        console.log(this.reportData)
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
        this.pageChange=document.getElementById('chngPage');
        this.pageChange.click()
        this.setPage(2);
        this.setPage(1)
        this.modalRef.hide();
        
      },err => {
        this.isLoading = false;
        this.comSer.SnackBar_Error(); 
       })
     
      // this.showAlert = false;
      // this.fromdate = this.reportcriteria.controls.fromDate.value;
      // this.UrlString = this.svc.getReportUrl();
      // this.UrlString = this.UrlString + 'WebForm/Deposit/depositsubcashbook?'
      //   + 'ardb_cd='+this.sys.ardbCD
      //   + '&brn_cd=' + this.sys.BranchCode + '&from_dt='
      //   + Utils.convertDtToString(this.fromdate);
      // this.isLoading = true;
      // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString)
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


  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
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
    this.exportAsService.save(this.exportAsConfig, 'generalledger').subscribe(() => {
      // save started
      console.log("hello")
    });
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
    this.cashCr=0
      this.cashDr=0
      this.trfDr=0
      this.trfCr=0
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      // console.log(this.filteredArray[i].dr_amt)
      this.cashCr+=this.filteredArray[i].cash_cr
      this.cashDr+=this.filteredArray[i].cash_dr
      this.trfDr+=this.filteredArray[i].trf_dr
      this.trfCr+=this.filteredArray[i].trf_cr
      // this.crSum+=this.filteredArray[i].cr_amount
    }
  }
}
