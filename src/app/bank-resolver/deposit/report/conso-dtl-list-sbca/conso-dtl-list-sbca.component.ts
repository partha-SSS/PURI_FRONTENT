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
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';

@Component({
  selector: 'app-conso-dtl-list-sbca',
  templateUrl: './conso-dtl-list-sbca.component.html',
  styleUrls: ['./conso-dtl-list-sbca.component.css'],
  providers:[ExportAsService]
})
export class ConsoDtlListSbcaComponent {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  dataSource2 = new MatTableDataSource()
  
  displayedColumns: string[] = ['constitution'];
  displayedColumns2: string[] = ['SLNO','brn_cd','acc_num','cust_name','opening_dt','balance'];
  // displayedColumns7: string[] = ['constitution7'];
  // displayedColumns: string[] = ['acc_num','cust_name/guardian_name', 'opening_dt', 'balance'];
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
  printedId:any
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
  counter=0
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  pageLength=0
  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  clsdrSum=0;
  allconscount=0
  clscrSum=0;
  lastAccCD:any;
  today:any
  constitutionList: mm_constitution[] = [];
  constitutionListToBind: mm_constitution[] = [];
  lastcustcd: any;
  accType:any;
  constType:any;
  filteredArray:any=[]
  constructor(private comSer:CommonServiceService,private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, null],
      acc_type_cd: [null, Validators.required],
      constitution_cd: [{ disabled: true }]
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
    console.log(ConsoDtlListSbcaComponent.operations);

    this.isLoading = true;
    if (undefined !== ConsoDtlListSbcaComponent.operations &&
      null !== ConsoDtlListSbcaComponent.operations &&
      ConsoDtlListSbcaComponent.operations.length > 0) {
      this.isLoading = false;
      this.AcctTypes = ConsoDtlListSbcaComponent.operations.filter(e => e.module_type === 'DEPOSIT')
        .filter((thing, i, arr) => {
          return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
        });
      this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
    } else {
      this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
        res => {
          console.log(res)
          ConsoDtlListSbcaComponent.operations = res;
          this.isLoading = false;
          this.AcctTypes = ConsoDtlListSbcaComponent.operations.filter(e => e.module_type === 'DEPOSIT')
            .filter((thing, i, arr) => {
              return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
            });
          this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
          this.AcctTypes =this.AcctTypes.filter(e=>e.acc_type_cd==1 || e.acc_type_cd==8||e.acc_type_cd==7||e.acc_type_cd==9||e.acc_type_cd==10)
        },
        err => { this.isLoading = false; }
      );
    }
    console.log(this.AcctTypes);

  }
  onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
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
      },err => {
        this.isLoading = false;
        this.comSer.SnackBar_Error(); 
       }
    );
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  public onAccountTypeChange(): void {
    console.log(this.reportcriteria.controls.acc_type_cd.value)
    this.constitutionListToBind = null;
    this.reportcriteria.controls.constitution_cd.reset();
    if (+this.reportcriteria.controls.acc_type_cd.value > 0) {
      this.constitutionListToBind = this.constitutionList.filter(e =>
        e.acc_type_cd === (+this.reportcriteria.controls.acc_type_cd.value));
      this.reportcriteria.controls.constitution_cd.enable();
    }
  }
 sendData(){
  console.log(this.accType)
  
  this.accType=this.AcctTypes.filter(p=>p.acc_type_cd==this.reportcriteria.controls.acc_type_cd.value)[0].acc_type_desc
  // this.constType=this.constitutionList.filter(e=>e.constitution_cd==this.reportcriteria.controls.constitution_cd.value)[0].constitution_desc
  // console.log(this.reportcriteria.controls.constitution_cd.value+' '+this.reportcriteria.controls.acc_type_cd.value)
 }
  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.modalRef.hide()
      this.opdrSum=0
      this.allconscount=0
      this.isLoading=true
      var dt={
        'ardb_cd': this.sys.ardbCD,
         'brn_cd':  this.sys.BranchCode,
        'acc_type_cd' : this.reportcriteria.controls.acc_type_cd.value,
        // 'const_cd' : this.reportcriteria.controls.constitution_cd.value,
        'from_dt' : this.fromdate.toISOString()
      }
      this.printedId=(this.reportcriteria.controls.acc_type_cd.value=="7" && this.reportcriteria.controls.constitution_cd.value!='0')||
      (this.reportcriteria.controls.acc_type_cd.value=="1"  && this.reportcriteria.controls.constitution_cd.value!='0')||
      (this.reportcriteria.controls.acc_type_cd.value=="10"  && this.reportcriteria.controls.constitution_cd.value!='0')||
      (this.reportcriteria.controls.acc_type_cd.value=="8"  && this.reportcriteria.controls.constitution_cd.value!='0') ?"trial777":"trial111"
      this.svc.addUpdDel('Deposit/PopulateDLSavingsAllConso',dt).subscribe(data=>{
        this.sendData()
        console.log(data)
        this.reportData=data
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        if(this.reportcriteria.controls.constitution_cd.value!='0'){
          for(let i=0;i<this.reportData.length;i++){
            if(this.reportData[i]?.constype.constitution_cd==this.reportcriteria.controls.constitution_cd.value)
            {
              this.constType=this.reportData[i]?.constype.constitution_desc;
                this.opdrSum=this.reportData[i]?.constype.tot_cons_balance;
                this.allconscount=this.reportData[i]?.constype.tot_cons_count;
              this.dataSource2.data=this.reportData[i]?.ttsbcadtllist;
              debugger
            }
          }
        }
        else{
          for(let i=0;i<this.reportData.length;i++){
            this.opdrSum+=this.reportData[i].constype.tot_cons_balance
            this.allconscount+=this.reportData[i].constype.tot_cons_count
          }
          this.pageLength=this.reportData.length
          this.dataSource.data=this.reportData
          if(this.reportData.length<50){
            this.pagedItems=this.reportData
          }
        }
      this.isLoading=false
        
        this.modalRef.hide();
        this.lastcustcd=this.reportData[this.reportData.length-1].cust_cd
        // this.reportData.ttsbcadtllist.forEach(e=>{
        //   this.opdrSum+=e.balance;
         
        // })
      
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
      elementIdOrContent:this.printedId
    }
    this.exportAsService.save(this.exportAsConfig, 'Detail_List_SBCA').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource2.paginator = this.paginator;
    this.dataSource2.sort = this.sort;
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
    this.opdrSum=0

    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      this.opdrSum+=this.filteredArray[i].balance;
      // this.sumIntt+=this.filteredArray[i].intt_amt
     
    
      // this.crSum+=this.filteredArray[i].cr_amount
    }
  }
  
}

