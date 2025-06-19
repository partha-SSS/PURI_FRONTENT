import { Component, OnInit, ViewChild, TemplateRef, ElementRef,ChangeDetectorRef ,AfterViewInit} from '@angular/core';
import { RestService } from 'src/app/_service';
 
import { tt_cash_account, p_report_param, SystemValues } from 'src/app/bank-resolver/Models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { STRING_TYPE } from '@angular/compiler';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Utils from 'src/app/_utility/utils';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';
@Component({
  selector: 'app-weekly-return-new',
  templateUrl: './weekly-return-new.component.html',
  styleUrls: ['./weekly-return-new.component.css'],
  providers:[ExportAsService]
})
export class WeeklyReturnNewComponent {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
   
  @ViewChild('external') external: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['depo_part','depo_bal','depl_part','depl_bal',];
  filteredArray:any=[]
  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  notvalidate:boolean=false;
  date_msg:any;
  ibsd:any;
  surplus_deficit:any;
  exportAsConfig:ExportAsConfig;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  // bsInlineValue = new Date();
  pagedItems = [];
  reportData:any=[]
  dailyCash: tt_cash_account[] = [];
  prp = new p_report_param();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  ReportUrl: SafeResourceUrl;
  UrlString = '';
  alertMsg = '';
  fd: any;
  td: any;
  dt: any;
  fromdate: Date;
  todate: Date;
  called = 0;
  counter=0;
  itemsPerPage = 25;
  currentPage = 1;
  pageChange: any;
  crSum=0;
  drSum=0
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  tot1to7:number=0;
  tot1to4:number=0;
  lastdrAccCD:any;
  lastcrAccCD:any;
  today:any;
  weeklyReturn:any=[]
  weekly_Return_Liability:any[];
  weekly_Return_Asset:any[];
  weekly_Return_Revenue:any[];
  weekly_Return_expense:any[];
  groupedLiabilityData: any[] = [];
  groupedAssetData: any[] = [];
  groupedRevenueData: any[] = [];
  groupedExpenseData: any[] = [];
  
  totalLiabilityAmount: number = 0;
  totalAssetAmount: number = 0;
  totalRevenueAmount: number = 0;
  totalExpenseAmount: number = 0;

  constructor(private svc: RestService, private formBuilder: FormBuilder,
    private modalService: BsModalService, private _domSanitizer: DomSanitizer,private cd: ChangeDetectorRef,
    private exportAsService: ExportAsService,
    private router: Router,private comser:CommonServiceService) { }
  ngOnInit(): void {
    this.surplus_deficit=0.00;
    this.ibsd=0.00;
    this.weekly_Return_Liability= [
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 1,
                  "acc_type_srl": 1,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Recurring Deposit",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 2,
                  "acc_type_srl": 2,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Fixed Deposit",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 3,
                  "acc_type_srl": 3,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Cash Certificate",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 4,
                  "acc_type_srl": 4,
                  "acc_type_cd": 0,
                  "acc_type_desc": "TD with Re-Investment Plan",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 5,
                  "acc_type_srl": 5,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Flexi/ S.B. Deposit",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 6,
                  "acc_type_srl": 6,
                  "acc_type_cd": 0,
                  "acc_type_desc": "MIS",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 7,
                  "acc_type_srl": 7,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Any other Deposit",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 8,
                  "acc_type_srl": 8,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Overdraft availed against TD made with other bank",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 9,
                  "acc_type_srl": 9,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Overdraft availed against TD made with The WBSCARD Bank Ltd.",
                  "amount": 0.0
              }
          ]
     this.weekly_Return_Asset=[
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 1,
                  "acc_type_srl": 1,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Cash-In-Hand",
                  "amount": 82314.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 2,
                  "acc_type_srl": 2,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Cash in Current A/c",
                  "amount": 1317423.28
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 3,
                  "acc_type_srl": 3,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Cash in S.B. A/c",
                  "amount": -85373849.13
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 4,
                  "acc_type_srl": 4,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Cash in Flexi A/c",
                  "amount": 1404.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 5,
                  "acc_type_srl": 11,
                  "acc_type_cd": 0,
                  "acc_type_desc": "1.FD up to 365 days",
                  "amount": 2920000.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 5,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "2.FD over 1 Yr to 2 Yrs",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 5,
                  "acc_type_srl": 13,
                  "acc_type_cd": 0,
                  "acc_type_desc": "3.FD Over 2 Yrs to 3 Yrs",
                  "amount": 699196604.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 5,
                  "acc_type_srl": 14,
                  "acc_type_cd": 0,
                  "acc_type_desc": "4.FD Over 3 Yrs to 5 Yrs and above",
                  "amount": 124169480.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 5,
                  "acc_type_srl": 15,
                  "acc_type_cd": 0,
                  "acc_type_desc": "5.Other",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 8,
                  "acc_type_srl": 8,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Loan outstanding out of Deposit:",
                  "amount": 798697.0
              }
          ]
    this.weekly_Return_Revenue=[
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 11,
                  "acc_type_srl": 11,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Interest on Investment Against TD with WBSCARDB",
                  "amount": 13939646.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 11,
                  "acc_type_srl": 11,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Interest on Investment Against TD with others banks",
                  "amount": 31400154.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 11,
                  "acc_type_srl": 11,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Interest on Investment S.B. A/c",
                  "amount": 259779.86
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 11,
                  "acc_type_srl": 11,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Interest received on Loan",
                  "amount": 105913.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 12,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Bank Charge",
                  "amount": -3036.67
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 12,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Cost of Pass Book",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 12,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Miscellenious",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 12,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Nominal Membership Fees",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 12,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Penalty",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 12,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Sale of Forms",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 12,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Service Charge",
                  "amount": 0.0
              }
          ]
    this.weekly_Return_expense= [
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 12,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Interest Paid on Any other Deposit",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 12,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Interest Paid on Fixed/ Term Deposit",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 12,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Interest Paid on Flexi/ S.B. Deposit",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 12,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Interest Paid on MIS",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 12,
                  "acc_type_srl": 12,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Interest Paid on Recurring Deposit",
                  "amount": 0.0
              },
              {
                  "ardb_cd": null,
                  "brn_cd": null,
                  "srl_no": 13,
                  "acc_type_srl": 13,
                  "acc_type_cd": 0,
                  "acc_type_desc": "Any Other Expenses",
                  "amount": 3036.67
              }
          ]
      
  
    this.todate = this.sys.CurrentDate; // new Date(localStorage.getItem('__currentDate'));
    this.reportcriteria = this.formBuilder.group({
      todate: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
    var date = new Date();
// get the date as a string
   var n = date.toDateString();
// get the time as a string
   var time = date.toLocaleTimeString();
   this.today= n + " "+ time



  }

  // mergeRows(dataArray) {
  //   const mergedArray = [];
  //   let currentSrlNo = null;
  //   let rowspanCount = 1;

  //   dataArray.forEach((item, index) => {
  //     if (item.srl_no !== currentSrlNo) {
  //       if (currentSrlNo !== null) {
  //         mergedArray[mergedArray.length - rowspanCount].rowspan = rowspanCount;
  //         mergedArray[mergedArray.length - rowspanCount].showSrlNo = true;
  //       }

  //       currentSrlNo = item.srl_no;
  //       rowspanCount = 1;
  //       item.showSrlNo = false;
  //       mergedArray.push(item);
  //     } else {
  //       rowspanCount++;
  //       mergedArray.push(item);
  //     }
  //   });

  //   if (mergedArray.length > 0) {
  //     mergedArray[mergedArray.length - rowspanCount].rowspan = rowspanCount;
  //     mergedArray[mergedArray.length - rowspanCount].showSrlNo = true;
  //   }

  //   return mergedArray;
  // }

  // calculateTotal(dataArray) {
  //   return dataArray.reduce((total, item) => total + item.amount, 0);
  // }
  
  groupBySrlNo(dataArray: any[]) {
    const grouped = dataArray.reduce((acc, curr) => {
      const srl_no = curr.srl_no;
      if (!acc[srl_no]) {
        acc[srl_no] = { srl_no, data: [], subTotal: 0 };
      }
      acc[srl_no].data.push(curr);
      acc[srl_no].subTotal += curr.amount;
      return acc;
    }, {});

    return Object.values(grouped);
  }

  calculateTotalAmount(groupedData: any[]) {
    return groupedData.reduce((total, group) => total += group.subTotal, 0);
  }
  onLoadScreen(content) {
    this.notvalidate=false
    this.modalRef = this.modalService.show(content, this.config);
  }


  public SubmitReport() {
    this.ibsd=0;
      this.surplus_deficit=0;
      this.showAlert = false;
      this.isLoading=true;
      debugger
      this.reportData.length=0;
      this.pagedItems.length=0
      this.modalRef.hide()
      this.tot1to4=0;
      this.tot1to7=0;
      
      this.todate = this.reportcriteria.value.todate;
      var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "adt_dt":this.todate.toISOString()
      }
      this.svc.addUpdDel('Loan/WeeklyReturnNew',dt).subscribe(data=>{
      console.log(data)
      this.reportData=data
      
      if(this.reportData.length>0){
        this.ibsd=this.reportData[0]?.ibsd;
      this.surplus_deficit=this.reportData[0]?.surplus_deficit;
        this.weekly_Return_Liability=this.reportData[0]?.weekly_Return_Liability;
        this.weekly_Return_Asset=this.reportData[0]?.weekly_Return_Asset;
        this.weekly_Return_Revenue=this.reportData[0]?.weekly_Return_Revenue;
        this.weekly_Return_expense=this.reportData[0]?.weekly_Return_expense;
        debugger
        this.isLoading=false
        
   this.groupedLiabilityData = this.groupBySrlNo(this.weekly_Return_Liability);
   this.totalLiabilityAmount = this.calculateTotalAmount(this.groupedLiabilityData);
        // this.groupedLiabilityData.data
        for(let i=0;i<=7;i++){
          this.tot1to7+=this.groupedLiabilityData[i]?.subTotal
        }
   this.groupedAssetData = this.groupBySrlNo(this.weekly_Return_Asset);
   this.totalAssetAmount = this.calculateTotalAmount(this.groupedAssetData);
        for(let i=0;i<=4;i++){
          this.tot1to4+=this.groupedAssetData[i]?.subTotal
        }
   this.groupedRevenueData = this.groupBySrlNo(this.weekly_Return_Revenue);
   this.totalRevenueAmount = this.calculateTotalAmount(this.groupedRevenueData);

   this.groupedExpenseData = this.groupBySrlNo(this.weekly_Return_expense);
   this.totalExpenseAmount = this.calculateTotalAmount(this.groupedExpenseData);
    debugger    }
      if(this.reportData.length==0){
        this.comser.SnackBar_Nodata();
        this.isLoading=false;
      }
      
      // this.pageChange=document.getElementById('chngPage');
      // this.pageChange.click()
      // this.modalRef.hide();
      // this.setPage(2);
      // this.setPage(1)
      // this.crSum=0;
      // this.drSum=0
      this.reportData.forEach(e=>{
        // this.crSum+=e.cr_amt;
        // this.drSum+=e.dr_amt;
      })
      // this.lastcrAccCD=this.reportData[this.reportData.length-1].cr_acc_cd
      // this.lastdrAccCD=this.reportData[this.reportData.length-1].dr_acc_cd
      // this.setPage(1)
    },
    err => {
       this.isLoading = false;
       this.comser.SnackBar_Error(); 
      })
      
      
    }
  

  public closeAlert() {
    this.showAlert = false;
  }
 

 closeScreen() {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
 
 
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  downloadexcel(){
    this.exportAsConfig = {
      type: 'xlsx',
      // elementId: 'hiddenTab', 
      elementIdOrContent:'trial111'
    }
    this.exportAsService.save(this.exportAsConfig, 'WeeklyReturn').subscribe(() => {
      // save started
      console.log("hello")
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    // this.getTotal()
  }

}
