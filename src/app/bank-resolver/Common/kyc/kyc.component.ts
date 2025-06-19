import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InAppMessageService, RestService } from 'src/app/_service';
import { kyc_sig, MessageType, ShowMessage } from '../../Models';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit, OnDestroy {

  constructor(private svc: RestService, private msg: InAppMessageService) {
    this.subscription = this.msg.getcustomerCodeForKyc().subscribe(
      res => {
        if (null !== res) {
          this.cust_cd = res;
          this.getImage(this.cust_cd);
        } else {
          this.cust_cd = null;
        }
      },
      err => { }
    );
  }
  ardb_cd:number;
  cust_cd: number;
  SIGNATURE: string;
  PHOTO: string;
  KYC: string;
  ADDRESS: string;
  isLoading: boolean;
  showMsg: ShowMessage;
  kycSig = new kyc_sig();
  subscription: Subscription;
  ngOnInit(): void {
  }
  getImage(_custCD: number) {
    this.isLoading = true;
    this.kycSig.ardb_cd = localStorage.getItem('__ardb_cd');
    this.kycSig.cust_cd = _custCD;//this.selectedVm.tm_deposit.cust_cd;
    this.kycSig.img_typ = 'SIGNATURE';//'SIGNATURE';
    this.svc.addUpdDel<any>('UCIC/ReadKycSig', this.kycSig).subscribe(
      res => {
        ;
        this.isLoading = false;
        if (null !== res && null !== res.img_cont) {
          this.SIGNATURE = 'data:image/jpeg;base64,' + res.img_cont;
        }
      },
      err => {
        ;
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, err.error.text);
      }
    );
    this.isLoading = true;
    this.kycSig.img_typ = 'PHOTO';//'SIGNATURE';
    this.svc.addUpdDel<any>('UCIC/ReadKycSig', this.kycSig).subscribe(
      res => {
        ;
        this.isLoading = false;
        if (null !== res && null !== res.img_cont) {
          this.PHOTO = 'data:image/jpeg;base64,' + res.img_cont;
        }
      },
      err => {
        ;
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, err.error.text);
      }
    );
    this.isLoading = true;
    this.kycSig.img_typ = 'ADDRESS';//'SIGNATURE';
    this.svc.addUpdDel<any>('UCIC/ReadKycSig', this.kycSig).subscribe(
      res => {
        ;
        this.isLoading = false;
        if (null !== res && null !== res.img_cont) {
        this.ADDRESS = 'data:image/jpeg;base64,' + res.img_cont;
        }
      },
      err => {
        ;
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, err.error.text);
      }
    );
    this.isLoading = true;
    this.kycSig.img_typ = 'KYC';//'SIGNATURE';
    this.svc.addUpdDel<any>('UCIC/ReadKycSig', this.kycSig).subscribe(
      res => {
        ;
        this.isLoading = false;
        if (null !== res && null !== res.img_cont) {
        this.KYC = 'data:image/jpeg;base64,' + res.img_cont;
        }
      },
      err => {
        ;
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, err.error.text);
      }
    );
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
    // setTimeout(() => {
    //   this.showMsg = new ShowMessage();
    // }, 3000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
