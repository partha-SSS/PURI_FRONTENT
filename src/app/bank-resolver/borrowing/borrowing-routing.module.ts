import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationService as AuthGuard } from '../../_service/authentication.service';
import { BorrowingComponent } from './borrowing.component';


const routes: Routes = [
  { path: '', component: BorrowingComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BorrowingRoutingModule { }
