import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues } from '../../Models';
import { m_branch } from '../../Models/m_branch';

@Component({
  selector: 'app-user-transfer',
  templateUrl: './user-transfer.component.html',
  styleUrls: ['./user-transfer.component.css']
})
export class UserTransferComponent implements OnInit {
  brnDtls:any=[];
  selectalluser:any=[];
  selecteduser:any=[];
  sys = new SystemValues();
  isLoading=false;
  upd_s_User:FormGroup;
  get_user:FormGroup;
  addUser: FormGroup;
  showMsg: ShowMessage;
  isDel = false;
  isRetrieve = false;
  isNew = false;
  isApprv = false;
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
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService) { }
  
  
  ngOnInit(): void {
    
    this.currentUID= localStorage.getItem('__userId');
    this.upd_s_User = this.formBuilder.group({
      utype: ['', Validators.required],
      userid: ['', Validators.required],
      Cbranch: ['', Validators.required],
      Tbranch: ['', Validators.required]
    })

    this.get_user = this.formBuilder.group({
      select_user: ['', Validators.required],
     });
     
     this.GetBranchMaster();
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isApprv = false;
    this.isSave = true;
    this.isClear = true;
    // Getuserdetails
    this.isLoading=true;
    let login = new LOGIN_MASTER();
    login.ardb_cd=this.sys.ardbCD,
    this.svc.addUpdDel('Sys/GetUserIDStatusAll', login).subscribe(
      res => {
        this.isLoading=false;
        this.selectalluser=res
        this.selectalluser=this.selectalluser.filter(x => x.user_id!=this.currentUID)
        this.filterUser=this.selectalluser.filter(x => x.login_status == 'Y')
        console.log(this.selectalluser.filter(x => x.login_status == 'Y'));
        
         console.log(res);
      })
  }

  
 
  get u() { return this.upd_s_User.controls; }
  closeScreen()
  {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }

  

  GetBranchMaster()
  {
    this.isLoading=true;
    var dt={
      "ardb_cd":localStorage.getItem('__bName').toLocaleLowerCase()=="ardbtestux"?"100":this.sys.ardbCD,
    }
    debugger

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
    this.isSave=true;
    // this.get_user.controls.select_user.value
    let login = new LOGIN_MASTER();
    login.user_id = this.get_user.controls.select_user.value;
    login.ardb_cd=this.sys.ardbCD,
    this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
      res => {
        ;console.log(res)
        this.selecteduser=res[0]
        this.getusername=res[0].user_id
        if (res.length==0)
        {
          this.HandleMessage(true, MessageType.Sucess,'User Not found !!!' );
        }
        else{
          this.u.utype.setValue(res[0].user_type);
          this.u.Cbranch.setValue(res[0].brn_cd);
          this.u.Tbranch.setValue(res[0].brn_cd);

        }
        

      },
      err => { ;  this.HandleMessage(true, MessageType.Error,'User Not found !!!' );
      
    }
    )
    this.selected_user=false;
    this.getUserDtl=false;

    
  }
 
  approve(){

    this.isLoading=true;
    this.showMsg =null;
    
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "user_id": this.selecteduser.user_id,
      "approval_status":'A',
      "brn_cd":this.selecteduser.brn_cd,
      "new_brn_cd":this.u.Tbranch.value,
      "transfer_dt":this.sys.CurrentDate.toISOString(),
      "approved_by":this.sys.UserId,
      "approved_dt":this.sys.CurrentDate.toISOString()
    }
    debugger
    this.svc.addUpdDel('Sys/ApproveUserTransfer', dt).subscribe(
      res => {
        
        ;console.log(res)
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Approved Successfully' );
        // this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isApprv = false;
        this.isSave = false;
        this.isClear = true;
      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Approved Failed!!' );
              this.isDel = false;
              this.isRetrieve = false;
              this.isNew = false;
              this.isApprv = false;
              this.isSave = true;
              this.isClear = true;
    }
    )
  }
  retrieve ()
  {
    this.selected_user=true;
   

  }
  saveuser()
  {
    
      this.isLoading=true;
      this.showMsg =null;
      
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "user_id": this.selecteduser.user_id,
        "brn_cd":this.selecteduser.brn_cd,
        "new_brn_cd":this.u.Tbranch.value,
        "transfer_dt":this.sys.CurrentDate.toISOString(),
        "created_by":this.sys.UserId,
        "modified_by":this.sys.UserId
      }
      debugger
      this.svc.addUpdDel('Sys/InsertUserTransfer', dt).subscribe(
        res => {
            ;console.log(res)
            this.isLoading=false;
            this.HandleMessage(true, MessageType.Sucess,'Sucessfully Saved the User Details' );
            // this.initialize();
            this.isDel = false;
            this.isRetrieve = true;
            this.isNew = true;
            this.isApprv = true;
            this.isSave = false;
            this.isClear = true;
          
         
        },
        err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Insertion Failed!!' );
                this.isDel = false;
                this.isRetrieve = false;
                this.isNew = false;
                this.isApprv = false;
                this.isSave = true;
                this.isClear = true;
      }
      )
    
    

  }
 
  
  closeScreen2(){
    this.getUserDtl=true
    this.get_user.controls.select_user.setValue(null)
  }
  
  clearuser()
  {
    
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isApprv = false;
    this.isSave = false;
    this.isClear = true;
  }
  
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
 
 

}
