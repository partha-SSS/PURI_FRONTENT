import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockerRoutingModule } from './locker-routing.module';
import { LoakerDetailMasterComponent } from './loaker-detail-master/loaker-detail-master.component';
import { LoakerRentMasterComponent } from './loaker-rent-master/loaker-rent-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BankResolverModule } from '../bank-resolver.module';
import { LockerOpeningComponent } from './locker-opening/locker-opening.component';
import { LockerTransactionComponent } from './locker-transaction/locker-transaction.component';
import { LockerApproveComponent } from './locker-approve/locker-approve.component';
import { LockerViewComponent } from './locker-view/locker-view.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import {MatSortModule} from '@angular/material/sort';
import { LockerDetailsComponent } from './report/locker-details/locker-details.component';
import { LockerRenewDetailsComponent } from './report/locker-renew-details/locker-renew-details.component';
import { LockerShouldbeRenewComponent } from './report/locker-shouldbe-renew/locker-shouldbe-renew.component';
import { NgxPrintModule} from 'ngx-print';
import { LockerINOUTComponent } from './locker-inout/locker-inout.component';
import { LockerAccessComponent } from './report/locker-access/locker-access.component';
@NgModule({
  declarations: [LoakerDetailMasterComponent,LoakerRentMasterComponent, LockerOpeningComponent, 
    LockerTransactionComponent, LockerApproveComponent, LockerViewComponent, 
    LockerDetailsComponent, LockerRenewDetailsComponent, LockerShouldbeRenewComponent, LockerINOUTComponent, LockerAccessComponent],
  imports: [
    MatSortModule,
    CommonModule,
    LockerRoutingModule,
     ReactiveFormsModule,
     FormsModule ,
     BankResolverModule,
     MatTooltipModule,
     MatPaginatorModule,
     NgxPrintModule,
     MatTableModule,
     MatSlideToggleModule,
     MatDialogModule,MatInputModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class LockerModule { }
