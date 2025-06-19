import { td_rd_installment } from './../../Models';
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InAppMessageService, RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';

@Component({
  selector: 'app-dw-rd-instl-view',
  templateUrl: './dw-rd-instl-view.component.html',
  styleUrls: ['./dw-rd-instl-view.component.css']
})
export class DwRdInstlViewComponent implements OnInit, OnDestroy {

  constructor(private svc: RestService, private msg: InAppMessageService) {
    this.subscription = this.msg.getCommonAccountNum().subscribe(
      res => {
        if (null !== res && undefined !== res &&
          +res !== 0) {
          this.accNum = res;
          this.getRdIntallementDtls();
        } else {
          this.installemnts = [];
        }
      },
      err => { }
    );
  }
  subscription: Subscription;
  accNum: string;
  installemnts: td_rd_installment[] = [];
  ngOnInit(): void {
    this.getRdIntallementDtls();
  }

  private getRdIntallementDtls(): void {
    if (null !== this.accNum && '' !== this.accNum) {
      const rdInstallament = new td_rd_installment();
      rdInstallament.acc_num = this.accNum;
      this.svc.addUpdDel<any>('Deposit/GetRDInstallment', rdInstallament).subscribe(
        res => {
          this.installemnts = Utils.ChkArrNotEmptyRetrnEmptyArr(res);
        },
        err => { }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
