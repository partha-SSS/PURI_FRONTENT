import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild ,AfterViewInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param } from 'src/app/bank-resolver/Models';
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
  selector: 'app-conso-dtl-list-rd',
  templateUrl: './conso-dtl-list-rd.component.html',
  styleUrls: ['./conso-dtl-list-rd.component.css'],
  providers:[ExportAsService]
})
export class ConsoDtlListRdComponent {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['brn_cd','constitution_cd','acc_num','cust_name', 'opening_dt', 'mat_dt','instL_AMT','intT_RT','prN_AMT','proV_INTT_AMT'];

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
  isLoading = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  counter=0
  todate: Date;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  filteredArray:any=[]
  pageChange: any;
  suminstL_AMT=0;
  opcrSum=0;
  sumprN_AMT=0;
  sumproV_INTT_AMT=0;
  clsdrSum=0;
  clscrSum=0;
  lastAccCD:any;
  today:any
  pageLength=0;
  constructor(private comSer:CommonServiceService,private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService,
              private modalService: BsModalService, private _domSanitizer: DomSanitizer,private cd: ChangeDetectorRef,
              private router: Router) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, null]
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

  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.modalRef.hide();

      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.modalRef.hide();
      this.isLoading=true;
      this.suminstL_AMT=0
      this.sumprN_AMT=0
      this.sumproV_INTT_AMT=0
      var dt={
      'ardb_cd' : this.sys.ardbCD,
      'brn_cd' : this.sys.BranchCode,
      'from_dt' : this.fromdate.toISOString()
      }
      this.svc.addUpdDel('Deposit/PopulateDLRecuringConso',dt).subscribe(data=>{
        console.log(data)
        this.reportData=data
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.pageLength=this.reportData.length
        this.dataSource.data=this.reportData
        if(this.reportData.length<50){
          this.pagedItems=this.reportData
        }
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
  
        this.isLoading=false
        this.pageChange=document.getElementById('chngPage');
        this.pageChange.click()
        this.setPage(2);
        this.setPage(1)
        // this.lastcustcd=this.reportData[this.reportData.length-1].cust_cd
        this.reportData.forEach(e=>{
          this.suminstL_AMT+=e.instL_AMT
          this.sumprN_AMT+=e.prN_AMT
          this.sumproV_INTT_AMT+=e.proV_INTT_AMT
         
        })
      
      }),err => {
        this.isLoading = false;
        this.comSer.SnackBar_Error(); 
        
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
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'trial111'
    }
    this.exportAsService.save(this.exportAsConfig, 'Detail_List_RD').subscribe(() => {
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
    this.suminstL_AMT=0
    this.sumprN_AMT=0
    this.sumproV_INTT_AMT=0
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      this.suminstL_AMT+=this.filteredArray[i].instL_AMT
      this.sumprN_AMT+=this.filteredArray[i].prN_AMT
      this.sumproV_INTT_AMT+=this.filteredArray[i].proV_INTT_AMT
      // console.log(this.filteredArray[i].dr_amt)
    
      // this.crSum+=this.filteredArray[i].cr_amount
    }
  }
}

