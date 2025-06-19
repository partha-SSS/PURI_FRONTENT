import { Component, OnInit, ViewChild,  TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { mm_customer } from 'src/app/bank-resolver/Models';
import { SystemValues } from './../../../Models/SystemValues';
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { mm_acc_type } from 'src/app/bank-resolver/Models/deposit/mm_acc_type';
import { mm_instalment_type } from 'src/app/bank-resolver/Models/loan/mm_instalment_type';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { tm_guaranter } from 'src/app/bank-resolver/Models/loan/tm_guaranter';
import { td_jewelry } from 'src/app/bank-resolver/Models/loan/td_jewelry';
import { tm_loan_sanction } from 'src/app/bank-resolver/Models/loan/tm_loan_sanction';
import { tm_loan_sanction_dtls } from 'src/app/bank-resolver/Models/loan/tm_loan_sanction_dtls';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { exit } from 'process';
import { tm_deposit } from 'src/app/bank-resolver/Models/tm_deposit';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs';
import { mm_sector } from 'src/app/bank-resolver/Models/loan/mm_sector';
import { mm_activity } from 'src/app/bank-resolver/Models/loan/mm_activity';
import { mm_crop } from 'src/app/bank-resolver/Models/loan/mm_crop';
import { p_loan_param } from 'src/app/bank-resolver/Models/loan/p_loan_param';
import { sm_kcc_param } from 'src/app/bank-resolver/Models/loan/sm_kcc_param';
import { sm_loan_sanction } from 'src/app/bank-resolver/Models/loan/sm_loan_sanction';
import { td_loan_sanc } from 'src/app/bank-resolver/Models/loan/td_loan_sanc';
import { td_loan_sanc_set } from 'src/app/bank-resolver/Models/loan/td_loan_sanc_set';
import Utils from 'src/app/_utility/utils';
import { MessageType, mm_customer, ShowMessage } from 'src/app/bank-resolver/Models';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { sm_parameter } from 'src/app/bank-resolver/Models/sm_parameter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanJewelryDM } from 'src/app/bank-resolver/Models/loan/LoanJewelryDM';


@Component({
  selector: 'app-gold-test-and-valuation-report',
  templateUrl: './gold-test-and-valuation-report.component.html',
  styleUrls: ['./gold-test-and-valuation-report.component.css']
})
export class GoldTestAndValuationReportComponent implements OnInit {
  
  printType:any="";
  sys = new SystemValues();
  isLoading:boolean=false;
  showMsg: ShowMessage;
  valuationList:any[]=[];
  GoldTest:FormGroup;
  newClicked:boolean=false;
  modifyClicked:boolean=false;
  retrieveClicked:boolean=true;
  suggestedCustomer: mm_customer[];
  disabledOnNull=true;
  selectedClick=false;
  selectedCustomer: mm_customer;
  showNoResult=false;
  isOpenduedt:boolean=false;
  isOpenDt:boolean=false;
  tdJewelry:td_jewelry[]=[]
  allJewelryType:any[]=[];
  disableAll:any;
  total:string="TOTAL";
  goldDM:LoanJewelryDM;
  tot_desc_no:number=0;
  tot_gross_we:number=0;
  tot_alloy_stone_we:number=0;
  tot_net_we:number=0;
  tot_purity_we:number=0;
  tot_act_we:number=0;
  tot_net_value:number=0;
  tot_act_rate:number=0;
  tot_eligibility:number=0;
  tot_sanction:any=0
  ardbName=localStorage.getItem('ardb_name');
  ardbCD=localStorage.getItem('__ardb_cd');
  branchName=this.sys.BranchName;
  today:any;
  currDate:any=this.sys.CurrentDate;
  singleData:any;
  listData:any[]=[]
  goldDueDt:any;
  dsave:boolean=false
  constructor(private svc: RestService,
    private modalService: BsModalService,
    private router: Router,
    private msg: InAppMessageService,
    private formBuilder: FormBuilder,

) { 
  this.GoldTest = this.formBuilder.group({
    cust_cd: [''],
    member_no: [''],
    valuation_no: [''],
    value_dt: [''],
    loan_id: [''],
    cust_name: [''],
    due_date: [''],
    lge_page: [''],
    present_address:[''],
    created_by:[''],
    modified_by:[''],
    phone:['']
  });
  var date = new Date();
    // get the date as a string
       var n = date.toDateString();
    // get the time as a string
       var time = date.toLocaleTimeString();
       this.today= n + " "+ time
}
get f() { return this.GoldTest.controls; }
ngOnInit(): void {
  this.getValuationDesc();
  this.disableAll='Y';
  this.goldDM=new LoanJewelryDM();
  this.clearData()
  console.log((this.sys.CurrentDate));

  const inputDateString = this.sys.CurrentDate.toString();
  debugger
  const resultDateString = this.addDaysAndFormat(inputDateString);
  this.goldDueDt=resultDateString
  console.log(resultDateString);
  
  
}
setDueDT(i:any){
  debugger
  const resultDateString = this.addDaysAndFormat(i);
  this.goldDueDt=resultDateString
  console.log(resultDateString);
  debugger
}
addDaysAndFormat(dateString: string): string {
  // Parse the input date string
  const inputDate = new Date(dateString);

  // Add 365 days to the date
  const resultDate = new Date(inputDate);
  resultDate.setDate(resultDate.getDate() + 365);

  // Format the result in IST
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Asia/Kolkata', // IST timezone
  };

  const resultString = resultDate.toLocaleString('en-IN', options);

  return resultString;
}
newAccount(){
  this.GoldTest.controls.cust_name.enable();
  this.newClicked=true;
  this.disableAll='U';
}
modifyData(){
this.disableAll='U';
this.modifyClicked=true;
this.GoldTest.controls.value_dt.enable();
  this.GoldTest.controls.loan_id.enable();
  this.GoldTest.controls.due_date.enable();
  this.GoldTest.controls.lge_page.enable();
}
retrieveData(){
  this.GoldTest.controls.cust_name.disable();
  this.GoldTest.controls.valuation_no.enable();
  this.disableAll='Y'

}
clearData(){
  this.GoldTest.controls.cust_name.enable();
  this.GoldTest.controls.value_dt.disable();
  this.GoldTest.controls.loan_id.disable();
  this.GoldTest.controls.due_date.disable();
  this.GoldTest.controls.lge_page.disable();
  this.GoldTest.controls.valuation_no.disable();
  this.printType="";
  this.newClicked=true;
  this.retrieveClicked=true;
  this.GoldTest.reset();
  this.tdJewelry=[];
  this.disableAll='Y';
  this.tot_desc_no=0;
  this.tot_gross_we=0;
  this.tot_alloy_stone_we=0;
  this.tot_net_we=0;
  this.tot_purity_we=0;
  this.tot_act_we=0;
  this.tot_net_value=0;
  this.tot_act_rate=0;
  this.tot_eligibility=0;
  this.tot_sanction=0;
  this.dsave=false;

}
backScreen(){
  this.router.navigate([this.sys.BankName + '/la']);
}

addJewelry() {
  if (this.tdJewelry !== undefined) {
    const temp_td = new td_jewelry();
    this.tdJewelry.push(temp_td);
    for(let i=0;i<this.tdJewelry.length;i++){
      this.tdJewelry[i].sl_no=i+1;
      this.tdJewelry[i].valuation_no=0;
    }
    this.disableAll='N'
  }
}
setAllTotal(k:any,i:number,ind:any){
debugger
if(this.modifyClicked){
  this.tot_desc_no=0;
  this.tot_gross_we=0;
  this.tot_alloy_stone_we=0;
  this.tot_net_we=0;
  this.tot_purity_we=0;
  this.tot_act_we=0;
  this.tot_net_value=0;
  this.tot_act_rate=0;
  this.tot_eligibility=0;
  this.tot_sanction=0;
  for(let i=0;i<this.tdJewelry.length; i++){
    this.tot_desc_no+=(+this.tdJewelry[i].desc_no?+this.tdJewelry[i].desc_no:0)
    this.tot_gross_we+=(+this.tdJewelry[i].gross_we?+this.tdJewelry[i].gross_we:0)
    this.tot_alloy_stone_we+=(+this.tdJewelry[i].alloy_stone_we?+this.tdJewelry[i].alloy_stone_we:0)
    this.tot_net_we+=(+this.tdJewelry[i].net_we?+this.tdJewelry[i].net_we:0)
    this.tot_purity_we+=(+this.tdJewelry[i].purity_we?+this.tdJewelry[i].purity_we:0)
    this.tot_act_we+=(+this.tdJewelry[i].act_we?+this.tdJewelry[i].act_we:0)
    this.tot_act_rate+=(+this.tdJewelry[i].act_rate?+this.tdJewelry[i].act_rate:0)
    this.tot_net_value+=(+this.tdJewelry[i].net_value?+this.tdJewelry[i].net_value:0)

    
  }
  debugger
    this.tot_desc_no=parseFloat(this.tot_desc_no.toFixed(2))
    this.tot_gross_we= parseFloat(this.tot_gross_we.toFixed(2))
    this.tot_alloy_stone_we=parseFloat(this.tot_alloy_stone_we.toFixed(2))
    this.tot_net_we=parseFloat(this.tot_net_we.toFixed(2))
    this.tot_purity_we=parseFloat(this.tot_purity_we.toFixed(2))
    this.tot_act_we=parseFloat(this.tot_act_we.toFixed(2))
    this.tot_act_rate=parseFloat(this.tot_act_rate.toFixed(2))
    this.tot_net_value=parseFloat(this.tot_net_value.toFixed(2))
 
  this.tot_eligibility=this.tot_net_value-((this.tot_net_value*25)/100);

}
else{
  debugger
  if(i==1){
  
    this.tot_desc_no+=(+k.desc_no);
  }
  if(i==2){
    this.tot_gross_we+=(+k.gross_we);
  }
  if(i==3){
    this.tot_alloy_stone_we+=(+k.alloy_stone_we);
    this.tdJewelry[ind].net_we=(Number(this.tdJewelry[ind].gross_we)-Number(this.tdJewelry[ind].alloy_stone_we)).toFixed(2).toString()
    this.tot_net_we+=Number(this.tdJewelry[ind].net_we);
  }
  if(i==4){
    this.tot_net_we+=(+k.act_we);
  }
  if(i==5){
    this.tot_purity_we+=(+k.purity_we);
    this.tdJewelry[ind].act_we=(Number(Number(this.tdJewelry[ind].net_we)*Number(this.tdJewelry[ind].purity_we))/22).toFixed(2).toString()
    this.tot_act_we+=Number(this.tdJewelry[ind].act_we);
  }
  if(i==6){
    this.tot_act_we+=(+k.act_we);
  }
  if(i==7){
    this.tot_act_rate+=(+k.act_rate);
    this.tdJewelry[ind].net_value=(Number(this.tdJewelry[ind].act_rate)*Number(this.tdJewelry[ind].act_we)).toFixed(2).toString()
    this.tot_net_value+=Number(this.tdJewelry[ind].net_value);
    this.tot_eligibility=this.tot_net_value-((this.tot_net_value*25)/100)
  }
  if(i==8){
    // this.tot_net_value+=(+k.net_value);
    // this.tot_eligibility=this.tot_net_value-((this.tot_net_value*25)/100)
  }
  this.tot_desc_no=parseFloat(this.tot_desc_no.toFixed(2))
  this.tot_gross_we= parseFloat(this.tot_gross_we.toFixed(2))
  this.tot_alloy_stone_we=parseFloat(this.tot_alloy_stone_we.toFixed(2))
  this.tot_net_we=parseFloat(this.tot_net_we.toFixed(2))
  this.tot_purity_we=parseFloat(this.tot_purity_we.toFixed(2))
  this.tot_act_we=parseFloat(this.tot_act_we.toFixed(2))
  this.tot_act_rate=parseFloat(this.tot_act_rate.toFixed(2))
  this.tot_net_value=parseFloat(this.tot_net_value.toFixed(2))
}


  debugger
}
removeJewelry(i:any) {
  if ( this.tdJewelry.length == 1) {
     
    this.tot_desc_no=0
    this.tot_gross_we=0
    this.tot_alloy_stone_we=0
    this.tot_net_we=0
    this.tot_purity_we=0
    this.tot_act_we=0
    this.tot_act_rate=0
    this.tot_net_value=0
    this.tot_eligibility=0
    this.tdJewelry.splice(i, 1)
  }
  else{
    this.tot_desc_no=0
    this.tot_gross_we=0
    this.tot_alloy_stone_we=0
    this.tot_net_we=0
    this.tot_purity_we=0
    this.tot_act_we=0
    this.tot_act_rate=0
    this.tot_net_value=0
    this.tot_eligibility=0
    this.tdJewelry.splice(i, 1)
    for(let k=0;k<this.tdJewelry.length;k++){
      debugger
      this.tot_desc_no+=(+this.tdJewelry[k].desc_no?+this.tdJewelry[k].desc_no:0);
      this.tot_gross_we+=(+this.tdJewelry[k].gross_we?+this.tdJewelry[k].gross_we:0);
      this.tot_alloy_stone_we+=(+this.tdJewelry[k].alloy_stone_we?+this.tdJewelry[k].alloy_stone_we:0);
      this.tot_net_we+=(+this.tdJewelry[k].net_we?+this.tdJewelry[k].net_we:0);
      this.tot_purity_we+=(+this.tdJewelry[k].purity_we?+this.tdJewelry[k].purity_we:0);
      this.tot_act_we+=(+this.tdJewelry[k].act_we?+this.tdJewelry[k].act_we:0);
      this.tot_net_value+=(+this.tdJewelry[k].net_value?+this.tdJewelry[k].net_value:0);
      this.tot_act_rate+=(+this.tdJewelry[k].act_rate?+this.tdJewelry[k].act_rate:0);
      debugger
    }
    this.tot_desc_no=parseFloat(this.tot_desc_no.toFixed(2))
    this.tot_gross_we= parseFloat(this.tot_gross_we.toFixed(2))
    this.tot_alloy_stone_we=parseFloat(this.tot_alloy_stone_we.toFixed(2))
    this.tot_net_we=parseFloat(this.tot_net_we.toFixed(2))
    this.tot_purity_we=parseFloat(this.tot_purity_we.toFixed(2))
    this.tot_act_we=parseFloat(this.tot_act_we.toFixed(2))
    this.tot_act_rate=parseFloat(this.tot_act_rate.toFixed(2))
    this.tot_net_value=parseFloat(this.tot_net_value.toFixed(2))
    this.tot_eligibility=this.tot_net_value-((this.tot_net_value*25)/100)
   
  }
  // else if(this.tdJewelry.length ==1){
  //   debugger
  //   this.tot_desc_no-=(+this.tdJewelry[i].desc_no?+this.tdJewelry[i].desc_no:0);
  //   this.tot_gross_we-=(+this.tdJewelry[i].gross_we?+this.tdJewelry[i].gross_we:0);
  //   this.tot_alloy_stone_we-=(+this.tdJewelry[i].alloy_stone_we?+this.tdJewelry[i].alloy_stone_we:0);
  //   this.tot_net_we-=(+this.tdJewelry[i].net_we?+this.tdJewelry[i].net_we:0);
  //   this.tot_purity_we-=(+this.tdJewelry[i].purity_we?+this.tdJewelry[i].purity_we:0);
  //   this.tot_act_we-=(+this.tdJewelry[i].act_we?+this.tdJewelry[i].act_we:0);
  //   this.tot_net_value-=(+this.tdJewelry[i].net_value?+this.tdJewelry[i].net_value:0);
  //   this.tot_act_rate-=(+this.tdJewelry[i].act_rate?+this.tdJewelry[i].act_rate:0);
  //   debugger
    
  //   this.tdJewelry.pop();
  //   this.tot_desc_no=0
  //   this.tot_gross_we=0
  //   this.tot_alloy_stone_we=0
  //   this.tot_net_we=0
  //   this.tot_purity_we=0
  //   this.tot_act_we=0
  //   this.tot_act_rate=0
  //   this.tot_net_value=0
  //   this.tot_eligibility=0
  // }
  //   this.tot_desc_no=parseFloat(this.tot_desc_no.toFixed(2))
  //   this.tot_gross_we= parseFloat(this.tot_gross_we.toFixed(2))
  //   this.tot_alloy_stone_we=parseFloat(this.tot_alloy_stone_we.toFixed(2))
  //   this.tot_net_we=parseFloat(this.tot_net_we.toFixed(2))
  //   this.tot_purity_we=parseFloat(this.tot_purity_we.toFixed(2))
  //   this.tot_act_we=parseFloat(this.tot_act_we.toFixed(2))
  //   this.tot_act_rate=parseFloat(this.tot_act_rate.toFixed(2))
  //   this.tot_net_value=parseFloat(this.tot_net_value.toFixed(2))
  //   this.tot_eligibility=this.tot_net_value-((this.tot_net_value*25)/100)

}
getValuationDesc(){
  this.svc.addUpdDel<any>('Loan/GetGoldItemMaster', null).subscribe(
    res2 => {
    this.allJewelryType=res2
    }
  )
debugger
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

public suggestCustomer(): Observable<mm_customer> {
  // this.f.status.disable();
  this.isLoading=true;
  console.log(this.f.cust_name.value)
  console.log(!this.selectedClick+" "+this.newClicked)
  // console.log(this.f.cust_name.value.length)
  if (this.f.cust_name.value != null  && this.newClicked) {
   
    if (this.f.cust_name.value.length > 0) {
      const prm = new p_gen_param();
      prm.as_cust_name = this.f.cust_name.value.toLowerCase();
      prm.ardb_cd = this.sys.ardbCD;
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          console.log(res)
          this.isLoading=false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res
            this.showNoResult=false
            return res
          } else {
            this.suggestedCustomer = [];
            this.showNoResult=true;
            return [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {

      this.suggestedCustomer = null;
      // this.suggestedCustomer.length=0
      // this.suggestedCustomer=[];
      return null;
    }
  }
  return null

}

public SelectCustomer(cust: mm_customer): void {
 
  this.selectedCustomer = cust;
  // this.clearData();
 this.selectedClick=true
  this.suggestedCustomer = null;
   this.GoldTest.patchValue({
    cust_cd: cust.cust_cd,
    cust_name: cust.cust_name,
    member_no: cust.old_cust_cd,
    present_address: cust.present_address,
    phone: cust.phone,

  });
  this.GoldTest.controls.valuation_no.disable();
  this.GoldTest.controls.value_dt.enable();
  this.GoldTest.controls.loan_id.enable();
  this.GoldTest.controls.due_date.enable();
  this.GoldTest.controls.lge_page.enable();
  this.addJewelry();
  // this.newClicked = false
  this.currDate=this.sys.CurrentDate;
  const inputDateString = this.sys.CurrentDate.toString();
  debugger
  const resultDateString = this.addDaysAndFormat(inputDateString);
  this.goldDueDt=resultDateString
  console.log(resultDateString);
  
}
convtDueDt(i:any){
  const dateString = i;

  // Parse the input date string
  const parts = dateString.split(/[\/, :]/);
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are zero-based
  const year = parseInt(parts[2], 10);
  const hour = parseInt(parts[4], 10); // Adjust index for hour
  const minute = parseInt(parts[5], 10);
  const second = parseInt(parts[6], 10); // Include seconds
  
  // Create a new Date object
  const date = new Date(year, month, day, hour, minute, second);
  
  // Subtract one day (24 hours) in milliseconds
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const oneDayBeforeDate = new Date(date.getTime() - oneDayInMilliseconds);
  
  // Get ISO string with timezone offset
  const isoStringWithOffset = oneDayBeforeDate.toISOString();
  
  // Convert ISO string to UTC format
  const isoStringUTC = new Date(isoStringWithOffset).toISOString();
return isoStringUTC;
}
saveData(){
  this.isLoading=true;
  var dt={
    "ardb_cd":this.sys.ardbCD,
    "brn_cd":this.sys.BranchCode,
    "member_no": this.f.member_no.value,
    "cust_cd": this.f.cust_cd.value,
    "valuation_no": Number(this.f.valuation_no.value),
    "value_dt": this.f.value_dt.value,
    "loan_id": this.f.loan_id.value,
    "lge_page": this.f.lge_page.value,
    "due_dt": this.convtDueDt(this.f.due_date.value),
    "cust_name": this.f.cust_name.value,
    "present_address": this.f.present_address.value,
    "modified_by":null,

  }
  debugger
  
  this.goldDM.tmgoldmasterdtls=this.tdJewelry
  this.goldDM.tmgoldmaster=dt
  debugger
  if(this.modifyClicked &&this.f.valuation_no.value>0){
    this.goldDM.tmgoldmasterdtls.forEach(e=>{
      e.valuation_no=Number(this.f.valuation_no.value)
      e.modified_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    })
    this.goldDM.tmgoldmaster.modified_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    debugger
    this.svc.addUpdDel<any>('Loan/UpdateLoanValuationData', this.goldDM).subscribe(
      res4 => {
        debugger
        if(res4==0){
          this.dsave=true;// this.f.valuation_no.setValue(res3);
          debugger
          this.HandleMessage(true, MessageType.Sucess, `Transaction for Gold Valuation Id ${this.f.valuation_no.value}, Update sucessfully !!!!`);
          this.isLoading = false;
        }
        else{
          this.dsave=false;
          this.HandleMessage(true, MessageType.Error, `Transaction for Gold Valuation Id ${this.f.valuation_no.value}, Updation Error !!!!`);
          this.isLoading = false;
        }
      },
      err => { this.HandleMessage(true, MessageType.Error, err);
          this.dsave=false;
          this.isLoading = false; }
    )
  }
  else{
    this.svc.addUpdDel<any>('Loan/InsertLoanValuationData', this.goldDM).subscribe(
      res3 => {
        if(res3){
          this.dsave=true;
          this.f.valuation_no.setValue(res3);
          debugger
          this.HandleMessage(true, MessageType.Sucess, `Transaction for Gold Valuation Id ${res3}, Insert sucessfully !!!!`);
          this.isLoading = false;
        }
        else{
          this.dsave=false;
          this.HandleMessage(true, MessageType.Error, `Error !!!! while Insertion for Gold Valuation. `);
          this.isLoading = false;
        }
    
      },
      err => { this.HandleMessage(true, MessageType.Error, err);
        this.isLoading = false;
        this.dsave=false;
      }
    )
  }
  
}
getValuation(){
  debugger
this.isLoading=true;
var dt={
"ardb_cd":this.sys.ardbCD,
"brn_cd":this.sys.BranchCode,
"valuation_no":this.f.valuation_no.value
}
this.svc.addUpdDel<any>('Loan/GetGoldMaster', dt).subscribe(
res => {
  if (res) {
    const data=res
    this.singleData=data;
    debugger
    this.GoldTest.patchValue({
      member_no: data.member_no,
      cust_cd: data.cust_cd,
      valuation_no: data.valuation_no,
      value_dt: data.value_dt.substr(0,10),
      loan_id: data.loan_id,
      lge_page: data.lge_page,
      due_date: data.due_dt.substr(0,10),
      cust_name: data.cust_name,
      present_address: data.present_address,
      phone: data.phone
    })
    debugger
    this.isLoading = false;
  } 
  if(res){
    this.svc.addUpdDel<any>('Loan/GetGoldMasterDtls', dt).subscribe(
      res2 => {
        if(res2){
          this.valuationList=res2;
          this.tdJewelry=res2
          for(let i=0;i<this.tdJewelry.length; i++){
            this.tot_desc_no+=(+this.tdJewelry[i].desc_no)
            this.tot_gross_we+=(+this.tdJewelry[i].gross_we)
            this.tot_alloy_stone_we+=(+this.tdJewelry[i].alloy_stone_we)
            this.tot_net_we+=(+this.tdJewelry[i].net_we)
            this.tot_purity_we+=(+this.tdJewelry[i].purity_we)
            this.tot_act_we+=(+this.tdJewelry[i].act_we)
            this.tot_act_rate+=(+this.tdJewelry[i].act_rate)
            this.tot_net_value+=(+this.tdJewelry[i].net_value)
          }
          this.tot_desc_no=parseFloat(this.tot_desc_no.toFixed(2))
          this.tot_gross_we= parseFloat(this.tot_gross_we.toFixed(2))
          this.tot_alloy_stone_we=parseFloat(this.tot_alloy_stone_we.toFixed(2))
          this.tot_net_we=parseFloat(this.tot_net_we.toFixed(2))
          this.tot_purity_we=parseFloat(this.tot_purity_we.toFixed(2))
          this.tot_act_we=parseFloat(this.tot_act_we.toFixed(2))
          this.tot_act_rate=parseFloat(this.tot_act_rate.toFixed(2))
          this.tot_net_value=parseFloat(this.tot_net_value.toFixed(2))
          this.tot_eligibility=this.tot_net_value-((this.tot_net_value*25)/100)
          debugger
        }
        
      }
    )
  
  }
  
this.isLoading=false;

},
err => {

 this.isLoading = false; }
);
}
public getCustomer() {
debugger
this.isLoading=true;
var dt={

}
this.svc.addUpdDel<any>('Deposit/GetCustDtls', dt).subscribe(
res => {
debugger
this.isLoading=false;
if (undefined !== res && null !== res && res.length > 0) {
  // this.CustomerName = res[0];
  // this.accName=false;
  debugger
  this.isLoading = false;
} 
},
err => {

 this.isLoading = false; }
);


}
private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
  this.showMsg = new ShowMessage();
  this.showMsg.Show = show;
  this.showMsg.Type = type;
  this.showMsg.Message = message;

}
public closeAlertMsg() {

  this.HandleMessage(false);
}

}


