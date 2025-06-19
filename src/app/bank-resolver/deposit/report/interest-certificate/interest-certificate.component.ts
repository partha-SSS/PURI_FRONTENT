import { Component, OnInit, ViewChild, TemplateRef, ElementRef,ChangeDetectorRef ,AfterViewInit} from '@angular/core';
import { RestService } from 'src/app/_service';
//  
import { tt_cash_account, p_report_param, SystemValues, mm_customer } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
@Component({
  selector: 'app-interest-certificate',
  templateUrl: './interest-certificate.component.html',
  styleUrls: ['./interest-certificate.component.css'],
  providers:[ExportAsService]
})
export class InterestCertificateComponent implements OnInit,AfterViewInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  //  
  @ViewChild('external') external: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['acc_type_cd','acc_num','opening_dt','prn_amt','intt_rt','mat_dt','prov_intt_amt'];
  filteredArray:any=[]
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  notvalidate:boolean=false;
  date_msg:any;
  exportAsConfig:ExportAsConfig;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  // bsInlineValue = new Date();
  pagedItems = [];
  reportData:any=[]
  dailyCash: tt_cash_account[] = [];
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
  called = 0;
  counter=0;
  itemsPerPage = 25;
  currentPage = 1;
  pageChange: any;
  SumIntt=0;
  drSum=0
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  suggestedCustomer: mm_customer[];
  showNoResult=false;
  disabledOnNull=true;
  lastdrAccCD:any;
  lastcrAccCD:any;
  today:any
  cust_name:any;
  guardian_name:any;
  showWait=false;
  address:any;
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private cd: ChangeDetectorRef,
    private exportAsService: ExportAsService,
    private router: Router,private comSer:CommonServiceService) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate; // new Date(localStorage.getItem('__currentDate'));
    this.reportcriteria = this.formBuilder.group({
      cust_name:[null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
    var date = new Date();
// get the date as a string
   var n = date.toDateString();
// get the time as a string
   var time = date.toLocaleTimeString();
   this.today= n + " "+ time
    this.todate=this.sys.CurrentDate
   
  }
  
 
  onLoadScreen(content) {
    this.notvalidate=false
    this.modalRef = this.modalService.show(content, this.config);
  }
  onChangeName(){
    this.suggestedCustomer = null;
    this.showNoResult=false
    if (this.reportcriteria.controls.cust_name.value.length > 0) {
      this.disabledOnNull=false
    }
    else{
      this.disabledOnNull=true
    }
  }
  public suggestCustomer(): void {
    this.showWait=true;
    if (this.reportcriteria.controls.cust_name.value.length > 0) {
      const prm = new p_gen_param();
      prm.as_cust_name = this.reportcriteria.controls.cust_name.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res;
            this.showWait=false
          } else {
            this.suggestedCustomer = [];
            this.showWait=false

          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }
  public SelectCustomer(cust: mm_customer): void {
    console.log(cust)
    // this.custCD=cust.cust_cd
    // this.custType=cust.cust_type
    // this.custName=cust.cust_name
    // this.custAddr=cust.permanent_address
    this.reportcriteria.controls.cust_name.setValue(cust.cust_cd);
    this.suggestedCustomer = null;
  }
  public SubmitReport() {
      this.cust_name='';
      this.guardian_name='';
      this.address='';
      this.isLoading=true;
      this.reportData.length=0;
      this.pagedItems.length=0
      this.modalRef.hide();
      this.SumIntt=0;
      this.drSum=0;
      this.showAlert = false;
      this.fromdate = this.reportcriteria.value.fromDate;
      this.todate = this.reportcriteria.controls.toDate.value;

      var dt={
        "cust_cd":this.reportcriteria.controls.cust_name.value,
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        "to_dt" : this.todate.toISOString()
      }
      this.svc.addUpdDel('Deposit/GetInterestCertificate',dt).subscribe(data=>{console.log(data)
      this.reportData=data
      this.dataSource.data=this.reportData
      this.isLoading=false
      if(!this.reportData){
        this.comSer.SnackBar_Nodata()
          this.isLoading=false
      }
      else{
        this.cust_name=this.reportData[0].cust_name
        this.guardian_name=this.reportData[0].guardian_name
        this.address=this.reportData[0].address
        this.reportData.forEach(e=>{
             this.SumIntt+=e.prov_intt_amt;
          })
      } 
      // this.pageChange=document.getElementById('chngPage');
      // this.pageChange.click()
      // this.modalRef.hide();
      // this.setPage(2);
      // this.setPage(1)
      // this.crSum=0;
      // this.drSum=0
      // this.reportData.forEach(e=>{
      //   this.crSum+=e.cr_amt;
      //   this.drSum+=e.dr_amt;
      // })
      // this.lastcrAccCD=this.reportData[this.reportData.length-1].cr_acc_cd
      // this.lastdrAccCD=this.reportData[this.reportData.length-1].dr_acc_cd
      // this.setPage(1)
    },
    err => {
       this.isLoading = false;
       this.comSer.SnackBar_Error(); 
      })
      
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);
    }
  

  public closeAlert() {
    this.showAlert = false;
  }
 

 closeScreen() {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
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
    // this.getTotal()
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'trial111'
    }
    this.exportAsService.save(this.exportAsConfig, 'interest_certf').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
}
