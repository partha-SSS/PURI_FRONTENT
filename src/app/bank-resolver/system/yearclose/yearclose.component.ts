import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { MessageType, m_acc_master, ShowMessage, SystemValues } from '../../Models';

@Component({
  selector: 'app-yearclose',
  templateUrl: './yearclose.component.html',
  styleUrls: ['./yearclose.component.css']
})
export class YearcloseComponent implements OnInit {

  constructor(private router: Router,private formBuilder: FormBuilder,private modalService: BsModalService,private svc: RestService) { }
  isLoading = false;
  alertMsg = '';
  closingdate: Date;
  closingdata: FormGroup;
  showMsg: ShowMessage;
  isOpenFromDp = false;
  sys = new SystemValues();
  selectedPlList: m_acc_master[]=[];  
  plcd=''
  pldesc=''
  ngOnInit(): void {
    debugger;
    this.closingdate=this.sys.CurrentDate;
    this.closingdata = this.formBuilder.group({
      fromyear: [null, Validators.required],
      toyear: [null, Validators.required],
      enddate: [null, Validators.required],
      plcd: [null, null],
      pldesc:[null,null]
    });
     this.closingdata.patchValue({
      fromyear: (+(this.sys.FinYearClose).substring(6,10)),
      toyear :   (+(this.sys.FinYearClose).substring(6,10))+1,
      enddate :  this.convertDate('31/03/'+((+(this.sys.FinYearClose).substring(6,10))+1).toString())
    })
    var dt={
      "ardb_cd":this.sys.ardbCD
    }
    this.svc.addUpdDel<any>('Mst/GetAccountMaster', dt).subscribe(
      res => {
        this.selectedPlList = res;
        this.isLoading = false;
      },
      err => {
         this.isLoading = false;
      }
    );
  }

  backScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}
setPL(cd:any)
{
  debugger;
  // this.closingdata.patchValue({
  //   plcd: cd.acc_cd,
  //   pldesc:cd.acc_name
  // })

}
SaveData()
{

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

private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
  this.showMsg = new ShowMessage();
  this.showMsg.Show = show;
  this.showMsg.Type = type;
  this.showMsg.Message = message;
}


}
