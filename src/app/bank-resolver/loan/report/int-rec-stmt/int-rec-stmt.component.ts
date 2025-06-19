import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { RestService } from 'src/app/_service';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
@Component({
  selector: 'app-int-rec-stmt',
  templateUrl: './int-rec-stmt.component.html',
  styleUrls: ['./int-rec-stmt.component.css']
})
export class IntRecStmtComponent implements OnInit {
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
  
  constructor(private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService, private cd: ChangeDetectorRef, private modalService: BsModalService,private router: Router) { }
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
    this.modalRef = this.modalService.show(content, this.config);
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem);
    this.cd.detectChanges();
  }
  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else {
      this.totDisb=0
      this.totcurrprnrecov=0
      this.totadvprnrecov=0
      this.totovdprnrecov=0
      this.totrecov=0
      this.totcurprn=0
      this.totovdprn=0
      this.totbal=0
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString(),
        "fund_type":this.reportcriteria.controls.fundType.value
      }
      this.isLoading=true;
      this.showAlert = false;
      this.svc.addUpdDel('Loan/PopulateInttRecovStmt',dt).subscribe(data=>{console.log(data)
        this.reportData=data
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
        this.reportData.forEach(e => {
          this.totDisb+=e.curr_intt_recov
          this.totcurrprnrecov+=e.penal_intt_recov
          this.totadvprnrecov+=e.ovd_intt_recov
          this.totovdprnrecov+=e.curr_intt_recov
          this.totrecov+=e.ovd_intt_calculated
          this.totcurprn+=e.penal_intt_calculated
          this.totovdprn+=e.penal_intt_calculated
          this.totbal+=e.curr_prn+e.ovd_prn
          this.lastAct=e.acc_cd
        });
      })
    }
  }
 closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
}
