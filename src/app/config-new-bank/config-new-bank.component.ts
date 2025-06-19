import { Component, OnInit } from '@angular/core';
import { BankConfiguration , BankConfig } from '../bank-resolver/Models';
import { ConfigurationService } from '../_service';
import { Location } from '@angular/common';
import { RestService } from '../_service/rest.service';

@Component({
  selector: 'app-config-new-bank',
  templateUrl: './config-new-bank.component.html',
  styleUrls: ['./config-new-bank.component.css']
})
export class ConfigNewBankComponent implements OnInit {


  bnkConfigList: BankConfig[] = [];
  bnkConfig = new BankConfig();

  // bcUx: BankConfiguration[] = [];
  // bcMst: BankConfiguration[] = [];
  // masterConfig: BankConfiguration[] = [];

  // tempBankConfiguration = new BankConfiguration();

  spinner = true;
  addFlg = true;
  SaveFlg = false;
  addRec = false;
  showAlert = false;
  showAlert2 = false;
  alertMsg = '';
  ret = 0;

  constructor(private confSvc: ConfigurationService,
              private rstSvc: RestService,
              private location: Location) { }

  ngOnInit(): void {
    this.getAllBankConfigData();
  }

  private getAllBankConfigData() {
    this.spinner = true;
    debugger;
    this.rstSvc.addUpdDelMaster<any>('Admin/GetBankConfigDtls', null).subscribe(
      res => {
        this.bnkConfigList = res;
        this.spinner = false;
        debugger;
      },
      err => {
        debugger;
        this.showAlert = true;
        this.alertMsg = 'Unable to Save record...';
      }
    );
  }

  private insertUpdateBankConfigDtls(bc: BankConfig) {
    this.spinner = true;
    this.rstSvc.addUpdDelMaster<any>('Admin/InsertUpdateBankConfigDtls', bc).subscribe(
      res => {
        this.ret = res;
        this.spinner = false;
        if ( this.ret > 0)
        {
          this.getAllBankConfigData();
          this.showAlert2 = true;
          this.alertMsg = 'Record Save successfully...';
        }
        else
        {
          this.showAlert = true;
          this.alertMsg = 'Unable to Save record...';
        }
      },
      err => {
        this.showAlert = true;
        this.alertMsg = 'Unable to Save record...';
      }
    );
  }


addBank()
{
  this.addFlg = false;
  this.SaveFlg = true;
  this.addRec = true;
}

  saveData() {

    debugger;
    // tslint:disable-next-line: max-line-length
    if (this.bnkConfig.bank_name !== undefined &&
      this.bnkConfig.bank_desc !== undefined &&
      this.bnkConfig.server_ip !== undefined &&
      this.bnkConfig.db_server_ip !== undefined &&
      this.bnkConfig.user1 !== undefined &&
      this.bnkConfig.user2 !== undefined
    ) {
      this.insertUpdateBankConfigDtls(this.bnkConfig);
      this.bnkConfig = new BankConfig();

      this.addFlg = true;
      this.SaveFlg = false;
      this.addRec = false;
    }
    else {
      this.showAlert = true;
      this.alertMsg = 'Please enter record for all the field..';
    }
  }

update(idx: number)
{
  debugger;
  this.insertUpdateBankConfigDtls(this.bnkConfigList[idx]);
}

cancel()
{
  // this.getConfigData(this.masterConfig[0].apiUrl);
  this.addRec = false;
  this.SaveFlg = false;
  this.addFlg = true;
  this.showAlert = false;
  this.showAlert2 = false;
}





closeAlert() {
  this.showAlert = false;
  this.showAlert2 = false;
}

  navigateBack() {
    this.location.back();
  }

}
