import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MessageType, mm_acc_type, p_loan_param, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { InAppMessageService, RestService } from 'src/app/_service';

@Component({
  selector: 'app-calculate-borr-intt',
  templateUrl: './calculate-borr-intt.component.html',
  styleUrls: ['./calculate-borr-intt.component.css']
})
export class CalculateBorrInttComponent implements OnInit {


  constructor(private svc: RestService, private elementRef: ElementRef,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router) { }
    sys = new SystemValues();
    accountTypeList: mm_acc_type[]= [];
    param :p_loan_param[]=[];
    isTrade: boolean = false;
    isLoading = false;
    showMsg: ShowMessage;
    isOpenFromDp = false;
    asOnDate : any;
    diff:any
  ngOnInit(): void {
    console.log(window.location.hostname)

    this.getAccountTypeList();
    // this.asOnDate =this.sys.CurrentDate;
  }
  SetTrans_DT(){
    const cDt = this.sys.CurrentDate.getTime();
    console.log(this.asOnDate)
    // const opDt = Utils.convertStringToDt(this.asOnDate.toString()).getTime();
    const opDt = this.asOnDate.getTime();
    // const o = Utils.convertStringToDt(this.td.opening_dt.value);
    const diffDays =(opDt-cDt ) / (1000 * 3600 * 24);
    this.diff = diffDays
    console.log(cDt + " " + opDt + " " + diffDays)
    debugger
    if(this.diff>1){
    this.HandleMessage(true, MessageType.Warning, 'Calculation date should not be Future Date!!' );
      this.asOnDate=null
     debugger
    }
    
    }

  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }

  getAccountTypeList() {
    ;

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        ;
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'B');
        this.accountTypeList.forEach(x=>x.calc=false);
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        ;
      }
    );
  }
  changeTradesByCategory(event) {
    ;
    if (this.accountTypeList[event].calc)
      this.accountTypeList[event].calc=false;
    else
    this.accountTypeList[event].calc=true;
  }
  allTrades(event) {
    ;
    const checked = event.target.checked;
    if(checked)
    this.accountTypeList.forEach(item => item.calc = true);
    else
    this.accountTypeList.forEach(item => item.calc = false);
  }
  onApproveClick()
  {

    this.param=[]
    for (let i=0;i<this.accountTypeList.length;i++)
    {
      if (this.accountTypeList[i].calc)
      {
        var p = new p_loan_param();
        p.acc_cd=this.accountTypeList[i].acc_type_cd.toString();
        p.intt_dt=this.asOnDate;
        p.ardb_cd=this.sys.ardbCD;
        this.param.push(p)
      }
    }
    if (this.param.length>0)
    {
      this.isLoading=true;
      this.svc.addUpdDel<any>('Borrowing/CalculateBorrowingAccWiseInterest', this.param).subscribe(
        res => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'Interest Calculation Done!!!!!!!!!!');
        },
        err => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'Interest Calculation Failed!!!!!!!!!!');
        }
      );

    }
    else
    this.HandleMessage(true, MessageType.Warning, 'Please select at least one Account Type!!!!!!!!!!');
  }

  /** Below method handles message show/hide */
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}
