import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild ,AfterViewInit, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SystemValues, mm_customer, p_report_param, mm_operation, mm_acc_type } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import { DetailListComponent } from '../detail-list/detail-list.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
 
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

import { MatTable } from '@angular/material/table';
@Component({
  selector: 'app-npa',
  templateUrl: './npa.component.html',
  styleUrls: ['./npa.component.css']
})
export class NpaComponent implements OnInit,AfterViewInit {
  public static operations: mm_operation[] = [];
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['loan_id','block_name','party_name','activity','case_no','disb_dt','disb_amt', 'prn_due', 'intt_due','npa_dt','ovd_prn','ovd_intt','stan_prn','substan_prn','d1_prn','d2_prn','d3_prn','totalNPA','provision'];
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
  blocks:any[]=[];
  blocks1:any[]=[];
  AcctTypes:  mm_acc_type[] = [];
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
  totPrnDue=0;
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
    this.getBlock();
    this.isLoading=true;
    this.fromdate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      block: [null, Validators.required],
      fromDate: [null, Validators.required],
      acc_type_cd: [null, Validators.required],
      fType: [null, Validators.required]
    });
    this.getAccountTypeList();
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
          this.totPrnDue=0
          this.totInttDue=0
          this.totPenalIntt=0
          this.totOvdPrn=0
          this.totOvdIntt=0
          this.totStan=0
          this.totSubStan=0
          this.totD1=0
          this.totD2=0
          this.totD3=0
          this.totNpaSum=0
          this.totProvSum=0
      this.loanNm=this.AcctTypes.filter(e=>e.acc_type_cd==this.reportcriteria.controls.acc_type_cd.value)[0].acc_type_desc
      this.getBlockName();
      console.log(this.blocks,this.blocks1,this.reportcriteria.controls.block.value)
      debugger  
      console.log(this.loanNm)
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "acc_cd":this.reportcriteria.controls.acc_type_cd.value,
        "adt_dt":this.fromdate.toISOString(),
        "fund_type":this.reportcriteria.controls.fType.value
      }
      this.svc.addUpdDel('Loan/PopulateNPAList',dt).subscribe(data=>{console.log(data)
        // this.reportData=data
         if(!data){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        }
        else{
          this.reportData=data;
          if(this.reportcriteria.controls.block.value!="0"){
            this.reportData=this.reportData.filter(e=>e.block_name?.toLowerCase()==this.blocks1[0]?.block_name?.toLowerCase())
            debugger
          }
          else{
          // this.reportData.filter(e=>e.block_name?.toLowerCase()==this.blocks1[0]?.block_name?.toLowerCase())
          }
          for(let i=0;i<this.reportData.length;i++){
            if(this.reportData[i].npa_dt.substr(0,10)=='01/01/0001'){
              this.reportData[i].npa_dt='';
            }
            else{
              this.reportData[i].npa_dt=this.comSer.getFormatedDate(this.reportData[i].npa_dt);
            }
            this.reportData[i].disb_dt=this.comSer.getFormatedDate(this.reportData[i].disb_dt);
            
          }
        }
        debugger
        this.dataSource.data=this.reportData
        // this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
       
        
        // this.pageChange=document.getElementById('chngPage');
        // this.pageChange.click()
        // this.setPage(2);
        // this.setPage(1)
        this.modalRef.hide();
        // this.lastAccNum=this.reportData[this.reportData.length-1].loan_id
        // console.log(this.lastAccNum)
        this.reportData.forEach(e => {
          if(e.npa_dt=='01/01/0001 00:00'){
            e.npa_dt=null;
          }
          this.totIssueSum+=e.disb_amt
          this.totPrnDue+=e.prn_due
          this.totInttDue+=e.intt_due
          this.totPenalIntt+=e.penal_intt
          this.totOvdPrn+=e.ovd_prn
          this.totOvdIntt+=e.ovd_intt
          this.totStan+=e.stan_prn
          this.totSubStan+=e.substan_prn
          this.totD1+=e.d1_prn
          this.totD2+=e.d2_prn
          this.totD3+=e.d3_prn
          this.totNpaSum=(+this.totD1)+ (+this.totD2)+(+this.totD3)+(+this.totSubStan)
          this.totProvSum+=e.provision
            this.dummytotIssueSum+=e.disb_amt
            this.dummytotPrnDue+=e.prn_due
            this.dummytotInttDue+=e.intt_due
            this.dummytotPenalIntt+=e.penal_intt
            this.dummytotOvdPrn+=e.ovd_prn
            this.dummytotOvdIntt+=e.ovd_intt
            this.dummytotStan+=e.stan_prn
            this. dummytotSubStan+=e.substan_prn
            this. dummytotD1+=e.d1_prn
            this.dummytotD2+=e.d2_prn
            this.dummytotD3+=e.d3_prn
            this. dummytotNpaSum+=e.d1_prn+e.d2_prn+e.d3_prn+e.substan_prn
            this.dummytotProvSum+=e.provision
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
      case "Activity": 
      for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].activity
     }
      
    // this.filteredArray=this.reportData.filter(e=>e.activity_cd?.toLowerCase().includes(filterValue.toLowerCase())==true)
      break;
      case "Party Name":
        for(let i=0;i<this.reportData.length;i++){
          this.firstGroup[i]=this.reportData[i].party_name
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
      this.filteredArray=this.reportData.filter(e=>e.activity?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
     
      case "Party Name":
    this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(this.bName.toLowerCase())==true)
     break;
     case "Interest Upto":
      this.filteredArray=this.reportData.filter(e=>e.computed_till_dt.includes(this.bName)==true)
       break;
       case "Issue DT":
        this.filteredArray=this.reportData.filter(e=>e.disb_dt.includes(this.bName)==true)
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
     }
      break;
      case "Activity": 
      for(let i=0;i<this.filteredArray1.length;i++){
        this.secondGroup[i]=this.filteredArray1[i].activity
     }
      break;
      
      case "Party Name":
        for(let i=0;i<this.filteredArray1.length;i++){
          this.secondGroup[i]=this.filteredArray1[i].party_name
       }
    // this.filteredArray=this.reportData.filter(e=>e.party_name?.toLowerCase().includes(filterValue.toLowerCase())==true)
     break;
     
       case "Loan ID":
        for(let i=0;i<this.filteredArray1.length;i++){
          this.secondGroup[i]=this.filteredArray1[i].loan_id
       }
        // this.filteredArray=this.reportData.filter(e=>e.loan_id?.toLowerCase().includes(filterValue.toLowerCase())==true)
         break;
         case "Issue DT":
          for(let i=0;i<this.filteredArray1.length;i++){
            this.secondGroup[i]=this.filteredArray1[i].disb_dt
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
      this.filteredArray=this.filteredArray1.filter(e=>e.activity?.toLowerCase().includes(this.bName1.toLowerCase())==true)
        break;
      
      case "Party Name":
    this.filteredArray=this.filteredArray1.filter(e=>e.party_name?.toLowerCase().includes(this.bName1.toLowerCase())==true)
     break;
    
       case "Issue DT":
        this.filteredArray=this.filteredArray1.filter(e=>e.disb_dt.includes(this.bName1)==true)
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
      this.filteredArray=this.reportData.filter(e=>e.activity?.toLowerCase().includes(this.bName.toLowerCase())==true)
          break;
      
      case "Party Name":
      this.filteredArray=this.reportData.filter(e=>e.party_name.toLowerCase().includes(this.bName.toLowerCase())==true)
         break;
      case "Loan ID":
      this.filteredArray=this.reportData.filter(e=>e.loan_id.toLowerCase().includes(this.bName.toLowerCase())==true)
         break;
         case "Issue DT":
        this.filteredArray=this.filteredArray1.filter(e=>e.disb_dt.includes(this.bName1)==true)
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
      this.filteredArray=this.reportData.filter(e=>e.activity?.toLowerCase().includes(this.bName.toLowerCase())==true)
        break;
     
      case "Party Name":
      this.filteredArray=this.filteredArray.filter(e=>e.party_name.toLowerCase().includes(this.bName.toLowerCase())==true)
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
      this.totPrnDue=this.dummytotPrnDue
      this.totInttDue=this.dummytotInttDue
      this.totPenalIntt= this.dummytotPenalIntt
      this.totOvdPrn=this.dummytotOvdPrn
      this.totOvdIntt=this.dummytotOvdIntt
      this.totStan=this.dummytotStan
      this.totSubStan=this.dummytotSubStan
      this.totD1=this.dummytotD1
      this.totD2=this.dummytotD2
      this.totD3=this.dummytotD3
      this.totNpaSum=this.dummytotNpaSum
      this.totProvSum=this.dummytotProvSum
    
    this.selectedValue=''
    this.selectedValue1=''
    this.bName=''
   this.bName1=''
    
    
  }
  getTotal(){
    this.totIssueSum=0
    this.totPrnDue=0
    this.totInttDue=0
    this.totPenalIntt=0
    this.totOvdPrn=0
    this.totOvdIntt=0
    this.totStan=0
    this.totSubStan=0
    this.totD1=0
    this.totD2=0
    this.totD3=0
    this.totNpaSum=0
    this.totProvSum=0
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      this.totIssueSum+=this.filteredArray[i].disb_amt
      this.totPrnDue+=this.filteredArray[i].prn_due
      this.totInttDue+=this.filteredArray[i].intt_due
      this.totPenalIntt+=this.filteredArray[i].penal_intt
      this.totOvdPrn+=this.filteredArray[i].ovd_prn
      this.totOvdIntt+=this.filteredArray[i].ovd_intt
      this.totStan+=this.filteredArray[i].stan_prn
      this.totSubStan+=this.filteredArray[i].substan_prn
      this.totD1+=this.filteredArray[i].d1_prn
      this.totD2+=this.filteredArray[i].d2_prn
      this.totD3+=this.filteredArray[i].d3_prn
      this.totNpaSum=(+this.totD1)+ (+this.totD2)+(+this.totD3)+(+this.totSubStan)
      this.totProvSum+=this.filteredArray[i].provision

    }
  }
  // private pdfmake : pdfMake;
  
//   exportPDFTitle(){
//     const doc = new jspdf('landscape', 'pt', 'a4');

//     const table = document.getElementById('mattable');
//     const rows = table.getElementsByTagName('tr');

//     for (let i = 0; i < rows.length; i++) {
//       const row = rows[i];
//       html2canvas(row).then(canvas => {
//         const imgData = canvas.toDataURL('image/png');
//         doc.addImage(imgData, 'PNG', 10, 10, 0, 0);
//         if (i < rows.length - 1) {
//           doc.addPage();
//         }
//         doc.save('my-document.pdf');
//       });
//   }
// }
//   exportPDFTitle() {
//     var data = document.getElementById('mattable');
// html2canvas(data).then(canvas => {
// // Few necessary setting options
// var imgWidth = 208;
// var pageHeight = 295;
// var imgHeight = canvas.height * imgWidth / canvas.width;
// var heightLeft = imgHeight;
 
// const contentDataURL = canvas.toDataURL('image/png')
// let pdf = new jspdf('l', 'mm', 'a4'); // A4 size page of PDF
// var position = 0;
// pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
// pdf.save('MYPdf.pdf'); // Generated PDF
// });
    
// }
downloadexcel(){
  this.exportAsConfig = {
    type: 'xlsx',
    // elementId: 'hiddenTab', 
    elementIdOrContent:'mattable'
  }
  this.exportAsService.save(this.exportAsConfig, 'NPAList').subscribe(() => {
    // save started
    console.log("hello")
  });
}
exportPDFTitle() {
  const doc = new jspdf('landscape');

  const content = document.getElementById('mattable') as HTMLDivElement; // get the HTML content element

  html2canvas(content).then(canvas => { // use html2canvas to convert the HTML content to a canvas
    const imageData = canvas.toDataURL('image/png', 1.0); // convert the canvas to an image data URL
    doc.addImage(imageData, 'PNG', 10, 10, doc.internal.pageSize.width, 0); // add the image to the PDF
    doc.save('sample.pdf'); // save the PDF with a filename
  });
}

}
