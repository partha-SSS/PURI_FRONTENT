import {  Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tt_trial_balance } from 'src/app/bank-resolver/Models/tt_trial_balance';
import { RestService } from 'src/app/_service';
import {  ExportAsConfig } from 'ngx-export-as'
import { AccOpenDM } from 'src/app/bank-resolver/Models/deposit/AccOpenDM';
import { mm_oprational_intr } from 'src/app/bank-resolver/Models/deposit/mm_oprational_intr';
import { DatePipe } from '@angular/common';
import { sm_parameter } from 'src/app/bank-resolver/Models/sm_parameter';
@Component({
  selector: 'app-pass-book-fast-page',
  templateUrl: './pass-book-fast-page.component.html',
  styleUrls: ['./pass-book-fast-page.component.css']
})
export class PassBookFastPageComponent implements OnInit {
  @ViewChild('content2', { static: true }) content2: TemplateRef<any>;
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true, // disable backdrop click to close the modal
    class: 'modal-lg'
  };
  @Input() accNum: string;
  @Input() accType: string;
  operationalInstrList: mm_oprational_intr[] = [];
  trailbalance: tt_trial_balance[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  printID:any;
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
  branchName=this.sys.BranchName.toUpperCase();
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
  joinHold:any;
  cstName:any;
  gdName:any;
  phNo:any;
  pAdds:any;
  custDtls:any;
  custCD:any;
  oprn_instr_desc:any;
  curDay:any
  IFSC:any;
  paddingACC:any;
  systemParam: sm_parameter[] = [];
  RDinterest:any;
  RDmatValue:any;
  standingIns:any;
  standingInsFlg:boolean=false;
  afterMatInstraction:number;
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    public datepipe: DatePipe) { }
  ngOnInit(): void {
    this.getsystemParam();
    if(this.accType=="6"  ){
      this.printID="fastPageRD"
    }else{
      this.sys.ardbCD=="4"?this.printID="fastPageGhatal":
      this.sys.ardbCD=="15"?this.printID="NPfastPage":
      this.printID="fastPage"
      // Ghatal
    }
    debugger
    // this.branchName = localStorage.getItem('__bName');
    this.reportcriteria = this.formBuilder.group({
      yes: [''],
      no: ['']
    });
    this.getOperationalInstr();
    this.loadFastPageData();

    // this.onLoadScreen(this.content2);
    var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time;
       this.curDay=this.datepipe.transform(this.sys.CurrentDate,"dd/MM/yyyy") 
       debugger

     
  }
  getsystemParam(){
    this.svc.addUpdDel<any>('Mst/GetSystemParameter', null).subscribe(
      sysRes => {
        this.systemParam=sysRes
        console.log(this.systemParam);
        
       
      })
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
  calINTT(){
    var dt={
      "ad_instl_amt":this.masterModel.tmdeposit.instl_amt,
      "an_instl_no":this.masterModel.tmdeposit.instl_no,
      "an_intt_rate":this.masterModel.tmdeposit.intt_rt,
      "ardb_cd":this.sys.ardbCD,
      
    }
    this.svc.addUpdDel('Deposit/F_CALCRDINTT_REG',dt).subscribe(data=>{
      console.log(data);
      this.RDinterest=data;
      if(this.RDinterest){
        this.RDmatValue=(this.masterModel.tmdeposit.instl_amt*this.masterModel.tmdeposit.instl_no)+this.RDinterest
      }
    })
  }
  loadFastPageData(){
    this.joinHold=[];
    this.masterModel = new AccOpenDM();
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "brn_cd":this.sys.BranchCode,
      "acc_num":this.accNum,
      "acc_type_cd":this.accType,
      
    }
    this.svc.addUpdDel('Deposit/getAccountOpeningData',dt).subscribe(data=>{
      console.log(data);
     if(data){
      this.masterModel = data;
      this.custCD=this.masterModel.tmdeposit.cust_cd
      debugger
      if(this.accType=="6"){
        this.calINTT();
        this.afterMatInstraction=this.masterModel?.tmdeposit?.standing_instr_flag;
        this.standingIns=this.masterModel?.tmdeposit?.user_acc_num;

        if(this.masterModel.tmdeposit.cheque_facility_flag=='Y')
        {
          this.standingIns=this.masterModel.tmdeposit.user_acc_num;
          this.standingInsFlg=true;
        }
        else{
          this.standingInsFlg=false;

        }
      }
      this.getCustomer()
     
        this.oprn_instr_desc = this.operationalInstrList.filter(x => x.oprn_cd.toString() === this.masterModel.tmdeposit.oprn_instr_cd.toString())[0].oprn_desc;
      
        for (let i = 0; i <=  this.masterModel.tdaccholder.length; i++) {
          console.log( this.masterModel);
          
        this.joinHold+=( this.masterModel.tdaccholder.length==0?'': this.masterModel.tdaccholder[i].acc_holder+',')
        console.log(this.joinHold);
        }
     }
        
    })
    this.suggestedCustomer=[]
    var dc={
      "ardb_cd":this.sys.ardbCD,
      "brn_cd":this.sys.BranchCode,
      "as_cust_name":this.accNum,
      "ad_acc_type_cd":this.accType,
      
    }
    this.svc.addUpdDel('Deposit/GetAccDtls',dc).subscribe(res=>{
      console.log(res);
      this.suggestedCustomer=res;
      console.log(this.suggestedCustomer);
      debugger
      
      this.suggestedCustomer=this.suggestedCustomer.filter(e=>e.acc_num==this.accNum)
      debugger
    })
    
  }
  getCustomer(){
    debugger
    const prm = new p_gen_param();
        prm.as_cust_name = this.custCD;
        prm.ardb_cd = this.sys.ardbCD;
        debugger
        this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
          res => {
            console.log(res)
            this.custDtls=res[0]
            debugger
          })
    this.IFSC=this.systemParam.filter(e=>e.param_cd=="114")[0].param_value
    this.paddingACC=this.systemParam.filter(e=>e.param_cd=="115")[0].param_value
    debugger
  }
  onLoadScreen(content2) {
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
