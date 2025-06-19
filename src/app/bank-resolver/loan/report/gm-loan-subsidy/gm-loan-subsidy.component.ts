import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-gm-loan-subsidy',
  templateUrl: './gm-loan-subsidy.component.html',
  styleUrls: ['./gm-loan-subsidy.component.css']
})
export class GmLoanSubsidyComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator2: MatPaginator;
  // @ViewChild(MatSort) sort2: MatSort;
  dataSource= new MatTableDataSource()
  displayedColumns: string[] = ['SL_NO','block_name','loan_id','party_name','curr_intt_rate','intt_recov','subsidy_amt'];
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
  counter = 0
  exportAsConfig: ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData: any=[]
  filteredArray:any=[]
  filteredArray_o:any=[]
  ardbName = localStorage.getItem('ardb_name')
  branchName = this.sys.BranchName
  pageChange: any;
  tot_disb_amt = 0;
  tot_loan_balance = 0;
  tot_prn_recov = 0;
  tot_intt_recov = 0;
  tot_subsidy_amt = 0;
  lastAccCD: any;
  today: any
  apiUrl = '';
  suggestedCustomer: mm_customer[];
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router, private comSer: CommonServiceService
    ) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today = n + " " + time
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
    this.comSer.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else if(this.comSer.diff<0){
      this.date_msg= this.comSer.date_msg
      this.notvalidate=true
    }
    else {
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true;
      this.tot_disb_amt = 0;
      this.tot_loan_balance = 0;
      this.tot_prn_recov = 0;
      this.tot_intt_recov = 0;
      this.tot_subsidy_amt = 0;
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt = {
        "ardb_cd": this.sys.ardbCD,
        "from_dt": this.fromdate.toISOString(),
        "to_dt": this.toDate.toISOString(),
        "brn_cd": this.sys.BranchCode
      }
        this.svc.addUpdDel('Loan/PopulateInterestSubsidy', dt).subscribe(data => {
          console.log(data)
          this.reportData = data;
          if(!this.reportData){
            this.comSer.SnackBar_Nodata()
          this.isLoading=false
          } 
          this.dataSource.data=this.reportData;
          this.dataSource.paginator = this.paginator;
           this.dataSource.sort = this.sort;
          this.reportData.forEach(e => {
            this.tot_disb_amt += e.disb_amt
            this.tot_loan_balance += e.loan_balance
            this.tot_prn_recov += e.prn_recov
            this.tot_intt_recov+=e.intt_recov
            this.tot_subsidy_amt+=e.subsidy_amt
          });
          this.isLoading = false

      },err => {
        this.isLoading = false;
        this.comSer.SnackBar_Error(); 
       })
      
      
    
      // this.apiUrl = this.reportcriteria.controls.OpenClose.value == 'C' ? 'Loan/PopulateLoanCloseRegister' : 'Loan/PopulateLoanOpenRegister'
      // this.svc.addUpdDel(this.apiUrl, dt).subscribe(data => {
      //   console.log(data)
      //   this.reportData = data;
        
      //   this.itemsPerPage = this.reportData.length % 50 <= 0 ? this.reportData.length : this.reportData.length % 50
      //   this.isLoading = false
      //   if(this.reportData.length<50){
      //     this.pagedItems=this.reportData
      //   }
      //   this.pageChange = document.getElementById('chngPage');
      //   this.pageChange.click()
      //   this.setPage(2);
      //   this.setPage(1)
      //   this.modalRef.hide();
      //   if (this.reportcriteria.controls.OpenClose.value == 'C') {
      //     this.reportData.forEach(e => {
      //       this.totSanc += e.sanc_amt
      //       this.totClsPrn += e.closing_amt
      //       this.totClsIntt += e.closing_intt
      //     });
      //   }
      //   else {
      //     this.reportData.forEach(e => {
      //       this.totSanc += e.sanc_amt
      //       this.totDisb += e.disb_amt
      //     });
      //   }
      // })
      this.showAlert = false;
    }
  }
  public closeAlert() {
    this.showAlert = false;
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem);
    console.log(this.pagedItems)
    this.cd.detectChanges();
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
    this.tot_disb_amt = 0;
      this.tot_loan_balance = 0;
      this.tot_prn_recov = 0;
      this.tot_intt_recov = 0;
      this.tot_subsidy_amt = 0;
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
            this.tot_disb_amt += this.filteredArray[i].disb_amt
            this.tot_loan_balance += this.filteredArray[i].loan_balance
            this.tot_prn_recov += this.filteredArray[i].prn_recov
            this.tot_intt_recov+=this.filteredArray[i].intt_recov
            this.tot_subsidy_amt+=this.filteredArray[i].subsidy_amt

    }
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'trial11'
    }
    this.exportAsService.save(this.exportAsConfig, 'Intt_Subsidy').subscribe(() => {
      // save started
      console.log("hello")
    });
  }

}
