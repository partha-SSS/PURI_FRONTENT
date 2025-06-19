import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MessageType, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { ddsExport } from 'src/app/bank-resolver/Models/deposit/ddsExport';
import { RestService } from 'src/app/_service';
@Component({
  selector: 'app-recovery-import',
  templateUrl: './recovery-import.component.html',
  styleUrls: ['./recovery-import.component.css']
})
export class RecoveryImportComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  modalRef: BsModalRef;
  btnForImport: any
  sys = new SystemValues();
  config = { keyboard: false, backdrop: true, ignoreBackdropClick: true };
  importEntryForm: FormGroup;
  showAlert = false;
  isLoading = false;
  alertMsg = '';
  getImportData: any;;
  agentCD: any;
  agentData: any;
  myFile: any;
  node: any;
  flag = 1;
  showMsg: ShowMessage;
  totAmt = 0;
  mType: any;
  blocks:any[]=[]
  lastrow:any[]=[]
  constructor(private svc: RestService, private formBuilder: FormBuilder, private modalService: BsModalService, private router: Router) { }
  ngOnInit(): void {
    this.getBlock()
    this.importEntryForm = this.formBuilder.group({
      block_cd: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
  }
  private onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  getBlock(){
    var dt={"ardb_cd":this.sys.ardbCD}
    this.svc.addUpdDel<any>('Mst/GetBlockMaster', dt).subscribe(
      res => {
        this.blocks=res;
        this.blocks = this.blocks.sort((a, b) => (a.block_name > b.block_name) ? 1 : -1);
      })
  }
  getAgentList() {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode
    }
    this.svc.addUpdDel('Deposit/GetAgentData', dt).subscribe(data => this.agentData = data)
  }
  importAsTxt() {
    this.isLoading = true;
    // var d = {
    //   "ardb_cd": this.sys.ardbCD,
    //   "brn_cd": this.sys.BranchCode,
    //   "block_cd": this.importEntryForm.controls.block_cd.value,
    //   "trans_dt": this.sys.CurrentDate,
    //   "trans_amt": this.totAmt
    // }
    // console.log(d);
    // this.svc.addUpdDel('Deposit/CheckDuplicateAgentData', d).subscribe(isDuplicate => {
    //   console.log(isDuplicate)
    //   if (!isDuplicate) {
        var dt = {
          "ardb_cd": this.sys.ardbCD,
          "brn_cd": this.sys.BranchCode,
          "block_cd": this.importEntryForm.controls.block_cd.value,
          "user_id": this.sys.UserId,
          "machine_type": this.mType
        }
        this.svc.addUpdDel('Loan/InsertLoanImportDataFile', this.getImportData).subscribe(data => {
          console.log(data);
          if (data==0) {
            this.svc.addUpdDel<any>('Loan/PopulateLoanImportData', dt).subscribe(response => {
              console.log(response)
              if(response == 0){
                debugger
                this.isLoading = false;
                this.alertMsg = "Imported successfully!!";
                this.showAlert = true;
                this.flag = 1;
                this.getImportData=[];
                this.blocks=[];
              }
            })
            
          }
          else{
            this.isLoading = false;
            this.alertMsg = "Error from Server Side!!";
            this.showAlert = true;
          }
          // this.svc.addUpdDel('Loan/PopulateLoanImportData', dt).subscribe(response => {
          //   console.log(response)
          //   this.isLoading = false;
          //   console.log(data,response);
          //   if (!data && !response) {
          //     this.alertMsg = "Imported successfully!!";
          //     this.showAlert = true;
          //     this.flag = 1
          //   }
          //   else {
          //     this.alertMsg = "Import unsuccessful!!";
          //     this.showAlert = true;
          //     this.flag = 0
          //   }

          // }, error => {
          //   this.alertMsg = "Import unsuccessful!!";
          //   this.showAlert = true;
          //   this.flag = 0
          // })

        }, error => {
          this.isLoading = false;
          this.alertMsg = "Error in importing!";
          this.showAlert = true;
          this.flag = 0
        })
      // }
      // else {
      //   this.isLoading = false;
      //   this.alertMsg = "The data for this agent has already been imported.";
      //   this.showAlert = true;
      //   this.flag = 0
      // }
    // }, error => {
    //   this.isLoading = false;
    //   this.alertMsg = "Error in importing!";
    //   this.showAlert = true;
    //   this.flag = 0
    // })

  }
  get entry() { return this.importEntryForm.controls }
  public SubmitReport() {
    this.isLoading = true
    this.btnForImport = document.getElementById('importDt');
    this.btnForImport.click()
    if (this.importEntryForm.invalid) {
      this.isLoading = false;
      this.showAlert = true;
      this.alertMsg = 'Invalid Input.';
      return false;
    }
    else {
      console.log(this.btnForImport)
      this.isLoading = false;
      var ddsExp = new ddsExport()
      ddsExp.ardb_cd = this.sys.ardbCD
      ddsExp.brn_cd = this.sys.BranchCode
      ddsExp.block_cd = this.entry.block_cd.value;
      // ddsExp.block_name = this.agentData.filter(x => x.agent_cd == this.entry.block_cd.value)[0].agent_name
      this.modalRef.hide();
    }
  }
  public closeAlert() { this.showAlert = false; }
  closeScreen() { this.router.navigate([this.sys.BankName + '/la']); }
  showFile(e: any) {
    console.log(e.target.files[0].name);
    this.myFile = e
    var input = e.target;
    var reader = new FileReader();
    var c = 0;
    reader.onload = () => {
      var text = reader.result;
      this.node = document.getElementById('output');
      console.log(+text.toString().split(',')[2])
      this.totAmt = (+text.toString().split(',')[2])
      console.log(text)
      this.node.innerText = text.toString().replace("\u0004\r", '')
      this.getImportData = text.toString().replace("\u0004\r", '')
      // this.getImportData = text.toString().replace('\r','').trim()
      // this.getImportData = text.toString().replace("\u001a",'').trim()
      debugger
      this.getImportData = this.getImportData.split('\n');
      this.lastrow.push(this.getImportData[this.getImportData.length-1]);
      debugger
      if(this.lastrow[0].length<2){
        debugger
        this.getImportData.splice(-1)
      }
      console.log(this.getImportData);
      this.mType = this.getImportData[0].length == 76 ? 'C' : 'N'
      console.log(this.mType)
      debugger
    };
    reader.readAsText(input.files[0]);
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
    // this.disableAll = true; this.disableAccountTypeAndNo = true;
    // On below for dissapearing message
    // setTimeout(() => {
    //   this.showMsg = new ShowMessage();
    // }, 3000);
  }
}
