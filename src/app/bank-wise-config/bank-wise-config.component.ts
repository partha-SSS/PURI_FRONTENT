import { Component, OnInit } from '@angular/core';
import { BankConfig } from '../bank-resolver/Models';
import { ConfigurationService } from '../_service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RestService } from '../_service/rest.service';


@Component({
  selector: 'app-bank-wise-config',
  templateUrl: './bank-wise-config.component.html',
  styleUrls: ['./bank-wise-config.component.css']
})
export class BankWiseConfigComponent implements OnInit {


  spinner = true;
  bnkConfigList: BankConfig[] = [];


  constructor(private confSvc: ConfigurationService,
              private rstSvc: RestService,
              private router: Router,
              private location: Location) { }

  ngOnInit(): void {
    this.getAllBankConfigData();
  }



  private getAllBankConfigData() {
    this.spinner = true;
    this.rstSvc.addUpdDelMaster<any>('Admin/GetBankConfigDtls', null).subscribe(
      res => {
        this.bnkConfigList = res;
        this.bnkConfigList = this.bnkConfigList.filter(x => x.bank_name !== 'MASTER');
        this.spinner = false;
      },
      err => { }
    );
  }

  navigateBack() {
    this.location.back();
  }

  navBankConfig(data1: string, data2: string, data3: string) {
    this.router.navigate(['/BankConfig'], {
      queryParams: { bankName: data1, bankDesc: data2, bankConfigId: data3 }
    });
  }

}
