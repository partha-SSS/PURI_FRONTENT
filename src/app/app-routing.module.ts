import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankResolverComponent } from './bank-resolver/bank-resolver.component';
import { BankResolverModule } from './bank-resolver/bank-resolver.module';


const routes: Routes = [
  // { path: '', component: BankResolverComponent, pathMatch: 'full' },
  { path: ':bankName', component:  BankResolverComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [BankResolverModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
