import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { ConfigurationService } from '../_service/configuration.service';
import { BankConfig, BankConfiguration, mm_customer } from '../bank-resolver/Models';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',


})
export class CommonServiceService {
  static bankconfigurationList: BankConfig[] = [];
  // static serverIp = 'puriuat.purdcsltd.com';
  static serverIp = 'puriuat.purdcsltd.com';
  customerList: mm_customer[] = [];
  accOpen:boolean=false;
  accClose:boolean=false;
  loanDis:boolean=false;
  loanRec:boolean=false;
  openDayBook:boolean=false;
  openGlTrns:boolean=false;
  diff:any;
  localStorageArray:any[]=[];
  date_msg="FROM-DATE should be lower than TO-DATE"
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(private _snackBar: MatSnackBar,private datePipe:DatePipe,
    private http: HttpClient, private confSvc: ConfigurationService,
    private router: Router) {
      this.getConfiginSysn();
    }
    getLocalStorageDataAsJsonArray(){
      // Loop through all keys in local storage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); // Get the key
        const value = localStorage.getItem(key); // Get the corresponding value

        // Push each key-value pair as an object to the array
        this.localStorageArray.push({ [key]: value });
      }
      console.log(this.localStorageArray);


    }
    resetLocalStorageFromArray(): void {
      // Clear the existing local storage
      localStorage.clear(); // or set it to null: localStorage = null;

      // Loop through the array to set each key-value pair
      this.localStorageArray.forEach(item => {
        // Assuming each item is an object with one key-value pair
        const key = Object.keys(item)[0]; // Get the key
        const value = item[key];          // Get the corresponding value

        // Set the key-value pair back into local storage
        localStorage.setItem(key, value);
      });
    }
  SnackBar_Error() {
    this._snackBar.open('Error!!!', 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,

    });
  }
  SnackBar_Nodata() {
    this._snackBar.open('No Data!!!', 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,

    });
  }
  SnackBar_Success() {
    this._snackBar.open('Done!!!', 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,

    });
  }
  getDay(from_date,to_date){

    var date1=new Date(this.datePipe.transform(from_date, 'yyyy-MM-dd'))
    var date2=new Date(this.datePipe.transform(to_date, 'yyyy-MM-dd'))
    this.diff = this.dateDiffInDays(date1,date2);
    //console.log(this.diff)

    return this.diff
  }
  dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }


  async getConfiginSysn() {
    // RestService.configuration = (await this.confSvc.getAllConfiguration() as BankConfiguration[]);
    // console.log(await this.confSvc.getAllConfiguration(CommonServiceService.serverIp) as BankConfig[])
    CommonServiceService.bankconfigurationList = (await this.confSvc.getAllConfiguration(CommonServiceService.serverIp) as BankConfig[]);
  }
  private getUrl(): string {
    // debugger;

    const __bName = localStorage.getItem('__bName');
    // console.log(CommonServiceService.bankconfigurationList);

    //     console.log( CommonServiceService.bankconfigurationList.
     //     filter(e => e.bank_name.toLowerCase() === __bName.toLowerCase())[0]);

      const bank = CommonServiceService.bankconfigurationList.
        filter(e => e.bank_name.toLowerCase() ===
        __bName.toLowerCase())[0];
     return 'https://' + CommonServiceService.serverIp + '/' + __bName + '/api/';


  }
  private getMasterUrl(): string {
    const url = 'https://' + CommonServiceService.serverIp + '/ardbMasterConfig/api/';
    return url;
  }
  public addUpdDel<T>(ofwhat: string, data: T): Observable<T> {
    // console.log(data)
    // console.log(ofwhat)
    // console.log(this.getUrl());
    // console.log(this.getUrl() + ofwhat)
    return this.http.post<T>((this.getUrl() + ofwhat), data);
  }
  public addUpdDelMaster<T>(ofwhat: string, data: T): Observable<T> {
    return this.http.post<T>((this.getMasterUrl() + ofwhat), data);
  }
  // getCustomerList() {

  //   const cust = new mm_customer();
  //   cust.cust_cd = 0;
  //   cust.brn_cd = this.branchCode;

  //   if (this.customerList === undefined || this.customerList === null || this.customerList.length === 0) {
  //     this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
  //       res => {
  //         console.log(res)
  //         this.isLoading = false;
  //         this.customerList = res;
  //       },
  //       err => {
  //         this.isLoading = false;

  //       }
  //     );
  //   }
  //   else { this.isLoading = false; }
  // }
  getFormatedDate(dateString: string): string{
    var parts = dateString.split(' ')[0].split('/');

    // Extract day, month, and year
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    // Array of month names
    var monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Format the date
    var formattedDate = day + ' ' + monthNames[month - 1] + ' ' + year;

    return formattedDate;



  }

}
