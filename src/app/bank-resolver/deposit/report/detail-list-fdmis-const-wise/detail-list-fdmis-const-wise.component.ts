import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild ,AfterViewInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, mm_operation, p_report_param } from 'src/app/bank-resolver/Models';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { mm_constitution } from 'src/app/bank-resolver/Models/deposit/mm_constitution';
@Component({
  selector: 'app-detail-list-fdmis-const-wise',
  templateUrl: './detail-list-fdmis-const-wise.component.html',
  styleUrls: ['./detail-list-fdmis-const-wise.component.css'],
  providers:[ExportAsService]

})

export class DetailListFdmisConstWiseComponent implements OnInit,AfterViewInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  // displayedColumns: string[] = ['constitution_cd','acc_num','cust_name', 'opening_dt', 'mat_dt','instL_AMT','intT_RT','prN_AMT','proV_INTT_AMT'];
   displayedColumns: string[] = ['slNo','acc_num','cust_name', 'opening_dt', 'mat_dt','instL_AMT','prN_AMT','proV_INTT_AMT','intT_RT'];
   public static operations: mm_operation[] = [];
   AcctTypes: mm_operation[];
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  
  constitutionList: mm_constitution[] = [];
  constitutionListToBind: mm_constitution[] = [];
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
  filteredArray1:any=[]

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
  accType:any;
  selectAccType:any;
  ConstType:any;
  selectConstType:any;
  constructor(private comSer:CommonServiceService,private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService,
              private modalService: BsModalService, private _domSanitizer: DomSanitizer,private cd: ChangeDetectorRef,
              private router: Router) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, null],
      acc_type_cd: [null, Validators.required],
      constitution_cd: [{ disabled: true }, Validators.required]
    });
    this.getOperationMaster()
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
       this.getConstitutionList();
  }
  private getOperationMaster(): void {
    console.log(DetailListFdmisConstWiseComponent.operations);

    this.isLoading = true;
    if (undefined !== DetailListFdmisConstWiseComponent.operations &&
      null !== DetailListFdmisConstWiseComponent.operations &&
      DetailListFdmisConstWiseComponent.operations.length > 0) {
      this.isLoading = false;
      this.AcctTypes = DetailListFdmisConstWiseComponent.operations.filter(e => e.module_type === 'DEPOSIT')
        .filter((thing, i, arr) => {
          return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
        });
      this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
    } else {
      this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
        res => {
          console.log(res)
          DetailListFdmisConstWiseComponent.operations = res;
          this.isLoading = false;
          this.AcctTypes = DetailListFdmisConstWiseComponent.operations.filter(e => e.module_type === 'DEPOSIT')
            .filter((thing, i, arr) => {
              return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
            });
          this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
          this.AcctTypes =this.AcctTypes.filter(e=>e.acc_type_cd==2 || e.acc_type_cd==3||e.acc_type_cd==4||e.acc_type_cd==5)
        },
        err => { this.isLoading = false; }
      );
    }
    console.log(this.AcctTypes);

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
      'from_dt' : this.fromdate.toISOString(),
      'acc_type_cd' : this.reportcriteria.controls.acc_type_cd.value,
      'const_cd' : this.reportcriteria.controls.constitution_cd.value,
      }
      this.svc.addUpdDel('Deposit/PopulateDLFixedDeposit',dt).subscribe(data=>{
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
  sendData(){
    console.log(this.accType)
    this.accType=this.reportcriteria.controls.acc_type_cd.value == '2'?'Fixed Deposit':(this.reportcriteria.controls.acc_type_cd.value == '3'?'DBS':this.reportcriteria.controls.acc_type_cd.value == '4'?'Term Deposit':'MIS')
  //  this.ConstType=this.constitutionListToBind.filter(x=>x.constitution_cd=this.reportcriteria.controls.constitution_cd.value)
  //  this.selectConstType=this.ConstType.constitution_desc
  //  this.selectAccType=this.accType;
  //  console.log(this.ConstType,this.selectAccType,this.selectConstType);
   
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
        this.constitutionList = Utils.ChkArrNotEmptyRetrnEmptyArr(res);
      },
      err => { // ;
      }
    );
  }
  public onAccountTypeChange(): void {
    this.constitutionListToBind = null;
    this.reportcriteria.controls.constitution_cd.reset();
    if (+this.reportcriteria.controls.acc_type_cd.value > 0) {
      this.constitutionListToBind = this.constitutionList.filter(e =>
        e.acc_type_cd === (+this.reportcriteria.controls.acc_type_cd.value));
      this.reportcriteria.controls.constitution_cd.enable();
    }
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
    this.exportAsService.save(this.exportAsConfig, 'Detail_List_FDMIS_Const').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter1(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    // this.bName=(event.target as HTMLInputElement).value
    this.filteredArray=this.reportData
    console.log(filterValue)
    console.log(
      this.filteredArray.filter(e=>e.cust_name?.toLowerCase()==filterValue.toLowerCase())
    )
    if(filterValue.length>0){
      this.filteredArray1=this.filteredArray.filter(e=>e.cust_name?.toLowerCase()==(filterValue.toLowerCase())==true)
      console.log(this.filteredArray1)
      this.dataSource.data=this.filteredArray1
      this.getTotal()
    }
    else{
      this.dataSource.data=this.reportData
      this.getTotal()
    }
    

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
