import { SystemValues } from './../../../Models/SystemValues';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RestService } from 'src/app/_service';

import { tt_cash_account, p_report_param } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';


@Component({
  selector: 'app-trading-acc',
  templateUrl: './trading-acc.component.html',
  styleUrls: ['./trading-acc.component.css']
})
export class TradingAccComponent implements OnInit {

  @ViewChild('content', { static: true }) content: TemplateRef<any>;

  // ReportUrl :SafeResourceUrl;
  // UrlString:string ="http://localhost:63011/"
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  // UrlString = 'https://sssbanking.ufcsl.in/Report/DayBookViewer?';
  // UrlString = 'https://sssbanking.ufcsl.in/Report/DayBookViewer?brn_cd=101&from_dt=20/01/2019&to_dt=31/03/2021&acc_cd=28101';
  // Modal configuration
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  bsInlineValue = new Date();
  maxDate = new Date();
  dailyCash: tt_cash_account[] = [];
  prp = new p_report_param();
  sys = new SystemValues();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  isLoading = false;
  counter=0;
  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer
    // private modalService: NgbModal,
    , private router: Router) { }
  ngOnInit(): void {

    this.fromdate = this.sys.CurrentDate; // new Date(localStorage.getItem('__currentDate'));
    this.todate = this.sys.CurrentDate; // new Date(localStorage.getItem('__currentDate'));
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }



  private onLoadScreen(content) {

    this.modalRef = this.modalService.show(content, this.config);
  }


  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else if (new Date(this.reportcriteria.value.fromDate) > new Date(this.reportcriteria.value.toDate)) {
      this.showAlert = true;
      this.alertMsg = 'To Date cannot be greater than From Date!';
      return false;
    }
    else {
      this.showAlert = false;
      this.fromdate = this.reportcriteria.value.fromDate;
      this.todate = this.reportcriteria.value.toDate;
      // this.isLoading = true;
      // this.onReportComplete();
      // this.modalService.dismissAll(this.content);
      this.UrlString = this.svc.getReportUrl();
      this.UrlString = this.UrlString + 'WebForm/Fin/tradingac?' + 'ardb_cd=' + this.sys.ardbCD + '&brn_cd='
        + this.sys.BranchCode + '&from_dt=' + Utils.convertDtToString(this.fromdate)
        + '&to_dt=' + Utils.convertDtToString(this.todate);
      this.isLoading = true;
      this.ReportUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.UrlString);
      // this.modalRef.hide();
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 3000);
    }
  }
  public oniframeLoad(): void {
    this.counter++;
    if(this.counter==2){
      this.isLoading=false;
      this.counter=0
    }
    else{
      this.isLoading=true
    }
    this.modalRef.hide();
  }

  public closeAlert() {
    this.showAlert = false;
  }

  closeScreen() {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }



}
