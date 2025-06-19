import {  Component,OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { SafeResourceUrl} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';

import {  ExportAsConfig } from 'ngx-export-as'
import { mm_oprational_intr } from 'src/app/bank-resolver/Models/deposit/mm_oprational_intr';
import { DatePipe } from '@angular/common';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { mm_acc_type } from 'src/app/bank-resolver/Models/deposit/mm_acc_type';
import { PrintServiceService } from '../print-service.service';
import { sm_parameter } from 'src/app/bank-resolver/Models/sm_parameter';
@Component({
  selector: 'app-pass-book-fast-page-loan',
  templateUrl: './pass-book-fast-page.component.html',
  styleUrls: ['./pass-book-fast-page.component.css']
})
export class LoanPassBookFastPageComponent implements OnInit {
  @ViewChild('content2', { static: true }) content2: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  systemParam: sm_parameter[] = [];
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true, // disable backdrop click to close the modal
    class: 'modal-lg'
  };
  accNum: string;
  joinHoldAll:string
  // @Input() accType: string;
  operationalInstrList: mm_oprational_intr[] = [];
  trailbalance: tt_trial_balance[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  toDate: Date;
  suggestedCustomer:any=new mm_customer();
  disabledOnNull=true
  counter=0
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  masterModel: any;
  pageChange: any;
  opdrSum=0;
  opcrSum=0;
  drSum=0;
  crSum=0;
  clsdrSum=0;
  clscrSum=0;
  lastAccCD:any;
  today:any
  cName:any
  cAddress:any
  cAcc:any
  showWait=false
  customerBrn_CD:any;
  cstName:any;
  gdName:any;
  phNo:any;
  pAdds:any;
  custDtls:any;
  custCD:any;
  oprn_instr_desc:any;
  curDay:any;
  acc_cd:any;
  accountTypeList: mm_acc_type[] = [];
  loan_case_dtls:any;
  loan_case_no:any;
  IBSD_AC:any;
  IBSD_AMT:any;
  SHARE_AMT:any;
  customer:[]=[]
  constructor(public pServ: PrintServiceService,private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService,public datepipe: DatePipe,
    private router: Router) { }
  ngOnInit(): void {
    this.svc.addUpdDel('Mst/GetSystemParameter', null).subscribe(
      sysRes => {
        console.log(sysRes);
        this.systemParam=sysRes
      })

    this.joinHoldAll=this.pServ.joinHold;
    this.accNum=this.pServ.accNum;
    debugger
    // this.branchName = localStorage.getItem('__bName');
    this.reportcriteria = this.formBuilder.group({
      yes: [''],
      no: ['']
    });
    this.getAccountTypeList()
    // this.getOperationalInstr();
    
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time;
       this.curDay=this.datepipe.transform(this.sys.CurrentDate,"dd/MM/yyyy") 
       debugger
  }
  getOperationalInstr() {

    this.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
      res => {

        this.operationalInstrList = res;
        this.operationalInstrList = this.operationalInstrList.sort((a, b) => (a.oprn_cd > b.oprn_cd) ? 1 : -1);
      },
      err => {

      }
    );
  }
  loadFastPageData(){
    this.IBSD_AC=null;
    this.IBSD_AMT=null;
      this.custCD=this.masterModel.tmloanall.party_cd
      this.acc_cd=this.masterModel.tmloanall.acc_cd
      if((this.acc_cd===20411 ||this.acc_cd===23301) && (this.masterModel.tdloansancsetlist.length>0)){
        if(this.sys.ardbCD=='1'){
          this.loan_case_dtls=this.masterModel.tdloansancsetlist[0]?.tdloansancset.filter(x => x.param_cd == '500')
          this.IBSD_AC=this.masterModel.tdloansancsetlist[0]?.tdloansancset.filter(x => x.param_cd == '116')[0]?.param_value
          this.IBSD_AMT=this.masterModel.tdloansancsetlist[0]?.tdloansancset.filter(x => x.param_cd == '259')[0]?.param_value
        }
        else{
          this.loan_case_dtls=this.masterModel.tdloansancsetlist[0]?.tdloansancset.filter(x => x.param_cd==(this.systemParam.find(x => x.param_cd == '926').param_value))
        }
        this.loan_case_no=this.loan_case_dtls[0]?.param_value
      }
      else{
        this.loan_case_dtls=null
        this.loan_case_no=null
      }

      
      debugger
      this.getCustomer();
      this.getShareAC();
      
    
    this.accountTypeList=this.accountTypeList.filter(c => c.acc_type_cd == this.acc_cd)
    debugger
    // this.suggestedCustomer=[]
    // var dc={
    //   "ardb_cd":this.sys.ardbCD,
    //   "brn_cd":this.sys.BranchCode,
    //   "as_cust_name":this.accNum,
    //   "ad_acc_type_cd":this.accType,
      
    // }
    // this.svc.addUpdDel('Deposit/GetCustDtls',dc).subscribe(res=>{
    //   console.log(res);
    //   this.suggestedCustomer=res;
    //   console.log(this.suggestedCustomer);
      
    // })
    
    
  }
  getShareAC(){
    const dt={
      "acc_num":this.custCD,
      "acc_type_cd": 7,
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode,
    }
    this.SHARE_AMT=0;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDepositWithChild', dt).subscribe(
      res => {
        debugger
      if(res.length>0){
        this.isLoading=false;
        this.SHARE_AMT=res[0]?.clr_bal
      }
      else{
        this.isLoading=false;
        this.SHARE_AMT=0;
      }
      debugger
    })
  }
  getAccountTypeList() {

    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.isLoading = true;
    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
      if(res.length>0){
              this.accountTypeList = res;
              this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'L');
              // this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
              
              this.masterModel = new LoanOpenDM();
              var dt={
                "ardb_cd":this.sys.ardbCD,
                "brn_cd":this.sys.BranchCode,
                "loan_id":this.accNum,
                // "acc_type_cd":this.accType,
                
              }
              debugger
              this.svc.addUpdDel('Loan/GetLoanData',dt).subscribe(data=>{
                console.log(data);
                
                this.masterModel = data;
                if(this.masterModel.tmloanall.acc_cd>0){
                  this.customerBrn_CD=this.masterModel.tmloanall.brn_cd;
                  // this.onLoadScreen(this.content2);
                  this.onLoadScreen();
                }
              })   
      }
        },
      err => {
        this.isLoading = false;
      }
    );
  }
  getCustomer(){
    debugger
    const prm = new p_gen_param();
        prm.as_cust_name = this.custCD;
        prm.ardb_cd = this.sys.ardbCD;
        debugger
        this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
          res => {
            
            debugger
            console.log(res)
            if(res.length>1){
              this.custDtls=res.filter(element => element.brn_cd==this.customerBrn_CD)[0];
              
              debugger
            }
            
            else{
              debugger
              this.custDtls=res[0]
            }
          })
  }
  onLoadScreen() {
    this.loadFastPageData();
    // this.modalRef = this.modalService.show(content2, this.config);
    
  }
  public closeAlert() {
    this.showAlert = false;
  }
  showFastPage(){
    
    this.modalRef.hide();
  }
}
