import { Component, OnInit, ViewChild, TemplateRef, ElementRef,ChangeDetectorRef ,AfterViewInit} from '@angular/core';
import { RestService } from 'src/app/_service';
 
import { tt_cash_account, p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
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

@Component({
  selector: 'app-weekly-return',
  templateUrl: './weekly-return.component.html',
  styleUrls: ['./weekly-return.component.css'],
  providers:[ExportAsService]
})
export class WeeklyReturnComponent implements OnInit ,AfterViewInit{
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
   
  @ViewChild('external') external: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['depo_part','depo_bal','depl_part','depl_bal',];
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
  crSum=0;
  drSum=0
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName

  lastdrAccCD:any;
  lastcrAccCD:any;
  today:any
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private cd: ChangeDetectorRef,
    private exportAsService: ExportAsService,
    private router: Router,private comser:CommonServiceService) { }
  ngOnInit(): void {
    this.todate = this.sys.CurrentDate; // new Date(localStorage.getItem('__currentDate'));
    this.reportcriteria = this.formBuilder.group({
      todate: [null, Validators.required]
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
    this.notvalidate=false
    this.modalRef = this.modalService.show(content, this.config);
  }


  public SubmitReport() {
      this.showAlert = false;
      this.isLoading=true;
      debugger
      this.reportData.length=0;
      this.pagedItems.length=0
      this.modalRef.hide()
      this.crSum=0;
      this.drSum=0;
      
      this.todate = this.reportcriteria.value.todate;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "to_dt":this.todate.toISOString()
      }
      this.svc.addUpdDel('Finance/PopulateWeeklyReturn',dt).subscribe(data=>{
      console.log(data)
      this.reportData=data
      if(this.reportData.length>0){
        debugger
        this.isLoading=false
        this.dataSource.data=this.reportData
        }
      if(this.reportData.length==0){
        this.comser.SnackBar_Nodata()
      }
      
      // this.pageChange=document.getElementById('chngPage');
      // this.pageChange.click()
      // this.modalRef.hide();
      // this.setPage(2);
      // this.setPage(1)
      // this.crSum=0;
      // this.drSum=0
      this.reportData.forEach(e=>{
        this.crSum+=e.cr_amt;
        this.drSum+=e.dr_amt;
      })
      // this.lastcrAccCD=this.reportData[this.reportData.length-1].cr_acc_cd
      // this.lastdrAccCD=this.reportData[this.reportData.length-1].dr_acc_cd
      // this.setPage(1)
    },
    err => {
       this.isLoading = false;
       this.comser.SnackBar_Error(); 
      })
      
      
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
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'trial111'
    }
    this.exportAsService.save(this.exportAsConfig, 'WeeklyReturn').subscribe(() => {
      // save started
      console.log("hello")
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    // this.getTotal()
  }

}
