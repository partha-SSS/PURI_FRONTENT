import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tm_subsidy } from 'src/app/bank-resolver/Models/loan/tm_subsidy';
import { RestService } from 'src/app/_service';
import Utils from 'src/app/_utility/utils';
import { LOGIN_MASTER, MessageType, mm_customer, mm_operation, ShowMessage, SystemValues } from '../../../Models';
import { m_branch } from '../../../Models/m_branch';
import { DatePipe } from '@angular/common'
import { environment } from 'src/environments/environment';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
@Component({
  selector: 'app-subsidy-entry',
  templateUrl: './subsidy-entry.component.html',
  styleUrls: ['./subsidy-entry.component.css'],
  providers: [DatePipe]
})
export class SubsidyEntryComponent implements OnInit {

  brnDtls: m_branch[] = [];
  private static operations: mm_operation[] = [];
  isLoading = false;
  loanSubsidy: FormGroup;
  showMsg: ShowMessage;
  isDel = false;
  isRetrieve = false;
  isNew = false;
  isModify = false;
  isSave = true;
  // isSave = false;
  isClear = false;
  isOpenFromDp = false;
  isOpenFromDp1 = false;
  sys = new SystemValues();
  subsidyData: any;
  suggestedCustomer: mm_customer[];
  shownoresult = false;
  disabledOnNull = true;
  editDeleteMode=false;
  AcctTypes: mm_operation[];
  constructor(public datepipe: DatePipe, private router: Router, private formBuilder: FormBuilder, private svc: RestService) { }

  ngOnInit(): void {
    // this.GetBranchMaster();
    this.getOperationMaster()
    this.getSubsidyType()
    this.loanSubsidy = this.formBuilder.group({
      loan_id: [''],
      loan_acc_no: [''],
      start_dt: [''],
      distribution_dt: [''],
      subsidy_amt: [''],
      subsidy: [''],
      subsidy_type: ['']
    });
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
    this.editDeleteMode=false
  }
  get f() { return this.loanSubsidy.controls; }
  closeScreen() {
    this.router.navigate([localStorage.getItem('__bName') + '/la']);
  }
  getSubsidyType() {
    this.svc.getlbr(environment.subsidyUrl, null).subscribe(data => {
      this.subsidyData = data
    })
  }
  new() {
    this.isDel = false;
    this.isRetrieve = false;
    this.isNew = false;
    this.isModify = false;
    this.isSave = true;
    this.isClear = true;
    this.editDeleteMode=false;
    this.GetBranchMaster();
  }

  GetBranchMaster() {
    this.isLoading = true;
    ;
    this.svc.addUpdDel('Mst/GetBranchMaster', null).subscribe(
      res => {
        ;
        this.brnDtls = res;
        this.isLoading = false;

      },
      err => { this.isLoading = false;; }
    )
  }
  retrieve() {
    let subsidyEntry = new tm_subsidy();
    subsidyEntry.brn_cd = this.sys.BranchCode;
    subsidyEntry.loan_id = this.f.loan_id.value;
    subsidyEntry.ardb_cd = this.sys.ardbCD
    this.svc.addUpdDel<any>('Loan/GetSubsidyData', subsidyEntry).subscribe(
      res => {
        ;
        console.log(res)
        if (res.length == 0) {
          this.HandleMessage(true, MessageType.Sucess, 'Data Not found !!!');
        }
        else {
          if (res.ardb_cd == null) { this.isModify = false; this.isSave = true; this.isDel=false;this.editDeleteMode=false;
            this.loanSubsidy.patchValue({
              loan_acc_no: res.loan_acc_no,
              start_dt: res.start_dt,
              distribution_dt: res.distribution_dt,
              subsidy_amt: '',
              subsidy: res.subsidy,
              subsidy_type: res.subsidy_type
            })
          }
          else {
            this.editDeleteMode=true;
            this.isSave = true; this.isModify = true ; this.isDel=true
            this.loanSubsidy.patchValue({
              loan_acc_no: res.loan_acc_no,
              start_dt: res.start_dt,
              distribution_dt: res.distribution_dt,
              subsidy_amt: res.subsidy_amt,
              subsidy: res.subsidy,
              subsidy_type: res.subsidy_type
            })
          }

          // this.isDel = true;
          this.isRetrieve = false;
          this.isNew = false;
          // this.isModify = true;
          this.isClear = true;
        }

      },
      err => {
        ; this.HandleMessage(true, MessageType.Error, 'User Not found !!!');
        this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = false;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
      }
    )
    // }

  }
  mapSubsidyEntry(): tm_subsidy {
    let subsidyEntry = new tm_subsidy();
    subsidyEntry.brn_cd = this.sys.BranchCode;
    subsidyEntry.loan_id = this.f.loan_id.value;
    subsidyEntry.loan_acc_no = this.f.loan_acc_no.value;
    subsidyEntry.start_dt = this.f.start_dt.value
    // subsidyEntry.start_dt=this.datepipe.transform(this.f.start_dt.value.toString(), 'yyyy-MM-dd');
    subsidyEntry.distribution_dt = this.f.distribution_dt.value
    // subsidyEntry.distribution_dt=this.datepipe.transform(this.f.distribution_dt.value.toString(), 'yyyy-MM-dd');
    subsidyEntry.subsidy_amt = this.f.subsidy_amt.value;
    subsidyEntry.subsidy = this.f.subsidy.value;
    subsidyEntry.subsidy_type = this.f.subsidy_type.value;
    subsidyEntry.del_flag = 'N'
    subsidyEntry.modified_by = this.sys.UserId+'/'+localStorage.getItem('ipAddress')
    return subsidyEntry
  }
  checkValidity(subsidyEntry: tm_subsidy) {
    if (!subsidyEntry.loan_id) {
      this.HandleMessage(true, MessageType.Error, 'Loan ID cannot be null');
      return 1;
    }
    else if (!subsidyEntry.loan_acc_no) {
      this.HandleMessage(true, MessageType.Error, 'Loan Case No. cannot be null');
      return 1;
    }
    else if (!subsidyEntry.start_dt) {
      this.HandleMessage(true, MessageType.Error, 'Start Date cannot be null');
      return 1;
    }
    else if (!subsidyEntry.distribution_dt) {
      this.HandleMessage(true, MessageType.Error, 'Distribution Date cannot be null');
      return 1;
    }
    else if (!subsidyEntry.subsidy_amt) {
      this.HandleMessage(true, MessageType.Error, 'Subsidy Amount cannot be null or 0');
      return 1;
    }
    else if (!subsidyEntry.subsidy) {
      this.HandleMessage(true, MessageType.Error, 'Subsidy type cannot be null');
      return 1;
    }
    else if (!subsidyEntry.subsidy_type) {
      this.HandleMessage(true, MessageType.Error, 'Implementation cannot be null');
      return 1;
    }
    else {
      return 0;
    }
  }
  saveuser() {
    let subsidyEntry = new tm_subsidy();
    subsidyEntry = this.mapSubsidyEntry();
    if (!this.checkValidity(subsidyEntry)) {
      this.isLoading = true;
      console.log(subsidyEntry, this.sys.CurrentDate)
      if(this.editDeleteMode == false){
      this.svc.addUpdDel('Loan/InsertSubsidyData', subsidyEntry).subscribe(
        res => {
          ;
          console.log(res)
          if (+res == 0) {
            this.isLoading = false;
            this.HandleMessage(true, MessageType.Sucess, 'Subsidy entered successfully!');
            this.initialize();
            this.isDel = false;
            this.isRetrieve = true;
            this.isNew = true;
            this.isModify = false;
            this.isSave = false;
            this.isClear = true;
            this.editDeleteMode=false;
            this.disabledOnNull=true
          }
          else {
            this.isLoading = false;
            this.editDeleteMode=false;
            this.disabledOnNull=true
            this.HandleMessage(true, MessageType.Error, 'Insertion Failed!!')
          }
        },
        err => {
          this.isLoading = false;; this.HandleMessage(true, MessageType.Error, 'Insertion Failed!!');
          this.isDel = false;
          this.isRetrieve = false;
          this.isNew = false;
          this.isModify = false;
          this.isSave = true;
          this.isClear = true;
          this.editDeleteMode=false
          this.disabledOnNull=true
        })
      }
      else{
        this.svc.addUpdDel('Loan/UpdateSubsidyData', subsidyEntry).subscribe(
          res => {
            ;
            console.log(res)
            this.isLoading = false;
            if (+res == 0) {
              this.HandleMessage(true, MessageType.Sucess, 'Subsidy Data successfully updated!');
            }
            else {
              this.isLoading = false;; this.HandleMessage(true, MessageType.Error, 'Updation Failed!!');
            }
  
            this.initialize();
            this.isDel = false;
            this.isRetrieve = true;
            this.isNew = true;
            this.isModify = false;
            this.isSave = false;
            this.isClear = true;
            this.editDeleteMode=false;
            this.disabledOnNull=true;
          },
          err => {
            this.isLoading = false;; this.HandleMessage(true, MessageType.Error, 'Updation Failed!!');
            this.isDel = false;
            this.isRetrieve = true;
            this.isNew = true;
            this.isModify = true;
            this.isSave = false;
            this.isClear = true;
            this.editDeleteMode=false
            this.disabledOnNull=true
          }
        )
      }
    }
  }
  updateuser() {
    this.isLoading = true;
    let subsidyEntry = new tm_subsidy();
    subsidyEntry = this.mapSubsidyEntry();
    if (!this.checkValidity(subsidyEntry)) {
      this.isLoading = true;
      this.svc.addUpdDel('Loan/UpdateSubsidyData', subsidyEntry).subscribe(
        res => {
          ;
          console.log(res)
          this.isLoading = false;
          if (+res == 0) {
            this.HandleMessage(true, MessageType.Sucess, 'Subsidy Data successfully updated!');
          }
          else {
            this.isLoading = false;; this.HandleMessage(true, MessageType.Error, 'Updation Failed!!');
          }

          this.initialize();
          this.isDel = false;
          this.isRetrieve = true;
          this.isNew = true;
          this.isModify = false;
          this.isSave = false;
          this.isClear = true;
        },
        err => {
          this.isLoading = false;; this.HandleMessage(true, MessageType.Error, 'Updation Failed!!');
          this.isDel = false;
          this.isRetrieve = true;
          this.isNew = true;
          this.isModify = true;
          this.isSave = false;
          this.isClear = true;
        }
      )
    }



  }
  deleteuser() {
    this.isLoading = true;
    let subsidyEntry = new tm_subsidy();
    subsidyEntry.brn_cd = this.sys.BranchCode;
    subsidyEntry.loan_id = this.f.loan_id.value;
    subsidyEntry.ardb_cd = this.sys.ardbCD;
    this.svc.addUpdDel('Loan/DeleteSubsidyData', subsidyEntry).subscribe(
      res => {
        console.log(res)
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Sucess, 'Subsidy Entry successfully deleted!');
        this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
        this.editDeleteMode=false
      },
      err => {
        this.isLoading = false; this.HandleMessage(true, MessageType.Error, 'Deletion Failed!!');
        this.initialize();
        this.isDel = false;
        this.isRetrieve = true;
        this.isNew = true;
        this.isModify = false;
        this.isSave = false;
        this.isClear = true;
        this.editDeleteMode=false
      }
    )

  }
  clearuser() {
    this.initialize();
    this.isDel = false;
    this.isRetrieve = true;
    this.isNew = true;
    this.isModify = false;
    this.isSave = false;
    this.isClear = true;
    this.editDeleteMode=false
  }
  initialize() {
    this.loanSubsidy.reset()
  }
  clearSuggestedCust() {
    this.suggestedCustomer = null;
    this.shownoresult = false
    if (this.f.loan_id.value.length > 0) {
      this.disabledOnNull = false
    }
    else {
      this.disabledOnNull = true;
    }


  }
  SelectCustomer(cust) {
    console.log(cust);
    this.suggestedCustomer = [];
    this.f.loan_id.setValue(cust.loan_id)
    this.isSave = false;
    this.retrieve()

  }
  private getOperationMaster(): void {

    this.isLoading = true;
    // if (undefined !== AccounTransactionsComponent.operations && null !== AccounTransactionsComponent.operations && AccounTransactionsComponent.operations.length > 0) {
    //   this.isLoading = false;
    //   this.AcctTypes = AccounTransactionsComponent.operations.filter(e => e.module_type === 'LOAN')
    //     .filter((thing, i, arr) => {
    //       return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
    //     });
    //   this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
      // console.log(this.AcctTypes)
    // } else {
      this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
        res => {
          console.log(res)
          SubsidyEntryComponent.operations = res;
          debugger
          this.isLoading = false;
          this.AcctTypes = SubsidyEntryComponent.operations.filter(e => e.module_type === 'LOAN')
            .filter((thing, i, arr) => {
              return arr.indexOf(arr.find(t => t.acc_type_cd == 20411|| t.acc_type_cd == 23301)) === i;
            });
            console.log(this.AcctTypes);
            
          // this.AcctTypes = this.AcctTypes.find(el => el.acc_type_cd == '23301')[0];
        },
        err => { this.isLoading = false; }
      );
    // }
    debugger
  }
  public suggestCustomer(): void {
    this.isLoading = true;
    if (this.f.loan_id.value.length > 0) {
      const prm = new p_gen_param();
      prm.ad_acc_type_cd = this.AcctTypes[0].acc_type_cd;
      prm.as_cust_name = this.f.loan_id.value.toLowerCase();
      this.svc.addUpdDel<any>('Loan/GetLoanDtls', prm).subscribe(
        res => {
          console.log(res)
          this.isLoading = false;
          if (undefined !== res && null !== res && res.length > 0) {

            this.suggestedCustomer = res;
          } else {
            this.shownoresult = true;
            this.suggestedCustomer = [];
          }
        },
        err => {
          this.shownoresult = false;
          this.isLoading = false;
        }
      );
    } else {
      this.suggestedCustomer = null;
    }
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
  prior() { }
  next() { }
}
