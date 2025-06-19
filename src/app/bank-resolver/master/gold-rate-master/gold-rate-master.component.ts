import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { MessageType, mm_acc_type, mm_customer, mm_operation, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { InAppMessageService, RestService } from 'src/app/_service';
import { p_gen_param } from '../../Models/p_gen_param';
import { LoanOpenDM } from '../../Models/loan/LoanOpenDM';
import { tm_loan_all } from '../../Models/loan/tm_loan_all';
export interface LoanLetter {
  brn_cd: string;
  loan_id: string;
  letter_type: string;
  letter_count: number;
  letter_amount: number;
  send_date: string;
  created_by: string;
  created_dt: string;
}

@Component({
  selector: 'app-gold-rate-master',
  templateUrl: './gold-rate-master.component.html',
  styleUrls: ['./gold-rate-master.component.css']
})
export class GoldRateMasterComponent {
  get fd() { return this.accDtlsFrm.controls; }

  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  accDtlsFrm: FormGroup;
  letterData:LoanLetter;
   AcctTypes: mm_operation[];
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true, // disable backdrop click to close the modal
    class: 'modal-lg'
  };
  currentDate: Date;
  passBookData:any[]=[];
  locker: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  UrlString = '';
  alertMsg = '';
  td: any;
  dt: any;
  fromdate: Date;
  toDate: Date;
  suggestedCustomer: mm_customer[];
  disabledOnNull=true
  counter=0
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  acc2 = new LoanOpenDM();
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
  newMode:boolean=false;
  editMode:boolean=false;
  showWait=false
  letterType:any[]=[
    {type:"Reminder Letter",id:"R"},
    {type:"Auction Letter",id:"A"}
  ]
  // locker_status=[
  //   {type:"Vacant",id:"V"},
  //   {type:"Allocated",id:"A"},
  // ]

  
  constructor(private svc: RestService, private elementRef: ElementRef,private formBuilder: FormBuilder,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router, private comser:CommonServiceService) { 
    // this.letterData.letter_type='R';
    // this.letterData.letter_amount=0;
    // this.letterData.letter_count=0;
    // this.letterData.send_date=this.sys.CurrentDate.toISOString();
    // this.letterData.created_by=this.sys.UserId;
    }
    accountTypeList: mm_acc_type[]= [];
    param :any[]=[];
    isTrade: boolean = false;
    showMsg: ShowMessage;
    asOnDate : any;
    name:any;
    shownoresult:any;
    loanID:any;

  ngOnInit(): void {
    this.accDtlsFrm = this.formBuilder.group({
      acct_num:[''],
      cust_name: [''],
      intt_recev: [''],
      curr_principal: [''],
      curr_intt: [''],
      curr_intt_rate: [''],
      ovd_principal: [''],
      ovd_intt: [''],
      ovd_intt_rate: [''],
      principal: [''],
      total_due: [''],
      disb_amt: [''],
      disb_dt: [''],
      penal_intt: [''],
      loan_status:[''],
      letter_type:[''],
      send_date:[''],
      letter_count:[''],
      letter_amount:['']
    });
    this.asOnDate =this.sys.CurrentDate;
    
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }
  convertDateFormat(dateString: string): string {
    const parts = dateString.split(" ")[0].split("/"); // Extract "01/01/1900"
    const formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`; // yyyy-MM-dd
    return formattedDate;
  }
  clearSuggestedCust(){
    this.suggestedCustomer = null;
    this.shownoresult=false
    if (this.fd.acct_num.value.length > 0) {
      this.disabledOnNull=false
    }
    else{
      this.disabledOnNull=true;
    }
}
public suggestCustomer(): void {
    this.isLoading=true;
    if (this.fd.acct_num.value.length > 0) {
      const prm = new p_gen_param();
      // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
      prm.brn_cd=this.sys.BranchCode
      prm.as_cust_name = this.fd.acct_num.value.toLowerCase();
      this.svc.addUpdDel<any>('Loan/GetLoanDtls1', prm).subscribe(
        res => {
          console.log(res)
          this.isLoading=false;

            this.name='Outstanding'
       
          if (undefined !== res && null !== res && res.length > 0) {
            // console.log('here')

            // this.suggestedCustomer = res.slice(0, 10);
            this.suggestedCustomer = res;
          } else {
            this.shownoresult=true;
            this.suggestedCustomer = [];
          }

        },
        err => {
          this.shownoresult=false;
          this.isLoading = false;
         }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }
  
  public SelectCustomer(cust: any): void {
    console.log(cust);
    this.getLoan(cust)
    this.loanID = cust.loan_id;
    debugger;
    this.fd.acct_num.setValue(cust.loan_id);
    this.suggestedCustomer = [];

  }
  getLoan(cust){
    const acc1 = new tm_loan_all();
        acc1.loan_id = cust.loan_id;
        acc1.brn_cd = this.sys.BranchCode;
        acc1.acc_cd = cust.acc_cd;
        // acc1.trans_cd = this.unapprovedTrans[0].trans_cd;
        // acc1.trans_dt = this.unapprovedTrans[0].trans_dt;
        // this.GetUnapprovedDepTrans()
        this.svc.addUpdDel<any>('Loan/GetLoanData', acc1).subscribe(
          res => {
            console.log(res);
            if(res){
              this.acc2=res;
              this.setLetterCharge()
            }else{
              console.log("no DAta");
              
            }
            ////////debugger;
            // acc = res;
          })
  }
  setLetterCharge(){
    this.accDtlsFrm.patchValue({
      cust_name: this.acc2.tmloanall.cust_name,
      intt_recev: this.acc2.tmloanall.curr_intt + this.acc2.tmloanall.ovd_intt,
      curr_principal: this.acc2.tmloanall.curr_prn,
      curr_intt: this.acc2.tmloanall.curr_intt,
      curr_intt_rate: this.acc2.tmloanall.curr_intt_rate,
      loan_status: this.acc2.tmloanall.loan_status=='C'?'CLOSED':'OPEN',
      ovd_principal: this.acc2.tmloanall.ovd_prn,
      ovd_intt: this.acc2.tmloanall.ovd_intt,
      ovd_intt_rate: this.acc2.tmloanall.ovd_intt_rate,
      principal: this.acc2.tmloanall.curr_prn + this.acc2.tmloanall.ovd_prn,
      total_due: this.acc2.tmloanall.curr_intt + this.acc2.tmloanall.ovd_intt + this.acc2.tmloanall.curr_prn + this.acc2.tmloanall.ovd_prn,
      disb_amt: this.acc2.tmloanall.disb_amt,
      disb_dt: this.acc2.tmloanall.disb_dt
    });
    this.getLetterCharge(this.acc2.tmloanall.loan_id)
  }
  getLetterCharge(lid){
    this.svc.addUpdDel<any>(`Loan/GetLoanLetterCharge?loan_id=${lid}`, null).subscribe(
      res => {
        console.log(res);
        if(res){
          this.newMode=false;
          this.editMode=true;
          this.letterData=res;
          this.accDtlsFrm.patchValue({
            letter_type: this.letterData.letter_type,
            letter_count: this.letterData.letter_count,
            send_date: this.convertDateFormat(this.letterData.send_date),
            letter_amount: this.letterData.letter_amount,
          })
        }else{
          this.newMode=true;
          this.editMode=false;
          // Loan/InsertLoanLetterCharge
          console.log("no DAta");
          
        }
        ////////debugger;
        // acc = res;
      })
  }
  onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  public closeAlert() {
    this.showAlert = false;
  }
  getTextColor(): string {
    const loanStatus = this.accDtlsFrm?.get('loan_status')?.value;

    // Return 'red' if loan_status is 'CLOSED', 'green' otherwise
    return loanStatus === 'CLOSED' ? 'red' : 'green';
  }

 

  public SubmitReport() {
    
      this.isLoading=true
      
      this.svc.addUpdDel('Locker/GetLockerRent',null).subscribe(data=>{
        console.log(data);
        debugger
        this.reportData=data
        if(this.reportData.length==0){
          this.comser.SnackBar_Nodata()
        } 
        this.isLoading=false
      })
  }
  // getAccountTypeList() {
  //   ;

  //   this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
  //     res => {
  //       ;
  //       this.accountTypeList = res;
  //       this.passBookData = this.passBookData.filter(c => c.printed_flag === 'L');
  //       this.accountTypeList.forEach(x=>x.calc=false);
  //       this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
  //     },
  //     err => {
  //       ;
  //     }
  //   );
  // }
  // changeTradesByCategory(isChecked: boolean,i:any) {
  //   console.log(i);
  //   console.log(isChecked);
    
  //   if(isChecked){
  //     this.passBookData[i].printed_flag='Y';

  //   }
  //   else{
  //     this.passBookData[i].printed_flag='N';

  //   }
  //   console.log( this.passBookData); 
    
  // }

  // allTrades(event) {
  //   ;
  //   const checked = event.target.checked;
  //   if(checked)
  //   this.accountTypeList.forEach(item => item.calc = true);
  //   else
  //   this.accountTypeList.forEach(item => item.calc = false);
  // }
  RentChange(event:any, i){
      console.log(event.target.value  ,i)
      const selectedValue = event.target.value;
      this.reportData[i].rentamt = selectedValue;
      
      debugger
  }
 
  onUpdateClick()
  {
    this.isLoading=true;
    
    this.reportData
    debugger
      
      this.svc.addUpdDel<any>('Locker/InsertLockerRentMaster', this.reportData).subscribe(
        res => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'Locker Rent Update Successfull');
          // this.SubmitReport();
        },
        err => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'Locker Rent Updation Failed!');
        }
      );

   }
   AddLocker(){
    this.onLoadScreen(this.content)
   }
   SaveLocker(){
    this.isLoading=true;
    // this.modalRef.hide();
    var originalDate = this.accDtlsFrm.controls.send_date.value;
    var dateParts = originalDate.split("-");
    var formattedDate = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0] + " 00:00";

      var dt={
        "brn_cd": this.sys.BranchCode,
        "loan_id": this.loanID,
        "letter_type": this.accDtlsFrm.controls.letter_type.value,
        "letter_count": this.accDtlsFrm.controls.letter_count.value,
        "letter_amount": this.accDtlsFrm.controls.letter_amount.value,
        "send_date": formattedDate,
        "created_by": this.sys.UserId,
        "created_dt": this.sys.CurrentDate
    }
      
      this.svc.addUpdDel<any>('Loan/InsertLoanLetterCharge', dt).subscribe(
        res => {
          
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'New Letter Charge Added Successfull ');
          // this.SubmitReport();
          this.accDtlsFrm.reset();
        },
        err => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'Letter Charge Insertion Failed!!!!!!!!!!');
        }
      );
   }
  /** Below method handles message show/hide */
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
}
