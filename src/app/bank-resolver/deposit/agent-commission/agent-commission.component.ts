import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-agent-commission',
  templateUrl: './agent-commission.component.html',
  styleUrls: ['./agent-commission.component.css'],
  providers:[ExportAsService]
})
export class AgentCommissionComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['agent_cd','agent_name', 'deposit_amt', 'commission', 'interest', 'withdrawal', 'deduction'];
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
  afterPost:boolean=false;
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
  total_comm=0;
  total_dep=0;
  apiurl:any;
  lastAccCD:any;
  today:any
  
  filteredArray:any=[]
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router, private comSer:CommonServiceService) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
       this.onLoadScreen(this.content);
  }
  onLoadScreen(content) {
    this.notvalidate=false
    this.modalRef = this.modalService.show(content, this.config);
  }
  isRetrieve(){
    this.onLoadScreen(this.content);
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
      this.total_dep=0;
      this.total_comm=0;
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.modalRef.hide();
      this.isLoading=true;
      var dt={
      "brn_cd": this.sys.BranchCode,
       "ardb_cd": this.sys.ardbCD,
       "from_dt" : this.fromdate.toISOString(),
       "to_dt" : this.toDate.toISOString()
      }
      
      this.svc.addUpdDel('Deposit/GetAgentCommission',dt).subscribe(data=>{console.log(data)
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
        this.modalRef.hide();
        this.reportData.forEach(e=>{
          this.total_dep+=e.deposited_amt;
          this.total_comm+=e.commission;
          
        })
        },
        err => {
           this.isLoading = false;
           this.comSer.SnackBar_Error(); 
          })
        this.showAlert = false;
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
    this.total_dep=0;
    
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      this.total_dep+=this.filteredArray[i].deposited_amt;
      this.total_comm+=this.filteredArray[i].commission;

    }
  }
  
  Delete(){

  }
  PostIntt(){
    this.isLoading=true;
    var dt={
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode,
      "adt_trans_dt":this.sys.CurrentDate.toISOString(),
      "gs_user_id": this.sys.UserId
     }
     debugger
     this.svc.addUpdDel('Deposit/PostAgentCommission',dt).subscribe(res=>{console.log(res)
      this.response=res
       if(this.response==0){
        debugger
        this.isLoading=false
        this.showAlert2 = true
        this.afterPost=true;
        this.alertMsg = 'Commission Posting in Agent Account Successfully';
      }
      else{
        this.afterPost=false;
        this.showAlert = true
        this.alertMsg = 'Occurred in Commission Posting';
      }
       
       },
       err => {
          this.afterPost=false;
          this.isLoading = false;
          this.comSer.SnackBar_Error(); 
         })
       
  }

}
