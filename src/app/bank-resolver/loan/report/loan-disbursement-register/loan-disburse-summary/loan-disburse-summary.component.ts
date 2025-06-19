import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild ,AfterViewInit, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SystemValues, mm_customer, p_report_param, mm_operation } from 'src/app/bank-resolver/Models';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

interface GroupedData {
  group_name?: string;
  loans?: AggregatedLoan[];
  total_disb_amt?: number;
  total_no_of_loans?: number;
  total_no_of_cust?: number; // Added total unique customers
}

interface AggregatedLoan {
  activity_name?: string | null;
  disb_amt?: number;
  no_of_loans?: number;
  no_of_cust?: number; // Added field to track unique customers
}

@Component({
  selector: 'app-loan-disburse-summary',
  templateUrl: './loan-disburse-summary.component.html',
  styleUrls: ['./loan-disburse-summary.component.css']
})
export class LoanDisburseSummaryComponent {
  groupedData: GroupedData[] = [];
  public static operations: mm_operation[] = [];
  @ViewChild('mattable') htmlData:ElementRef;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['block_name','purpose','fund_type','acc_desc','loan_id','party_name','disb_dt','disb_amt'];
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

  AcctTypes: mm_operation[];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  counter=0;
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  filteredArray:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName

  pageChange: any;
 
  lastAccCD:any;
  today:any
  cName:any
  cAddress:any
  cAcc:any
  lastAccNum:any
  totIssueSum=0;
  totCount=0;
  totInttDue=0;
  totPenalIntt=0;
  totOvdPrn=0;
  totOvdIntt=0;
  totStan=0;
  totSubStan=0;
  totD1=0;
  totD2=0
  totD3=0
  totNpaSum=0;
  totProvSum=0
  loanNm:any;
  bName=''
  bName1=''
  inputEl:any;
  selectedValue='';
  selectedValue1='';
 dummytotIssueSum=0
 dummytotPrnDue=0
 dummytotInttDue=0
 dummytotPenalIntt=0
 dummytotOvdPrn=0
 dummytotOvdIntt=0
 dummytotStan=0
 dummytotSubStan=0
 dummytotD1=0
 dummytotD2=0
 dummytotD3=0
 dummytotNpaSum=0
 dummytotProvSum=0
 filteredArray1:any=[]
 firstGroup:any=[]
 secondGroup:any=[]
 selectItems=[
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
    value:'Fund Type',
    name:'Fund Type'
  },
  {
    value:'Loan ID',
    name:'Loan ID'
  },
  {
    value:'Party Name',
    name:'Party Name'
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
    value:'Fund Type',
    name:'Fund Type'
  },
  {
    value:'Loan ID',
    name:'Loan ID'
  },
  {
    value:'Party Name',
    name:'Party Name'
  }
]
  searchfilter= new MatTableDataSource()
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,
    private router: Router, private comSer:CommonServiceService) { }
  ngOnInit(): void {
    
    // this.isLoading=true;
    this.fromdate = this.sys.CurrentDate;
    this.todate = this.sys.CurrentDate;

    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    // this.getOperationMaster();
    this.onLoadScreen(this.content);
    var date = new Date();
    var n = date.toDateString();
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
  // private getOperationMaster(): void {
  //   this.isLoading = true;
  //   if (undefined !== DetailListComponent.operations &&
  //     null !== DetailListComponent.operations &&
  //     DetailListComponent.operations.length > 0) {
  //     this.isLoading = false;
  //     this.AcctTypes = DetailListComponent.operations.filter(e => e.module_type === 'LOAN')
  //       .filter((thing, i, arr) => {
  //         return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
  //       });
  //     this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
  //   } else {
  //     this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
  //       res => {
  //         DetailListComponent.operations = res;
  //         this.isLoading = false;
  //         this.AcctTypes = DetailListComponent.operations.filter(e => e.module_type === 'LOAN')
  //           .filter((thing, i, arr) => {
  //             return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
  //           });
  //         this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
  //         // console.log(this.AcctTypes)
  //       },
  //       err => { this.isLoading = false; }
  //     );
  //   }
  // }
  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else {
      // if(this.reportData)
      this.reportData=[];
      // this.reportData=null
      // this.pagedItems.length=0;
      this.modalRef.hide();
      this.isLoading=true;
      this.totIssueSum=0
          
      // this.loanNm=this.AcctTypes.filter(e=>e.acc_type_cd==this.reportcriteria.controls.acc_type_cd.value)[0].acc_type_desc
      // console.log(this.loanNm)
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      const todate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        // "acc_cd":this.reportcriteria.controls.acc_type_cd.value,
        "from_dt": this.fromdate.toISOString(),
        "to_dt": todate.toISOString()
      }
      debugger
      this.svc.addUpdDel('Loan/PopulateLoanDisburseRegAll',dt).subscribe(data=>{console.log(data)
        // this.reportData=data
         if(!data){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        }
        else{
          this.reportData=data;
          console.log(this.groupLoans());
          
          this.groupLoans();
        }
        this.dataSource.data=this.reportData
        // this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
       
        
        // this.pageChange=document.getElementById('chngPage');
        // this.pageChange.click()
        // this.setPage(2);
        // this.setPage(1)
        this.modalRef.hide();
        this.lastAccNum=this.reportData[this.reportData.length-1].loan_id
        console.log(this.lastAccNum)
        this.reportData.forEach(e => {
          this.totIssueSum+=e.disb_amt
          // this.totPrnDue+=e.prn_due
          // this.totInttDue+=e.intt_due
          // this.totPenalIntt+=e.penal_intt
          // this.totOvdPrn+=e.ovd_prn
          // this.totOvdIntt+=e.ovd_intt
          // this.totStan+=e.stan_prn
          // this.totSubStan+=e.substan_prn
          // this.totD1+=e.d1_prn
          // this.totD2+=e.d2_prn
          // this.totD3+=e.d3_prn
          // this.totNpaSum+=e.d1_prn+e.d2_prn+e.d3_prn+e.stan_prn+e.substan_prn
          // this.totProvSum+=e.provision
          //   this.dummytotIssueSum+=e.disb_amt
          //   this.dummytotPrnDue+=e.prn_due
          //   this.dummytotInttDue+=e.intt_due
          //   this.dummytotPenalIntt+=e.penal_intt
          //   this.dummytotOvdPrn+=e.ovd_prn
          //   this.dummytotOvdIntt+=e.ovd_intt
          //   this.dummytotStan+=e.stan_prn
          //   this. dummytotSubStan+=e.substan_prn
          //   this. dummytotD1+=e.d1_prn
          //   this.dummytotD2+=e.d2_prn
          //   this.dummytotD3+=e.d3_prn
          //   this. dummytotNpaSum+=e.d1_prn+e.d2_prn+e.d3_prn+e.stan_prn+e.substan_prn
          //   this.dummytotProvSum+=e.provision
        });
      })
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
  
  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
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
     break;
      //  console.log(this.blockNames)
      case "Activity": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].activity_name
     }
        break;
      case "Loan Type": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].acc_desc
     }
     break;
     case "Fund Type": 
     for(let i=0;i<this.reportData.length;i++){
       this.firstGroup[i]=this.reportData[i].fund_type
    }
    // this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Party Name":
        for(let i=0;i<this.reportData.length;i++){
          this.firstGroup[i]=this.reportData[i].cust_name
       }
    // this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
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
      case "Activity": 
      this.filteredArray=this.reportData.filter(e=>e.activity_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
      case "Loan Type": 
      this.filteredArray=this.reportData.filter(e=>e.acc_desc?.toLowerCase().includes(this.bName.toLowerCase())==true)
      break;
      case "Fund Type": 
      this.filteredArray=this.reportData.filter(e=>e.fund_type?.toLowerCase().includes(this.bName.toLowerCase())==true)
      break;
   
      case "Party Name":
    this.filteredArray=this.reportData.filter(e=>e.cust_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
     break;
      case "Loan ID":
        this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(this.bName.toLowerCase())==true)
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
     }break;
     case "Activity": 
     for(let i=0;i<this.filteredArray1.length;i++){
       this.secondGroup[i]=this.filteredArray1[i].activity_name
    }break;
      case "Loan Type": 
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].acc_desc
     }
     break;
      case "Fund Type": 
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].fund_type
     }
    // this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Party Name":
        for(let i=0;i<this.filteredArray1.length;i++){
          this.secondGroup[i]=this.filteredArray1[i].cust_name
       }
    // this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
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
  searchSecondGroup(){
    this.isLoading=true
    setTimeout(()=>{this.isLoading=false},500)
    console.log(this.filteredArray1)
debugger
    switch(this.selectedValue){
      case "Block": 
      this.filteredArray=this.filteredArray1.filter(e=>e.block_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
        break;
        case "Activity": 
      this.filteredArray=this.filteredArray1.filter(e=>e.activity_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
        break;
      case "Loan Type": 
    this.filteredArray=this.filteredArray1.filter(e=>e.acc_desc?.toLowerCase().includes(this.bName1.toLowerCase())==true)
      break;
      case "Fund Type": 
    this.filteredArray=this.filteredArray1.filter(e=>e.fund_type?.toLowerCase().includes(this.bName1.toLowerCase())==true)
      break;
      case "Party Name":
    this.filteredArray=this.filteredArray1.filter(e=>e.cust_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
     break;
    
       case "Loan ID":
        this.filteredArray=this.filteredArray1.filter(e=>e.loan_id?.toLowerCase().includes(this.bName1.toLowerCase())==true)
         break;

    }
    debugger;
    console.log(this.filteredArray1)
    this.dataSource.data=this.filteredArray
    this.getTotal()
  }
  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    this.bName=(event.target as HTMLInputElement).value
    this.filteredArray=this.dataSource.data
    switch(this.selectedValue1){
      case "Block": 
      this.filteredArray=this.reportData.filter(e=>e.block_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
          break;
      case "Activity": 
      this.filteredArray=this.reportData.filter(e=>e.activity_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
          break;
      case "Loan Type": 
      this.filteredArray=this.reportData.filter(e=>e.acc_desc?.toLowerCase().includes(this.bName.toLowerCase())==true)
          break;
          case "Fund Type": 
      this.filteredArray=this.reportData.filter(e=>e.fund_type?.toLowerCase().includes(this.bName.toLowerCase())==true)
          break;
      case "Party Name":
      this.filteredArray=this.reportData.filter(e=>e.cust_name.toLowerCase().includes(this.bName.toLowerCase())==true)
         break;
      case "Loan ID":
      this.filteredArray=this.reportData.filter(e=>e.loan_id.toLowerCase().includes(this.bName.toLowerCase())==true)
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
      case "Block": 
      this.filteredArray=this.reportData.filter(e=>e.block_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
        case "Activity": 
      this.filteredArray=this.reportData.filter(e=>e.activity_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
      case "Loan Type": 
      this.filteredArray=this.reportData.filter(e=>e.acc_desc?.toLowerCase().includes(this.bName.toLowerCase())==true)
      break;
      case "Fund Type": 
      this.filteredArray=this.reportData.filter(e=>e.fund_type?.toLowerCase().includes(this.bName.toLowerCase())==true)
      break;
      case "Party Name":
      this.filteredArray=this.filteredArray.filter(e=>e.cust_name.toLowerCase().includes(this.bName.toLowerCase())==true)
      break;
    
       case "Loan ID":
        this.filteredArray=this.filteredArray.filter(e=>e.loan_id.toLowerCase().includes(this.bName.toLowerCase())==true)
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
    this.inputEl=document.getElementById('myInput');
    this.inputEl.value=''
    // this.inputEl=document.getElementById('myInput2');
    // this.inputEl.value=''
    // this.inputEl=document.getElementById('myInput1');
    // this.inputEl.value=''
    this.totIssueSum=this.dummytotIssueSum
    
    this.selectedValue=''
    this.selectedValue1=''
    this.bName=''
   this.bName1=''
    
    
  }
  // || !loan.block_name
  // const group_name = `${loan.acc_desc} (${loan.block_name})`;

  // groupLoans() {
  //   const grouped = this.reportData.reduce((acc: { [key: string]: { [key: string]: AggregatedLoan } }, loan) => {
  //     if (!loan.acc_desc|| !loan.block_name || !loan.activity_name) return acc;

  //     const group_name = `${loan.acc_desc} (${loan.block_name})`;
  //     const block = acc[group_name] = acc[group_name] || {};
  //     const key = loan.activity_name;
  //     const activity = block[key] = block[key] || { activity_name: loan.activity_name, disb_amt: 0, no_of_loans: 0,  no_of_cust: 0 };

  //     activity.disb_amt += loan.disb_amt;
  //     activity.no_of_loans += 1;

  //     return acc;
  //   }, {});

  //   this.groupedData = Object.keys(grouped).map(group_name => {
  //     const loans:any = Object.values(grouped[group_name]);
  //     const total_disb_amt = loans.reduce((sum, loan) => sum + loan?.disb_amt, 0);
  //     const total_no_of_loans = loans.reduce((count, loan) => count + loan?.no_of_loans, 0);
  //     return {
  //       group_name,
  //       loans,
  //       total_disb_amt,
  //       total_no_of_loans
  //     };
  //   });
  // }
  groupLoans() {
    const grouped = this.reportData.reduce(
        (acc: { [key: string]: { [key: string]: AggregatedLoan & { unique_parties: Set<number> } } }, loan) => {
            if (!loan.acc_desc || !loan.block_name || !loan.activity_name || !loan.party_cd) return acc;

            const group_name = `${loan.acc_desc} (${loan.block_name})`;
            if (!acc[group_name]) acc[group_name] = {};

            const key = loan.activity_name;
            if (!acc[group_name][key]) {
                acc[group_name][key] = {
                    activity_name: loan.activity_name,
                    disb_amt: 0,
                    no_of_loans: 0,
                    no_of_cust: 0,
                    unique_parties: new Set<number>(), // To track unique customers
                };
            }

            const activity = acc[group_name][key];
            activity.disb_amt += loan.disb_amt;
            activity.no_of_loans += 1;
            activity.unique_parties.add(loan.party_cd); // Track unique party_cd

            return acc;
        },
        {}
    );

    this.groupedData = Object.keys(grouped).map(group_name => {
        const loans = Object.values(grouped[group_name]).map(({ unique_parties, ...loan }) => ({
            ...loan,
            no_of_cust: unique_parties.size, // Assign unique customer count
        }));

        return {
            group_name,
            loans,
            total_disb_amt: loans.reduce((sum,loan:any) => sum + loan?.disb_amt, 0),
            total_no_of_loans: loans.reduce((count, loan:any) => count + loan?.no_of_loans, 0),
            total_no_of_cust: loans.reduce((count, loan) => count + loan.no_of_cust, 0),
        };
    });
}

  getTotal(){
    this.totIssueSum=0
    this.totCount=0
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      this.totIssueSum+=this.filteredArray[i].disb_amt
      this.totCount=this.dataSource.filteredData.length

    }
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'mattable'
    }
    this.exportAsService.save(this.exportAsConfig, 'LoanDisbursement').subscribe(() => {
      // save started
      console.log("hello")
    });
  }
  openPDF(): void {
    const div = document.getElementById('mattable');
    div.style.width = "fit-content";
    html2canvas(div, {
      scale: 2, // Increase the scale to improve the quality
      scrollX: -window.scrollX, // Fix the position on the x-axis
      scrollY: -window.scrollY, // Fix the position on the y-axis
    }).then(canvas => {
      const pdf = new jspdf('landscape', 'pt');
      const width = 2000;
      const height = 1300;
      const ratio = width / height;
      const pageWidth =840;
      // pdf.internal.pageSize.getWidth()
      const pageHeight = pageWidth / ratio;
      pdf.addImage(canvas, 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save('my-document.pdf');
    });
  }

}
