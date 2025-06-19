import { InAppMessageService } from './../../_service/in-app-message.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { mm_dashboard } from '../Models/mm_dashboard';
import { p_gen_param } from '../Models/p_gen_param';
import { mm_customer, SystemValues } from '../Models';
import { RestService } from 'src/app/_service';
import {trigger, style, animate, transition} from '@angular/animations';
import { CommonServiceService } from '../common-service.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(1000, style({opacity: 1}))
      ]) 
    ])
  ]
})
export class DashboardComponent implements OnInit{

  constructor(private router: Router, private modalService:BsModalService,private msg: InAppMessageService,private svc: RestService, private comsv:CommonServiceService) { }
  sys = new SystemValues();
  dashboardItem = new mm_dashboard();
  isLoading = false;
  modalRef?:BsModalRef;
  currUser:any;
  L2L:any=localStorage.getItem('L2L')
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  ngOnInit(): void {
    this.comsv.accOpen=false
    this.comsv.accClose=false
    this.comsv.loanDis=false
    this.comsv.loanRec=false
    this.comsv.openDayBook=false
    this.comsv.openGlTrns=false
    // when ever landing is loaded screen title should be hidden
    this.msg.sendhideTitleOnHeader(true);
    this.getDashboardItem();
    // if(this.L2L=='true'){
    //   this.openModal(this.template)
    // }
    // this.getCustomerList()
}
    openModal(template: TemplateRef<any>) {
      this.currUser=localStorage.getItem('__userId');
      this.modalRef = this.modalService.show(template, {class: 'modal-sm modal-dialog-centered'});
    }
    closeL2L(){
    localStorage.removeItem('L2L');
    this.modalRef?.hide()
    }
  getDashboardItem() {
    const param = new p_gen_param();
    param.brn_cd = this.sys.BranchCode;
    param.ardb_cd=localStorage.getItem('__ardb_cd')
    //console.log(param)
    this.svc.addUpdDel<any>('Common/GetDashBoardInfo', param).subscribe(
        res => {
          this.dashboardItem = res;
        },
        err => {
        }
      );
    }
       getCustomerList() {

    const cust = new mm_customer();
    cust.cust_cd = 0;
    cust.brn_cd = this.sys.BranchCode;

    if (this.comsv.customerList === undefined || this.comsv.customerList === null || this.comsv.customerList.length === 0) {
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
        res => {
          //console.log(res)
          this.isLoading = false;
          this.comsv.customerList = res;
        },
        err => {
          this.isLoading = false;

        }
      );
    }
    else { this.isLoading = false; }
  }
  accClose(){
    this.comsv.accOpen=false
    this.comsv.accClose=true
    this.comsv.loanDis=false
    this.comsv.loanRec=false
    this.comsv.openDayBook=false
    this.comsv.openGlTrns=false
    this.router.navigate([this.sys.BankName + '/DR_OpenCloseReg']);

  }
  accOpen(){
    this.comsv.accOpen=true
    this.comsv.accClose=false
    this.comsv.loanDis=false
    this.comsv.loanRec=false
    this.comsv.openDayBook=false
    this.comsv.openGlTrns=false
    this.router.navigate([this.sys.BankName + '/DR_OpenCloseReg']);

  }
  loanDis(){
    this.comsv.accOpen=false
    this.comsv.accClose=false
    this.comsv.loanDis=true
    this.comsv.loanRec=false
    this.comsv.openDayBook=false
    this.comsv.openGlTrns=false
    this.router.navigate([this.sys.BankName + '/LR_DisNorm']);

  }
  loanRec(){
    this.comsv.accOpen=false
    this.comsv.accClose=false
    this.comsv.loanDis=false
    this.comsv.loanRec=true
    this.comsv.openDayBook=false
    this.comsv.openGlTrns=false
    this.router.navigate([this.sys.BankName + '/LR_RecRegNorm']);

  }
  openDayBook(){
    this.comsv.accOpen=false
    this.comsv.accClose=false
    this.comsv.loanDis=false
    this.comsv.loanRec=false
    this.comsv.openDayBook=true
    this.comsv.openGlTrns=false
    this.router.navigate([this.sys.BankName + '/FR_DayBook']);

  }
  openGlTrns(){
    this.comsv.accOpen=false
    this.comsv.accClose=false
    this.comsv.loanDis=false
    this.comsv.loanRec=false
    this.comsv.openDayBook=false
    this.comsv.openGlTrns=true
    this.router.navigate([this.sys.BankName + '/FR_GLTD']);

  }
  
  }

