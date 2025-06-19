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
@Component({
  selector: 'app-loan-recovery-conso',
  templateUrl: './loan-recovery-conso.component.html',
  styleUrls: ['./loan-recovery-conso.component.css']
})
export class LoanRecoveryConsoComponent {

  public static operations: mm_operation[] = [];
  @ViewChild('mattable') htmlData:ElementRef;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['brn_name','block_name','fund_type','loan_type','activity','loan_id','cust_name','trans_dt','curr_prn_recov','ovd_prn_recov','adv_prn_recov','tot_prn_recov','curr_intt_recov','ovd_intt_recov','penal_intt_recov','tot_intt_recov','total_recov_amt','last_intt_calc_dt'];
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
  totCurPrn=0;
  totCurIntt=0;
  totPenalIntt=0;
  totOvdPrn=0;
  totOvdIntt=0;
  totAdvPrn=0;
  totPRN=0;
  totINTT=0;
  totRECOVERY=0
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
 dummytotCount=0;
 dummytotCurPrn=0;
 dummytotCurIntt=0;
 dummytotPenalIntt=0;
 dummytotOvdPrn=0;
 dummytotOvdIntt=0;
 dummytotAdvPrn=0;
 dummytotPRN=0;
 dummytotINTT=0;
 dummytotRECOVERY=0
 dummytotNpaSum=0
 dummytotProvSum=0
 filteredArray1:any=[]
 firstGroup:any=[]
 secondGroup:any=[]
 selectItems=[
  {
    value:'Brach Name',
    name:'Brach Name'
  },
  {
    value:'Block Name',
    name:'Block Name'
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
  }
]
selectItems1=[
  {
    value:'Brach Name',
    name:'Brach Name'
  },
  {
    value:'Block Name',
    name:'Block Name'
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
      this.totCurPrn=0
      this.totCurIntt=0
      this.totOvdPrn=0
      this.totOvdIntt=0
      this.totAdvPrn=0
      this.totPenalIntt=0
      this.totPRN=0
      this.totINTT=0
      this.totRECOVERY=0

      this.fromdate = this.reportcriteria.controls.fromDate.value;
      const todate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        // "brn_cd":this.sys.BranchCode,
        // "acc_cd":this.reportcriteria.controls.acc_type_cd.value,
        "from_dt": this.fromdate.toISOString(),
        "to_dt": todate.toISOString()
      }
      debugger
      this.svc.addUpdDel('Loan/PopulateRecovRegConso',dt).subscribe(data=>{console.log(data)
        // this.reportData=data
         if(!data){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        }
        else{
          this.reportData=data
        }
        this.dataSource.data=this.reportData
        // this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
       
        
        // this.pageChange=document.getElementById('chngPage');
        // this.pageChange.click()
        // this.setPage(2);
        // this.setPage(1)
        this.modalRef.hide();
        // this.lastAccNum=this.reportData[this.reportData.length-1].loan_id
        console.log(this.lastAccNum)
        for(let i=0;i<this.reportData.length;i++){
          // this.totIssueSum+=this.reportData[i].total_recov_amt
          this.totCurPrn+=this.reportData[i].curr_prn_recov
          this.totCurIntt+=this.reportData[i].curr_intt_recov
          this.totOvdPrn+=this.reportData[i].ovd_prn_recov
          this.totOvdIntt+=this.reportData[i].ovd_intt_recov
          this.totAdvPrn+=this.reportData[i].adv_prn_recov
          this.totPenalIntt+=this.reportData[i].penal_intt_recov
          this.totPRN+=this.reportData[i].tot_prn_recov
          this.totINTT+=this.reportData[i].tot_intt_recov
          this.totRECOVERY+=this.reportData[i].total_recov_amt
    
        }
        
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
     case "Brach Name": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].brn_name
     }
      break;
      case "Block Name": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].block_name
     }
      break;
      //  console.log(this.blockNames)
      case "Activity": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].activity
     }
        break;
      case "Loan Type": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].loan_type
     }
     break;
     case "Fund Type": 
     for(let i=0;i<this.reportData.length;i++){
       this.firstGroup[i]=this.reportData[i].fund_type
    }
    // this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
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
      case "Brach Name": 
      this.filteredArray=this.reportData.filter(e=>e.brn_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
      break;
      case "Block Name": 
      this.filteredArray=this.reportData.filter(e=>e.block_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
      break;
      case "Activity": 
      this.filteredArray=this.reportData.filter(e=>e.activity?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
      case "Loan Type": 
      this.filteredArray=this.reportData.filter(e=>e.loan_type?.toLowerCase().includes(this.bName.toLowerCase())==true)
      break;
      case "Fund Type": 
      this.filteredArray=this.reportData.filter(e=>e.fund_type?.toLowerCase().includes(this.bName.toLowerCase())==true)
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
       case "Brach Name": 
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].brn_name
     }break;
     case "Block Name": 
     for(let i=0;i<this.filteredArray1.length;i++){
       this.secondGroup[i]=this.filteredArray1[i].block_name
    }break;
     
     case "Activity": 
     for(let i=0;i<this.filteredArray1.length;i++){
       this.secondGroup[i]=this.filteredArray1[i].activity
    }break;
      case "Loan Type": 
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].loan_type
     }
     break;
      case "Fund Type": 
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].fund_type
     }
    // this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
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
      case "Brach Name": 
      this.filteredArray=this.filteredArray1.filter(e=>e.brn_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
        break;
        case "Block Name": 
        this.filteredArray=this.filteredArray1.filter(e=>e.block_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
          break;
        case "Activity": 
      this.filteredArray=this.filteredArray1.filter(e=>e.activity?.toLowerCase().includes(this.bName1.toLowerCase())==true)
        break;
      case "Loan Type": 
    this.filteredArray=this.filteredArray1.filter(e=>e.loan_type?.toLowerCase().includes(this.bName1.toLowerCase())==true)
      break;
      case "Fund Type": 
    this.filteredArray=this.filteredArray1.filter(e=>e.fund_type?.toLowerCase().includes(this.bName1.toLowerCase())==true)
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
      case "Brach Name": 
      this.filteredArray=this.reportData.filter(e=>e.brn_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
          break;
      case "Block Name": 
      this.filteredArray=this.reportData.filter(e=>e.block_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
              break;
      case "Activity": 
      this.filteredArray=this.reportData.filter(e=>e.activity?.toLowerCase().includes(this.bName.toLowerCase())==true)
          break;
      case "Loan Type": 
      this.filteredArray=this.reportData.filter(e=>e.loan_type?.toLowerCase().includes(this.bName.toLowerCase())==true)
          break;
          case "Fund Type": 
      this.filteredArray=this.reportData.filter(e=>e.fund_type?.toLowerCase().includes(this.bName.toLowerCase())==true)
          break;
      
         

    }
    this.dataSource.data=this.filteredArray
    this.getTotal()

    // this.filteredArray.forEach(e=>
    //   {
    //    if(e.brn_name.includes(filterValue))
    // this.dataSource.data=this.filteredArray
    // console.log(this.dataSource.data)

      
    //   })
  }
  applyFilter1(event:Event){
    const filterValue=(event.target as HTMLInputElement).value
    this.filteredArray=this.dataSource.data
    switch(this.selectedValue){
      case "Brach Name": 
      this.filteredArray=this.reportData.filter(e=>e.brn_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
        case "Block Name": 
        this.filteredArray=this.reportData.filter(e=>e.block_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
          break;
        case "Activity": 
      this.filteredArray=this.reportData.filter(e=>e.activity?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
      case "Loan Type": 
      this.filteredArray=this.reportData.filter(e=>e.loan_type?.toLowerCase().includes(this.bName.toLowerCase())==true)
      break;
      case "Fund Type": 
      this.filteredArray=this.reportData.filter(e=>e.fund_type?.toLowerCase().includes(this.bName.toLowerCase())==true)
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
    
    this.totCurPrn=this.dummytotCurPrn
    this.totCurIntt=this.dummytotCurIntt
    this.totOvdPrn=this.dummytotOvdPrn
    this.totOvdIntt=this.dummytotOvdIntt
    this.totAdvPrn=this.dummytotAdvPrn
    this.totPenalIntt=this.dummytotPenalIntt
    this.totPRN=this.dummytotPRN
    this.totINTT=this.dummytotINTT
    this.totRECOVERY=this.dummytotRECOVERY
    
    this.selectedValue=''
    this.selectedValue1=''
    this.bName=''
   this.bName1=''
    
    
  }
  getTotal(){
    this.totCurPrn=0
    this.totCurIntt=0
    this.totOvdPrn=0
    this.totOvdIntt=0
    this.totAdvPrn=0
    this.totPenalIntt=0
    this.totPRN=0
    this.totINTT=0
    this.totRECOVERY=0
    this.totCount=0
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      this.totCurPrn+=this.filteredArray[i].curr_prn_recov
      this.totCurIntt+=this.filteredArray[i].curr_intt_recov
      this.totOvdPrn+=this.filteredArray[i].ovd_prn_recov
      this.totOvdIntt+=this.filteredArray[i].ovd_intt_recov
      this.totAdvPrn+=this.filteredArray[i].adv_prn_recov
      this.totPenalIntt+=this.filteredArray[i].penal_intt_recov
      this.totPRN+=this.filteredArray[i].tot_prn_recov
      this.totINTT+=this.filteredArray[i].tot_intt_recov
      this.totRECOVERY+=this.filteredArray[i].total_recov_amt
      // this.totIssueSum+=this.filteredArray[i].total_recov_amt
      this.totCount=this.dataSource.filteredData.length

    }
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'mattable'
    }
    this.exportAsService.save(this.exportAsConfig, 'Coso_Loan_Recovery').subscribe(() => {
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
