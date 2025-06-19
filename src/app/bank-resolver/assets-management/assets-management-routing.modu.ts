import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationService as AuthGuard } from '../../_service/authentication.service';
import { AssetsManagementComponent } from './assets-management.component';


const routes: Routes = [
  { path: '', component: AssetsManagementComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsManagementRoutingModule { }
