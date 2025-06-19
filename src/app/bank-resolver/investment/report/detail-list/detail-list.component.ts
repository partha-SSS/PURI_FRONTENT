import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, mm_acc_type, p_report_param } from 'src/app/bank-resolver/Models';
import { mm_constitution } from 'src/app/bank-resolver/Models/deposit/mm_constitution';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.css'],
  providers:[ExportAsService]

})
export class IDetailListComponent implements OnInit,AfterViewInit  {

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  
  displayedColumns: string[] = ['constitution'];

  // displayedColumns: string[] = ['acc_num','cust_name', 'opening_dt', 'mat_dt','instL_AMT','intT_RT','prN_AMT','proV_INTT_AMT'];

  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  accountTypeList: mm_acc_type[] = [];
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
  constitutionList: mm_constitution[] = [];
  constitutionListToBind: mm_constitution[] = [];
  counter=0
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  filteredArray:any=[]
  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  clsdrSum=0;
  clscrSum=0;
  lastAccCD:any;
  lastCustCD:any
  today:any
  totprnamt=0
  totinttamt=0
  totProvinttamt=0
  totmatamt=0
  prvamt=0
  insamt=0
  pageLength=0
  accType:any;
  allconscount=0
  constType:any;
  lastOne:any
  lastTwo:any
  lastThree:any
  lastFour:any

  exportConfig: ExportAsConfig = {
    type: 'xlsx',
    elementIdOrContent: 'exportTable',
    fileName: 'ExportedData',
  };
  constructor(private comSer:CommonServiceService,private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService,
              private modalService: BsModalService, private _domSanitizer: DomSanitizer,private cd: ChangeDetectorRef,
              private router: Router) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required]
    
      // constitution_cd: [{ disabled: true }, Validators.required]
    });
    this.getAccountTypeList();
    this.getConstitutionList();
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }
  getAccountTypeList() {

    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];
    var dt={
      "ardb_cd":this.sys.ardbCD
    }
    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', dt).subscribe(
      res => {
      
        this.accountTypeList = res;
        // this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'I');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {

      }
    );
  }
  onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  // sendData(data:any){
  //   console.log(this.accType)
  //   this.accType=this.reportcriteria.controls.acc_type_cd.value == '22'?'Fixed Deposit':(this.reportcriteria.controls.acc_type_cd.value == '23'?'Cash Cirtificate':this.reportcriteria.controls.acc_type_cd.value == '24'?'Monthly Income Scheme':'Recurring Deposit')
  //  }
  getConstitutionList() {
    if (undefined !== this.constitutionList &&
      null !== this.constitutionList &&
      this.constitutionList.length > 0) {
      return;
    }

    this.constitutionList = [];
    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
      res => {
        this.constitutionList = Utils.ChkArrNotEmptyRetrnEmptyArr(res);
      },
      err => { // ;
      }
    );
  }


  public SubmitReport() {
    debugger;
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.allconscount=0
      this.opdrSum=0;
      this.insamt=0;
      this.totprnamt=0;
      this.totinttamt=0;
      this.totProvinttamt=0;
      this.totmatamt=0;
      this.prvamt=0
      this.modalRef.hide();
      this.isLoading=true;
      var dt={
        'ardb_cd': this.sys.ardbCD,
        'brn_cd' : this.sys.BranchCode,
        'from_dt' : this.fromdate.toISOString()
      }
      this.svc.addUpdDel('Investment/PopulateDLFixedDepositInvAll',dt).subscribe(data=>{
        console.log(data)
        this.reportData=data
        if(this.reportData.length==0){
          this.comSer.SnackBar_Nodata()
        } 
        // this.sendData(data);

        for(let i=0;i<this.reportData.length;i++){
          for(let j=0;j<this.reportData[i].ttsbcadtllist.length;j++){
            this.reportData[i].ttsbcadtllist[j].acc_type_desc=this.accountTypeList.filter(e=>e.acc_type_cd==this.reportData[i].ttsbcadtllist[j].acc_type_cd)[0].acc_type_desc
          }
          this.totprnamt+=this.reportData[i].constype.tot_cons_balance
          this.totinttamt+=this.reportData[i].constype.tot_cons_intt_balance
          this.totProvinttamt+=this.reportData[i].constype.tot_cons_mat_intt_balance
          this.allconscount+=this.reportData[i].constype.tot_cons_count
        }
        this.totmatamt=this.totprnamt+this.totProvinttamt

        this.pageLength=this.reportData.length
        this.dataSource.data=this.reportData
        if(this.reportData.length<50){
          this.pagedItems=this.reportData
        }
        this.isLoading=false
       
      }),err => {
        this.isLoading = false;
        this.comSer.SnackBar_Error(); 
       }
    }
  }
  exportToExcel() {
    const exportData: any[] = [];

    this.reportData.forEach(group => {
      group.ttsbcadtllist.forEach(item => {
        exportData.push({
          Bank: group.constype.bank_cd,
          Branch: group.constype.branch_cd,
          Constitution: group.constype.constitution_desc,
          AccountNumber: item.acc_num,
          PrincipalAmount: item.prN_AMT,
          Interest: item.proV_INTT_AMT,
          MaturityInterest: item.intt_amt,
          InterestRate: item.intT_RT,
          OpeningDate: item.opening_dt,
          MaturityDate: item.mat_dt
        });
      });
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Accounts': worksheet },
      SheetNames: ['Accounts']
    };
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const fileName = `DetailList_${new Date().toISOString()}.xlsx`;
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName);
  }
  public oniframeLoad(): void {
    this.counter++
    if(this.counter==2){
      this.isLoading = false;
      this.counter=0
    }
    else{
      this.isLoading=true
    }
    this.modalRef.hide();
  }
  public closeAlert() {
    this.showAlert = false;
  }


  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  //   this.getTotal()
  // }
  // getTotal(){
  //   this.opdrSum=0;
  //   this.insamt=0;
  //   this.totprnamt=0;
  //   this.prvamt=0
  //   this.filteredArray=this.dataSource.filteredData
  //   for(let i=0;i<this.filteredArray.length;i++){
  //     this.opdrSum+=this.filteredArray[i].balance;
  //     this.insamt+=this.filteredArray[i].instL_AMT
  //     this.totprnamt+=this.filteredArray[i].prN_AMT;
  //     this.prvamt+=this.filteredArray[i].proV_INTT_AMT
      
  //   }
  // }


}
