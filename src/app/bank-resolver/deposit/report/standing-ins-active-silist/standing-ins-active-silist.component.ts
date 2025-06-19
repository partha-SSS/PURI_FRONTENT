import { Component, OnInit, ViewChild, TemplateRef, ElementRef,ChangeDetectorRef ,AfterViewInit} from '@angular/core';
import { RestService } from 'src/app/_service';
//  
import { tt_cash_account, p_report_param, SystemValues, mm_customer } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';

@Component({
  selector: 'app-standing-ins-active-silist',
  templateUrl: './standing-ins-active-silist.component.html',
  styleUrls: ['./standing-ins-active-silist.component.css'],
  providers:[ExportAsService]

})
export class StandingInsActiveSIListComponent implements OnInit,AfterViewInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  //  
  @ViewChild('external') external: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['SLNO','dr_type','fname','dr_accNo','cr_type','tname','cr_accNo', 'tf_dt', 'tf_period','prn_intt','amount'];
  filteredArray:any=[]
  cus_name:any;
  isOpenFromDp = false;
  isOpenToDp = false;
  notvalidate:boolean=false;
  date_msg:any;
  exportAsConfig:ExportAsConfig;
  sys = new SystemValues();
  suggestedCustomer:any=new mm_customer();

  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
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
  constructor(private svc: RestService, private router: Router,private comSer:CommonServiceService) { }
  ngOnInit(): void {
    this.isLoading=true;
    this.SubmitReport()
    
    var date = new Date();
// get the date as a string
   var n = date.toDateString();
// get the time as a string
   var time = date.toLocaleTimeString();
   this.today= n + " "+ time
  }
  

  public SubmitReport() {
    
      
      this.reportData.length=0;
      this.pagedItems.length=0
      this.crSum=0;
      this.drSum=0;
      this.showAlert = false;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode
      }
      this.svc.addUpdDel('Deposit/PopulateActiveSIList',dt).subscribe(data=>{console.log(data)
      this.reportData=data
      
      if(!this.reportData){
        this.comSer.SnackBar_Nodata()
          this.isLoading=false
      }
     
      this.crSum=0;
      this.drSum=0
      this.reportData.forEach(e=>{
        this.crSum+=e.cr_amt;
        this.drSum+=e.dr_amt;

      })
     
      // this.lastcrAccCD=this.reportData[this.reportData.length-1].cr_acc_cd
      // this.lastdrAccCD=this.reportData[this.reportData.length-1].dr_acc_cd
      // this.setPage(1)
      this.dataSource.data=this.reportData
      this.isLoading=false
    },
    err => {
       this.isLoading = false;
       this.comSer.SnackBar_Error(); 
      })
      
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
