import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, ShowMessage, SystemValues } from '../../Models';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { sd_day_operation } from '../../Models/sd_day_operation';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {ThemePalette} from '@angular/material/core';
@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css']
})
export class UserPermissionComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('add', { static: true }) add: TemplateRef<any>;
  @ViewChild('access', { static: true }) access: TemplateRef<any>;
  allRole:any[]=[];
  showMsg: ShowMessage;
  form: FormGroup;
  form2: FormGroup;
  get_user:FormGroup;
  userType:any;
  sys = new SystemValues();
  isChecked:boolean=false;
  show = false;
  inside = false;
  menuConfigs:any=[];
  hideMenuOnComplete=false
  selectalluser:any=[];
  filterUser:any=[]
  sdoRet:any=[]
  sdo:any;
  buttonID:string;
  isLoading = false;
  matmenuTrg:any=[];
  permission:boolean=false;
  showAlert:boolean = false;
  alertMsg = '';
  filteredArray:any=[]
  color: ThemePalette = 'accent';
  modalRef: BsModalRef;
  config = {
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-sm modal-dialog-centered'
  };
  addconfig = {
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg'
  };
  bName=''
  selectedValue=''
  selectedValue1=''
  inputEl:any;
  selectItems=[
    {
      value:'module',
      name:'module'
    },
    
    {
      value:'sub_module',
      name:'sub_module'
    },
    {
      value:'first_sub_module_item',
      name:'first_sub_module_item'
    },
    {
      value:'second_sub_module_item',
      name:'second_sub_module_item'
    }
   
  ]
  selectItems1=[
    {
      value:'module',
      name:'module'
    }
  ]
reportData:any=[]
reportData2:any=[]
updateData:any=[]
filteredArray1:any=[]
finalArray:any=[]
firstGroup:any=[];
secondGroup:any=[]
thirdGroup:any=[]
first:any=[]
second:any=[]
perm:any=[]
notperm:any=[]
notvalidate:boolean=false;
date_msg:any;
bName1=''
  pm = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  not_pm = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  constructor(private rstSvc: RestService,private formBuilder: FormBuilder, private router: Router, private svc:RestService,private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getRoleMaster();
    this.get_user = this.formBuilder.group({
      select_user: ['', Validators.required],
      module:['', Validators.required]
     });
    this.form = this.formBuilder.group({
      user_type: ['0', Validators.required]
    });
    this.form2 = this.formBuilder.group({
      user_type: ['0', Validators.required],
      module:[null,Validators.required],
      submodule:[null,Validators.required],
      fastsubmodule:[null,Validators.required],
      secondsubmodule:[null,Validators.required],
      identification:[null,Validators.required],
      permission:[0,Validators.required],
    });
    this.openModal(this.content)

   }
   getallUser(){
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('__userId');
    login.brn_cd = localStorage.getItem('__brnCd');
    login.ardb_cd=this.sys.ardbCD,
    this.svc.addUpdDel('Sys/GetUserIDDtls', login).subscribe(
      res => {
        this.selectalluser=res
      })

    
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }
  public closeAlert() {
    this.showAlert = false;
  }
  SubmitReport(){
    this.modalRef.hide()
    this.retrieve();
  }
  backScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  onRetrieve(){
    this.openModal(this.content)
  }
  retrieve ()
  {
    this.isLoading = true;
    let login = new LOGIN_MASTER();
    login.user_id = localStorage.getItem('__userId');
    login.brn_cd = this.sys.BranchCode;
    login.ardb_cd=this.sys.ardbCD,
    
    this.svc.addUpdDel<any>('Sys/GetUserIDDtls', login).subscribe(
            res => {
              ;//console.log(res)
              
              if(res.length>0){
              this.getUserPermission()

                debugger
                this.isLoading = false;
              }  
          else{
            this.isLoading = false;
            this.HandleMessage(true, MessageType.Error,'Error for getting user type!! ' );

          }
              
            }

        )

  }
  getRoleMaster(){
    var dt={
      "ardb_cd":this.sys.ardbCD
      }
      this.svc.addUpdDel<any>('Mst/GetRoleMaster', dt).subscribe(
        res => {
          this.allRole=res
          debugger
        })

  }
  getUserPermission(){
    this.userType=this.form.controls.user_type.value==1?"Admin":this.form.controls.user_type.value==2?"Super User":this.form.controls.user_type.value==3?"General User":this.form.controls.user_type.value==4?"Deposit User":this.form.controls.user_type.value==5?"Loan User":"Discard User"

    this.isLoading = true;
      var dt={
    "ardb_cd":this.sys.ardbCD,
    "role_cd":this.form.controls.user_type.value
      }
    
    this.svc.addUpdDel<any>('Mst/GetRolePermission', dt).subscribe(
            res => {

              if(res.length>0){
                debugger
                this.reportData=res;
                this.showFirstGroup()
                this.isLoading = false;
              }  
          else{
            this.isLoading = false;
            this.HandleMessage(true, MessageType.Error,'Error for getting roal permission!! ' );

          }
        })
  }
  showFirstGroup(){
    this.second=[]
    this.bName=''
    this.bName1=''
    this.selectedValue=''
    this.firstGroup.length=0
    for(let i=0;i<this.reportData.length;i++){
        this.firstGroup[i]=this.reportData[i].module
     }
    
    this.firstGroup=Array.from(new Set(this.firstGroup))
    this.firstGroup=this.firstGroup.sort()
  }
  showSecondGroup(){
    this.bName1=''
    this.filteredArray1=this.reportData.filter(e=>e.module?.toLowerCase().includes(this.selectedValue1.toLowerCase())==true)
    debugger
    this.reportData2=this.filteredArray1
    this.secondGroup.length=0;
    this.bName1=''
    for(let i=0;i<this.filteredArray1.length;i++){
           this.secondGroup[i]=this.filteredArray1[i].sub_module
         }
    this.secondGroup=Array.from(new Set(this.secondGroup))
    this.secondGroup=this.secondGroup.sort()
    debugger
  }
  show3rdGroup(){
    this.updateData=[]
    this.first=[]
    this.second=[]
    this.thirdGroup=[]
    this.notperm=[]
    this.first=this.reportData.filter(e=>e.module?.toLowerCase().includes(this.selectedValue1.toLowerCase())==true)
    this.second=this.first.filter(e=>e.sub_module?.toLowerCase().includes(this.bName1.toLowerCase())==true)
    
  }
  changeTradesByCategory(isChecked: boolean,i:any) {
    console.log(i);
    console.log(isChecked);
    
    if(isChecked){
      this.second[i].permission='Y';
      this.updateValue(this.second[i])
    }
    else{
      this.second[i].permission='N';
      this.updateValue(this.second[i])
    }
    console.log( this.second); 
    
  }
  updateValue(e:any){
    this.isLoading = true;
    e.second_sub_module_item=(e.second_sub_module_item==null?'NA':e.second_sub_module_item);
    e.modified_by=localStorage.getItem('__userId');
   debugger
    this.svc.addUpdDel<any>('Mst/UpdateRolePermission', e).subscribe(
            res => {
                debugger
                this.isLoading = false;
                this.HandleMessage(true, MessageType.Sucess,'Successfully Updated roal permission ' );
            
        },
        err => {this.isLoading = false;
          this.HandleMessage(true, MessageType.Error,'Error from server side' ) })
  }
  addItem(){
    this.addModal(this.add)
  }
  accessControl(){
    this.accessModal(this.access)
  }
  insertNewItem(){
    this.isLoading = true;
    var dt={
  "ardb_cd":this.sys.ardbCD,
  "role_cd":this.form2.controls.user_type.value,
  "module":this.form2.controls.module.value,
  "sub_module":this.form2.controls.submodule.value,
  "first_sub_module_item":this.form2.controls.fastsubmodule.value,
  "second_sub_module_item":this.form2.controls.secondsubmodule.value,
  "identification":this.form2.controls.identification.value,
  "permission":this.form2.controls.permission.value,
  "created_by":this.sys.UserId
    }
  debugger
  this.svc.addUpdDel<any>('Mst/InsertRolePermission', dt).subscribe(
          res => {

            if(res==0){
              debugger
              this.isLoading = false;
          this.HandleMessage(true, MessageType.Sucess,'Successfully Insert New Item!! ' );

            }  
        else{
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Error,'Error Insert New Item!! ' );

        }
      })
  }
  accessModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, this.addconfig);
    }
  addModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, this.addconfig);
    }
    
    
    private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
      this.showMsg = new ShowMessage();
      this.showMsg.Show = show;
      this.showMsg.Type = type;
      this.showMsg.Message = message;
    }

}
