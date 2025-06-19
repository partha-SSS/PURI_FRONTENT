import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SystemValues } from '../bank-resolver/Models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {
  constructor(private router: Router) { }
  report:boolean;
  isAuthenticated:boolean = false;

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
  
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const sys = new SystemValues();
    

    if (sys.IsUsrLoggedIn ) { 
      console.log(`LOGGED OUT`);
      this.isAuthenticated = true;
      return true;  }
    else if(this.report){
      console.log(`LOGGED OUT`);
      debugger
      return true;}
   else{ 
    console.log(`LOGGED OUT`);
    const bankName = localStorage.getItem('__bName');
    localStorage.clear();
    
    localStorage.setItem('__bName', bankName);
    this.isAuthenticated = false;
    
    return false;
   }
    
  }
  // this.router.navigate([bankName + '/login']);
}



