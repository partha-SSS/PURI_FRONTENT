import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { sm_parameter } from 'src/app/bank-resolver/Models/sm_parameter';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { mm_activity } from 'src/app/bank-resolver/Models/loan/mm_activity';
@Component({
  selector: 'app-demand-notice-block-wise',
  templateUrl: './demand-notice-block-wise.component.html',
  styleUrls: ['./demand-notice-block-wise.component.css'],
  providers:[DatePipe]
})
export class DemandNoticeBlockWiseComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  activityList: mm_activity[] = [];

  systemParam: sm_parameter[] = [];

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
  counter=0;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  toDate: Date;
  suggestedCustomer: mm_customer[];
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  reportData2:any=[]
  ardbName=localStorage.getItem('ardb_name')
  ardbcd=localStorage.getItem('__ardb_cd')
  branchName=this.sys.BranchName
  joinHold:any=[];
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
  currInttSum=0
  ovdInttSum=0
  ovdPrnSum=0
  currPrnSum=0
  totPrn=0;
  penalInttSum=0;
  loanNm:any;
  lastLoanID:any
  totalSum=0;
  displayedColumns: string[] = ['acc_cd'];
  dataSource = new MatTableDataSource()
  resultLength=0;
  translatedData:any
  numData:any
  intt=3425
  calc=''
  convertDt:any;
  converDttoDt=''
  convertDtFrm=''
  getArdb:any=[]
  disabledOnNull = true;
  loanId: any;
  custNm:any;
  addr:any;
  accCD:any;
  gName:any
  showWait=false
  notvalidate:boolean=false;
  date_msg:any;
  vilcode:any='';
  blocks:any[]=[];
  blocks1:any[]=[];
  AcctTypes:any[]=[];
  villages:any[]=[];
  villages1:any[]=[];
  allServiceArea:any[]=[];
  lastDate:any
  filteredOptions: Observable<string[]>;
  constructor(private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer, private rstSvc:RestService, private datePipe:DatePipe,
    private router: Router, private comSer: CommonServiceService) { }
  ngOnInit(): void {
    this.getActivityList();
    this.getBlock();
    this.getVillageMaster();
    this.getAccountTypeList();
    this.GetServiceAreaMaster();
    var dt={"ardb_cd":this.sys.ardbCD}
    this.rstSvc.getlbr(environment.ardbBanglaUrl,null).subscribe(res=>{
      console.log(res)
      this.getArdb=res
      this.getArdb=this.getArdb.filter(e=>e.ardB_CD==this.sys.ardbCD)[0].trans
      console.log(this.getArdb)
    }
    )
    this.rstSvc.getlbr(environment.numUrl,null).subscribe(data=>{
      this.numData=data;
     console.log(this.numData)
        for(let j=0;j<this.intt.toString().length;j++){
          this.calc+=this.numData[(+this.intt.toString().charAt(j))]
  
      }
      console.log(this.calc)
      
    })
    this.rstSvc.getlbr(environment.transUrl,null).subscribe(data=>{
      // console.log(data)
      console.log(data)
      this.translatedData=data
      // this.menuConfigs=data;
    })
   
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      acc_cd: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      block: [null, Validators.required],
      activity_cd: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
    this.lastDate = localStorage.getItem('__lastDt');

  }
  getActivityList() {

    if (this.activityList.length > 0) {
      return;
    }
    this.activityList = [];

    this.svc.addUpdDel<any>('Mst/GetActivityMaster', null).subscribe(
      res => {

        this.activityList = res;
        this.activityList = this.activityList.sort((a, b) => (a.activity_cd > b.activity_cd) ? 1 : -1);
        debugger
      },
      err => {

      }
    );

  }
  ActivityChange(i:any){
  
  }
  setVill(){
    this.vilcode='';
    this.vilcode=this.villages.filter(option => option.vill_name.toLowerCase()==this.reportcriteria.controls.vill_cd.value.toLowerCase())[0].vill_cd;
  if(this.vilcode.length>0){
    this.getBlockName()
  }
  }
  filterVill(){
    debugger
    this.filteredOptions = this.reportcriteria.controls.vill_cd.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  private _filter(value: any): any[] {
    debugger
    const filterValue = value.toLowerCase();
  //  if(value.length>0 && !isNaN(value)){
  //   debugger
  //   this.getBlockName()
  //  }
  if(value.length>0){

  }
    debugger
    return this.villages.filter(option => option.vill_name.toLowerCase().includes(filterValue));
  }
  getBlockName(){
    const X= this.reportcriteria.controls.block.value
    debugger
    this.blocks1=this.blocks.filter(e=>e.block_cd==X)
    debugger
    // this.reportcriteria.controls.block.setValue(this.blocks1[0].block_name)
  }
  getBlock(){
    var dt={"ardb_cd":this.sys.ardbCD}
    this.svc.addUpdDel<any>('Mst/GetBlockMaster', dt).subscribe(
      res => {
        this.blocks=res;
        this.blocks = this.blocks.sort((a, b) => (a.block_name > b.block_name) ? 1 : -1);
      })
  }
  getVillageMaster(): void {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
     this.svc.addUpdDel<any>('Mst/GetVillageMaster', dt).subscribe(
      res => {
        console.log(res)
        this.villages = res;
        
        debugger
      },
      err => { }
    )
    debugger
  }
  getAccountTypeList() {

    if (this.AcctTypes.length > 0) {
      return;
    }
    this.AcctTypes = [];

    this.isLoading = true;
    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {

        this.isLoading = false;
        this.AcctTypes = res;
        this.AcctTypes = this.AcctTypes.filter(c => c.dep_loan_flag === 'L');
        this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        this.isLoading = false;
      }
    );
  }
  GetServiceAreaMaster()
  {
    var dt={
      "ardb_cd":this.sys.ardbCD,
    }
   
    this.svc.addUpdDel<any>('Mst/GetServiceAreaMaster', dt).subscribe(
      res => {
        // this.allServiceArea=res;
        this.allServiceArea=res;
        
    }
    )
  
  }
  cancelOnNull() {
    this.suggestedCustomer = null;
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      this.disabledOnNull = false;
    }
    else {
      this.disabledOnNull = true
    }
  }
  public suggestCustomer(): void {
    // debugger;
    this.showWait=true
    this.isLoading = true;
    if (this.reportcriteria.controls.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      prm.as_cust_name = this.reportcriteria.controls.acct_num.value.toLowerCase();
      prm.ardb_cd = this.sys.ardbCD
      this.svc.addUpdDel<any>('Loan/GetLoanDtls1', prm).subscribe(
        res => {
          this.isLoading = false
          console.log(res)
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res;
          } else {
            this.isLoading = false
            this.suggestedCustomer = [];
          }
          this.showWait=false;
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.isLoading = false;
      this.suggestedCustomer = null;
    }
    
    
  }

  public SelectCustomer(cust: any): void {
    console.log(cust)
    // this.fromdate=cust.disb_dt
    // this.toDate=this.sys.CurrentDate
    this.gName=cust.guardian_name
    this.accCD=cust.acc_cd
    this.loanId=cust.loan_id
    this.custNm=cust.cust_name
    this.addr=cust.present_address
    this.reportcriteria.controls.acct_num.setValue(cust.loan_id);
    this.suggestedCustomer = null;
    const currFYear = localStorage.getItem('__curFinyr');
    
    debugger
    this.reportcriteria.controls.fromDate.setValue('01/04/'+currFYear)
    debugger
  }
  onLoadScreen(content) {
    this.notvalidate=false
    this.modalRef = this.modalService.show(content, this.config);
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); //Retrieve items for page
    // console.log(this.pagedItems)
  
    this.cd.detectChanges();
  }
  public SubmitReport() {
    this.getBlockName();
    if(this.ardbcd=="26"||this.ardbcd=="23"){
    this.convertDtFrm=''
    this.convertDtFrm=this.datePipe.transform(this.reportcriteria.controls.fromDate.value, 'dd/MM/yyyy')
      this.toDate = this.reportcriteria.controls.toDate.value;
      console.log(this.datePipe.transform(this. toDate, 'dd/MM/yyyy'))
      this.convertDt=this.datePipe.transform(this. toDate, 'dd/MM/yyyy')
      this.lastDate=this.convertDt
    }
    else{
      this.lastDate=this.lastDate
    }
    this.comSer.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    if(this.comSer.diff<0){
    this.date_msg=this.comSer.date_msg;

    this.notvalidate=true
    // alert('hello')
  }
    else {
      this.ovdInttSum=0
          this.currInttSum=0
          this.currPrnSum=0
          this.ovdPrnSum=0
          this.penalInttSum=0
          this.totalSum=0
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      // this.isLoading=true;
      // this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      console.log(this.datePipe.transform(this. toDate, 'dd/MM/yyyy'))
      this.convertDt=this.datePipe.transform(this. toDate, 'dd/MM/yyyy')
      for(let j=0;j<this.lastDate.length;j++){
        if(this.lastDate.charAt(j)!='/')
        this.converDttoDt+=this.numData[(+this.lastDate.charAt(j))]
        else
        this.converDttoDt+='/'

    }
    debugger
    // const str = this.reportcriteria.controls.fromDate.value;
    // const darr = str.split("/");    // ["29", "1", "2016"]
    // const dobj = new Date(parseInt(darr[2]),parseInt(darr[1])-1,parseInt(darr[0]));
    // console.log(dobj.toISOString());
    // console.log(this.calc)
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "from_dt":this.reportcriteria.controls.fromDate.value.toISOString(),
      "to_dt":this.reportcriteria.controls.toDate.value.toISOString(),
      "block_cd":this.reportcriteria.controls.block.value,
      "acc_cd":Number(this.reportcriteria.controls.acc_cd.value),
    }
      this.isLoading=true
      this.showAlert = false;
      
      // this.svc.addUpdDel('Loan/GetDemandList',dt).subscribe(data=>{console.log(data)
        this.svc.addUpdDel('Loan/GetDemandNoticeBlockwise',dt).subscribe(data=>{console.log(data)
        this.reportData=data;
        if(this.reportData?.length==0||this.reportData==null){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        }
        else{debugger
        this.reportData.forEach(p => {
          // if(this.sys.ardbCD=="20" ||this.sys.ardbCD=="21" ||this.sys.ardbCD=="11" || this.sys.ardbCD=="26"||this.sys.ardbCD=="10"||this.sys.ardbCD=="22"||this.sys.ardbCD=="23"){
          if(this.sys.ardbCD!="2" && this.sys.ardbCD!="4" && this.sys.ardbCD!="3" ){
            if(this.sys.ardbCD=="23"){
              const abc = p.block_name;
              let [GName, Phone] = abc.split('$');
              p.block_name = GName.trim();
              p.phone_number = Phone.trim();
            }
            // p.brn_cd=this.allServiceArea.filter(e=>e.service_area_cd==p.brn_cd)[0]?.service_area_name;
            const abc = p.activity_name;
            let [cName, cAddress] = abc.split('$');
            p.activity_name = cName.trim();
            p.ardb_cd = cAddress.trim();
             
            
          }
          else{
            p.cust_address=this.allServiceArea.filter(e=>e.service_area_cd==p.cust_address)[0]?.service_area_name;
            p.ardb_cd=this.villages.filter(e=>e.vill_cd==p.ardb_cd)[0]?.vill_name;

             
          }
        })
        // this.reportData = this.reportData.sort((a, b) => (a.ardb_cd > b.ardb_cd) ? 1 : -1);
        this.reportData = this.reportData.sort((a, b) => {
          if (a.ardb_cd > b.ardb_cd) return 1;
          if (a.ardb_cd < b.ardb_cd) return -1;
      
          // If ardb_cd values are equal, sort by cust_name as the secondary condition
          return (a.cust_name > b.cust_name) ? 1 : -1;
      });  
    
    if(this.sys.ardbCD=='20'){
      this.reportData.forEach(p => {
        if(p.activity_name==this.reportcriteria.controls.activity_cd.value){
          this.reportData2.push(p);
          if(this.reportData2.length>0){
            this.dataSource.data=this.reportData2
            this.isLoading=false;
          }
        }
        debugger
      })
    }
    
    else{
      
      
      this.dataSource.data=this.reportData;
      this.dataSource.paginator = this.paginator;
      this.isLoading=false;
    }
  }  

      },
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
        })
    
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
  // getLoanData(){
  //   const acc1 = new tm_loan_all();
  //       let acc = new LoanOpenDM();
  //       acc1.loan_id = '' + this.f.acct_num.value;
  //       acc1.brn_cd = this.sys.BranchCode;
  //       acc1.acc_cd = +this.sys.ardbCD
  //       this.svc.addUpdDel<any>('Loan/GetLoanData', acc1).subscribe(
  //         res => {
  //           acc=res
  //         })
  // }

  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}



