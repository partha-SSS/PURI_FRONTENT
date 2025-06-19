import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef,AfterViewInit } from '@angular/core';
import { RestService } from 'src/app/_service';
 
import { tt_cash_account, p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { tt_cash_cum_trial } from 'src/app/bank-resolver/Models/tt_cash_cum_trial';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
@Component({
  selector: 'app-conso-cctrial',
  templateUrl: './conso-cctrial.component.html',
  styleUrls: ['./conso-cctrial.component.css'],
  providers:[ExportAsService]
})
export class ConsoCCTrialComponent implements OnInit ,AfterViewInit{
  // displayedColumns: string[] = ['acc_cd', 'acc_name', 'opng_dr', 'dr', 'cr', 'clos_dr'];
  dataSource=new MatTableDataSource();
  dataSource1=new MatTableDataSource();
  dataSource2=new MatTableDataSource();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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
  cashcumtrial: tt_cash_cum_trial[] = [];
  prp =new p_report_param();
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
  exportAsConfig:ExportAsConfig;

  fromdate: Date;
  todate:Date;
  counter=0;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  reportData1:any=[]
  reportData2:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  opdrSum1=0
  crSum1=0
  drSum1=0
  clsdrSum1=0
  opdrSum2=0
  crSum2=0
  drSum2=0
  clsdrSum2=0
  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  clsdrSum=0;
  clscrSum=0;
  opdrSumOne=0;
  opcrSumOne=0;
  drSumOne=0;
  crSumOne=0;
  clsdrSumOne=0;
  clscrSumOne=0;
  opdrSumTwo=0;
  opcrSumTwo=0;
  drSumTwo=0;
  crSumTwo=0;
  clsdrSumTwo=0;
  clscrSumTwo=0;
  opdrSumThree=0;
  opcrSumThree=0;
  drSumThree=0;
  crSumThree=0;
  clsdrSumThree=0;
  clscrSumThree=0;
  opdrSumFour=0;
  opcrSumFour=0;
  drSumFour=0;
  crSumFour=0;
  clsdrSumFour=0;
  clscrSumFour=0;
  lastAccCD:any;
  today:any
  lastOne:any;
  lastTwo:any;
  lastThree:any;
  lastFour:any;
  groupedData: any[] = [];
  grandTotals: any = {
    opng_dr: 0,
    opng_cr: 0,
    dr: 0,
    cr: 0,
    clos_dr: 0,
    clos_cr: 0,
  };
  constructor(private svc: RestService,private formBuilder: FormBuilder, private exportAsService: ExportAsService,
    private modalService: BsModalService,private _domSanitizer : DomSanitizer, private cd: ChangeDetectorRef,
    private router: Router, private comser:CommonServiceService ) { }
  ngOnInit(): void {
    this.fromdate=this.sys.CurrentDate;
    this.todate=this.sys.CurrentDate;
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
    this.modalRef = this.modalService.show(content, this.config);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = "Invalid Input.";
      return false;
    }
    else if (new Date(this.reportcriteria.value['fromDate']) > new Date(this.reportcriteria.value['toDate'])) {
      this.showAlert = true;
      this.alertMsg = "To Date cannot be greater than From Date!";
      return false;
    }
    else {
      this.modalRef.hide()
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.showAlert = false;
      this.opdrSum=0;
      this.opcrSum=0;
      this.crSum=0;
      this.drSum=0;
      this.clsdrSum=0;
      this.clscrSum=0;
      this.opdrSumOne=0;
          this.opcrSumOne=0;
          this.crSumOne=0;
          this.drSumOne=0;
          this.clsdrSumOne=0;
          this.clscrSumOne=0;
          this.opdrSumTwo=0;
          this.opcrSumTwo=0;
          this.crSumTwo=0;
          this.drSumTwo=0;
          this.clsdrSumTwo=0;
          this.clscrSumTwo=0;
          this.opdrSumThree=0;
          this.opcrSumThree=0;
          this.crSumThree=0;
          this.drSumThree=0;
          this.clsdrSumThree=0;
          this.clscrSumThree=0;
          this.opdrSumFour=0;
          this.opcrSumFour=0;
          this.crSumFour=0;
          this.drSumFour=0;
          this.clsdrSumFour=0;
          this.clscrSumFour=0;
      this.fromdate=this.reportcriteria.value['fromDate'];
      this.todate=this.reportcriteria.value['toDate'];
      //this.isLoading=true;
      //this.onReportComplete();
      // this.modalService.dismissAll(this.content);
      var dt={
        "ardb_cd":this.sys.ardbCD,
        // "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.todate.toISOString()
      }
      this.svc.addUpdDel('Finance/PopulateCashCumTrialConso',dt).subscribe(data=>{console.log(data)
      this.reportData=data
      this.dataSource=this.reportData
      // this.reportData.forEach(e=>{e.acc_cd.Sort((a, b)=>{return a.acc_cd - b.acc_cd})})
      if(this.reportData.length==0){
        this.comser.SnackBar_Nodata()
      }
      else{
        this.groupData();
      }
      this.modalRef.hide();
      this.isLoading=false
      
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
  groupData() {
    const grouped: any = {};
    
    this.grandTotals = {
      opng_dr: 0,
      opng_cr: 0,
      dr: 0,
      cr: 0,
      clos_dr: 0,
      clos_cr: 0,
    };
  
    this.reportData.forEach(item => {
      if (!grouped[item.acc_type_desc]) {
        grouped[item.acc_type_desc] = {
          schedules: {},
          accTypeTotals: {
            opng_dr: 0,
            opng_cr: 0,
            dr: 0,
            cr: 0,
            clos_dr: 0,
            clos_cr: 0,
          }
        };
      }
  
      if (!grouped[item.acc_type_desc].schedules[item.schedule_desc]) {
        grouped[item.acc_type_desc].schedules[item.schedule_desc] = {
          records: [],
          totals: {
            opng_dr: 0,
            opng_cr: 0,
            dr: 0,
            cr: 0,
            clos_dr: 0,
            clos_cr: 0,
          }
        };
      }
  
      const schedule = grouped[item.acc_type_desc].schedules[item.schedule_desc];
      schedule.records.push(item);
  
      // Calculate Schedule Totals
      schedule.totals.opng_dr += item.opng_dr;
      schedule.totals.opng_cr += item.opng_cr;
      schedule.totals.dr += item.dr;
      schedule.totals.cr += item.cr;
      schedule.totals.clos_dr += item.clos_dr;
      schedule.totals.clos_cr += item.clos_cr;
  
      // Calculate AccType Totals
      const accTypeTotals = grouped[item.acc_type_desc].accTypeTotals;
      accTypeTotals.opng_dr += item.opng_dr;
      accTypeTotals.opng_cr += item.opng_cr;
      accTypeTotals.dr += item.dr;
      accTypeTotals.cr += item.cr;
      accTypeTotals.clos_dr += item.clos_dr;
      accTypeTotals.clos_cr += item.clos_cr;
  
      // Calculate Grand Totals
      this.grandTotals.opng_dr += item.opng_dr;
      this.grandTotals.opng_cr += item.opng_cr;
      this.grandTotals.dr += item.dr;
      this.grandTotals.cr += item.cr;
      this.grandTotals.clos_dr += item.clos_dr;
      this.grandTotals.clos_cr += item.clos_cr;
    });
  
    this.groupedData = Object.keys(grouped).map(accType => ({
      accType,
      accTypeTotals: grouped[accType].accTypeTotals,
      schedules: Object.keys(grouped[accType].schedules).map(schedule => ({
        schedule,
        records: grouped[accType].schedules[schedule].records,
        totals: grouped[accType].schedules[schedule].totals
      }))
    }));
  }
  public oniframeLoad(): void {
     this.counter++;
     if(this.counter==2){
      this.counter=0;
      this.isLoading=false;
     }
     else{
      this.isLoading=true;
     }
    this.modalRef.hide();
  }
  public closeAlert() {
    this.showAlert = false;
  }
  //private pdfmake : pdfMake;
 


closeScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
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
  this.exportAsService.save(this.exportAsConfig, 'ConsoTrial').subscribe(() => {
    // save started
    console.log("hello")
  });
}
exportAsPDF() {
  const elementToPrint = document.getElementById('mattable'); // replace 'mattable' with the ID of your HTML div
  html2canvas(elementToPrint).then((canvas) => {
    const contentDataURL = canvas.toDataURL('image/png');
    const pdf = new jspdf('landscape', 'px', 'a4');
    const imgWidth = 610;
    const pageHeight = 250;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    let pageCount = 1;
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight-150;
      pdf.addPage();
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight+100; // add the gap height to the page height
      pageCount++;
    }
    pdf.save('cashcumtrial.pdf'); // replace 'cashcumtrial' with the desired filename
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
}


}
