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
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-open-closing-register',
  templateUrl: './open-closing-register.component.html',
  styleUrls: ['./open-closing-register.component.css'],
  providers:[ExportAsService]

})
export class OpenClosingRegisterComponent implements OnInit ,AfterViewInit{
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['SLNO','acc_type_cd', 'acc_num', 'cust_name','cust_address', 'prn_amt','intt_amt','intt_rt','opn_cls_dt'];

  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  notvalidate:boolean=false;
  date_msg:any;
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
  counter=0
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  sumPrn=0
  sumIntt=0
  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  clsdrSum=0;
  clscrSum=0;
  lastAccCD:any;
  today:any
  showWait=false;
  LandingOpenCall:boolean;
  LandingCloseCall:boolean;
  suggestedCustomer: mm_customer[];
  filteredArray:any=[]
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router, private comSer:CommonServiceService) { }
  ngOnInit(): void {
    this.LandingOpenCall=false;
    this.LandingCloseCall=false;
    if(this.comSer.accOpen){
      this.LandingOpenCall=true;
    }
    if(this.comSer.accClose){
      this.LandingCloseCall=true;
    }
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      OpenClose: [null, Validators.required]
    });
    if(this.LandingOpenCall||this.LandingCloseCall){
      if(this.LandingOpenCall){
        this.reportcriteria.controls.OpenClose.setValue('O')
        this.reportcriteria.controls.toDate.setValue(this.sys.CurrentDate)
        this.reportcriteria.controls.fromDate.setValue(this.sys.CurrentDate)
      }
      else{
        this.reportcriteria.controls.OpenClose.setValue('C')
        this.reportcriteria.controls.toDate.setValue(this.sys.CurrentDate)
        this.reportcriteria.controls.fromDate.setValue(this.sys.CurrentDate)
      }
      debugger
      this.SubmitReport();
    }
    else{
      this.onLoadScreen(this.content);
    }
    
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

  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  
  public SubmitReport() {
    this.comSer.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    if(this.LandingOpenCall||this.LandingCloseCall){
      this.sumPrn=0;
      this.sumIntt=0
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd": this.sys.ardbCD,
        "from_dt": this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString(),
        "brn_cd":this.sys.BranchCode,
        "flag":this.reportcriteria.controls.OpenClose.value
        
      }
      this.svc.addUpdDel('Deposit/PopulateOpenCloseRegister',dt).subscribe(data=>{console.log(data)
        this.reportData=data;
        this.dataSource.data=this.reportData
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.isLoading=false
        this.reportData.forEach(e=>{
          this.sumPrn+=e.prn_amt;
          this.sumIntt+=e.intt_amt;
          debugger
        })
        },
        err => {
           this.isLoading = false;
           this.comSer.SnackBar_Error(); 
          })
        this.showAlert = false;
    }
    else{
      if (this.reportcriteria.invalid) {
        debugger
        this.showAlert = true;
        this.alertMsg = 'Invalid Input.';
        return false;
      }
      else if(this.comSer.diff<0){
        debugger
        this.date_msg= this.comSer.date_msg
        this.notvalidate=true
      }

  else {
    this.sumPrn=0;
    this.sumIntt=0
    this.reportData.length=0
    this.modalRef.hide();
    this.reportData.length=0;
    this.pagedItems.length=0;
    this.isLoading=true
    this.fromdate = this.reportcriteria.controls.fromDate.value;
    this.toDate = this.reportcriteria.controls.toDate.value;
    var dt={
      "ardb_cd": this.sys.ardbCD,
      "from_dt": this.fromdate.toISOString(),
      "to_dt":this.toDate.toISOString(),
      "brn_cd":this.sys.BranchCode,
      "flag":this.reportcriteria.controls.OpenClose.value
      
    }
    this.svc.addUpdDel('Deposit/PopulateOpenCloseRegister',dt).subscribe(data=>{console.log(data)
      this.reportData=data;
      this.dataSource.data=this.reportData
      if(!this.reportData){
        this.comSer.SnackBar_Nodata()
          this.isLoading=false
      } 
      this.isLoading=false
      this.pageChange=document.getElementById('chngPage');
      this.pageChange.click()
      this.setPage(2);
      this.setPage(1)
      this.modalRef.hide();
      this.reportData.forEach(e=>{
        this.sumPrn+=e.prn_amt;
        this.sumIntt+=e.intt_amt;
      })
      },
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
        })
      this.showAlert = false;
    // this.showAlert = false;
    // this.fromdate = this.reportcriteria.controls.fromDate.value;
    // this.toDate = this.reportcriteria.controls.toDate.value;
    // this.UrlString = this.svc.getReportUrl();
    // this.UrlString = this.UrlString + 'WebForm/Deposit/opencloseregister?'
    //   + 'ardb_cd='+this.sys.ardbCD
    //   + '&from_dt=' + Utils.convertDtToString(this.fromdate)
    //   + '&to_dt=' + Utils.convertDtToString(this.toDate)
    //   + '&brn_cd=' + this.sys.BranchCode
    //   + '&flag=' + this.reportcriteria.controls.OpenClose.value; // todo opn/close    O / C.

    // this.isLoading = true;
    // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
    // this.modalRef.hide();
    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 10000);
  }
    }
        
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
      elementIdOrContent:'mattable'
    }
    this.exportAsService.save(this.exportAsConfig, 'OpenClose_Register').subscribe(() => {
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
    console.log(filterValue);
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.getTotal()
    }
    this.getTotal()
  }
  getTotal(){
    this.sumPrn=0
    this.sumIntt=0
    console.log(this.dataSource.filteredData);
    
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      this.sumPrn+=this.filteredArray[i].prn_amt;
      this.sumIntt+=this.filteredArray[i].intt_amt
      console.log(this.filteredArray[i]);
    
      // this.crSum+=this.filteredArray[i].cr_amount
    }
    
    
  }
}
