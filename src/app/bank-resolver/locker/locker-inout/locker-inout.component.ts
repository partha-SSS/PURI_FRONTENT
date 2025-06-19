import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { MessageType, mm_acc_type, mm_customer, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { InAppMessageService, RestService } from 'src/app/_service';
import { LockerOpenDM } from '../../Models/locker/LockerOpenDM';
import { tm_deposit } from '../../Models/tm_depositInv';
import { tm_locker } from '../../Models/locker/tm_locker';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface LockerAccess {
  ardb_cd: string;
  brn_cd: string;
  locker_id: string;
  name: string;
  trans_dt: Date;
  access_in_time: string;
  access_out_time: string;
  handling_authority: string;
  remarks: string;
  created_by: string;
  created_dt: Date;
  modified_by: string;
  modified_dt: Date;
}
@Component({
  selector: 'app-locker-inout',
  templateUrl: './locker-inout.component.html',
  styleUrls: ['./locker-inout.component.css']
})
export class LockerINOUTComponent {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  masterModel = new LockerOpenDM();
  tm_deposit = new tm_deposit();
  tm_locker = new tm_locker();
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  disableAll=true;
  inTime:any;
  outTime:any;
  lockerInOutStatus:any;
  remarks:any;

  handling_authority:any;

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
  trans_dt:any;
  locker_type=[
    {type:"Small",id:"S"},
    {type:"Large",id:"L"},
    {type:"Mediam",id:"M"},
  ]
  locker_status=[
    {type:"Vacant",id:"V"},
    {type:"Allocated",id:"A"},
  ]
 lockerAccess:LockerAccess;

  constructor(private svc: RestService,private datePipe: DatePipe,private http: HttpClient, private elementRef: ElementRef,private formBuilder: FormBuilder,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router, private comser:CommonServiceService) { }
    accountTypeList: mm_acc_type[]= [];
    param :any[]=[];
    isTrade: boolean = false;
    showMsg: ShowMessage;
    asOnDate : any;
    baseUrl:any;
    username:any;
    password:any;
    senderid:any;
    route:any;
    url:any;
    uerMobileNo:any;
    name:any;
  ngOnInit(): void {


    if(this.sys.ardbCD=='26'){
      this.baseUrl='https://bulksms.sssplsales.in/api/api_http.php';
      this.username='BCARDB';
      this.password='BC527ARDB';
      this.senderid='BCARDB';
      this.route='7';
  }
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
       this.today= n + " "+ time;
  }

  createURL(){
    const date = new Date(this.sys.CurrentDate);
          const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss');
          console.log(formattedDate);
    const time1=formattedDate.toString()
    console.log(time1);

       //https://bulksms.sssplsales.in/api/api_http.php?username=BCARDB&password=BC527ARDB&senderid=BCARDB&to=9083537178&text=Dear Member, your locker is accessed by sss  today at 23/09/2024. If not done by you, call 9800960007/03422662390 -Burdwan CARD Bank&route=Informative&type=text
      let uname1:string=this.tm_locker.cust_name;
      uname1=uname1.substr(0,25)+'...'
    // const ls_phone = this.uerMobileNo;
      const ls_phone = '9083537178';

console.log(uname1,time1);

    const message= `Dear Member, your locker is accessed by ${uname1} today at ${time1}. If not done by you, call 9800960007/03422662390 -Burdwan CARD Bank&route=Informative&type=text`
    console.log(message);

    this.url = `${this.baseUrl}?username=${this.username}&password=${this.password}&senderid=${this.senderid}&to=${encodeURIComponent(ls_phone)}&text=${encodeURIComponent(message)}`;
    console.log(this.url);
      // this.sendAllSms(this.url)
  }
  sendAllSms(url: string)  {
    this.http.get(url).subscribe(
      (response) => {
        console.log('SMS sent successfully:', response);
        // this.HandleMessage(true, MessageType.Sucess,
        //   'Locker Accessed SMS Send Successfully...');
      },
      (error) => {
        console.error('Error sending SMS:', error);
        // this.HandleMessage(true, MessageType.Sucess,
        //   'Locker Accessed SMS Send Successfully..');
      }
    );
    console.log(url);
    // return;
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
  getLockerAccess(){
    this.disableAll=false;
  }
   getLockerOpeningTempData() {

        var dt={
          "ardb_cd":this.sys.ardbCD,
          "brn_cd":this.sys.BranchCode,
          "agreement_no":this.tm_locker.agreement_no
        }
      this.isLoading = true;
      this.svc.addUpdDel<any>('Locker/GetLockerOpeningDataView', dt).subscribe(
        res => {
          console.log(res);
          this.isLoading = false;
          this.masterModel = res;
          this.tm_locker=this.masterModel.tmlocker;

          debugger
          if ( this.masterModel.tmlocker.agreement_no === undefined || this.masterModel.tmlocker.agreement_no === null) {
            // this.showAlertMsg('WARNING', 'No record found!!');
            this.HandleMessage(true, MessageType.Warning, 'No record found!!');
            this.tm_locker.agreement_no=null;
            return
          }


          else {
          this.uerMobileNo=this.masterModel.tmlocker.phone?this.masterModel.tmlocker.phone:null;
          this.tm_locker=this.masterModel.tmlocker;
          this.tm_locker.rented_till = this.setDate(this.tm_locker.rented_till);

            this.getLockerInOutDtls()

          }


        },
        err => {
          this.isLoading = false;
          // this.showAlertMsg('ERROR', 'Unable to find record!!');
          this.HandleMessage(true, MessageType.Warning, 'Unable to find record!!');
        }

      );

    }

    getLockerInOutDtls(){
      const dt = {
        ardb_cd: this.sys.ardbCD,
        brn_cd: this.sys.BranchCode,
        locker_id: this.tm_locker.locker_id,
      };

    this.isLoading = true;
    this.svc.addUpdDel<any>('Locker/GetLockerAccess  ', dt).subscribe(
      res => {
        console.log(res);
        this.isLoading = false;
        if(res.locker_id!=null && res.access_out_time=='01/01/0001 00:00'){
          console.log(res);
          this.handling_authority=res.handling_authority;
          this.remarks=res.remarks;
          this.inTime=res.access_in_time;
          this.outTime='';
          this.trans_dt=res.trans_dt?res.trans_dt:this.sys.CurrentDate;
          this.lockerInOutStatus='Y'
          debugger
        }
        else{
          this.trans_dt='';
          this.handling_authority='';
          this.remarks='';
          this.inTime='';
          this.lockerInOutStatus='N'
          return;
        }

      },
      err => {
        this.isLoading = false;
        // this.showAlertMsg('ERROR', 'Unable to find record!!');
        this.HandleMessage(true, MessageType.Warning, 'Error when geting locker access details,');
      }

    );
    }

    clear(){
      this.trans_dt='';
          this.handling_authority='';
          this.remarks='';
          this.inTime='';
          this.lockerInOutStatus='N';
          this.tm_locker=null;
    }
    updateLockerAccess(isChecked: boolean,i:any) {
      if(this.tm_locker.agreement_no==null || this.tm_locker.agreement_no== undefined){
        this.HandleMessage(true, MessageType.Warning, 'Please Enter Agereement No..');
        this.lockerInOutStatus="N"
      }
      else{
        console.log(i);
        console.log(isChecked);
        console.log(this.inTime,this.outTime);
        if(isChecked){
          const date = new Date();
          const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss');
          console.log(formattedDate);  // Output: 03/08/2024 12:37:32
          this.inTime=formattedDate;
          this.lockerInOutStatus="Y";

          this.InsertLockerAccess()


        }
        else{
          const date = new Date();
          const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss');
          console.log(formattedDate);  // Output: 03/08/2024 12:37:32
          this.outTime=formattedDate;
          this.lockerInOutStatus="N"
          this.UpdateLockerAccess();
        // console.log( this.second);
      }
      }

    }

    InsertLockerAccess() {


      const dt = {
        ardb_cd: this.sys.ardbCD,
        brn_cd: this.sys.BranchCode,
        locker_id: this.tm_locker.locker_id,

        name: this.tm_locker.name,
        handling_authority: this.handling_authority,
        remarks: this.remarks,
        created_by: this.sys.UserId+'/'+localStorage.getItem('ipAddress'),
        modified_by: this.sys.UserId+'/'+localStorage.getItem('ipAddress'),
        trans_dt:this.trans_dt?this.trans_dt:this.sys.CurrentDate.toISOString(),

      };

    this.isLoading = true;
    this.svc.addUpdDel<any>('Locker/InsertLockerAccess ', dt).subscribe(
      res => {
        console.log(res);
        this.isLoading = false;

        if(res==0){
          this.createURL();
          this.lockerInOutStatus='Y'
            this.HandleMessage(true, MessageType.Sucess, 'Locker In-Time Insertion Successfully');
        }
        else{
          this.createURL();
           this.lockerInOutStatus='N';
           this.inTime=null;
          this.HandleMessage(true, MessageType.Error, 'Unable to Save record!!');

        }

      },
      err => {
        this.isLoading = false;
        // this.showAlertMsg('ERROR', 'Unable to find record!!');

        this.HandleMessage(true, MessageType.Warning, 'Unable to Save record!!');
      }

    );

  }
  UpdateLockerAccess(){
    debugger
    const dt = {
      ardb_cd: this.sys.ardbCD,
      brn_cd: this.sys.BranchCode,
      locker_id: this.tm_locker.locker_id,
      name: this.tm_locker.name,
      handling_authority: this.handling_authority,
      remarks: this.remarks,
      modified_by: this.sys.UserId+'/'+localStorage.getItem('ipAddress'),
      trans_dt:this.trans_dt?this.trans_dt:this.sys.CurrentDate.toISOString(),
    };
    this.isLoading = true;
    this.svc.addUpdDel<any>('Locker/UpdateLockerAccess', dt).subscribe(
      res => {
        console.log(res);
        this.isLoading = false;
        if(res==0){
          // this.createURL();
          this.lockerInOutStatus='N';
          this.HandleMessage(true, MessageType.Sucess, 'Locker Out-Time Insertion Successfully');
        }
        else{
          this.lockerInOutStatus='Y';
           this.outTime=null;
          this.HandleMessage(true, MessageType.Error, 'Unable to Save record!!');
        }

      },
      err => {
        this.isLoading = false;
        // this.showAlertMsg('ERROR', 'Unable to find record!!');
        this.HandleMessage(true, MessageType.Warning, 'Unable to Save record!!');
      }
    )
  }


    setDate(date:string){
      const [datePart] = date.split(' ');
      const [day, month, year] = datePart.split('/');
      const outputDate = `${year}-${month}-${day}`;
      return outputDate;
    }
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
  // sendEmail(){
  //   var templateParams = {
  //     from_name: 'James',
  //     to_name: 'Check this out!',
  //     subject: 'Check this out!',
  //     message: 'Check this out!',
  //   };

  //   emailjs.send('service_umhadof', 'template_a67ttmm', templateParams).then(
  //     (response) => {
  //       console.log('SUCCESS!', response.status, response.text);
  //     },
  //     (error) => {
  //       console.log('FAILED...', error);
  //     },
  //   );
  // }
}
