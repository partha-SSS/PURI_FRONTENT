import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild,AfterViewInit } from '@angular/core';
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
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';

@Component({
  selector: 'app-recov-list',
  templateUrl: './recov-list.component.html',
  styleUrls: ['./recov-list.component.css']
})
export class RecovListComponent implements OnInit ,AfterViewInit{
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['block_name','service_area_name','vill_name','acc_name','activity_cd', 'loan_id','party_name','outstanding_prn','curr_prn','ovd_prn','curr_intt','ovd_intt','penal_intt','total_demand','curr_prn_recov','ovd_prn_recov','adv_prn_recov','curr_intt_recov','ovd_intt_recov','penal_intt_recov','total_recov'];
//, 'vill_name', 'loan_id', 'party_name','loan_acc_no','disb_dt','activity_cd','outstanding_prn','curr_prn','ovd_prn','curr_intt','ovd_intt','penal_intt','curr_prn_recov','ovd_prn_recov','curr_intt_recov','ovd_intt_recov','penal_intt_recov'
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
  currInttSum=0
  ovdInttSum=0
  ovdPrnSum=0
  currPrnSum=0
  totPrn=0;
  penalInttSum=0;
  currInttSum_recov=0
  ovdInttSum_recov=0
  ovdPrnSum_recov=0
  currPrnSum_recov=0
  advPrnSum_recov=0
  totPrn_recov=0;
  penalInttSum_recov=0;

  dummycurrInttSum=0
  dummyovdInttSum=0
  dummyovdPrnSum=0
  dummycurrPrnSum=0
  dummytotPrn=0;
  dummypenalInttSum=0;
  dummycurrInttSum_recov=0
  dummyovdInttSum_recov=0
  dummyovdPrnSum_recov=0
  dummycurrPrnSum_recov=0
  dummyadvPrnSum_recov=0
  dummytotPrn_recov=0;
  dummypenalInttSum_recov=0;
  loanNm:any;
  lastLoanID:any
  totalSum=0;
  totalSum_recov=0
  dummytotalSum=0;
  dummytotalSum_recov=0
  filteredArray:any=[]
  bName=''
  selectedValue=''
  selectedValue1=''
  inputEl:any;
  selectItems=[
    {
      value:'Block',
      name:'Block'
    },
    
    {
      value:'Village',
      name:'Village'
    },
     {
      value:'Service Area',
      name:'Service Area'
    },
    
    {
      value:'Account Type',
      name:'Account Type'
    },
    {
      value:'Activity',
      name:'Activity'
    },
    {
      value:'Loan ID',
      name:'Loan ID'
    },
    {
      value:'Party Name',
      name:'Party Name',

    }
  ]
  selectItems1=[
    {
      value:'Block',
      name:'Block'
    },
    {
      value:'Account Type',
      name:'Account Type'
    },
    {
      value:'Activity',
      name:'Activity'
    },
    {
      value:'Service Area',
      name:'Service Area'
    },
    {
      value:'Village',
      name:'Village'
    },
    {
      value:'Loan ID',
      name:'Loan ID'
    },
    {
      value:'Party Name',
      name:'Party Name',

    }
  ]
  filteredArray1:any=[]
firstGroup:any=[];
secondGroup:any=[]
notvalidate:boolean=false;
  date_msg:any;
bName1=''
  constructor(private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer, private comSer: CommonServiceService,
    private router: Router) { 
      
    }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      fundType:[null,Validators.required]
    });
    this.onLoadScreen(this.content);
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today= n + " "+ time
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
    this.comSer.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else if(this.comSer.diff<0){
      this.date_msg= this.comSer.date_msg
      this.notvalidate=true
    }

    else {
      this.ovdInttSum=0
      this.currInttSum=0
      this.currPrnSum=0
      this.ovdPrnSum=0
      this.penalInttSum=0
      this.totalSum=0
      this.ovdInttSum_recov=0
      this.currInttSum_recov=0
      this.currPrnSum_recov=0
      this.advPrnSum_recov=0
      this.ovdPrnSum_recov=0
      this.penalInttSum_recov=0
      this.totalSum_recov=0
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true;
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString(),
        "fund_type":this.reportcriteria.controls.fundType.value
      }
      this.isLoading=true
      this.showAlert = false;
      
      // this.svc.addUpdDel('Loan/GetRecoveryListGroupwise',dt).subscribe(data=>{console.log(data)
        this.svc.addUpdDel('Loan/GetRecoveryList',dt).subscribe(data=>{console.log(data)
        this.reportData=data
        this.dataSource.data=this.reportData;
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
        if(this.reportData.length<50){
          this.pagedItems=this.reportData
        }
        this.pageChange=document.getElementById('chngPage');
        this.pageChange.click()
        this.setPage(2);
        this.setPage(1)
        this.modalRef.hide();
        // this.lastAccNum=this.reportData[this.reportData.length-1].acc_num
        this.reportData.forEach(e => {
          // this.ovdInttSum+=e.ovd_intt
          // this.currInttSum+=e.curr_intt
          // this.currPrnSum+=e.curr_prn
          // this.ovdPrnSum+=e.ovd_prn
          // this.penalInttSum+=e.penal_intt
          // this.totalSum+=e.ovd_intt+e.curr_intt+e.curr_prn+e.ovd_prn+e.penal_intt
          // this.ovdInttSum_recov+=e.ovd_intt_recov
          // this.currInttSum_recov+=e.curr_intt_recov
          // this.currPrnSum_recov+=e.curr_prn_recov
          // this.ovdPrnSum_recov+=e.ovd_prn_recov
          // this.penalInttSum_recov+=e.penal_intt_recov
          // this.totalSum_recov+=e.ovd_intt_recov+e.curr_intt_recov+e.curr_prn_recov+e.ovd_prn_recov+e.penal_intt_recov

           this.ovdInttSum+=e.ovd_intt
      this.currInttSum+=e.curr_intt
      this.currPrnSum+=e.curr_prn
      this.ovdPrnSum+=e.ovd_prn
      this.penalInttSum+=e.penal_intt
      this.totalSum+=e.ovd_intt+e.curr_intt+e.curr_prn+e.ovd_prn+e.penal_intt
      this.ovdInttSum_recov+=e.ovd_intt_recov
      this.currInttSum_recov+=e.curr_intt_recov
      this.currPrnSum_recov+=e.above_1
      this.advPrnSum_recov+=e.curr_prn_recov
      this.ovdPrnSum_recov+=e.ovd_prn_recov
      this.penalInttSum_recov+=e.penal_intt_recov
      this.totalSum_recov+=e.ovd_intt_recov+e.curr_intt_recov+e.curr_prn_recov+e.ovd_prn_recov+e.penal_intt_recov+e.above_1
   });
        this.reportData.forEach(e=>{
          this.lastLoanID=e.loan_id
        },err => {
          this.isLoading = false;
          this.comSer.SnackBar_Error(); 
         })
      })
    
      // this.UrlString = this.UrlString + 'WebForm/Loan/loandisbursement?'
      //   + 'ardb_cd='+ this.sys.ardbCD
      //   + '&brn_cd=' + this.sys.BranchCode
      //   + '&from_dt=' + Utils.convertDtToString(this.fromdate)
      //   + '&to_dt=' + Utils.convertDtToString(this.toDate);

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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // }
  applyFilter0(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // this.searchfilter.data=this.dataSource.filteredData
    console.log(this.dataSource)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getTotal()
  }
  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    this.bName=(event.target as HTMLInputElement).value
    this.filteredArray=this.dataSource.data
    console.log(filterValue)
    console.log(
      this.filteredArray.filter(e=>e.acc_name)

    )
    switch(this.selectedValue1){
      case "Block": 
      debugger
      this.filteredArray=this.reportData.filter(e=>e.block_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
       debugger
      break;
       case "Service Area": 
      debugger
      this.filteredArray=this.reportData.filter(e=>e.service_area_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
       debugger
      break;
      case "Account Type": 
      debugger
      this.filteredArray=this.reportData.filter(e=>e.acc_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
       debugger
      break;
      case "Activity": 
      debugger
      this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
       debugger
      break;
      case "Village": 
      this.filteredArray=this.reportData.filter(e=>e.vill_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
        break;
    
      case "Party Name":
    this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
    
       case "Loan ID":
        this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;

    }
    this.dataSource.data=this.filteredArray
    this.getTotal()
    // this.filteredArray.forEach(e=>
    //   {
    //    if(e.block_name.includes(filterValue))
    // this.dataSource.data=this.filteredArray
    // console.log(this.dataSource.data)

      
    //   })
  }
  showFirstGroup(){
    this.dataSource.data=this.reportData
    this.bName=''
    this.bName1=''
    this.selectedValue=''
    this.firstGroup.length=0
    switch(this.selectedValue1){
     case "Block": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].block_name
     }
      //  console.log(this.blockNames)
     
        break;
        case "Service Area": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].service_area_name
     }
      //  console.log(this.blockNames)
     
        break;
      case "Activity": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].activity_cd
     }
    // this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Party Name":
        for(let i=0;i<this.reportData.length;i++){
          this.firstGroup[i]=this.reportData[i].party_name
       }
    // this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
     case "Village":
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].vill_name
     }
  // this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
   break;
    
       case "Account Type":
        for(let i=0;i<this.reportData.length;i++){
          this.firstGroup[i]=this.reportData[i].acc_name
       }
        // this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;
         case "Loan ID":
          for(let i=0;i<this.reportData.length;i++){
            this.firstGroup[i]=this.reportData[i].loan_id
         }
          // this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
           break;
        

    }
    this.firstGroup=Array.from(new Set(this.firstGroup))
    this.firstGroup=this.firstGroup.sort()
  }
  searchFirstGroup(){
    this.isLoading=true
    // this.bName=''
    this.bName1=''
    this.selectedValue=''
    setTimeout(()=>{this.isLoading=false},500)
    switch(this.selectedValue1){
      case "Block": 
      this.filteredArray=this.reportData.filter(e=>e.block_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
        case "Service Area": 
      this.filteredArray=this.reportData.filter(e=>e.service_area_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
      case "Activity": 
    this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(this.bName.toLowerCase())==true)
      break;
      case "Party Name":
    this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
     break;
    
       case "Loan ID":
        this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(this.bName.toLowerCase())==true)
         break;
         case "Account Type":
          this.filteredArray=this.reportData.filter(e=>e.acc_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
           break;
           case "Village":
            this.filteredArray=this.reportData.filter(e=>e.vill_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
             break;

    }
    this.dataSource.data=this.filteredArray
    this.filteredArray1=this.filteredArray
    this.getTotal()
  }
  showSecondGroup(){
    this.dataSource.data=this.filteredArray1
    this.secondGroup.length=0;
    this.bName1=''
    switch(this.selectedValue){
      case "Block": 
       for(let i=0;i<this.filteredArray1.length;i++){
         this.secondGroup[i]=this.filteredArray1[i].block_name
      }
       //  console.log(this.blockNames)
      
         break;
         case "Service Area": 
       for(let i=0;i<this.filteredArray1.length;i++){
         this.secondGroup[i]=this.filteredArray1[i].service_area_name
      }
       //  console.log(this.blockNames)
      
         break;
       case "Activity": 
       for(let i=0;i<this.filteredArray1.length;i++){
         this.secondGroup[i]=this.filteredArray1[i].activity_cd
      }
     // this.filteredArray=this.filteredArray1.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
       break;
       case "Party Name":
         for(let i=0;i<this.filteredArray1.length;i++){
           this.secondGroup[i]=this.filteredArray1[i].party_name
        }
     // this.filteredArray=this.filteredArray1.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Village":
       for(let i=0;i<this.filteredArray1.length;i++){
         this.secondGroup[i]=this.filteredArray1[i].vill_name
      }
   // this.filteredArray=this.filteredArray1.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
    break;
     
        case "Account Type":
         for(let i=0;i<this.filteredArray1.length;i++){
           this.secondGroup[i]=this.filteredArray1[i].acc_name
        }
         // this.filteredArray=this.filteredArray1.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
          break;
          case "Loan ID":
           for(let i=0;i<this.filteredArray1.length;i++){
             this.secondGroup[i]=this.filteredArray1[i].loan_id
          }
           // this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
            break;
         
 
     }
    this.secondGroup=Array.from(new Set(this.secondGroup))
    this.secondGroup=this.secondGroup.sort()
    this.getTotal()
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'matTable'
    }
    this.exportAsService.save(this.exportAsConfig, 'Demand_col_List_Member').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  searchSecondGroup(){
    this.isLoading=true
    setTimeout(()=>{this.isLoading=false},500)
    console.log(this.filteredArray1)
// debugger
    switch(this.selectedValue){
      case "Block": 
      this.filteredArray=this.filteredArray1.filter(e=>e.block_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
        break;
        case "Service Area": 
      this.filteredArray=this.filteredArray1.filter(e=>e.service_area_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
        break;
      case "Activity": 
    this.filteredArray=this.filteredArray1.filter(e=>e.activity_cd?.toLowerCase().includes(this.bName1.toLowerCase())==true)
      break;
      case "Party Name":
    this.filteredArray=this.filteredArray1.filter(e=>e.party_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
     break;
    
       case "Loan ID":
        this.filteredArray=this.filteredArray1.filter(e=>e.loan_id?.toLowerCase().includes(this.bName1.toLowerCase())==true)
         break;
         case "Account Type":
          this.filteredArray=this.filteredArray1.filter(e=>e.acc_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
           break;
           case "Village":
            this.filteredArray=this.filteredArray1.filter(e=>e.vill_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
             break;
    }
    debugger;
    console.log(this.filteredArray1)
    this.dataSource.data=this.filteredArray
    this.getTotal()
  }
  applyFilter1(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    this.filteredArray=this.dataSource.data
    switch(this.selectedValue){
     
      case "Account Type": 
      debugger
      this.filteredArray=this.filteredArray.filter(e=>e.acc_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
       debugger
      break;
      case "Activity": 
      debugger
      this.filteredArray=this.filteredArray.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
       debugger
      break;
      case "Village": 
      this.filteredArray=this.filteredArray.filter(e=>e.vill_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
        break;
    
      case "Party Name":
    this.filteredArray=this.filteredArray.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
    
       case "Loan ID":
        this.filteredArray=this.filteredArray.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;

    }
    this.dataSource.data=this.filteredArray
    this.getTotal()

  }
  getTotal(){
    this.ovdInttSum=0
      this.currInttSum=0
      this.currPrnSum=0
      this.ovdPrnSum=0
      this.penalInttSum=0
      this.totalSum=0
      this.ovdInttSum_recov=0
      this.currInttSum_recov=0
      this.currPrnSum_recov=0
      this.advPrnSum_recov=0
      this.ovdPrnSum_recov=0
      this.penalInttSum_recov=0
      this.totalSum_recov=0
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    this.filteredArray.forEach(e => {
      this.ovdInttSum+=e.ovd_intt
      this.currInttSum+=e.curr_intt
      this.currPrnSum+=e.curr_prn
      this.ovdPrnSum+=e.ovd_prn
      this.penalInttSum+=e.penal_intt
      this.totalSum+=e.ovd_intt+e.curr_intt+e.curr_prn+e.ovd_prn+e.penal_intt
      this.ovdInttSum_recov+=e.ovd_intt_recov
      this.currInttSum_recov+=e.curr_intt_recov
      this.currPrnSum_recov+=e.above_1
      this.advPrnSum_recov+=e.curr_prn_recov
      this.ovdPrnSum_recov+=e.ovd_prn_recov
      this.penalInttSum_recov+=e.penal_intt_recov
      this.totalSum_recov+=e.ovd_intt_recov+e.curr_intt_recov+e.curr_prn_recov+e.ovd_prn_recov+e.penal_intt_recov+e.above_1
    });
  }
  resetList(){
    this.isLoading=true
    setTimeout(()=>{this.isLoading=false},500)
    this.dataSource.data=this.reportData;
    this.inputEl=document.getElementById('myInput');
    this.inputEl.value=''
   
    this.ovdInttSum=this.dummyovdInttSum
    this.currInttSum=this.currInttSum
    this.currPrnSum=this.currPrnSum
    this.ovdPrnSum=this.ovdPrnSum
    this.penalInttSum=this.dummypenalInttSum
    this.totalSum=this.dummytotalSum
    this.ovdInttSum_recov=this.dummyovdInttSum_recov
    this.currInttSum_recov=this.dummycurrInttSum_recov
    this.currPrnSum_recov=this.dummycurrPrnSum_recov
    this.advPrnSum_recov=this.dummyadvPrnSum_recov
    this.ovdPrnSum_recov=this.dummyovdPrnSum_recov
    this.penalInttSum_recov=this.dummypenalInttSum_recov
    this.totalSum_recov=this.dummytotalSum_recov
    this.selectedValue=''
    this.bName=''
    this.selectedValue1=''
    this.bName1=''
  }
  
  
}
