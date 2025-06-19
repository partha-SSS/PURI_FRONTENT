import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { mm_customer } from 'src/app/bank-resolver/Models';
import { SystemValues } from './../../../Models/SystemValues';
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { mm_acc_type } from 'src/app/bank-resolver/Models/deposit/mm_acc_type';
import { mm_instalment_type } from 'src/app/bank-resolver/Models/loan/mm_instalment_type';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { tm_guaranter } from 'src/app/bank-resolver/Models/loan/tm_guaranter';
import { td_accholder } from 'src/app/bank-resolver/Models/deposit/td_accholder';
import { tm_loan_sanction } from 'src/app/bank-resolver/Models/loan/tm_loan_sanction';
import { tm_loan_sanction_dtls } from 'src/app/bank-resolver/Models/loan/tm_loan_sanction_dtls';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
 ;
import { exit } from 'process';
import { mm_sector } from 'src/app/bank-resolver/Models/loan/mm_sector';
import { mm_activity } from 'src/app/bank-resolver/Models/loan/mm_activity';
import { mm_crop } from 'src/app/bank-resolver/Models/loan/mm_crop';
import { p_loan_param } from 'src/app/bank-resolver/Models/loan/p_loan_param';
import { sm_kcc_param } from 'src/app/bank-resolver/Models/loan/sm_kcc_param';
import { sm_loan_sanction } from 'src/app/bank-resolver/Models/loan/sm_loan_sanction';
import { td_loan_sanc } from 'src/app/bank-resolver/Models/loan/td_loan_sanc';
import { td_loan_sanc_set } from 'src/app/bank-resolver/Models/loan/td_loan_sanc_set';
import Utils from 'src/app/_utility/utils';
import { sm_parameter } from 'src/app/bank-resolver/Models/sm_parameter';
import { MessageType, mm_category, mm_customer, m_acc_master, ShowMessage, td_def_trans_trf  } from 'src/app/bank-resolver/Models';


@Component({
  selector: 'app-system-parameter-update',
  templateUrl: './system-parameter-update.component.html',
  styleUrls: ['./system-parameter-update.component.css']
})
export class SystemParameterUpdateComponent implements OnInit {

  constructor(private svc: RestService,
    private modalService: BsModalService,
    private router: Router,
    private msg: InAppMessageService,

) { }


isLoading = false;
disableAll = "N";
sys = new SystemValues();
showMsg: ShowMessage;
smParameterList: sm_parameter[] = [];
smParameter= new sm_parameter();


sectorList: mm_sector[] = [];

  ngOnInit(): void {
    setTimeout(() => {
      this.getSmParameterList();
    }, 150);
  }



  retrieveData()
  {
  this.getSmParameterList();
  }



  getSmParameterList() {

      this.isLoading = true;
      this.svc.addUpdDel<any>('Mst/GetSystemParameter', null).subscribe(
      res => {
        this.smParameterList = res;
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, 'SM Parameter Records Not Found !!!');
      }
    );

  }


  saveData(idx: number) {
    this.smParameter = this.smParameterList[idx];

    this.isLoading = true;
    this.svc.addUpdDel<any>('Mst/UpdateSystemParameter', this.smParameter).subscribe(
      res => {
        this.smParameterList = res;
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Sucess, 'Record Updated Successfully !!');
        this.retrieveData();
      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, 'Record Not Updated !!!');

      }
    );
  }

  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
    this.disableAll = "Y";
  }

  public closeAlertMsg() {
    this.HandleMessage(false);
    this.disableAll = "N";
  }

  backScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }

}
