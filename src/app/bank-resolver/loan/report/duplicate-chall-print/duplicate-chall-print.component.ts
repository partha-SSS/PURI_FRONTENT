import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MessageType, mm_acc_type, mm_customer, mm_kyc, p_loan_param, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { InAppMessageService, RestService } from 'src/app/_service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';

export interface LoanRecovery {
  address: string;
  adv_prn_recov: number;
  amt_word: string;
  bank_add: string;
  bank_name: string;
  block_name: string;
  branch_name: string;
  brn_cd: string | null;
  created_by: string;
  curr_intt_bal: number;
  curr_intt_rate: number;
  curr_intt_recov: number;
  curr_prn_bal: number;
  curr_prn_recov: number;
  curr_rt: number;
  cust_name: string;
  guardian_name: string;
  intt_till_dt: string; // Could be Date if parsed
  loan_id: string;
  loan_type: string;
  ovd_intt_bal: number;
  ovd_intt_rate: number;
  ovd_intt_recov: number;
  ovd_prn_bal: number;
  ovd_prn_recov: number;
  ovd_rt: number;
  penal_intt_bal: number;
  penal_intt_recov: number;
  purpose: string;
  share_amt: number;
  total_recovery: number;
  trans_cd: number;
  trans_dt: string; // Could be Date if parsed
  trans_mode: string | null;
  trans_type: string;
  trf_type: string;
}
@Component({
  selector: 'app-duplicate-chall-print',
  templateUrl: './duplicate-chall-print.component.html',
  styleUrls: ['./duplicate-chall-print.component.css']
})
export class DuplicateChallPrintComponent implements OnInit {
  displayedColumns: string[] = ['index', 'trans_cd', 'trans_type', 'acc_type', 'acc_num', 'cust_name','guardian_name', 'amount',  'print'];
  dataSource = new MatTableDataSource<LoanRecovery>([]);

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  constructor(private frmBldr: FormBuilder, private comSer:CommonServiceService, private svc: RestService, private elementRef: ElementRef,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router) { }
    reportcriteria: FormGroup;
    showAlert = false;
    alertMsg = '';
    selectedFilter = 'B';
    fullCustData:LoanRecovery;
    reportData:any[]=[];
    sys = new SystemValues();
    accountTypeList: mm_acc_type[]= [];
    param :p_loan_param[]=[];
    isTrade: boolean = false;
    isLoading = false;
    modalRef: BsModalRef;
    custMstrFrm: FormGroup;
    fromdate :Date;
    ardbName=localStorage.getItem('ardb_name')
    branchName=this.sys.BranchName
    get f() { return this.custMstrFrm.controls; }
    config = {
      keyboard: false, // ensure esc press doesnt close the modal
      backdrop: true, // enable backdrop shaded color
      ignoreBackdropClick: true // disable backdrop click to close the modal
    };
    relStatus:any;
    lbr_status: any = [];
    KYCTypes: mm_kyc[] = [];
    uniqueUCIC:number=0
    showMsg: ShowMessage;
    isOpenFromDp = false;
    asOnDate : any;
    suggestedCustomer: mm_customer[];
    suggestedCustomer2: any[]=[];
    custNAME:any;
    today:any;
    @ViewChild('contentLoanStmt', { static: true }) contentLoanStmt: TemplateRef<any>;
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.reportcriteria = this.frmBldr.group({
      fromDate: [null, Validators.required],
      toDate: [null, null]
    });
    this.onLoadScreen(this.content);
    this.asOnDate =this.sys.CurrentDate;
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  public closeAlert() {
    this.showAlert = false;
  }
  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }

    else {
      this.modalRef.hide();
      this.showAlert = false;
      this.fromdate=this.reportcriteria.value['fromDate'];
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "trans_dt":this.fromdate.toISOString()
      }
      this.svc.addUpdDel('Loan/PopulateLoanRecoveryReceipt',dt).subscribe((data:any)=>{console.log(data)
      
      if(data){
        this.reportData=data;
        // this.reportData2=data;
        this.dataSource.data=data;
      } 
      else{
        this.comSer.SnackBar_Nodata()
          this.isLoading=false
      }
      this.isLoading=false;
      this.modalRef.hide();
      },
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
        })

      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 10000);
    }
  }
  public onDobChange(value: Date): number {
    debugger
     if (null !== value) {
      const dob = new Date(value);
      const currentDate = new Date();
      const timeDiff = currentDate.getTime() - dob.getTime();
      const age = Math.floor(timeDiff / (365.25 * 24 * 60 * 60 * 1000));
      debugger
      return age;
     }
   }
  
   ConfrmModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  openModal(template: TemplateRef<any> , cust:LoanRecovery){
    debugger
    // this.fullCustData=new LoanRecovery();
    this.fullCustData={...cust};
    const str = this.fullCustData.created_by;
    const part = str.split("/")[0];
    this.fullCustData.created_by=part;

    this.modalRef = this.modalService.show(template);
    this.modalRef.setClass('modal-xl');
  }
  private getKYCTypMaster(): void {
    this.svc.addUpdDel<mm_kyc[]>('Mst/GetKycMaster', null).subscribe(
      res => {
        console.log(this.KYCTypes)
        this.KYCTypes = res;
      },
      err => { }
    );
  }
  setMerge(cust, event) {
    cust.merge_flag = event.target.checked ? 'Y' : 'N';
    debugger
       this.suggestedCustomer.forEach(e=>{
        if(e.cust_cd==cust.cust_cd){
          // e.merge_flag="Y";
          e.merged_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
        }
        debugger
       })
     }
     setUnique(event) {
      debugger
      this.suggestedCustomer.forEach(e=>{
        if(e.cust_cd==event.cust_cd){
          e.unique_flag="Y";
          this.uniqueUCIC=e.cust_cd;
        }
        else{
          e.unique_flag="N"
        }
        debugger
       })
       }
  getAccountTypeList() {
    ;

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        ;
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'L');
        this.accountTypeList.forEach(x=>x.calc=false);
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        ;
      }
    );
  }
  
  allTrades(event) {
    ;
    const checked = event.target.checked;
    if(checked)
    this.accountTypeList.forEach(item => item.calc = true);
    else
    this.accountTypeList.forEach(item => item.calc = false);
  }
 
  onReset(){
    // this.suggestedCustomer = [];
    this.onLoadScreen(this.content);
    this.asOnDate =this.sys.CurrentDate;
  }
  onFilterChange(event:any){
    this.dataSource.data=[];
    debugger
    this.selectedFilter = event.value;
    if (this.selectedFilter == 'C') {
      this.dataSource.data=this.reportData.filter(e => e.trans_type === 'D' || e.trans_type === 'R');
    }
    else if (this.selectedFilter == 'D') {
      this.dataSource.data=this.reportData.filter(e => e.trans_type === 'W' || e.trans_type === 'B');
    }
    else{
      this.dataSource.data=this.reportData;
    }

  }
  getAllCustomer(){
    this.isLoading=true;
    const prm = new p_gen_param();
     prm.as_cust_name = this.custNAME;
     prm.ardb_cd=this.sys.ardbCD;
    this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
      res => {
        console.log(res)
        this.isLoading=false;
        if (undefined !== res && null !== res && res.length > 0) {
          this.suggestedCustomer = res
          return res
        } else {
          this.suggestedCustomer = [];
          return [];
        }
      },
      err => { this.isLoading = false; }
    );
  }

  /** Below method handles message show/hide */
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
