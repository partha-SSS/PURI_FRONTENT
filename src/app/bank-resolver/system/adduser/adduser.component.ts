import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues } from '../../Models';
import { m_branch } from '../../Models/m_branch';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent implements OnInit {
  brnDtls:any=[];
  selectalluser:any=[];
  sys = new SystemValues();
  isLoading=false;
  upd_s_User:FormGroup;
  get_user:FormGroup;
  addUser: FormGroup;
  showMsg: ShowMessage;
  isDel = false;
  isRetrieve = false;
  isNew = false;
  isModify = false;
  isSave = false;
  isClear = false;
  userType:any;
  userId:any;
  branchCd:any;
  userFastName:string;
  userMidName:string;
  UserLastName:string;
  UserPassword:any;
  show_button: Boolean = false;
  show_eye: Boolean = false;
  showCpassword:Boolean = false;
  pass:Boolean=false;
  cpass:Boolean=false;
  selected_user:boolean=false;
  loginStatus:boolean=true;
  filterUser:any;
  statusVal:any
  form: FormGroup;
  finalLoginSts:any=[];
  defaultPass:any;
  getUserDtl:boolean=true;
  getusername:any;
  currentUID:any;
  errorMSG:any;
  saveFlag:any='U';
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService) { }
  
  
  ngOnInit(): void {
    this.errorMSG=document.getElementById('error-message') as HTMLDivElement;
    debugger
      this.errorMSG.textContent='';
    
    this.currentUID= localStorage.getItem('__userId');
    this.upd_s_User = this.formBuilder.group({
      userid: ['', Validators.required],
      password:['', Validators.required],
      cpassword: ['', Validators.required],
      fname: ['', Validators.required],
      mname: ['', null],
      lname: ['', Validators.required],
      utype: ['', Validators.required],
      branch: ['', Validators.required],
      logsts:['']
    })

    this.get_user = this.formBuilder.group({
      select_user: ['', Validators.required],
     });
     
    this.addUser = this.formBuilder.group({
      userid: ['', Validators.required],
      password:['', Validators.required],
      cpassword: ['', Validators.required],
      fname: ['', Validators.required],
      mname: ['', null],
      lname: ['', Validators.required],
      utype: ['', Validators.required],
      branch: ['', Validators.required],
      logsts:['']
    },
    { 
      validator: this.ConfirmedValidator('password', 'cpassword')
    });
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = true;
    this.isSave = false;
    this.isClear = true;
    // Getuserdetails
    this.isLoading=true;
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('__userId');
    login.brn_cd = localStorage.getItem('__brnCd');
    login.ardb_cd=this.sys.ardbCD,
    this.svc.addUpdDel('Sys/GetUserIDDtls', login).subscribe(
      res => {
        this.userFastName=res[0].user_first_name;
        this.UserLastName=res[0].user_last_name;
        this.userMidName=res[0].user_middle_name;
        this.UserPassword=res[0].password;
        this.userType=res[0].user_type;
        this.userId=res[0].user_id;
        this.branchCd=res[0].brn_cd;
        
        this.addUser.controls.branch.setValue(this.branchCd);
        this.addUser.controls.userid.setValue(this.userId);
        this.addUser.controls.utype.setValue(this.userType);
        this.addUser.controls.fname.setValue(this.userFastName);
      this.addUser.controls.lname.setValue(this.UserLastName);
      this.addUser.controls.mname.setValue(this.userMidName);
      this.addUser.controls.password.setValue(this.UserPassword);
      console.log(this.userType);
      if(this.userType!='A'){
        this.disableField();
      }
      else{
        this.enableField();
      }
      this.GetBranchMaster();
       
        this.isLoading=false;

      },
      err => {this.isLoading=false; ;}
    )
    this.svc.addUpdDel('Sys/GetUserIDStatus', login).subscribe(
      res => {
        
        this.selectalluser=res
        this.selectalluser=this.selectalluser.filter(x => x.user_id!=this.currentUID)
        this.filterUser=this.selectalluser.filter(x => x.login_status == 'Y')
        console.log(this.selectalluser.filter(x => x.login_status == 'Y'));
        
        //   if(this.filterUser.login_status=='Y'){
        //     this.loginStatus=true;

        //   }
        //   else{
        //     this.loginStatus=false
        //   }
        // console.log(this.loginStatus)
        //   ;
        
        console.log(res);
      })
    this.checkUser();
  }

  
  showCpass(){
    this.addUser.controls.password.enable()
    this.isModify=false;
    this.showCpassword=true;
  }
  hideCpass(){
    this.addUser.controls.password.setValue(this.UserPassword);
    this.addUser.controls.password.disable()
    this.addUser.controls.cpassword.reset()
    this.isModify=true;
    this.showCpassword=false;
  }
  get f() { return this.addUser.controls; }
  get u() { return this.upd_s_User.controls; }
  closeScreen()
  {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  getUser(){
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('__userId');
    login.brn_cd = localStorage.getItem('__brnCd');
    login.ardb_cd=this.sys.ardbCD,
    this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
      res => {
       console.log(res);
       
        this.userFastName=res[0].user_first_name;
        this.UserLastName=res[0].user_last_name;
        this.userMidName=res[0].user_middle_name;
        this.UserPassword=res[0].password;
        this.userType=res[0].user_type;
        this.userId=res[0].user_id;
        this.branchCd=res[0].brn_cd;
       // this.loginStatus=res[0].login_status;
        this.addUser.controls.branch.setValue(this.branchCd);
        this.addUser.controls.userid.setValue(this.userId);
        this.addUser.controls.utype.setValue(this.userType);
        this.addUser.controls.fname.setValue(this.userFastName);
      this.addUser.controls.lname.setValue(this.UserLastName);
      this.addUser.controls.mname.setValue(this.userMidName);
      this.addUser.controls.password.setValue(this.UserPassword);

      },
      err => { ;  this.HandleMessage(true, MessageType.Error,'User Not found !!!' );
      this.initialize();
      this.isDel = false;
      this.isRetrieve = true;
      this.isNew = false;
      this.isModify = false;
      this.isSave = false;
      this.isClear = true;
    }
    )
  }
  checkUser(){
    // this.userType=localStorage.getItem('userType');
//     let login = new LOGIN_MASTER();
//     login.user_id = localStorage.getItem('__userId');
//     login.brn_cd = localStorage.getItem('__brnCd');
//     login.ardb_cd=this.sys.ardbCD,
//     this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
//       res => {
//         console.log(res);
        
//       this.userType2=res[0].user_type;
//       })
//     console.log(this.userType2);
    
//     if(this.userType2 !=='A'){
//       this.addUser.controls.utype.disable();
//       this.addUser.controls.userid.disable();
//       this.addUser.controls.branch.disable();
//       this.addUser.controls.fname.disable();
//       this.addUser.controls.mname.disable();
//       this.addUser.controls.lname.disable();
      
//     }
//     if(this.userType2 =='A'){
//     this.addUser.controls.utype.enable();
//     this.addUser.controls.userid.enable();
//     this.addUser.controls.branch.enable();
//     this.addUser.controls.fname.enable();
//     this.addUser.controls.mname.enable();
//     this.addUser.controls.lname.enable();
//     }
//     else{
// console.log('hello');

//     }
       
  }
  disableField(){
    this.addUser.controls.utype.disable();
    this.addUser.controls.userid.disable();
    this.addUser.controls.branch.disable();
    this.addUser.controls.fname.disable();
    this.addUser.controls.mname.disable();
    this.addUser.controls.lname.disable();
    this.addUser.controls.password.disable()
  }
  enableField(){
    this.addUser.controls.password.disable()
    this.addUser.controls.utype.enable();
    this.addUser.controls.userid.enable();
    this.addUser.controls.branch.disable();
    this.addUser.controls.fname.enable();
    this.addUser.controls.mname.enable();
    this.addUser.controls.lname.enable();
  }
  new()
  {
    this.initialize();
    this.saveFlag='N';
    this.addUser.controls.password.enable();
    this.addUser.controls.branch.enable();
    this.showCpassword=true;
    this.pass=true;
    this.cpass=true;
    this.isDel = false;
    this.isRetrieve = false;
    this.isNew = false;
    this.isModify = false;
    this.isSave = true;
    this.isClear = true;
    this.GetBranchMaster();
  }

  GetBranchMaster()
  {
    this.isLoading=true;
    var dt={
      "ardb_cd":localStorage.getItem('__bName').toLocaleLowerCase()=="ardbtestux"?"100":this.sys.ardbCD,
    }
    this.svc.addUpdDel('Mst/GetBranchMaster', dt).subscribe(
      res => {
        this.brnDtls=res;
        console.log(res);
                   
        this.isLoading=false;

      },
      err => {this.isLoading=false; ;}
    )
  }
  getallUser(){
    // this.get_user.controls.select_user.value
    let login = new LOGIN_MASTER();
    login.user_id = this.get_user.controls.select_user.value;
    login.brn_cd = this.sys.BranchCode;
    login.ardb_cd=this.sys.ardbCD,
    
    this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
      res => {
        ;console.log(res)
        this.getusername=res[0].user_id
        if (res.length==0)
        {
          this.HandleMessage(true, MessageType.Sucess,'User Not found !!!' );
        }
        else
        {
          
          this.u.utype.setValue(res[0].user_type);
          this.u.password.setValue(this.defaultPass);
        this.u.fname.setValue(res[0].user_first_name);
        this.u.mname.setValue(res[0].user_middle_name);
        this.u.lname.setValue(res[0].user_last_name);
        this.u.userid.setValue(res[0].user_id);
        this.u.branch.setValue(res[0].brn_cd);
        this.u.logsts.setValue(res[0].login_status);
        
        }
        console.log(this.u.password);
        

      },
      err => { ;  this.HandleMessage(true, MessageType.Error,'User Not found !!!' );
      
    }
    )
    this.selected_user=false;
    this.getUserDtl=false;

    
  }
  defPass(){
  this.defaultPass='12345';
  this.HandleMessage(true, MessageType.Warning,'Password set to be a Default !12345, after Click Update User');
  console.log(this.defaultPass);
  }
  passCheck(i:any){
    const password = i.target.value;
    const hasMinimumLength: boolean = password.length >= 8;
    const hasUppercase: boolean = /[A-Z]/.test(password);
    const hasNumber: boolean = /\d/.test(password);
    if(password.length<1){
      this.errorMSG.textContent='';
    }
    else{
      if (hasMinimumLength && hasUppercase && hasNumber) {
        this.errorMSG.textContent = ''; // Clear error message if conditions are met
    } else {
        this.errorMSG.textContent = 'Password must have at least 8 characters, one uppercase letter, and one number.';
        debugger
        this.isSave = false;this.isModify = false;
      }
    }
    
  }
  retrieve ()
  {
    this.selected_user=true;
    // this.initialize()
  //   if (this.f.userid.value == null ||  this.f.branch.value==null)
  //   {
  //     this.HandleMessage(true, MessageType.Warning,'Please enter User ID and Branch!!' );
  //   }
  //   else
  //   {
    
    
  // }

  }
  saveuser()
  {
    if(this.f.utype.value==null||this.f.utype.value==undefined){
      return;
    }
    else{
      this.isLoading=true;
      this.showMsg =null;
      let login = new LOGIN_MASTER();
      login.user_id = this.f.userid.value;
      login.brn_cd = this.sys.BranchCode;
      login.user_first_name=this.f.fname.value;
      login.user_middle_name=this.f.mname.value;
      login.user_last_name=this.f.lname.value;
      login.user_type=this.f.utype.value;
      login.password=this.f.password.value;
      login.login_status='N';
      login.created_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      // login.modified_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
      // login.ardb_cd=localStorage.getItem('__bName').toLocaleLowerCase()=="ardbtestux"?"100":this.sys.ardbCD
      login.ardb_cd=this.sys.ardbCD;
      
      // this.checkPassword();
      this.svc.addUpdDel('Sys/InsertUserMaster', login).subscribe(
        res => {
          let login = new LOGIN_MASTER();
          login.LM_ID=Number(res)
          if(login.LM_ID==-1){
            this.isLoading=false;
            this.HandleMessage(true, MessageType.Error,'Duplicate User Not Allow' );
          }else{
            ;console.log(res)
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess,'Sucessfully Saved the User Details' );
          // this.initialize();
          this.isDel = false;
          this.isRetrieve = true;
          this.isNew = true;
          this.isModify = false;
          this.isSave = false;
          this.isClear = true;
          }
          
        },
        err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Insertion Failed!!' );
                this.isDel = false;
                this.isRetrieve = false;
                this.isNew = false;
                this.isModify = true;
                this.isSave = true;
                this.isClear = true;
      }
      )
    }
    

  }
  checkPassword(){
    if(this.f.password!==this.f.cpassword){
      this.HandleMessage(true, MessageType.Error,'Password and Confirm Password should be Equal' );
      this.isModify=false;this.isSave = false;
    }
  }
  updateuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value;
    login.brn_cd = this.sys.BranchCode;
    login.user_first_name=this.f.fname.value;
    login.user_middle_name=this.f.mname.value;
    login.user_last_name=this.f.lname.value;
    login.user_type=this.f.utype.value;
    login.password=this.f.password.value;
    login.login_status=this.f.logsts.value;
    login.ardb_cd=this.sys.ardbCD;
    login.modified_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    //login.login_status='N';
    ;
    // this.checkPassword();
    this.svc.addUpdDel('Sys/UpdateUserMaster', login).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Sucessfully Updated the parsonal Details' );
        // this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = true;
        this.isSave = false;
        this.isClear = true;
      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Updation Failed!!' );
      this.isDel = false;
      this.isRetrieve = true;
      this.isNew = true;
      this.isModify = true;
      this.isSave = false;
      this.isClear = true;
    }
    )

  }
  update_user_dtl(){
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    login.user_id = this.u.userid.value;
    login.brn_cd = this.u.branch.value;
    login.user_first_name=this.u.fname.value;
    login.user_middle_name=this.u.mname.value;
    login.user_last_name=this.u.lname.value;
    login.user_type=this.u.utype.value;
    login.password=this.defaultPass;
    login.login_status=this.u.logsts.value;
    login.ardb_cd=this.sys.ardbCD;
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
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = true;
        this.isSave = false;
        this.isClear = true;
      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Updation Failed!!' );
      this.isDel = false;
      this.isRetrieve = true;
      this.isNew = true;
      this.isModify = true;
      this.isSave = false;
      this.isClear = true;
    }
    )
    this.getUserDtl=true
  }
  closeScreen2(){
    this.getUserDtl=true
    this.get_user.controls.select_user.setValue(null)
  }
  deleteuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value;
    login.brn_cd = this.sys.BranchCode;
    login.ardb_cd=this.sys.ardbCD;
    ;
    this.svc.addUpdDel('Sys/DeleteUserMaster', login).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'User Details Deleted' );
        this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Deletion Failed!!' );
      this.initialize();
      this.isDel = false;
      this.isRetrieve = true;
      this.isNew = true;
      this.isModify = false;
      this.isSave = false;
      this.isClear = true;
    }
    )

  }
  clearuser()
  {
    ;
    this.initialize();
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
  }
  initialize()
  {
    ;
    this.f.fname.setValue(null);
    this.f.mname.setValue(null);
    this.f.lname.setValue(null);
    this.f.utype.setValue(null);
    this.f.branch.setValue(null);
    this.f.userid.setValue(null);
    this.f.password.setValue(null);
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
   ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
            this.isModify=false;
            // if(this.saveFlag=='N'){
            //     this.isModify=true;
            //     this.isSave=false;
            //   }
            //   else{
            //     this.isSave=true;
            //     this.isModify=false;
            //   }
        } 
        else {
            matchingControl.setErrors(null);
            if(this.addUser.controls.userid.value== this.userId){
              this.isModify=true;
            }
            else{
              if(this.errorMSG.textContent==''){
                this.isModify=false;
                this.isSave=true;}
              else{this.isModify=false;}
              
            }
           
            
        }
    }
}

}
// if(this.saveFlag=='N'){
//   this.isModify=true;
//   this.isSave=false;
// }
// else{
//   this.isSave=true;
//   this.isModify=false;
// }