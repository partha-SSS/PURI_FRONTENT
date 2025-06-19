import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { RestService } from 'src/app/_service';
 
import {  p_report_param, SystemValues, tt_gl_trans } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
import { m_branch } from 'src/app/bank-resolver/Models/m_branch';
@Component({
  selector: 'app-conso-cash-acc-new',
  templateUrl: './conso-cash-acc-new.component.html',
  styleUrls: ['./conso-cash-acc-new.component.css'],
  providers:[ExportAsService]
})
export class ConsoCashAccNewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  displayedColumns: string[] = ['acc_cd','acc_name','acc_cd2'];
  // ,'loan_id','cust_name','curr_prn_recov', 'ovd_prn_recov','adv_prn_recov','curr_intt_recov','ovd_intt_recov','penal_intt_recov','recov_amt','last_intt_calc_dt'
  dataSource = new MatTableDataSource()
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  notvalidate:boolean=false;
  date_msg:any;
  brnDtls:any = [];
  openingBal:any
  closingBal:any
  prp = new p_report_param();
  reportcriteria: FormGroup;
  showReport = false;
  showAlert = false;
  isLoading = false;
  counter=0
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  toDate: Date;
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  reportData2:any=[]

  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
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
  lastAccNum:any
  totdrSum=0;
  totcrSum=0;
  loanNm:any;
  
  filteredArray:any=[]
  resultLength=0;
  LandingCall:boolean;
  constructor(private comser:CommonServiceService, private svc: RestService, private formBuilder: FormBuilder,private exportAsService: ExportAsService, private cd: ChangeDetectorRef,private modalService: BsModalService, private _domSanitizer: DomSanitizer,private router: Router) { }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fromdate = this.sys.CurrentDate;
    this.toDate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      // acc_type_cd: [null, Validators.required]
    });
    if(this.comser.loanRec){
      this.LandingCall=true;
      this.SubmitReport();
    }
    else{
      this.LandingCall=false;
      this.onLoadScreen(this.content);
    }
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today= n + " "+ time
  }
  GetBranchMaster() {
    var dt = { "ardb_cd": this.sys.ardbCD };
    console.log(dt)
    this.svc.addUpdDel('Mst/GetBranchMaster', dt).subscribe(
      res => {
        console.log(res)
        // this.isLoading = false;
        this.brnDtls = res;
      },
      err => { 
        // this.isLoading = false;
       }
    );
  }
  public closeAlert() {
    this.showAlert = false;
  }
  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  onLoadScreen(content) {
    this.notvalidate=false
    this.modalRef = this.modalService.show(content, this.config);
  }
  SubmitReport(){
    this.GetBranchMaster()

    this.comser.getDay(this.reportcriteria.controls.fromDate.value,this.reportcriteria.controls.toDate.value)
    if(this.comser.diff<0){
      this.date_msg= this.comser.date_msg
      this.notvalidate=true
    }

    else {
      this.totdrSum=0;
      this.totcrSum=0;
      this.modalRef.hide();
      this.reportData.length=0;
      this.pagedItems.length=0;
      this.isLoading=true;
      // this.loanNm=this.AcctTypes.filter(e=>e.acc_type_cd==this.reportcriteria.controls.acc_type_cd.value)[0].acc_type_desc
      // console.log(this.loanNm)
      this.fromdate = this.reportcriteria.controls.fromDate.value;
      this.toDate = this.reportcriteria.controls.toDate.value;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "ad_cash_acc_cd":'21101',
        "from_dt":this.fromdate.toISOString(),
        "to_dt":this.toDate.toISOString(),
        // "acc_cd":this.reportcriteria.controls.acc_type_cd.value,
      }
      
      this.svc.addUpdDel('Finance/PopulateDailyCashAccountConsoNew',dt).subscribe(data=>{console.log(data)
        this.reportData=data
        this.reportData2=data;
        debugger
        if(this.reportData.length==0){
          this.comser.SnackBar_Nodata()
        } 
        if(this.reportData.length>0){
          this.isLoading=false;
        } 
          for(let i=0;i<this.reportData2.length;i++){
          this.totdrSum+=this.reportData2[i].acccashaccount.tot_dr_amt
          this.totcrSum+=this.reportData2[i].acccashaccount.tot_cr_amt
          }
          // this.totpenalInttSum+=this.reportData[i].acctype.tot_acc_penal_intt_recov
          // this.totcurrPrnSum+=this.reportData[i].acctype.tot_acc_curr_prn_recov
          // this.totovdPrnSum+=this.reportData[i].acctype.tot_acc_ovd_prn_recov
          // this.totadvPrnSum+=this.reportData[i].acctype.tot_acc_adv_prn_recov
          // this.totPrn+=this.reportData[i].acctype.tot_acc_recov
          
          // this.totcurrInttSum,this.totpenalInttSum,this.totcurrPrnSum, this.totovdPrnSum,this.totadvPrnSum,this.totPrn
          
    // }this.isLoading=false
        
        for(let j=0;j<this.reportData.length;j++){
          for(let k=0;k<this.reportData[j].cashaccount.length;k++){
            for(let i=0;i<this.brnDtls.length;i++){
            if(this.reportData[j].cashaccount[k].brn_cd==this.brnDtls[i].brn_cd){
              this.reportData[j].cashaccount[k].cr_particulars=this.brnDtls[i].brn_name
            }
           }
           }
        }
        for(let o=0;o<this.reportData.length;o++){
          if(this.reportData[o].acccashaccount.acc_cd==21101&&this.reportData[o].acccashaccount.acc_name=="Opening Balance"){
            this.openingBal=this.reportData.splice([o], 1)
            debugger
           }
        }
        for(let p=0;p<this.reportData.length;p++){
          if(this.reportData[p].acccashaccount.acc_cd==21101&&this.reportData[p].acccashaccount.acc_name=="Closing Balance"){
            this.closingBal=this.reportData.splice([p], 1)
            debugger
           }
        }

        this.reportData.unshift(this.openingBal[0])
        this.reportData.push(this.closingBal[0])
        debugger
        this.dataSource.data=this.reportData
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.resultLength=this.reportData.length
        
        
      }),
      err => {
         this.isLoading = false;
         this.comser.SnackBar_Error(); 
        }
   }
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'mattable'
    }
    this.exportAsService.save(this.exportAsConfig, 'ConsoTrial').subscribe(() => {
      // save started
      console.log("hello")
    });
  }

}
