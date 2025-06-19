import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MessageType, ShowMessage, SystemValues } from 'src/app/bank-resolver/Models';
import { ddsExport } from 'src/app/bank-resolver/Models/deposit/ddsExport';
import { RestService } from 'src/app/_service';
@Component({
  selector: 'app-dds-import',
  templateUrl: './dds-import.component.html',
  styleUrls: ['./dds-import.component.css']
})
export class DdsImportComponent implements OnInit {
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
  allAgent:any;
  myFile: any;
  node: any;
  flag = 1;
  showMsg: ShowMessage;
  totAmt = 0;
  mType: any;
  showHideAgent:boolean=false;
  constructor(private svc: RestService, private formBuilder: FormBuilder, private modalService: BsModalService, private router: Router) { }
  ngOnInit(): void {
    this.getAgentList()
    this.importEntryForm = this.formBuilder.group({
      agent_id: [null, Validators.required]
    });
    this.onLoadScreen(this.content);
  }
  private onLoadScreen(content) {
    this.modalRef = this.modalService.show(content, this.config);
  }
  getAgentList() {
    var dt = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode
    }
    this.svc.addUpdDel('Deposit/GetAgentData', dt).subscribe(data => {
      this.agentData = data;
      this.allAgent=data;
    })
  }
  importAsTxt() {
    this.isLoading = true;
    var d = {
      "ardb_cd": this.sys.ardbCD,
      "brn_cd": this.sys.BranchCode,
      "agent_cd": this.importEntryForm.controls.agent_id.value,
      "trans_dt": this.sys.CurrentDate,
      "trans_amt": this.totAmt
    }
    console.log(d);
    this.svc.addUpdDel('Deposit/CheckDuplicateAgentData', d).subscribe(isDuplicate => {
      console.log(isDuplicate)
      if (!isDuplicate) {
        var dt = {
          "ardb_cd": this.sys.ardbCD,
          "brn_cd": this.sys.BranchCode,
          "agent_cd": this.importEntryForm.controls.agent_id.value,
          "user_id": this.sys.UserId,
          "machine_type": this.mType
        }
        this.svc.addUpdDel('Deposit/InsertImportDataFile', this.getImportData).subscribe(data => {
          console.log(data)
          this.svc.addUpdDel('Deposit/PopulateImportData', dt).subscribe(response => {
            console.log(response)
            this.isLoading = false;
            console.log(data,response);
            if (!data && !response) {
              this.alertMsg = "Imported successfully!!";
              this.showAlert = true;
              this.flag = 1
            }
            else {
              this.alertMsg = "Import unsuccessful!!";
              this.showAlert = true;
              this.flag = 0
            }

          }, error => {
            this.alertMsg = "Import Failed, error from server side!!";
            this.showAlert = true;
            this.flag = 0
          })

        })
      }
      else {
        this.isLoading = false;
        this.alertMsg = "The data for this agent has already been imported.";
        this.showAlert = true;
        this.flag = 0
      }
    }, error => {
      this.isLoading = false;
      this.alertMsg = "Error in importing!";
      this.showAlert = true;
      this.flag = 0
    })

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
      ddsExp.agent_cd = this.entry.agent_id.value;
      ddsExp.agent_name = this.agentData.filter(x => x.agent_cd == this.entry.agent_id.value)[0].agent_name
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
      this.getImportData = this.getImportData.split('\n');
      console.log(this.getImportData);
      this.mType = this.getImportData[0].length == 76 ? 'C' : 'N'
      console.log(this.mType)
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
  selectAgent(agent_cd:any){
    this.importEntryForm.controls.agent_id.setValue(agent_cd);
    this.showHideAgent=false
    debugger;
  }
  onshow(i:any)
  {
    if(i.target.value==''){
      this.showHideAgent=false
    }
    else{
      this.agentData=this.allAgent.filter(e=>e.agent_name.toLowerCase().includes(i.target.value.toLowerCase()) || e.agent_cd.includes(i.target.value.toLowerCase()) ==true)
      this.showHideAgent=true
    }
    debugger
    }
}
