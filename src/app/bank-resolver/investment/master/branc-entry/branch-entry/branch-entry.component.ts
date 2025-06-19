import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues } from '../../../../Models';
import { m_branch } from '../../../../Models/m_branch';

@Component({
  selector: 'app-branch-entry',
  templateUrl: './branch-entry.component.html',
  styleUrls: ['./branch-entry.component.css']
})
export class BranchEntryComponent implements OnInit {
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  brnDtls: m_branch[]=[];
  sys = new SystemValues()
  isLoading=false;
  addBranch: FormGroup;
  showMsg: ShowMessage;
  isDel = false;
  isRetrieve = false;
  isNew = false;
  isModify = false;
  isSave = false;
  isClear = false;
  blocks:any=[];
  blocks1:any=[];
  branch:any=[];
  branch1:any=[];
  disableCode=true;
  b_name:any;
  hiddenOnNull=true;
  validatePhone:boolean=false
  insertData:boolean=false;
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService,private modalService: BsModalService,) { }
  @ViewChild('contentbatch', { static: true }) contentbatch: TemplateRef<any>;
  modalRef: BsModalRef;
  ngOnInit(): void {
    // this.GetBranchMaster();
    // this.getAllBlocks()
   this.blocks=null;
   this.blocks1=null
    this.addBranch = this.formBuilder.group({
      bank_cd:[],
      bank_nm:[],
      branch_cd:[],
      branch_nm:['',[Validators.required]],
      branch_addr:['',[Validators.required]],
      branch_ph:['',[Validators.required, Validators.min(10)]]
    });
     this.addBranch.controls.branch_cd.disable()
    this.addBranch.controls.bank_cd.disable()
   this.addBranch.controls.bank_nm.disable()
   this.addBranch.controls.bank_cd.setValue('A')
    this.addBranch.controls.bank_nm.setValue('')


    this.disableFild();
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    this.svc.addUpdDel<any>('Mst/GetBankInvMaster', dt).subscribe(
      res => {
        this.blocks1=res
        console.log(this.addBranch.controls.bank_cd.value)
         console.log(this.blocks1)
         
       },
      err => { }
    );
  }
  get f() { return this.addBranch.controls; }
  closeScreen()
  {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  new()
  {
    this.isDel = false;
    this.isRetrieve = false;
    this.isNew = false;
    this.isModify = false;
    this.isSave = true;
    this.isClear = true;
    this.insertData=true;
    this.addBranch.controls.bank_cd.enable()
    this.addBranch.controls.bank_cd.setValue('A')

    this.addBranch.controls.branch_cd.setValue('A')
    this.addBranch.controls.branch_cd.disable()


    this. enableFild()
          this.addBranch.controls.branch_nm.setValue('')
          this.addBranch.controls.branch_addr.setValue('')
          this.addBranch.controls.branch_ph.setValue('')
  }
 
 
  getAllBlocks(){
    this.blocks=null
    this.blocks=this.blocks1.filter(e=>e.bank_cd.toString().includes(this.addBranch.controls.bank_cd.value) )
    console.log(this.blocks)
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "bank_cd":this.blocks[0].bank_cd
    }
    this.svc.addUpdDel<any>('Mst/GetBranchInvMaster', dt).subscribe(
      res => {
        this.branch1=null
        this.branch1=res
         console.log(this.branch1)
         
       },
      err => { }
    );
    this.addBranch.controls.branch_cd.setValue('A')
    this.addBranch.controls.branch_nm.setValue('')
    this.addBranch.controls.branch_addr.setValue('')
    this.addBranch.controls.branch_ph.setValue('')
  }
  getAllbranch(){
    this.branch=null
    this.branch=this.branch1.filter(e=>e.branch_cd.toString().includes(this.addBranch.controls.branch_cd.value) )
    console.log(this.branch)
    this.addBranch.controls.branch_nm.setValue(this.branch[0].branch_name)
    this.addBranch.controls.branch_addr.setValue(this.branch[0].branch_addr)
    this.addBranch.controls.branch_ph.setValue(this.branch[0].branch_phone)
    
  }
  disableFild()
  {
    // this.addBranch.controls.branch_cd.disable()
    this.addBranch.controls.branch_nm.disable()
    this.addBranch.controls.branch_addr.disable()
    this.addBranch.controls.branch_ph.disable()
  }
  enableFild(){
    this.addBranch.controls.branch_nm.enable()
    this.addBranch.controls.branch_addr.enable()
    this.addBranch.controls.branch_ph.enable()

  }
  GetBranchMaster()
  {
    this.isLoading=true;
    ;
    this.svc.addUpdDel('Mst/GetBranchMaster', null).subscribe(
      res => {
        ;
        this.brnDtls=res;
        this.isLoading=false;

      },
      err => {this.isLoading=false; ;}
    )
  }
  OpenBlock(block:any){
    console.log(block)
    this.addBranch.patchValue({
      code:block.block_cd,
      bname:block.block_name
    })
    this.modalRef.hide();
    this.isModify=true
    this.showMsg=null
  }

  retrieve ()
  {
    this.hiddenOnNull=false
    this.disableCode=false;
    
    this.addBranch.controls.bank_cd.enable()
   this.addBranch.controls.branch_cd.enable()

    this.isModify=true
    this.disableFild()
    // this.getAllBlocks()
  }
  phnoValidation(){
    // if(this.addBranch.controls.branch_ph.value.length==10 || this.addBranch.controls.branch_ph.value.length==11){
    // }
    // else{
    //   this.HandleMessage(true, MessageType.Error,'Phone no Should be 10 or 11 digit!' );
    //   this.addBranch.controls.branch_ph.setValue('');
    // }
    
  }
  saveuser()
  {
  if(this.insertData==false){
    if(this.f.branch_ph.value.length==10){
      this.validatePhone=false;
      this.isSave=false;
      this.isLoading=true;
      this.showMsg =null;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "branch_cd":this.addBranch.controls.branch_cd.value,
        "branch_name":this.addBranch.controls.branch_nm.value,
        "branch_addr":this.addBranch.controls.branch_addr.value,
        "branch_phone":this.addBranch.controls.branch_ph.value,
        "modified_by":this.sys.UserId+'/'+localStorage.getItem('ipAddress')
      }
      ;
      this.svc.addUpdDel('Mst/UpdateBranchInv',dt).subscribe(
        res => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess,'Branch updated successfully!' );
          this.isDel = false;
          this.isRetrieve = true;
          this.isNew = true;
          this.isModify = false;
          this.isSave = false;
          this.isClear = true;
          this.disableCode=true
          // this.addBranch.controls.branch_cd.enable()
          this.clearuser()
  
        },
        err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Updation failed!!' );
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = true;
        this.isSave = false;
        this.isClear = true;
      }
      )
      }
      else{
        this.validatePhone=true;
      this.isSave=true;
      this.f.branch_ph.setValue('')
      
      }
   }

else{
  if(this.f.branch_ph.value.length==10){
    this.validatePhone=false;
    this.isSave=false;
    this.isLoading=true;
    this.showMsg =null;
    var data={
      "ardb_cd":this.sys.ardbCD,
      "bank_cd":this.addBranch.controls.bank_cd.value,
      "branch_name":this.addBranch.controls.branch_nm.value,
      "branch_addr":this.addBranch.controls.branch_addr.value,
      "branch_phone":this.addBranch.controls.branch_ph.value,
      "created_by":this.sys.UserId+'/'+localStorage.getItem('ipAddress'),
      "modified_by":this.sys.UserId+'/'+localStorage.getItem('ipAddress')
    }
    console.log(this.addBranch.controls)
    this.svc.addUpdDel('Mst/InsertBranchInvMaster', data).subscribe(
      res => {
        console.log(res)
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Branch saved successfully!' );
        // this.initialize();
        this.addBranch.controls.branch_cd.setValue(res)
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
        this.disableCode=true
        this.disableFild()
        this.clearuser()


      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Insertion failed!!' );
              this.isDel = false;
              this.isRetrieve = false;
              this.isNew = false;
              this.isModify = false;
              this.isSave = true;
              this.isClear = true;
    }
    )
    }
    else{
      this.validatePhone=true;
    this.isSave=true;
    this.f.branch_ph.setValue('')

    
    }
 
}
    
  }
  updateuser()
  {
    this.addBranch.controls.bank_cd.disable();
    this.addBranch.controls.branch_cd.disable();
    this.enableFild();
    this.isSave = true;
    this.isRetrieve=false;
    this.isModify = false;
    this.isNew = false;
    this.insertData==true;
  }
  deleteuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value;
    login.brn_cd = this.f.branch.value;
    ;
    this.svc.addUpdDel('Sys/DeleteUserMaster', login).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Bank deleted successfully!' );
        this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Deletion failed!!' );
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
    this.disableFild()
   this.disableCode=true;
   this.hiddenOnNull=true
   this.addBranch.controls.bank_cd.setValue('A')
   this.addBranch.controls.bank_nm.setValue('')
    this.addBranch.controls.branch_cd.setValue('A')
    this.addBranch.controls.branch_nm.setValue('')
    this.addBranch.controls.branch_addr.setValue('')
    this.addBranch.controls.branch_ph.setValue('')
    
   this.addBranch.controls.bank_cd.disable()
   this.addBranch.controls.branch_cd.disable()




  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}
