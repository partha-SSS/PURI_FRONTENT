import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, mm_operation, p_report_param } from 'src/app/bank-resolver/Models';
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
@Component({
  selector: 'app-conso-dtl-list-fd-mis',
  templateUrl: './conso-dtl-list-fd-mis.component.html',
  styleUrls: ['./conso-dtl-list-fd-mis.component.css'],
  providers:[ExportAsService]
})
export class ConsoDtlListFdMisComponent {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  
  displayedColumns: string[] = ['constitution'];
  public static operations: mm_operation[] = [];
  AcctTypes: mm_operation[];
  // displayedColumns: string[] = ['acc_num','cust_name', 'opening_dt', 'mat_dt','instL_AMT','intT_RT','prN_AMT','proV_INTT_AMT'];
  totprovIntt:number=0;
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
  prvamt=0
  insamt=0
  pageLength=0
  accType:any;
  allconscount=0
  constType:any;
  lastOne:any
  lastTwo:any
  lastThree:any
  lastFour:any;
  mergedArray:any[]=[];
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
      // constitution_cd: [{ disabled: true }, Validators.required]
    });
    this.getOperationMaster();
    this.getConstitutionList();
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }
  private getOperationMaster(): void {
    console.log(ConsoDtlListFdMisComponent.operations);

    this.isLoading = true;
    if (undefined !== ConsoDtlListFdMisComponent.operations &&
      null !== ConsoDtlListFdMisComponent.operations &&
      ConsoDtlListFdMisComponent.operations.length > 0) {
      this.isLoading = false;
      this.AcctTypes = ConsoDtlListFdMisComponent.operations.filter(e => e.module_type === 'DEPOSIT')
        .filter((thing, i, arr) => {
          return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
        });
      this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
    } else {
      this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
        res => {
          console.log(res)
          ConsoDtlListFdMisComponent.operations = res;
          this.isLoading = false;
          this.AcctTypes = ConsoDtlListFdMisComponent.operations.filter(e => e.module_type === 'DEPOSIT')
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
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  sendData(){
    console.log(this.accType)
    this.accType=this.reportcriteria.controls.acc_type_cd.value == '2'?'Fixed Deposit'
    :(this.reportcriteria.controls.acc_type_cd.value == '3'?'DBS'
    :this.reportcriteria.controls.acc_type_cd.value == '4'?this.sys.ardbCD=='4'?'Term Deposit':'Cash Certificate'
    :'MIS')
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
      this.totprovIntt=0
      this.modalRef.hide();
      this.isLoading=true;
      var dt={
        'ardb_cd': this.sys.ardbCD,
        'brn_cd' : this.sys.BranchCode,
        'acc_type_cd' : this.reportcriteria.controls.acc_type_cd.value,
        // 'const_cd' : this.reportcriteria.controls.constitution_cd.value,
        'from_dt' : this.fromdate.toISOString()
      }
      this.svc.addUpdDel('Deposit/PopulateDLFixedDepositAllConso',dt).subscribe(data=>{
        console.log(data)
        this.reportData=data;
        this.mergedArray = this.mergeTtsbcadtllist(this.reportData);
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.sendData();

        for(let i=0;i<this.reportData.length;i++){
          this.totprnamt+=this.reportData[i].constype.tot_cons_balance;
          this.allconscount+=this.reportData[i].constype.tot_cons_count;
          this.totprovIntt+=this.reportData[i].constype.tot_cons_intt_balance;
        }
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
      type: 'xlsx', 
      elementIdOrContent:'trial000'
    }
    this.exportAsService.save(this.exportAsConfig, 'Detail_List_FDMIS_Conso').subscribe(() => {
     console.log("hello")
    });
  }
  mergeTtsbcadtllist(reportdata: any[]): any[] {
    // Use reduce to iterate through the main array and merge ttsbcadtllist into a single array
    const mergedArr = reportdata.reduce((accumulator, current) => {
        if (current.ttsbcadtllist) {
            // Concatenate the current ttsbcadtllist with the accumulator
            return accumulator.concat(current.ttsbcadtllist);
        }
        return accumulator;
    }, []); // Start with an empty array
    return mergedArr;
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
