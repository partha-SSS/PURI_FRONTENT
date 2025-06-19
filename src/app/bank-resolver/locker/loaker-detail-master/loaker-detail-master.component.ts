import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { MessageType, mm_acc_type, mm_customer, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { InAppMessageService, RestService } from 'src/app/_service';
@Component({
  selector: 'app-loaker-detail-master',
  templateUrl: './loaker-detail-master.component.html',
  styleUrls: ['./loaker-detail-master.component.css']
})
export class LoakerDetailMasterComponent implements OnInit {
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

  
  constructor(private svc: RestService, private elementRef: ElementRef,private formBuilder: FormBuilder,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router, private comser:CommonServiceService) { }
    accountTypeList: mm_acc_type[]= [];
    param :any[]=[];
    isTrade: boolean = false;
    showMsg: ShowMessage;
    asOnDate : any;

  ngOnInit(): void {
    console.log(window.location.hostname)
    // this.getAccountTypeList();
    this.asOnDate =this.sys.CurrentDate;
    
    this.locker = this.formBuilder.group({
      l_type: [null, Validators.required],
      l_id: [null, Validators.required],
      l_status: [null, Validators.required]
      
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
      
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
       
      }
      this.svc.addUpdDel('Locker/GetLockerMaster',dt).subscribe(data=>{
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
  typeChange(event:any, i){
      console.log(event.target.value  ,i)
      const selectedValue = event.target.value;
      this.reportData[i].locker_type = selectedValue;
      this.reportData[i].modified_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      this.reportData[i].modified_dt=this.today;
      debugger
  }
  statusChange(event:any ,i){
     console.log(event.target.value  ,i)
     const selectedValue = event.target.value;
      this.reportData[i].locker_status = selectedValue;
      this.reportData[i].modified_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      this.reportData[i].modified_dt=this.today;
      debugger
  }
  onUpdateClick()
  {
    this.isLoading=true;
    
    this.reportData
    debugger
      
      this.svc.addUpdDel<any>('Locker/InsertLockerMaster', this.reportData).subscribe(
        res => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'LockerMaster Update Successfull!!!!!!!!!!');
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
   SaveLocker(){
    this.isLoading=true;
    this.modalRef.hide();
    
      const created_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      const created_dt=this.today;
      var dt={"ardb_cd":"1",
              "brn_cd":"101",
              "created_by":created_by,
              "created_dt":created_dt,
              "locker_id":this.locker.controls.l_id.value,
              "locker_status":this.locker.controls.l_status.value,
              "locker_type":this.locker.controls.l_type.value,
              "modified_by": null,
              "modified_dt":"01/01/0001 00:00"
            }
    this.reportData.push(dt);

    console.log(this.reportData)
     this.locker.controls.l_type.value
     this.locker.controls.l_id.value
     this.locker.controls.l_status.value
    debugger
      
      this.svc.addUpdDel<any>('Locker/InsertLockerMaster', this.reportData).subscribe(
        res => {
          
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'New Locker Added Successfull ');
          this.SubmitReport();
          this.locker.reset();
        },
        err => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'LockerMaster Update Failed!!!!!!!!!!');
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
