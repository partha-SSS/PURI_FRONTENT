import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/_service';
import { mm_customer, SystemValues, td_def_trans_trf } from '../Models';
import { tm_denomination_trans } from '../Models/deposit/tm_denomination_trans';
import { tt_denomination } from '../Models/deposit/tt_denomination';
import Utils from 'src/app/_utility/utils';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(private svc: RestService) { }
  custTitle: string;
  cust: mm_customer;
  showCust = false;
  tm_denominationList: tm_denomination_trans[] = [];
  denominationList: tt_denomination[] = [];
  denominationGrandTotal = 0;
  sys = new SystemValues();
  ngOnInit(): void {
    this.getDenominationList();
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
  private getDenominationOrTransferDtl(transactionDtl: td_def_trans_trf): void {
      //////////////debugger;
      
      console.log(transactionDtl)
      this.tm_denominationList = [];
      console.log(transactionDtl.remarks)
      this.denominationGrandTotal = 0;
        // this.hideOnClose=false;
        const tmDenoTrf = new tm_denomination_trans();
        tmDenoTrf.brn_cd = this.sys.BranchCode;
        tmDenoTrf.trans_cd = transactionDtl.trans_cd;
        tmDenoTrf.trans_dt = Utils.convertStringToDt(transactionDtl.trans_dt.toString());
        this.svc.addUpdDel<any>('Common/GetDenominationDtls', tmDenoTrf).subscribe(
          res => {
            //////////////debugger;
            if (null !== res && Object.keys(res).length !== 0) {
              // this.showDenominationDtl = true;
              this.tm_denominationList = res;
              this.tm_denominationList.forEach(element => {
                const denomination = this.denominationList.filter(e => e.value === element.rupees)[0];
                element.rupees_desc = denomination.rupees;
                this.denominationGrandTotal += element.total;
              });
            }
          },
          err => { }
        );
      
    }

}
