import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
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
  selector: 'app-neft-outward-report',
  templateUrl: './neft-outward-report.component.html',
  styleUrls: ['./neft-outward-report.component.css'],
  providers:[ExportAsService]
})
export class NeftOutwardReportComponent implements OnInit ,AfterViewInit{
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;
dataSource = new MatTableDataSource()
displayedColumns: string[] = ['trans_dt','trans_cd','brn_cd', 'payment_type', 
'bene_name', 'bene_acc_no','bene_ifsc_code','amount','charge_ded',
'bank_dr_acc_no','bank_dr_acc_name','payment_ref_no','status','rejection_reason'];
notvalidate:boolean=false;
date_msg:any;
modalRef: BsModalRef;
isOpenFromDp = false;
isOpenToDp = false;
brnDtls:any[];
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

pageChange: any;
opdrSum=0;
opcrSum=0;
drSum=0;
crSum=0;
clsdrSum=0;
clscrSum=0;
lastAccCD:any;
today:any
currSum=0;
clrSum=0;
prnSum=0;
penalSum=0;
inttSum=0
filteredArray:any=[]
constructor(private svc: RestService, private formBuilder: FormBuilder,
  private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
  private router: Router, private comSer:CommonServiceService) { }
ngOnInit(): void {
  this.GetBranchMaster();
  this.fromdate = this.sys.CurrentDate;
  this.toDate = this.sys.CurrentDate;
  this.reportcriteria = this.formBuilder.group({
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
    this.currSum=0;
    this.clrSum=0
    this.prnSum=0;
    this.penalSum=0
    this.inttSum=0
    this.fromdate = this.reportcriteria.controls.fromDate.value;
    this.toDate = this.reportcriteria.controls.toDate.value;
    this.reportData.length=0;
    this.pagedItems.length=0;
    this.modalRef.hide();
    this.isLoading=true;
    var dt={
     "ardb_cd": this.sys.ardbCD,
    //  "brn_cd":  this.sys.BranchCode,
     "brn_cd": "",
     "from_dt" : this.fromdate.toISOString(),
     "to_dt" : this.toDate.toISOString()
    }
    this.svc.addUpdDel('Deposit/NeftOutward',dt).subscribe(data=>{console.log(data)
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
        this.currSum+=e.curr_bal;
        this.clrSum+=e.clr_bal
        this.prnSum+=e.prn_amt;
        this.penalSum+=e.penal_amt;
        this.inttSum+=e.intt_amt;
        e.brn_cd=this.brnDtls.filter(brn=>brn.brn_cd==e.brn_cd)[0]?.brn_name
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
    // this.UrlString = this.UrlString + 'WebForm/Deposit/nearmatdetails?'
    //   + 'ardb_cd='+this.sys.ardbCD
    //   + '&from_dt=' + Utils.convertDtToString(this.fromdate)
    //   + '&to_dt=' + Utils.convertDtToString(this.toDate)
    //   + '&brn_cd=' + this.sys.BranchCode;

    // this.isLoading = true;
    // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
    // this.modalRef.hide();
    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 10000);
  }
}
private GetBranchMaster() {
  this.isLoading = true;
  var dt = { "ardb_cd": this.sys.ardbCD };
  //console.log(dt)
  // https://cfs2022.in/CTARDBUX/api/Mst/GetBranchMaster
  this.svc.addUpdDel('Mst/GetBranchMaster', dt).subscribe(
    (res:any) => {
      //console.log(res)
      this.isLoading = false;
      this.brnDtls = res;
      this.brnDtls.sort((a, b) => a.brn_cd - b.brn_cd);
    },
    err => { 
      this.isLoading = false;
     }
  );
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
  this.currSum=0;
  this.clrSum=0
  this.prnSum=0;
  this.penalSum=0
  this.inttSum=0
  console.log(this.dataSource.filteredData)
  this.filteredArray=this.dataSource.filteredData
  for(let i=0;i<this.filteredArray.length;i++){
    this.currSum+=this.filteredArray[i].curr_bal;
    this.clrSum+=this.filteredArray[i].clr_bal
    this.prnSum+=this.filteredArray[i].prn_amt;
    this.penalSum+=this.filteredArray[i].penal_amt
    this.inttSum+=this.filteredArray[i].intt_amt
    // console.log(this.filteredArray[i].dr_amt)
  
    // this.crSum+=this.filteredArray[i].cr_amount
  }
}

}
