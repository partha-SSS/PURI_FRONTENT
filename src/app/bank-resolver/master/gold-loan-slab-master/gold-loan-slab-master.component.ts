import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { MessageType, mm_acc_type, mm_customer, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { InAppMessageService, RestService } from 'src/app/_service';

@Component({
  selector: 'app-gold-loan-slab-master',
  templateUrl: './gold-loan-slab-master.component.html',
  styleUrls: ['./gold-loan-slab-master.component.css']
})



export class GoldLoanSlabMasterComponent {


  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('content2', { static: true }) content2: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true, // disable backdrop click to close the modal
    class: 'modal-sm'
  };
  currentDate: Date;
  passBookData:any[]=[];
  locker: FormGroup;
  goldPrice: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  letestGoldPrice:number=0
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
  rangeString:any=''
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
    this.getGoldLetestRate();
    this.SubmitReport();
    console.log(window.location.hostname)
    // this.getAccountTypeList();
    this.asOnDate =this.sys.CurrentDate;
    
    
    this.goldPrice=this.formBuilder.group({
      effective_date: [null, Validators.required],
      rate_per_gram: [null, Validators.required]
    })
    this.locker = this.formBuilder.group({
      EffectiveDt: [null, Validators.required],
      LowerSlabValue: [null, [Validators.required, Validators.min(0)]],
      UpperSlabValue: [null, [Validators.required, Validators.min(0)]],
      SlabRange: ['', Validators.required],
      InttRate: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      CreatedBy: ['', Validators.required],
      CreatedDt: [null],
      ModifiedBy: ['', Validators.required],
      ModifiedDt: [null],
      sanc_perc:[0, Validators.required]
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

 

  public SubmitReport() {
    
      this.isLoading=true
      
      this.svc.addUpdDel('Loan/GetGoldLoanMasterDataLatest',null).subscribe(data=>{
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
    var originalDate = this.locker.controls.EffectiveDt.value;
    var dateParts = originalDate.split("-");
    var formattedDate = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0] + " 00:00";
    
      var dt={
        "EffectiveDt": formattedDate,
        "sanc_perc":this.locker.controls.sanc_perc.value,
        "LowerSlabValue": 1,
        "UpperSlabValue": 10000,
        "SlabRange": "1-10000",
        "InttRate": this.locker.controls.InttRate.value,
        "CreatedBy": this.sys.UserId+'/'+localStorage.getItem('ipAddress'),
        "CreatedDt": this.sys.CurrentDate,
        "ModifiedBy": null,
        "ModifiedDt": "0001-01-01T12:00:00"
      }
    this.reportData.push(dt);

    console.log(this.reportData)
    debugger
      
      this.svc.addUpdDel<any>('Loan/InsertGoldLoanMasterData', dt).subscribe(
        res => {
          
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'New Gold Slab Added Successfull ');
          this.SubmitReport();
          this.locker.reset();
        },
        err => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'Gold Slab Insertion Failed!!!!!!!!!!');
        }
      );
   }
   UpdateTodayGoldPrice(){
    this.onLoadScreen(this.content2)
   }
   SaveTodayGoldPrise(){
    this.isLoading=true;
    this.modalRef.hide();
    var originalDate = this.goldPrice.controls.effective_date.value;
    var dateParts = originalDate.split("-");
    var formattedDate = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0] + " 00:00";
    
    var dt={
      "effective_date": formattedDate,
      "rate_per_gram":this.goldPrice.controls.rate_per_gram.value,
    }
  this.reportData.push(dt);

  console.log(this.reportData)
  debugger
    
    this.svc.addUpdDel<any>('Loan/InsertGoldLoanRate', dt).subscribe(
      res => {
        
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess, 'New Gold Price Added Successfull ');
        // this.SubmitReport();
        this.getGoldLetestRate();
      },
      err => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Error, 'Gold Price Insertion Failed!!!!!!!!!!');
      }
    );
   }
   getGoldLetestRate(){
    this.svc.addUpdDel<any>('Loan/GetLatestGoldRate', null).subscribe(
      res => {
        this.letestGoldPrice=res;
        this.isLoading=false;
        
      },
      err => {
       
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Error, 'Gold Price Getting Error!!!!!!!!!!');
      }
    );
    
   }
   setRange(type,event:any){
    if(type=='L'){
      var lower=event.target.value;
      this.locker.controls.SlabRange.setValue(lower)
    }
    else{
      var upper=event.target.value;
      this.locker.controls.SlabRange.setValue(this.locker.controls.SlabRange.value+'-'+upper)

    }
    // this.rangeString=lower+'-'+upper?upper:0

    // this.locker.controls.SlabRange.setValue(this.rangeString)
   }
  /** Below method handles message show/hide */
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
}
