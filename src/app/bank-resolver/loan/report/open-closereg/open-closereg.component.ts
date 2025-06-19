import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
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
  selector: 'app-open-closereg',
  templateUrl: './open-closereg.component.html',
  styleUrls: ['./open-closereg.component.css']
})
export class OpenCloseregComponent implements OnInit,AfterViewInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator2: MatPaginator;
  // @ViewChild(MatSort) sort2: MatSort;
  dataSource_c = new MatTableDataSource()
  dataSource_o = new MatTableDataSource()
  displayedColumns_c: string[] = ['sl_no','trans_dt','cust_name','acc_desc', 'loan_id','sanc_dt','sanc_amt','curr_rt','ovd_rt','closing_amt','closing_intt'];
  displayedColumns_o: string[] = ['sl_no','trans_dt','cust_name','acc_desc', 'loan_id','sanc_dt','sanc_amt','disb_amt','instl_no','curr_rt','ovd_rt'];
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
  opdrSum = 0;
  opcrSum = 0;
  drSum = 0;
  crSum = 0;
  clsdrSum = 0;
  clscrSum = 0;
  lastAccCD: any;
  today: any
  apiUrl = '';
  totSanc_c = 0;
  totSanc_o = 0;
  totClsPrn = 0;
  totClsIntt = 0;
  totDisb = 0;
  suggestedCustomer: mm_customer[];
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer, private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router, private comSer: CommonServiceService
    ) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      OpenClose: [null, Validators.required]
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
      this.totSanc_c=0
      this.totClsPrn =0
      this.totClsIntt=0
      this.totSanc_o =0
      this.totDisb =0
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt = {
        "ardb_cd": this.sys.ardbCD,
        "from_dt": this.fromdate.toISOString(),
        "to_dt": this.toDate.toISOString(),
        "brn_cd": this.sys.BranchCode,
        "flag": this.reportcriteria.controls.OpenClose.value
      }
      if(this.reportcriteria.controls.OpenClose.value == 'C'){
        this.svc.addUpdDel('Loan/PopulateLoanCloseRegister', dt).subscribe(data => {
          console.log(data)
          this.reportData = data;
          if(!this.reportData){
            this.comSer.SnackBar_Nodata()
          this.isLoading=false
          }else{
            for(let i=0;i<this.reportData.length;i++){
              this.reportData[i].sanc_dt=this.comSer.getFormatedDate(this.reportData[i].sanc_dt);
              this.reportData[i].trans_dt=this.comSer.getFormatedDate(this.reportData[i].trans_dt);
            }
          } 
          this.dataSource_c.data=this.reportData;
          this.dataSource_c.paginator = this.paginator;
           this.dataSource_c.sort = this.sort;
          this.reportData.forEach(e => {
            this.totSanc_c += e.sanc_amt
            this.totClsPrn += e.closing_amt
            this.totClsIntt += e.closing_intt
          });
          this.isLoading = false

      },err => {
        this.isLoading = false;
        this.comSer.SnackBar_Error(); 
       })
      
      
    }
      else{
        this.isLoading = false

        this.svc.addUpdDel('Loan/PopulateLoanOpenRegister', dt).subscribe(data => {
          console.log(data)
          this.reportData = data;
          this.dataSource_o.data=this.reportData;
          if(!this.reportData){
            this.comSer.SnackBar_Nodata()
          this.isLoading=false
          }else{
            for(let i=0;i<this.reportData.length;i++){
              this.reportData[i].sanc_dt=this.comSer.getFormatedDate(this.reportData[i].sanc_dt);
              this.reportData[i].trans_dt=this.comSer.getFormatedDate(this.reportData[i].trans_dt);
            }
          } 
          this.dataSource_o.paginator = this.paginator;
           this.dataSource_o.sort = this.sort;
          this.reportData.forEach(e => {
            this.totSanc_o += e.sanc_amt
            this.totDisb += e.disb_amt
          });
      },err => {
        this.isLoading = false;
        this.comSer.SnackBar_Error(); 
       })
      }
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
  downloadexcel() {
    this.exportAsConfig = {
      type: 'csv',
      elementIdOrContent: 'hiddenTab'
    }
    this.exportAsService.save(this.exportAsConfig, 'cashcumtrial').subscribe(() => {
      console.log("hello")
    });
  }
  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  ngAfterViewInit() {
    this.dataSource_c.paginator = this.paginator;
    this.dataSource_c.sort = this.sort;
    this.dataSource_o.paginator = this.paginator;
    this.dataSource_o.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource_c.filter = filterValue.trim().toLowerCase();

    if (this.dataSource_c.paginator) {
      this.dataSource_c.paginator.firstPage();
    }
    this.getTotal_c()
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource_o.filter = filterValue.trim().toLowerCase();

    if (this.dataSource_o.paginator) {
      this.dataSource_o.paginator.firstPage();
    }
    this.getTotal_o()
  }
  getTotal_o(){
    this.totSanc_o=0
    this.totDisb=0
    console.log(this.dataSource_o.filteredData)
    this.filteredArray_o=this.dataSource_o.filteredData
    for(let i=0;i<this.filteredArray_o.length;i++){
      this.totSanc_o+=this.filteredArray_o[i].sanc_amt
      this.totDisb+=this.filteredArray_o[i].disb_amt
    }
  }
  getTotal_c(){
    this.totSanc_c=0
    this.totClsPrn=0
    this.totClsIntt=0
    console.log(this.dataSource_c.filteredData)
    this.filteredArray=this.dataSource_c.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      this.totSanc_c+=this.filteredArray[i].sanc_amt
      this.totClsPrn+=this.filteredArray[i].closing_amt
      this.totClsIntt+=this.filteredArray[i].closing_intt

    }
  }
}
