import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param } from 'src/app/bank-resolver/Models';
import { mm_constitution } from 'src/app/bank-resolver/Models/deposit/mm_constitution';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';

@Component({
  selector: 'app-detail-dds',
  templateUrl: './detail-dds.component.html',
  styleUrls: ['./detail-dds.component.css']
})
export class DetailDDSComponent implements OnInit,AfterViewInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  // displayedColumns: string[] = ['acc_num','cust_name', 'opening_dt', 'mat_dt','prN_AMT'];
  displayedColumns: string[] = ['constitution'];
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
  todate: Date;
  constitutionList: mm_constitution[] = [];
  constitutionListToBind: mm_constitution[] = [];
  counter=0
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
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
  prnamt=0
  prvamt=0
  accType:any;
  constType:any;
  lastOne:any
  lastTwo:any
  lastThree:any
  lastFour:any
  pageLength=0
  constructor(private comSer:CommonServiceService,private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService,
              private modalService: BsModalService, private _domSanitizer: DomSanitizer,private cd: ChangeDetectorRef,
              private router: Router) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, null],
      // acc_type_cd: [null, Validators.required],
      constitution_cd: [{ disabled: true }, Validators.required]
    });
    this.getConstitutionList();
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
       this.counter=0;
  }
  onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  sendData(){
    console.log(this.constitutionList)
    this.accType='DDS'
    console.log(this.constitutionList.filter(e=>e.constitution_cd==this.reportcriteria.controls.constitution_cd.value && e.acc_type_cd==11)[0])
    this.constType=this.constitutionList.filter(e=>e.constitution_cd==this.reportcriteria.controls.constitution_cd.value && e.acc_type_cd==11)[0].constitution_desc
    // console.log(this.reportcriteria.controls.constitution_cd.value+' '+this.reportcriteria.controls.acc_type_cd.value)
   }
  getConstitutionList() {
    if (undefined !== this.constitutionList &&
      null !== this.constitutionList &&
      this.constitutionList.length > 0) {
      return;
    }

    this.constitutionList = [];
    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
      res => {
        console.log(res)
        this.constitutionList = Utils.ChkArrNotEmptyRetrnEmptyArr(res);
    this.onAccountTypeChange()

      },err => {
        this.isLoading = false;
        this.comSer.SnackBar_Error(); 
       }
    );
  }

public onAccountTypeChange(): void {
    this.constitutionListToBind = null;
    console.log(this.constitutionList)
    this.reportcriteria.controls.constitution_cd.reset();
    console.log(this.constitutionList.filter(e =>e.acc_type_cd === 11))
      this.constitutionListToBind = this.constitutionList.filter(e =>e.acc_type_cd === 11);
      this.reportcriteria.controls.constitution_cd.enable();
  }
  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else {
      this.prvamt=0;
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.modalRef.hide();
      this.isLoading=true
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      var dt={
        'ardb_cd': this.sys.ardbCD,
        'brn_cd' : this.sys.BranchCode,
        'acc_type_cd' : 11,
        'const_cd' : this.reportcriteria.controls.constitution_cd.value,
        'from_dt' : this.fromdate.toISOString()
      }
      this.svc.addUpdDel('Deposit/PopulateDLDds',dt).subscribe(data=>{
        console.log(data)
        this.reportData=data
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.pageLength=this.reportData.length
        this.dataSource.data=this.reportData
        this.isLoading=false
        this.modalRef.hide();
        this.reportData.forEach(e=>{
          this.prvamt+=e.tot_prn
          this.counter+=e.tot_count
        })
       
      }),err => {
        this.isLoading = false;
        this.comSer.SnackBar_Error(); 
       }
    }
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
    this.exportAsService.save(this.exportAsConfig, 'Detail_List_DDS').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

 
  
  
}
