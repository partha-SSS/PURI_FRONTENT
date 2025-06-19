import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer, mm_operation } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
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
  selector: 'app-acc-stmt-td',
  templateUrl: './acc-stmt-td.component.html',
  styleUrls: ['./acc-stmt-td.component.css'],
  providers:[ExportAsService]
})
export class AccStmtTDComponent implements OnInit,AfterViewInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['acc_num','intt_trf_type', 'trans_type','trans_dt','prn_amt'];
  AcctTypes: mm_operation[];

  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true, // disable backdrop click to close the modal
    class: 'modal-lg'
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
  toDate: Date;
  counter=0;
  suggestedCustomer: mm_customer[];
  disabledOnNull=true;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  public static operations: mm_operation[] = [];
  selectedAccType:string=''
  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  prnSum=0;
  penalSum=0;
  lastAccCD:any;
  today:any
  currSum=0
  clrSum=0
  cName:any
  cAddress:any
  cAcc:any
  showWait=false
  filteredArray:any=[]
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router, private comSer:CommonServiceService) { }
  ngOnInit(): void {
    // this.fromdate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      acct_num: [{ value: '', disabled: true }, Validators.required],
      acc_type_cd: [null, Validators.required]
    });
    this.getOperationMaster();
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }
  private getOperationMaster(): void {
    console.log(AccStmtTDComponent.operations);

    this.isLoading = true;
    if (undefined !== AccStmtTDComponent.operations &&
      null !== AccStmtTDComponent.operations &&
      AccStmtTDComponent.operations.length > 0) {
      this.isLoading = false;
      this.AcctTypes = AccStmtTDComponent.operations.filter(e => e.module_type === 'DEPOSIT')
        .filter((thing, i, arr) => {
          return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
        });
      this.AcctTypes =this.AcctTypes.filter(e=>e.acc_type_cd==2 || e.acc_type_cd==3||e.acc_type_cd==4||e.acc_type_cd==5)
      this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
    } else {
      this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
        res => {
          console.log(res)
          AccStmtTDComponent.operations = res;
          this.isLoading = false;
          this.AcctTypes = AccStmtTDComponent.operations.filter(e => e.module_type === 'DEPOSIT')
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
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  public onAccountTypeChange(): void {
    this.selectedAccType='';
    this.reportcriteria.controls.acct_num.setValue('');
    this.suggestedCustomer = null;
    if (+this.reportcriteria.controls.acc_type_cd.value > 0) {
      this.reportcriteria.controls.acct_num.enable();
    }
    this.selectedAccType=this.AcctTypes.filter(e=>e.acc_type_cd==this.reportcriteria.controls.acc_type_cd.value)[0]?.acc_type_desc
  }
  public suggestCustomer(): void {
    this.showWait=true
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = (+this.reportcriteria.controls.acc_type_cd.value);
      prm.as_cust_name = this.reportcriteria.controls.acct_num.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res;
          } else {
            this.suggestedCustomer = [];
          }
          this.showWait=false
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }
  onChangeNull(){
    this.suggestedCustomer = null

    if (this.reportcriteria.controls.acct_num.value.length > 0) 
      this.disabledOnNull=false
    else 
      this.disabledOnNull=true
  }
  public SelectCustomer(cust: any): void {
    this.cName=cust.cust_name
    this.cAddress=cust.present_address
    this.cAcc=cust.acc_num
    this.reportcriteria.controls.acct_num.setValue(cust.acc_num);
    this.fromdate = Utils.convertStringToDt(cust.opening_dt);
    this.toDate = this.sys.CurrentDate;
    this.suggestedCustomer = null;
  }

  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.currSum=0;
        this.clrSum=0
        this.prnSum=0;
        this.penalSum=0
      this.modalRef.hide()
      this.isLoading=true;
      this.reportData.length=0;
      this.pagedItems.length=0;

      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "acc_num":this.reportcriteria.controls.acct_num.value,
        "acc_type_cd":this.reportcriteria.controls.acc_type_cd.value,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString(),
        "renew_id": 0
      }
      this.svc.addUpdDel('Deposit/PopulateASFixedDeposit',dt).subscribe(data=>{console.log(data)
      this.reportData=data;
      if(!this.reportData){
        this.comSer.SnackBar_Nodata()
          this.isLoading=false
      } 
      this.dataSource.data=this.reportData
      // this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
      // if(this.reportData.length<50){
      //   this.pagedItems=this.reportData
      // }
      this.isLoading=false
      // this.pageChange=document.getElementById('chngPage');
      // this.pageChange.click()
      // this.setPage(2);
      // this.setPage(1)
      this.modalRef.hide();
      this.reportData.forEach(e=>{
        this.currSum+=e.curr_bal;
        this.clrSum+=e.clr_bal
        this.prnSum+=e.prn_amt;
        this.penalSum+=e.penal_amt
      })
      },
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
        })
      this.showAlert = false;
      // this.fromdate = this.reportcriteria.controls.fromDate.value;
      // this.toDate = this.reportcriteria.controls.toDate.value;
      // this.UrlString = this.svc.getReportUrl();
      // this.UrlString = this.UrlString + 'WebForm/Deposit/asfixed?'
      //   + 'ardb_cd=' + this.sys.ardbCD
      //   + '&acc_num=' + this.reportcriteria.controls.acct_num.value
      //   + '&acc_type_cd=' + (+this.reportcriteria.controls.acc_type_cd.value)
      //   + '&brn_cd=' + this.sys.BranchCode
      //   + '&from_dt=' + Utils.convertDtToString(this.fromdate)
      //   + '&to_dt=' + Utils.convertDtToString(this.toDate)
      //   + '&renew_id=0';
      // this.isLoading = true;
      // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 10000);
    }
  }
  public oniframeLoad(): void {
    this.counter++
    if(this.counter==2){
      this.counter=0;
      this.isLoading=false;

    }
    else{
      this.isLoading = true;

    }
    this.modalRef.hide();
  }
  public closeAlert() {
    this.showAlert = false;
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
    this.exportAsService.save(this.exportAsConfig, 'acc_statment_td').subscribe(() => {
      // save started
      console.log("hello")
    });
  }

  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
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
    this.currSum=0;
        this.clrSum=0
        this.prnSum=0;
        this.penalSum=0
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
    
      this.currSum+=this.filteredArray[i].curr_bal;
        this.clrSum+=this.filteredArray[i].clr_bal
        this.prnSum+=this.filteredArray[i].prn_amt;
        this.penalSum+=this.filteredArray[i].penal_amt
      // console.log(this.filteredArray[i].dr_amt)
    
      // this.crSum+=this.filteredArray[i].cr_amount
    }
  }
  
}
