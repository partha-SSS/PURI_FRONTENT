import { Input } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InAppMessageService, RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { mm_category, mm_customer } from '../../Models';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit, OnDestroy {
  constructor(private frmBldr: FormBuilder, private svc: RestService,
    private msg: InAppMessageService) {
    this.subscription = this.msg.getCommonCustInfo().subscribe(
      res => {
        if (null !== res && undefined !== res &&
          res.cust_cd !== 0) {
          this.cust = res;
          this.getCategoryMaster();
        } else {
          if (undefined !== this.custMstrFrm) {
            this.custMstrFrm.reset();
          }
        }
      },
      err => { }
    );

  }
  get f() { return this.custMstrFrm.controls; }
  static categories: mm_category[] = [];
  @Input() title: string;
  @Input() mode1: boolean; // to show hide items
  @Input() mode2: boolean;
  subscription: Subscription;
  cust: mm_customer;
  custMstrFrm: FormGroup;

  ngOnInit(): void {
    this.custMstrFrm = this.frmBldr.group({
      brn_cd: [''],
      cust_cd: [''],
      cust_type: [''],
      title: [''],
      first_name: [''],
      middle_name: [''],
      last_name: [''],
      cust_name: [''],
      guardian_name: [''],
      cust_dt: [''],
      old_cust_cd: [''],
      dt_of_birth: [''],
      age: [''],
      sex: [''],
      marital_status: [''],
      catg_cd: [''],
      community: [''],
      caste: [''],
      permanent_address: [''],
      ward_no: [''],
      state: [''],
      dist: [''],
      pin: [''],
      vill_cd: [''],
      block_cd: ['', { disabled: true }],
      service_area_cd: [''],
      occupation: [''],
      phone: [''],
      present_address: [''],
      farmer_type: [''],
      email: [''],
      monthly_income: [''],
      date_of_death: [''],
      sms_flag: [''],
      status: [''],
      pan: ['',],
      nominee: [''],
      nom_relation: [''],
      kyc_photo_type: [''],
      kyc_photo_no: [''],
      kyc_address_type: [''],
      kyc_address_no: [''],
      org_status: [''],
      org_reg_no: [''],
      catg_desc: ['']
    });
  }

  private getCategoryMaster(): void {
    if (undefined !== CustomerInfoComponent.categories &&
      null !== CustomerInfoComponent.categories &&
      CustomerInfoComponent.categories.length > 0) {
      this.getCustomer();
    } else {
      this.svc.addUpdDel<mm_category[]>('Mst/GetCategoryMaster', null).subscribe(
        res => {
          if (Utils.ChkArrNotEmpty(res)) {
            CustomerInfoComponent.categories = res;
            this.getCustomer();
          }
        },
        err => { }
      );
    }
  }

  private getCustomer(): void {
    const cust = this.cust;
    if (undefined !== cust && Object.keys(cust).length !== 0) {
      const category = CustomerInfoComponent.categories.
        filter(e => e.catg_cd === cust.catg_cd)[0];
      this.custMstrFrm.patchValue({
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
        dt_of_birth: cust.dt_of_birth.toString().substr(0, 10),
        age: cust.age,
        sex: cust.sex,
        marital_status: cust.marital_status,
        catg_cd: cust.catg_cd,
        community: cust.community,
        caste: cust.caste,
        permanent_address: cust.permanent_address,
        ward_no: cust.ward_no,
        state: cust.state,
        dist: cust.dist,
        pin: cust.pin,
        vill_cd: cust.vill_cd,
        block_cd: cust.block_cd,
        service_area_cd: cust.service_area_cd,
        occupation: cust.occupation,
        phone: cust.phone,
        present_address: cust.present_address,
        farmer_type: cust.farmer_type,
        email: cust.email,
        monthly_income: cust.monthly_income,
        date_of_death: cust.date_of_death,
        sms_flag: cust.sms_flag,
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
        catg_desc: category.catg_desc
      });
    } else { this.custMstrFrm.reset(); }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
