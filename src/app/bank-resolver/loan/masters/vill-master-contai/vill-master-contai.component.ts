import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues, mm_dist } from '../../../Models';
import { m_branch } from '../../../Models/m_branch';
@Component({
  selector: 'app-vill-master-contai',
  templateUrl: './vill-master-contai.component.html',
  styleUrls: ['./vill-master-contai.component.css']
})
export class VillMasterContaiComponent implements OnInit {
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  districts: mm_dist[] = [];
  brnDtls: m_branch[]=[];
  sys = new SystemValues()
  isLoading=false;
  addVill: FormGroup;
  showMsg: ShowMessage;
  isDel = false;
  isRetrieve = false;
  isNew = false;
  isModify = false;
  isSave = false;
  isClear = false;
  blocks:any=[];
  serviceArea:any=[];
  policeStation:any=[];
  policeStation1:any=[];
  postOffice:any=[];
  postOffice1:any=[];
  serviceArea1:any=[];
  villages=[]
  villages1=[]
  villageName:any;
  hiddenOnNull=true;
  pin:any=''
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService,private modalService: BsModalService,) { }
  @ViewChild('contentbatch', { static: true }) contentbatch: TemplateRef<any>;
  modalRef: BsModalRef;
  ngOnInit(): void {
    this.villages=null
    this.getPoMaster();
    this.getPsMaster();
    this.getAllBlocks();
    this.getServiceArea();

    // this.GetBranchMaster();
    this.addVill = this.formBuilder.group({
      block: ['', Validators.required],
      code: ['',Validators.required],
      vname: ['', Validators.required],
      po: ['', Validators.required],
      ps: ['', Validators.required],
      service_area: ['', Validators.required],
      state: [10, Validators.required],
      district: [19, Validators.required]


    });
    this.new();
    this.getDistMaster();
  }
  get f() { return this.addVill.controls; }
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
    // this.addVill.controls.code.disable()
    this.GetBranchMaster();
  }
  getServiceArea(){
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    // this.svc.addUpdDel<mm_block[]>('Mst/GetBlockMaster', this.sys.ardbCD).subscribe(
    this.svc.addUpdDel<any>('Mst/GetServiceAreaMaster', dt).subscribe(
      res => {
        console.log(res)
        this.serviceArea = res
        this.serviceArea = this.serviceArea.sort((a, b) => (a.service_area_cd > b.service_area_cd) ? 1 : -1);
        // console.log(this.blocks.sort((a , b) => (a.block_cd < b.block_cd ? -1 : 1)))
        // this.blocks = this.blocks.sort((a , b) => (a.block_cd < b.block_cd ? -1 : 1));
      },
      err => { }
    );
  }
  private getPsMaster(): void {
    this.isLoading=true
    var dt={
      "ardb_cd":this.sys.ardbCD
    }
    this.svc.addUpdDel<any>('Mst/GetPsMaster', dt).subscribe(
      res => {
        if(res){
          this.isLoading=false;
          this.policeStation1 = res;
          this.policeStation = res;
          this.policeStation = this.policeStation.sort((a, b) => (a.ps_name > b.ps_name) ? 1 : -1);
          }
      },
      err => { }
    );
  }
  private getPoMaster(): void {
    this.isLoading=true
    var dt={
      "ardb_cd":this.sys.ardbCD
    }
    this.svc.addUpdDel<any>('Mst/GetPoMaster', dt).subscribe(
      res => {if(res){
        this.isLoading=false;
        this.postOffice1 = res;
        this.postOffice = res;
        this.postOffice = this.postOffice.sort((a, b) => (a.po_name > b.po_name) ? 1 : -1);
        }
       },
      err => { }
    );
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
        // console.log(this.blocks.sort((a , b) => (a.block_cd < b.block_cd ? -1 : 1)))
        // this.blocks = this.blocks.sort((a , b) => (a.block_cd < b.block_cd ? -1 : 1));
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
    this.addVill.patchValue({
      code:block.block_cd,
      vname:block.block_name
    })
    this.modalRef.hide();
    this.isModify=true
  }
  getVillageCD(){
    this.serviceArea1=[]
    // this.addVill.controls.block.setValue('')
    console.log(this.addVill.controls.block.value)
    this.serviceArea1=this.serviceArea.filter(e=>e.block_cd==this.addVill.controls.block.value)
    // this.policeStation=this.policeStation1.filter(e=>e.block_cd==this.addVill.controls.block.value)
    console.log(this.serviceArea1)
    debugger
  }
  getPoDtls(){
    this.postOffice=[]
    this.postOffice=this.postOffice1.filter(e=>e.service_area_cd==this.addVill.controls.service_area.value)
    debugger
  }
 getVillageMaster(): void {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    if(this.addVill.controls.code.value)
   { this.svc.addUpdDel<any>('Mst/GetVillageMaster', dt).subscribe(
      res => {
        console.log(res)
        this.villages = res;
        this.villages1 = res;
        // this.villages=this.villages1.filter(e=>e.block_cd==this.addVill.controls.block.value && e.service_area_cd == this.addVill.controls.service_area.value && (e.vill_name.toLowerCase().includes(this.addVill.controls.code.value.toLowerCase()) || e.vill_cd.includes(this.addVill.controls.code.value)))
        this.villages=this.villages1.filter(e=>e.vill_name.toLowerCase().includes(this.addVill.controls.code.value.toLowerCase()) || e.vill_cd.includes(this.addVill.controls.code.value))
        console.log(this.villages)
      },
      err => { }
    );}
  }
  selectVillage(village:any){
    console.log(village,this.serviceArea1)
    this.addVill.controls.code.setValue(village.vill_cd)
    this.addVill.controls.vname.setValue(village.vill_name);
    this.addVill.controls.block.setValue(village.block_cd);
    this.addVill.controls.po.setValue(village.po_id);
    this.addVill.controls.ps.setValue(village.ps_id);
    this.addVill.controls.district.setValue(19);
    this.setPIN(village.po_id)

    
    this.getVillageCD()
    // console.log( this.serviceArea1.filter(e=>e.block_cd==village.block_cd)[0].service_area_cd)


    this.addVill.controls.service_area.setValue(
      this.serviceArea1.filter(e=>e.block_cd==village.block_cd)[0].service_area_cd
      
  )
    // this.villages.length=0
    this.villages=null
  }
  retrieve ()
  {
    this.hiddenOnNull=false
   this.isModify=true

    // this.getVillageMaster()
    this.addVill.controls.code.enable()
    this.addVill.controls.block.disable()
    this.addVill.controls.service_area.disable()
   
  }
  saveuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    // let login = new LOGIN_MASTER();
    // login.user_id = this.f.userid.value;
    // login.brn_cd = this.f.branch.value;
    // login.user_first_name=this.f.fname.value;
    // login.user_middle_name=this.f.mname.value;
    // login.user_last_name=this.f.lname.value;
    // login.user_type=this.f.utype.value;
    // login.password=this.f.password.value;
    // login.login_status='N';
    // ;
    var dt={
      "state_cd":this.addVill.controls.state.value,
      "dist_cd":this.addVill.controls.district.value,
      "ardb_cd":this.sys.ardbCD,
      "service_area_cd":this.addVill.controls.service_area.value,
      "block_cd":this.addVill.controls.block.value,
      "po_id":this.addVill.controls.po.value,
      "ps_id":this.addVill.controls.ps.value,
      "vill_cd":this.addVill.controls.code.value,
      "vill_name":this.addVill.controls.vname.value
    }
    console.log(this.addVill.controls)
    this.svc.addUpdDel('Mst/InsertVillageMaster', dt).subscribe(
      res => {
        console.log(res)
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,`Village with code ${this.addVill.controls.code.value} saved successfully` );
        // this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
      },
      err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Insertion Failed!!' );
              this.isDel = false;
              this.isRetrieve = false;
              this.isNew = false;
              this.isModify = false;
              this.isSave = true;
              this.isClear = true;
    }
    )

  }
  getVillage(){
     this.villageName=this.villages.filter(e=>e.block_cd==this.addVill.controls.block.value && e.service_area_cd==this.addVill.controls.service_area.value && e.vill_cd && this.addVill.controls.code.value)[0].vill_name
     console.log(this.villageName)
     this.addVill.controls.vill_name.setValue(this.villageName)
  }
  updateuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    var dt={
      "block_name":this.addVill.controls.vname.value,
      "ardb_cd":this.sys.ardbCD,
      "block_cd":this.addVill.controls.block.value,
      "po_id":this.addVill.controls.po.value,
      "ps_id":this.addVill.controls.ps.value,
      "vill_cd":this.addVill.controls.code.value,
      "vill_name":this.addVill.controls.vname.value,
      "service_area_cd":this.addVill.controls.service_area.value
    }
    this.svc.addUpdDel('Mst/UpdateVillage',dt).subscribe(
      res => {
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Village updated successfully!' );
        this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
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
  deleteuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value+'/'+localStorage.getItem('ipAddress');
    login.brn_cd = this.f.branch.value;
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
      this.pin='';
    }
    )

  }
  setPIN(poid:any){
    debugger
    this.pin='';
    this.pin=this.postOffice1.filter(e=>e.po_id==poid)[0].pin;
    debugger
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
    this.addVill.controls.state.setValue(10)
    this.addVill.controls.district.setValue(19)
    this.pin='';
  }
  initialize()
  {
    this.pin='';
   this.addVill.reset()
   this.villages=null
   this.hiddenOnNull=true
   this.isModify=true
   this.addVill.controls.state.setValue(10)
    this.addVill.controls.district.setValue(19)
    this.addVill.controls.block.enable()
    this.addVill.controls.service_area.enable()
    // this.addVill.controls.code.disable()
 
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}
