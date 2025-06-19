import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { DetailListComponent } from '../../detail-list/detail-list.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-loan-disburse-normal',
  templateUrl: './loan-disburse-normal.component.html',
  styleUrls: ['./loan-disburse-normal.component.css']
})
export class LoanDisburseNormalComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  displayedColumns: string[] = ['dis_dtls'];
  // ,'activity_name','acc_cd', 'trans_dt','loan_id','cust_name','disb_amt'
  dataSource = new MatTableDataSource()
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  bName=''
  selectedValue=''
  selectedValue1=''
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
  AcctTypes: mm_operation[];

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
  loanNm:any;
  gndtotDisb=0
  filteredArray:any=[]
  resultLength=0
  inputEl:any;
  notvalidate:boolean=false;
  date_msg:any;
  dummytotDisb=0
  totdisbNum=0
  LandingCall:boolean;
  selectItems=[
   
    {
      value:'Activity',
      name:'Activity'
    },
    {
      value:'Loan Type',
      name:'Loan Type'
    },
   
    {
      value:'Loan ID',
      name:'Loan ID'
    },
    {
      value:'Name',
      name:'Name'
    }
  ]
  selectItems1=[
    {
      value:'Block',
      name:'Block'
    },
    {
      value:'Activity',
      name:'Activity'
    },
    {
      value:'Loan Type',
      name:'Loan Type'
    },
   
    {
      value:'Loan ID',
      name:'Loan ID'
    },
    {
      value:'Name',
      name:'Name'
    }
  ]
  searchfilter= new MatTableDataSource()
  constructor(private comSer:CommonServiceService,private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,
    private router: Router) { }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getOperationMaster()
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      // acc_type_cd: [null, Validators.required]

    });
    if(this.comSer.loanDis){
      this.SubmitReport()
      this.LandingCall=this.comSer.loanDis
    }
    else{
      this.onLoadScreen(this.content);
      }
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
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
    console.log(this.pagedItems)
  
    this.cd.detectChanges();
  }
  private getOperationMaster(): void {
    debugger;
     this.isLoading = true;
     if (undefined !== DetailListComponent.operations &&
       null !== DetailListComponent.operations &&
       DetailListComponent.operations.length > 0) {
       this.isLoading = false;
       this.AcctTypes = DetailListComponent.operations.filter(e => e.module_type === 'LOAN')
         .filter((thing, i, arr) => {
           return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
         });
       this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
     } else {
       this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
         res => {
 
           DetailListComponent.operations = res;
           this.isLoading = false;
           this.AcctTypes = DetailListComponent.operations.filter(e => e.module_type === 'LOAN')
             .filter((thing, i, arr) => {
               return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
             });
           this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
         },
         err => {
            this.isLoading = false;
            this.comSer.SnackBar_Error(); 
           }
       );
     }
   }
   takeLoanVal(e:any){
    console.log(e)
  }
  public SubmitReport() {
    this.comSer.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    if(this.comSer.loanDis){
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.sys.CurrentDate.toISOString(),
        "to_dt":this.sys.CurrentDate.toISOString(),
        // "acc_cd":this.reportcriteria.controls.acc_type_cd.value,
      }
      this.isLoading=true
      this.showAlert = false;
      
      this.svc.addUpdDel('Loan/PopulateLoanDisburseReg',dt).subscribe(data=>{
        console.log(data)
        this.reportData=data
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.isLoading = false;
        this.dataSource.data=this.reportData
       
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.resultLength=this.reportData.length
        this.totdisbNum=0
        this.gndtotDisb=0
        for(let i=0;i<this.reportData.length;i++){
          
            this.totdisbNum+=this.reportData[i].blocktype.tot__block_ovd_prn_recov
            this.gndtotDisb+=this.reportData[i].blocktype.tot_block_curr_prn_recov
          
        }
        this.reportData.forEach(e => {
          this.dummytotDisb+=e.disb_amt
        });
      }),
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
        }
    }
    else{
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
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true
      // this.gndtotDisb=0

      // this.loanNm=this.AcctTypes.filter(e=>e.acc_type_cd==this.reportcriteria.controls.acc_type_cd.value)[0].acc_type_desc
      // console.log(this.loanNm)
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString(),
        // "acc_cd":this.reportcriteria.controls.acc_type_cd.value,
      }
      this.isLoading=true
      this.showAlert = false;
      
      this.svc.addUpdDel('Loan/PopulateLoanDisburseReg',dt).subscribe(data=>{
        console.log(data)
        this.reportData=data
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.dataSource.data=this.reportData
       
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.resultLength=this.reportData.length
        this.totdisbNum=0
        this.gndtotDisb=0
        for(let i=0;i<this.reportData.length;i++){
          
            this.totdisbNum+=this.reportData[i].blocktype.tot__block_ovd_prn_recov
            this.gndtotDisb+=this.reportData[i].blocktype.tot_block_curr_prn_recov
        
          // console.log(this.filteredArray[i].dr_amt)
          
          
        }
        console.log(this.totdisbNum)
         console.log(this.gndtotDisb)
        
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
          // this.gndtotDisb+=e.disb_amt
          this.dummytotDisb+=e.disb_amt
        });
      }),
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
        }
    
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
  // applyFilter(event: Event) {
  //   console.log(event)
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  //   this.getTotal()
  // }
  getTotal(){
    this.gndtotDisb=0
    
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      // console.log(this.filteredArray[i].dr_amt)
      // this.gndtotDisb+=this.filteredArray[i].disb_amt
    }
    // this.disbNum=this.filteredArray.length
  }
  applyFilter0(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.searchfilter.data=this.dataSource.filteredData
    console.log(this.dataSource)
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getTotal()
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
    const filterValue=(event.target as HTMLInputElement).value
    this.filteredArray=this.dataSource.data
    switch(this.selectedValue1){
      case "Block": 
      debugger
      this.filteredArray=this.reportData.filter(e=>e.block_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
      console.log(this.filteredArray);
      debugger; 
      break;
      case "Activity": 
    this.filteredArray=this.reportData.filter(e=>e.activity_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
    case "Loan Type":
      this.filteredArray=this.reportData.filter(e=>e.acc_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
       break;
       case "Loan ID":
        this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;
         case "Name":
        this.filteredArray=this.reportData.filter(e=>e.cust_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;

    }
    console.log(this.filteredArray)
    this.dataSource.data=this.filteredArray
    this.getTotal()

  }
  applyFilter1(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    this.filteredArray=this.dataSource.data
    switch(this.selectedValue){
     
      case "Activity": 
    this.filteredArray=this.filteredArray.filter(e=>e.activity_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Loan ID":
    this.filteredArray=this.filteredArray.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
     case "Loan Type":
      this.filteredArray=this.filteredArray.filter(e=>e.acc_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
       break;
       case "Name":
        this.filteredArray=this.filteredArray.filter(e=>e.cust_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;
       

    }
    this.dataSource.data=this.filteredArray
    this.getTotal()

  }
  
  resetList(){
    this.isLoading=true
    setTimeout(()=>{this.isLoading=false},500)
    this.dataSource.data=this.reportData;
    // this.SubmitReport()
    this.inputEl=document.getElementById('myInput2');
    this.inputEl.value=''
    this.inputEl=document.getElementById('myInput1');
    this.inputEl.value=''
    // this.gndtotDisb=this.dummytotDisb
    // this.disbNum=this.reportData.length
    this.selectedValue=''
    this.selectedValue1=''
    this.bName=''
    
    
  }
}
