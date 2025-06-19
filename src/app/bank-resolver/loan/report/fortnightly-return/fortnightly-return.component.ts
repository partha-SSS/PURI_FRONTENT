import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { RestService } from 'src/app/_service';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
@Component({
  selector: 'app-fortnightly-return',
  templateUrl: './fortnightly-return.component.html',
  styleUrls: ['./fortnightly-return.component.css']
})
export class FortnightlyReturnComponent implements OnInit {

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  reportcriteria: FormGroup;
  showAlert = false;
  isLoading = false;
  alertMsg = '';
  dt: any;
  fromdate: Date;
  toDate: Date;
  suggestedCustomer: mm_customer[];
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  Alldata:any = [];
  reportData:any=null
  reportData2:any=null
  reportData3:any=null
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
  loanNm:any;
  lastLoanID:any
  totalSum=0;
  lastBlock:any;
  lastAct:any
  totIntt=0
  totOut=0
  totDisb=0
  totadvprnrecov=0
  totcurrprnrecov=0
  totovdprnrecov=0
  totrecov=0
  totcurprn=0
  totovdprn=0
  totbal=0
  currFinYear=localStorage.getItem('__curFinyr')
  finLastDate:any
  finFastDate:any
  yearFastDay:any
  constructor(private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService, private cd: ChangeDetectorRef, private modalService: BsModalService,private router: Router) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today= n + " "+ time
    this.getFinYear();
  }
  getFinancialYear(date: Date): string {
  const year = date.getFullYear();
  const march31 = new Date(year, 2, 31); // March is month 2 (0-indexed)

  if (date > march31) {
    // New financial year starts after 31st March
    return `${year}-${year + 1}`;
  } else {
    // Still in the previous financial year
    return `${year - 1}-${year}`;
  }
}
  getFinYear(){
    const inputDateStr = localStorage.getItem('__lastDt')
    const [day, month, year] = inputDateStr.split('/');
    const fastYearDay = `0${Number(day)-30}/0${Number(month)+1}/${Number(year)-1}`;
    this.yearFastDay=fastYearDay;
    const date = new Date(`${year}-${month}-${Number(day)-1}T18:30:00.000Z`);
    this.finLastDate = date.toISOString();
    const date2 = new Date(`${Number(year)-1}-${month}-${day}T18:30:00.000Z`);
    this.finFastDate = date2.toISOString();
    debugger
    console.log(this.finFastDate);
    console.log(this.finLastDate);
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
      this.isLoading=true;
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        // "from_dt":"2023-03-31T18:30:00.000Z",
        "from_dt":this.fromdate,
        "from_dt_demand":this.finFastDate,
        "to_dt":this.toDate,
        "to_dt_demand":this.finLastDate,
        "fund_type":'N'
      }
     
      this.showAlert = false;
      this.svc.addUpdDel('Loan/GetFortnightDemand',dt).subscribe(data=>{console.log(data)
        this.Alldata=data;
        debugger
          this.reportData=this.Alldata.fortnight_demand
          this.reportData2=this.Alldata.fortnight_recov
          this.reportData3=this.Alldata.fortnight_prog_recov

        debugger
        this.modalRef.hide();
       this.isLoading=false;
      })
    }
  }
 closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
}
