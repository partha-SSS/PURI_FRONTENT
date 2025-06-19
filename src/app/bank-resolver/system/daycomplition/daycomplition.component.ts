import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InAppMessageService, RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues } from '../../Models';
import { p_gen_param } from '../../Models/p_gen_param';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { sd_day_operation } from '../../Models/sd_day_operation';

@Component({
  selector: 'app-daycomplition',
  templateUrl: './daycomplition.component.html',
  styleUrls: ['./daycomplition.component.css']
})
export class DaycomplitionComponent implements OnInit {
  isOpenFromDp = false;
  sys = new SystemValues();
  constructor(private rstSvc:RestService, private router: Router,private msg:InAppMessageService, private formBuilder: FormBuilder,private modalService: BsModalService,private svc: RestService) { }
  isLoading = false;
  alertMsg = '';
  closingdate: Date;
  bankName = localStorage.getItem('__bName');
  sdoRet:any=[]
  closingdata: FormGroup;
  showMsg: ShowMessage;
  preventClose=false
  ngOnInit(): void {
    this.getDayOpertion()
    console.log(this.sys.CurrentDate)
    this.closingdate=this.sys.CurrentDate;
    this.closingdata = this.formBuilder.group({
      closingdate: [this.sys.CurrentDate, Validators.required],
      // closingbal: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])
      closingbal: [null, Validators.compose([Validators.required])
    ]
    });

  }

  closeScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}

dayComplete() {
  ;
  if (this.closingdata.invalid) {
    this.alertMsg = "Invalid Input.";
    return false;
  }
  else
  { debugger;
    this.isLoading = true;
    this.dayCompletionCall(this.closingdata.value['closingdate'], this.closingdata.value['closingbal']);
  }
}
logout() {
  this.updateUsrStatus();
  localStorage.removeItem('__brnName');
  localStorage.removeItem('__brnCd');
  localStorage.removeItem('__currentDate');
  localStorage.removeItem('__cashaccountCD');
  localStorage.removeItem('__ddsPeriod');
  localStorage.removeItem('__userId');
  localStorage.removeItem('ardb_name');
  localStorage.removeItem('__ardb_cd');

  this.msg.sendisLoggedInShowHeader(false);
  this.router.navigate([this.bankName + '/login']);
}
private updateUsrStatus(): void {
  // alert("hii")
  const usr = new LOGIN_MASTER();
  usr.ardb_cd=this.sys.ardbCD
  usr.brn_cd = this.sys.BranchCode;
  usr.user_id = this.sys.UserId;
  usr.login_status = 'N';
  this.rstSvc.addUpdDel('Mst/Updateuserstatus', usr).subscribe(
    res => { },
    err => { }
  );
}
public getDayOpertion ()
{
  ;
  this.showMsg =null;
  var sdo = new sd_day_operation();
  sdo.ardb_cd=this.sys.ardbCD
  //sdo.operation_dt =this.convertDate(localStorage.getItem('__currentDate'));// new Date();
  sdo.operation_dt =this.sys.CurrentDate;
  ;
  this.svc.addUpdDel<any>('Sys/GetDayOperation', sdo).subscribe(
    res => {
      ;
      this.isLoading = false;
      if (res.findIndex(x=>x.cls_flg==='N')==0)
      {
        this.sdoRet = res;
         if(this.sdoRet.filter(e=>e.cls_flg==='N').length>1 && this.sys.BranchCode=='101'){
            this.preventClose=true
            this.alertMsg="Cannot close the day, other branches are still open!"
            this.HandleMessage(true, MessageType.Error,this.alertMsg );
        }
        else
            this.preventClose=false
      }
      // else
      // {
      // this.sdoRet = res;
      // this.isRetrieve=false;
      // this.isOk=true;
      // this.sdoRet.forEach(x=>x.operation_dt=this.convertDate(x.operation_dt.toString()))
      // }
    },
    err => { ;  this.isLoading = false;}
  );
}
checkComplete()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}
private dayCompletionCall (clsDt :any,clsamt:any)
{
  this.showMsg =null;
  var pgp = new p_gen_param();
  pgp.brn_cd = this.sys.BranchCode;
  pgp.gs_user_type = 'A';//TDB
  pgp.gs_user_id= localStorage.getItem('__userId')+'/'+localStorage.getItem('ipAddress');
  pgp.ad_prn_amt=parseFloat(clsamt);
  ;
  this.svc.addUpdDel<any>('Sys/W_DAY_CLOSE', pgp).subscribe(
    res => {
      this.isLoading = false;
      this.alertMsg = res.output;
      this.closingdata.setValue['closingbal']=0;
      if (res.flag == -1)
      this.HandleMessage(true, MessageType.Error,this.alertMsg );
      // if(this.getDayOpertion()){
      //   this.alertMsg="Cannot close the day, other branches are still open!"
      //   this.HandleMessage(true, MessageType.Error,this.alertMsg );

      // }
      else
      {this.HandleMessage(true, MessageType.Sucess,this.alertMsg );
       this.isLoading=true 
       setTimeout(()=>{
        this.logout()
       },3000)
      }

    },
    err => { ;  this.isLoading = false;}
  );
}

private  convertDate(datestring:string):Date
{
var parts = datestring.match(/(\d+)/g);
return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
}


private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
  this.showMsg = new ShowMessage();
  this.showMsg.Show = show;
  this.showMsg.Type = type;
  this.showMsg.Message = message;
}

}
