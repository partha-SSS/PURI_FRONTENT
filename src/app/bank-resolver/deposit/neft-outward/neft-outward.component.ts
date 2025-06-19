import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { InAppMessageService, RestService } from 'src/app/_service';
import { MessageType, ShowMessage, SystemValues, mm_ifsc_code, td_outward_payment, m_acc_master, mm_acc_type, mm_customer, tm_deposit } from '../../Models';
import { p_gen_param } from '../../Models/p_gen_param';
import { sm_parameter } from '../../Models/sm_parameter';
import { IfscService } from 'src/app/_service/IfscService.service';

@Component({
  selector: 'app-neft-outward',
  templateUrl: './neft-outward.component.html',
  styleUrls: ['./neft-outward.component.css']
})
export class NeftOutwardComponent implements OnInit {

  constructor(private svc: RestService,private ifscService: IfscService, private router: Router, private msg: InAppMessageService, private modalService: BsModalService, private formBuilder: FormBuilder
  ) { }
  @ViewChild('ifsc', { static: true }) ifsc: TemplateRef<any>;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;

  hidegl:boolean=true;
  disableAccNo:boolean=false;
  modalRef: BsModalRef;
  reportCriteria:FormGroup
  alertMsgType: string;
  alertMsg: string;
  disabledAll = false;
  showAlert = false;
  isLoading = false;
  showMsg: ShowMessage;
  branchCode = '0';
  userName = '';
  sys = new SystemValues();
  isRetrieve = true;
  suggestedIfsc: any
  isOpenFromDp = false;
  suggestedCustomer: mm_customer[];
 clearBalance:any;
 disableSave:boolean=false
  neftPay = new td_outward_payment();
  neftPayRet = new td_outward_payment();
  acc_master: m_acc_master[] = [];
  acc_master2: any = [];
  allNEFT:any;
  accountTypeList: mm_acc_type[] = [];
  systemParam: sm_parameter[] = [];
  iciciACC:any;
  confirm_bene_acc_no:any;
  ifscView:boolean=false;
  __ifsc = '';
  __ifscbank = '';
  __ifscbranch = '';
  __ifscaddress = '';
  __ifsccity = '';
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true,
    class: 'modal-xl',// disable backdrop click to close the modal
  };
  val:any;
  isAccountNumber1Masked = false;
  maskedAccountNumber1 = '';

  ngOnInit(): void {
    this.confirm_bene_acc_no=null;
    this.getsystemParam();
    this.getAccountTypeList();
    this.clearData();
    this.branchCode = this.sys.BranchCode;
    this.userName = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    this.neftPayRet.brn_cd = this.sys.BranchCode;
    this.neftPayRet.trans_dt = this.sys.CurrentDate;
    this.neftPayRet.payment_type ="N";
    this.neftPayRet.date_of_payment = this.sys.CurrentDate;
    this.neftPayRet.ardb_cd=this.sys.ardbCD

    // this.reportCriteria=this.formBuilder.group({
    //      neftID:['',Validators.required]
    // })
  }
  maskAccountNumber1() {
    if (this.neftPayRet.bene_acc_no) {
      this.isAccountNumber1Masked = true;
      this.maskedAccountNumber1 = '*'.repeat(this.neftPayRet.bene_acc_no.length);
    }
  }

  unmaskAccountNumber1() {
    this.isAccountNumber1Masked = false;
  }
  getsystemParam(){
    this.isLoading=true

    this.svc.addUpdDel<any>('Mst/GetSystemParameter', null).subscribe(
      sysRes => {
        if(sysRes){
          this.systemParam=sysRes
          console.log(this.systemParam);
          debugger
          this.iciciACC=this.systemParam.find(x => x.param_cd === '099')?.param_value;
          this.neftPayRet.dr_acc_no = this.iciciACC;
          debugger
          this.isLoading=false;
        }
       })
  }
  setCharge(amt : number){
   let param = new p_gen_param();
  param.ad_prn_amt=amt;
  param.ardb_cd=this.sys.ardbCD
  this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetNeftCharge', param).subscribe(
      res => {
        if(this.sys.ardbCD=="26"){
          this.neftPayRet.charge_ded = 0;
        }
        else{
          this.neftPayRet.charge_ded = 0;
        }

          this.isLoading = false;
          if(this.neftPayRet.bank_dr_acc_no.length>0 && this.clearBalance-(Number(this.neftPayRet.amount)+Number(this.neftPayRet.charge_ded))<0){
            debugger
            this.HandleMessage(true, MessageType.Error, 'Enter Amount Should be Lower than Account Balance !!!!');
            this.disableSave=true;
          }
          else{
            this.disableSave=false;
          }
          // if(this.clearBalance-(this.neftPayRet.amount+this.neftPayRet.charge_ded)<0){
          //   this.HandleMessage(true, MessageType.Error, 'Enter Amount Should be Lower than Account Balance !!!!');
          //   this.disableSave=true;
          // }
          // else{
          //   this.disableSave=false;
          // }

      },
      err => {
        this.isLoading = false;
        this.isRetrieve = true;
        this.neftPayRet.charge_ded = 0;
      }
    );

  }
  getAllNeftBach(){
    this.allNEFT=[]
    this.neftPay.brn_cd = this.sys.BranchCode;
    this.neftPayRet.trans_dt = this.sys.CurrentDate;
    // this.neftPay.trans_cd = this.neftPayRet.trans_cd;
    this.neftPay.ardb_cd=this.sys.ardbCD
    debugger
    this.svc.addUpdDel<any>('Deposit/GetNeftOutDtls', this.neftPay).subscribe(
      res => {
        console.log(res)
        if (res.length === 0) {
          this.clearBalance=0;
          this.neftPayRet.trans_cd = null;
          this.neftPayRet.bene_acc_no = null;
          this.isLoading = false;
          this.isRetrieve = true;
          this.HandleMessage(true, MessageType.Error, 'No Data Found!!!!');
          return;
        }
        else{this.allNEFT=res}
        debugger
      }),
      err => {
        this.isLoading = false;
        this.isRetrieve = true;
        this.clearBalance=0;
          this.neftPayRet.trans_cd = null;
          this.neftPayRet.bene_acc_no = null;
        this.HandleMessage(true, MessageType.Error, err+'  From Server No Data Found!!!!');
      }
  }
  GetNeftOutDtls(i) {
    console.log(i);
    this.modalRef.hide();
    debugger
    this.isLoading = true;

          if(i.bank_dr_acc_no=='0000' && this.sys.ardbCD=='26'){
            this.isLoading=false
            this.HandleMessage(true, MessageType.Error, 'Transaction with GL-CODE could not retrieve!!!');
            this.clearData()
          }
          else{
            this.neftPayRet = i;
          this.confirm_bene_acc_no= i.bene_acc_no;
          this.isLoading = false;
          this.isRetrieve = true;
          const temp_deposit = new tm_deposit();
          console.log(i.bank_dr_acc_no);
          temp_deposit.brn_cd = this.branchCode;
          temp_deposit.acc_num = i.bank_dr_acc_no;
          temp_deposit.acc_type_cd =  +this.neftPayRet.bank_dr_acc_type;
          temp_deposit.ardb_cd=this.sys.ardbCD
          // //debugger;
          this.isLoading = true;
          this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
            res => {
              if(res){
                console.log(res)
                console.log(res[0]?.clr_bal);
                this.clearBalance=res[0]?.clr_bal;
                console.log(this.clearBalance);
                this.isLoading=false
                console.log(this.clearBalance-(Number(this.neftPayRet.amount)+Number(this.neftPayRet.charge_ded)));
                this.msg.sendcustomerCodeForKyc(res[0].cust_cd);
              }
              else{
                this.clearBalance=0;
                this.isLoading=false
              }


              // if(res=[]){
              //   this.isLoading=false
              // }
              // else{
              //   console.log(res[0].clr_bal);

              //   this.clearBalance=res[0].clr_bal;
              //   console.log(this.clearBalance);

              //   this.isLoading=false
              // }

        },
        err => {
          this.isLoading = false;
          this.isRetrieve = true;
          this.HandleMessage(true, MessageType.Error, 'No Data Found!!!!');
        }
        )
        }



  }


  public closeAlertMsg() {
    this.showAlert = false;
    this.disabledAll = false;
  }


  public showAlertMsg(msgTyp: string, msg: string) {
    this.alertMsgType = msgTyp;
    this.alertMsg = msg;
    this.showAlert = true;
    this.disabledAll = true;
  }

  clearData() {
    // this.neftPayRet.payment_type ="N";
    this.isAccountNumber1Masked=false;
    this.clearBalance=0;
    this.neftPayRet.trans_cd = null;
    this.neftPayRet.bene_acc_no = null;
    this.confirm_bene_acc_no=null;
    this.disableSave=false;
    this.isRetrieve = true;
    this.neftPayRet = new td_outward_payment();
    this.neftPayRet.dr_acc_no = this.iciciACC;
    this.neftPayRet.brn_cd = this.sys.BranchCode;
    this.neftPayRet.trans_dt = this.sys.CurrentDate;
    this.neftPayRet.date_of_payment=this.sys.CurrentDate;
    this.neftPayRet.bene_ifsc_code='';
    this.neftPayRet.credit_narration='';
    this.neftPayRet.charge_ded=0;
    this.__ifsc='';
    this.__ifscbank='';
    this.__ifscbranch='';
    this.__ifscaddress='';
    this.__ifsccity='';
    this.clearBalance='';
    this.branchCode = this.sys.BranchCode;
    this.userName = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    this.neftPayRet.payment_type ="N";
    this.neftPayRet.ardb_cd=this.sys.ardbCD
  }

  retrieveData() {
    this.clearBalance=0;
    this.neftPayRet.trans_cd = null;
    this.neftPayRet.bene_acc_no = null;
    this.confirm_bene_acc_no=null;
    this.isRetrieve = false;
    this.neftPayRet = new td_outward_payment();
    this.neftPayRet.brn_cd = this.sys.BranchCode;
    this.neftPayRet.trans_dt = this.sys.CurrentDate;
    this.neftPayRet.date_of_payment=this.sys.CurrentDate;
    this.neftPayRet.dr_acc_no = this.iciciACC;
    this.neftPayRet.bene_ifsc_code='';
    this.neftPayRet.credit_narration='';
    this.neftPayRet.charge_ded=0;
    this.__ifsc='';
    this.__ifscbank='';
    this.__ifscbranch='';
    this.__ifscaddress='';
    this.__ifsccity='';
    //this.neftPayRet=null;
    this.neftPayRet.bene_ifsc_code='';
    this.getAllNeftBach();
    this.onLoadScreen(this.content);


  }
  kyc(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  openModal() {
    if (this.__ifsc === '' && this.neftPayRet.bene_ifsc_code.length > 8) {
      const ifscentred = this.neftPayRet.bene_ifsc_code;
      const neftPaySearch = new td_outward_payment();
      neftPaySearch.ardb_cd=this.sys.ardbCD
      neftPaySearch.bene_ifsc_code = ifscentred.toUpperCase();
      this.isLoading = true;
      this.svc.addUpdDel<any>('Deposit/GetIfscCode', neftPaySearch).subscribe(
        res => {

          this.isLoading = false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.__ifsc = res[0].ifsc;
            this.__ifscbank = res[0].bank;
            this.__ifscbranch = res[0].branch;
            this.__ifscaddress = res[0].address;
            this.__ifsccity = res[0].city;
            this.modalRef = this.modalService.show(this.ifsc, this.config);
          } else {
            this.__ifsc = '';
            this.__ifscbank = '';
            this.__ifscbranch = '';
            this.__ifscaddress = '';
            this.__ifsccity = '';
          }
        },
        err => { this.isLoading = false; }
      );

    }
    else {
      this.modalRef = this.modalService.show(this.ifsc, this.config);
    }
  }

  deleteData() {

    if (this.neftPayRet.trans_cd === 0 || this.neftPayRet.trans_cd == null) {
      this.HandleMessage(true, MessageType.Error, 'Retrieve a unapprove transaction for delete!!!');
      return;
    }
    if (this.neftPayRet.approval_status === 'A' && this.neftPayRet.trans_cd > 0) {
      this.HandleMessage(true, MessageType.Error, 'Already Approved Transaction!!!');
      return;
    }
    if (!(confirm('Are you sure you want to Delete The Transaction '))) {
      return;
    }

    this.isRetrieve = true;
    this.isLoading = true;
    this.neftPayRet.ardb_cd=this.sys.ardbCD
    this.svc.addUpdDel<any>('Deposit/DeleteNeftOutDtls', this.neftPayRet).subscribe(
      res => {

        this.isLoading = false;
        if (res === 0) {
          this.HandleMessage(true, MessageType.Sucess, 'Deleted Successfully!!!');
          this.neftPayRet = new td_outward_payment();
          // this.neftPayRet=null;
          this.__ifsc = '';
          this.__ifscbank = '';
          this.__ifscbranch = '';
          this.__ifscaddress = '';
          this.__ifsccity = '';
          this.clearBalance=0;
          this.neftPayRet.trans_cd = null;
          this.neftPayRet.bene_acc_no = null;
          this.confirm_bene_acc_no = null;

          this.neftPayRet.bene_ifsc_code = '';
          this.neftPayRet.brn_cd = this.sys.BranchCode;
          this.neftPayRet.trans_dt = this.sys.CurrentDate;
          this.neftPayRet.date_of_payment=this.sys.CurrentDate;
          this.neftPayRet.charge_ded=0;
          this.neftPayRet.credit_narration='';
        }
        else {
          this.HandleMessage(true, MessageType.Error, 'Delete Failed!!!');
        }

      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, 'Delete Failed!!!');
      }
    );

  }
  private onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  public closeAlert() {
    this.showAlert = false;
  }
  approveData() {
    if (this.neftPayRet.trans_cd === 0 || this.neftPayRet.trans_cd == null) {
      this.HandleMessage(true, MessageType.Error, 'Retrieve a unapprove transaction first!!!');
      this.clearData()
      return;
    }
    if (this.neftPayRet.approval_status === 'A' && this.neftPayRet.trans_cd > 0) {
      this.HandleMessage(true, MessageType.Error, 'Already Approved Transaction!!!');
      this.clearData()
      return;
    }

    this.isRetrieve = true;
    this.isLoading = true;
    this.neftPayRet.approval_status = 'A';
    this.neftPayRet.approved_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    this.neftPayRet.approved_dt = this.sys.CurrentDate;
    this.neftPayRet.ardb_cd=this.sys.ardbCD
    this.svc.addUpdDel<any>('Deposit/ApproveNeftPaymentTrans', this.neftPayRet).subscribe(
      res => {

        this.isLoading = false;
        if (res === 0) {
          this.HandleMessage(true, MessageType.Sucess, 'Approved Successfully!!!');
          this.clearData()
        }
        else {
          this.HandleMessage(true, MessageType.Error, 'Approve Failed!!!');
          this.clearData()
        }
      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, 'Approve Failed!!! From S');
        this.clearData()
      }
    );
  }

  setPaymentType(accType: string) {

    this.neftPayRet.payment_type = accType;
  }
  saveData() {

    if (this.neftPayRet.approval_status === 'A' && this.neftPayRet.trans_cd > 0) {
      this.HandleMessage(true, MessageType.Error, 'Already Approved Transaction!!!');
      this.clearData()
      return;
    }
    if (this.neftPayRet.payment_type == null || this.neftPayRet.payment_type === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Payment Type Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bene_name == null || this.neftPayRet.bene_name === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary Name Can not be Blank');
      return;
    }
    else if (this.neftPayRet.amount == null || this.neftPayRet.amount == 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount Can not be Blank');
      return;
    }
    else if (this.neftPayRet.date_of_payment == null) {
      this.HandleMessage(true, MessageType.Error, 'Date of Payment Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bene_acc_no == null || this.neftPayRet.bene_acc_no === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary Account No. Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bene_ifsc_code == null || this.neftPayRet.bene_ifsc_code === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary IFSC Can not be Blank');
      return;
    }
    else if (this.neftPayRet.dr_acc_no == null || this.neftPayRet.dr_acc_no == 0) {
      this.HandleMessage(true, MessageType.Error, 'Dr. A/C No Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bank_dr_acc_type == null || this.neftPayRet.bank_dr_acc_type === 0) {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary A/C Type Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bank_dr_acc_no == null || this.neftPayRet.bank_dr_acc_no === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Bank Dr. A/C No Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bank_dr_acc_name == null || this.neftPayRet.bank_dr_acc_name === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Bank Dr. A/C name Can not be Blank');
      return;
    }
    else if (this.neftPayRet.credit_narration == null || this.neftPayRet.credit_narration === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Credit Narration Can not be Blank');
      return;
    }
    this.isRetrieve = true;

    this.neftPayRet.created_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    this.neftPayRet.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    this.neftPayRet.ardb_cd=this.sys.ardbCD
    if (this.neftPayRet.trans_cd > 0) {
      this.svc.addUpdDel<any>('Deposit/UpdateNeftOutDtls', this.neftPayRet).subscribe(
        res => {

          this.isLoading = false;

          this.HandleMessage(true, MessageType.Sucess, 'Transaction Updated Successfully!!!');
          this.clearData()
        },
        err => {
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, 'Update Failed!!!');
          this.clearData()
        }
      );

    }
    else {
      this.neftPayRet.approval_status = 'U';
      this.neftPayRet.ardb_cd=this.sys.ardbCD
      this.svc.addUpdDel<any>('Deposit/InsertNeftOutDtls', this.neftPayRet).subscribe(
        res => {

          this.neftPayRet.trans_cd = res;
          console.log();

          this.isLoading = false;
          this.HandleMessage(true, MessageType.Sucess,
            'Transaction Saved Successfully. Trans Code : '
            + this.neftPayRet.trans_cd.toString());
            this.clearData()
        },

        err => {
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, 'Insert Failed!!! from S');
          this.clearData()
        }
      );
    }

  }
  suggestIfsc(ifscent : string): void {
debugger;

    // if (ifscent.length > 3) {
      const ifscentred = ifscent;
      let neftPaySearch = new td_outward_payment();
      neftPaySearch.bene_ifsc_code = ifscentred.toUpperCase();
      neftPaySearch.ardb_cd=this.sys.ardbCD
      this.isLoading = true;
      this.ifscService.getIfscDetails(ifscent).subscribe(
        (data) => {
          this.ifscView=true;
          this.suggestedIfsc = data;
          console.log(this.suggestedIfsc);
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.suggestedIfsc = null;
          console.error('Error fetching IFSC details:', error);
        }
      );
      // this.svc.addUpdDel<any>('Deposit/GetIfscCode', neftPaySearch).subscribe(
      //   res => {
      //   debugger;
      //     this.isLoading = false;
      //     if (undefined !== res && null !== res && res.length > 0) {
      //       this.suggestedIfsc = res;
      //     } else {
      //       this.suggestedIfsc = [];
      //     }
      //   },
      //   err => { this.isLoading = false; }
      // );



    // } else {
    //   this.suggestedIfsc = null;
    //   this.isLoading = false;
    // }
  }
  public SelectedIfsc(cust: any): void {
    console.log(cust);
    
    this.ifscView=false;
    this.__ifsc = '';
    this.__ifscbank = '';
    this.__ifscbranch = '';
    this.__ifscaddress = '';
    this.__ifsccity = '';
    this.neftPayRet.bene_ifsc_code = (cust.IFSC);
    this.__ifsc = cust.IFSC;
    this.__ifscbank = cust.BANK;
    this.__ifscbranch = cust.BRANCH;
    this.__ifscaddress = cust.ADDRESS
    this.__ifsccity = cust.CITY;
    this.suggestedIfsc = null;
    debugger
  }


  backScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

  checkAndSetDebitAccType(tfrType: string) {
    this.HandleMessage(false);
    debugger;
    this.suggestedCustomer = null;
    if (tfrType.length === 1) {
      this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          debugger;
          this.accountTypeList = res;
          this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
          this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
          let temp_acc_type = new mm_acc_type();
          temp_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString()
            === tfrType)[0];

          if (temp_acc_type === undefined || temp_acc_type === null) {
            this.HandleMessage(true, MessageType.Error, 'Invalid Account Type');
            return;
          }
        },
        err => {
          this.HandleMessage(true, MessageType.Error, 'Invalid Account Type');
          return;
        }
      );

    }
    else if(tfrType.length == 0 || tfrType.length==1){
      this.neftPayRet.bank_dr_acc_no='';
      this.neftPayRet.bank_dr_acc_name='';
      this.neftPayRet.credit_narration='';
      this.hidegl=true;
      this.disableAccNo=false;


    }
    else if(tfrType.length >=2){
      this.suggestGL(tfrType)
    }


  }
  setGLCode(acc_cd: string){
    this.acc_master = null;
    this.hidegl=true;
    let temp_acc_master = new m_acc_master();
    var dt={"ardb_cd":this.sys.ardbCD}
          this.svc.addUpdDel<any>('Mst/GetAccountMaster', dt).subscribe(
            res => {
              ;
              debugger
              this.acc_master = res;
              this.isLoading = false;
              this.hidegl=false;
              console.log(this.acc_master);

              temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString().includes(acc_cd) )[0];
              console.log(temp_acc_master);
              this.clearBalance=''
            this.neftPayRet.bank_dr_acc_no='0000';
            this.neftPayRet.bank_dr_acc_type=temp_acc_master.acc_cd
            this.disableAccNo=true;
            this.neftPayRet.bank_dr_acc_name=temp_acc_master.acc_name;
            this.neftPayRet.credit_narration='TRF FRM '+temp_acc_master.acc_name;
            this.hidegl=true;

            })

  }
  suggestGL(tfrType){

      debugger
      if (tfrType === this.sys.CashAccCode.toString()) {
        debugger
        this.HandleMessage(true, MessageType.Error, this.sys.CashAccCode.toString() +
          ' cash acount code is not permissible.');
        return;
      }
      debugger
        this.acc_master=[];
        if (this.acc_master === undefined || this.acc_master === null || this.acc_master.length === 0) {
          this.isLoading = true;
          var dt={"ardb_cd":this.sys.ardbCD}
          this.svc.addUpdDel<any>('Mst/GetAccountMaster', dt).subscribe(
            res => {
              ;
              debugger
              this.acc_master = res;
              this.isLoading = false;
              this.hidegl=false;
              console.log(this.acc_master);

              this.acc_master2 = this.acc_master.filter(x => x.acc_cd.toString().includes(tfrType.toString()) );
              // this.acc_master2 = this.acc_master.filter(x => x.acc_cd.toString().includes(tfrType) )[0];
              console.log(this.acc_master2);

              // if (this.acc_master2 === undefined || this.acc_master2 === null) {
              //   this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
              //   return;
              // }
              // else {
              //   this.neftPayRet.bank_dr_acc_no='0000';
              //   this.disableAccNo=true;
              //   this.neftPayRet.bank_dr_acc_name=temp_acc_master.acc_name;
              //   this.neftPayRet.credit_narration='TRF FRM '+temp_acc_master.acc_name;
              //   this.hidegl=true;
              // }
            },
            err => {
              ;
              this.isLoading = false;
            }
        );
      }
      else {
        let temp_acc_master = new m_acc_master();
        temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tfrType)[0];
        if (temp_acc_master === undefined || temp_acc_master === null) {
          this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
          return;
        }
        // else {
        //   let temp_acc_master = new m_acc_master();
        //   temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === tfrType)[0];
        //   if (temp_acc_master === undefined || temp_acc_master === null) {
        //     this.HandleMessage(true, MessageType.Error, 'Invalid GL Code');
        //     return;
        //   }
          // else {
          //   this.neftPayRet.bank_dr_acc_no='0000';
          //   this.disableAccNo=true;
          //   this.neftPayRet.bank_dr_acc_name=temp_acc_master.acc_name;
          //   this.neftPayRet.credit_narration='TRF FRM '+temp_acc_master.acc_name;
          //   this.hidegl=true;

          // }
        // }
      }

  }
  clearFields(id:any){
      if(id=='bank_dr_acc_type'){
        this.val=document.getElementById(id)
        console.log(this.val.value);
        if(!this.val.value){
          debugger
          this.hidegl=true;
        }
      }
      else if(id=='bene_ifsc_code'){
        this.val=document.getElementById(id)
        console.log(this.val.value);
        if(!this.val.value){
          debugger
          this.suggestedIfsc.length = 0;
        }
      }
      else if(id=='bank_dr_acc_no'){
        this.val=document.getElementById(id)
        console.log(this.val.value);
        if(!this.val.value){
          debugger
          this.suggestedCustomer.length=0;
        }
      }
  }

  getAccountTypeList() {
    debugger;
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        debugger;
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        this.HandleMessage(true, MessageType.Error, 'can not get account type');
      }
    );
  }

  public suggestCustomer(): void {
    if (Number(this.neftPayRet.bank_dr_acc_type) == null || Number(this.neftPayRet.bank_dr_acc_type) == 0) {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary A/C Type can not be Blank');
      return;
    }
    if (Number(this.neftPayRet.bank_dr_acc_type) > 1000) {
      this.neftPayRet.bank_dr_acc_no = '0000';
      this.HandleMessage(true, MessageType.Error, 'Please change Bene A/C Type First!!!');
      return;
    }
    if (this.neftPayRet.bank_dr_acc_no.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = +this.neftPayRet.bank_dr_acc_type;
      prm.as_cust_name = this.neftPayRet.bank_dr_acc_no.toLowerCase();
      prm.ardb_cd=this.sys.ardbCD
      this.isLoading=true

      this.svc.addUpdDel<any>('Deposit/GetAccDtls', prm).subscribe(
        res => {
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res;
          } else {
            this.suggestedCustomer = [];
          }
          this.isLoading=false

        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }
  public SelectCustomer(cust: any): void {
    console.log(cust)
    this.neftPayRet.bank_dr_acc_no=cust.acc_num;
    this.neftPayRet.bank_dr_acc_name=cust.cust_name;
    this.neftPayRet.credit_narration='TRF FRM '+cust.cust_name;
    this.suggestedCustomer = null;

    let temp_deposit_list: tm_deposit[] = [];
    const temp_deposit = new tm_deposit();

    temp_deposit.brn_cd = this.branchCode;
    temp_deposit.acc_num = cust.acc_num;
    temp_deposit.acc_type_cd =  +this.neftPayRet.bank_dr_acc_type;
    temp_deposit.ardb_cd=this.sys.ardbCD
    // //debugger;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
      res => {
        console.log(res)
        this.clearBalance=res[0].clr_bal;
        if(this.clearBalance-(Number(this.neftPayRet.amount)+Number(this.neftPayRet.charge_ded))<0){
          debugger
          this.HandleMessage(true, MessageType.Error, 'Enter Amount Should be Lower than Account Balance !!!!');
          this.disableSave=true;
        }
        else{
          this.disableSave=false;
        }
        this.msg.sendcustomerCodeForKyc(res[0].cust_cd);
        this.isLoading=false
  }
    )
}

}
