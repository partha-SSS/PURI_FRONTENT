import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues } from '../../../Models';

@Component({
  selector: 'app-sub-anexture-entry',
  templateUrl: './sub-anexture-entry.component.html',
  styleUrls: ['./sub-anexture-entry.component.css']
})
export class SubAnextureEntryComponent implements OnInit {
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  // brnDtls: m_branch[]=[];
  sys = new SystemValues()
  isLoading=false;
  subAnex: FormGroup;
  showMsg: ShowMessage;
  isDel = false;
  isRetrieve = false;
  isNew = false;
  isModify = false;
  isSave = false;
  isClear = false;
  AllAnxData:any=[];
  AllSubAnxData:any=[];
  subAnxData:any=[];
  // subAnxData:any=[];
  disableCode=true;
  b_name:any;
  hiddenOnNull=true;
  validatePhone:boolean=false
  insertData:boolean=false;
  accountTypeList:any[]=[];
  constructor(private router: Router,private formBuilder: FormBuilder,private svc: RestService,private modalService: BsModalService,) { }
  @ViewChild('contentbatch', { static: true }) contentbatch: TemplateRef<any>;
  modalRef: BsModalRef;
  ngOnInit(): void {
    // this.GetBranchMaster();
    this.getSubAllAnx()
    // this.getAccountTypeList();
    this.subAnex = this.formBuilder.group({
      anx_cd:[''],
      anx_desc:['A'],
      sub_anx_cd:[''],
      anx_type:[''],
      sub_anx_desc:['',[Validators.required]],
      acc_cd:['',[Validators.required]],
      acc_desc:[''],
      dep_percentage:['',[Validators.required]],
      hsn_code:['',[Validators.required]],
      gst_per:['',[Validators.required]],
      created_by:[ this.sys.UserId+'/'+localStorage.getItem('ipAddress') ,[Validators.required]]
    });
   this.subAnex.controls.anx_cd.setValue('A')
  //  this.subAnex.controls.anx_desc.disable()
  //  this.subAnex.controls.anx_cd.disable()
  //  this.subAnex.controls.acc_cd.disable()
   this.subAnex.controls.sub_anx_cd.disable()
  //  this.subAnex.controls.sub_anx_desc.disable()
  //  this.subAnex.controls.dep_percentage.disable()
  //  this.subAnex.controls.hsn_code.disable()
  //  this.subAnex.controls.gst_per.disable()

    this.disableFild();
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
   
    this.svc.addUpdDel<any>('Asset/GetAnnexureMaster', null).subscribe(
      res => {
        this.AllAnxData=[]
        this.AllAnxData=res
         console.log(this.AllAnxData)
         
       },
      err => { }
    );
    // this.new();
  }
  get f() { return this.subAnex.controls; }
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
    this.subAnex.controls.anx_cd.enable()
    this.subAnex.controls.anx_cd.setValue('A')

    this.subAnex.controls.acc_cd.setValue('')
    this.subAnex.controls.sub_anx_cd.disable()


    this.enableFild()
    //       this.subAnex.controls.branch_nm.setValue('')
    //       this.subAnex.controls.branch_addr.setValue('')
    //       this.subAnex.controls.branch_ph.setValue('')
  }
 

  getAccountTypeList(i:any) {
    console.log(i);
    
  this.isLoading=true;
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "acc_cd": i
    }
    console.log(dt);
    
    this.svc.addUpdDel<any>('Mst/GetAccGlhead', dt).subscribe(
      res => {

        console.log(res)
        this.accountTypeList = res
        console.log(this.accountTypeList);
        if(this.accountTypeList){
          this.isLoading=false;
          this.subAnex.controls.acc_cd.setValue(this.accountTypeList[0]?.acc_cd);
          this.subAnex.controls.acc_desc.setValue(this.accountTypeList[0]?.acc_name);
         
          
        }else{
          this.isLoading=false;
          return;
        }
        
        
      },
      err => {
        this.isLoading=false;console.log(err);
       }
    );



    // if (this.accountTypeList.length > 0) {
    //   return;
    // }
    // this.accountTypeList = [];

    // this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
    //   res => {

    //     this.accountTypeList = res;
    //     this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'L');
    //     this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
    //   },
    //   err => {

    //   }
    // ); 
  }
 
  getSubAnx(){
    
    this.svc.addUpdDel<any>('Asset/GetAnnexureMaster', null).subscribe(
      res => {
        console.log(this.subAnex.controls.anx_cd.value);
        
        this.subAnxData=[]
        this.subAnxData=res
         console.log(this.subAnxData)
         
       },
      err => { }
    );
    // this.subAnex.controls.anx_cd.value   .setValue('A')
    // this.subAnex.controls.branch_nm.setValue('')
    // this.subAnex.controls.branch_addr.setValue('')
    // this.subAnex.controls.branch_ph.setValue('')
  }
  getSubAllAnx(){
    
    this.svc.addUpdDel<any>('Asset/GetSubAnnexureMaster', null).subscribe(
      res => {
        
        this.AllSubAnxData=[]
        this.AllSubAnxData=res
         console.log(this.AllSubAnxData)
         
       },
      err => { }
    );
    // this.subAnex.controls.anx_cd.value   .setValue('A')
    // this.subAnex.controls.branch_nm.setValue('')
    // this.subAnex.controls.branch_addr.setValue('')
    // this.subAnex.controls.branch_ph.setValue('')
  }
  getSubAnex(i:any){
    console.log(i.target.value);
    // const data=this.AllSubAnxData.filter(e=>e.sub_anx_cd.toString().includes(this.subAnex.controls.sub_anx_cd.value) )
    const data2=this.AllSubAnxData.filter(e=>e.sub_anx_cd==i.target.value)[0];
    // console.log(data);
    console.log(data2);
    this.getAccountTypeList(data2?.acc_cd)
    // this.subAnex.controls.anx_desc.setValue(data2?.)
   this.subAnex.controls.anx_cd.setValue(data2?.anx_cd)
   this.subAnex.controls.acc_cd.setValue(data2?.acc_cd)
   this.subAnex.controls.anx_type.setValue(data2?.anx_type)
    this.subAnex.controls.sub_anx_cd.setValue(data2?.sub_anx_cd)
    this.subAnex.controls.sub_anx_desc.setValue(data2?.sub_anx_desc)
    this.subAnex.controls.dep_percentage.setValue(data2?.dep_percentage)
    this.subAnex.controls.hsn_code.setValue(data2?.hsn_code)
    this.subAnex.controls.gst_per.setValue(data2?.gst_per)

    this.subAnex.controls.anx_cd.disable()
    this.subAnex.controls.sub_anx_cd.disable()

  }
  getAllbranch(){
    this.subAnxData=[]
    this.subAnxData=this.subAnxData.filter(e=>e.sub_anx_cd.toString().includes(this.subAnex.controls.sub_anx_cd.value) )
    console.log(this.subAnxData)
    this.subAnex.controls.branch_nm.setValue(this.subAnxData[0].branch_name)
    this.subAnex.controls.branch_addr.setValue(this.subAnxData[0].branch_addr)
    this.subAnex.controls.branch_ph.setValue(this.subAnxData[0].branch_phone)
    
  }
  disableFild()
  {
    // this.subAnex.controls.anx_desc.disable()
    // // this.subAnex.controls.anx_cd.disable()
    // this.subAnex.controls.acc_cd.disable()
    this.subAnex.controls.anx_cd.enable()
    this.subAnex.controls.sub_anx_cd.disable()
    // this.subAnex.controls.sub_anx_desc.disable()
    // this.subAnex.controls.dep_percentage.disable()
    // this.subAnex.controls.hsn_code.disable()
    // this.subAnex.controls.gst_per.disable()
   
  }
  enableFild(){
    this.subAnex.controls.sub_anx_cd.enable()
    // this.subAnex.controls.branch_addr.enable()
    // this.subAnex.controls.branch_ph.enable()

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
    this.subAnex.patchValue({
      anx_cd:block.anx_cd,
      anx_desc:block.anx_desc
    })
    this.modalRef.hide();
    this.isModify=true
    this.showMsg=null
  }

  retrieve ()
  {
    this.hiddenOnNull=false
    this.disableCode=false;
    
    this.subAnex.controls.anx_cd.enable()
   this.subAnex.controls.sub_anx_cd.enable()

    this.isModify=true
    // this.disableFild()
    // this.getAllBlocks()
  }
  phnoValidation(){
    // if(this.subAnex.controls.branch_ph.value.length==10 || this.subAnex.controls.branch_ph.value.length==11){
    // }
    // else{
    //   this.HandleMessage(true, MessageType.Error,'Phone no Should be 10 or 11 digit!' );
    //   this.subAnex.controls.branch_ph.setValue('');
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
        "sub_anx_cd":this.subAnex.controls.sub_anx_cd.value,
        "branch_name":this.subAnex.controls.branch_nm.value,
        "branch_addr":this.subAnex.controls.branch_addr.value,
        "branch_phone":this.subAnex.controls.branch_ph.value,
        "modified_by":this.sys.UserId+'/'+localStorage.getItem('ipAddress')
      }
      ;
      this.svc.addUpdDel('Mst/UpdateBranchInv',dt).subscribe(
        res => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess,'subAnxData updated successfully!' );
          this.isDel = false;
          this.isRetrieve = true;
          this.isNew = true;
          this.isModify = false;
          this.isSave = false;
          this.isClear = true;
          this.disableCode=true
          // this.subAnex.controls.sub_anx_cd.enable()
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
  this.svc.addUpdDel('Asset/GetNextAnxCd',null).subscribe(
    res => {
      console.log(res);
      if(res){
        this.isLoading=true;
        this.showMsg =null;
       
        var data={
          "anx_cd": this.subAnex.controls.anx_cd.value,
          "anx_type": "A",
          "sub_anx_cd": res,
          "sub_anx_desc": this.subAnex.controls.sub_anx_desc.value,
          "acc_cd": this.subAnex.controls.acc_cd.value,
          "created_by": this.sys.UserId+'/'+localStorage.getItem('ipAddress'),
          "dep_percentage":this.subAnex.controls.dep_percentage.value,
          "hsn_code": this.subAnex.controls.hsn_code.value,
          "gst_per": this.subAnex.controls.gst_per.value,

          
        }
        console.log(data)
        this.svc.addUpdDel('Asset/InsertSubAnnexureMaster', data).subscribe(
          res => {
            console.log(res)
            ;
            this.isLoading=false;
            this.HandleMessage(true, MessageType.Sucess,'Sub Annexture Master saved successfully!' );
            //  this.getAllAllAnxData();
            // this.addBank.controls.anx_cd.setValue(res);
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


    this.svc.addUpdDel('Asset/GetNextSubAnxCd',null).subscribe(
      res => {
        console.log(res);
        if(res){
          this.isLoading=true;
          this.showMsg =null;

    // this.validatePhone=false;
    this.isSave=false;
    this.isLoading=true;
    this.showMsg =null;
    var data={
      "ardb_cd":this.sys.ardbCD,
      "anx_cd":this.subAnex.controls.anx_cd.value,
      "branch_name":this.subAnex.controls.branch_nm.value,
      "branch_addr":this.subAnex.controls.branch_addr.value,
      "branch_phone":this.subAnex.controls.branch_ph.value,
      "created_by":this.sys.UserId+'/'+localStorage.getItem('ipAddress'),
      "modified_by":this.sys.UserId+'/'+localStorage.getItem('ipAddress')
    }
    console.log(this.subAnex.controls)
    this.svc.addUpdDel('Mst/InsertBranchInvMaster', data).subscribe(
      res => {
        console.log(res)
        ;
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess,'subAnxData saved successfully!' );
        this.getSubAllAnx()
        this.subAnex.controls.sub_anx_cd.setValue(res)
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
        this.disableCode=true
        this.disableFild()
        // this.clearuser()


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
  }})
    
 
}
    
  }
  updateuser()
  {
    this.isLoading=true;
        this.showMsg =null;
       
        var data={
          "anx_cd": this.subAnex.controls.anx_cd.value,
          "anx_type": this.subAnex.controls.anx_type.value,
          "sub_anx_cd": this.subAnex.controls.sub_anx_cd.value,
          "sub_anx_desc": this.subAnex.controls.sub_anx_desc.value,
          "acc_cd": this.subAnex.controls.acc_cd.value,
          // "created_by": this.sys.UserId+'/'+localStorage.getItem('ipAddress'),
          "dep_percentage":this.subAnex.controls.dep_percentage.value,
          "hsn_code": this.subAnex.controls.hsn_code.value,
          "gst_per": this.subAnex.controls.gst_per.value,
          "modified_by":this.sys.UserId+'/'+localStorage.getItem('ipAddress')
          
        }
        console.log(data)
        this.svc.addUpdDel('Asset/UpdateSubAnnexureData', data).subscribe(
          res => {
            console.log(res)
            ;
            this.isLoading=false;
            this.HandleMessage(true, MessageType.Sucess,'Sub Annexture Master ID:'+this.subAnex.controls.sub_anx_cd.value+ ', Update successfully!' );
            //  this.getAllAllAnxData();
            // this.addBank.controls.anx_cd.setValue(res);
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
  deleteuser()
  {
    this.isLoading=true;
    this.showMsg =null;
    let login = new LOGIN_MASTER();
    login.user_id = this.f.userid.value;
    login.brn_cd = this.f.subAnxData.value;
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
   this.subAnex.controls.anx_desc.setValue('')
   this.subAnex.controls.anx_cd.setValue('A')
   this.subAnex.controls.acc_cd.setValue('')
   this.subAnex.controls.acc_desc.setValue('')
    this.subAnex.controls.sub_anx_cd.setValue('')
    this.subAnex.controls.sub_anx_desc.setValue('')
    this.subAnex.controls.dep_percentage.setValue('')
    this.subAnex.controls.hsn_code.setValue('')
    this.subAnex.controls.gst_per.setValue('')
    
  //  this.subAnex.controls.anx_cd.disable()
  //  this.subAnex.controls.sub_anx_cd.disable()




  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}
