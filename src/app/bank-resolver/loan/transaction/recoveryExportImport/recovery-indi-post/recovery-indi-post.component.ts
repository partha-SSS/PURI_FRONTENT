import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { tm_subsidy } from 'src/app/bank-resolver/Models/loan/tm_subsidy';
import { RestService } from 'src/app/_service';
import { LOGIN_MASTER, MessageType, mm_customer, ShowMessage, SystemValues } from '../../../../Models';
import { m_branch } from '../../../../Models/m_branch';
import { DatePipe } from '@angular/common'
import { environment } from 'src/environments/environment';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-recovery-indi-post',
  templateUrl: './recovery-indi-post.component.html',
  styleUrls: ['./recovery-indi-post.component.css'],
  providers: [DatePipe]
})
export class RecoveryIndiPostComponent implements OnInit {
  brnDtls: m_branch[] = [];
  modalRef: BsModalRef;

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
  retrieveAgentData:any;
  transData:any;
  totSum=0;
  totAmt=0;
  tot_cur_prn=0;
  tot_ovd_prn=0;
  tot_adv_prn=0;
  tot_cur_intt=0;
  tot_ovd_intt=0;
  tot_pnl_intt=0;
  k=0;
  blocks:any[]=[];
  constructor(public datepipe: DatePipe,private modalService: BsModalService, private router: Router, private formBuilder: FormBuilder, private svc: RestService) { }
  disTransBtn = true;
  ngOnInit(): void {
    this.getBlock();
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
    // this.agentFrm.controls.agent_cd.disable()
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
  getBlock(){
    var dt={"ardb_cd":this.sys.ardbCD}
    this.svc.addUpdDel<any>('Mst/GetBlockMaster', dt).subscribe(
      res => {
        this.blocks=res;
        this.blocks = this.blocks.sort((a, b) => (a.block_name > b.block_name) ? 1 : -1);
      })
  }
  getAgentList() {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode
    }
    this.svc.addUpdDel('Deposit/GetAgentData', dt).subscribe(res => {
      this.agentRes=res
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
   this.svc.addUpdDel('Deposit/UpdateUnapprovedAgentTrans',dt).subscribe(data=>{
      this.svc.addUpdDel('Deposit/UpdateUnapprovedDdsTrans',this.transData).subscribe(d1=>{
       if(!data && !d1){
          this.HandleMessage(true,MessageType.Sucess,'Updated successfully!!')
        }
        else{
          this.HandleMessage(true,MessageType.Error,'An Error occurred while updating!!')
        }
         
      },error=>{
        this.HandleMessage(true,MessageType.Error,'An Error occurred while saving!!')
      }

      )
    },error=>{
      this.HandleMessage(true,MessageType.Error,'An Error occurred while saving!!')
    })
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
     this.svc.addUpdDel('Loan/GetUnapprovedLoanrecovTrans',dt).subscribe(dat=>{
            this.transData=dat
            if(this.transData.length>0){
              this.isLoading=false;
              this.isApprove=true

              this.transData.forEach(resp => {
              this.totSum+=resp.recov_amt;
              this.tot_cur_prn+=resp.curr_prn_recov;
              this.tot_ovd_prn+=resp.ovd_prn_recov;
              this.tot_adv_prn+=resp.adv_prn_recov;
              this.tot_cur_intt+=resp.curr_intt_recov;
              this.tot_ovd_intt+=resp.ovd_intt_recov;
              this.tot_pnl_intt+=resp.penal_intt_recov;
              
              // this.totAmt+=resp.recov_amt
              // const prm = new p_gen_param();
              // // prm.ad_acc_type_cd = +this.f.acc_type_cd.value;
              // prm.as_cust_name =resp.acc_num
              // // prm.ad_acc_type_cd =resp.acc_type_cd;
              // prm.ad_acc_type_cd = 11;
              // console.log(prm);
              // this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
              //   res => {
              //     console.log(res)
              //     this.isLoading=false;
              //     this.custName.push(res[0])
              //     console.log(this.custName);
              //     this.isLoading=false;
              //   },
              //   err => { this.isLoading = false; }
              // );
             });
            // this.agentFrm.controls.trans_amt.setValue(this.totSum)
            this.totAmt=this.totSum
            console.log(dat)
            }else{
              this.isApprove=false
              this.isLoading=false;
              this.HandleMessage(true, MessageType.Error, 'The data for this agent has either been approved or hasn\'t been imported yet!');
     
            }
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
      this.totSum+=(+res.paid_amt)

      console.log(this.totSum,+res.paid_amt)
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
      "agent_cd":this.f.agent_cd.value
    }
    this.svc.addUpdDel('Loan/ApproveLoanImportData',dt).subscribe(data=>{console.log(data)
      
    if(!data){
      this.isApprove=false;
      this.transData=[];
              this.totAmt=0;
              this.tot_cur_prn=0;
              this.tot_ovd_prn=0;
              this.tot_adv_prn=0;
              this.tot_cur_intt=0;
              this.tot_ovd_intt=0;
              this.tot_pnl_intt=0;
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
}
