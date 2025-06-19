import { Component, OnInit, ViewChild, TemplateRef, ElementRef,ChangeDetectorRef ,AfterViewInit} from '@angular/core';
import { RestService } from 'src/app/_service';
 
import { tt_cash_account, p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';


@Component({
  selector: 'app-consolidated-cash-acc',
  templateUrl: './consolidated-cash-acc.component.html',
  styleUrls: ['./consolidated-cash-acc.component.css'],
  providers:[ExportAsService]
})
export class ConsolidatedCashAccComponent implements OnInit ,AfterViewInit{
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
   
  @ViewChild('external') external: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['dr_acc_cd','dr_particulars','dr_amt','cr_acc_cd', 'cr_particulars', 'cr_amt'];
  filteredArray:any=[]
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  notvalidate:boolean=false;
  date_msg:any;
  exportAsConfig:ExportAsConfig;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  // bsInlineValue = new Date();
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
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private cd: ChangeDetectorRef,
    private exportAsService: ExportAsService,
    private router: Router,private comser:CommonServiceService) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate; // new Date(localStorage.getItem('__currentDate'));
    this.todate = this.sys.CurrentDate; // new Date(localStorage.getItem('__currentDate'));
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
  

  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  // ngAfterViewInit() {
  //   this.external.nativeElement.o();
  // }

  onLoadScreen(content) {
    this.notvalidate=false
    this.modalRef = this.modalService.show(content, this.config);
  }


  public SubmitReport() {
    this.comser.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else if (new Date(this.reportcriteria.value.fromDate) > new Date(this.reportcriteria.value.toDate)) {
      this.showAlert = true;
      this.alertMsg = 'To Date cannot be greater than From Date!';
      return false;
    }
    else {
      this.isLoading=true;
      this.reportData.length=0;
      this.pagedItems.length=0
      this.modalRef.hide()
      this.crSum=0;
      this.drSum=0;
      this.showAlert = false;
      this.fromdate = this.reportcriteria.value.fromDate;
      this.todate = this.reportcriteria.value.toDate;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        // "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.todate.toISOString(),
        "acc_cd":localStorage.getItem('__cashaccountCD')
      }
      this.svc.addUpdDel('Finance/PopulateDailyCashAccountConso',dt).subscribe(data=>{console.log(data)
      this.reportData=data
      this.reportData =  this.reportData.sort((a, b) => (a.srl_no > b.srl_no) ? 1 : -1);
      this.dataSource.data=this.reportData
      if(this.reportData.length==0){
        this.comser.SnackBar_Nodata()
      } 
      // this.pageChange=document.getElementById('chngPage');
      // this.pageChange.click()
      // this.modalRef.hide();
      // this.setPage(2);
      // this.setPage(1)
      this.crSum=0;
      this.drSum=0
      this.reportData.forEach(e=>{
        this.crSum+=e.cr_amt;
        this.drSum+=e.dr_amt;
      })
      this.lastcrAccCD=this.reportData[this.reportData.length-1].cr_acc_cd
      this.lastdrAccCD=this.reportData[this.reportData.length-1].dr_acc_cd
      if(this.reportData.length>0){
        this.isLoading=false

      }
      // this.setPage(1)
    },
    err => {
       this.isLoading = false;
       this.comser.SnackBar_Error(); 
      })
      // this.UrlString = this.svc.getReportUrl();
      // this.UrlString = this.UrlString + 'WebForm/Fin/cashaccount?' + 'ardb_cd=' + this.sys.ardbCD + '&brn_cd=' + this.sys.BranchCode + '&from_dt=' + Utils.convertDtToString(this.fromdate) + '&to_dt=' + Utils.convertDtToString(this.todate) + '&acc_cd=' + localStorage.getItem('__cashaccountCD')
      //   ;
      // this.isLoading = true;
      // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString); // 20/01/2019
      this.modalRef.hide();
      this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50

    }
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
  this.modalRef.hide();
   
  }

  public closeAlert() {
    this.showAlert = false;
  }
  // private pdfmake : pdfMake;
   



  // onReportComplete(): void {
  //   ;
  //   if (!this.isLoading) { return; }
  //   this.prp.brn_cd = this.sys.BranchCode;
  //   this.prp.from_dt = this.fromdate;
  //   this.prp.to_dt = this.todate;
  //   this.prp.acc_cd = 28101;
  //   const fdate = new Date(this.fromdate);
  //   const tdate = new Date(this.todate);
  //   this.fd = (('0' + fdate.getDate()).slice(-2)) + '/' + (('0' + (fdate.getMonth() + 1)).slice(-2)) + '/' + (fdate.getFullYear());
  //   this.td = (('0' + tdate.getDate()).slice(-2)) + '/' + (('0' + (tdate.getMonth() + 1)).slice(-2)) + '/' + (tdate.getFullYear());
  //   this.dt = new Date();
  //   this.dt = (('0' + this.dt.getDate()).slice(-2)) + '/' + (('0' + (this.dt.getMonth() + 1)).slice(-2)) + '/' + (this.dt.getFullYear()) + ' ' + this.dt.getHours() + ':' + this.dt.getMinutes();
  //   this.child.webDataRocks.off('reportcomplete');
  //   this.svc.addUpdDel<any>('Report/PopulateDailyCashBook', this.prp).subscribe(
  //     (data: tt_cash_account[]) => this.dailyCash = data,
  //     error => { console.log(error); },
  //     () => {
  //       ;
  //       this.isLoading = false;
  //       let totalCr = 0;
  //       let totalDr = 0;
  //       const tmp_cash_account = new tt_cash_account();
  //       this.dailyCash.forEach(x => totalCr += x.cr_amt);
  //       this.dailyCash.forEach(x => totalDr += x.dr_amt);
  //       this.dailyCash.forEach(x => x.cr_acc_cd = (x.cr_acc_cd == '0' ? '' : '' + x.cr_acc_cd.toString()));
  //       this.dailyCash.forEach(x => x.dr_acc_cd = (x.dr_acc_cd == '0' ? '' : '' + x.dr_acc_cd.toString()));
  //       this.dailyCash.forEach(x => x.dr_amt = (x.dr_amt == 0.00 ? null : x.dr_amt));
  //       this.dailyCash.forEach(x => x.cr_amt = (x.cr_amt == 0.00 ? null : x.cr_amt));
  //       this.dailyCash.forEach(x => x.dr_particulars = (x.dr_particulars == null ? ' ' : x.dr_particulars));
  //       this.dailyCash.forEach(x => x.cr_particulars = (x.cr_particulars == null ? ' ' : x.cr_particulars));
  //       tmp_cash_account.cr_amt = totalCr;
  //       tmp_cash_account.dr_amt = totalDr;
  //       tmp_cash_account.dr_particulars = 'Total Debit: ';
  //       tmp_cash_account.cr_particulars = 'Total Credit: ';
  //       this.dailyCash.push(tmp_cash_account);
  //       this.child.webDataRocks.setReport({
  //         dataSource: {
  //           data: this.dailyCash
  //         },
  //         tableSizes: {
  //           columns: [
  //             {
  //               idx: 0,
  //               width: 75
  //             },
  //             {
  //               idx: 1,
  //               width: 200
  //             },
  //             {
  //               idx: 2,
  //               width: 100
  //             },
  //             {
  //               idx: 3,
  //               width: 75
  //             },
  //             {
  //               idx: 4,
  //               width: 200
  //             },
  //             {
  //               idx: 5,
  //               width: 100
  //             }
  //           ]
  //         },
  //         'options': {
  //           'grid': {
  //             'type': 'flat',
  //             'showTotals': 'off',
  //             'showGrandTotals': 'off'
  //           }
  //         },
  //         'slice': {
  //           'rows': [
  //             {
  //               'uniqueName': 'dr_acc_cd',
  //               'caption': 'Debit',
  //               'sort': 'unsorted'

  //             },
  //             {
  //               'uniqueName': 'dr_particulars',
  //               'caption': 'Dr Description',
  //               'sort': 'unsorted'
  //             },
  //             {
  //               'uniqueName': 'dr_amt',
  //               'caption': 'Dr Amount',
  //               'sort': 'unsorted'
  //             },
  //             {
  //               'uniqueName': 'cr_acc_cd',
  //               'caption': 'Credit',
  //               'sort': 'unsorted'
  //             },
  //             {
  //               'uniqueName': 'cr_particulars',
  //               'caption': 'Cr Description',
  //               'sort': 'unsorted'
  //             },
  //             {
  //               'uniqueName': 'cr_amt',
  //               'caption': 'Cr Amount',
  //               'sort': 'unsorted'
  //             }
  //           ],
  //           'measures': [
  //             {
  //               uniqueName: 'dr_acc_cd',
  //               format: 'decimal0'
  //             },
  //             {
  //               uniqueName: 'cr_acc_cd',
  //               format: 'decimal0'
  //             }],
  //           'flatOrder': [
  //             'Debit',
  //             'Dr Description',
  //             'Dr Amount',
  //             'Credit',
  //             'Cr Description',
  //             'Cr Amount',
  //           ]
  //         },

  //         'formats': [{
  //           'name': '',
  //           'thousandsSeparator': ',',
  //           'decimalSeparator': '.',
  //           'decimalPlaces': 2,
  //           'maxSymbols': 20,
  //           'currencySymbol': '',
  //           'currencySymbolAlign': 'left',
  //           'nullValue': ' ',
  //           'infinityValue': 'Infinity',
  //           'divideByZeroValue': 'Infinity'
  //         },
  //         {
  //           name: 'decimal0',
  //           decimalPlaces: 0,
  //           thousandsSeparator: '',
  //           textAlign: 'left'
  //         }
  //         ]
  //       });
  //       this.modalRef.hide();
  //     }
  //   );
  // }

 
  closeScreen() {
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
      elementIdOrContent:'trial111'
    }
    this.exportAsService.save(this.exportAsConfig, 'ConsoCashAcount').subscribe(() => {
      // save started
      console.log("hello")
    });
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
