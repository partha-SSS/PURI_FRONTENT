import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-balanace-sheet-new',
  templateUrl: './balanace-sheet-new.component.html',
  styleUrls: ['./balanace-sheet-new.component.css'],
  providers:[ExportAsService]

})
export class BalanaceSheetNewComponent implements OnInit {

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  // trailbalance: tt_trial_balance[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  ReportUrl: SafeResourceUrl;
  exportAsConfig:ExportAsConfig;
  format2:boolean=false;
  mainFormat:boolean=true;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  counter=0;
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
  lastLi:any;
  lastAss:any;
  li=0;
  ass=0;
  
  assetsData: any[] = [];
  liabilitiesData: any[] = [];

  groupedAssets: any[] = [];
  groupedLiabilities: any[] = [];

  assetsTotal = { open_bal: 0, cr_amt: 0, dr_amt: 0, close_bal: 0 };
  liabilitiesTotal = { open_bal: 0, cr_amt: 0, dr_amt: 0, close_bal: 0 };

  constructor(private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService,
              private modalService: BsModalService, private _domSanitizer: DomSanitizer, private cd: ChangeDetectorRef,
              private router: Router, private comser:CommonServiceService) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      // toDate: [null, null]
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
    this.modalRef = this.modalService.show(content, this.config);
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }

  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.opdrSum=0;
      this.opcrSum=0
      this.modalRef.hide()
      this.reportData.length=0;
      this.pagedItems.length=0
      this.showAlert = false;
      this.fromdate=this.reportcriteria.value['fromDate'];
      // this.todate=this.reportcriteria.value['toDate'];
      //this.isLoading=true;
      //this.onReportComplete();
      // this.modalService.dismissAll(this.content);
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        // "to_dt":this.todate.toISOString()
      }
      this.svc.addUpdDel('Finance/BalanceSheetCBS',dt).subscribe(data=>{console.log(data)
      this.reportData=data
      if(this.reportData.length==0){
        this.comser.SnackBar_Nodata()
      } 
      else{
        this.assetsData = this.reportData.filter(item => item.acc_type_desc === 'Asset');
        this.liabilitiesData = this.reportData.filter(item => item.acc_type_desc === 'Liability');
    
        this.groupedAssets = this.groupBySchedule(this.assetsData);
        this.groupedLiabilities = this.groupBySchedule(this.liabilitiesData);
    
        this.calculateGrandTotal(this.assetsData, this.assetsTotal);
        this.calculateGrandTotal(this.liabilitiesData, this.liabilitiesTotal);
      }
      this.isLoading=false

      this.pageChange=document.getElementById('chngPage');
      // this.pageChange.click()
      // this.setPage(2);
      // this.setPage(1)
      this.modalRef.hide();
      // for(let i=0;i<this.reportData.length;i++){
      //   if(this.reportData[i].type=='Liability'){
      //     this.opdrSum+=this.reportData[i].curr_bal; this.li++ 
      //     this.lastLi=this.reportData[i].acc_cd
      //   }
      //   else{
      //     this.opcrSum+=this.reportData[i].curr_bal;; this.ass++
      //     this.lastAss=this.reportData[i].acc_cd

      //   }
      // }
      // console.log(this.li,this.ass)
      // this.lastLi=this.reportData[this.li-1].acc_cd
      // this.lastAss=this.reportData[(this.ass+this.li)-1].acc_cd
      // console.log(this.lastLi,this.lastAss)
     
      },
      err => {
         this.isLoading = false;
         this.comser.SnackBar_Error(); 
        })
      
      // this.UrlString=this.svc.getReportUrl()
      // this.UrlString=this.UrlString+"WebForm/Fin/cashcumtrail?" + 'ardb_cd=' + this.sys.ardbCD+"&brn_cd="+this.sys.BranchCode+"&from_dt="+Utils.convertDtToString(this.fromdate)+"&to_dt="+Utils.convertDtToString(this.todate)
      ;
      this.isLoading = true;
      this.ReportUrl=this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString)

      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 10000);
    }
  }
  public oniframeLoad(): void {
    this.counter++;
    if(this.counter==2){
      this.isLoading=false;
      this.counter=0;
    }
    else{
      this.isLoading=true;
    }
    this.modalRef.hide();
  }
  public closeAlert() {
    this.showAlert = false;
  }

  groupBySchedule(data: any[]) {
    const grouped = data.reduce((acc, curr) => {
      const key = curr.schedule_desc;
      if (!acc[key]) {
        acc[key] = { schedule_desc: key, items: [], subtotal: { open_bal: 0, cr_amt: 0, dr_amt: 0, close_bal: 0 } };
      }
      acc[key].items.push(curr);
      acc[key].subtotal.open_bal += curr.open_bal;
      acc[key].subtotal.cr_amt += curr.cr_amt;
      acc[key].subtotal.dr_amt += curr.dr_amt;
      acc[key].subtotal.close_bal += curr.close_bal;
      return acc;
    }, {});
    return Object.values(grouped);
  }

  calculateGrandTotal(data: any[], total: any) {
    data.forEach(item => {
      total.open_bal += item.open_bal;
      total.cr_amt += item.cr_amt;
      total.dr_amt += item.dr_amt;
      total.close_bal += item.close_bal;
    });
  }
  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); //Retrieve items for page
    this.cd.detectChanges();
  }
  Format2(){
    this.format2=true;
  }
  Format1(){
    this.format2=false;
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'hiddenTab'
    }
    this.exportAsService.save(this.exportAsConfig, 'BalanceSheet').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
}
