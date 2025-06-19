import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues } from '../../Models';
import { m_branch } from '../../Models/m_branch';

@Component({
  selector: 'app-create-glhead',
  templateUrl: './create-glhead.component.html',
  styleUrls: ['./create-glhead.component.css']
})
export class CreateGLHeadComponent implements OnInit {

  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  brnDtls: m_branch[]=[];
  sys = new SystemValues()
  isLoading=false;
  addAccMaster: FormGroup;
  showMsg: ShowMessage;
  isDel = false;
  isRetrieve = false;
  isNew = false;
  isModify = false;
  isSave = false;
  isClear = false;
  Acc:any;
  disableCode=true;
  acc_name:any;
  hiddenOnNull=true;
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService,private modalService: BsModalService,) { }
  @ViewChild('contentbatch', { static: true }) contentbatch: TemplateRef<any>;
  modalRef: BsModalRef;
  ngOnInit(): void {
    // this.GetBranchMaster();
    // this.getAllAcc()
    this.addAccMaster = this.formBuilder.group({
      acc_cd: ['', Validators.required],
      acc_name: ['', Validators.required],
      acc_type: ['', Validators.required]
    });
    // this.addBlock.controls.code.disable()
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
  }
  get f() { return this.addAccMaster.controls; }
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
    // this.GetBranchMaster();
  }
  
  getAccDtls(){
    if(this.isSave==true){
      return;
    }
    else{
      var dt = {
        "ardb_cd": this.sys.ardbCD,
        "acc_cd":this.f.acc_cd.value
      }
      this.svc.addUpdDel<any>('Mst/GetAccGlhead', dt).subscribe(
        res => {
          console.log(res)
          this.Acc = res
          console.log(this.Acc);
          if(this.Acc!==null){
            this.addAccMaster.patchValue({
              acc_cd:this.Acc[0].acc_cd,
              acc_name:this.Acc[0].acc_name,
              acc_type:this.Acc[0].acc_type
          })
          this.f.acc_cd.disable();
          this.f.acc_type.disable();
            
          }else{
            return;
          }
          
          
        },
        err => {this.HandleMessage(true, MessageType.Error,'Data could not retrive!' ); }
      );
    }
   
  }
  
  retrieve ()
  {
    this.hiddenOnNull=false
    this.disableCode=false;
    
    // this.addAccMaster.controls.code.enable()
    this.isModify=true
    // this.getAllAcc()
  }
  saveuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    var dt={
      "acc_cd":this.addAccMaster.controls.acc_cd.value,
      "acc_name":this.addAccMaster.controls.acc_name.value,
      "acc_type":this.addAccMaster.controls.acc_type.value,
      "ardb_cd":this.sys.ardbCD,

    }
    console.log(this.addAccMaster.controls)
    this.svc.addUpdDel('Mst/InsertAccGlHead', dt).subscribe(
      res => {
        console.log(res)
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'GL-Head saved successfully!' );
        this.initialize();
        // this.addAccMaster.controls.code.setValue(res)
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
        this.disableCode=true;
        this.clearuser();
      // this.addBlock.controls.code.disable()

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
  updateuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    var dt={
      "acc_cd":this.addAccMaster.controls.acc_cd.value,
      "acc_name":this.addAccMaster.controls.acc_name.value,
      "ardb_cd":this.sys.ardbCD,
    }
    //login.login_status='N';
    ;
    this.svc.addUpdDel('Mst/UpdateAccGlHead',dt).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'GL-Head updated successfully!' );
        this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
        this.disableCode=true;
        this.clearuser();
        // this.addBlock.controls.code.disable()

      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'GL-Updation failed!!' );
      this.isDel = false;
      this.isRetrieve = true;
      this.isNew = true;
      this.isModify = true;
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
    this.f.acc_cd.enable();
    this.f.acc_type.enable();
   this.addAccMaster.reset()
  this.addAccMaster.controls.acc_type.setValue('0')
  //  this.addBlock.controls.district.setValue(131)
  //  this.disableCode=true;
   this.hiddenOnNull=true
   this.Acc='';
  //  this.addBlock.controls.code.disable()

  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }


}
