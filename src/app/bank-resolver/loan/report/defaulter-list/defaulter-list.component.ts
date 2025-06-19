import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SystemValues, mm_customer, p_report_param, mm_operation } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { DetailListComponent } from '../detail-list/detail-list.component';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-defaulter-list',
  templateUrl: './defaulter-list.component.html',
  styleUrls: ['./defaulter-list.component.css']
})
export class DefaulterListComponent implements OnInit {

  public static operations: mm_operation[] = [];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  resultLength=0
  filteredArray:any=[]
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  trailbalance: tt_trial_balance[] = [];
  displayedColumns: string[] = ['SLNO','block_name','gp_name','vill_name','party_name','guardian_name','phone', 'acc_num', 'list_dt', 'curr_intt_rate','curr_prn','ovd_prn','plus','curr_intt','ovd_intt','penal_intt','total','n_d','computed_till_dt'];
  dataSource = new MatTableDataSource()
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
  fromVal=''
  toVal=''
  counter=0;
  fd: any;
  td: any;
  dt: any;
  bName=''
  bName1=''
  bName2=''
  selectedValue=''
  selectedValue1=''
  selectedValue2=''
  selectedValue3=''
  fromdate: Date;
  firstGroup:any=[]
  secondGroup:any=[]
  thirdGroup:any=[]
  // todate: Date;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  selectItems=[
    {
      value:'Block',
      name:'Block'
    },
    {
      value:'GP',
      name:'GP'
    },
    {
      value:'Village',
      name:'Village'
    },
    {
      value:'Activity',
      name:'Activity'
    },
    {
      value:'Issue DT',
      name:'Issue DT'
    },
    {
      value:'Interest Upto',
      name:'Interest Upto'
    },
    {
      value:'Party Name',
      name:'Party Name',

    },
    {
      value:'Loan ID',
      name:'Loan ID'
    }
  ]
  selectItems1=[
    {
      value:'Block',
      name:'Block'
    },
    {
      value:'GP',
      name:'GP'
    },
    {
      value:'Village',
      name:'Village'
    },
    {
      value:'Activity',
      name:'Activity'
    },
    {
      value:'Issue DT',
      name:'Issue DT'
    },
    {
      value:'Interest Upto',
      name:'Interest Upto'
    },
    {
      value:'Party Name',
      name:'Party Name',

    },
    {
      value:'Loan ID',
      name:'Loan ID'
    }
  ]
  rangeItems1=[
    {
      value:'1',
      name:'Current Principal'
    },
    {
      value:'2',
      name:'Overdue Principal'
    },
    {
      value:'3',
      name:'Current Interest'
    },
    {
      value:'4',
      name:'Overdue Interest'
    },
    {
      value:'5',
      name:'Current Interest Rate',

    },
    {
      value:'6',
      name:'Overdue Interest Rate'
    }
  ]
  
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
  total=0
  penalInttSum=0
  dummypenalInttSum=0
  dummycurrInttSum=0
  dummyovdInttSum=0
  dummyovdPrnSum=0
  dummycurrPrnSum=0
  dummytotPrn=0;
  dummytotal=0;
  loanNm: string;
  searchfilter= new MatTableDataSource()
  inputEl:any
  
  filteredArray1:any=[]
  filteredArray2:any=[]
  
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router, private comSer:CommonServiceService) { }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading=true;
    this.fromdate = this.sys.CurrentDate;
    // this.todate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
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
  onLoadScreen(content) {
    
    this.modalRef = this.modalService.show(content, this.config);
  }
  setPage(page: number) {
    this.currentPage = page;
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
        err => { this.isLoading = false; }
      );
    }
  }

  // public onAcctTypeChange(): void {
  //   const acctTypCdTofilter = +this.reportcriteria.controls.acc_type_cd.value;
  //   const acctTypeDesription = DetailListComponent.operations
  //     .filter(e => e.acc_type_cd === acctTypCdTofilter)[0].acc_type_desc;
  // }

  public SubmitReport() {
    debugger

    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.ovdInttSum=0
      this.penalInttSum=0
      this.dummypenalInttSum=0
      this.currInttSum=0
      this.currPrnSum=0
      this.ovdPrnSum+=0
      this.totPrn=0
      this.total=0
      this.dummytotal=0
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true;
      this.loanNm=this.AcctTypes.filter(e=>e.acc_type_cd==this.reportcriteria.controls.acc_type_cd.value)[0].acc_type_desc
      console.log(this.loanNm)
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "acc_cd":this.reportcriteria.controls.acc_type_cd.value,
        "adt_dt":this.fromdate.toISOString()
      }
      this.svc.addUpdDel('Loan/GetDefaultList',dt).subscribe(data=>{console.log(data)
        this.reportData=data
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
        if(this.reportData.length<50){
          this.pagedItems=this.reportData
        }
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.pageChange=document.getElementById('chngPage');
        this.pageChange.click()
        this.setPage(2);
        this.setPage(1)
        this.modalRef.hide();
        this.dataSource.data=this.reportData
        // for(let i=0;i<50;i++)
        // this.dataSource.data.push(this.reportData)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.resultLength=this.reportData.length
        this.lastAccNum=this.reportData[this.reportData.length-1].acc_num
        this.reportData.forEach(e => {
          this.penalInttSum+=e.penal_intt
          this.ovdInttSum+=e.ovd_intt
          this.currInttSum+=e.curr_intt
          this.currPrnSum+=e.curr_prn
          this.ovdPrnSum+=e.ovd_prn
          this.totPrn+=e.ovd_prn+e.curr_prn
          this.total+=e.ovd_prn+e.ovd_intt+e.curr_intt+e.penal_intt

          this.dummypenalInttSum+=e.penal_intt
          this.dummyovdInttSum+=e.ovd_intt
          this.dummycurrInttSum+=e.curr_intt
          this.dummycurrPrnSum+=e.curr_prn
          this.dummyovdPrnSum+=e.ovd_prn
          this.dummytotPrn+=e.ovd_prn+e.curr_prn
          this.dummytotal+=e.ovd_prn+e.ovd_intt+e.curr_intt+e.penal_intt

        },err => {
          this.isLoading = false;
          this.comSer.SnackBar_Error(); 
         });
      })
    
      // this.isLoading=true;
      // debugger
      // this.showAlert = false;
      // this.fromdate = this.reportcriteria.controls.fromDate.value;
      // this.UrlString = this.svc.getReportUrl();
      // console.log(this.UrlString)
      // this.UrlString = this.UrlString + 'WebForm/Loan/detailedlistforloan?'
      //   + 'ardb_cd=' + this.sys.ardbCD
      //   + '&brn_cd=' + this.sys.BranchCode
      //   + '&acc_cd=' + this.reportcriteria.controls.acc_type_cd.value
      //   + '&adt_dt=' + Utils.convertDtToString(this.fromdate);
      
      // this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
     
    }
  }
  public oniframeLoad(): void {
    this.counter++;
    this.isLoading = true;
    // debugger
    if(this.counter==2){
      this.isLoading=false;
      this.counter=0;
    }
    // this.isLoading=false;
    this.modalRef.hide();
  }
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
  showFirstGroup(){
    this.dataSource.data=this.reportData
    this.bName=''
    this.bName1=''
    this.bName2=''
    this.selectedValue=''
    this.firstGroup.length=0
    switch(this.selectedValue1){
     case "Block": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].block_name
     }
      //  console.log(this.blockNames)
     
        break;
        case "GP": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].gp_name
     }
      //  console.log(this.blockNames)
     
        break;
        case "Village": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].vill_name
     }
      //  console.log(this.blockNames)
     
        break;
      case "Activity": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].acc_name
     }
    // this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Party Name":
        for(let i=0;i<this.reportData.length;i++){
          this.firstGroup[i]=this.reportData[i].party_name
       }
    // this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
     case "Interest Upto":
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].computed_till_dt
     }
      // this.filteredArray=this.reportData.filter(e=>e.vill_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
       break;
       case "Loan ID":
        for(let i=0;i<this.reportData.length;i++){
          this.firstGroup[i]=this.reportData[i].acc_num
       }
        // this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;
         case "Issue DT":
          for(let i=0;i<this.reportData.length;i++){
            this.firstGroup[i]=this.reportData[i].list_dt
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
        case "GP": 
      this.filteredArray=this.reportData.filter(e=>e.gp_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
        case "Village": 
      this.filteredArray=this.reportData.filter(e=>e.vill_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
      case "Activity": 
    this.filteredArray=this.reportData.filter(e=>e.acc_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
      break;
      case "Party Name":
    this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
     break;
     case "Interest Upto":
      this.filteredArray=this.reportData.filter(e=>e.computed_till_dt.includes(this.bName)==true)
       break;
       case "Issue DT":
        this.filteredArray=this.reportData.filter(e=>e.list_dt.includes(this.bName)==true)
         break;
       case "Loan ID":
        this.filteredArray=this.reportData.filter(e=>e.acc_num?.toLowerCase().includes(this.bName.toLowerCase())==true)
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
        break;
        case "GP": 
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].gp_name
     }
        break;
        case "Village": 
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].vill_name
     }
        break;
      case "Activity": 
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].acc_name
     }
    // this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Party Name":
        for(let i=0;i<this.filteredArray1.length;i++){
          this.secondGroup[i]=this.filteredArray1[i].party_name
       }
    // this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
     case "Interest Upto":
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].computed_till_dt
     }
      // this.filteredArray=this.reportData.filter(e=>e.vill_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
       break;
       case "Loan ID":
        for(let i=0;i<this.filteredArray1.length;i++){
          this.secondGroup[i]=this.filteredArray1[i].acc_num
       }
        // this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;
         case "Issue DT":
          for(let i=0;i<this.filteredArray1.length;i++){
            this.secondGroup[i]=this.filteredArray1[i].list_dt
         }
          // this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
           break;

    }
    this.secondGroup=Array.from(new Set(this.secondGroup))
    this.secondGroup=this.secondGroup.sort()
    this.getTotal()
  }
  searchSecondGroup(){
    this.isLoading=true
    setTimeout(()=>{this.isLoading=false},500)
    console.log(this.filteredArray1)
debugger
    switch(this.selectedValue){
      case "Block": 
      this.filteredArray=this.filteredArray1.filter(e=>e.block_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
        break;
        case "GP": 
      this.filteredArray=this.filteredArray1.filter(e=>e.gp_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
        break;
        case "Village": 
      this.filteredArray=this.filteredArray1.filter(e=>e.vill_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
        break;
      case "Activity": 
    this.filteredArray=this.filteredArray1.filter(e=>e.acc_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
      break;
      case "Party Name":
    this.filteredArray=this.filteredArray1.filter(e=>e.party_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
     break;
     case "Interest Upto":
      this.filteredArray=this.filteredArray1.filter(e=>e.computed_till_dt.includes(this.bName1)==true)
       break;
       case "Issue DT":
        this.filteredArray=this.filteredArray1.filter(e=>e.list_dt.includes(this.bName1)==true)
         break;
       case "Loan ID":
        this.filteredArray=this.filteredArray1.filter(e=>e.acc_num?.toLowerCase().includes(this.bName1.toLowerCase())==true)
         break;

    }
    debugger;
    console.log(this.filteredArray1)
    this.dataSource.data=this.filteredArray
    this.getTotal()
  }
  show3rdGroup(){
    this.dataSource.data=this.filteredArray
    this.thirdGroup.length=0;
    this.bName2=''
    switch(this.selectedValue2){
       case "Block": 
      for(let i=0;i<this.filteredArray.length;i++){
        this.thirdGroup[i]=this.filteredArray[i].block_name
     }
        break;
        case "GP": 
      for(let i=0;i<this.filteredArray.length;i++){
        this.thirdGroup[i]=this.filteredArray[i].gp_name
     }
        break;
        case "Village": 
      for(let i=0;i<this.filteredArray.length;i++){
        this.thirdGroup[i]=this.filteredArray[i].vill_name
     }
        break;
      case "Activity": 
      for(let i=0;i<this.filteredArray.length;i++){
        this.thirdGroup[i]=this.filteredArray[i].acc_name
     }
    // this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Party Name":
        for(let i=0;i<this.filteredArray.length;i++){
          this.thirdGroup[i]=this.filteredArray[i].party_name
       }
    // this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
     case "Interest Upto":
      for(let i=0;i<this.filteredArray.length;i++){
        this.thirdGroup[i]=this.filteredArray[i].computed_till_dt
     }
      // this.filteredArray=this.reportData.filter(e=>e.vill_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
       break;
       case "Loan ID":
        for(let i=0;i<this.filteredArray.length;i++){
          this.thirdGroup[i]=this.filteredArray[i].acc_num
       }
        // this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;
         case "Issue DT":
          for(let i=0;i<this.filteredArray.length;i++){
            this.thirdGroup[i]=this.filteredArray[i].list_dt
         }
          // this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
           break;

    }
    this.thirdGroup=Array.from(new Set(this.thirdGroup))
    this.thirdGroup=this.thirdGroup.sort()
    this.getTotal()
  }
  search3rdGroup(){
    this.isLoading=true
    setTimeout(()=>{this.isLoading=false},500)
    console.log(this.filteredArray)
    console.log(this.filteredArray2)
debugger
    switch(this.selectedValue2){
      case "Block": 
      this.filteredArray2=this.filteredArray.filter(e=>e.block_name?.toLowerCase().includes(this.bName2.toLowerCase())==true)
        break;
        case "GP": 
      this.filteredArray2=this.filteredArray.filter(e=>e.gp_name?.toLowerCase().includes(this.bName2.toLowerCase())==true)
        break;
        case "Village": 
      this.filteredArray2=this.filteredArray.filter(e=>e.vill_name?.toLowerCase().includes(this.bName2.toLowerCase())==true)
        break;
      case "Activity": 
    this.filteredArray2=this.filteredArray.filter(e=>e.acc_name?.toLowerCase().includes(this.bName2.toLowerCase())==true)
      break;
      case "Party Name":
    this.filteredArray2=this.filteredArray.filter(e=>e.party_name?.toLowerCase().includes(this.bName2.toLowerCase())==true)
     break;
     case "Interest Upto":
      this.filteredArray2=this.filteredArray.filter(e=>e.computed_till_dt.includes(this.bName2)==true)
       break;
       case "Issue DT":
        this.filteredArray2=this.filteredArray.filter(e=>e.list_dt.includes(this.bName2)==true)
         break;
       case "Loan ID":
        this.filteredArray2=this.filteredArray.filter(e=>e.acc_num?.toLowerCase().includes(this.bName2.toLowerCase())==true)
         break;

    }
    debugger;
    console.log(this.filteredArray2)
    this.dataSource.data=this.filteredArray2
    this.getTotal()
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'mattable'
    }
    this.exportAsService.save(this.exportAsConfig, 'Overdue List').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
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
    this.bName=(event.target as HTMLInputElement).value

    this.filteredArray=this.dataSource.data
    // this.filteredArray=this.filteredArray.filter(e=>e.block_name.toLowerCase().includes(filterValue.toLowerCase())==true)
    switch(this.selectedValue1){
      case "Block": 
      this.filteredArray=this.reportData.filter(e=>e.block_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
        break;
        case "GP": 
      this.filteredArray=this.reportData.filter(e=>e.gp_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
        break;
        case "Village": 
      this.filteredArray=this.reportData.filter(e=>e.vill_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
        break;
      case "Activity": 
    this.filteredArray=this.reportData.filter(e=>e.acc_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Interest Upto": 
      this.filteredArray=this.reportData.filter(e=>e.computed_till_dt?.toString().includes(filterValue)==true)
        break;
      case "Party Name":
        debugger;
    this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
     case "Issue DT":
      this.filteredArray=this.reportData.filter(e=>e.list_dt?.toString().includes(filterValue)==true)
       break;
       case "Loan ID":
        this.filteredArray=this.reportData.filter(e=>e.acc_num?.toLowerCase().includes(filterValue.toLowerCase())==true)
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
  applyFilter1(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    this.filteredArray=this.dataSource.data
    switch(this.selectedValue){
      case "Activity": 
    this.filteredArray=this.filteredArray.filter(e=>e.acc_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Interest Upto": 
      this.filteredArray=this.filteredArray.filter(e=>e.computed_till_dt?.toString().includes(filterValue)==true)
        break;
      case "Party Name":
    this.filteredArray=this.filteredArray.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
     case "Issue DT":
      this.filteredArray=this.filteredArray.filter(e=>e.list_dt?.toString().includes(filterValue)==true)
       break;
       case "Loan ID":
        this.filteredArray=this.filteredArray.filter(e=>e.acc_num?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;

    }
    this.dataSource.data=this.filteredArray
    this.getTotal()
   
  }
  searchRange(){
    this.filteredArray=this.dataSource.data

    switch(this.selectedValue3){
      case '1': 
    this.filteredArray=this.filteredArray.filter(e=>e.curr_prn>=(+this.fromVal) && e.curr_prn<=(+this.toVal))
      break;
      case '2': 
      this.filteredArray=this.filteredArray.filter(e=>+e.ovd_prn>=(+this.fromVal) && +e.ovd_prn<=(+this.toVal))

        break;
      case '3':
        this.filteredArray=this.filteredArray.filter(e=>e.curr_intt>=(+this.fromVal) && e.curr_intt<=(+this.toVal))

     break;
     case '4':
      this.filteredArray=this.filteredArray.filter(e=>e.ovd_intt>=(+this.fromVal) && e.ovd_intt<=(+this.toVal))

       break;
       case '5':
        this.filteredArray=this.filteredArray.filter(e=>e.curr_intt_rate>=(+this.fromVal) && e.curr_intt_rate<=(+this.toVal))

         break;
         case '6':
          this.filteredArray=this.filteredArray.filter(e=>e.ovd_intt_rate>=(+this.fromVal) && e.ovd_intt_rate<=(+this.toVal))
  
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
      this.totPrn=0
      this.penalInttSum=0
      this.dummypenalInttSum=0
      this.total=0
      this.dummytotal=0
    // debugger;
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    this.filteredArray.forEach(e => {
      this.ovdInttSum+=e.ovd_intt
      this.currInttSum+=e.curr_intt
      this.currPrnSum+=e.curr_prn
      this.ovdPrnSum+=e.ovd_prn
      this.totPrn+=e.ovd_prn+e.curr_prn
      this.penalInttSum+=e.penal_intt
      this.total+=e.ovd_prn+e.ovd_intt+e.curr_intt+e.penal_intt

    });
    // debugger;
  }
  resetList(){
    this.isLoading=true
    setTimeout(()=>{this.isLoading=false},500)
    this.dataSource.data=this.reportData;
    // this.SubmitReport()
    this.inputEl=document.getElementById('myInput');
    this.inputEl.value=''
    // this.inputEl=document.getElementById('myInput2');
    // this.inputEl.value=''
    // this.inputEl=document.getElementById('myInput1');
    this.inputEl.value=''
    this.ovdInttSum=this.dummyovdInttSum
    this.currInttSum=this.dummycurrInttSum
    this.currPrnSum=this.dummycurrPrnSum
    this.ovdPrnSum=this.dummyovdPrnSum
   this.totPrn=this.dummytotPrn
   this.selectedValue='';
   this.bName=''
   this.selectedValue1=''
   this.selectedValue2=''
   this.bName2=''
    
    
  }
}
