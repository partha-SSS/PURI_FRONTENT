import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues, mm_dist } from '../../../Models';
import { m_branch } from '../../../Models/m_branch';

@Component({
  selector: 'app-serviceareamaster',
  templateUrl: './serviceareamaster.component.html',
  styleUrls: ['./serviceareamaster.component.css']
})
export class ServiceareamasterComponent implements OnInit {
  brnDtls: m_branch[]=[];
  districts: mm_dist[] = [];
  sys = new SystemValues();
  isLoading=false;
  servicearea: FormGroup;
  showMsg: ShowMessage;
  isDel = false;
  isRetrieve = false;
  isNew = false;
  isModify = false;
  isSave = false;
  isClear = false;
  block:any=[];
  hideSArea=true;
  allServiceArea:any=[];
  allServiceArea1:any=[];
  showNoResult:false;
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService) { }

  ngOnInit(): void {
    // this.GetServiceAreaMaster();
    this.getBlock()
    this.allServiceArea=null;
    this.servicearea = this.formBuilder.group({
      sareablock: ['', Validators.required],
      sareacd: [''],
      sareaname: ['', Validators.required],
      state: [10, Validators.required],
      district: [131, Validators.required]
      
    });
    this.servicearea.controls.sareacd.disable();
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = false;
    this.isModify = false;
    this.isSave = true;
    this.isClear = true;
    this.getDistMaster();
  }
  get f() { return this.servicearea.controls; }
  
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
   getBlock(){
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    this.svc.addUpdDel<any>('Mst/GetBlockMaster', dt).subscribe(
      res => {
        this.block=res;
        this.block = this.block.sort((a, b) => (a.block_name > b.block_name) ? 1 : -1);
      },
      err => {"Error from server side"}
    );
  }
  setAreaDtls(s_area:any){
    this.getBlock()
    //  console.log(this.allServiceArea1.filter(e=>e.service_area_cd.includes(this.f.sareacd.value) || e.service_area_name.toLowerCase().includes(this.f.sareacd.value.toLowerCase()))[0].block_cd)
   console.log(s_area)
    this.servicearea.controls.sareablock.setValue(s_area.block_cd);
    this.servicearea.controls.sareacd.setValue(s_area.service_area_cd);
    this.servicearea.controls.sareaname.setValue(s_area.service_area_name)
    this.allServiceArea=null
    this.servicearea.controls.sareablock.disable();
  

  }

  suggestArea(){
    var dt={
      "ardb_cd":this.sys.ardbCD,
    }
  }
  new()
  { 
    this.initialize();
    this.servicearea.controls.sareablock.reset();
    this.servicearea.controls.sareacd.reset();
    this.servicearea.controls.sareaname.reset();
    this.isDel = false;
    this.isRetrieve = false;
    // this.isNew = false;
    // this.isModify = false;
    this.isSave = true;
    this.isClear = true;
    this.hideSArea=true
    this.GetServiceAreaMaster();
  }

  GetServiceAreaMaster()
  {
    var dt={
      "ardb_cd":this.sys.ardbCD,
    }
   
    this.svc.addUpdDel<any>('Mst/GetServiceAreaMaster', dt).subscribe(
      res => {
        // this.allServiceArea=res;
        this.allServiceArea1=res;
        console.log(this.allServiceArea)
        
        if (res.length<0)
        {
          this.HandleMessage(true, MessageType.Sucess,'Service Area Not found !!!' );
        }
        else
        {
        // this.servicearea.controls.sareacd.enable();
        this.isLoading=true;
        this.isDel = true;
        this.isRetrieve = false;
        this.isNew = false;
        this.isModify = true;
        this.isSave = false;
        this.isClear = true;
        this.allServiceArea=this.allServiceArea1.filter(e=>e.service_area_cd.includes(this.f.sareacd.value) || e.service_area_name.toLowerCase().includes(this.f.sareacd.value.toLowerCase()))
        console.log(this.allServiceArea)
        }

        
        this.isLoading=false

      },
      err => { this.isLoading=false;  this.HandleMessage(true, MessageType.Error,'Service Area Not found !!!' );
      
      this.isDel = false;
      this.isRetrieve = true;
      this.isNew = false;
      this.isModify = false;
      this.isSave = false;
      this.isClear = true;
    }
    )
  
  }
  
  retrieve ()
    {
      this.hideSArea=false
      this.servicearea.controls.sareacd.enable()
    var dt={
      "ardb_cd":this.sys.ardbCD,
    }
    // this.svc.addUpdDel<any>('Mst/GetServiceAreaMaster', dt).subscribe(
    //   res => {
    //     this.allServiceArea=res;
    //     if (res.length==0)
    //     {
    //       this.HandleMessage(true, MessageType.Sucess,'Service Area Not found !!!' );
    //     }
    //     else
    //     {
    //     this.servicearea.controls.sareacd.enable();
    //     this.isDel = true;
    //     this.isRetrieve = false;
    //     this.isNew = false;
    //     this.isModify = true;
    //     this.isSave = false;
    //     this.isClear = true;
    //     }

    //   },
    //   err => { ;  this.HandleMessage(true, MessageType.Error,'Service Area Not found !!!' );
    //   this.initialize();
    //   this.isDel = false;
    //   this.isRetrieve = true;
    //   this.isNew = false;
    //   this.isModify = false;
    //   this.isSave = false;
    //   this.isClear = true;
    // }
    // )
  }

  
  saveuser()
  {

    var dt={
      "ardb_cd":this.sys.ardbCD,
      "block_cd":this.servicearea.controls.sareablock.value,
      "state_cd":this.servicearea.controls.state.value,
      "dist_cd":this.servicearea.controls.district.value,
      "service_area_name": this.servicearea.controls.sareaname.value,

    }
    
    this.svc.addUpdDel('Mst/InsertServiceAreaMaster', dt).subscribe(
      res => {
        ;
       
        this.servicearea.controls.sareacd.setValue(res);
        this.HandleMessage(true, MessageType.Sucess,'Sucessfully Saved Service Area Details' );
        this.initialize();
    
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
  updateuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "block_cd":this.servicearea.controls.sareablock.value,
      "state_cd":this.servicearea.controls.state.value,
      "dist_cd":this.servicearea.controls.district.value,
      "service_area_cd":this.servicearea.controls.sareacd.value,
      "service_area_name": this.servicearea.controls.sareaname.value,

    }
    //login.login_status='N';
    ;
    this.svc.addUpdDel('Mst/UpdateServiceArea', dt).subscribe(
      res => {
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'Sucessfully Updated the User Details' );
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
  //   this.isLoading=true;
  //   this.showMsg =null;
  //   var dt={
  //     "ardb_cd":this.sys.ardbCD,
  //     "block_cd":this.servicearea.controls.sareablock.value,
  //     "state_cd":this.servicearea.controls.state.value,
  //     "dist_cd":this.servicearea.controls.district.value,
  //     "service_area_name": this.servicearea.controls.sareaname.value,

  //   }
  //   this.svc.addUpdDel('Sys/DeleteUserMaster', dt).subscribe(
  //     res => {
  //       ;
  //       this.isLoading=false;
  //       this.HandleMessage(true, MessageType.Sucess,'User Details Deleted' );
  //       this.initialize();
  //       this.isDel = false;
  //       this.isRetrieve = true;
  //       this.isNew = true;
  //       this.isModify = false;
  //       this.isSave = false;
  //       this.isClear = true;
  //     },
  //     err => {this.isLoading=false; ; this.HandleMessage(true, MessageType.Error,'Deletion Failed!!' );
  //     this.initialize();
  //     this.isDel = false;
  //     this.isRetrieve = true;
  //     this.isNew = true;
  //     this.isModify = false;
  //     this.isSave = false;
  //     this.isClear = true;
  //   }
  //   )

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
    this.hideSArea=true;
    
  }
  initialize()
  {
    this.allServiceArea=null;
    this.servicearea.controls.sareablock.reset();
    this.servicearea.controls.sareacd.reset();
    this.servicearea.controls.sareaname.reset();
    this.servicearea.controls.sareacd.disable()
    this.isNew = false;
   
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
}
