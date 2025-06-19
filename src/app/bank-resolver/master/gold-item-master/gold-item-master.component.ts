import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { MessageType, mm_acc_type, mm_customer, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { InAppMessageService, RestService } from 'src/app/_service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-gold-item-master',
  templateUrl: './gold-item-master.component.html',
  styleUrls: ['./gold-item-master.component.css'],
  providers: [DatePipe]
})
export class GoldItemMasterComponent {


  @ViewChild('content2', { static: true }) content2: TemplateRef<any>;
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
  showWait=false
  locker_type=[
    {type:"Small",id:"S"},
    {type:"Large",id:"L"},
    {type:"Mediam",id:"M"},
  ]
  locker_status=[
    {type:"Vacant",id:"V"},
    {type:"Allocated",id:"A"},
  ]

  
  constructor(private datePipe: DatePipe,private svc: RestService, private elementRef: ElementRef,private formBuilder: FormBuilder,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router, private comser:CommonServiceService) { }
    accountTypeList: mm_acc_type[]= [];
    param :any[]=[];
    isTrade: boolean = false;
    showMsg: ShowMessage;
    asOnDate : any;
    maxItemId:any;
  ngOnInit(): void {
    this.SubmitReport();
    console.log(window.location.hostname)
    // this.getAccountTypeList();
    this.asOnDate =this.sys.CurrentDate;
    
    this.locker = this.formBuilder.group({
              GoldItemId: [null, Validators.required],
              GoldItemDes: [null, Validators.required],
              CreatedDate: [null, Validators.required],
              ModifiedDate: [null, Validators.required]
      
    });
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
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
    this.modalRef?.hide();
      this.isLoading=true
      
      this.svc.addUpdDel('Loan/GetGoldItemMasterData',null).subscribe(data=>{
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
  RentChange(event:any, id, cdt){
      console.log(event.target.value  ,id)
      const selectedValue = event.target.value;
      this.onUpdateClick(id,selectedValue,cdt);
      debugger
  }
 
  onUpdateClick(id,desc,cdt)
  {
    this.isLoading=true;
    var originalDate = this.sys.CurrentDate;
    console.log(originalDate);
    const formattedDate = this.datePipe.transform(originalDate, 'dd/MM/yyyy HH:mm')!;
    var dt={
      "GoldItemId":id,
      "GoldItemDes":desc,
      "ModifiedDate":formattedDate,
      "CreatedDate":cdt
  }

    debugger
      
      this.svc.addUpdDel<any>('Loan/UpdateGoldItemMaster', dt).subscribe(
        res => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'Gold Item Update Successfull');
          this.SubmitReport();
        },
        err => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'Gold Item Updation Failed!');
        }
      );

   }
   AddLocker(){
    this.maxItemId=0;
    this.modalRef = this.modalService.show(this.content2, this.config);
    this.maxItemId = Math.max(...this.reportData.map(item => item.goldItemId ));
    this.locker.controls.GoldItemId.setValue(this.maxItemId+1);
   }
   SaveLocker(){

    this.isLoading=true;
    this.modalRef.hide();
    var originalDate = this.sys.CurrentDate;
    console.log(originalDate);
    const formattedDate = this.datePipe.transform(originalDate, 'dd/MM/yyyy HH:mm')!;
    // var dateParts = originalDate.split("-");
    // var formattedDate = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0] + " 00:00";

      var dt={
              "GoldItemId": this.locker.controls.GoldItemId.value,
              "GoldItemDes":this.locker.controls.GoldItemDes.value,
              "CreatedDate":formattedDate,
              "ModifiedDate":"01/01/0001 00:00",
          }

    debugger
      
      this.svc.addUpdDel<any>('Loan/InsertGoldItemMaster', dt).subscribe(
        res => {
          
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'New Gold Item Added Successfull ');
          this.SubmitReport();
          this.locker.reset();
        },
        err => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'Locker Rate Insertion Failed!!!!!!!!!!');
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
