import { Component, OnInit, ViewChild, TemplateRef, ElementRef,ChangeDetectorRef ,AfterViewInit} from '@angular/core';
import { RestService } from 'src/app/_service';
//  
import { tt_cash_account, p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-all-gldetails',
  templateUrl: './all-gldetails.component.html',
  styleUrls: ['./all-gldetails.component.css'],
  providers:[ExportAsService]
})
export class AllGLDetailsComponent implements OnInit,AfterViewInit {

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  //  
  @ViewChild('external') external: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['SLNO','acc_type','acc_cd','acc_name'];
  filteredArray:any=[]
  isOpenFromDp = false;
  isOpenToDp = false;
  notvalidate:boolean=false;
  date_msg:any;
  modalRef: BsModalRef;

  exportAsConfig:ExportAsConfig;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  pagedItems = [];
  reportData:any=[]
  reportData2:any=[];
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
  today:any;
  constructor( private modalService: BsModalService,private exportAsService: ExportAsService,private svc: RestService, private formBuilder: FormBuilder,private cd: ChangeDetectorRef,
    private router: Router,private comser:CommonServiceService) { }
  ngOnInit(): void {
    this.reportcriteria = this.formBuilder.group({
      acc_type: [null, Validators.required]
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
    this.reportcriteria.controls.acc_type.setValue('0');

  }

  public SubmitReport() {
    this.isLoading=true;

    // this.comser.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    // if (this.reportcriteria.invalid) {
    //   this.showAlert = true;
    //   this.alertMsg = 'Invalid Input.';
    //   return false;
    // }
    // else if (new Date(this.reportcriteria.value.fromDate) > new Date(this.reportcriteria.value.toDate)) {
    //   this.showAlert = true;
    //   this.alertMsg = 'To Date cannot be greater than From Date!';
    //   return false;
    // }
    // else {
      this.modalRef.hide()
      this.reportData.length=0;
      this.pagedItems.length=0
      this.crSum=0;
      this.drSum=0;
      this.reportData2=null;
      this.showAlert = false;
      var dt={
        "ardb_cd":this.sys.ardbCD
      }
      this.svc.addUpdDel('Mst/GetAccountMaster',dt).subscribe(data=>{console.log(data)
      this.reportData=data
      console.log(typeof(this.reportcriteria.controls.acc_type.value));
      
      this.reportData2=this.reportData.filter(e=>e.acc_type==this.reportcriteria.controls.acc_type.value)
      console.log(this.reportData.filter(e=>e.acc_type==this.reportcriteria.controls.acc_type.value));
      console.log(this.reportData2);
      
      
      this.dataSource.data=this.reportData2
      this.isLoading=false
      if(this.reportData.length==0){
        this.comser.SnackBar_Nodata()
      } 
      this.crSum=0;
      this.drSum=0
      this.reportData.forEach(e=>{
        this.crSum+=e.cr_amt;
        this.drSum+=e.dr_amt;
      })
      this.lastcrAccCD=this.reportData[this.reportData.length-1].cr_acc_cd
      this.lastdrAccCD=this.reportData[this.reportData.length-1].dr_acc_cd
      // this.setPage(1)
    },
    err => {
       this.isLoading = false;
       this.comser.SnackBar_Error(); 
      })
      
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);
    // }
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
   
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'trial111'
    }
    this.exportAsService.save(this.exportAsConfig, 'AllGLHead').subscribe(() => {
      // save started
      console.log("hello")
    });
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
    this.getTotal()
  }
  getTotal(){
    this.crSum=0;
      this.drSum=0;
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      // console.log(this.filteredArray[i].dr_amt)
      this.drSum+=this.filteredArray[i].dr_amt
      this.crSum+=this.filteredArray[i].cr_amt
      
    }
  }

}
