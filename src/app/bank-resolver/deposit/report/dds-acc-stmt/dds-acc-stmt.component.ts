import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, mm_customer } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-dds-acc-stmt',
  templateUrl: './dds-acc-stmt.component.html',
  styleUrls: ['./dds-acc-stmt.component.css'],
  providers:[ExportAsService]
})
export class DdsAccStmtComponent implements OnInit ,AfterViewInit{
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['paid_dt','paid_amt','bal'];
  allAgent:any[]=[];
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
  reportcriteria: FormGroup;
  showAlert = false;
  isLoading = false;
  alertMsg = '';
  fromdate: Date;
  toDate: Date;
  suggestedCustomer: mm_customer[];
  disabledOnNull=true;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  filteredArray:any=[]
  total_bal:any;
  clsdrSum=0;
  clscrSum=0;
  lastAccCD:any;
  today:any
  cName:any
  cAddress:any
  cAcc:any
  agentCD:any
  opening_bal:any
  showWait=false
  constructor(private svc: RestService, private formBuilder: FormBuilder, private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef, private router: Router, private comSer:CommonServiceService) { }
  ngOnInit(): void {
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      acct_num: [null, Validators.required],
    });
    this.GetAgentData();
    this.onLoadScreen(this.content);
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today= n + " "+ time
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  public onAccountTypeChange(): void {
    this.reportcriteria.controls.acct_num.setValue('');
    this.suggestedCustomer = null;
    if (+this.reportcriteria.controls.acc_type_cd.value > 0) {
      this.reportcriteria.controls.acct_num.enable();
    }
  }
  onChangeNull(){
    this.suggestedCustomer = null
    if (this.reportcriteria.controls.acct_num.value.length > 0) 
      this.disabledOnNull=false
    else 
      this.disabledOnNull=true
  }

  GetAgentData(){
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "brn_cd":this.sys.BranchCode
    }
    this.svc.addUpdDel<any>('Deposit/GetAgentData', dt).subscribe(
      res => {
        this.allAgent=res;
      })
  }
  public suggestCustomer(): void {
    this.isLoading=true;
    this.showWait=true
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = 11;
      prm.as_cust_name = this.reportcriteria.controls.acct_num.value.toLowerCase();
      debugger
      this.svc.addUpdDel<any>('Deposit/GetAccDtlsAll', prm).subscribe(
        res => {
          this.isLoading=false
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
      this.isLoading=false
      this.suggestedCustomer = null;
    }
  }
  public SelectCustomer(cust: any): void {
    console.log(cust)
    this.cName = cust.cust_name
    this.cAddress = cust.present_address
    this.cAcc = cust.acc_num
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
      this.opcrSum=0
      this.opdrSum=0
      this.total_bal=0
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true;
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      console.log(this.fromdate.toDateString()+" "+this.toDate.toDateString())
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "acc_num":this.reportcriteria.controls.acct_num.value,
        "acc_type_cd":11,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString()
      }
      this.svc.addUpdDel('Deposit/PopulateASDds',dt).subscribe(data=>{console.log(data)
      this.reportData=data;
      console.log(this.reportData[0].clr_bal);
      if(!this.reportData){
        this.comSer.SnackBar_Nodata()
          this.isLoading=false
      } 

      let balance = this.reportData[this.reportData.length - 1].clr_bal;
    for (let i = this.reportData.length - 1; i >= 0; i--) {
      this.reportData[i]['balance'] = balance;
      balance -= this.reportData[i].paid_amt;
    }
      // this.total_bal=this.reportData[0].clr_bal
      // for(let i=0;i<this.reportData.length;i++){
      //   if(i==0){
      //     this.reportData[i].clr_bal=this.reportData[i].paid_amt
      //   }
      //   else{
      //     this.reportData[i].clr_bal=this.reportData[i-1].clr_bal;
      //     this.reportData[i].clr_bal+=this.reportData[i].paid_amt;
      //   }
      // }
      // this.reportData.forEach(e=>{
      //   if(e==0){
      //     e.clr_bal=e.paid_amt
      //   }
      //   else{
      //     e.clr_bal=(e.length-1).clr_bal
      //     +=e.paid_amt
      //   }
        
      // })
      
      this.dataSource.data=this.reportData
      this.agentCD=this.allAgent.filter(e=>e.agent_cd==this.reportData[0].agent_cd)[0].agent_name
      this.opening_bal=this.reportData[0].opng_bal;
      // this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
      this.isLoading=false
      // if(this.reportData.length<50){
      //   this.pagedItems=this.reportData
      // }
      // this.pageChange=document.getElementById('chngPage');
      // this.pageChange.click()
      // this.setPage(2);
      // this.setPage(1);
      this.modalRef.hide();
      
      },
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
        }
)
      this.showAlert = false;
   }
  }
  public closeAlert() {
    this.showAlert = false;
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); 
    console.log(this.pagedItems)
    this.cd.detectChanges();
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
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'trial111'
    }
    this.exportAsService.save(this.exportAsConfig, 'acc_statment_dds').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  getTotal(){
    this.opcrSum=0
    this.opdrSum=0
    this.total_bal=0
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
    
      this.total_bal+=this.filteredArray[i].paid_amt
        this.opdrSum+=this.filteredArray[i].dr_amt
      // console.log(this.filteredArray[i].dr_amt)
    
      // this.crSum+=this.filteredArray[i].cr_amount
    }
  }
  
}
