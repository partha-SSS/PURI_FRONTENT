import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { InAppMessageService, RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { LOGIN_MASTER, MessageType, m_acc_master, ShowMessage, SystemValues } from '../../Models';

@Component({
  selector: 'app-yearopen',
  templateUrl: './yearopen.component.html',
  styleUrls: ['./yearopen.component.css']
})
export class YearopenComponent implements OnInit {

  constructor(private rstSvc:RestService,private router: Router,private formBuilder: FormBuilder,private msg:InAppMessageService,private modalService: BsModalService,private svc: RestService) { }
  isLoading = false;
  alertMsg = '';
  closingdate: Date;
  openingdata: FormGroup;
  showMsg: ShowMessage;
  isOpenFromDp = false;
  sys = new SystemValues();
  selectedPlList: m_acc_master[]=[];  
  plcd=''
  pldesc=''
  bankName = localStorage.getItem('__bName');

  ngOnInit(): void {
    this.closingdate=this.sys.CurrentDate;
    this.openingdata = this.formBuilder.group({
      fromyear: [null, Validators.required],
      toyear: [null, Validators.required],
      enddate: [null, Validators.required],
      plcd: [null, null],
      pldesc:[null,null]
    });
    this.openingdata.patchValue({
      fromyear: (+(this.sys.CurrentFinancialYr)+1),
      toyear :   (+(this.sys.CurrentFinancialYr))+2,
      enddate :  this.convertDate('31/03/'+(+(this.sys.CurrentFinancialYr)+2).toString())

    })

  }

  backScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}
setPL(cd:any)
{

}
SaveData()
{
  // const m = Utils.convertStringToDt(this.openingdata.controls.enddate.value.toString());
      const m = this.convertDate(this.sys.lastDt);
      const c = this.sys.CurrentDate;
      const diffDays = Math.ceil((m.getTime() - c.getTime()) / (1000 * 3600 * 24)); 
     
      console.log(c);
      console.log(m);
      console.log(diffDays);
      debugger
      if(diffDays!=0){
        this.HandleMessage(true, MessageType.Error, 'System date should be equal to '+this.sys.lastDt);
        return
      }
else{
  this.isLoading=true;
  var dt={
    "adt_trans_dt":this.openingdata.controls.enddate.value,
    "as_acc_num":this.openingdata.controls.fromyear.value.toString(),

  }
  debugger
  this.svc.addUpdDel<any>('Sys/YearOpen', dt).subscribe(
    res => {
      debugger
      if(res==0){
        this.HandleMessage(true, MessageType.Sucess, 'Year Open Done Successfully');
         this.isLoading = false;
        this.logout()
      }
      else{
        this.HandleMessage(true, MessageType.Sucess, 'ERROR!  Year dose not open!!');
         this.isLoading = false;
        this.logout()
      }
      
    },
    err => {
      debugger
      this.HandleMessage(true, MessageType.Error, 'Year Open FAILED!!!!');
       this.isLoading = false;
    }
  );}

}
private  convertDate(datestring:string):Date
{
var parts = datestring.match(/(\d+)/g);
return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
}
private getfinyear(adtdate:Date) : string
{
   let currDate=adtdate; 
   if (currDate.getMonth()>3)
   return currDate.getFullYear().toString();
   else
   return (currDate.getFullYear()+1).toString();
}

logout() {
  this.updateUsrStatus();
  localStorage.removeItem('__brnName');
  localStorage.removeItem('__curFinyr');
  localStorage.removeItem('__brnCd');
  localStorage.removeItem('__currentDate');
  localStorage.removeItem('__cashaccountCD');
  localStorage.removeItem('__ddsPeriod');
  localStorage.removeItem('__userId');
  localStorage.removeItem('ardb_name');
  localStorage.removeItem('__ardb_cd');

  // this.msg.sendisLoggedInShowHeader(false);
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
private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
  this.showMsg = new ShowMessage();
  this.showMsg.Show = show;
  this.showMsg.Type = type;
  this.showMsg.Message = message;
}


}
