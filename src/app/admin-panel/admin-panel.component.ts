import { BankConfiguration } from '../bank-resolver/Models';
import { ConfigurationService } from '../_service';
import { Router } from '@angular/router';
import { OnInit, Component } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  BC: BankConfiguration[] = [];
  masterConfig: BankConfiguration[] = [];
  allBankConfig: any;

  constructor(private router: Router) { }

  ngOnInit(): void { }


  configNewBank() {
    // this.router.navigate(['/NewBankConfig'], );
    this.router.navigate(['/ConfigNewBank']);
  }


  navMasterConfig() {
    // this.router.navigate(['/MasterConfig'], );
    this.router.navigate(['/MasterMenuConfig']);

  }

  navBankWiseConfig() {
    this.router.navigate(['/BankWiseConfig']);
  }

}
