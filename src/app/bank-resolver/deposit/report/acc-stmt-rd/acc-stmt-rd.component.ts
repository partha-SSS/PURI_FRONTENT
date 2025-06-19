import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
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
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-acc-stmt-rd',
  templateUrl: './acc-stmt-rd.component.html',
  styleUrls: ['./acc-stmt-rd.component.css'],
  providers:[ExportAsService]
})
export class AccStmtRDComponent implements OnInit,AfterViewInit {

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['SLNO','particulars','paid_date','prn_amt','clr_bal'];

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
  counter=0;
  disabledOnNull=true
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  
  fromdate: Date;
  toDate: Date;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
filteredArray:any=[]
  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  currSum=0;
  clrSum=0;
  clsdrSum=0;
  clscrSum=0;
  lastAccCD:any;
  today:any
  cName:any
  cAddress:any
  cAcc:any
  showWait=false
  suggestedCustomer: mm_customer[];
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router,private comSer:CommonServiceService) { }
  ngOnInit(): void {
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
       this.today= n + " "+ time
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
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
    this.showWait=true;
    this.isLoading=true;
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = 6; // RD
      prm.as_cust_name = this.reportcriteria.controls.acct_num.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          this.isLoading=false
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res;
          } else {
            this.suggestedCustomer = [];
          }
          this.showWait=false;
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
    this.fromdate =  Utils.convertStringToDt(cust.opening_dt);
    this.toDate = this.sys.CurrentDate;
    this.suggestedCustomer = null;
  }

  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.currSum=0;
        this.clrSum=0
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true;
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "acc_num":this.reportcriteria.controls.acct_num.value,
        // "acc_type_cd":this.reportcriteria.controls.acc_type_cd.value,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString()
      }
      this.svc.addUpdDel('Deposit/PopulateASRecuring',dt).subscribe(data=>{console.log(data)
      this.reportData=data;
      if(!this.reportData){
        this.comSer.SnackBar_Nodata()
          this.isLoading=false
      } 
      this.dataSource.data=this.reportData

      this.isLoading=false
      this.pageChange=document.getElementById('chngPage');
      this.pageChange.click()
      this.setPage(2);
      this.setPage(1)
      this.modalRef.hide();
      this.reportData.forEach(e=>{
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
      ];
      const index = parseInt(e.month, 10) - 1;
        
        e.particulars=`Payment for the month of ${monthNames[index]}-${e.year}`
        this.currSum+=e.curr_bal;
        this.clrSum=e.clr_bal
      })
      
      },
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
        }
)
      this.showAlert = false;
      // this.fromdate = this.reportcriteria.controls.fromDate.value;
      // this.toDate = this.reportcriteria.controls.toDate.value;
      // this.UrlString = this.svc.getReportUrl();
      // this.UrlString = this.UrlString + 'WebForm/Deposit/asrecurring?'
      //   + 'ardb_cd=' + this.sys.ardbCD
      //   + '&acc_num=' + this.reportcriteria.controls.acct_num.value
      //   + '&brn_cd=' + this.sys.BranchCode
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
  public oniframeLoad(): void {
    this.counter++
    if(this.counter==2){
      this.isLoading = false;
      this.counter=0
    }
    else{
      this.isLoading=true;
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
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'trial111'
    }
    this.exportAsService.save(this.exportAsConfig, 'acc_statment_rd').subscribe(() => {
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
    this.currSum=0;
    this.clrSum=0
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      this.currSum+=this.filteredArray[i].curr_bal;
      this.clrSum+=this.filteredArray[i].clr_bal
      // console.log(this.filteredArray[i].dr_amt)
    
      // this.crSum+=this.filteredArray[i].cr_amount
    }
  }
   
  cumulativeLength(index) {
    let acc = this.reportData[0].prn_amt;
    for (let i = 0; i<index; i++) {
        acc += this.reportData[i].prn_amt
    }
    
    return acc;
}
  
}
