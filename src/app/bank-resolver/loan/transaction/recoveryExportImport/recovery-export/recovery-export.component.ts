import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SystemValues, mm_vill } from 'src/app/bank-resolver/Models';
import { ddsExport } from 'src/app/bank-resolver/Models/deposit/ddsExport';
import { getExportData } from 'src/app/bank-resolver/Models/deposit/getExportData';
import { RestService } from 'src/app/_service';
@Component({
  selector: 'app-recovery-export',
  templateUrl: './recovery-export.component.html',
  styleUrls: ['./recovery-export.component.css']
})
export class RecoveryExportComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  sys = new SystemValues();
  config = { keyboard: false, backdrop: true, ignoreBackdropClick: true ,class: 'modal-xl'};
  exportEntryForm: FormGroup;
  villEntryForm:FormGroup;
  showAlert = false;
  isLoading = false;
  alertMsg = '';
  selectTitle = true;
  fileUrl: any;
  getExportData: any;
  agentPass: any;
  agentCD: any;
  agentOpenDt: any;
  agentTableData: getExportData[];
  fileData: any;
  str = ''
  agentData: any;
  agentName: any;
  mType:any
  isType:boolean;
  blocks:any[]=[];
  typeName:any;
  villList:any[]=[];
  selectedvillList:any[]=[];
  villages:any=new mm_vill()
  constructor(private svc: RestService, private formBuilder: FormBuilder, private modalService: BsModalService, private router: Router) { }
  ngOnInit(): void {
    this.getAgentList();
    this.getBlock();
    this.getVillageMaster();
    this.exportEntryForm = this.formBuilder.group({
      // agent_id: [null, Validators.required],
      block_cd: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
    this.isType=true;
  }
  private getVillageMaster(): void {
    this.isLoading=true
    var dt = {
      "ardb_cd": this.sys.ardbCD,
    }
    this.svc.addUpdDel<any>('Mst/GetVillageMaster', dt).subscribe(
      res => {
        if(res){
          this.isLoading=false;
          console.log(res)
        this.villages = res;
        this.villages.sort((a,b) => (a.vill_name > b.vill_name) ? 1 : ((b.vill_name > a.vill_name) ? -1 : 0));
        }
        },
      err => { }
    );
  }
  getBlock(){
    var dt={"ardb_cd":this.sys.ardbCD}
    this.svc.addUpdDel<any>('Mst/GetBlockMaster', dt).subscribe(
      res => {
        this.blocks=res;
        this.blocks = this.blocks.sort((a, b) => (a.block_name > b.block_name) ? 1 : -1);
      })
  }
  private onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  getFilterVill(){
    this.villList=[];
    this.villages.forEach(e => {
      if(e.block_cd==this.exportEntryForm.controls.block_cd.value){
        this.villList.push(e)
      }
    });
  }
  getAgentList() {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode
    }
    this.svc.addUpdDel('Deposit/GetAgentData', dt).subscribe(data => this.agentData = data)
  }
  allTrades(event) {
    const checked = event.target.checked;
    if(checked)
    this.villList.forEach(item => item.trf_flg = "Y");
    else
    this.villList.forEach(item => item.trf_flg = "N");
  }
  changeTradesByCategory(event) {
    if (this.villList[event].trf_flg=="Y")
      this.villList[event].trf_flg="N";
    else
    this.villList[event].trf_flg="Y";
  debugger
  }
  exportAsTxt() {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      // "brn_cd": this.sys.BranchCode,
      "agent_cd": this.exportEntryForm.controls.block_cd.value,
      "machine_type": "N"
    }
    this.svc.addUpdDel('Loan/GetLoanDataForFile', dt).subscribe(data => {
      this.fileData = data;
      debugger
      for (let i = 0; i < this.fileData.length; i++)
        this.str = this.str + this.fileData[i] + '\n'
      let fileDt = this.str;
      const file = new Blob([fileDt], { type: 'text/json' });
      var file_name = 'pctx.txt';
      let newLink = document.createElement('a');
      newLink.download = file_name;
      const fileURL = URL.createObjectURL(file);
      newLink.href = fileURL;
      newLink.click();
      this.str = ''
    })
    this.isType=true;
  }
  get entry() { return this.exportEntryForm.controls }
  public SubmitReport() {
    this.isLoading = true
    this.villList.forEach(p=>{
      if(p.trf_flg && p.trf_flg=='Y'){
        this.selectedvillList.push(p)
      }
    })
    debugger
    this.svc.addUpdDel<any>('Loan/InsertLoanVillExportData', this.selectedvillList).subscribe(data => {
      if(data!=0){
        this.isLoading = false;
        this.showAlert = true;
        this.alertMsg = 'Village not import';
        return false;
      }
      else{
        this.isLoading = true
      
        var ddsExp = new ddsExport()
        ddsExp.ardb_cd = this.sys.ardbCD;
        ddsExp.agent_cd = this.exportEntryForm.controls.block_cd.value;
        // ddsExp.machine_type = "N";
        // ddsExp.agent_name = this.agentData.filter(x => x.agent_cd == this.entry.agent_id.value)[0].agent_name
        this.svc.addUpdDel('Loan/GetExportLoanData', ddsExp).subscribe(data => {
          this.getExportData = data;
        this.isLoading = false;

          debugger
          // this.getExportData.forEach(x => x.interest = '.0' + x.interest)
          // this.getExportData.forEach(x => x.curr_bal_amt = '000' + x.curr_bal_amt)
          // this.getExportData.forEach(x => x.balance_amt = '000' + x.balance_amt)
          this.getExportData.forEach(x => {
            console.log(x.curr_bal_amt.toString().length)
            x.password=this.villages.filter(e=>e.vill_cd==x.vill_cd)[0].vill_name
              if(x.curr_bal_amt.toString().length==0){
                x.curr_bal_amt = '000000' + x.curr_bal_amt
              }
              else if(x.curr_bal_amt.toString().length==1){
                x.curr_bal_amt = '00000' + x.curr_bal_amt
              }
              else if(x.curr_bal_amt.toString().length==2){
                x.curr_bal_amt = '000' + x.curr_bal_amt
              }
              else if(x.curr_bal_amt.toString().length==3){
                x.curr_bal_amt = '000' + x.curr_bal_amt
              }
              else if(x.curr_bal_amt.toString().length==4){
                x.curr_bal_amt = '00' + x.curr_bal_amt
              }
              else if(x.curr_bal_amt.toString().length==5){
                x.curr_bal_amt = '0' + x.curr_bal_amt
              }
              else{
                x.curr_bal_amt = x.curr_bal_amt
              }
            
          })
          this.agentPass = this.getExportData[0]?.password
          this.agentCD = this.getExportData[0]?.agent_cd
          this.agentOpenDt = this.getExportData[0]?.opening_dt
          this.agentName = this.blocks.filter(e=>e.block_cd==this.exportEntryForm.controls.block_cd.value)[0].block_name
        })
        this.modalRef.hide();
      
      }
    })
    
  }
  public closeAlert() { this.showAlert = false; }
  closeScreen() { this.router.navigate([this.sys.BankName + '/la']); }
  exportFormat(e:any){
    this.mType=document.getElementById(e.target.id)
    this.mType=this.mType.value
    this.isType=false
  }
}
