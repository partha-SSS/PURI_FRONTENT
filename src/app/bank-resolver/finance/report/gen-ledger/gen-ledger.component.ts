import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { RestService } from 'src/app/_service';
 
import {  p_report_param, SystemValues, tt_gl_trans } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-gen-ledger',
  templateUrl: './gen-ledger.component.html',
  styleUrls: ['./gen-ledger.component.css'],
  providers:[ExportAsService]

})
export class GenLedgerComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  filteredArray:any=[]
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  genLdgerTrans: tt_gl_trans[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  isLoading = false;
  showAlert = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  urlToCall: '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  counter=0;
  reportData:any=[]
  itemsPerPage = 2;
  currentPage = 1;
  pageChange: any;
  pagedItems = [];
  exportAsConfig:ExportAsConfig;
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  resultLength=0
  firstAccCD:any
  lastAccCD:any;
  crSum=0;
  drSum=0;
  total=0
  today:any
  openbal:any
  // displayedColumns: string[] = ['acc_cd', 'voucher_dt','dr_amt','cr_amt','cum_bal','cum_bal_type'];
  displayedColumns: string[] = ['dis_dtls'];
  dataSource = new MatTableDataSource()
  constructor(private svc: RestService,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private _domSanitizer : DomSanitizer,
              private router: Router, private cd: ChangeDetectorRef,
              private exportAsService: ExportAsService, private comser:CommonServiceService
              ) { }

  ngOnInit(): void {
    this.resultLength=this.reportData.length
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fromdate=this.sys.CurrentDate;
    this.todate=this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      fromAcc: [null, Validators.required],
      toAcc: [null, Validators.required],
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
    //this.isLoading = true;
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else if (new Date(this.reportcriteria.value['fromDate']) > new Date(this.reportcriteria.value['toDate'])) {
      this.showAlert = true;
      this.alertMsg = 'To Date cannot be greater than From Date!';
      return false;
    }
    else {
      this.showAlert = false;
      this.fromdate=this.reportcriteria.value['fromDate'];
      this.todate=this.reportcriteria.value['toDate'];
      this.modalRef.hide();
      this.reportData.length=0
      this.pagedItems.length=0
      this.crSum=0;
      this.drSum=0;
      this.total=0
      //this.isLoading=true;
      //this.onReportComplete();
      // this.modalService.dismissAll(this.content);
      var dt={
        "ardb_cd": this.sys.ardbCD,
        "brn_cd": this.sys.BranchCode,
        "from_dt": this.fromdate.toISOString(),
        "to_dt": this.todate.toISOString(),
        "ad_from_acc_cd": this.reportcriteria.controls.fromAcc.value,
        "ad_to_acc_cd": this.reportcriteria.controls.toAcc.value
      }
      this.svc.addUpdDel('Finance/GetGeneralLedger',dt).subscribe(data=>{console.log(data)
      this.reportData=data
      this.resultLength=this.reportData.length
      if(this.reportData.length==0){
        this.comser.SnackBar_Nodata()
      }
      else{
        // console.log(this.reportData,"ppp")
        // for(let i=0;i<this.reportData.length;i++){
        //   for(let j=0;j<this.reportData[i].ttgltrans.length;j++)
        //   this.reportData[i].ttgltransa[j].voucher_dt=this.comser.getFormatedDate(this.reportData[0].ttgltransa[i].voucher_dt);
        // }
        
      this.isLoading=false
      this.pageChange=document.getElementById('chngPage');
      this.pageChange.click()
      this.setPage(2);
      this.setPage(1)
      this.modalRef.hide();
      this.dataSource.data=this.reportData
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
      this.firstAccCD=this.reportData[0].acc_cd;
      this.lastAccCD=this.reportData[this.reportData.length-1].acc_cd  
      this.reportData.forEach(e=>{
       
      //   this.opdrSum+=e.opng_dr;
      //   this.opcrSum+=e.opng_cr;
        this.crSum+=e.cr_amt;
        this.drSum+=e.dr_amt;
        this.total+=e.cum_bal
      //   this.clsdrSum+=e.clos_dr;
      //   this.clscrSum+=e.clos_cr;
      })
      } 

      // for(let i=0;i<this.reportData.length;i++){
      //   this.openbal=this.reportData[i].acctype.acc_name
      // }
      // console.log(this.openbal)
      
      // this.lastAccCD=this.reportData[this.reportData.length-1].acc_cd
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
    this.counter++
    if(this.counter==2){
      this.isLoading=false;
      this.counter=0;
    }
    else{
      this.isLoading=true
    }
    this.modalRef.hide();
  }

  public closeAlert() {
    this.showAlert = false;
  }
 

 
  closeScreen()
  {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); //Retrieve items for page
    this.cd.detectChanges();
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'mattable'
    }
    this.exportAsService.save(this.exportAsConfig, 'GenLedger').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  applyFilter(event: Event) {
    console.log(event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getTotal()
  }
  getTotal(){
    this.drSum=0;
    this.crSum=0;
    this.total=0;
    
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      // console.log(this.filteredArray[i].dr_amt)
      this.drSum+=this.filteredArray[i].dr_amt
      this.crSum+=this.filteredArray[i].cr_amt
      this.total+=this.filteredArray[i].cum_bal
    }
  }
}
