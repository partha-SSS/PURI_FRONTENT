import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SystemValues, mm_customer, p_report_param } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-loan-sub-cash-book',
  templateUrl: './loan-sub-cash-book.component.html',
  styleUrls: ['./loan-sub-cash-book.component.css'],
  providers:[ExportAsService]
})
export class LoanSubCashBookComponent implements OnInit,AfterViewInit {

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  
  displayedColumns: string[] = ['acc_type_desc'];
  // displayedColumns: string[] = ['acc_desc','acc_num','cust_name','cash_dr', 'cash_cr', 'trf_dr','trf_cr'];

  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  counter=0;
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
  exportAsConfig: ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData: any = []
  ardbName = localStorage.getItem('ardb_name')
  branchName = this.sys.BranchName
  filteredArray:any=[]
  pageChange: any;
  opdrSum = 0;
  opcrSum = 0;
  drSum = 0;
  crSum = 0;
  clsdrSum = 0;
  clscrSum = 0;
  lastAccCD: any;
  today: any
  cName: any
  cAddress: any
  cAcc: any
  lastAccNum: any
  currInttSum = 0
  ovdInttSum = 0
  ovdPrnSum = 0
  currPrnSum = 0
  currInttRecovSum = 0
  ovdInttRecovSum = 0
  ovdPrnRecovSum = 0
  currPrnRecovSum = 0
  totPrn = 0;
  loanId: any;
  custNm:any;
  addr:any
  suggestedCustomer: mm_customer[];
  recovSum=0;
  disbSum=0;
  lastDt:any;
  lastCd:any;
  ccrSum=0;
  cdrSum=0;
  tcrSum=0;
  tdrSum=0;
  dummyccrSum=0
  dummycdrSum=0
  dummytcrSum=0
  dummytdrSum=0
  bName=''
  inputEl:any;
  selectedValue=''
  selectedValue1=''
  selectItems=[
    {
      value:'Account Type',
      name:'Account Type'
    },
    {
      value:'Loan ID',
      name:'Loan ID'
    },
    {
      value:'Name',
      name:'Name',

    }
  ]
  selectItems1=[
    {
      value:'Account Type',
      name:'Account Type'
    },
    {
      value:'Loan ID',
      name:'Loan ID'
    },
    {
      value:'Name',
      name:'Name',

    }
  ]
  searchfilter= new MatTableDataSource()
  constructor(private svc: RestService, private formBuilder: FormBuilder,
              private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
              private router: Router, private comSer:CommonServiceService) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, null]
    });
    this.onLoadScreen(this.content);
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today = n + " " + time
  }
  onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); //Retrieve items for page
    console.log(this.pagedItems)

    this.cd.detectChanges();
  }

  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true;
      this.isLoading=true;
      this.showAlert = false;
      this.ccrSum=0
          this.cdrSum=0
          this.tdrSum=0
          this.tcrSum=0
        
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "adt_as_on_dt":this.fromdate.toISOString()
      }
      this.svc.addUpdDel('Loan/PopulateLoanSubCashBook',dt).subscribe(data=>{console.log(data)
        this.reportData=data
        this.dataSource.data=this.reportData
        for(let i=0;i<this.reportData.length;i++){
          this.ccrSum+=this.reportData[i].acctype.tot_acc_ovd_prn_recov
          this.cdrSum+=this.reportData[i].acctype.tot_acc_curr_prn_recov
          this.tdrSum+=this.reportData[i].acctype.tot_acc_curr_intt_recov
          this.tcrSum+=this.reportData[i].acctype.tot_acc_ovd_intt_recov

        }
        console.log( this.ccrSum,this.tcrSum);
        
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
        if(this.reportData.length<50){
          this.pagedItems=this.reportData
        }
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.pageChange=document.getElementById('chngPage');
        this.pageChange.click()
        this.setPage(2);
        this.setPage(1)
        this.modalRef.hide();
        // this.reportData.forEach(e=>{
        //   this.ccrSum+=e.cash_cr
        //   this.cdrSum+=e.cash_dr
        //   this.tdrSum+=e.trf_dr
        //   this.tcrSum+=e.trf_cr
        //   this.dummyccrSum+=e.cash_cr
        //   this.dummycdrSum+=e.cash_dr
        //   this.dummytdrSum+=e.trf_dr
        //   this.dummytcrSum+=e.trf_cr
        // })
      })
      // this.UrlString = this.svc.getReportUrl();
      // this.UrlString = this.UrlString + 'WebForm/Loan/loansubcashbook?'
      //   + 'ardb_cd='+ this.sys.ardbCD
      //   + '&brn_cd=' + this.sys.BranchCode
      //   + '&adt_as_on_dt=' + Utils.convertDtToString(this.fromdate);
      // this.isLoading = true;
      // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString)
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 10000);
    }
  }
  public oniframeLoad(): void {
    this.counter++;
    
    if(this.counter==2){
      this.isLoading = false;
      this.counter=0;
    }
    else
     this.isLoading=true;
    this.modalRef.hide();
  }
  public closeAlert() {
    this.showAlert = false;
  }


  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // applyFilter(e: Event) {
  //   console.log(e);
    
  //   const filterValue = (e.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  //   this.getTotal()
  // }

  applyFilter0(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.searchfilter.data=this.dataSource.filteredData
    console.log(this.dataSource)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    // this.getTotal()
  }
  // applyFilter1(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.searchfilter.filter = filterValue.trim().toLowerCase();
  //   this.dataSource.data=this.searchfilter.filteredData
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  //   this.getTotal()
  // }
  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    this.bName=(event.target as HTMLInputElement).value
    this.filteredArray=this.dataSource.data
    switch(this.selectedValue1){
      case "Account Type": 
    this.filteredArray=this.filteredArray.filter(e=>e.acc_type_cd.toLowerCase().includes(filterValue.toLowerCase())==true || e.acc_typ_dsc.toLowerCase().includes(filterValue.toLowerCase())==true )
      break;
      case "Name":
    this.filteredArray=this.filteredArray.filter(e=>e.cust_name.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
      case "Loan ID":
        this.filteredArray=this.filteredArray.filter(e=>e.loan_id.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;

    }
    this.dataSource.data=this.filteredArray
    // this.getTotal()
    // this.filteredArray.forEach(e=>
    //   {
    //    if(e.block_name.includes(filterValue))
    // this.dataSource.data=this.filteredArray
    // console.log(this.dataSource.data)

      
    //   })
  }
  applyFilter1(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    this.filteredArray=this.dataSource.data
    switch(this.selectedValue){
      case "Account Type": 
    this.filteredArray=this.filteredArray.filter(e=>e.acc_type_cd.toLowerCase().includes(filterValue.toLowerCase())==true || e.acc_typ_dsc.toLowerCase().includes(filterValue.toLowerCase())==true )
      break;
      case "Name":
    this.filteredArray=this.filteredArray.filter(e=>e.cust_name.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
      case "Loan ID":
        this.filteredArray=this.filteredArray.filter(e=>e.loan_id.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;

    }
    this.dataSource.data=this.filteredArray
    // this.getTotal()

  }
 
  // resetList(){
  //   this.isLoading=true
  //   setTimeout(()=>{this.isLoading=false},500)
  //   this.dataSource.data=this.reportData;
  //   this.inputEl=document.getElementById('myInput');
  //   this.inputEl.value=''
  //   this.inputEl=document.getElementById('myInput2');
  //   this.inputEl.value=''
  //   this.inputEl=document.getElementById('myInput1');
  //   this.inputEl.value=''
  //   this.ccrSum=this.dummyccrSum
  //   this.cdrSum=this.dummycdrSum
  //   this.tdrSum=this.dummytdrSum
  //   this.tcrSum=this.dummytcrSum
   
  //   this.selectedValue=''
  //   this.selectedValue1=''
  //   this.bName=''
    
    
  // }
  // getTotal(){
  //   this.ccrSum=0
  //   this.cdrSum=0
  //   this.tdrSum=0
  //   this.tcrSum=0
  //   console.log(this.dataSource.filteredData)
  //   this.filteredArray=this.dataSource.filteredData
  //   for(let i=0;i<this.filteredArray.length;i++){
  //     this.ccrSum+=this.filteredArray[i].cash_cr
  //     this.cdrSum+=this.filteredArray[i].cash_dr
  //     this.tcrSum+=this.filteredArray[i].trf_cr
  //     this.tdrSum+=this.filteredArray[i].trf_dr
  //   }
  // }

}
