import { NgModule ,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BankResolverModule } from '../bank-resolver.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import {MatSortModule} from '@angular/material/sort';
import { NgxPrintModule} from 'ngx-print';
import { BorrowingRoutingModule } from './borrowing-routing.module';
import { OpenBorrowingComponent } from './open-borrowing/open-borrowing.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TransBorrowingComponent } from './trans-borrowing/trans-borrowing.component';
import {INRCurrencyPipe} from '../../_utility/filter';
import { ApproveBorrowingComponent } from './approve-borrowing/approve-borrowing.component';
import { ViewBorrowingComponent } from './view-borrowing/view-borrowing.component';
import { BorroDetailListComponent } from './report/borro-detail-list/borro-detail-list.component';
import { CalculateBorrInttComponent } from './calculate-borr-intt/calculate-borr-intt.component'

@NgModule({
  declarations: [OpenBorrowingComponent, TransBorrowingComponent, ApproveBorrowingComponent, ViewBorrowingComponent, BorroDetailListComponent, CalculateBorrInttComponent],
  imports: [
    CommonModule,
    BorrowingRoutingModule,
    MatSortModule,
     ReactiveFormsModule,
     FormsModule ,
     BankResolverModule,
     MatTooltipModule,
     MatPaginatorModule,
     NgxPrintModule,
     MatTableModule,
     MatSlideToggleModule,
     MatDialogModule,MatInputModule,
     BsDatepickerModule 
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class BorrowingModule { }
