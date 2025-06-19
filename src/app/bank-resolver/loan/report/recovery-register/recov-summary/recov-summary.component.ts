import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer, mm_operation } from 'src/app/bank-resolver/Models';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { DetailListComponent } from '../../detail-list/detail-list.component';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-recov-summary',
  templateUrl: './recov-summary.component.html',
  styleUrls: ['./recov-summary.component.css']
})
export class RecovSummaryComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  displayedColumns: string[] = ['acc_cd','Block'];
  // ,'loan_id','cust_name','curr_prn_recov', 'ovd_prn_recov','adv_prn_recov','curr_intt_recov','ovd_intt_recov','penal_intt_recov','recov_amt','last_intt_calc_dt'
  dataSource = new MatTableDataSource()
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
  showReport = false;
  showAlert = false;
  isLoading = false;
  counter=0
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  toDate: Date;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  clsdrSum=0;
  clscrSum=0;
  lastAccCD:any;
  today:any
  cName:any
  cAddress:any
  cAcc:any
  lastAccNum:any
  totcurrInttSum=0
  totovdInttSum=0
  totovdPrnSum=0
  totcurrPrnSum=0
  totPrn=0;
  totpenalInttSum=0;
  totadvPrnSum=0;
  loanNm:any;
  suggestedCustomer: mm_customer[];
  AcctTypes:  mm_operation[];
  filteredArray:any=[]
  resultLength=0;
  LandingCall:boolean;
  constructor(private comSer:CommonServiceService, private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,private modalService: BsModalService, private _domSanitizer: DomSanitizer,private router: Router) { }
  ngOnInit(): void {
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getOperationMaster()
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      // acc_type_cd: [null, Validators.required]
    });
    if(this.comSer.loanRec){
      this.LandingCall=true;
      this.SubmitReport();
    }
    else{
      this.LandingCall=false;
      this.onLoadScreen(this.content);
    }
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today= n + " "+ time
  }
  
  onLoadScreen(content) {
    this.notvalidate=false
    this.modalRef = this.modalService.show(content, this.config);
  }
  private getOperationMaster(): void {
     this.isLoading = true;
     if (undefined !== DetailListComponent.operations &&
       null !== DetailListComponent.operations &&
       DetailListComponent.operations.length > 0) {
       this.isLoading = false;
       this.AcctTypes = DetailListComponent.operations.filter(e => e.module_type === 'LOAN')
         .filter((thing, i, arr) => {
           return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
         });
       this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
     } else {
       this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
         res => {
 
           DetailListComponent.operations = res;
           this.isLoading = false;
           this.AcctTypes = DetailListComponent.operations.filter(e => e.module_type === 'LOAN')
             .filter((thing, i, arr) => {
               return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
             });
           this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
         },
         err => { this.isLoading = false; }
       );}
   }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); 
    console.log(this.pagedItems)
    this.cd.detectChanges();
  }
  public SubmitReport() {
    this.comSer.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    if(this.comSer.loanRec){
          this.isLoading=true;
          this.totovdInttSum=0;
          this.totcurrInttSum=0;
          this.totpenalInttSum=0;
          this.totcurrPrnSum=0;
          this.totovdPrnSum=0;
          this.totadvPrnSum=0;
          this.totPrn=0;
          this.reportData.length=0;
          this.pagedItems.length=0;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.sys.CurrentDate.toISOString(),
        "to_dt":this.sys.CurrentDate.toISOString(),
        // "acc_cd":this.reportcriteria.controls.acc_type_cd.value,
      }
      this.svc.addUpdDel('Loan/PopulateRecoveryRegister',dt).subscribe(data=>{console.log(data)
        this.reportData=data
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
          for(let i=0;i<this.reportData.length;i++){
          this.totovdInttSum+=this.reportData[i].acctype.tot_acc_ovd_intt_recov
          this.totcurrInttSum+=this.reportData[i].acctype.tot_acc_curr_intt_recov
          this.totpenalInttSum+=this.reportData[i].acctype.tot_acc_penal_intt_recov
          this.totcurrPrnSum+=this.reportData[i].acctype.tot_acc_curr_prn_recov
          this.totovdPrnSum+=this.reportData[i].acctype.tot_acc_ovd_prn_recov
          this.totadvPrnSum+=this.reportData[i].acctype.tot_acc_adv_prn_recov
          this.totPrn+=this.reportData[i].acctype.tot_acc_recov
          }
        this.isLoading=false
        this.dataSource.data=this.reportData
        console.log(this.dataSource.data);
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
       
      }),
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
        }
    }
    else{
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
      this.totovdInttSum=0
          this.totcurrInttSum=0
          this.totpenalInttSum=0
          this.totcurrPrnSum=0
          this.totovdPrnSum=0
          this.totadvPrnSum=0
          this.totPrn=0
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true;
      // this.loanNm=this.AcctTypes.filter(e=>e.acc_type_cd==this.reportcriteria.controls.acc_type_cd.value)[0].acc_type_desc
      // console.log(this.loanNm)
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString(),
        // "acc_cd":this.reportcriteria.controls.acc_type_cd.value,
      }
      this.isLoading=true;
      this.svc.addUpdDel('Loan/PopulateRecoveryRegister',dt).subscribe(data=>{console.log(data)
        this.reportData=data
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
          for(let i=0;i<this.reportData.length;i++){
          this.totovdInttSum+=this.reportData[i].acctype.tot_acc_ovd_intt_recov
          this.totcurrInttSum+=this.reportData[i].acctype.tot_acc_curr_intt_recov
          this.totpenalInttSum+=this.reportData[i].acctype.tot_acc_penal_intt_recov
          this.totcurrPrnSum+=this.reportData[i].acctype.tot_acc_curr_prn_recov
          this.totovdPrnSum+=this.reportData[i].acctype.tot_acc_ovd_prn_recov
          this.totadvPrnSum+=this.reportData[i].acctype.tot_acc_adv_prn_recov
          this.totPrn+=this.reportData[i].acctype.tot_acc_recov
          
          // this.totcurrInttSum,this.totpenalInttSum,this.totcurrPrnSum, this.totovdPrnSum,this.totadvPrnSum,this.totPrn
          
    }
    console.log(this.totovdInttSum);
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
        this.dataSource.data=this.reportData
        console.log(this.dataSource.data);
        
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.resultLength=this.reportData.length
        if(this.reportData.length<50){
          this.pagedItems=this.reportData
        }
        this.pageChange=document.getElementById('chngPage');
        this.pageChange.click()
        this.setPage(2);
        this.setPage(1)
        this.modalRef.hide();
        this.lastAccNum=this.reportData[this.reportData.length-1].loan_id
        // this.reportData.forEach(e => {
        //   this.ovdInttSum+=e.ovd_intt_recov
        //   this.currInttSum+=e.curr_intt_recov
        //   this.penalInttSum+=e.penal_intt_recov
        //   this.currPrnSum+=e.curr_prn_recov
        //   this.ovdPrnSum+=e.ovd_prn_recov
        //   this.advPrnSum+=e.adv_prn_recov
        //   this.totPrn+=e.recov_amt
        // });
      }),
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
        }
   }
  }
  }
  public oniframeLoad(): void {
    this.counter++;
    if(this.counter==2){
      this.isLoading = false;
      this.counter=0
    }
    else{
      this.isLoading=true;
    }
    this.modalRef.hide();
  }
  public closeAlert() {
    this.showAlert = false;
  }
  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  applyFilter(event: Event) {
    console.log(event)
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
      elementIdOrContent:'mattable'
    }
    this.exportAsService.save(this.exportAsConfig, 'ConsoTrial').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  // getTotal(){
  //   this.ovdInttSum=0
  //   this.currInttSum=0
  //   this.penalInttSum=0
  //   this.currPrnSum=0
  //   this.ovdPrnSum=0
  //   this.advPrnSum=0
  //   this.totPrn=0
  //   console.log(this.dataSource.filteredData)
  //   this.filteredArray=this.dataSource.filteredData
  //   for(let i=0;i<this.filteredArray.length;i++){
  //         this.ovdInttSum+=this.filteredArray[i].ovd_intt_recov
  //         this.currInttSum+=this.filteredArray[i].curr_intt_recov
  //         this.penalInttSum+=this.filteredArray[i].penal_intt_recov
  //         this.currPrnSum+=this.filteredArray[i].curr_prn_recov
  //         this.ovdPrnSum+=this.filteredArray[i].ovd_prn_recov
  //         this.advPrnSum+=this.filteredArray[i].adv_prn_recov
  //         this.totPrn+=this.filteredArray[i].recov_amt
  //   }
  // }
}
