import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RestService } from 'src/app/_service';
import { MessageType, mm_customer, ShowMessage, SystemValues, td_def_trans_trf } from '../Models';
import { tm_denomination_trans } from '../Models/deposit/tm_denomination_trans';
import { tt_denomination } from '../Models/deposit/tt_denomination';
import Utils from 'src/app/_utility/utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-denomination',
  templateUrl: './denomination.component.html',
  styleUrls: ['./denomination.component.css']
})
export class DenominationComponent implements OnInit {

  constructor(private svc: RestService,private router: Router, private modalService: BsModalService,) { }
    @ViewChild('retriveDeno', { static: true }) retriveDeno: TemplateRef<any>;
    @ViewChild('insertDeno', { static: true }) insertDeno: TemplateRef<any>;
    @Input() trans_code: any;
    @Input() transaction_date: any;
    modalRef: BsModalRef;
    custTitle: string;
    isLoading=false;
    updateMode=true
    exchange_mode=false;
    isOpenTransDt = false;
    showMsg: ShowMessage;
    cust: mm_customer;
    showCust = false;
    tm_denominationList: any[] = [];
    denominationList: tt_denomination[] = [];
    denominationGrandTotal = 0;
    sys = new SystemValues();
    trans_dt:any;
    trans_cd:number=0;
    transFromAnotherSceen:boolean=false;
    // transFromAnotherSceenForUpdate:boolean=false;
  ngOnInit(): void {
     this.getDenominationList();
    this.trans_dt= this.sys.CurrentDate;
    if(this.trans_code>0 && !this.transaction_date){
        this.transFromAnotherSceen=true;
        this.updateMode=false;
        debugger

    }else if(this.transaction_date && this.trans_code>0){
      this.updateMode=true;
      this.transFromAnotherSceen=true;
      console.log(this.transaction_date);
      this.trans_dt=this.transaction_date;
      this.getDenomination(this.transaction_date,this.trans_code);
      debugger
    }else{
    this.updateMode=false;
    this.transFromAnotherSceen=false;
   
    debugger
    }
    
  }
  private getDenominationList(): void {
    let denoList: tt_denomination[] = [];
    this.svc.addUpdDel<any>('Common/GetDenomination', null).subscribe(
      res => {
        denoList = res;
        this.denominationList = denoList.sort((a, b) => (a.value < b.value) ? 1 : -1);
      },
      err => { // ;
      }
    );
  }
   openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template);
    }
  onCancel() {
    this.modalRef.hide();
  }
  getDenomination(trans_dt,trans_cd){
    this.isLoading=true;
    // const inputDate = trans_dt;
    // const isoDate = inputDate + 'T00:00:00';
    // console.log(isoDate);
    console.log(trans_dt,trans_cd);
      this.tm_denominationList = [];
      this.denominationGrandTotal = 0;
        var dt={
        brn_cd : this.sys.BranchCode,
        trans_cd :trans_cd,
        trans_dt : trans_dt
        }
        this.svc.addUpdDel<any>('Common/GetDenominationDtls', dt).subscribe(
          res => {
            //////////////debugger;
            if (null !== res && Object.keys(res).length !== 0) {
              this.HandleMessage(true, MessageType.Sucess, 'Denomination Fetch Successfully');
              this.isLoading=false;
               this.modalRef?.hide();
              this.tm_denominationList = res;
              this.tm_denominationList.forEach(element => {
                const denomination = this.denominationList.filter(e => e.value === element.rupees)[0];
                element.rupees_desc = denomination.rupees;
                this.denominationGrandTotal += (+element.total);
              });
              this.updateMode=true;
            }else{
              this.isLoading=false;
              this.HandleMessage(true, MessageType.Error, 'No Data Found');
              this.modalRef?.hide();
            }
          },
          err => { 
              this.isLoading=false;
              this.modalRef?.hide();
              this.HandleMessage(true, MessageType.Error, 'Error from server side');
          }
        );
    
  }
 insertDenomination(trans_dt,trans_cd){
  this.exchange_mode=this.denominationGrandTotal>0?false:true;
  this.modalRef?.hide();
    this.isLoading=true;
    // const inputDate = trans_dt;
    // const dateWithTime = new Date(inputDate + 'T18:30:00.000Z');
    // console.log(dateWithTime);
    console.log(trans_dt,trans_cd);
     console.log(this.tm_denominationList);
        this.tm_denominationList.forEach(element => {
                element.trans_cd = this.denominationGrandTotal>0? trans_cd:300000+(+trans_cd);
                element.trans_dt = trans_dt;
                element.brn_cd = this.sys.BranchCode;
                element.created_dt = this.sys.CurrentDate;
                element.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
              });
        console.log(this.tm_denominationList);
        this.svc.addUpdDel<any>('Common/InsertDenominationDtls', this.tm_denominationList).subscribe(
        res => {console.log(res);
            this.onClearClick();
            // this.approveDenomination();
            if (null !== res || res==0 ) {
              if( this.exchange_mode){
                  this.HandleMessage(true, MessageType.Sucess, 'Denomination Save Successfully'+`TC: ${300000+(+trans_cd)}`)
              }else{
                 this.HandleMessage(true, MessageType.Sucess, 'Denomination Save Successfully');
              }
              this.isLoading=false;
            }else{
              this.isLoading=false;
              this.HandleMessage(true, MessageType.Error, 'Data Not Saved');
            }
          },
          err => { 
              this.isLoading=false;
              this.HandleMessage(true, MessageType.Error, err);
          }
        );
  }
  onSaveClick(){
    if(this.transFromAnotherSceen){
      this.insertDenomination(this.trans_dt,this.trans_code)
    }
    else{
       if(this.denominationGrandTotal>0)
        {
            this.trans_dt=this.sys.CurrentDate
            this.modalRef = this.modalService?.show(this.insertDeno);
        }else{
          this.getExchangeTC();     
          
        }
   
    }
   
       
  }
   public getExchangeTC(){
       var dt= {
                "brn_cd": this.sys.BranchCode,
                "trans_dt": this.sys.CurrentDate,
              }
        this.svc.addUpdDel<any>('Common/GetMaxCoinExchangeCode', dt).subscribe(
        res => {console.log(res);
          // return res;
            this.insertDenomination(this.sys.CurrentDate,res)
          },
          err => { 
              this.HandleMessage(true, MessageType.Error, err);
               return null;
          }
        );
    }
    onUpdateClick(){
       console.log(this.tm_denominationList);
      console.log(JSON.stringify(this.tm_denominationList));
      this.tm_denominationList.forEach(element => {
        console.log(element.trans_cd);
        if(!this.trans_code){
          element.trans_cd=this.tm_denominationList[0]?.trans_cd;
          element.trans_dt=this.tm_denominationList[0]?.trans_dt;
          element.created_dt=this.tm_denominationList[0]?.created_dt;
          element.created_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
        }else{
          element.trans_cd=this.trans_code;
          element.trans_dt=this.tm_denominationList[0]?.trans_dt;
          element.created_dt=this.tm_denominationList[0]?.created_dt;
          element.created_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
        }
       });
        console.log(this.tm_denominationList);
        this.svc.addUpdDel<any>('Common/UpdateDenominationDtls', this.tm_denominationList).subscribe(
        res => {console.log(res);
            this.onClearClick();

            if (null !== res || res==0 ) {
              this.HandleMessage(true, MessageType.Sucess, 'Denomination Update Successfully');
              this.isLoading=false;
            }else{
              this.isLoading=false;
              this.HandleMessage(true, MessageType.Error, 'Data Not Update');
            }
          },
          err => { 
              this.isLoading=false;
              this.HandleMessage(true, MessageType.Error, err);
          }
        );
    }
    public approveDenomination(tc,date,flag): void {
        const dt={
            "brn_cd": this.sys.BranchCode,
            "adt_trans_dt": date,
            "ad_trans_cd": tc,
            "flag": flag
        }
      this.svc.addUpdDel<any>('Common/ApproveDenomination', dt).subscribe(
            res => {
             console.log(res);
             
            })
  }
    onDelClick(){
      var dt= {
                "brn_cd": this.tm_denominationList[0]?.brn_cd,
                "trans_dt": this.tm_denominationList[0]?.trans_dt,
                "trans_cd": this.tm_denominationList[0]?.trans_cd
              }
        this.svc.addUpdDel<any>('Common/DeleteDenominationDtls', dt).subscribe(
        res => {console.log(res);
            this.onClearClick();

            if (null !== res || res==0 ) {
              this.HandleMessage(true, MessageType.Sucess, 'Denomination Successfully Deleted');
              this.isLoading=false;
            }else{
              this.isLoading=false;
              this.HandleMessage(true, MessageType.Error, 'Data Not Deleted');
            }
          },
          err => { 
              this.isLoading=false;
              this.HandleMessage(true, MessageType.Error, err);
          }
        );
    }
    addDenomination() {
    let alreadyHasEmptyDenominationItem = false;
    if (this.tm_denominationList.length >= 1) {
      // check if tm_denominationList has any blank items
      this.tm_denominationList.forEach(element => {
        if (!alreadyHasEmptyDenominationItem) {
          if (undefined === element.rupees
            || undefined === element.count
            || undefined === element.total) { alreadyHasEmptyDenominationItem = true; }
        }
      });
    }
    if (alreadyHasEmptyDenominationItem) { return; }

    const temp_denomination = new tm_denomination_trans();
    temp_denomination.brn_cd = localStorage.getItem('__brnCd');
    temp_denomination.trans_dt = this.sys.CurrentDate;
    this.tm_denominationList.push(temp_denomination);
  }

  removeDenomination() {
    if (this.tm_denominationList.length >= 1) {
      this.tm_denominationList.pop();
      this.denominationGrandTotal = 0;
      for (const l of this.tm_denominationList) {
        this.denominationGrandTotal = this.denominationGrandTotal + l.total;
      }
    }
  }

  setDenomination(val: number, idx: number) {
    val = +val;
    this.tm_denominationList[idx].rupees = val;
    this.tm_denominationList[idx].rupees_desc =
      this.denominationList.filter(x => x.value === val)[0].rupees;
    this.calculateTotalDenomination(idx);
  }

  calculateTotalDenomination(idx: number) {
    let r = 0;
    let c = 0;

    if (this.tm_denominationList[idx].rupees != null) {
      r = this.tm_denominationList[idx].rupees;
    }

    if (this.tm_denominationList[idx].count != null) {
      this.tm_denominationList[idx].count = Number(this.tm_denominationList[idx].count);
      c = this.tm_denominationList[idx].count;
    }

    this.tm_denominationList[idx].total = r * c;

    this.denominationGrandTotal = 0;
    for (const l of this.tm_denominationList) {
      this.denominationGrandTotal = this.denominationGrandTotal + l.total;
    }
  }
  

 
  onBackClick(){
    this.router.navigate([this.sys.BankName + '/la']);
  }
  onClearClick(){
          this.tm_denominationList = [];
          this.denominationGrandTotal = 0;
          this.updateMode=true;
  }
  onNewClick(){
    this.updateMode=false;
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  
    if (show) {
      setTimeout(() => {
        this.showMsg.Show = false;
      }, 6000); // auto-close after 4 sec
    }
  }
  
  getAlertIcon(type: MessageType): string {
    switch (type) {
      case MessageType.Sucess:
        return '✅';
      case MessageType.Warning:
        return '⚠️';
      case MessageType.Info:
        return 'ℹ️';
      case MessageType.Error:
        return '❌';
      default:
        return '🔔';
    }
  }
    getAlertClass(type: MessageType): string {
    switch (type) {
      case MessageType.Sucess:
        return 'alert-success';
      case MessageType.Warning:
        return 'alert-warning';
      case MessageType.Info:
        return 'alert-info';
      case MessageType.Error:
        return 'alert-danger';
      default:
        return 'alert-info';
    }
  }
}
