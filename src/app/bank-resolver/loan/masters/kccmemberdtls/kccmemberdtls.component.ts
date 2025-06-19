import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MessageType, mm_customer, mm_vill, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { KccDM } from 'src/app/bank-resolver/Models/loan/KccDM';
import { mm_crop } from 'src/app/bank-resolver/Models/loan/mm_crop';
import { mm_kcc_member_dtls } from 'src/app/bank-resolver/Models/loan/mm_kcc_member_dtls';
import { mm_land_register } from 'src/app/bank-resolver/Models/loan/mm_land_register';
import { td_kcc_sanction_dtls } from 'src/app/bank-resolver/Models/loan/td_kcc_sanction_dtls';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { RestService } from 'src/app/_service';

@Component({
  selector: 'app-kccmemberdtls',
  templateUrl: './kccmemberdtls.component.html',
  styleUrls: ['./kccmemberdtls.component.css']
})
export class KccmemberdtlsComponent implements OnInit {

  constructor(private svc: RestService, private frmBldr: FormBuilder, private modalService: BsModalService,
    private router: Router) { }
  get f() { return this.kccFrm.controls; }
  kccFrm: FormGroup;
  branchCode = '0';
  userName = '';
  sys = new SystemValues();
  isLoading = false;
  showMsg: ShowMessage;
  // mmkccmemberdtls=new  mm_kcc_member_dtls();
  mmlandregister: mm_land_register[] = [];
  tdkccsanctiondtls: td_kcc_sanction_dtls[] = [];
  villageList: mm_vill[] = [];
  kccRet = new KccDM();
  isRetrieve = true;
  suggestedCustomer: mm_customer[];
  selectedCorpList: mm_crop[] = [];
  indxsuggestedCustomer1 = 0;
  // tempcustname ='';
  ngOnInit(): void {
    this.branchCode = this.sys.BranchCode;
    this.userName = this.sys.UserId+'/'+localStorage.getItem('ipAddress');
    this.getVillageMaster();
    this.getCorpList();
    this.kccFrm = this.frmBldr.group({
      member_id: [],
      bank_member_id: [],
      member_name: [],
      kcc_no: [],
      memo_no: [],
      kcc_acc_no: [],
      land_qty: [],
      land_valuation: [],
      created_by: [],
      created_dt: [],
      modified_by: [],
      modified_dt: [],
      karbanama_no: [],
      mortgage_dt: [],
      m_land_qty: [],
      m_land_val: [],
      karbannama_validity_dt: [],
      bsbd_no: [],
      address_type: [],
      photo_type: [],
      village: []
    });
    this.kccFrm.controls.member_id.disable();
  }

  public suggestCustomer(): void {
    if (this.f.member_name.value.length > 2) {
      const prm = new p_gen_param();
      prm.as_cust_name = this.f.member_name.value.toLowerCase();
      this.svc.addUpdDel<any>('Deposit/GetCustDtls', prm).subscribe(
        res => {
          debugger;
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedCustomer = res.slice(0, 20);
          } else {
            this.suggestedCustomer = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }


  populateCustDtls(temp_mm_cust: mm_customer, indx: number) {
    this.f.member_id.setValue(temp_mm_cust.cust_cd);
    // this.f.bank_member_id.setValue(temp_mm_cust.cust_cd);
    this.f.member_name.setValue(temp_mm_cust.cust_name);
    this.f.village.setValue(this.villageList.filter(x => x.vill_cd === temp_mm_cust.vill_cd)[0].vill_name);
    this.f.address_type.setValue(temp_mm_cust.kyc_address_type);
    this.f.photo_type.setValue(temp_mm_cust.kyc_photo_type);
  }
  setCustDtls(cust_cd: number, section: number, indx: number) {
    let temp_mm_cust = new mm_customer();
    if (this.suggestedCustomer !== undefined && this.suggestedCustomer != null && this.suggestedCustomer.length > 0) {
      temp_mm_cust = this.suggestedCustomer.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
      this.suggestedCustomer = null;
      this.populateCustDtls(temp_mm_cust, indx);
      this.getKccData(temp_mm_cust.cust_cd);
    }
    else {
      debugger;
      this.isLoading = true;
      temp_mm_cust.cust_cd = cust_cd;
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', temp_mm_cust).subscribe(
        res => {
          debugger;
          this.suggestedCustomer = res;

          if (this.suggestedCustomer !== undefined && this.suggestedCustomer != null && this.suggestedCustomer.length > 0) {
            temp_mm_cust = this.suggestedCustomer.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
            this.suggestedCustomer = null;
            this.populateCustDtls(temp_mm_cust, indx);
          }
          this.isLoading = false;
        },
        err => { this.isLoading = false; }
      );
    }
  }

  addKccLandArea() {
    const temp_mmlandregister = new mm_land_register();
    this.mmlandregister.push(temp_mmlandregister);
  }
  removeKccLandArea() {
    if (this.mmlandregister.length >= 1) {
      if (this.mmlandregister[this.mmlandregister.length - 1].cust_cd > 0) {
        if (!(confirm('Are you sure you want to Delete The Record '))) {
          return;
        }
      }
      this.mmlandregister.pop();
    }
  }
  addKccSanctionDtls() {
    const temp_tdkccsanctiondtls = new td_kcc_sanction_dtls();
    this.tdkccsanctiondtls.push(temp_tdkccsanctiondtls);
  }
  removeKccSanctionDtls() {
    if (this.tdkccsanctiondtls.length >= 1) {
      if (this.tdkccsanctiondtls[this.tdkccsanctiondtls.length - 1].member_id > 0) {
        if (!(confirm('Are you sure you want to Delete The Record '))) {
          return;
        }
      }
      this.tdkccsanctiondtls.pop();
    }
  }
  getCorpList() {

    if (this.selectedCorpList.length > 0) {
      return;
    }
    this.selectedCorpList = [];

    this.svc.addUpdDel<any>('Mst/GetCropMaster', null).subscribe(
      res => {

        this.selectedCorpList = res;
      },
      err => {

      }
    );

  }

  clearData() {
    debugger;
    this.kccFrm.reset();
    this.kccFrm.enable();
    this.kccFrm.controls.member_id.disable();
    this.mmlandregister = [];
    this.tdkccsanctiondtls = [];
  }
  saveData() {
    debugger;
    if (this.f.land_valuation.value == null || this.f.land_valuation.value === 'undefined' || this.f.land_valuation.value === 0) {
      this.HandleMessage(true, MessageType.Error, 'Land Valuation Can not be Zero');
      return;
    }
    else if (this.tdkccsanctiondtls.length < 1) {
      this.HandleMessage(true, MessageType.Error, 'Credit Limit Should be entered');
      return;
    }
    else {
      const _mmkccmemberdtls = new mm_kcc_member_dtls();
      _mmkccmemberdtls.member_id = this.f.member_id.value;
      this.isLoading = true;
      this.svc.addUpdDel<any>('Loan/GetKccData', _mmkccmemberdtls).subscribe(
        res => {
          debugger;
          if (res.mmkccmemberdtls.member_id === 0) {
            this.insertSaveData(1);
          }
          else {
            this.insertSaveData(2);
          }
        },
        err => {
          debugger; this.isLoading = false;
        }
      );
    }
  }
  deleteData() {
    if (this.f.land_valuation.value == null || this.f.land_valuation.value === 'undefined' || this.f.land_valuation.value === 0) {
      this.HandleMessage(true, MessageType.Error, 'Please Retrieve a group first !!!');
      return;
    }
    if (this.f.member_id.value > 0) {
      if (this.tdkccsanctiondtls.length >= 1) {
        if (this.tdkccsanctiondtls[this.tdkccsanctiondtls.length - 1].member_id > 0) {
          if (!(confirm('Are you sure you want to Delete Entire Group !!! '))) {
            return;
          }
        }
      }
      const _mmkccmemberdtls = new mm_kcc_member_dtls();
      _mmkccmemberdtls.member_id = this.f.member_id.value;
      this.isLoading = true;
      this.svc.addUpdDel<any>('Loan/DeleteKccData', _mmkccmemberdtls).subscribe(
        res => {
          debugger;
          this.clearData();
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Sucess, 'Transaction Deleted Successfully!!!');
        },
        err => {
          debugger; this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, 'Delete Failed!!!');
        }
      );
    }
    else {
      this.HandleMessage(true, MessageType.Error, 'Please Retrieve a group first !!!');
      return;
    }
  }
  backScreen() { this.router.navigate([this.sys.BankName + '/la']); }
  private getVillageMaster(): void {
    debugger;
    this.svc.addUpdDel<any>('Mst/GetVillageMaster', null).subscribe(
      res => {
        debugger;
        this.villageList = res;
      },
      err => { debugger; }
    );
  }
  public getKccData(custcd: any): void {
    debugger;
    const _mmkccmemberdtls = new mm_kcc_member_dtls();
    _mmkccmemberdtls.member_id = custcd;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/GetKccData', _mmkccmemberdtls).subscribe(
      res => {
        debugger;
        if (res.mmkccmemberdtls.member_id === 0) {
          this.isLoading = false;
          this.kccFrm.enable();
          this.kccFrm.controls.member_id.disable();
          // this.kccFrm.controls.bank_member_id.disable();
          this.HandleMessage(true, MessageType.Warning, 'No KCC created with this customer!!!');
          return;
        }
        this.isLoading = false;
        this.kccRet = res;
        this.kccFrm.patchValue({
          member_id: this.kccRet.mmkccmemberdtls.member_id,
          bank_member_id: this.kccRet.mmkccmemberdtls.bank_member_id,
          member_name: this.kccRet.mmkccmemberdtls.member_name,
          kcc_no: this.kccRet.mmkccmemberdtls.kcc_no,
          memo_no: this.kccRet.mmkccmemberdtls.memo_no,
          kcc_acc_no: this.kccRet.mmkccmemberdtls.kcc_acc_no,
          land_qty: this.kccRet.mmkccmemberdtls.land_qty,
          land_valuation: this.kccRet.mmkccmemberdtls.land_valuation,
          created_by: this.kccRet.mmkccmemberdtls.created_by,
          created_dt: this.kccRet.mmkccmemberdtls.created_dt,
          modified_by: this.kccRet.mmkccmemberdtls.modified_by,
          modified_dt: this.kccRet.mmkccmemberdtls.modified_dt,
          karbanama_no: this.kccRet.mmkccmemberdtls.karbanama_no,
          mortgage_dt: this.kccRet.mmkccmemberdtls.mortgage_dt,
          m_land_qty: this.kccRet.mmkccmemberdtls.m_land_qty,
          m_land_val: this.kccRet.mmkccmemberdtls.m_land_val,
          karbannama_validity_dt: this.kccRet.mmkccmemberdtls.karbannama_validity_dt,
          bsbd_no: this.kccRet.mmkccmemberdtls.bsbd_no,
        });
        if (this.kccRet.mmlandregister.length > 0) {
          this.mmlandregister = this.kccRet.mmlandregister;
        }
        if (this.kccRet.tdkccsanctiondtls.length > 0) {
          this.tdkccsanctiondtls = this.kccRet.tdkccsanctiondtls;
        }
        this.tdkccsanctiondtls.forEach(x => x.crop_desc = (this.selectedCorpList.find(y => y.crop_cd === x.crop_cd).crop_desc));
        this.kccFrm.enable();
      },
      err => {
        debugger; this.isLoading = false;
        this.kccFrm.disable();
        this.kccFrm.controls.member_id.enable();
      }
    );
  }

  public insertSaveData(mode: number) {
    debugger;
    const _kccDM = new KccDM();
    let _mmlandregister = [];
    let _tdkccsanctiondtls = [];
    const _mmkccmemberdtls = new mm_kcc_member_dtls();
    _mmkccmemberdtls.member_id = this.f.member_id.value;
    _mmkccmemberdtls.bank_member_id = this.f.bank_member_id.value === null ? this.f.member_id.value : this.f.bank_member_id.value;
    _mmkccmemberdtls.member_name = this.f.member_name.value;
    _mmkccmemberdtls.kcc_no = this.f.kcc_no.value;
    _mmkccmemberdtls.memo_no = this.f.memo_no.value;
    _mmkccmemberdtls.kcc_acc_no = this.f.kcc_acc_no.value;
    _mmkccmemberdtls.land_qty = this.f.land_qty.value === null ? 0 : this.f.land_qty.value;
    _mmkccmemberdtls.land_valuation = this.f.land_valuation.value === null ? 0 : this.f.land_valuation.value;
    _mmkccmemberdtls.created_by = this.f.created_by.value;
    _mmkccmemberdtls.modified_by = this.f.modified_by.value;
    _mmkccmemberdtls.karbanama_no = this.f.karbanama_no.value;
    if (this.f.mortgage_dt.value != null) {
      _mmkccmemberdtls.mortgage_dt = this.f.mortgage_dt.value;
    }
    _mmkccmemberdtls.m_land_qty = this.f.m_land_qty.value;
    _mmkccmemberdtls.m_land_val = this.f.m_land_val.value === null ? 0 : this.f.m_land_val.value;
    if (this.f.karbannama_validity_dt.value != null) {
      _mmkccmemberdtls.karbannama_validity_dt = this.f.karbannama_validity_dt.value;
    }
    _mmkccmemberdtls.bsbd_no = this.f.bsbd_no.value;
    _kccDM.mmkccmemberdtls = _mmkccmemberdtls;
    this.mmlandregister.forEach(x => x.cust_cd = this.f.member_id.value);
    _mmlandregister = this.mmlandregister;
    _kccDM.mmlandregister = _mmlandregister;
    this.tdkccsanctiondtls.forEach(x => x.member_id = this.f.member_id.value);
    _tdkccsanctiondtls = this.tdkccsanctiondtls;
    _kccDM.tdkccsanctiondtls = this.tdkccsanctiondtls;
    this.isLoading = true;
    if (mode === 2) {
      this.svc.addUpdDel<any>('Loan/UpdateKccData', _kccDM).subscribe(
        res => {
          debugger;
          const memberidtmp = this.f.member_id.value;
          this.clearData();
          this.getKccData(memberidtmp);
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Sucess, 'Transaction Updated Successfully!!!');
        },
        err => {
          debugger; this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, 'Updated Failed!!!');
        }
      );
    }
    else {
      this.svc.addUpdDel<any>('Loan/InsertKccData', _kccDM).subscribe(
        res => {
          debugger;
          this.kccFrm.patchValue({
            member_id: res
          });
          this.clearData();
          this.getKccData(res);
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Sucess,
            'Transaction Saved Successfully. Kcc Code : '
            + res.toString());
        },
        err => {
          debugger; this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, 'Insert Failed!!!');
        }
      );
    }
  }

  public setCorpType(corp: string, idx: number): void {

    this.tdkccsanctiondtls[idx].crop_cd = corp;
    this.tdkccsanctiondtls[idx].crop_desc = this.selectedCorpList.filter(x => x.crop_cd.toString() === corp.toString())[0].crop_desc;
    this.tdkccsanctiondtls[idx].activity_cd = this.selectedCorpList.filter(x => x.crop_cd.toString() === corp.toString())[0].activity_cd;
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
}
