import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { mm_acc_type, mm_customer, SystemValues } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { RestService } from 'src/app/_service';
@Component({
  selector: 'app-networth-statement',
  templateUrl: './networth-statement.component.html',
  styleUrls: ['./networth-statement.component.css']
})
export class NetworthStatementComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer, private comSer:CommonServiceService,
    private router: Router) { }
  modalRef: BsModalRef;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true, // disable backdrop click to close the modal
   };
  showReport = false;
  showAlert = false;
  isLoading = false;
  reportcriteria: FormGroup;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  counter=0;
  showNoResult=false;
  disabledOnNull=true;
  custCD:any;
  custName:any;
  custType:any;
  custAddr:any;
  suggestedCustomer: mm_customer[];
  today:any;
  memberID:any;
  reportData:any=[];
  reportData1:any=[];
  accountTypeList: mm_acc_type[] = [];
  accountTypeList2: mm_acc_type[] = [];
  ardbName=localStorage.getItem('ardb_name');
  branchName=this.sys.BranchName;
  ardbCD:any=this.sys.ardbCD;
  showWait=false
  ngOnInit(): void {
    this.reportcriteria = this.formBuilder.group({
      cust_name: [null, Validators.required]
    });
    this.getAccountTypeList();
    this.onLoadScreen(this.content);
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today= n + " "+ time
  }
  get f(){
    return this.reportcriteria.controls;
  }
  onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  getAccountTypeList() {
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];
    this.accountTypeList2 = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {

        this.accountTypeList = res;
        this.accountTypeList2 = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      });
  }
  public getMember(cust_cd): void {
    this.showWait=true;
      const prm = new p_gen_param();
      prm.as_cust_name = cust_cd;
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          this.memberID=res[0].old_cust_cd;
          
        },
        err => { this.isLoading = false; }
      );
   
  }
  public suggestCustomer(): void {
    this.showWait=true;
    if (this.reportcriteria.controls.cust_name.value.length > 0) {
      const prm = new p_gen_param();
      prm.as_cust_name = this.reportcriteria.controls.cust_name.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res;
            this.showWait=false
          } else {
            this.suggestedCustomer = [];
            this.showWait=false

          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }
  onChangeName(){
    this.suggestedCustomer = null;
    this.showNoResult=false
    if (this.f.cust_name.value.length > 0) {
      this.disabledOnNull=false
    }
    else{
      this.disabledOnNull=true
    }
  }
  public SelectCustomer(cust: mm_customer): void {
    console.log(cust)
    this.getMember(cust.cust_cd)
    this.custCD=cust.cust_cd
    this.custType=cust.cust_type
    this.custName=cust.cust_name
    this.custAddr=cust.permanent_address
    this.reportcriteria.controls.cust_name.setValue(cust.cust_cd);
    this.suggestedCustomer = null;
  }
  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else {
      this.modalRef.hide()
      this.reportData.length=0;
      this.reportData1.length=0;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "cust_cd":this.custCD
      }
     
      this.isLoading=true
      this.showAlert = false;
      this.svc.addUpdDel('UCIC/GetLoanDtls',dt).subscribe(data=>{console.log(data)
        this.reportData=data
        for(let i=0;i<this.reportData.length;i++){
          this.reportData[i].acc_desc= this.accountTypeList2.filter(c => c.acc_type_cd == this.reportData[i]?.acc_cd)[0]?.acc_type_desc;
        }
        this.svc.addUpdDel('UCIC/GetDepositDtls',dt).subscribe(data=>{console.log(data)
          this.reportData1=data
          for(let i=0;i<this.reportData1.length;i++){
            this.reportData1[i].acc_type_desc= this.accountTypeList.filter(c => c.acc_type_cd == this.reportData1[i]?.acc_type_cd)[0]?.acc_type_desc;
          }
          debugger
          // this.reportData1 = this.reportData1.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
          if(!this.reportData && this.reportData1.length==0){
            this.comSer.SnackBar_Nodata()
          this.isLoading=false
          } 
          this.isLoading=false
          console.log(this.reportData,this.reportData1,this.isLoading)
         this.modalRef.hide()
        },
        err => {
           this.isLoading = false;
           this.comSer.SnackBar_Error(); 
          })
      },
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
        })
      
    }
   
  }
 
  public closeAlert() {
    this.showAlert = false;
  }
  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
}
