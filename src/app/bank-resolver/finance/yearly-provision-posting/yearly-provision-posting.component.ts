import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
interface AgentData {
  agent_id: string;
  agent_name: string;
  dd_deposit: number;
  dd_comm: number;
  fd_deposit: number;
  fd_comm: number;
  rd_deposit: number;
  rd_comm: number;
  bl_deposit: number;
  bl_comm: number;
  tot_deposit: number;
  tot_comm: number;
  tds: number;
  sec_dep: number;
  amt_paid: number;
}
@Component({
  selector: 'app-yearly-provision-posting',
  templateUrl: './yearly-provision-posting.component.html',
  styleUrls: ['./yearly-provision-posting.component.css'],
  providers:[ExportAsService]
})
export class YearlyProvisionPostingComponent implements OnInit,AfterViewInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  dataSource = new MatTableDataSource<any>([]);
  totalRow: any = {}; // Object to store totals
  displayedColumns: string[] = ['brn_cd', 'acc_type_cd', 'prov_acc_cd','pl_acc_cd','prov_intt', 'tm_intt', 'adj_bal','dr_cr_flag', 'prov_dt'];

  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;notvalidate:boolean=false;
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
  counter=0;
  accountTypeList:any[]=[];
  brnDtlsList:any[]=[]
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
 
  lastAccCD:any;
  today:any
  
  filteredArray:any=[]
  provisionData:any[]=[];
  agentDetails :any[]=[];
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router, private comser:CommonServiceService) { }
  ngOnInit(): void {
    
    // this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      // fromDate: [null, Validators.required],
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
  ngAfterViewInit() {
    this.GetBranchMaster();
    this.getAccountTypeList();
    this.dataSource.sort = this.sort;
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
  getAgentList() {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode
    }
    this.svc.addUpdDel<any>('Deposit/GetAgentData', dt).subscribe(res => {
      this.agentDetails=res;
    })
  }
  getAccountTypeList() {
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        this.accountTypeList = res;
        // this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
       
       
      });
  }
  GetBranchMaster() {
    this.isLoading = true;
    const dt={
      "ardb_cd":"1"
    }
    this.svc.addUpdDel<any>('Mst/GetBranchMaster', dt).subscribe(
      res => {
        ;
        this.brnDtlsList = res;
        this.isLoading = false;

      },
      err => { this.isLoading = false;; }
    )
  }
  getColor(cust_cd: number): string {
    const colors = ['#f4cccc', '#c9daf8', '#d9ead3', '#fff2cc', '#d5a6bd', '#a4c2f4'];
    const index = Math.abs(cust_cd) % colors.length; // Assign a color based on index
    return colors[index];
  }
  public SubmitReport() {
    // this.comser.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    // else if(this.comser.diff<0){
    //   this.date_msg= this.comser.date_msg
    //   this.notvalidate=true
    // }
    else {
      this.total_dep=0;
      this.total_comm=0;
      // this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.modalRef.hide();
      this.isLoading=true;
      var dt={
      // "brn_cd": this.sys.BranchCode,
       "ardb_cd": this.sys.ardbCD,
      //  "from_dt" : this.fromdate.toISOString(),
       "adt_dt" : this.toDate.toISOString(),
      //  "gs_user_id":this.sys.UserId
      }
      this.svc.addUpdDel<any>('Finance/PopulateYearlyProvision',dt).subscribe(data=>{console.log(data)
        this.provisionData=data;
        this.isLoading=false;
        if(!this.provisionData){
          this.comser.SnackBar_Nodata();
        } 
        else{
          
          this.provisionData=this.enrichProvisionData(this.provisionData,this.brnDtlsList,this.accountTypeList);
          this.provisionData = this.provisionData.map(d => ({
            ...d,
            prov_intt: Math.abs(d.prov_intt),
            tm_intt: Math.abs(d.tm_intt),
            adj_bal: Math.abs(d.adj_bal),
          }));
          this.dataSource.data=this.provisionData;

        }
        
        this.modalRef.hide();
        
        },
        err => {
           this.isLoading = false;
           this.comser.SnackBar_Error(); 
          })
        this.showAlert = false;
    }
  }
  enrichProvisionData(
    provisionData: any[],
    branchMaster: any[],
    accTypeMaster: any[]
  ): any[] {
    return provisionData.map(entry => {
      const branch = branchMaster.find(b => b.brn_cd === entry.brn_cd);
      const accType = accTypeMaster.find(a => a.acc_type_cd === entry.acc_type_cd);
  
      return {
        ...entry,
        brn_name: branch?.brn_name || entry.brn_cd,          // replace with brn_name
        acc_type_cd: accType?.acc_type_desc || entry.acc_type_cd // replace with acc_type_desc
      };
    });
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
  
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    // this.calculateGrandTotal(); // Recalculate totals on filter change
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
      "adt_dt":this.sys.CurrentDate.toISOString()
     }
     debugger
     this.svc.addUpdDel('Deposit/PostYearlyProvision',dt).subscribe(res=>{console.log(res)
      this.response=res
       if(this.response==0){
        debugger
        this.isLoading=false
        this.showAlert2 = true
        this.afterPost=true;
        this.alertMsg = 'Yearly Provision Posting Successfully';
      }
      else{
        this.afterPost=false;
        this.showAlert = true
        this.alertMsg = 'Occurred in Provision Posting';
      }
       
       },
       err => {
          this.afterPost=false;
          this.isLoading = false;
          this.comser.SnackBar_Error(); 
         })
       
  }

}
