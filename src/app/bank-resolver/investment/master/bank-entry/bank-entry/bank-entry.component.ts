import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues } from '../../../../Models';
import { m_branch } from '../../../../Models/m_branch';


@Component({
  selector: 'app-bank-entry',
  templateUrl: './bank-entry.component.html',
  styleUrls: ['./bank-entry.component.css']
})
export class BankEntryComponent implements OnInit {
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  brnDtls: m_branch[]=[];
  sys = new SystemValues()
  isLoading=false;
  addBank: FormGroup;
  showMsg: ShowMessage;
  isDel = false;
  isRetrieve = false;
  isNew = false;
  isModify = false;
  isSave = false;
  isClear = false;
  blocks:any=[];
  blocks1:any=[];
  disableCode=true;
  b_name:any;
  hiddenOnNull=true;
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService,private modalService: BsModalService,) { }
  @ViewChild('contentbatch', { static: true }) contentbatch: TemplateRef<any>;
  modalRef: BsModalRef;
  ngOnInit(): void {
    // this.GetBranchMaster();
    // this.getAllBlocks()
   this.blocks=null;
   this.blocks1=null
    this.addBank = this.formBuilder.group({
      bank_cd:[],
      bank_nm:['',Validators.required],
      bank_addr:['',Validators.required],
      bank_phone:['',Validators.required]
      // state: [10, Validators.required],
      // code: [''],
      // bname: ['', Validators.required],
     
      // district: [131, Validators.required]
    });
    this.addBank.controls.bank_cd.disable()
    this.disableFild();
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
  }
  get f() { return this.addBank.controls; }
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
    this.addBank.controls.bank_cd.disable()

    this. enableFild()
          this.addBank.controls.bank_cd.setValue('')
          this.addBank.controls.bank_nm.setValue('')
          this.addBank.controls.bank_addr.setValue('')
          this.addBank.controls.bank_phone.setValue('')
    // this.GetBranchMaster();
  }
  selectBlock(block:any){
    this.addBank.controls.code.setValue(block.block_cd);
    this.addBank.controls.bname.setValue(block.block_name)
    this.blocks1=null
  }
  getAllBlocks(){
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    this.svc.addUpdDel<any>('Mst/GetBankInvMaster', dt).subscribe(
      res => {
        this.blocks=null
        this.blocks1=res
        console.log(this.addBank.controls.bank_cd.value)
         console.log(this.blocks1)
         this.blocks=this.blocks1.filter(e=>e.bank_cd.toString().includes(this.addBank.controls.bank_cd.value) || e.bank_name.toLowerCase().includes(this.addBank.controls.bank_cd.value.toLowerCase()))
         console.log(this.blocks)
         if(this.addBank.controls.bank_cd.value.length>0){
          this.addBank.controls.bank_nm.setValue(this.blocks[0].bank_name)
          this.addBank.controls.bank_addr.setValue(this.blocks[0].bank_addr)
          this.addBank.controls.bank_phone.setValue(this.blocks[0].phone_no)
           this.disableFild()
         }
         else{
          this. enableFild()
          this.addBank.controls.bank_nm.setValue('')
          this.addBank.controls.bank_addr.setValue('')
          this.addBank.controls.bank_phone.setValue('')
         }
         
        
      },
      err => { }
    );
  }
  disableFild()
  {
    this.addBank.controls.bank_nm.disable()
    this.addBank.controls.bank_addr.disable()
    this.addBank.controls.bank_phone.disable()
  }
  enableFild(){
    this.addBank.controls.bank_nm.enable()
    this.addBank.controls.bank_addr.enable()
    this.addBank.controls.bank_phone.enable()

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
    this.addBank.patchValue({
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
    
    this.addBank.controls.bank_cd.enable()
    this.isModify=true
    // this.getAllBlocks()
  }
  saveuser()
  {
  if(this.addBank.controls.bank_cd.value.length>0){
    this.isLoading=true;
    this.showMsg =null;
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "bank_cd":this.addBank.controls.bank_cd.value,
      "bank_name":this.addBank.controls.bank_nm.value,
      "bank_addr":this.addBank.controls.bank_addr.value,
      "phone_no":this.addBank.controls.bank_phone.value,
      "modified_by":this.sys.UserId+'/'+localStorage.getItem('ipAddress')
    }
    ;
    this.svc.addUpdDel('Mst/UpdateBankInv',dt).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Bank updated successfully!' );
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
        this.disableCode=true
        this.addBank.controls.bank_cd.disable()
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
  this.isLoading=true;
    this.showMsg =null;
    var data={
      "ardb_cd":this.sys.ardbCD,
      "bank_name":this.addBank.controls.bank_nm.value,
      "bank_addr":this.addBank.controls.bank_addr.value,
      "phone_no":this.addBank.controls.bank_phone.value,
      "created_by":this.sys.UserId+'/'+localStorage.getItem('ipAddress'),
      "modified_by":this.sys.UserId+'/'+localStorage.getItem('ipAddress')
    }
    console.log(this.addBank.controls)
    this.svc.addUpdDel('Mst/InsertBankInvMaster', data).subscribe(
      res => {
        console.log(res)
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Bank saved successfully!' );
        // this.initialize();
        this.addBank.controls.bank_cd.setValue(res)
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
        this.disableCode=true
        this.disableFild()


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
    
  }
  updateuser()
  {
    this.addBank.controls.bank_cd.disable();
    this.enableFild();
    this.isSave = true;
    this.isRetrieve = false;
    this.isNew = false;
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
   this.addBank.reset()
  //  this.addBank.controls.state.setValue(10)
  //  this.addBank.controls.district.setValue(131)
   this.disableCode=true;
   this.hiddenOnNull=true
   this.blocks=null
   this.blocks1=null
   this.addBank.controls.bank_cd.disable()

  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }


}


