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
  selector: 'app-risk-fund',
  templateUrl: './risk-fund.component.html',
  styleUrls: ['./risk-fund.component.css']
})
export class RiskFundComponent implements OnInit{
  public static operations: mm_operation[] = [];
  @ViewChild('mattable') htmlData:ElementRef;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['srl_no','br_name','block_name','purpose','loan_id','curr_intt','party_cd','party_name','party_address','disb_dt','disb_amt','claim_amt','loan_case_no','land_hold'];
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
      this.totIssueSum=0;
      this.totInttDue=0;
          
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
      this.svc.addUpdDel('Loan/RiskFundReport',dt).subscribe(data=>{console.log(data)
        // this.reportData=data
         if(!data){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        }
        else{
          this.reportData=data;
          for(let i=0;i<this.reportData.length;i++){
            this.reportData[i].disb_dt=this.comSer.getFormatedDate(this.reportData[i].disb_dt);
          }
          
        }
        this.dataSource.data=this.reportData
        // this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        this.isLoading=false
       
        this.modalRef.hide();
        this.reportData.forEach(e => {
          this.totIssueSum+=e.disb_amt
          this.totInttDue+=e.claim_amt
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
 
  public closeAlert() {
    this.showAlert = false;
  }
  takeLoanVal(e:any){
    console.log(e)
  }
 
  
  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    console.log(event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getTotal()
  }
  getTotal(){
    this.totIssueSum=0;
    this.totInttDue=0;
    this.totCount=0
    console.log(this.dataSource.filteredData)
    this.filteredArray=this.dataSource.filteredData
    for(let i=0;i<this.filteredArray.length;i++){
      this.totIssueSum+=this.filteredArray[i].disb_amt
      this.totInttDue+=this.filteredArray[i].claim_amt
      this.totCount=this.dataSource.filteredData.length

    }
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'mattable'
    }
    this.exportAsService.save(this.exportAsConfig, 'RiskFundRep').subscribe(() => {
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
