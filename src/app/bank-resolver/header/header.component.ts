import { AfterViewInit, Component,ViewChild , HostListener, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import { AuthenticationService, InAppMessageService, RestService } from 'src/app/_service';
import { BankConfigMst, submenu, SystemValues, LOGIN_MASTER, MenuConfig, ShowMessage, MessageType } from '../Models';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { sd_day_operation } from '../Models/sd_day_operation';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy,AfterViewInit {
  currentRoute: any;
  objectKeys = Object.keys;
  constructor(private rstSvc: RestService,private formBuilder: FormBuilder, private router: Router, private svc:RestService, private modalService:BsModalService,
              private msg: InAppMessageService,private auth:AuthenticationService,private http: HttpClient) {
                this.showScreenTitle=false
                this.selectedScreenToShow=''
                this.router.events.subscribe(event => {
                  if (event instanceof NavigationEnd) {
                    this.currentRoute = event.url;
                      //console.log(event);
                      this.showScreenTitle=event.url.includes('/la') ? false:true

                }
                });

  }

  @ViewChild('fast') public fast;
  @ViewChild('second') public second;
  @ViewChild('third') public third;
  @ViewChild('foth') public foth;
  @ViewChild('template2', { static: true }) template2: TemplateRef<any>;
  @ViewChild('Notice', { static: true }) Notice: TemplateRef<any>;
  @ViewChild('PassValidity', { static: true }) PassValidity: TemplateRef<any>;
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;
  @ViewChild(MatMenu) menu: MatMenu;
  @ViewChild('menuItem') menuItem: MatMenuItem;
  // currTm= ' '+ '| '+ new Date().toString().substring(16,24)+ ' '
  currTm= new Date().toString().substring(16,24)+ ' '
  currDt= new Date().toString().substring(0,15)
  ardbName:any;
  subscription: Subscription;
  collapsed = true;
  bankConfig: BankConfigMst;
  bankName: string;
  userType:any;
  userPermission:any[]=[];
  brnCD=localStorage.getItem('__brnCd');
  bankFullName: string;
  showMsg: ShowMessage;
  subMenu: submenu;
  showMenu = false;
  showChildMenu = false;
  showSubMenu = false;
  showScreenTitle = false;
  currUser:any;
  menuUserType:any;
  selectedScreenToShow: string;
  sys = new SystemValues();
  show = false;
  userInfo:any;
  PassCH: FormGroup;
  currentMenu: MenuConfig;
  inside = false;
  menuConfigs:any=[];
  hideMenuOnComplete=false
  selectalluser:any=[];
  filterUser:any=[]
  modalRef?:BsModalRef
  sdoRet:any=[]
  sdo:any;
  buttonID:string;
  isLoading = false;
matmenuTrg:any=[];
  permission:boolean=false;
  dynamicLink:any;
  dynamicLink2:any;
  dynamicLink3:any;
  showOpenYear:boolean=false;
  items: any[];
  showLocker:boolean=true;
  menuItems:any[]=[]
  AllItem:any[]=[]
  allMenu:any;
  roleCD:any;
  expDay:string='10/11/2023';
  withinExp:Number;
  passchange:boolean=false;
  show_eye: Boolean = false;
  show_button: Boolean = false;
  combinationCheck:Boolean = false;
  equalityCheck:Boolean = false;
  passSave:boolean=false;
  Npassword:any;
  Cpassword:any;
  currFinYear:any='';
  ngOnInit(): void {
    this.PassCH = this.formBuilder.group({
      Npassword:['', Validators.required],
      Cpassword: ['', Validators.required]
    })
    this.currUser=localStorage.getItem('__userId');
    const nextYear = (+this.sys?.CurrentFinancialYr) + 1;
    this.currFinYear=`${this.sys?.CurrentFinancialYr} - ${nextYear}`
    this.CheckPasswordValidity();
  // this.getUser()
  this.getLogdUser()
   //console.log(localStorage.getItem('__currentDate')==localStorage.getItem('__prevDate'))

    setInterval(()=>{
      // this.currTm= ' '+ '| '+ new Date().toString().substring(16,24)+ ' '
      this.currTm= new Date().toString().substring(16,24)+ ' '
      this.currDt= new Date().toString().substring(0,15)
      // if(this.route.url.includes('la'))
      //    this.showScreenTitle=false
    ,1000})

    this.ardbName=localStorage.getItem('ardb_name')
    this.bankName = localStorage.getItem('__bName');

    debugger
    this.retrieve();
// this.openModalMessage(this.Notice)
  }

  callMenu(){

      this.isLoading=true;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "role_cd":this.roleCD
      }
      this.svc.addUpdDel('Mst/GetMenuPermission', dt).subscribe(
        res => {
          console.log(res);
          this.allMenu=res
          this.AllItem=this.allMenu.menu_module;
          this.menuItems=[]
          const customOrder = ['UCIC', 'Finance', 'Deposit', 'Loans', 'System', 'Transfer', 'Investment', 'Locker','Borrowing','Asset Management'];
          this.menuItems = this.AllItem.sort((a, b) => {
            const menuNameA = a.menu_name;
            
            const menuNameB = b.menu_name;
            const indexA = customOrder.indexOf(menuNameA);
            const indexB = customOrder.indexOf(menuNameB);

            return indexA - indexB;
          });
          console.log(this.menuItems);
          debugger
       this.isLoading=false

        })

  }
  getLogdUser(){
    this.isLoading=true;
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('__userId');
    // login.brn_cd = this.sys.BranchCode;
    login.ardb_cd=this.sys.ardbCD,

    this.svc.addUpdDel('Sys/GetUserIDStatus', login).subscribe(
      res => {
        if(res){
        this.selectalluser=res

        // this.roleCD=1
        // if(this.roleCD>0){this.callMenu()}
      }
      })
 }


  private hideMenu(): void {
    this.inside = false;
    this.menuConfigs.forEach(lv1 => {
      lv1.show = false;
      lv1.childMenuConfigs.forEach(lv2 => {
        lv2.show = false;
        // lv2.childMenuConfigs.forEach(lv3 => {
        //   lv3.show = false;
        //   lv3.childMenuConfigs.forEach(lv4 => {
        //     lv4.show = false;
          });
        });
      // });
    // });
  }



  logout() {
    localStorage.removeItem('L2L');
    this.hideMenu();
    // localStorage.removeItem('__bName');
    // this.router.navigate(['/']);
    this.updateUsrStatus();
    localStorage.removeItem('__brnName');
    localStorage.removeItem('__brnCd');
    localStorage.removeItem('__currentDate');
    localStorage.removeItem('__cashaccountCD');
    localStorage.removeItem('__ddsPeriod');
    localStorage.removeItem('__userId');
    localStorage.removeItem('ardb_name');
    localStorage.removeItem('__ardb_cd');
    localStorage.removeItem('W_attempt');

    this.msg.sendisLoggedInShowHeader(false);
    this.router.navigate([this.bankName + '/login']);
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm modal-dialog-centered'});
  }
  openModalPassCheck(PassValidity: TemplateRef<any>) {
    // this.expDay=localStorage.getItem('PassExpDay');
    this.modalRef = this.modalService.show(PassValidity, {class: 'modal-lg modal-dialog-centered'});
  }
  openModalMessage(Notice: TemplateRef<any>) {
    // this.expDay=localStorage.getItem('PassExpDay');
    this.modalRef = this.modalService.show(Notice, {class: 'modal-lg modal-dialog-centered'});
  }
  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
  CheckPasswordValidity(){
    const curDate=new Date();
    const expDate = new Date(this.expDay);
    const timeDifference = expDate.getTime() - curDate.getTime();
    const differenceInDays = Math.floor(timeDifference / (1000 * 3600 * 24));
    console.log(differenceInDays);
    this.withinExp=differenceInDays+1;
    if(differenceInDays>3){
      return
    }
    else{
      return
      // this.openModalPassCheck(this.PassValidity)
    }
  }
  showChangePass(){
    this.passchange=true;
  }
  saveNewPass(){
    alert("save")
  }
  private updateUsrStatus(): void {
    // alert("hii")
    const usr = new LOGIN_MASTER();
    usr.ardb_cd=this.sys.ardbCD
    usr.brn_cd = this.sys.BranchCode;
    usr.user_id = this.sys.UserId;
    usr.login_status = 'N';
    this.rstSvc.addUpdDel('Mst/Updateuserstatus', usr).subscribe(
      res => { },
      err => { }
    );
  }

  goToHome() {
    this.hideMenu();
    this.router.navigate([this.bankName + '/dashboard']);
    this.showMenu = true;
    this.showChildMenu = false;
    this.showSubMenu = false;
    this.showScreenTitle = false;
  }
  confirm(): void {
    this.isLoading=true;
    this.modalRef?.hide();
    this.logout();
  }

  decline(): void {
    this.modalRef?.hide();
  }


  private hideScreenTitle(): void {
    this.showScreenTitle = false;
    // this.selectedScreenToShow = '';
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
  ngAfterViewInit(){
    // this.isLoading=true
    setTimeout(() => {
      // this.getPermission();
      //  this.isLoading=false
    }, 5000);

  }
  openMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.openMenu();
  }

//  getPermission(){
//   this.isLoading=true;
//   var data = {
//     "ardb_cd": this.sys.ardbCD,
//     "role_cd":this.userType=='S'?2:this.userType=='G'?3:1
//   }
//   this.svc.addUpdDel<any>('Mst/GetRolePermission', data).subscribe(
//     res => {
//       //console.log(res);
//       this.userPermission=res
//       this.items=res


//     })

//  }



  retrieve ()
  {
    this.isLoading = true;
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('__userId');
    //
    // login.user_id=login.user_id.split('/')[0]
    login.brn_cd = this.sys.BranchCode;
    login.ardb_cd=this.sys.ardbCD,
    // this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
    //   res => {
    //     ;//console.log(res)
    //     this.userType=res[0].user_type
    //     if(localStorage.getItem('__currentDate')==localStorage.getItem('__prevDate')){
    //       this.hideMenuOnComplete=true
    //     }
    //     else{
    //       this.hideMenuOnComplete=false
    //     }
    //    } )
    this.sdo = new sd_day_operation();
    this.sdo.ardb_cd=this.sys.ardbCD
    //sdo.operation_dt =this.convertDate(localStorage.getItem('__currentDate'));// new Date();
    this.sdo.operation_dt =this.sys.CurrentDate;
    ;
    this.svc.addUpdDel<any>('Sys/GetDayOperation', this.sdo).subscribe(
      res => {//console.log(res)
        this.sdoRet=res
        this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
            res => {
              this.userInfo=res[0]
              ;//console.log(res)
              this.userType=res[0]?.user_type
              this.roleCD=this.userType=='A'?1:this.userType=='S'?2:this.userType=='G'?3:4
              debugger
              if(this.roleCD>0){
                this.callMenu()
                this.updateLogStatus()
              }
              //console.log(this.sdoRet.filter(x=>x.brn_cd==this.sys.BranchCode)[0].cls_flg=="Y")
              // if(this.sdoRet.filter(x=>x.brn_cd==this.sys.BranchCode)[0].cls_flg=="Y"){
              //   this.hideMenuOnComplete=true
              // }

               if(this.sdoRet.filter(x=>x.brn_cd==this.sys.BranchCode)[0].cls_flg=="Y" ){
                const m = this.convertDate(this.sys.lastDt);
                const c = this.sys.CurrentDate;
                const diffDays = Math.ceil((m.getTime() - c.getTime()) / (1000 * 3600 * 24));

                //console.log(c);
                //console.log(m);
                //console.log(diffDays);
                debugger
                if(diffDays==0 && this.sys.BranchCode=='101'){
                  this.hideMenuOnComplete=true
                  this.showOpenYear=true;
                }
                else{this.hideMenuOnComplete=true}//tobechange
              }
              else
              this.hideMenuOnComplete=false
              if(res.length>0){
                debugger
                // this.isLoading = false;


              }
            }

        )




      })
      // this.getPermission()
  }
  private  convertDate(datestring:string):Date
{
var parts = datestring.match(/(\d+)/g);
return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
}
updateLogStatus(){
  if(this.userInfo){
    this.userInfo.login_status='Y';
    this.userInfo.password=null;
    this.userInfo.ip=localStorage.getItem("ipAddress");
    // this.userInfo.forEach(e => {
    //   e.brn_cd=localStorage.getItem('BUX')
    //  });
    debugger
    this.svc.addUpdDel('Mst/Updateuserstatus', this.userInfo).subscribe(
      res => {debugger})
  }

}
openNewTab() {
  this.auth.report=true;
  debugger
  const urlToOpen = `http://localhost:4200/${this.bankName}/FR_ProfitLoss`;
  window.open(urlToOpen);
}
    CpassCheck(i:any){
      const ConfPassword = i.target.value;
      this.PassCH.controls.Npassword.value;
      if( this.PassCH.controls.Npassword.value!=ConfPassword){
        this.equalityCheck = true;
      }else{
        this.equalityCheck = false;
      }
      debugger
    }
    passCheck(i:any){
      const password = i.target.value;
      const hasMinimumLength: boolean = password.length >= 8;
      const hasUppercase: boolean = /[A-Z]/.test(password);
      const hasNumber: boolean = /\d/.test(password);
      if(password.length<1){
        this.combinationCheck = false;
        this.equalityCheck = false;

      }
      else{
        if (hasMinimumLength && hasUppercase && hasNumber) {
          this.Npassword=password;
          this.combinationCheck = false;
          this.equalityCheck = false;
          this.passSave=true;// Clear error message if conditions are met
      } else {
        this.combinationCheck = true;
        // this.equalityCheck = true;
          this.passSave = false;
      }
     }
    }
    update_user_dtl(){
      this.isLoading=true;
      this.showMsg =null;
      let login = new LOGIN_MASTER();
      // login.user_id = this.u.userid.value;
      // login.brn_cd = this.u.branch.value;
      // login.user_first_name=this.u.fname.value;
      // login.user_middle_name=this.u.mname.value;
      // login.user_last_name=this.u.lname.value;
      // login.user_type=this.u.utype.value;
      // login.password=this.defaultPass;
      // login.login_status=this.u.logsts.value;
      // login.ardb_cd=this.sys.ardbCD;
      login.modified_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      //login.login_status='N';
      ;
      // this.checkPassword();
      this.svc.addUpdDel('Sys/UpdateUserMaster', login).subscribe(
        res => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess,'Sucessfully Updated the User Details' );
          // this.initialize();

        },
        err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Updation Failed!!' );

      }
      )
    }
    private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
      this.showMsg = new ShowMessage();
      this.showMsg.Show = show;
      this.showMsg.Type = type;
      this.showMsg.Message = message;
    }
}
