import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MessageType, mm_acc_type, mm_customer, mm_kyc, p_loan_param, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { InAppMessageService, RestService } from 'src/app/_service';
import { p_gen_param } from '../../Models/p_gen_param';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ucic-merge',
  templateUrl: './ucic-merge.component.html',
  styleUrls: ['./ucic-merge.component.css']
})
export class UcicMergeComponent implements OnInit {

  constructor(private frmBldr: FormBuilder,private svc: RestService, private elementRef: ElementRef,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router) { }
    sys = new SystemValues();
    accountTypeList: mm_acc_type[]= [];
    param :p_loan_param[]=[];
    isTrade: boolean = false;
    isLoading = false;
    modalRef: BsModalRef;
    custMstrFrm: FormGroup;
    get f() { return this.custMstrFrm.controls; }
    relStatus:any;
    lbr_status: any = [];
    KYCTypes: mm_kyc[] = [];
    uniqueUCIC:number=0
    showMsg: ShowMessage;
    isOpenFromDp = false;
    asOnDate : any;
    suggestedCustomer: mm_customer[];
    suggestedCustomer2: any[]=[];
    custNAME:any;
    @ViewChild('contentLoanStmt', { static: true }) contentLoanStmt: TemplateRef<any>;
  ngOnInit(): void {
    this.custMstrFrm = this.frmBldr.group({
      brn_cd: [''],
      cust_cd: [{ value: '', disabled: true }],
      cust_type: ['', Validators.required],
      title: [''],
      first_name: [null, Validators.required],
      middle_name: [null],
      last_name: [null, Validators.required],
      cust_name: ['', { disabled: true }],
      guardian_name: [null, Validators.required],
      father_name: [null, Validators.required],
      cust_dt: [null],
      old_cust_cd: [null],
      dt_of_birth: [null, Validators.required],
      age: [{ value: null, disabled: true }],
      sex: [null, Validators.required],
      marital_status: [null],
      catg_cd: [null, Validators.required],
      community: [null, Validators.required],
      caste: [null, Validators.required],
      permanent_address: [null],
      ward_no: [null],
      state: [19, { disabled: true }],
      dist: [this.sys.dist_cd],
      pin: [null, [Validators.maxLength(6)]],
      vill_cd: [null, Validators.required],
      vill_name: [null],
      block_cd: [null, { disabled: true }, Validators.required],
      po: [null, { disabled: true }, Validators.required],
      ps: [null, { disabled: true }, Validators.required],
      block_cd_desc: [null, { disabled: true }],
      service_area_cd: [null, { disabled: true }, Validators.required],
      service_area_cd_desc: [null, { disabled: true }],
      occupation: [null],
      phone: [null, [Validators.pattern('[0-9 ]{12}'), Validators.maxLength(12), Validators.required]],
      present_address: [null, Validators.required],
      farmer_type: [null],
      lbr: [null],
      is_weaker: [''],
      email: [''],
      fd_folio_no:[''],
      sb_folio_no:[''],
      td_folio_no:[''],
      rd_folio_no:[''],
      mis_folio_no:[''],
      monthly_income: [''],
      date_of_death: [null],
      sms_flag: [''],
      status: [{ value: 'A' }],
      pan: [''],
      nominee: [''],
      nom_relation: [''],
      kyc_photo_type: [''],
      kyc_photo_no: [''],
      kyc_address_type: [''],
      kyc_address_no: [''],
      org_status: [''],
      org_reg_no: [''],
      kyc_other_no: [''],
      kyc_other_type: [''],
      nationality: [null, Validators.required],
      email_id: [''],
      aadhar: ['', Validators.required],
      pan_status: [{ value: 'P' }, Validators.required],
      credit_agency: [''],
      credit_score: [null],
      credit_score_dt: [''],
      approve_status: [''],
      approve_by: [''],
      approve_dt: [''],
      created_dt:['']
    });
    console.log(window.location.hostname)
    this.svc.getlbr(environment.relUrl,null).subscribe(data => {
      this.relStatus=data;
    })
    this.svc.getlbr(environment.relUrl, null).subscribe(data => {
      console.log(data)
      this.lbr_status = data
    })
    this.getKYCTypMaster();
    this.asOnDate =this.sys.CurrentDate;
  }

  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  public onDobChange(value: Date): number {
    debugger
     if (null !== value) {
      const dob = new Date(value);
      const currentDate = new Date();
      const timeDiff = currentDate.getTime() - dob.getTime();
      const age = Math.floor(timeDiff / (365.25 * 24 * 60 * 60 * 1000));
      debugger
      return age;
     }
   }
   ConfrmModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  openModal(template: TemplateRef<any> , cust:any){
    debugger
    const dob = (null !== cust.dt_of_birth && '01/01/0001 00:00' === cust.dt_of_birth.toString()) ? null
      : cust.dt_of_birth;
    console.log(cust);
    this.custMstrFrm.patchValue({
      created_dt:(null !== cust.created_dt && '01/01/0001 00:00' === cust.created_dt.toString()) ? null
      : cust.created_dt,
      brn_cd: cust.brn_cd,
      cust_cd: cust.cust_cd,
      cust_type: cust.cust_type,
      title: cust.title,
      first_name: cust.first_name,
      middle_name: cust.middle_name,
      last_name: cust.last_name,
      cust_name: cust.cust_name,
      guardian_name: cust.guardian_name,
      cust_dt: cust.cust_dt,
      old_cust_cd: cust.old_cust_cd,
      dt_of_birth: dob, 
      age:this.onDobChange(dob),
      sex: cust.sex,
      marital_status: cust.marital_status,
      catg_cd: cust.catg_cd,
      community: cust.community,
      caste: cust.caste,
      permanent_address: cust.permanent_address,
      ward_no: cust.ward_no,
      // state: cust.state,
      // dist: cust.dist,
      // pin: cust.pin,
      // po: cust.po,
      // ps: cust.ps,
      // vill_cd: cust.vill_cd,
      // vill_name:  this.villages.filter(e => e.vill_cd==cust.vill_cd)[0].vill_name,
      // block_cd: cust.block_cd,
      // block_cd_desc: this.selectedBlock!=undefined ? this.selectedBlock.block_name:'',
      // service_area_cd: cust.service_area_cd,
      // service_area_cd_desc: this.selectedServiceArea!=undefined ? this.selectedServiceArea.service_area_name:'',
      occupation: cust.occupation,
      phone: cust.phone,
      present_address: cust.present_address,
      farmer_type: cust.farmer_type,
      email: cust.email, 
      fd_folio_no: cust.fd_folio_no, 
      sb_folio_no: cust.sb_folio_no, 
      td_folio_no: cust.td_folio_no, 
      rd_folio_no: cust.rd_folio_no, 
      mis_folio_no: cust.mis_folio_no,
      monthly_income: cust.monthly_income,
      date_of_death: (null !== cust.date_of_death && '01/01/0001 00:00' === cust.date_of_death.toString()) ? null
        : cust.date_of_death,
      sms_flag: cust.sms_flag == 'Y' ? cust.sms_flag : null,
      // sms_flag: cust.sms_flag,
      lbr: cust.lbr_status,
      is_weaker: cust.is_weaker == 'Y' ? cust.is_weaker : null,
      // is_weaker:cust.is_weaker,
      status: cust.status,
      pan: cust.pan,
      nominee: cust.nominee,
      nom_relation: cust.nom_relation,
      kyc_photo_type: cust.kyc_photo_type,
      kyc_photo_no: cust.kyc_photo_no,
      kyc_address_type: cust.kyc_address_type,
      kyc_address_no: cust.kyc_address_no,
      org_status: cust.org_status,
      org_reg_no: cust.org_reg_no,
      kyc_other_type: cust.kyc_other_type,
      kyc_other_no: cust.kyc_other_no,
      father_name : cust.father_name,
      nationality:cust.nationality,
      email_id:cust.email_id,
      aadhar:cust.aadhar,
      pan_status:cust.pan_status,
      credit_agency:cust.credit_agency,
      credit_score:cust.credit_score==0?null:cust.credit_score,
      credit_score_dt:(null !== cust.credit_score_dt && '01/01/0001 00:00' === cust.credit_score_dt.toString()) ? null
      : cust.credit_score_dt,

    });
    this.modalRef = this.modalService.show(template);
      this.modalRef.setClass('modal-xl');
  }
  private getKYCTypMaster(): void {
    this.svc.addUpdDel<mm_kyc[]>('Mst/GetKycMaster', null).subscribe(
      res => {
        console.log(this.KYCTypes)
        this.KYCTypes = res;
      },
      err => { }
    );
  }
  setMerge(cust, event) {
    cust.merge_flag = event.target.checked ? 'Y' : 'N';
    debugger
       this.suggestedCustomer.forEach(e=>{
        if(e.cust_cd==cust.cust_cd){
          // e.merge_flag="Y";
          e.merged_by=this.sys.UserId+'/'+localStorage.getItem('ipAddress');
        }
        debugger
       })
     }
     setUnique(event) {
      debugger
      this.suggestedCustomer.forEach(e=>{
        if(e.cust_cd==event.cust_cd){
          e.unique_flag="Y";
          this.uniqueUCIC=e.cust_cd;
        }
        else{
          e.unique_flag="N"
        }
        debugger
       })
       }
  getAccountTypeList() {
    ;

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        ;
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'L');
        this.accountTypeList.forEach(x=>x.calc=false);
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        ;
      }
    );
  }
  
  allTrades(event) {
    ;
    const checked = event.target.checked;
    if(checked)
    this.accountTypeList.forEach(item => item.calc = true);
    else
    this.accountTypeList.forEach(item => item.calc = false);
  }
  onSave()
  {
    if(this.suggestedCustomer.length>0){
      for(let i=0; i<this.suggestedCustomer.length; i++){
        if(this.suggestedCustomer[i].merge_flag=='Y' || this.suggestedCustomer[i].unique_flag=='Y'){
          this.suggestedCustomer2.push(this.suggestedCustomer[i])
        }
      }
    }
    else{
      this.HandleMessage(true, MessageType.Error, 'at fast Select all UCIC which want to Marged and Unique');
      return
    }
    debugger
    this.modalRef.hide()
    
      this.isLoading=true;
      this.svc.addUpdDel<any>('UCIC/InsertCustomerMerge', this.suggestedCustomer2).subscribe(
        res => {
          console.log(res >= 0);
          
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess, 'Selected all UCIC Marged with UCIC:'+this.uniqueUCIC+' Successfuly');
          this.suggestedCustomer = [];
          this.suggestedCustomer2 = [];
        },
        err => {
          ;
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'UCIC Marged Failed!!!');
        }
      );

    // }
  //   else
  //   this.HandleMessage(true, MessageType.Warning, 'Please select at least one Account Type!!!!!!!!!!');
  }
  onReset(){
    this.suggestedCustomer = [];
  }
  getAllCustomer(){
    this.isLoading=true;
    const prm = new p_gen_param();
     prm.as_cust_name = this.custNAME;
     prm.ardb_cd=this.sys.ardbCD;
    this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
      res => {
        console.log(res)
        this.isLoading=false;
        if (undefined !== res && null !== res && res.length > 0) {
          this.suggestedCustomer = res
          return res
        } else {
          this.suggestedCustomer = [];
          return [];
        }
      },
      err => { this.isLoading = false; }
    );
  }

  /** Below method handles message show/hide */
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}
