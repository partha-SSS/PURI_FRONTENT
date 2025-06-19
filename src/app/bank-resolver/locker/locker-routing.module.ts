import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LockerComponent } from './locker.component';
import { LoakerDetailMasterComponent } from './loaker-detail-master/loaker-detail-master.component';
import { LoakerRentMasterComponent } from './loaker-rent-master/loaker-rent-master.component';
import { AuthenticationService as AuthGuard } from '../../_service/authentication.service';


const routes: Routes = [
 { path: '', component: LockerComponent, canActivate: [AuthGuard] ,
  // children: [
  //   { path: 'loc_dtls', component: LoakerDetailMasterComponent , canActivate: [AuthGuard] },
  //   { path: 'loc_rent', component: LoakerRentMasterComponent, canActivate: [AuthGuard]  },
  // ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LockerRoutingModule { }
