import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MessageType, mm_acc_type, mm_customer, mm_kyc, p_loan_param, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { InAppMessageService, RestService } from 'src/app/_service';
import { p_gen_param } from '../../Models/p_gen_param';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CommonServiceService } from '../../common-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
export interface TransactionPrintData {
  brn_cd: string;
  trans_dt: string;
  trans_cd: number;
  voucher_id: string;
  acc_cd: number;
  acc_type: string;
  trans_type: string;
  trans_mode: string;
  acc_num: string;
  cust_name: string;
  amount: number;
  panalty: number;
  curr_prn_recov: number;
  curr_intt_recov: number;
  ovd_intt_recov: number;
  balance: number;
}
@Component({
  selector: 'app-transaction-print',
  templateUrl: './transaction-print.component.html',
  styleUrls: ['./transaction-print.component.css']
})
export class TransactionPrintComponent implements OnInit {
  displayedColumns: string[] = ['index', 'trans_cd', 'voucher_id', 'trans_type', 'acc_type', 'acc_num', 'cust_name', 'amount', 'balance', 'print'];
  dataSource = new MatTableDataSource<TransactionPrintData>([]);

  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  constructor(private frmBldr: FormBuilder, private comser:CommonServiceService, private svc: RestService, private elementRef: ElementRef,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router) { }
    reportcriteria: FormGroup;
    showAlert = false;
    alertMsg = '';
    selectedFilter = 'B';
    fullCustData:TransactionPrintData;
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
    @ViewChild('contentLoanStmt', { static: true }) contentLoanStmt: TemplateRef<any>;
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.reportcriteria = this.frmBldr.group({
      fromDate: [null, Validators.required],
      toDate: [null, null]
    });
    this.onLoadScreen(this.content);
    this.asOnDate =this.sys.CurrentDate;
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
        // "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "adt_trans_dt":this.fromdate.toISOString()
      }
      this.svc.addUpdDel('Common/PopulateTransPrint',dt).subscribe((data:any)=>{console.log(data)
      
      if(data){
        this.reportData=data;
        // this.reportData2=data;
        this.dataSource.data=data;
      } 
      else{
        this.comser.SnackBar_Nodata()
      }
      this.isLoading=false;
      this.modalRef.hide();
      },
      err => {
         this.isLoading = false;
         this.comser.SnackBar_Error(); 
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
   printWithoutPreview() {
    const printContents = document.getElementById('mattable2')?.innerHTML;
    if (printContents) {
      const printWindow = window.open('', '', 'width=0,height=0');
      printWindow?.document.write(`
        <html><head><title>Print</title>
        <style>
          @media print {
            body { font-family: 'Verdana'; font-size: 11px; line-height: 1.2; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; font-size: 11px; }
            p { margin: 1px 0; font-size: 11px; }
           
          }
        </style>
        </head><body>
        ${printContents}
        <script>
          window.onload = function() { 
            window.print(); 
            window.close(); 
          }
        <\/script>
        </body></html>
      `);
      printWindow?.document.close();
    }
  }
   ConfrmModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  openModal(template: TemplateRef<any> , cust:TransactionPrintData){
    debugger
    // this.fullCustData=new TransactionPrintData();
    this.fullCustData={...cust};
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
