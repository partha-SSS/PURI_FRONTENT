import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { tm_subsidy } from 'src/app/bank-resolver/Models/loan/tm_subsidy';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, mm_customer, ShowMessage, SystemValues } from '../../../Models';
import { m_branch } from '../../../Models/m_branch';
import { DatePipe } from '@angular/common'
import { environment } from 'src/environments/environment';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-flexi-small-saving-posting',
  templateUrl: './flexi-small-saving-posting.component.html',
  styleUrls: ['./flexi-small-saving-posting.component.css'],
  providers: [DatePipe]
})
export class FlexiSmallSavingPostingComponent implements OnInit {
  brnDtls: m_branch[] = [];
  modalRef: BsModalRef;
  showHideAgent:boolean=false
  isLoading = false;
  agentFrm: FormGroup;
  showMsg: ShowMessage;
  isDel = false;
  isRetrieve = false;
  isNew = false;
  isModify = false;
  isSave = true;
  // isSave = false;
  isClear = false;
  isOpenFromDp = false;
  isOpenFromDp1 = false;
  sys = new SystemValues();
  subsidyData: any;
  suggestedCustomer: mm_customer[];
  shownoresult = false;
  disabledOnNull = true;
  editDeleteMode = false;
  isApprove = false;
  custName:any=[];
  // agentData: { ardb_cd: string; brn_cd: string; };
  agentData: any;
  agentRes:any;
  allAgent:any;
  retrieveAgentData:any;
  transData:any;
  totSum=0;
  totAmt=0;
  k=0;
  constructor(public datepipe: DatePipe,private modalService: BsModalService, private router: Router, private formBuilder: FormBuilder, private svc: RestService) { }
  disTransBtn = true;
  ngOnInit(): void {
    this.getSubsidyType()
    this.getAgentList()
    this.agentFrm = this.formBuilder.group({
      trans_cd: [''],
      trans_dt: [''],
      agent_cd: [''],
      agent_name: [''],
      trans_amt: [''],
      trans_type: ['']
    });
    this.isDel = false;
    this.agentFrm.controls.agent_cd.disable()
    this.agentFrm.controls.trans_dt.disable()
    this.agentFrm.disable()
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
    this.editDeleteMode = false
    this.agentFrm.controls.trans_dt.setValue(this.sys.CurrentDate)
    this.agentFrm.controls.agent_cd.enable();

  }
  get f() { return this.agentFrm.controls; }
  closeScreen() {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  getSubsidyType() {
    this.svc.getlbr(environment.subsidyUrl, null).subscribe(data => {
      this.subsidyData = data
    })
  }
  new() {
    this.isDel = false;
    this.isRetrieve = false;
    this.isNew = false;
    this.isModify = false;
    this.isSave = true;
    this.isClear = true;
    this.editDeleteMode = false;
    this.GetBranchMaster();
  }
  GetBranchMaster() {
    this.isLoading = true;
    ;
    this.svc.addUpdDel('Mst/GetBranchMaster', null).subscribe(
      res => {
        ;
        this.brnDtls = res;
        this.isLoading = false;

      },
      err => { this.isLoading = false;; }
    )
  }
  retrieve() {
    this.agentFrm.controls.agent_cd.enable();
    this.isSave=false;
  }
  getAgentList() {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode
    }
    this.svc.addUpdDel('Deposit/GetAgentData', dt).subscribe(res => {
      this.agentRes=res
      this.allAgent=res
    })
  }
  saveuser() {
    console.log(this.agentFrm);
    console.log(this.transData)
    var dt={
      "ardb_cd": this.sys.ardbCD,
      "brn_cd":this.sys.BranchCode,
      "agent_cd":this.f.agent_cd.value,
      "trans_dt":this.f.trans_dt.value,
      "trans_cd":this.f.trans_cd.value,
      "trans_amt":this.f.trans_amt.value
    }

      this.svc.addUpdDel('Deposit/UpdateUnapprovedFlexiDailyDepositTrans',this.transData).subscribe(d1=>{
       if(!d1){
          this.HandleMessage(true,MessageType.Sucess,'Updated successfully!!')
        }
        else{
          this.HandleMessage(true,MessageType.Error,'An Error occurred while updating!!')
        }

      },error=>{
        this.HandleMessage(true,MessageType.Error,'An Error occurred while saving!!')
      }

      )

  }
 deleteuser() {
    this.isLoading = true;
    let subsidyEntry = new tm_subsidy();
    subsidyEntry.brn_cd = this.sys.BranchCode;
    subsidyEntry.loan_id = this.f.loan_id.value;
    subsidyEntry.ardb_cd = this.sys.ardbCD;
    this.svc.addUpdDel('Loan/DeleteSubsidyData', subsidyEntry).subscribe(
      res => {
        console.log(res)
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Sucess, 'Subsidy Entry successfully deleted!');
        this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
        this.editDeleteMode = false
      },
      err => {
        this.isLoading = false; this.HandleMessage(true, MessageType.Error, 'Deletion Failed!!');
        this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
        this.editDeleteMode = false
      }
    )
  }
  clearuser() {
    this.initialize();
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
    this.editDeleteMode = false
    this.agentFrm.reset();
    this.agentFrm.disable();
    this.disTransBtn=true;
    this.transData=null
    this.agentFrm.controls.trans_dt.setValue(this.sys.CurrentDate)
  }
  selectAgent(agent_cd:any){
    this.agentFrm.controls.agent_cd.setValue(agent_cd);
    this.showHideAgent=false
    debugger;
    this.retrieveData();
  }
  retrieveData(){
    this.custName=[];
    this.isLoading=true;
    this.k=0
    console.log(this.f.trans_dt.value+" "+this.f.agent_cd.value);
    this.totSum=0;
    this.totAmt=0
    var dt = {
      "ardb_cd":this.sys.ardbCD,
      "brn_cd":this.sys.BranchCode,
      "agent_cd":this.f.agent_cd.value,
      "trans_dt":this.f.trans_dt.value
    }
    if(this.f.agent_cd.value){
    // this.svc.addUpdDel('Deposit/GetUnapprovedSBFLEXITrans',dt).subscribe(data => {console.log(data)
    // this.retrieveAgentData=data

    //   if(this.retrieveAgentData.approval_status=='U'){
    //     this.isApprove=true;
    //     this.agentFrm.patchValue({
    //       trans_cd:this.retrieveAgentData.trans_cd,
    //       trans_type:this.retrieveAgentData.trans_type=='D'?'Deposit':'Transfer',
    //       trans_amt:this.retrieveAgentData.trans_amt,
    //       agent_name:this.retrieveAgentData.agent_cd
    //     })
        // var req={
        //   "ardb_cd":this.sys.ardbCD,
        //   "brn_cd":this.sys.BranchCode,
        //   "agent_cd":this.f.agent_cd.value,
        //   "trans_dt":this.f.trans_dt.value,
        //   "trans_cd":this.f.trans_cd.value
        // }
        this.svc.addUpdDel('Deposit/GetUnapprovedSBFLEXITrans',dt).subscribe(dat=>{
          this.isLoading=false;
          this.isApprove=true;
            this.transData=dat;
              this.transData.forEach(resp => {
              this.totSum+=resp.amount
              this.totAmt+=resp.amount
              this.totAmt=this.totSum
              console.log(dat)
          })

      // else{
      //   this.isApprove=false
      //   this.isLoading=false;
      //   this.HandleMessage(true, MessageType.Error, 'The data for this agent has either been approved or hasn\'t been imported yet!');
      // }
    },
    err => {
      this.isApprove=false;
      this.isLoading = false;
      this.HandleMessage(true, MessageType.Error, 'No data found');

    })

    }
    else{
      this.isLoading=false;
      this.isApprove=false
      this.clearuser();
      this.agentFrm.controls.agent_cd.enable()
    }
  }
  initialize() {
    this.agentFrm.reset()
  }
  calcSum(){
    this.totSum=0;
    this.transData.forEach(res => {
      this.totSum+=(+res.amount)

      console.log(this.totSum,+res.amount)
     });
    this.agentFrm.controls.trans_amt.setValue(this.totSum)
    this.totAmt=this.totSum
  }
  clearSuggestedCust() {
    this.suggestedCustomer = null;
    this.shownoresult = false
    if (this.f.loan_id.value.length > 0) {
      this.disabledOnNull = false
    }
    else {
      this.disabledOnNull = true;
    }
  }
  SelectCustomer(cust) {
    console.log(cust);
    this.suggestedCustomer = [];
    this.f.loan_id.setValue(cust.loan_id)
    this.isSave = false;
    this.retrieve()
  }
  public suggestCustomer(): void {
    this.isLoading = true;
    if (this.f.loan_id.value.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = 20411;
      prm.as_cust_name = this.f.loan_id.value.toLowerCase();
      this.svc.addUpdDel<any>('Loan/GetLoanDtls', prm).subscribe(
        res => {
          console.log(res)
          this.isLoading = false;
          if (undefined !== res && null !== res && res.length > 0) {

            this.suggestedCustomer = res;
          } else {
            this.shownoresult = true;
            this.suggestedCustomer = [];
          }
        },
        err => {
          this.shownoresult = false;
          this.isLoading = false;
        }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  approve(){
    this.modalRef.hide();
    this.isLoading=true;
    var dt={
      "ardb_cd":this.sys.ardbCD,
      "brn_cd":this.sys.BranchCode,
      "trans_dt":this.f.trans_dt.value,
      // "trans_cd":this.f.trans_cd.value,
      "user_id":this.sys.UserId,
      "agent_cd":this.f.agent_cd.value,
      "acc_type_cd":10
    }
    this.svc.addUpdDel('Deposit/ApproveSBFlexiData',dt).subscribe(data=>{console.log(data)

    if(!data){
      this.HandleMessage(true, MessageType.Sucess, 'Approved successfully');
      this.isApprove=false
      this.isLoading=false;
    }
    else{
      this.isApprove=true
      this.HandleMessage(true, MessageType.Error, 'Error while approving');
      this.isLoading=false;
    }
    },error=>{this.HandleMessage(true, MessageType.Error, 'Error while approving')
      this.isApprove=true
      this.isLoading=false;
   })
  }
  onshow(i:any)
  {
    if(i.target.value==''){
      this.showHideAgent=false
    }
    else{
      this.agentRes=this.allAgent.filter(e=>e.agent_name.toLowerCase().includes(i.target.value.toLowerCase()) || e.agent_cd.includes(i.target.value.toLowerCase()) ==true)
      this.showHideAgent=true
    }
    debugger
    }
}
