import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { mm_constitution } from '../../Models/deposit/mm_constitution';

import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-sms-charge-deduction',
  templateUrl: './sms-charge-deduction.component.html',
  styleUrls: ['./sms-charge-deduction.component.css'],
  providers:[ExportAsService]
})
export class SmsChargeDeductionComponent implements OnInit,AfterViewInit  {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['acc_num','name', 'interest', 'balance'];
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
  showAlert2 = false;
  isLoading = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  toDate: Date;
  counter=0
  suggestedCustomer: mm_customer[];
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  response:any;
  pageChange: any;
  total_intt=0;
  constitutionList: mm_constitution[] = [];
  currUser:any;
  lastAccCD:any;
  today:any
  afterPost:boolean=false;
  filteredArray:any=[]
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router, private comSer:CommonServiceService) { }
  ngOnInit(): void {
    this.getConstitutionList();
    this.afterPost=false;
    // this.fromdate = this.sys.CurrentDate;
    // this.toDate = this.sys.CurrentDate;
    // this.reportcriteria = this.formBuilder.group({
    //   fromDate: [null, Validators.required],
    //   toDate: [null, Validators.required]
    // });
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }
  // onLoadScreen(content) {
  //   this.notvalidate=false
  //   this.modalRef = this.modalService.show(content, this.config);
  // }
  getConstitutionList() {
    if (this.constitutionList.length > 0) {
      return;
    }

    this.constitutionList = [];
    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
      res => {
        console.log(res)
        // //////////////debugger;
        this.constitutionList = res;
      },
      err => { // ;
      }
    );
    console.log(this.constitutionList)
  }
  openModal(template: TemplateRef<any>) {
    this.currUser=localStorage.getItem('__userId');
    this.modalRef = this.modalService.show(template, {class: 'modal-sm modal-dialog-centered'});
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  public SubmitReport() {
    // this.comSer.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    // if (this.reportcriteria.invalid) {
    //   this.showAlert = true;
    //   this.alertMsg = 'Invalid Input.';
    //   return false;
    // }
    // else if(this.comSer.diff<0){
    //   this.date_msg= this.comSer.date_msg
    //   this.notvalidate=true
    // }
    
      this.total_intt=0;
      // this.fromdate = this.reportcriteria.controls.fromDate.value;
      // this.toDate = this.reportcriteria.controls.toDate.value;
      this.reportData.length=0;
      this.pagedItems.length=0;
      // this.modalRef.hide();
      this.isLoading=true;
      var dt={
       "ardb_cd": this.sys.ardbCD,
       
      }
      this.svc.addUpdDel('Deposit/POPULATE_SMS_CHARGE',dt).subscribe(data=>{console.log(data)
        this.reportData=data;
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.dataSource.data=this.reportData
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
    
        this.isLoading=false
        // if(this.reportData.length<50){
        //   this.pagedItems=this.reportData
        // }
        // this.pageChange=document.getElementById('chngPage');
        // // this.pageChange.click()
        this.setPage(2);
        this.setPage(1);
        // this.modalRef.hide();
        // this.constitutionList.constitution_cd
        this.reportData.forEach(e=>{
          this.total_intt+=e.interest;
          
        })
        },
        err => {
           this.isLoading = false;
           this.comSer.SnackBar_Error(); 
          })
        this.showAlert = false;
    
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
    this.showAlert2 = false;
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
    this.exportAsService.save(this.exportAsConfig, 'cashcumtrial').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  CalIntt(){
    this.SubmitReport();
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
    this.total_intt=0;
    
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      this.total_intt+=this.filteredArray[i].interest;
    }
  }
  
  Delete(){

  }
  PostIntt(){
    this.isLoading=true;
    var dt={
      "ardb_cd": this.sys.ardbCD,
      "adt_trans_dt":this.sys.CurrentDate.toISOString()
     }
     debugger
     this.svc.addUpdDel('Deposit/POST_SMS_CHARGE',dt).subscribe(res=>{console.log(res)
      this.response=res
       if(this.response==0){
        debugger
        this.isLoading=false
        this.showAlert2 = true
        this.alertMsg = ' SMS Charges Posting Successfully';
        this.afterPost=true;
        this.dataSource.data=[];
        this.modalRef?.hide();
        this.reportData=[];
        this.total_intt=0;

      }
      else{
        this.showAlert = true
        this.alertMsg = 'Occurred while SMS Charges Posting';
      }
       
       },
       err => {
          this.isLoading = false;
          this.comSer.SnackBar_Error(); 
         })
       
  }
}
