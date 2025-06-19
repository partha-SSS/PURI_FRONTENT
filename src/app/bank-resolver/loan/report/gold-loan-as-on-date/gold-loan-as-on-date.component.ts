import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_operation } from 'src/app/bank-resolver/Models';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-gold-loan-as-on-date',
  templateUrl: './gold-loan-as-on-date.component.html',
  styleUrls: ['./gold-loan-as-on-date.component.css'],
  providers:[ExportAsService]
})
export class GoldLoanAsOnDateComponent implements OnInit {

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
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
  resultLength=0
  filteredArray:any=[]
ownFund:any[]=[]
broFund:any[]=[]
  AcctTypes: mm_operation[];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = true;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  counter=0;
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  // todate: Date;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  reportData2:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName

  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  clsdrSum=0;
  clscrSum=0;
  lastAccCD:any;
  today:any
  cName:any
  cAddress:any
  cAcc:any
  lastAccNum:any
  tot_gross_we:any
  tot_net_we:any;
  tot_gold_value:any;
  tot_disb_amt:any;
  tot_tot_prn:any;
  tot_curr_intt:any;
  bName=''
  selectedValue=''
  selectedValue1=''
  firstGroup:any=[]
  secondGroup:any=[]
  loanNm:any;
  inputEl:any
  bName1=''
  filteredArray1:any=[]
  fundTypeButton:boolean=true;

  // displayedColumns: string[] = ['block_name','acc_name','party_name', 'acc_num', 'list_dt', 'curr_intt_rate','ovd_intt_rate','curr_prn','ovd_prn','plus','curr_intt','ovd_intt','computed_till_dt'];
  displayedColumns: string[] = ['SL_NO','member_name','loan_id','intt_rt','gross_we', 'net_we', 'gold_value','disb_amt','tot_prn','curr_intt','last_intt_calc_dt','v_page'];
  dataSource = new MatTableDataSource()
  searchfilter= new MatTableDataSource()

  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router, private comSer:CommonServiceService) { }
  ngOnInit(): void {
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fromdate = this.sys.CurrentDate;
    // this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required]
    });
     
    this.onLoadScreen(this.content);
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today= n + " "+ time
    this.isLoading=false

  }
 onLoadScreen(content) {
  
    this.modalRef = this.modalService.show(content, this.config);
  }
 
 
 
  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else {
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true;
      this.tot_gross_we=0;
      this.tot_net_we=0;
      this.tot_gold_value=0;
      this.tot_disb_amt=0;
      this.tot_tot_prn=0;
      this.tot_curr_intt=0;
      // this.loanNm=this.AcctTypes.filter(e=>e.acc_type_cd==this.reportcriteria.controls.acc_type_cd.value)[0].acc_type_desc
      // console.log(this.loanNm)
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "adt_dt":this.fromdate.toISOString()
      }
      this.svc.addUpdDel('Loan/PopulateGoldLoanDetailsAsOnDate',dt).subscribe(data=>{console.log(data)
        this.reportData=data
        this.reportData2=data
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
        // if(this.reportData.length<50){
        //   this.pagedItems=this.reportData
        // }
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.dataSource.data=this.reportData
        // for(let i=0;i<50;i++)
        // this.dataSource.data.push(this.reportData)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.resultLength=this.reportData.length
        // this.pageChange=document.getElementById('chngPage');
        // this.pageChange.click()
        // this.setPage(2);
        // this.setPage(1)
        // this.modalRef.hide();
        this.lastAccNum=this.reportData[this.reportData.length-1].acc_num

        for (const item of this.reportData) {
          const grossWeValue = parseFloat(item.gross_we);
          const netWeValue = parseFloat(item.net_we);
          const goldValue = parseFloat(item.gold_value);
          const disbAmt = parseFloat(item.disb_amt);
          const totPrn = parseFloat(item.tot_prn);
          const currIntt = parseFloat(item.curr_intt);
          if (!isNaN(grossWeValue)) {
            this.tot_gross_we += grossWeValue;
          }
          if (!isNaN(netWeValue)) {
            this.tot_net_we += netWeValue;
          }
          if (!isNaN(goldValue)) {
            this.tot_gold_value += goldValue;
          }
          if (!isNaN(disbAmt)) {
            this.tot_disb_amt += disbAmt;
          }
          if (!isNaN(totPrn)) {
            this.tot_tot_prn += totPrn;
          }
          if (!isNaN(currIntt)) {
            this.tot_curr_intt += currIntt;
          }
        }
        debugger
      },err => {
        this.isLoading = false;
        this.comSer.SnackBar_Error(); 
       })
    }
  }
  // public oniframeLoad(): void {
  //   this.counter++;
  //   this.isLoading = true;
  //   if(this.counter==2){
  //     this.isLoading=false;
  //     this.counter=0;
  //   this.modalRef.hide();
  // }}
  public closeAlert() {
    this.showAlert = false;
  }
  takeLoanVal(e:any){
    console.log(e)
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
    this.exportAsService.save(this.exportAsConfig, 'Gold_Loan_Rep_ason').subscribe(() => {
      // save started
      console.log("xlsx")
    });
  }
  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }

  // applyFilter1(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.searchfilter.filter = filterValue.trim().toLowerCase();
  //   this.dataSource.data=this.searchfilter.filteredData
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  //   this.getTotal()
  // }
  
  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getTotal()


  }
  
  getTotal(){
    
    this.tot_gross_we=0;
    this.tot_net_we=0;
    this.tot_gold_value=0;
    this.tot_disb_amt=0;
    this.tot_tot_prn=0;
    this.tot_curr_intt=0;
    
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    this.filteredArray.forEach(e => {
    this.tot_gross_we+=parseFloat(e.gross_we);
    this.tot_net_we+=parseFloat(e.net_we);
    this.tot_gold_value+=parseFloat(e.gold_value);
    this.tot_disb_amt+=parseFloat(e.disb_amt);
    this.tot_tot_prn+=parseFloat(e.tot_prn);
    this.tot_curr_intt+=parseFloat(e.curr_intt);
    });
  }
 
}
