import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SystemValues, p_report_param, mm_customer } from 'src/app/bank-resolver/Models';
import { RestService } from 'src/app/_service';
import { PageChangedEvent } from "ngx-bootstrap/pagination/public_api";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as'
import html2canvas from 'html2canvas';  
import html2pdf from 'html2pdf.js';
import jspdf from 'jspdf';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';

@Component({
  selector: 'app-locker-details',
  templateUrl: './locker-details.component.html',
  styleUrls: ['./locker-details.component.css']
})
export class LockerDetailsComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  reportcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  isLoading = false;
  alertMsg = '';
  exportAsConfig:ExportAsConfig;
  itemsPerPage = 50;
  currentPage = 1;
  pagedItems = [];
  reportData:any=[]
  ardbName=localStorage.getItem('ardb_name')
  branchName=this.sys.BranchName
  pageChange: any;
  today:any
  
  displayedColumns: string[] = ['SLNO','locker_id', 'agreement_no', 'key_no', 'name','locker_type','locker_status','rented_till'];
  dataSource = new MatTableDataSource()
  constructor(private svc: RestService,
    private exportAsService: ExportAsService, 
    private cd: ChangeDetectorRef, private comser:CommonServiceService,  private renderer: Renderer2,private _domSanitizer: DomSanitizer, private router: Router) { }
  ngOnInit(): void {
    this.SubmitReport()
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today= n + " "+ time
  }
  
  
  public SubmitReport() {
    var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
    }
      this.isLoading=true
      this.showAlert = false;
      this.svc.addUpdDel('Locker/PopulateLockerDtlsRep',dt).subscribe(data=>{console.log(data)
        this.reportData=data 
        debugger
        if(this.reportData.length==0){
          this.comser.SnackBar_Nodata()
        } 
        this.dataSource.data=this.reportData
       
        this.isLoading=false
        
      },
      err => {
         this.isLoading = false;
         this.comser.SnackBar_Error(); 
        }
)
    }
    public closeAlert() {
    this.showAlert = false;
  }
  closeScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  public downloadPDF() {
  // var element = document.getElementById('hiddenTab');
  // console.log(element)
  // var option = {
  // margin:       0,
  // filename:     'MemberList.pdf',
  // image:        { type: 'jpeg', quality: 0.98 },
  // html2canvas:  { scale:1},
  // jsPDF:        { unit: 'mm', format: 'a4', orientation: 'p' }
  // };
  // html2pdf()
  //        .from(element)
  //        .set(option)
  //        .save()

  var data = document.getElementById('mattable');
  html2canvas(data).then(canvas => {
    var imgWidth = 208;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf('p', 'mm', 'a4');
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    pdf.save('LockerDtls.pdf');
  });

  

  // const doc = new jsPDF();

  // const specialElementHandlers = {
  //   '#editor': function (element, renderer) {
  //     return true;
  //   }
  // };

  // const content = this.content1.nativeElement;

  // doc.fromHTML(content.innerHTML, 1000, 1000, {
  //   width: 190,
  //   'elementHandlers': specialElementHandlers
  // });
  // doc.save('test.pdf');
}
applyFilter(event: Event) {
  console.log(event)
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}
downloadexcel(){
  this.exportAsConfig = {
    type: 'xlsx',
    // elementId: 'hiddenTab', 
    elementIdOrContent:'mattable'
  }
  this.exportAsService.save(this.exportAsConfig, 'LockerDtls').subscribe(() => {
    // save started
    console.log("hello")
  });
}



}
