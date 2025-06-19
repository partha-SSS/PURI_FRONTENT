import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues } from '../../../Models'
import { MatTableDataSource } from '@angular/material/table';
// import { m_branch } from '';
export interface AnxData {
  anx_cd: number;
  anx_desc: string;
  anx_type: string;
  created_by: string;
  created_dt: string;     // consider using `Date` if you're parsing the string into a date
  modified_by: string;
  modified_dt: string;    // same as above regarding `Date`
}

@Component({
  selector: 'app-anexture-entry',
  templateUrl: './anexture-entry.component.html',
  styleUrls: ['./anexture-entry.component.css']
})
export class AnextureEntryComponent implements OnInit {
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  displayedColumns: string[] = [
    'anx_cd', 'anx_desc', 'anx_type', 'created_by',
    'created_dt', 'modified_by', 'modified_dt'
  ];
  // AllAnxData: AnxData[]=[];
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
  AllAnxData:any[]=[];
  AllAnxData1:any[]=[];
  disableCode=true;
  b_name:any;
  hiddenOnNull=true;
  dataSource = new MatTableDataSource<any>([]);

  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService,private modalService: BsModalService,) { }
  @ViewChild('contentbatch', { static: true }) contentbatch: TemplateRef<any>;
  modalRef: BsModalRef;
  ngOnInit(): void {
    // this.GetBranchMaster();
    this.getAllAllAnxData()
   this.AllAnxData=[];
  //  this.AllAnxData1=null
    this.addBank = this.formBuilder.group({
      anx_cd:[],
      anx_desc:['',Validators.required],
      anx_type:['A',Validators.required],
      // bank_phone:['',Validators.required]
      // state: [10, Validators.required],
      // code: [''],
      // bname: ['', Validators.required],
     
      // district: [131, Validators.required]
    });
    this.addBank.controls.anx_cd.disable()
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
    this.addBank.controls.anx_cd.disable()

    this. enableFild()
          this.addBank.controls.anx_cd.setValue('')
          this.addBank.controls.anx_desc.setValue('')
          this.addBank.controls.anx_type.setValue('A')
          // this.addBank.controls.bank_phone.setValue('')
    // this.GetBranchMaster();
  }
  selectBlock(block:any){
    this.addBank.controls.anx_cd.setValue(block.anx_cd);
    this.addBank.controls.anx_desc.setValue(block.anx_desc)
    this.AllAnxData=null
  }
  getANXData(i:any){
       console.log(i);
       
         this.AllAnxData1=this.AllAnxData.filter(e=>e.anx_cd.toString().includes(i) || e.anx_desc.toLowerCase().includes(i.toLowerCase()))
         console.log(this.AllAnxData1)
         if(this.addBank.controls.anx_cd.value.length>0){
          this.addBank.controls.anx_cd.setValue(this.AllAnxData1[0]?.anx_cd)
          this.addBank.controls.anx_desc.setValue(this.AllAnxData1[0]?.anx_desc)
          this.addBank.controls.anx_type.setValue(this.AllAnxData1[0]?.anx_type)
          this.addBank.controls.anx_cd.disable()
          this.addBank.controls.anx_desc.enable()
          this.addBank.controls.anx_cd.disable()
         }
         else{
          this. enableFild()
          this.addBank.controls.anx_cd.setValue('')
          this.addBank.controls.anx_desc.setValue('')
          this.addBank.controls.anx_type.setValue('')
         }
  }
  getAllAllAnxData(){
    
    this.svc.addUpdDel<any>('Asset/GetAnnexureMaster', null).subscribe(
      res => {
        
        this.AllAnxData=res
        // console.log(this.addBank.controls.anx_cd.value)
         console.log(this.AllAnxData);
        //  this.dataSource.data==this.AllAnxData
         
        //  this.AllAnxData=this.AllAnxData1.filter(e=>e.anx_cd.toString().includes(this.addBank.controls.anx_cd.value) || e.bank_name.toLowerCase().includes(this.addBank.controls.anx_cd.value.toLowerCase()))
        //  console.log(this.AllAnxData)
        //  if(this.addBank.controls.anx_cd.value.length>0){
        //   this.addBank.controls.anx_cd.setValue(this.AllAnxData[0].anx_cd)
        //   this.addBank.controls.anx_desc.setValue(this.AllAnxData[0].anx_desc)
        //   this.addBank.controls.anx_type.setValue(this.AllAnxData[0].anx_type)
        //    this.disableFild()
        //  }
        //  else{
        //   this. enableFild()
        //   this.addBank.controls.anx_cd.setValue('')
        //   this.addBank.controls.anx_desc.setValue('')
        //   this.addBank.controls.anx_type.setValue('')
        //  }
         
        
      },
      err => { }
    );
  }
  disableFild()
  {
    this.addBank.controls.anx_desc.disable()
    this.addBank.controls.anx_type.disable()
    // this.addBank.controls.bank_phone.disable()
  }
  enableFild(){
    this.addBank.controls.anx_desc.enable()
    this.addBank.controls.anx_type.enable()
    // this.addBank.controls.bank_phone.enable()

  }
  GetBranchMaster()
  {
    this.isLoading=true;
    ;
    this.svc.addUpdDel('Mst/GetBranchMaster', null).subscribe(
      res => {
        ;
        // this.brnDtls=res;
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
    
    this.addBank.controls.anx_cd.enable()
    this.addBank.controls.anx_desc.disable()
    this.isModify=true
    // this.getAllAllAnxData()
  }
  saveuser(){
    debugger
    if(this.addBank.controls.anx_cd.value>0){
      this.isLoading=true;
      this.showMsg =null;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "anx_cd":this.addBank.controls.anx_cd.value,
        "anx_desc":this.addBank.controls.anx_desc.value,
        "anx_type": "A",
        "modified_dt":this.sys.CurrentDate,
        "modified_by":this.sys.UserId+'/'+localStorage.getItem('ipAddress')

      }
   
      this.svc.addUpdDel('Asset/UpdateAnnexureData',dt).subscribe(
        res => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess,'Annexture updated successfully!' );
          this.isDel = false;
          this.isRetrieve = true;
          this.isNew = true;
          this.isModify = false;
          this.isSave = false;
          this.isClear = true;
          this.disableCode=true
          this.addBank.controls.anx_cd.disable()
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
      this.svc.addUpdDel('Asset/GetNextAnxCd',null).subscribe(
        res => {
          console.log(res);
          if(res){
            this.isLoading=true;
            this.showMsg =null;
           
            var data={
              "ardb_cd":this.sys.ardbCD,
              "anx_cd":res,
              "anx_desc":this.addBank.controls.anx_desc.value,
              "anx_type": "A",
              "created_by":this.sys.UserId+'/'+localStorage.getItem('ipAddress')
            }
            console.log(this.addBank.controls)
            this.svc.addUpdDel('Asset/InsertAnnextureMasterData', data).subscribe(
              res => {
                console.log(res)
                ;
                this.isLoading=false;
                this.HandleMessage(true, MessageType.Sucess,'Annexture Master saved successfully!' );
                 this.getAllAllAnxData();
                this.addBank.controls.anx_cd.setValue(res);
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
        })
    }
   

 


  }
  updateuser()
  {
    this.addBank.controls.anx_cd.disable();
    this.addBank.controls.anx_desc.enable();
    // this.enableFild();
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
  //  this.AllAnxData=[];
  //  this.AllAnxData1=null
   this.addBank.controls.anx_cd.disable()

  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }


}


