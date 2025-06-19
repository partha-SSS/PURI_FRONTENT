import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues } from '../../Models';

@Component({
  selector: 'app-user-login-status',
  templateUrl: './user-login-status.component.html',
  styleUrls: ['./user-login-status.component.css']
})
export class UserLoginStatusComponent implements OnInit {
  brnDtls:any=[];
  selectalluser:any=[];
  sys = new SystemValues();
  isLoading=false;
  showMsg: ShowMessage;
  loginStatus:boolean=true;
  filterUser:any;
  statusVal:any
  form: FormGroup;
  finalLoginSts:any=[];
  currentUID:any;
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      loginsts: this.formBuilder.array([])
    })
   this.getLogdUser();
   this.currentUID=localStorage.getItem('__userId');
   
    
  }
  getLogdUser(){
     // Getuserdetails
     this.isLoading=true;
     let login = new LOGIN_MASTER();
     login.user_id = localStorage.getItem('__userId');
     login.brn_cd = localStorage.getItem('__brnCd');
     login.ardb_cd=this.sys.ardbCD,
     
     this.svc.addUpdDel('Sys/GetUserIDStatus', login).subscribe(
       res => {
         
         this.selectalluser=res
         console.log( this.filterUser=this.selectalluser.filter(x => x.login_status == 'Y'&& x.user_id!=this.currentUID));
         
         this.filterUser=this.selectalluser.filter(x => x.login_status == 'Y' && x.user_id!=this.currentUID)
        
        //  this.filterUser=this.selectalluser.filter(x => x.login_status == 'Y')
         console.log(this.filterUser.findIndex(x => x.value == localStorage.getItem('__userId')));
         this.filterUser.forEach(e => {
          e.ardb_cd=`${e.user_first_name} ${e.user_middle_name==null?'':e.user_middle_name+' '}${e.user_last_name}`
         });
         //   if(this.filterUser.login_status=='Y'){
         //     this.loginStatus=true;
 
         //   }
         //   else{
         //     this.loginStatus=false
         //   }
         // console.log(this.loginStatus)
         //   ;
         
         console.log(this.filterUser);
       })
  }
  onChange(lstatus: string, isChecked: boolean,i:any) {
    const emailFormArray = <FormArray>this.form.controls.loginsts;
    console.log(isChecked)
    this.filterUser[i].login_status=isChecked?'Y':'N'
    console.log(this.filterUser)
    // if (isChecked) {
    //   emailFormArray.push(new FormControl(lstatus));
    // } else {
    //   let index = emailFormArray.controls.findIndex(x => x.value == lstatus)
    //   emailFormArray.removeAt(index);
    // }
    // console.log(emailFormArray);
    
  }
  // onCheckboxChange(e) {
  //   const loginsts: FormArray = this.form.get('loginsts') as FormArray;
  
  //   if (e.target.checked) {
  //     const index = loginsts.controls.findIndex(x => x.value === e.target.value);
  //     loginsts.push(new FormControl(e.target.value));
       
  //     console.log(e.target.value);
      
  //   } else {
     
  //      const index = loginsts.controls.findIndex(x => x.value === e.target.value);
      
  //      loginsts.push(new FormControl(e.target.value));
  //      console.log(e.target.value);
  //   }
  // }
  changeStatus(i:any){
    // alert("hehehehe")
    //this.loginStatus=false
    this.statusVal=document.getElementById('status'+i)
    console.log(this.statusVal)

  }
  updateLoginStatus(){
    console.log(this.form.value)

    let login = new LOGIN_MASTER();
    
    // login.user_id = this.f.userid.value;
    login.login_status=this.loginStatus? 'Y':'N';
    console.log(login.login_status);
    debugger
    this.filterUser.forEach(element => {
      element.ardb_cd=this.sys.ardbCD
      element.brn_cd=this.sys.BranchCode
      
    });
    this.svc.addUpdDel('Sys/UpdateUserIdStatus', this.filterUser).subscribe(
      res => {
        console.log(res)
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Sucessfully Updated User Login Status' );
        this.getLogdUser();
      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Updation Failed!!' );
      
    }
    )
  }
  refreshScreen(){
    this.isLoading=true
    this.getLogdUser()
    this.isLoading=false
  }
  closeScreen()
  {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}
