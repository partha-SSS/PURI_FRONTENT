import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues, mm_dist } from '../../../Models';
import { m_branch } from '../../../Models/m_branch';

@Component({
  selector: 'app-block-master',
  templateUrl: './block-master.component.html',
  styleUrls: ['./block-master.component.css']
})
export class BlockMasterComponent implements OnInit {
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  districts: mm_dist[] = [];

  brnDtls: m_branch[]=[];
  sys = new SystemValues()
  isLoading=false;
  addBlock: FormGroup;
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
    this.addBlock = this.formBuilder.group({
      state: [10, Validators.required],
      code: [''],
      bname: ['', Validators.required],
     
      district: [131, Validators.required]
    });
    this.addBlock.controls.code.disable()
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
    this.getDistMaster();
  }
  get f() { return this.addBlock.controls; }
  closeScreen()
  {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  getDistMaster(){
    this.svc.addUpdDel<mm_dist[]>('Mst/GetDistMaster', null).subscribe(
      res => {
        this.districts = res;
      },
      err => { }
    );
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
  selectBlock(block:any){
    this.addBlock.controls.code.setValue(block.block_cd);
    this.addBlock.controls.bname.setValue(block.block_name)
    this.blocks1=null
  }
  getAllBlocks(){
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    // this.svc.addUpdDel<mm_block[]>('Mst/GetBlockMaster', this.sys.ardbCD).subscribe(
    this.svc.addUpdDel<any>('Mst/GetBlockMaster', dt).subscribe(
      res => {
        console.log(res)
        this.blocks = res
        this.blocks = this.blocks.sort((a, b) => (a.block_name > b.block_name) ? 1 : -1);
        this.blocks1=res
        this.blocks1 = this.blocks1.sort((a, b) => (a.block_name > b.block_name) ? 1 : -1);
        //  this.b_name=this.blocks.filter(e=>e.block_cd==this.addBlock.controls.code.value)[0].block_name
        console.log(this.addBlock.controls.code.value)
        this.blocks=this.blocks1.filter(e=>e.block_cd.includes(this.addBlock.controls.code.value) || e.block_name.toLowerCase().includes(this.addBlock.controls.code.value.toLowerCase()))
         console.log(this.blocks)
      },
      err => { }
    );
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
    this.addBlock.patchValue({
      code:block.block_cd,
      bname:block.block_name
    })
    this.modalRef.hide();
    this.isModify=true
    this.showMsg=null
  }
  getBlock(){
    
    if(this.addBlock.controls.code.value)
   {
    this.getAllBlocks()
    // this.b_name=this.blocks.filter(e=>e.block_cd==this.addBlock.controls.code.value)[0].block_name

   }
    this.addBlock.controls.bname.setValue(this.b_name)
  }
  retrieve ()
  {
    this.hiddenOnNull=false
    this.disableCode=false;
    
    this.addBlock.controls.code.enable()
    this.isModify=true
    // this.getAllBlocks()
  }
  saveuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    var dt={
      "block_name":this.addBlock.controls.bname.value,
      "ardb_cd":this.sys.ardbCD,
      "dist_cd":this.addBlock.controls.district.value,
      "state_cd":this.addBlock.controls.state.value,
    }
    console.log(this.addBlock.controls)
    this.svc.addUpdDel('Mst/InsertBlockMaster', dt).subscribe(
      res => {
        console.log(res)
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Block saved successfully!' );
        // this.initialize();
        this.addBlock.controls.code.setValue(res)
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
        this.disableCode=true
      this.addBlock.controls.code.disable()

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
    let login = new LOGIN_MASTER();
    var dt={
      "block_name":this.addBlock.controls.bname.value,
      "ardb_cd":this.sys.ardbCD,
      "block_cd":this.addBlock.controls.code.value
    }
    //login.login_status='N';
    ;
    this.svc.addUpdDel('Mst/UpdateBlock',dt).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Block updated successfully!' );
        // this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
        this.disableCode=true
        this.addBlock.controls.code.disable()

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
        this.HandleMessage(true, MessageType.Sucess,'Block deleted successfully!' );
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
   this.addBlock.reset()
   this.addBlock.controls.state.setValue(10)
   this.addBlock.controls.district.setValue(131)
   this.disableCode=true;
   this.hiddenOnNull=true
   this.blocks=null
   this.blocks1=null
   this.addBlock.controls.code.disable()

  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }


}
