import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
declare var window: any;
@Component({
  selector: 'app-profit-loss-acc',
  templateUrl: './profit-loss-acc.component.html',
  styleUrls: ['./profit-loss-acc.component.css'],
  providers:[ExportAsService]
})
export class ProfitLossAccComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
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
  resultLength=0
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
  filteredArray:any=[]
  reportData1:any=[]
  k=0;
  displayedColumns: string[] = ['dr_acc_cd', 'dr_amount', 'cr_acc_cd', 'cr_amount'];
  dataSource = new MatTableDataSource()
  constructor(private svc: RestService, private formBuilder: FormBuilder,
              private modalService: BsModalService, private _domSanitizer: DomSanitizer, private cd: ChangeDetectorRef,
              private exportAsService: ExportAsService, private comser:CommonServiceService,
              private router: Router) { }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
      this.crSum=0
      this.drSum=0
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0
      this.reportData1.length=0;
      this.k=0
      this.showAlert = false;
      this.fromdate=this.reportcriteria.value['fromDate'];
      this.todate=this.reportcriteria.value['toDate'];
      this.isLoading=true;
      //this.onReportComplete();
      // this.modalService.dismissAll(this.content);
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        // "to_dt":this.todate.toISOString()
      }
      this.svc.addUpdDel('Finance/PopulateProfitandLoss',dt).subscribe(data=>{console.log(data)
      // this.reportData=data
      this.reportData1=data;
      if(this.reportData1.length==0){
        this.comser.SnackBar_Nodata()
      } 
      for(let i=0;i<this.reportData1.length;i++){
        if(this.reportData1[i].cr_acc_desc)
         this.reportData[this.k++]=this.reportData1[i]
      }
      for(let i=0;i<this.reportData1.length;i++){
        if(!this.reportData1[i].cr_acc_desc && this.reportData1[i].cr_acc_cd)
         this.reportData[this.k++]=this.reportData1[i]
      }
      for(let i=0;i<this.reportData1.length;i++){
        if(!this.reportData1[i].cr_acc_desc && !this.reportData1[i].cr_acc_cd)
         this.reportData[this.k++]=this.reportData1[i]
      }
      this.reportData1.forEach(e=>{
        this.crSum+=e.cr_amount
        this.drSum+=e.dr_amount
      })
      this.dataSource.data=this.reportData
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.resultLength=this.reportData.length
      this.isLoading=false
      this.pageChange=document.getElementById('chngPage');
      this.pageChange.click()
      this.setPage(2);
      this.setPage(1)
      this.modalRef.hide();
      this.reportData.forEach(e=>{
       
      })
      },
      err => {
         this.isLoading = false;
         this.comser.SnackBar_Error(); 
        }
)
      this.isLoading = true;
      this.ReportUrl=this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString)
    }
  }
  public oniframeLoad(): void {
    this.counter++;
    if(this.counter==2){
      this.isLoading=false;
      this.counter=0;
    }
    else{
      this.isLoading=true
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
    this.cd.detectChanges();
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'mattable'
    }
    this.exportAsService.save(this.exportAsConfig, 'Profit&Loss').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  applyFilter(event: Event) {
    console.log(event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getTotal()
  }
  getTotal(){
    this.drSum=0;
    this.crSum=0;
    
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      // console.log(this.filteredArray[i].dr_amt)
      this.drSum+=this.filteredArray[i].dr_amount
      this.crSum+=this.filteredArray[i].cr_amount
    }
  }
}
