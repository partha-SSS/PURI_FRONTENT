import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { MessageType, mm_acc_type, mm_customer, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { InAppMessageService, RestService } from 'src/app/_service';
@Component({
  selector: 'app-gold-safe-master',
  templateUrl: './gold-safe-master.component.html',
  styleUrls: ['./gold-safe-master.component.css']
})
export class GoldSafeMasterComponent {


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
  currentDate: Date;
  passBookData:any[]=[];
  locker: FormGroup;
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
  showWait=false;
  maxSafeId=0;
  locker_type=[
    {type:"Small",id:"S"},
    {type:"Large",id:"L"},
    {type:"Mediam",id:"M"},
  ]
  locker_status=[
    {type:"Vacant",id:"V"},
    {type:"Allocated",id:"A"},
  ]

  
  constructor(private svc: RestService, private elementRef: ElementRef,private formBuilder: FormBuilder,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router, private comser:CommonServiceService) { }
    accountTypeList: mm_acc_type[]= [];
    param :any[]=[];
    isTrade: boolean = false;
    showMsg: ShowMessage;
    asOnDate : any;

  ngOnInit(): void {
    this.SubmitReport();

    console.log(window.location.hostname)
    // this.getAccountTypeList();
    this.asOnDate =this.sys.CurrentDate;
    
    this.locker = this.formBuilder.group({
      goldSafeId: [null, Validators.required],
      goldSafeName: [null, Validators.required],
      branch: [null, Validators.required]
      
    });
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
  }
  onLoadScreen(content) {
    this.maxSafeId=0;
    this.modalRef = this.modalService.show(content, this.config);
    this.maxSafeId = Math.max(...this.reportData.map(item => item.goldSafeId));
    this.locker.controls.goldSafeId.setValue(this.maxSafeId+1);
debugger
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

 

  public SubmitReport() {
    
      this.isLoading=true
      
      this.svc.addUpdDel('Loan/GetGoldSafeData',null).subscribe(data=>{
        console.log(data);
        debugger
        this.reportData=data
        if(this.reportData.length==0){
          this.comser.SnackBar_Nodata()
        } 
        this.isLoading=false;
      },
      err => {
        this.isLoading=false ;
        this.comser.SnackBar_Nodata()
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
  
  nameChange(id,branch,event:any){
    console.log(event.target.value ,id)
    const selectedValue = event.target.value;
    this.isLoading=true;
    var dt={
      "goldSafeId": id,
      "goldSafeName":event.target.value,
      "branch":branch,
    }
    this.svc.addUpdDel<any>('Loan/UpdateGoldSafeData', dt).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess, 'Gold Safe Name Update Successfull');
        this.SubmitReport();
      },
      err => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Error, 'Gold Safe Name Updation Failed!');
      }
    );
  }
  branchChange(id,name,event:any){
    console.log(event.target.value ,id)
    const selectedValue = event.target.value;
    this.isLoading=true;
    var dt={
      "goldSafeId": id,
      "goldSafeName":name,
      "branch":event.target.value,
    }
    this.svc.addUpdDel<any>('Loan/UpdateGoldSafeData', dt).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess, 'Gold Safe Branch Update Successfull');
        this.SubmitReport();
      },
      err => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Error, 'Gold Safe Branch Updation Failed!');
      }
    );
  }
  onUpdateClick()
  {
    this.isLoading=true;
    
    this.reportData
    debugger
      
      this.svc.addUpdDel<any>('Loan/UpdateGoldSafeData', this.reportData).subscribe(
        res => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'Locker Rent Update Successfull');
          this.SubmitReport();
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
    this.modalRef.hide();
    // var originalDate = this.locker.controls.eff_date.value;
    // var dateParts = originalDate.split("-");
    // var formattedDate = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0] + " 00:00";

      var dt={
              "goldSafeId": this.locker.controls.goldSafeId.value,
              "goldSafeName":this.locker.controls.goldSafeName.value,
              "branch":this.locker.controls.branch.value,
          }
    // this.reportData.push(dt);

    console.log(dt)
    debugger
      
      this.svc.addUpdDel<any>('loan/InsertGoldSafeData', dt).subscribe(
        res => {
          if(res)
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'New Gold Safe Added Successfully ');
          this.SubmitReport();
          this.locker.reset();
        },
        err => {
          console.log(err);
          
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'Safe Insertion Failed!!!!!!!!!!');
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
