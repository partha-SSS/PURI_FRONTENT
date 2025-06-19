import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild, Renderer2 } from '@angular/core';
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
import { MatTable } from '@angular/material/table';
import { CommonServiceService } from 'src/app/bank-resolver/common-service.service';

export interface PeriodicElement {
  name: any;
  position: any;
  weight: any;
  symbol: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('content1', { static: true }) content1: ElementRef<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {read: ElementRef} ) private matTableRef: ElementRef;

  modalRef: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
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
  today:any;
  fromdate: Date;
  resultLength=0
  pressed = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  asOnDate:string;
  resizableMousemove: () => void;
  resizableMouseup: () => void;
  columns: any[] = [
    { field: 'UCIC', width: 20,  },
    { field: 'Name', width: 20, },
    { field: 'Guardian_Name', width: 20, },
    { field: 'Address', width: 20, },
    { field: 'Phone', width: 20, },
    { field: 'Gender', width: 20, },
    { field: 'Caste', width: 20, },
    { field: 'Community', width: 20, },
    { field: 'Category', width: 20, },
  ];
  displayedColumns: string[] = ['SLNO','UCIC', 'Name', 'Guardian_Name', 'Address','Phone','Gender','Caste','Community','Category'];
  dataSource = new MatTableDataSource()
  constructor(private svc: RestService, 
    private formBuilder: FormBuilder,
    private exportAsService: ExportAsService, 
    private cd: ChangeDetectorRef, private comSer:CommonServiceService,
    private modalService: BsModalService,  private renderer: Renderer2,private _domSanitizer: DomSanitizer, private router: Router) { }
  ngOnInit(): void {
    this.fromdate = this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required]
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.onLoadScreen(this.content);
    // this.SubmitReport()
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();
    this.today= n + " "+ time
  }
  setPage(page: number) {
    this.currentPage = page;
    this.cd.detectChanges();
  }
  onLoadScreen(content) {
  
    this.modalRef = this.modalService.show(content, this.config);
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedItems = this.reportData.slice(startItem, endItem); //Retrieve items for page
    this.cd.detectChanges();
  }
  formatDate(date: Date): string {
    // Get the day, month, and year
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month starts from 0
    const year = date.getFullYear();

    // Pad single digit day and month with zero
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    // Format the date as dd/mm/yyyy
    return `${formattedDay}/${formattedMonth}/${year}`;
}
  public SubmitReport() {
    // const inputDateString = this.fromdate;
    const inputDate = this.reportcriteria.controls.fromDate.value;
    const formattedDate = this.formatDate(inputDate);
    this.asOnDate=formattedDate
    console.log(formattedDate);
    this.modalRef.hide();
    this.fromdate = this.reportcriteria.controls.fromDate.value;
    var dt={
        "ardb_cd":this.sys.ardbCD,
        "brn_cd":this.sys.BranchCode,
        "cust_dt":this.fromdate.toISOString()
    }
      this.isLoading=true
      this.showAlert = false;
      this.svc.addUpdDel('UCIC/GetMemberDtls',dt).subscribe(data=>{console.log(data)
        this.reportData=data 
        if(!this.reportData){
          this.comSer.SnackBar_Nodata()
          this.isLoading=false
        } 
        this.dataSource.data=this.reportData
        // for(let i=0;i<50;i++)
        // this.dataSource.data.push(this.reportData)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.resultLength=this.reportData.length
        this.itemsPerPage=this.reportData.length % 50 <=0 ? this.reportData.length: this.reportData.length % 50
        if(this.reportData.length<50){
          this.pagedItems=this.reportData
        }
        this.isLoading=false
        this.pageChange=document.getElementById('chngPage');
        this.pageChange.click()
        this.setPage(2);
        this.setPage(1)
      },
      err => {
         this.isLoading = false;
         this.comSer.SnackBar_Error(); 
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

  var data = document.getElementById('hiddenTab');
  html2canvas(data).then(canvas => {
    var imgWidth = 208;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf('p', 'mm', 'a4');
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    pdf.save('newPDF.pdf');
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
setTableResize(tableWidth: number) {
  let totWidth = 0;
  this.columns.forEach(( column) => {
    totWidth += column.width;
  });
  const scale = (tableWidth - 5) / totWidth;
  this.columns.forEach(( column) => {
    column.width *= scale;
    this.setColumnWidth(column);
  });
}

setDisplayedColumns() {
  this.columns.forEach(( column, index) => {
    column.index = index;
    this.displayedColumns[index] = column.field;
  });
}

onResizeColumn(event: any, index: number) {
  console.log(event.target.parentElement);
  this.checkResizing(event, index);
  this.currentResizeIndex = index;
  this.pressed = true;
  this.startX = event.pageX;
  this.startWidth = event.target.parentElement.clientWidth;
  event.preventDefault();
  this.mouseMove(index);
}

private checkResizing(event, index) {
  const cellData = this.getCellData(index);
  if ( ( index === 0 ) || ( Math.abs(event.pageX - cellData.right) < cellData.width / 2 &&  index !== this.columns.length - 1 ) ) {
    this.isResizingRight = true;
  } else {
    this.isResizingRight = false;
  }
}

private getCellData(index: number) {
  const headerRow = this.matTableRef.nativeElement.children[0].querySelector('tr');
  const cell = headerRow.children[index];
  return cell.getBoundingClientRect();
}

mouseMove(index: number) {
  this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
    if (this.pressed && event.buttons ) {
      const dx = (this.isResizingRight) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
      const width = this.startWidth + dx;
      if ( this.currentResizeIndex === index && width > 50 ) {
        this.setColumnWidthChanges(index, width);
      }
    }
  });
  this.resizableMouseup = this.renderer.listen('document', 'mouseup', (event) => {
    if (this.pressed) {
      this.pressed = false;
      this.currentResizeIndex = -1;
      this.resizableMousemove();
      this.resizableMouseup();
    }
  });
}

setColumnWidthChanges(index: number, width: number) {
  const orgWidth = this.columns[index].width;
  const dx = width - orgWidth;
  if ( dx !== 0 ) {
    const j = ( this.isResizingRight ) ? index + 1 : index - 1;
    const newWidth = this.columns[j].width - dx;
    if ( newWidth > 50 ) {
        this.columns[index].width = width;
        this.setColumnWidth(this.columns[index]);
        this.columns[j].width = newWidth;
        this.setColumnWidth(this.columns[j]);
      }
  }
}
downloadexcel(){
  this.exportAsConfig = {
    type: 'xlsx',
    // elementId: 'hiddenTab', 
    elementIdOrContent:'mattable'
  }
  this.exportAsService.save(this.exportAsConfig, 'MemberList').subscribe(() => {
    // save started
    console.log("hello")
  });
}
setColumnWidth(column: any) {
  const columnEls = Array.from( document.getElementsByClassName('mat-column-' + column.field) );
  columnEls.forEach(( el: HTMLDivElement ) => {
    el.style.width = column.width + 'px';
  });
}

@HostListener('window:resize', ['$event'])
onResize(event) {
  this.setTableResize(this.matTableRef.nativeElement.clientWidth);
}
}
