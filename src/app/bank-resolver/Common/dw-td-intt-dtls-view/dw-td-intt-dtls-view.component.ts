import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestService, InAppMessageService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
// import { td_intt_dtls, tm_deposit } from '../../Models';
import {
  MessageType, mm_acc_type, mm_customer,
  mm_operation, m_acc_master, ShowMessage, SystemValues,
  td_def_trans_trf, td_intt_dtls, td_rd_installment, tm_deposit, tm_depositall
} from '../../Models';
@Component({
  selector: 'app-dw-td-intt-dtls-view',
  templateUrl: './dw-td-intt-dtls-view.component.html',
  styleUrls: ['./dw-td-intt-dtls-view.component.css'],
  providers:[DatePipe]
})
export class DwTdInttDtlsViewComponent implements OnInit, OnDestroy {

  constructor(public datepipe: DatePipe, private svc: RestService, private msg: InAppMessageService) {
    this.subscription = this.msg.getCommonAcctInfo().subscribe(
      res => {
        console.log(res)
        if (null !== res && undefined !== res &&
          res.cust_cd !== 0) {
          this.acctDtls = res;
          // this.getInterestList();
        } else {
          this.interestDetails = [];
        }

      },
      err => { }
    );
  }
  subscription: Subscription;
  acctDtls: tm_deposit;
  interestDetails: td_intt_dtls[] = [];
  sys=new SystemValues
  @Input()acctypcd:any;
  @Input()accnum:any;
  
  ngOnInit(): void {
    console.log("show instalments from another component")
    this.getInterestList()
    console.log(this.acctypcd+" "+this.accnum)
  }

  private getInterestList() {
    console.log('inside getInterest list')
    if (undefined !== this.acctDtls &&
      null !== this.acctDtls) {
        console.log("inside if")
      const tdIntDtl = new td_intt_dtls();
      tdIntDtl.ardb_cd=this.sys.ardbCD
      // tdIntDtl.acc_type_cd = this.acctypcd;
      // tdIntDtl.acc_num = this.accnum;
      tdIntDtl.acc_type_cd = this.acctDtls.acc_type_cd;
      tdIntDtl.acc_num = this.acctDtls.acc_num;

      tdIntDtl.brn_cd=this.sys.BranchCode
      this.svc.addUpdDel<any>('Deposit/GetInttDetails', tdIntDtl).subscribe(
        res => {
          console.log(res)
          // debugger;
         this.interestDetails = Utils.ChkArrNotEmptyRetrnEmptyArr(res);
        //  this.interestDetails.forEach((x)=>{
        //   x.calc_dt= Utils.convertStringToDt(Utils.convertDtToString(x.calc_dt).substring(0,10))
        //  })
        },
        err => { }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
function foreach(arg0: () => void) {
  throw new Error('Function not implemented.');
}

