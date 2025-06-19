import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InAppMessageService, RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues } from '../../Models';
import { p_gen_param } from '../../Models/p_gen_param';
import { sd_day_operation } from '../../Models/sd_day_operation';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-dayinitialization',
  templateUrl: './dayinitialization.component.html',
  styleUrls: ['./dayinitialization.component.css'],
  providers:[DatePipe]
})
export class DayinitializationComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService,
    private modalService: BsModalService, private rstSvc:RestService, private msg:InAppMessageService, private datePipe:DatePipe

    ) { }
  isLoading = false;
  sys = new SystemValues();
  sdoRet: sd_day_operation[] = [];
  showMsg: ShowMessage;
  initcriteria: FormGroup;
  fromdate: any;
  // fromdate: Date;
  isOpenFromDp = false;
  bankName: string;
  brnDtls: any = [];
  diff:any;
  alertMsg = '';
  closeResult='';
  showAlert = false;
  isRetrieve=false;
  isOk=false;
  currDt:any;
  showSkip=false
  disbBtn=false
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  ngOnInit(): void {
    this.GetBranchMaster();
    this.bankName = localStorage.getItem('__bName');
  this.currDt= new Date().toString().substring(0,15) 
    // this.sys.CurrentDate.toString().replace(this.)
    this.currDt=this.sys.CurrentDate
    this.currDt=this.currDt.setDate( this.currDt.getDate() + 1);

    // console.log((+this.currDt.toString().substring(8,11))+1)
    // console.log(this.currDt.toString().substring(8,10))
    // this.currDt.toString().replace(this.currDt.toString().substring(8,10),((+this.currDt.toString().substring(8,11))+1).toString())
    // this.currDt=this.currDt.toString().replace(this.currDt.toString().substring(8,10),(+this.currDt.toString().substring(8,11))+1)
    // this.fromdate=this.convertDate(localStorage.getItem('__currentDate'));
    console.log(this.currDt)
    this.fromdate=this.datePipe.transform(this.currDt, 'yyyy-MM-dd','es-ES');
    // this.fromdate=this.datePipe.transform(this.currDt, 'yyyy-MM-dd');
  
    this.initcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required]
    });
    this.isRetrieve=true;
    this.isOk=false;
  }
  private GetBranchMaster() {
    // this.isLoading = true;
    var dt = { "ardb_cd": this.sys.ardbCD };
    console.log(dt)
    this.svc.addUpdDel('Mst/GetBranchMaster', dt).subscribe(
      res => {
        console.log(res)
        // this.isLoading = false;
        this.brnDtls = res;
      },
      err => { 
        // this.isLoading = false;
       }
    );
  }
  getDay(){
    this.disbBtn=false
    console.log(this.datePipe.transform(this.currDt, 'yyyy-MM-dd'),this.fromdate)
    var date1=new Date(this.datePipe.transform(this.currDt, 'yyyy-MM-dd'))
    var date2=new Date(this.fromdate)
    this.diff = this.dateDiffInDays(date1,date2); 
    console.log(this.diff)
    if(this.diff>0){
      this.showSkip=true
      this.disbBtn=true;
    }
    if(this.diff<0){
      this.disbBtn=true
      this.HandleMessage(true, MessageType.Error,'Invalid Input.' );
    }
  }
  dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }
  keepDate(){
    this.fromdate=this.datePipe.transform(this.currDt, 'yyyy-MM-dd');
    this.showSkip=false
    this.disbBtn=false
  }
private getDayOpertion ()
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
      console.log(res);
      
      this.isLoading = false;
      //var a=res.find(x=>x.cls_flg==="N").cls_flg ;
      if (res.findIndex(x=>x.cls_flg==='N')==0)
      {
        this.HandleMessage(true, MessageType.Info,'Branches Are Opened' );
        this.sdoRet = res;
        this.isRetrieve=true;
        this.isOk=false;
        this.sdoRet.forEach(x=>x.operation_dt=this.convertDate(x.operation_dt.toString()))
        }
      else
      {
      this.sdoRet = res;
      this.isRetrieve=false;
      this.isOk=true;
      this.sdoRet.forEach(x=>x.operation_dt=this.convertDate(x.operation_dt.toString()))
      }
      for(let j=0;j<this.sdoRet.length;j++){
        for(let i=0;i<this.brnDtls.length;i++){
          if(this.sdoRet[j].brn_cd==this.brnDtls[i].brn_cd){
            this.sdoRet[j].ardb_cd=this.brnDtls[i].brn_name
          }
          console.log(this.sdoRet[j].brn_cd==this.brnDtls[i].brn_cd);
          
          // this.reportData[j].acc_cd_desc=this.reportData[j].filter(e=>e.brn_cd==this.brnDtls[i].brn_cd)[0].brn_name
          // this.reportData.forEach(e=>{e.brn_cd==this.brnDtls[i].brn_cd?this.reportData[e].acc_cd_desc.push(this.brnDtls[i].brn_name)})
        }
        }
        console.log(this.sdoRet);
        
    },
    err => { ;  this.isLoading = false;}
  );
}
dayInitialize()
{
  this.onLoadScreen(this.content)
}

private onLoadScreen(content) {
  this.modalRef = this.modalService.show(content, this.config);
}

public SubmitInit() {
 
  if (this.initcriteria.invalid) {
    this.HandleMessage(true, MessageType.Error,'Invalid Input.' );
    return false;
  }
  else
  {
    this.isLoading = true;
    this.dayInitiationCall(this.initcriteria.value['fromDate']);
  }
}
private dayInitiationCall (opnDt :any)
{
  this.showMsg =null;
  var pgp = new p_gen_param();
  pgp.adt_trans_dt = opnDt;
  pgp.gs_user_id= localStorage.getItem('__userId')+'/'+localStorage.getItem('ipAddress');
  console.log(pgp)
  debugger
  this.svc.addUpdDel<any>('Sys/W_DAY_OPEN', pgp).subscribe(
    res => {
      debugger;
      this.isLoading = false;
      this.alertMsg = res.output;
      this.HandleMessage(true, MessageType.Sucess,this.alertMsg===null?"Day Initialization is Successfull." :this.alertMsg);
      this.isRetrieve=true;
      this.isOk=false;
      this.modalRef.hide();
      this.isLoading=true
      setTimeout(()=>{
        this.logout()
      },3000)
      
    },
    err => {
      this.HandleMessage(true, MessageType.Error,this.alertMsg===null?"Day Initialization was Failed." :this.alertMsg);
       debugger;  
       this.isLoading = false;
      this.isRetrieve=true;
      this.isOk=false;
      this.modalRef.hide();
    }
  );
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
logout() {
  // alert("hii")
  // this.hideMenu();
  // localStorage.removeItem('__bName');
  // this.router.navigate(['/']);
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
closeScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}
dayRetrieve()
{
  this.getDayOpertion();
}
private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
  this.showMsg = new ShowMessage();
  this.showMsg.Show = show;
  this.showMsg.Type = type;
  this.showMsg.Message = message;
}
private  convertDate(datestring:string):Date
{
var parts = datestring.match(/(\d+)/g);
return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
}

}
