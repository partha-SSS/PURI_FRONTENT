import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { FinanceComponent } from './bank-resolver/finance/finance.component';
import { BankConfigComponent } from './bank-config/bank-config.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { BankWiseConfigComponent } from './bank-wise-config/bank-wise-config.component';
import { TestComponent } from './test/test/test.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigNewBankComponent } from './config-new-bank/config-new-bank.component';
import { MasterMenuConfigComponent } from './master-menu-config/master-menu-config.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    FinanceComponent,
    BankConfigComponent,
    AdminPanelComponent,
    BankWiseConfigComponent,
    TestComponent,
    ConfigNewBankComponent,
    MasterMenuConfigComponent,
    AdminLoginComponent,
   
  ],
  imports: [
    MatSnackBarModule,
    BrowserModule, HttpClientModule, BrowserAnimationsModule, 
    AppRoutingModule,
    NgxJsonViewerModule, FormsModule, ReactiveFormsModule,
    ModalModule.forRoot(), BsDatepickerModule.forRoot(), AccordionModule.forRoot()
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
