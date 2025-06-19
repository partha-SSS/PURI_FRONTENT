import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { RestService } from 'src/app/_service';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
export interface LendingFinancialYear {
  brn_cd: string;
  year: number;
  description: string | null;
  farm_loan: number;
  non_farm: number;
  rural_housing: number;
  shg: number;
  sccy: number;
  jlg: number;
  others: number;
  total_target_of_investment_for_the_year: number;
  target_of_investment_in_the_previous_year: number;
}
@Component({
  selector: 'app-ct-fortnight-new-conso',
  templateUrl: './ct-fortnight-new-conso.component.html',
  styleUrls: ['./ct-fortnight-new-conso.component.css']
})
export class CtFortnightNewConsoComponent {

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
  reportData4:any=null
  reportData5:any=null
  reportData6:any=null
  reportData7:any=null
  reportData8:any=null
  reportData9:any=null
  reportData10:any=null
  reportData11:any=null
  reportData12:any=null
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

  total: LendingFinancialYear;
  constructor(private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService, private cd: ChangeDetectorRef, private modalService: BsModalService,private router: Router) { }
  ngOnInit(): void {
    const nextYear = (+this.currFinYear) + 1;
    this.currFinYear=`${this.currFinYear} - ${nextYear}`
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
      this.svc.addUpdDel('Loan/FortNightlyReturnConsole',dt).subscribe(data=>{console.log(data)
        this.Alldata=data[0];
        
          this.reportData=this.Alldata.demand_Financial_Year_Principal
          this.reportData2=this.Alldata.demand_Financial_Year_Interest
          this.reportData3=this.Alldata.collection_Fortnight_Principal
          this.reportData4=this.Alldata.collection_Fortnight_Interest
          this.reportData5=this.Alldata.progressive_Collection_Principal
          this.reportData6=this.Alldata.progressive_Collection_Interest
          this.reportData7=this.Alldata.target_Lending_Financial_Year
          this.reportData8=this.Alldata.lending_Fortnight
          this.reportData9=this.Alldata.progressive_Lending
          this.reportData10=this.Alldata.collection_Remittance
          this.reportData11=this.Alldata.remittance
          this.reportData12=this.Alldata.fund_Position
          if(this.reportData){
            this.reportData = this.reportData.sort((a , b) => (a.category.split('.')[0] < b.category.split('.')[0] ? -1 : 1))
            this.reportData2 = this.reportData2.sort((a , b) => (a.category.split('.')[0] < b.category.split('.')[0] ? -1 : 1))
            this.reportData3 = this.reportData3.sort((a , b) => (a.category.split('.')[0] < b.category.split('.')[0] ? -1 : 1))
            this.reportData4 = this.reportData4.sort((a , b) => (a.category.split('.')[0] < b.category.split('.')[0] ? -1 : 1))
            this.reportData5 = this.reportData5.sort((a , b) => (a.category.split('.')[0] < b.category.split('.')[0] ? -1 : 1))
            this.reportData6 = this.reportData6.sort((a , b) => (a.category.split('.')[0] < b.category.split('.')[0] ? -1 : 1))
            // this.reportData7 = this.reportData7.sort((a , b) => (a.description < b.description ? -1 : 1))
            this.reportData8 = this.reportData8.sort((a , b) => (a.description < b.description ? -1 : 1))
            this.reportData9 = this.reportData9.sort((a , b) => (a.description < b.description ? -1 : 1))
            this.reportData10 = this.reportData10.sort((a , b) => (a.collection_type < b.collection_type ? -1 : 1))
            this.total = this.createSummedObject(this.Alldata.target_Lending_Financial_Year);
          }
        debugger
        this.modalRef.hide();
       this.isLoading=false;
      })
    }
  }
  createSummedObject(array: LendingFinancialYear[]): LendingFinancialYear {
    return array.reduce((acc, obj) => {
      acc.farm_loan += obj.farm_loan;
      acc.non_farm += obj.non_farm;
      acc.rural_housing += obj.rural_housing;
      acc.shg += obj.shg;
      acc.sccy += obj.sccy;
      acc.jlg += obj.jlg;
      acc.others += obj.others;
      acc.total_target_of_investment_for_the_year += obj.total_target_of_investment_for_the_year;
      acc.target_of_investment_in_the_previous_year += obj.target_of_investment_in_the_previous_year;
      return acc;
    }, {
      brn_cd: '100',
      year: 2024,
      description: null,
      farm_loan: 0,
      non_farm: 0,
      rural_housing: 0,
      shg: 0,
      sccy: 0,
      jlg: 0,
      others: 0,
      total_target_of_investment_for_the_year: 0,
      target_of_investment_in_the_previous_year: 0
    });
  }
 closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'mattable'
    }
    this.exportAsService.save(this.exportAsConfig, 'Fortnight Report').subscribe(() => {
      // save started
      console.log("success")
    });
  }
}
