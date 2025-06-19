import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BankResolverModule } from '../bank-resolver.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { AssetsManagementRoutingModule } from './assets-management-routing.modu';
import { MatSortModule } from '@angular/material/sort';
import { NgxPrintModule } from 'ngx-print';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TransAssetsComponent } from './transaction/trans-assets.component';
import { AnextureEntryComponent } from './master/anexture-entry/anexture-entry.component';
import { SubAnextureEntryComponent } from './master/sub-anexture-entry/sub-anexture-entry.component';



@NgModule({
  declarations: [TransAssetsComponent,SubAnextureEntryComponent,AnextureEntryComponent],
  imports: [
        CommonModule,
        AssetsManagementRoutingModule,
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
export class AssetsManagementModule { }
