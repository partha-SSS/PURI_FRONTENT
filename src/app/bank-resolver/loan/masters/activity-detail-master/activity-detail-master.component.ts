import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { MessageType, mm_acc_type, mm_customer, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { InAppMessageService, RestService } from 'src/app/_service';
export interface ActivityData {
  acc_cd: number;            // Account Code
  activity_cd: string;       // Activity Code
  activity_desc: string;     // Activity Description
  category: string;          // Category
  grace_month: number;       // Grace Month
  instl_no: number;          // Installment Number
  master_sector: number;     // Master Sector
  moratorium: number;        // Moratorium
  periodicity: string | null; // Periodicity (nullable)
  sector_cd: string;         // Sector Code
  sector_desc: string;       // Sector Description
  term: number;              // Term
  total_yr: number;          // Total Years
}
@Component({
  selector: 'app-activity-detail-master',
  templateUrl: './activity-detail-master.component.html',
  styleUrls: ['./activity-detail-master.component.css']
})

export class ActivityDetailMasterComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true, // disable backdrop click to close the modal
    class: 'modal-lg'
  };
  editableRowIndex: number | null = null;
  currentDate: Date;
  passBookData:any[]=[];
  myForm: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  UrlString = '';
  alertMsg = '';
  fd: any;
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
  reportData:any=[];
  actCategory:any[]=[];
  accountTypeList: mm_acc_type[] = [];
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
  showWait=false
  locker_type=[
    {type:"Small",id:"S"},
    {type:"Large",id:"L"},
    {type:"Mediam",id:"M"},
  ]
  periodicityList=[
    { "code": "Y", "name": "Yearly" },
    { "code": "H", "name": "Half-Yearly" },
    { "code": "Q", "name": "Quarterly" },
    { "code": "M", "name": "Monthly" }
  ]

  
  constructor(private svc: RestService, private elementRef: ElementRef,private fb: FormBuilder,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router, private comSer:CommonServiceService) {
      this.getActivityCat();
      this.getAccountTypeList(); }
    param :any[]=[];
    isTrade: boolean = false;
    showMsg: ShowMessage;
    asOnDate : any;

  ngOnInit(): void {
    console.log(window.location.hostname)
    
    this.asOnDate =this.sys.CurrentDate;
    
    this.myForm = this.fb.group({
      acc_cd: [0, Validators.required],
      activity_cd: ['', Validators.required],
      activity_desc: ['', Validators.required],
      category: ['', Validators.required],
      grace_month: [0],
      instl_no: [0],
      master_sector: [9],
      moratorium: [0],
      periodicity: [null], // Optional, no Validators
      sector_cd: [''],
      sector_desc: [''],
      term: [0],
      total_yr: [0],
    });
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
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
  // public onAccountTypeChange(): void {
  //   this.reportcriteria.controls.acct_num.setValue('');
  //   this.suggestedCustomer = null;
  //   if (+this.reportcriteria.controls.acc_type_cd.value > 0) {
  //     this.reportcriteria.controls.acct_num.enable();
  //   }
  // }
  // onChangeNull(){
  //   this.suggestedCustomer = null

  //   if (this.reportcriteria.controls.acct_num.value.length > 0) 
  //     this.disabledOnNull=false
  //   else 
  //     this.disabledOnNull=true
  // }

 
  getActivityCat(){
    this.isLoading=true
    this.svc.addUpdDel('Loan/GetActivityCategory',null).subscribe(data=>{
      console.log(data);
      debugger
      this.actCategory=data
      if(!this.actCategory){
        this.comSer.SnackBar_Nodata()
          this.isLoading=false
      } 
      this.isLoading=false
    })
  }
  public SubmitReport() {
    
      this.isLoading=true
      
      this.svc.addUpdDel('Loan/GetSectorActivityData',null).subscribe(data=>{
        console.log(data);
        debugger
        this.reportData=data
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.isLoading=false
      })
  }
  getAccountTypeList() {
    this.isLoading = true;

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        this.isLoading = false;
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'L');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        ;
      }
    );
  }
  
  isRowEditable(index: number): boolean {
    return this.editableRowIndex === index;
  }

  // Enable editing for a specific row
  enableRowEdit(index: number): void {
    this.editableRowIndex = index;
  }
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
  typeChange(event:any, i){
      console.log(event.target.value  ,i)
      const selectedValue = event.target.value;
      this.reportData[i].locker_type = selectedValue;
      this.reportData[i].modified_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      this.reportData[i].modified_dt=this.today;
      debugger
  }
  categoryChange(event:any ,i){
     console.log(event.target.value  ,i)
     const selectedValue = event.target.value;
      // this.reportData[i].locker_status = selectedValue;
      // this.reportData[i].modified_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      // this.reportData[i].modified_dt=this.today;
      // debugger
  }
  onUpdateClick(data:any, i:number)
  {
    this.isLoading=true;
    console.log(data);
    
    this.reportData
    debugger
      
      this.svc.addUpdDel<any>('Loan/UpdateSectorActivityData', data).subscribe(
        res => {
          this.editableRowIndex=null;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'Activity Update Successfully');
          this.SubmitReport();
        },
        err => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'LockerMaster Update Failed!!!!!!!!!!');
        }
      );

   }
   AddLocker(){
    this.onLoadScreen(this.content)
   }
  
  /** Below method handles message show/hide */
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}
