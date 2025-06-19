import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { p_report_param, SystemValues } from '../../../Models';
import { T_VOUCHER_NARRATION } from '../../../Models/T_VOUCHER_NARRATION';
import { RestService } from 'src/app/_service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
// import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import html2pdf from 'html2pdf.js';
// import jsPDF from 'jspdf';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-gl-wise-voucher-dtls',
  templateUrl: './gl-wise-voucher-dtls.component.html',
  styleUrls: ['./gl-wise-voucher-dtls.component.css']
})
export class GlWiseVoucherDtlsComponent {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('contentSearch', { static: true }) contentSearch: TemplateRef<any>;
  @ViewChild('reportcontent') reportcontent: ElementRef;
  selectedFilter = 'B';
  modalRef: BsModalRef;
  modalRefSearch: BsModalRef;
  isOpenFromDp = false;
  isOpenToDp = false;
  k=0
  redFlag:any=[]
  sys = new SystemValues();
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };
  prp =new p_report_param();
  tvn:  T_VOUCHER_NARRATION[]=[];
  tvn1:  T_VOUCHER_NARRATION[]=[];
  reportcriteria: FormGroup;
  searchcriteria: FormGroup;
  closeResult = '';
  showReport = false;
  showAlert = false;
  alertMsg = '';
  fromdate: Date;
  todate:Date;
  isLoading = false;
  crSum=0;
  drSum=0;
  nullVD:number;
  RedVoucher:any;
  showTopButton = false;
  ardbName:any;
  branchName:any;
  today:any;
  constructor(private svc: RestService,private formBuilder: FormBuilder,
     private modalService: BsModalService,
     private router: Router) { }

  ngOnInit(): void {
    this.ardbName=localStorage.getItem('ardb_name')
    this.branchName=this.sys.BranchName;
    this.fromdate=this.sys.CurrentDate;
    this.todate=this.sys.CurrentDate;
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
    this.searchcriteria=this.formBuilder.group({
      searchText:[null],
      searchDate:[null]
    })
    this.onLoadScreen(this.content);
      var date = new Date();
      var n = date.toDateString();
      var time = date.toLocaleTimeString();
      this.today= n + " "+ time
  }
  scrollToBotom(){
    window.scrollTo({  top:document.body.scrollHeight, behavior: 'smooth' }); // Smooth scroll to top

  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
  }
  private onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  onLoadSearch(contentSearch){
    this.modalRefSearch=this.modalService.show(contentSearch,this.config)

  }
  retrieve(){
    this.onLoadScreen(this.content)
  }
  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }
  public closeAlert() {
    this.showAlert = false;
    this.modalRefSearch.hide()
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.tvn.filter = filterValue.trim().toLowerCase()
    this.tvn = this.tvn1.filter(transaction => 
      transaction.brn_cd.includes(filterValue)
    );
  }
  public SubmitReport() {
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = "Invalid Input.";
      return false;
    }
    else if (new Date(this.reportcriteria.value['fromDate']) > new Date(this.reportcriteria.value['toDate'])) {
      this.showAlert = true;
      this.alertMsg = "To Date cannot be greater than From Date!";
      return false;
    }
    else {
      this.showAlert = false;
      this.fromdate=this.reportcriteria.value['fromDate'];
      this.todate=this.reportcriteria.value['toDate'];
      this.getmVoucherDetails();
      // this.modalService.dismissAll(this.content);
    }
  }
  
  onFilterChange(event:any){
    this.selectedFilter = event.value;
    if (this.selectedFilter != 'B') {
      this.tvn=this.tvn1.filter(voucher => voucher.voucher_typ === this.selectedFilter);
    }
    else{
      this.tvn=this.tvn1
    }

  }
  private getmVoucherDetails(): void {
    this.prp.brn_cd=localStorage.getItem('__brnCd');
    this.prp.from_dt= this.fromdate;
    this.prp.to_dt=this.todate;
    this.prp.ardb_cd=this.sys.ardbCD
    this.isLoading=true;
    this.svc.addUpdDel<any>('Voucher/GetTVoucherDtlsForPrint', this.prp).subscribe(
      res => {
        ;
        this.tvn = res;
        this.tvn1 = res;
        console.log(this.tvn)
        debugger
        for (let x = 0; x < this.tvn.length; x++) {
          const dt=this.tvn[x].vd
         this.tvn[x].vd= this.tvn[x].vd.sort((a, b) => (a.debit_credit_flag < b.debit_credit_flag ? 1 : -1))//(a.acc_cd < b.acc_cd ? -1 : 1))
         if(this.tvn[x].vd.length==0){
          this.nullVD=x
          debugger
          // this.nullVD=this.tvn.length
          this.tvn.splice(this.nullVD, 1)
          }
          else{
            debugger
            for (let y = 0; y <dt.length; y++){
              dt[0].ardb_cd+=dt[y].dr_amount
              dt[0].brn_cd+=dt[y].cr_amount
            }
            debugger
          }
        }
        console.log(this.nullVD);
        
        
        
        for (let x = 0; x < this.tvn.length; x++) {
          this.tvn[x].voucher_dt= this.convertDate(this.tvn[x].voucher_dt.toString());
          this.tvn[x].narration= this.tvn[x].narration.replace('/','');
          
        }
        for (let x = 0; x < this.tvn.length; x++) {
          this.crSum=0;
          this.drSum=0;
          this.tvn[x].vd.forEach(e=>{this.drSum+=e.dr_amount ;  this.crSum+=e.cr_amount})
          
          
          if(this.crSum!==this.drSum){
            
            this.tvn[x].redFlag=true
            
            console.log(this.drSum, this.crSum, this.RedVoucher);
          }
          else{
            this.tvn[x].redFlag=false

          }
          
        this.redFlag=[]
        this.redFlag=this.tvn[x].vd
        
        }
        console.log(this.redFlag)


        this.tvn = this.tvn.sort((a , b) => (a.voucher_id < b.voucher_id ? -1 : 1));
        this.isLoading=false;
        this.modalRef.hide();
      },
      err => { this.modalRef.hide();}
    );
  }
  private  convertDate(datestring:string):Date
{
var parts = datestring.match(/(\d+)/g);
// new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
//return new Date(year, month, day);
}

  //   public downloadPDF() {
  //   ;
  //   let content = this.reportcontent.nativeElement;
  //   let doc = new jsPDF();
  //   let _elementHandlers =
  //   {
  //     '#editor': function (element, renderer) {
  //       return true;
  //     }
  //   };
  //   doc.fromHTML(content.innerHTML, 30, 30, {

  //     'width': 250,
  //     'elementHandlers': _elementHandlers
  //   });
  //   doc.save("VoucherPrint.pdf");
  // }

  // public downloadPDF () {
  //   ;
  //   {
  //     // download the file using old school javascript method
  //     this.exportAsService.save(this.exportAsConfig, 'VoucherPrint').subscribe(() => {
  //       // save started
  //     });
  //     // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
  //    // this.exportAsService.get(this.config).subscribe(content => {
  //    //   console.log(content);
  //    // });
  //   }
  // }

  // public downloadPDF() {
  //   const option = {
  //     name: 'VoucherPrint.pdf',
  //     image: { type: 'jpeg' },
  //     html2pdf: {},
  //     jsPDF: { orientation: 'portrait' }
  //   }
  //   const element: Element = document.getElementById('reportcontent');

  //   html2pdf()
  //     .from(element)
  //     .set(option)
  //     .save()
  // }
  public downloadPDF() {
  var element = document.getElementById('reportcontent');
  console.log(element)
  var option = {
margin:       0,
filename:     'Voucher_'+this.fromdate.toString()+'.pdf',
image:        { type: 'jpeg', quality: 0.98 },
html2canvas:  { scale:1},
jsPDF:        { unit: 'mm', format: 'a4', orientation: 'p' }
};
html2pdf()
       .from(element)
       .set(option)
       .save()
  }
 public FormatNumber(num) {
  try {
      return parseFloat(num).toFixed(2);
  } catch (error) {
      return 0;
  }
}
closeScreen()
{
  this.router.navigate([localStorage.getItem('__bName') + '/la']);
}
submitSearch(){
 
  if(this.searchcriteria.controls.searchText.value && this.searchcriteria.controls.searchDate.value)
  {
  this.tvn=this.tvn1.filter(e=>e.voucher_id.toString()==this.searchcriteria.controls.searchText.value)
  debugger
}
  else if(!this.searchcriteria.controls.searchText.value && this.searchcriteria.controls.searchDate.value){
   this.tvn=this.tvn1.filter(e=>e.voucher_dt.toString().substring(0,10)==this.searchcriteria.controls.searchDate.value.toString().substring(0,10))
  console.log(this.tvn1[0].voucher_dt,this.searchcriteria.controls.searchDate.value)
  }
  // else if(this.searchcriteria.controls.searchText.value && !this.searchcriteria.controls.searchDate.value)
  // {
  //   this.tvn=this.tvn1.filter(e=>e.voucher_dt.toString().substring(0,10)==this.searchcriteria.controls.searchDate.value.toString().substring(0,10) && e.voucher_id.toString().includes(this.searchcriteria.controls.searchText.value))
  //   console.log(this.tvn1[0].voucher_dt,this.searchcriteria.controls.searchDate.value)
  // }
  
  this.modalRefSearch.hide()
  console.log(this.tvn1)
}
topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
scrollFunction() {
  let mybutton = document.getElementById("myBtn");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
}
