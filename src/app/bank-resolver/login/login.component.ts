import { RestService } from './../../_service/rest.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LOGIN_MASTER, SystemValues } from '../Models';
import { InAppMessageService } from 'src/app/_service';
import { sm_parameter } from '../Models/sm_parameter';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CommonServiceService } from '../common-service.service';
import { Observable } from 'rxjs';
// import {WINDOW} from '../../bank-resolver/window.providers'
// import { SampleService } from './services';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[DatePipe]
})
export class LoginComponent implements OnInit {

  // private apiUrl = 'https://api.ipify.org/?format=json';
  private apiUrl = 'https://api.ipify.org?format=json';
  // https://api64.ipify.org/?format=json
  // https://api4.ipify.org/?format=json
  private baseURL:string='https://puriuat.purdcsltd.com/PURIUATUX/api'
  loginForm: FormGroup;
  returnUrl: string;
  isError = false;
  brnDtls: any = [];
  // ardbBrnMst: mm_ardb[] = [];
  ardbBrnMst: any = [];
  // ardbBrnMst: any[] = [];
  systemParam: sm_parameter[] = [];
  // genparam=new p_gen_param();
  isLoading = false;
  showAlert = false;
  alertMsg = '';
  ipAddress: any;
  showUnlockUsr = false;
  usrToUnlock: any;
  nm: any
  userData: any;
  dtData:any
  getIp:any
  loginStatus:boolean=true;
  filterUser:any=[];
  selectalluser:any=[];
  sys = new SystemValues();
  wrongAttamt:any;
  bankFullName:any;
  footer:any;
  ARBD:any='';
  SBaccCD:any;
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private rstSvc: RestService,
    private msg: InAppMessageService,
    private http: HttpClient,
    private cms:CommonServiceService
    // @Inject(WINDOW) private window:Window
    ) {

     }

  ngOnInit(): void {
   
    this.ARBD="1"
  //  this.getMyIp();
    this.wrongAttamt=localStorage.getItem('W_attempt')
    this.encriptPass();
   this.bankFullName='';
    localStorage.removeItem('ardb_name');
    localStorage.removeItem('L2L');
    if (this.router.url.includes('/login')) {
      // this.getLogdUser();
      //  this.updateLoginStatus();
    }

    // alert("hii")
    // const getmac = require('getmac')
    // //console.log(getmac)
    // //console.log(window.location.hostname)
  //  this.getPrivateIP()
    this.loginForm = this.formBuilder.group({
      ardbbrMst: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      branch: ['', Validators.required]
    });
    this.loginForm.enable();
    this.msg.sendisLoggedInShowHeader(false);
    this.isLoading = true;

    setTimeout(() => {
      this.GetBranchMaster();
      this.GetARDBMaster();
      this.getparamval();

      // this.getArdbCode();
      const sys = new SystemValues();
      // if (null !== sys.UserId && sys.UserId.length > 0) {
      //   const usr = new LOGIN_MASTER();
      //   usr.brn_cd = sys.BranchCode;
      //   usr.user_id = sys.UserId;
      //   usr.login_status = 'N';

      //   this.updateUsrStatus(usr);
      // }
      localStorage.removeItem('__userId');
      this.isLoading = false
    }, 300);

  }

getparamval(){
  this.rstSvc.addUpdDel('Mst/GetSystemParameter', null).subscribe(
    sysRes => {
          console.log(sysRes);
          // const __bName = localStorage.getItem('__bName');
          this.systemParam = sysRes;
        //  this.bankFullName=this.systemParam.find(x => x.param_cd === '100')?.param_value
         this.bankFullName='Puri Urban & Rural Development Cooperative Society Ltd'

    })
}
  encriptPass(){
    const text = "Partha@123";

    // Convert the text to hexadecimal
    const hexText = Array.from(text, char => char.charCodeAt(0).toString(16)).join('');

    console.log(hexText);
    debugger
    }

  getLogdUser(){
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('itemUX');
    login.brn_cd = localStorage.getItem('BUX');
    login.ardb_cd=this.sys.ardbCD;

    this.cms.addUpdDel('Sys/GetUserIDStatus', login).subscribe(
      res => {


        this.selectalluser=res
        this.filterUser=this.selectalluser.filter(x => x.login_status == 'Y')

        //console.log(this.filterUser);
        for(let i=0;i<this.filterUser.length;i++){
          if(this.filterUser[i].user_id ==localStorage.getItem('itemUX')){
            this.filterUser[i].login_status='N';

        //console.log(this.filterUser);

        this.filterUser.forEach(e => {
          e.ardb_cd=this.sys.ardbCD
          e.brn_cd=localStorage.getItem('BUX')
         });

         this.cms.addUpdDel('Sys/UpdateUserIdStatus', this.filterUser).subscribe(
          res => {
            //console.log(res)

          },)

        localStorage.removeItem('itemUX')
        localStorage.removeItem('BUX')

          }

       }




      })


 }
  getArdbCode() {
    this.wrongAttamt=0;
    this.f.username.setValue('')
    this.f.password.setValue('')
    this.f.branch.setValue('')
    this.ARBD="1";


    var dt = {
      "ardb_cd": "1",
      "user_id": this.f.username.value
    }
    this.isLoading=true;
    if(this.f.username.value.length>0)
    this.rstSvc.addUpdDel('Mst/GetUserType', dt).subscribe(data => { //console.log(data)

       if(data){
        this.userData = data;
        this.isLoading=false;
        if(this.userData[0]?.user_type=="D"){
          this.showAlert=true;
          this.alertMsg='User id was Locked, Contact to Administrator!'
          this.isLoading=false;
          this.loginForm.invalid;
          return true;
        }

       }
       else{
        this.showAlert=true;
        this.alertMsg='Somthing was wrong, try again..'
        this.isLoading=false;
        return
       }

      },
      err => {
        this.isLoading = false;
      })
    debugger
    //console.log(e);
    //console.log(this.ardbBrnMst);
    // let bankName='Utkal Financial Co-operative Society Ltd.'
    this.bankFullName='Puri Urban & Rural Development Cooperative Society Ltd'
    // let bankName2=this.ardbBrnMst.filter(x=>x.ardB_CD=='100')[0].bank_name
    debugger

    localStorage.setItem('__ardb_cd','1');

    localStorage.setItem('__bName', 'PURIUATUX');

    this.router.navigate(['PURIUATUX' + '/login']);
    this.GetBranchMaster();
  }
  get f() { return this.loginForm.controls; }
  onSubmit(): void {
    debugger
    this.f.ardbbrMst.setValue('1')
    console.log(this.f.ardbbrMst.value);

    this.showUnlockUsr = false;
    // this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    if(this.userData[0]?.user_type != 'A' &&  this.userData[0]?.brn_cd!=this.f.branch.value){
        this.f.branch.disable() ;
        this.showAlert=true;
        this.alertMsg='User only signed into that branch where they were assigned.'
        return
    }
    else{
      this.isLoading = true;
      const __bName = localStorage.getItem('__bName');
      // this.router.navigate([__bName + '/la']); // TODO remove this it will be after login
      const login = new LOGIN_MASTER();
      const toreturn = false;
      const hexText: string = Array.from(this.f.password.value, (char: string) => char.charCodeAt(0).toString(16)).join('');
      login.ardb_cd = this.ARBD;
      login.user_id = this.f.username.value;
      login.password = hexText;
      login.brn_cd = this.f.branch.value;
      this.nm = this.ardbBrnMst.find(x => x.ardB_CD == '1')

      // this.nm.name = this.nm.name.substr(0,this.nm.name.length-10)
      // this.nm.name = this.nm.name +' Co-Operative Agriculture & Rural Development Bank Ltd.'
      localStorage.setItem('ardb_name', this.bankFullName)
      localStorage.setItem('report_footer', 'This report is generated through Synergic Banking ')


        // let ardb_addrs=''
        // localStorage.setItem('ardb_addr', ardb_addrs)


      localStorage.setItem('itemUX', this.f.username.value)
      localStorage.setItem('BUX', this.f.branch.value)
      this.rstSvc.addUpdDel<any>('Mst/GetUserDtls', login).subscribe(
        res => {
          //console.log(res.length)
          // this.isLoading = false;
          if (res.length === 0) {
            this.wrongAttamt?this.wrongAttamt:0
            this.wrongAttamt+=1;
            localStorage.setItem('W_attempt',  this.wrongAttamt);


            if(this.wrongAttamt==1){
              this.showAlert = true;
              this.isLoading=false;
              this.alertMsg = `Invalid UserName Or Password,(Wrong Attamt - ${this.wrongAttamt})`;
            }
            else if(this.wrongAttamt==2){
              this.showAlert = true;
              this.isLoading=false;
              this.alertMsg = `Wrong Attamt - ${this.wrongAttamt}, After one more wrong attamt ID will be locked `;
            }
           else if(this.wrongAttamt>2){
              var dc={
                "ardb_cd":this.ARBD,
                "user_id":this.f.username.value
              }
              this.rstSvc.addUpdDel<any>('Sys/DeleteUserMaster', dc).subscribe(
                res => {
                  if(res==0){
                    this.showAlert = true;
                    this.isLoading=false;
                    this.alertMsg = 'User id was locked, Contact to Administrator!';
                  }
                })
            }
            else{
              this.showAlert = true;
              this.isLoading=false;
              this.alertMsg = `Invalid UserName Or Password,(Wrong Attamt - ${this.wrongAttamt})`;
            }

            debugger
          }
          else {

            //console.log(res[0])

            if (res[0].login_status === "Y") {
              this.showAlert = true;
              this.isLoading=false;
              this.alertMsg = 'User id already logged in another machine;';
              // this.showUnlockUsr = true;
              // alert(this.showUnlockUsr)
              this.usrToUnlock = res[0];
              return;
            }
            else {
              // this.isLoading=true;
              var dt = this.brnDtls.find(x => x.brn_cd == this.f.branch.value)
              // this.getPrivateIP()
              this.getBranchIp(dt).then(response => {

                if (response == true) {
                  res[0].login_status = 'Y';
                  res[0].ip = localStorage.getItem('ipAddress');
                  // this.updateUsrStatus(res[0]);
                  this.getSystemParam();
                }

                else {

                }
                //  this.isLoading=false;
              })
            }
          }
        },
        err => {
          this.isLoading = false;
          this.showAlert = true;
          this.alertMsg = 'Invalid Credential !!!!!';
        }
      ),
      err => {
        this.isLoading = false;
      };

    }

  }

  closeAlert() {
    this.showAlert = false;
  }

  public unlockUsr(): void {
    this.isLoading = true;
    this.usrToUnlock.login_status = 'N';
    this.rstSvc.addUpdDel('Mst/Updateuserstatus', this.usrToUnlock).subscribe(
      res => {
        this.isLoading = false;
        this.onSubmit();
      },
      err => { this.isLoading = false;}
    );
  }

  private updateUsrStatus(usr: any): void {
    this.rstSvc.addUpdDel('Mst/Updateuserstatus', usr).subscribe(

      res => {
        debugger
      },
      err => { }
    );
  }
  private getSystemParam(): void {
    this.isLoading=true
    var dt={
      "ardb_cd":this.ARBD
    }

    this.rstSvc.addUpdDel('Mst/GetSystemDate',dt).subscribe(data=>
      {
        //console.log(data)
        this.dtData=data
        //console.log(this.dtData.sys_date)
        localStorage.setItem('__currentDate', this.dtData.sys_date); // Day initilaze
        localStorage.setItem('__prevDate',this.dtData.prev_date)

    this.rstSvc.addUpdDel('Mst/GetSystemParameter', null).subscribe(
      sysRes => {
        try {
      // this.bankFullName=this.systemParam.find(x => x.param_cd === '100')?.param_value

          //console.log(sysRes);
          const __bName = 'PURIUATUX';
          this.systemParam = sysRes;
          // //console.log(this.systemParam.find(x => x.param_cd === '206').param_value)

          this.router.navigate([__bName + '/la']);
          // this.http.get<{ ip: string }>(this.apiUrl).subscribe(
          //   data => {
          //     debugger
          //     const getIP =  data.ip.split(",");
          //    localStorage.setItem('ipAddress', getIP[0]);


          //   })
            this.SBaccCD="1";
            localStorage.setItem('sbAccType', this.SBaccCD);

          localStorage.setItem('L2L', 'true');
          // //console.log(localStorage.getItem('ipAddress'))
          localStorage.setItem('__ardb_cd', '1');
          localStorage.setItem('__dist_cd', this.ardbBrnMst.find(x=>x.ardB_CD == '1')?.dist_code)
          localStorage.setItem('__brnCd', this.f.branch.value); // "101"
          localStorage.setItem('__brnName', this.brnDtls.find(x => x.brn_cd === this.f.branch.value)?.brn_name); // "101"
          // localStorage.setItem('__currentDate', this.systemParam.find(x => x.param_cd === '206').param_value); // Day initilaze
          localStorage.setItem('__cashaccountCD', this.systemParam.find(x => x.param_cd === '213')?.param_value); // 28101
          localStorage.setItem('__ddsPeriod', this.systemParam.find(x => x.param_cd === '220')?.param_value); // 12
          localStorage.setItem('societyName', this.systemParam.find(x => x.param_cd === '100')?.param_value); // 12
          localStorage.setItem('__userId', this.f.username.value); // feather
          localStorage.setItem('__minBalWdChq', this.systemParam.find(x => x.param_cd === '301')?.param_value);
          localStorage.setItem('__minBalNoChq', this.systemParam.find(x => x.param_cd === '302')?.param_value);
          localStorage.setItem('__dpstBnsRt', this.systemParam.find(x => x.param_cd === '805')?.param_value);
          localStorage.setItem('__pnlIntRtFrAccPreMatClos', this.systemParam.find(x => x.param_cd === '802')?.param_value);
          localStorage.setItem('__curFinyr', this.systemParam.find(x => x.param_cd === '207')?.param_value);
          // zlocalStorage.setItem('__neftPayDrAcc', this.systemParam.find(x => x.param_cd === '820').param_value);
          localStorage.setItem('__sbInttCalTilDt', this.systemParam.find(x => x.param_cd === '799')?.param_value);
          localStorage.setItem('__lastDt', this.systemParam.find(x => x.param_cd === '210')?.param_value);
          localStorage.setItem('__PrevStatus', this.systemParam.find(x => x.param_cd === '215')?.param_value);
          localStorage.setItem('__FinYearClose', this.systemParam.find(x => x.param_cd === '214')?.param_value);
          localStorage.setItem('DDS_INT_RT', this.systemParam.find(x => x.param_cd === '996')?.param_value);

          // localStorage.setItem('__neftPayDrAcc','401101000283' ):localStorage.setItem('__neftPayDrAcc','0' )

    //  //console.log(this.dtData.sys_date)
        //  //console.log(localStorage.getItem('__currentDate'))
          this.msg.sendisLoggedInShowHeader(true);
          this.loginForm.disable();
        }

        catch (exception) {
          this.isLoading = false;
          this.showAlert = true;
          this.alertMsg = 'Initialization Failed. Contact Administrator !';
        }
      },
      sysErr => { }
    );
  },
  error=>{
    this.isLoading = false;
  }
  )

  }

  cancel() {
    // localStorage.clear();
    // localStorage.removeItem('__bName');
    localStorage.removeItem('__brnName');
    localStorage.removeItem('__brnCd');
    localStorage.removeItem('__currentDate');
    localStorage.removeItem('__cashaccountCD');
    localStorage.removeItem('__ddsPeriod');
    localStorage.removeItem('__userId');
    localStorage.removeItem('ardb_name');
    localStorage.removeItem('__ardb_cd');
    localStorage.removeItem('ardb_addr');
    localStorage.removeItem('L2L');
    localStorage.removeItem('sbAccType');

    this.brnDtls.length = 0;
    this.loginForm.reset();
    this.loginForm.enable();
  }
  addPost(post: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/Mst/GetBranchMaster`, post);
  }
  private GetBranchMaster() {
    this.isLoading = true;
    var dt = { "ardb_cd": '1' };
    //console.log(dt)
    // https://puriuat.purdcsltd.com/CTARDBUX/api/Mst/GetBranchMaster
    this.addPost(dt).subscribe(
      res => {
        //console.log(res)
        this.isLoading = false;
        this.brnDtls = res;
        this.brnDtls.sort((a, b) => a.brn_cd - b.brn_cd);
      },
      err => {
        this.isLoading = false;
       }
    );
  }

  private GetARDBMaster() {
    // this.isLoading = true;
    // this.rstSvc.addUpdDel('Mst/GetARDBMaster', null).subscribe(
    //   res => {
    //     //console.log(res)
    //     this.ardbBrnMst = res;
    //   },
    //   err => {
    //     // this.isLoading = false;
    //   }
    // );
    this.rstSvc.getlbr(environment.ardbUrl,null).subscribe(data=>{
      // //console.log(data
      if(data){
        console.log(RestService.bankconfigurationList)
        this.ardbBrnMst = data;
      }

      // this.menuConfigs=data;
    })
  }
  onfocusOut(e: any) {

    var dt = {
      "ardb_cd": "1",
      "user_id": e.target.value
    }
    this.isLoading=true;
    this.rstSvc.addUpdDel('Mst/GetUserType', dt).subscribe(data => { //console.log(data)
       this.userData = data;
       if(this.userData){
        if(this.userData[0]?.user_type=="D"){
          this.showAlert=true;
          this.alertMsg='User id was Locked, Contact to Administrator!'
          this.isLoading=false;
          this.loginForm.disable();
          return true;
        }
        this.isLoading=false;
        localStorage.setItem('userType',this.userData[0]?.user_type)
       this.loginForm.patchValue({branch:this.userData[0]?.user_type != 'A' ?  this.userData[0]?.brn_cd : ''})
       this.userData[0]?.user_type != 'A' ? this.f.branch.disable() : this.f.branch.enable();
       this.showAlert = this.userData[0]?.login_status == 'Y' ? true : false;
       this.alertMsg = this.userData[0]?.login_status == 'Y' ? 'User id already logged in another machine' : '';
       }
       // if (this.userData[0].user_type != 'A') {
      //   this.loginForm.patchValue({
      //     branch: this.userData[0].brn_cd
      //   })
      // }

      // else{
      //   this.loginForm.patchValue({
      //     branch: ''
      //   })
      //   this.f.branch.enable();
      // }
      // if (this.userData[0].login_status == 'Y') {
      //   this.showAlert = true;

      //   this.alertMsg = 'User id already logged in another machine;';
      // }
    },
    error=>{
      this.isLoading=false;
    })
  }
  
  public getBranchIp(e: any) {
    this.loginForm.disable();
    return new Promise((resolve, reject) =>
     {
      fetch(this.apiUrl).then(
            (response) => response.json()
          ).then(
            (data) => {
            this.ipAddress = data.ip;
            debugger
          // console.log(data)

          const myIP =  this.ipAddress.split(",");
          localStorage.setItem('ipAddress',this.ipAddress)
          // localStorage.setItem('ipAddress',myIP[0])
          this.isLoading = false;

          // this.loginForm.enable();
          // resolve(true);

          let ipMatched = false;
          if (e.ip_address.indexOf(myIP[0]) !== -1) {
             ipMatched = true;
            }

          if (!ipMatched) {
            this.showAlert = true;
            this.alertMsg = 'IP not allowed to access, contact support.';
            this.loginForm.disable();
            resolve(false);
          } else {
            this.loginForm.enable();
            resolve(true);
          }
          });
        
     }
    )

  }


}
