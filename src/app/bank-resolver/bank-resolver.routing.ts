import { GenLedgerComponent } from './finance/report/gen-ledger/gen-ledger.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { BankResolverComponent } from './bank-resolver.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceComponent } from './finance/finance.component';
import { VoucherComponent } from './finance/voucher/voucher.component';
import { UTCustomerProfileComponent } from './UCIC/utcustomer-profile/utcustomer-profile.component';
import { UTSelfHelpComponent } from './UCIC/utself-help/utself-help.component';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component';
import { BankConfigComponent } from '../bank-config/bank-config.component';
import { DailybookComponent } from './finance/report/dailybook/dailybook.component';
import { BankWiseConfigComponent } from '../bank-wise-config/bank-wise-config.component';
import { CashaccountComponent } from './finance/report/cashaccount/cashaccount.component';
import { CashcumtrialComponent } from './finance/report/cashcumtrial/cashcumtrial.component';
import { TrialbalanceComponent } from './finance/report/trialbalance/trialbalance.component';
import { VoucherprintComponent } from './finance/voucherprint/voucherprint.component';
import { GenLedger2Component } from './finance/report/gen-ledger2/gen-ledger2.component';
import { TransactionapprovalComponent } from './deposit/transactionapproval/transactionapproval.component';
import { AccOpeningComponent } from './deposit/acc-opening/acc-opening.component';
import { DenominationComponent } from './test/denomination.component';
import { ScrollbookComponent } from './finance/report/scrollbook/scrollbook.component';
import { VoucherapprovalComponent } from './finance/voucherapproval/voucherapproval.component';
import { DayinitializationComponent } from './system/dayinitialization/dayinitialization.component';
import { DaycomplitionComponent } from './system/daycomplition/daycomplition.component';
import { AdduserComponent } from './system/adduser/adduser.component';
import { AccounTransactionsComponent } from './deposit/accoun-transactions/accoun-transactions.component';
import { MemberListComponent } from './UCIC/Report/member-list/member-list.component';
import { OpenLoanAccountComponent } from './loan/transaction/open-loan-account/open-loan-account.component';
import { AuthenticationService as AuthGuard } from '../_service/authentication.service';
import { LoanTransactionApprovalComponent } from './loan/transaction/loan-transaction-approval/loan-transaction-approval.component';
import { LoanaccountTransactionComponent } from './loan/transaction/loanaccount-transaction/loanaccount-transaction.component';
import { LoanAccwiseinttcalcComponent } from './loan/transaction/loan-accwiseinttcalc/loan-accwiseinttcalc.component';
import { LienAccLockUnlockComponent } from './deposit/acc-lock-unlock/lien-acc-lock-unlock/lien-acc-lock-unlock.component';
import { NetworthStatementComponent } from './UCIC/Report/networth-statement/networth-statement.component';
import { SubCashBookComponent } from './deposit/report/sub-cash-book/sub-cash-book.component';
import { AccStmtRDComponent } from './deposit/report/acc-stmt-rd/acc-stmt-rd.component';
import { AccStmtSBCAComponent } from './deposit/report/acc-stmt-sbca/acc-stmt-sbca.component';
import { AccStmtTDComponent } from './deposit/report/acc-stmt-td/acc-stmt-td.component';
import { DetailListFDMISComponent } from './deposit/report/detail-list-fdmis/detail-list-fdmis.component';
import { DetailListRDComponent } from './deposit/report/detail-list-rd/detail-list-rd.component';
import { DetailListSBCAComponent } from './deposit/report/detail-list-sbca/detail-list-sbca.component';
import { NearMaturityReportComponent } from './deposit/report/near-maturity-report/near-maturity-report.component';
import { OpenClosingRegisterComponent } from './deposit/report/open-closing-register/open-closing-register.component';
import { LoanStatementComponent } from './loan/report/loan-statement/loan-statement.component';
import { DetailListComponent } from './loan/report/detail-list/detail-list.component';
import { LoanDisbursementRegisterComponent } from './loan/report/loan-disbursement-register/loan-disbursement-register.component';
import { RecoveryRegisterComponent } from './loan/report/recovery-register/recovery-register.component';
import { LoanSubCashBookComponent } from './loan/report/loan-sub-cash-book/loan-sub-cash-book.component';
import { AccOpeningViewComponent } from './deposit/acc-opening-view/acc-opening-view.component';
import { SystemParameterUpdateComponent } from './system/systemparameter/system-parameter-update/system-parameter-update.component';
import { NeftOutwardComponent } from './deposit/neft-outward/neft-outward.component';
import { NeftInwardReportComponent } from './deposit/report/neft-inward-report/neft-inward-report.component';
import { NeftOutwardReportComponent } from './deposit/report/neft-outward-report/neft-outward-report.component';
import { PassBookPrintingComponent } from './deposit/report/pass-book-printing/pass-book-printing.component';
import { TransTransactionComponent } from './transfer/trans-transaction/trans-transaction.component';
import { TransApproveComponent } from './transfer/trans-approve/trans-approve.component';
import { BakdatevoucherComponent } from './finance/bakdatevoucher/bakdatevoucher.component';
import { KccmemberdtlsComponent } from './loan/masters/kccmemberdtls/kccmemberdtls.component';
import { YearopenComponent } from './system/yearopen/yearopen.component';
import { YearcloseComponent } from './system/yearclose/yearclose.component';
import { BalanaceSheetComponent } from './finance/report/balanace-sheet/balanace-sheet.component';
import { ProfitLossAccComponent } from './finance/report/profit-loss-acc/profit-loss-acc.component';
import { TradingAccComponent } from './finance/report/trading-acc/trading-acc.component';
import { MasterMenuConfigComponent } from '../master-menu-config/master-menu-config.component';
import { ConfigNewBankComponent } from '../config-new-bank/config-new-bank.component';
import { AdminLoginComponent } from '../admin-login/admin-login.component';
import { SubsidyEntryComponent } from './loan/transaction/subsidy-entry/subsidy-entry.component';
import { OnetimesettlementComponent } from './loan/transaction/onetimesettlement/onetimesettlement.component';
import { DdsExportComponent } from './deposit/ddsExportImport/dds-export/dds-export.component';
import { DdsImportComponent } from './deposit/ddsExportImport/dds-import/dds-import.component';
import { DdsIndividualPostingComponent } from './deposit/ddsExportImport/dds-individual-posting/dds-individual-posting.component';
// import { WINDOW_PROVIDERS } from './window.providers';
import { DefaulterListComponent } from './loan/report/defaulter-list/defaulter-list.component';
import { DemandListComponent } from './loan/report/demand-list/demand-list.component';
import { RecovListComponent } from './loan/report/recov-list/recov-list.component';
import { ActwiseLstComponent } from './loan/report/demand-list/actwise-lst/actwise-lst.component';
import { BlockwiseLstComponent } from './loan/report/demand-list/blockwise-lst/blockwise-lst.component';
import { ActWiseColLstComponent } from './loan/report/recov-list/act-wise-col-lst/act-wise-col-lst.component';
import { BlockWiseColLstComponent } from './loan/report/recov-list/block-wise-col-lst/block-wise-col-lst.component';
import { AdRecStmtComponent } from './loan/report/ad-rec-stmt/ad-rec-stmt.component';
import { IntRecStmtComponent } from './loan/report/int-rec-stmt/int-rec-stmt.component';
import { LoanDisburseNormalComponent } from './loan/report/loan-disbursement-register/loan-disburse-normal/loan-disburse-normal.component';
import { RecovNormalComponent } from './loan/report/recovery-register/recov-normal/recov-normal.component';
import { OpenCloseregComponent } from './loan/report/open-closereg/open-closereg.component';
import { DetailDDSComponent } from './deposit/report/detail-dds/detail-dds.component';
import { DdsAccStmtComponent } from './deposit/report/dds-acc-stmt/dds-acc-stmt.component';
import { NpaComponent } from './loan/report/npa/npa.component';
import { YearlyadjustmentvoucherComponent } from './finance/yearlyadjustmentvoucher/yearlyadjustmentvoucher.component';
import { BlockMasterComponent } from './loan/masters/block-master/block-master.component';
import { VillageMasterComponent } from './loan/masters/village-master/village-master.component';
import { ServiceareamasterComponent } from './loan/masters/serviceareamaster/serviceareamaster.component';
import { UserLoginStatusComponent } from './system/user-login-status/user-login-status.component';
import { DemandNoticeComponent } from './loan/report/demand-notice/demand-notice.component';
import { OverdueNoticeComponent } from './loan/report/overdue-notice/overdue-notice.component';
import { OverdueTransferComponent } from './loan/report/overdue-transfer/overdue-transfer.component';
import { RecovFundComponent } from './loan/report/recovery-register/recov-fund/recov-fund.component';
import { ConsolidatedDayBookComponent } from './finance/report/consolidated-day-book/consolidated-day-book.component';
import { ConsolidatedCashAccComponent } from './finance/report/consolidated-cash-acc/consolidated-cash-acc.component';
import { ConsolidatedCashCumTrialComponent } from './finance/report/consolidated-cash-cum-trial/consolidated-cash-cum-trial.component';
import { ConsolidatedTrialBalanceComponent } from './finance/report/consolidated-trial-balance/consolidated-trial-balance.component';
import { StandingInsActiveSIListComponent } from './deposit/report/standing-ins-active-silist/standing-ins-active-silist.component';
import { StandingInsTodaySIExecutedComponent } from './deposit/report/standing-ins-today-siexecuted/standing-ins-today-siexecuted.component';
import { WeeklyReturnComponent } from './finance/report/weekly-return/weekly-return.component';
import { RecovInterestComponent } from './loan/report/recovery-register/recov-interest/recov-interest.component';
import { BankEntryComponent } from './investment/master/bank-entry/bank-entry/bank-entry.component';
import { BranchEntryComponent } from './investment/master/branc-entry/branch-entry/branch-entry.component';
import { OpenInvestComponent } from './investment/transaction/open-invest/open-invest.component';
import { VewInvestmentDtlsComponent } from './investment/transaction/vew-investment-dtls/vew-investment-dtls.component';
import { InvTransactionApprovalComponent } from './investment/transaction/inv-transaction-approval/inv-transaction-approval.component';
import { InvestmentTransactionsComponent } from './investment/transaction/investment-transactions/investment-transactions.component';
import { CreateGLHeadComponent } from './finance/create-glhead/create-glhead.component';
import { DetailListFdmisConstWiseComponent } from './deposit/report/detail-list-fdmis-const-wise/detail-list-fdmis-const-wise.component';
import { IDetailListComponent } from './investment/report/detail-list/detail-list.component';
import { INearMaturityComponent } from './investment/report/near-maturity/near-maturity.component';
import { AllGLDetailsComponent } from './finance/report/all-gldetails/all-gldetails.component';
import { UpdatePassbookComponent } from './deposit/report/update-passbook/update-passbook.component';
import { BMLoanStatementComponent } from './loan/report/bmloan-statement/bmloan-statement.component';
import { SlabwiseDepositComponent } from './deposit/report/slabwise-deposit/slabwise-deposit.component';
import { PassBookFastPageComponent } from './deposit/report/pass-book-printing/pass-book-fast-page/pass-book-fast-page.component';
import { DetaillistAllComponent } from './loan/report/detaillist-all/detaillist-all.component';
import { SavingIntPostComponent } from './deposit/saving-int-post/saving-int-post.component';
import { AgentCommissionComponent } from './deposit/agent-commission/agent-commission.component';
import { LoanPassBookFastPageComponent } from './loan/report/pass-book-printing/pass-book-fast-page/pass-book-fast-page.component';
import { LoanPassBookPrintingComponent } from './loan/report/pass-book-printing/pass-book-printing.component';
import { LoanUpdatePassbookComponent } from './loan/report/update-passbook/update-passbook.component';
import { PrintCertificateComponent } from './deposit/report/print-certificate/print-certificate.component';
import { NpaALLComponent } from './loan/report/npa-all/npa-all.component';
import { RecovBlockComponent } from './loan/report/recovery-register/recov-block/recov-block.component';
import { InterestCertificateComponent } from './deposit/report/interest-certificate/interest-certificate.component';
import { SmsChargeDeductionComponent } from './deposit/sms-charge-deduction/sms-charge-deduction.component';
import { ConsoGLTrnsComponent } from './finance/report/conso-gltrns/conso-gltrns.component';
import { ConsoCCTrialComponent } from './finance/report/conso-cctrial/conso-cctrial.component';
import { InterestSubsidyComponent } from './loan/report/interest-subsidy/interest-subsidy.component';
import { ConsoProfitLossComponent } from './finance/report/conso-profit-loss/conso-profit-loss.component';
import { UserPermissionComponent } from './system/user-permission/user-permission.component';
import { UserTransferComponent } from './system/user-transfer/user-transfer.component';
import { ConsoBalSheetComponent } from './finance/report/conso-bal-sheet/conso-bal-sheet.component';
import { ConsoCashAccNewComponent } from './finance/report/conso-cash-acc-new/conso-cash-acc-new.component';
import { LoanDisbCertificateComponent } from './loan/report/loan-disb-certificate/loan-disb-certificate.component';
import { CloseAccDtlsComponent } from './deposit/close-acc-dtls/close-acc-dtls.component';
import { GMloanDCComponent } from './loan/report/gmloan-dc/gmloan-dc.component';
import { RecovVillageComponent } from './loan/report/recovery-register/recov-village/recov-village.component';
import { UserWiseTransactionComponent } from './deposit/report/user-wise-transaction/user-wise-transaction.component';
import { UserWiseTransactionLoanComponent } from './loan/report/user-wise-transaction-loan/user-wise-transaction-loan.component';
import { GmLoanSubsidyComponent } from './loan/report/gm-loan-subsidy/gm-loan-subsidy.component';
import { LoanDisburseActWiseComponent } from './loan/report/loan-disbursement-register/loan-disburse-act-wise/loan-disburse-act-wise.component';
import { YearendDemandRecoveryComponent } from './loan/transaction/yearend-demand-recovery/yearend-demand-recovery.component';
import { DemandNoticeBlockWiseComponent } from './loan/report/demand-notice-block-wise/demand-notice-block-wise.component';
import { RecovAdvPrnComponent } from './loan/report/recovery-register/recov-adv-prn/recov-adv-prn.component';
import { RecovAdvPrnVillComponent } from './loan/report/recovery-register/recov-adv-prn-vill/recov-adv-prn-vill.component';
import { InterestSubsidySummaryComponent } from './loan/report/interest-subsidy-summary/interest-subsidy-summary.component';
import { DcbrPrintComponent } from './loan/report/dcbr-print/dcbr-print.component';
import { NpaSummaryComponent } from './loan/report/npa-summary/npa-summary.component';
import { CommonServiceService } from './common-service.service';
import { LockerRoutingModule } from './locker/locker-routing.module';
import { LockerShouldbeRenewComponent } from './locker/report/locker-shouldbe-renew/locker-shouldbe-renew.component';
import { LockerRenewDetailsComponent } from './locker/report/locker-renew-details/locker-renew-details.component';
import { LockerDetailsComponent } from './locker/report/locker-details/locker-details.component';
import { LockerViewComponent } from './locker/locker-view/locker-view.component';
import { LockerApproveComponent } from './locker/locker-approve/locker-approve.component';
import { LockerTransactionComponent } from './locker/locker-transaction/locker-transaction.component';
import { LockerOpeningComponent } from './locker/locker-opening/locker-opening.component';
import { LoakerRentMasterComponent } from './locker/loaker-rent-master/loaker-rent-master.component';
import { LoakerDetailMasterComponent } from './locker/loaker-detail-master/loaker-detail-master.component';
import { LockerComponent } from './locker/locker.component';
import { DetailListSbcaConstWiseComponent } from './deposit/report/detail-list-sbca-const-wise/detail-list-sbca-const-wise.component';
import { FortnightlyReturnComponent } from './loan/report/fortnightly-return/fortnightly-return.component';
import { ConsoFortnightlyReturnComponent } from './loan/report/conso-fortnightly-return/conso-fortnightly-return.component';
import { BorrowingComponent } from './borrowing/borrowing.component';
import { OpenBorrowingComponent } from './borrowing/open-borrowing/open-borrowing.component';
import { TransBorrowingComponent } from './borrowing/trans-borrowing/trans-borrowing.component';
import { ApproveBorrowingComponent } from './borrowing/approve-borrowing/approve-borrowing.component';
import { ViewBorrowingComponent } from './borrowing/view-borrowing/view-borrowing.component';
import { BorroDetailListComponent } from './borrowing/report/borro-detail-list/borro-detail-list.component';
import { DcbrVillWiseComponent } from './loan/report/dcbr-vill-wise/dcbr-vill-wise.component';
import { CalculateBorrInttComponent } from './borrowing/calculate-borr-intt/calculate-borr-intt.component';
// import { ContaiUCICprofileComponent } from './UCIC/contai-ucicprofile/contai-ucicprofile.component';
import { GoldTestAndValuationReportComponent } from './loan/transaction/gold-test-and-valuation-report/gold-test-and-valuation-report.component';
import { DemandNoticeContaiComponent } from './loan/report/demand-notice-contai/demand-notice-contai.component';
import { UcicMergeComponent } from './UCIC/ucic-merge/ucic-merge.component';
import { CTloanDCComponent } from './loan/report/ctloan-dc/ctloan-dc.component';
import { RecoveryExportComponent } from './loan/transaction/recoveryExportImport/recovery-export/recovery-export.component';
import { RecoveryImportComponent } from './loan/transaction/recoveryExportImport/recovery-import/recovery-import.component';
import { RecoveryIndiPostComponent } from './loan/transaction/recoveryExportImport/recovery-indi-post/recovery-indi-post.component';
import { ContaiComponent } from './deposit/report/passbook-print/contai/contai.component';
import { ContaiFastPageComponent } from './deposit/report/passbook-print/contai/contai-fast-page/fast-page.component';
import { GhatalComponent } from './deposit/report/passbook-print/ghatal/ghatal.component';
import { GhatalFastPageComponent } from './deposit/report/passbook-print/ghatal/ghatal-fast-page/ghatal-fast-page.component';
import { GoldLoanReportComponent } from './loan/report/gold-loan-report/gold-loan-report.component';
import { GoldLoanAsOnDateComponent } from './loan/report/gold-loan-as-on-date/gold-loan-as-on-date.component';
import { GoldLoanCurrDateComponent } from './loan/report/gold-loan-curr-date/gold-loan-curr-date.component';
import { GroupWiseComponent } from './loan/report/recovery-register/group-wise/group-wise.component';
import { NpaAllWithGroupComponent } from './loan/report/npa-all-with-group/npa-all-with-group.component';
import { DcbrGroupWiseComponent } from './loan/report/dcbr-group-wise/dcbr-group-wise.component';
import { TamlukComponent } from './deposit/report/passbook-print/tamluk/tamluk.component';
import { TamlukFastPageComponent } from './deposit/report/passbook-print/tamluk/tamluk-fast-page/tamluk-fast-page.component';
import { VillMasterContaiComponent } from './loan/masters/vill-master-contai/vill-master-contai.component';
import { RecovSummaryComponent } from './loan/report/recovery-register/recov-summary/recov-summary.component';
import { RiskFundComponent } from './loan/report/risk-fund/risk-fund.component';
import { BankuraComponent } from './deposit/report/passbook-print/bankura/bankura.component';
import { BankuraFastPageComponent } from './deposit/report/passbook-print/bankura/bankura-fast-page/bankura-fast-page.component';
import { SendSmsFromDemandComponent } from './loan/report/send-sms-from-demand/send-sms-from-demand.component';
import { UpdatedDemandListComponent } from './loan/report/demand-list/updated-demand-list/updated-demand-list.component';
import { CtFortnightNewComponent } from './loan/report/ct-fortnight-new/ct-fortnight-new.component';
import { CtFortnightNewConsoComponent } from './loan/report/ct-fortnight-new-conso/ct-fortnight-new-conso.component';
import { LoanDisburseSummaryComponent } from './loan/report/loan-disbursement-register/loan-disburse-summary/loan-disburse-summary.component';
import { DdsAgentTransReportComponent } from './deposit/ddsExportImport/dds-agent-trans-report/dds-agent-trans-report.component';
import { InterestMasterComponent } from './deposit/masters/interest-master/interest-master.component';
import { LockerINOUTComponent } from './locker/locker-inout/locker-inout.component';
import { LockerAccessComponent } from './locker/report/locker-access/locker-access.component';
import { WeeklyReturnNewComponent } from './finance/report/weekly-return-new/weekly-return-new.component';
import { WeeklyReturnNewConsoComponent } from './finance/report/weekly-return-new-conso/weekly-return-new-conso.component';
import { GlWiseVoucherDtlsComponent } from './finance/report/gl-wise-voucher-dtls/gl-wise-voucher-dtls.component';
import { ConsoLoanDCComponent } from './loan/report/conso-loan-dc/conso-loan-dc.component';
import { LoanRecoveryConsoComponent } from './loan/report/recovery-register/loan-recovery-conso/loan-recovery-conso.component';
import { LoanDisburseConsoComponent } from './loan/report/loan-disbursement-register/loan-disburse-conso/loan-disburse-conso.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecovRegAccTypeWiseComponent } from './loan/report/recovery-register/recov-reg-acc-type-wise/recov-reg-acc-type-wise.component';
import { ConsoLoanDcSHGComponent } from './loan/report/conso-loan-dc-shg/conso-loan-dc-shg.component';
import { ConsoLoanDcRHComponent } from './loan/report/conso-loan-dc-rh/conso-loan-dc-rh.component';
import { ConsoGenLedgerComponent } from './finance/report/conso-gen-ledger/conso-gen-ledger.component';
import { InterestSubsidySHGComponent } from './loan/report/interest-subsidy-shg/interest-subsidy-shg.component';
import { Cashaccount2Component } from './finance/report/cashaccount2/cashaccount2.component';
import { ConsoleCashaccount2Component } from './finance/report/console-cashaccount2/console-cashaccount2.component';
import { DailybookNewComponent } from './finance/report/dailybook-new/dailybook-new.component';
import { ConsolidatedDailybookNewComponent } from './finance/report/consolidated-dailybook-new/consolidated-dailybook-new.component';
import { BalanaceSheetNewComponent } from './finance/report/balanace-sheet-new/balanace-sheet-new.component';
import { ConsoBalanaceSheetNewComponent } from './finance/report/conso-balanace-sheet-new/conso-balanace-sheet-new.component';
import { ProfitAndLossNewComponent } from './finance/report/profit-and-loss-new/profit-and-loss-new.component';
import { ConsoProfitAndLossNewComponent } from './finance/report/conso-profit-and-loss-new/conso-profit-and-loss-new.component';
import { GoldRateMasterComponent } from './master/gold-rate-master/gold-rate-master.component';
import { GoldItemMasterComponent } from './master/gold-item-master/gold-item-master.component';
import { GoldSafeMasterComponent } from './master/gold-safe-master/gold-safe-master.component';
import { GoldLoanMasterComponent } from './master/gold-loan-master/gold-loan-master.component';
import { GoldLoanSlabMasterComponent } from './master/gold-loan-slab-master/gold-loan-slab-master.component';
// import { LoanOpenNewComponent } from './loan/loan-open-new/loan-open-new.component';
// import { InterestRateMasterComponent } from './loan/masters/interest-rate-master/interest-rate-master.component';
// import { AgentCollectionPostingComponent } from './deposit/ddsExportImport/agent-collection-posting/agent-collection-posting.component';
// import { AgentMasterComponent } from './deposit/masters/agent-master/agent-master.component';
// import { GoldLoanOpeningRepComponent } from './loan/report/gold-loan-opening-rep/gold-loan-opening-rep.component';
// import { GoldLoanClosingRepComponent } from './loan/report/gold-loan-closing-rep/gold-loan-closing-rep.component';
// import { GoldLoanDefaulterRepComponent } from './loan/report/gold-loan-defaulter-rep/gold-loan-defaulter-rep.component';
// import { TransactionPrintComponent } from './finance/transactionprint/transaction-print.component';
// import { MemberListSummaryComponent } from './UCIC/Report/member-list-summary/member-list-summary.component';
// import { DetailDepositSummaryComponent } from './deposit/report/detail-deposit-summary/detail-deposit-summary.component';
// import { DetailLoanSummaryComponent } from './loan/report/detail-loan-summary/detail-loan-summary.component';
// import { LoanDisbSummaryComponent } from './loan/report/loan-disb-summary/loan-disb-summary.component';
// import { DcbComponent } from './loan/report/DCB/dcb.component';
// import { LoanDisbSumNewMemComponent } from './loan/report/loan-disb-sum-new-mem/loan-disb-sum-new-mem.component';
import { YearlyProvisionPostingComponent } from './finance/yearly-provision-posting/yearly-provision-posting.component';
import { AssetsManagementComponent } from './assets-management/assets-management.component';
import { AnextureEntryComponent } from './assets-management/master/anexture-entry/anexture-entry.component';
import { SubAnextureEntryComponent } from './assets-management/master/sub-anexture-entry/sub-anexture-entry.component';
import { TransAssetsComponent } from './assets-management/transaction/trans-assets.component';
import { CalDepPostComponent } from './assets-management/cal-dep-post/cal-dep-post.component';
import { AndroidPostingComponent } from './deposit/ddsExportImport/android-posting/android-posting.component';
import { ConsoDtlListFdMisComponent } from './deposit/report/conso-dtl-list-fd-mis/conso-dtl-list-fd-mis.component';
import { ConsoDtlListSbcaComponent } from './deposit/report/conso-dtl-list-sbca/conso-dtl-list-sbca.component';
import { ConsoDtlListRdComponent } from './deposit/report/conso-dtl-list-rd/conso-dtl-list-rd.component';

const routes: Routes = [
  { path: 'Admin', component: AdminPanelComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: 'AdmLogin', component: AdminLoginComponent },
  { path: 'Loan', component: OpenLoanAccountComponent },
  { path: 'te-st3', component: TransTransactionComponent },
  { path: 'te-st1', component: TransactionapprovalComponent },
  { path: 'te-st2', component: AccounTransactionsComponent },
  { path: 'te-st4', component: LoanTransactionApprovalComponent },
  { path: 'te-st5', component: LoanaccountTransactionComponent },
  { path: 'te-st', component: UTCustomerProfileComponent },
  { path: 't6', component: AccOpeningComponent },
  { path: 't7', component: AccOpeningViewComponent },
  { path: 't8', component: SystemParameterUpdateComponent },
  { path: 'BankConfig', component: BankConfigComponent },
  { path: 'BankWiseConfig', component: BankWiseConfigComponent },
  { path: 'MasterMenuConfig', component: MasterMenuConfigComponent },
  { path: 'ConfigNewBank', component: ConfigNewBankComponent },

  {
    path: ':bankName', component: BankResolverComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full'},
      { path: 'login', component: LoginComponent },
      // { path: 'la', component: LandingComponent, canActivate: [AuthGuard] },
      { path: 'la', component: LandingComponent, canActivate: [AuthGuard] },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'denomination', component: DenominationComponent },
      { path: 'FT_Y_PROV_POST', component: YearlyProvisionPostingComponent },
      
      // { path: 'UT_Contai_CustomerProfile', component: ContaiUCICprofileComponent, canActivate: [AuthGuard] },
      // { path: 'DT_Dt_Sum', component: DetailDepositSummaryComponent, canActivate: [AuthGuard] },
      // { path: 'LT_Dt_Sum', component: DetailLoanSummaryComponent, canActivate: [AuthGuard] },
      // { path: 'LT_Disb_Sum', component: LoanDisbSummaryComponent, canActivate: [AuthGuard] },
      // { path: 'LT_DCB', component: DcbComponent, canActivate: [AuthGuard] },
      // { path: 'LT_DISB_NEW_MEM', component: LoanDisbSumNewMemComponent, canActivate: [AuthGuard] },
      { path: 'UT_CustomerProfile', component: UTCustomerProfileComponent, canActivate: [AuthGuard] },
      { path: 'UT_UCIC_MRG', component: UcicMergeComponent, canActivate: [AuthGuard] },
      { path: 'UT_SelfHelp', component: UTSelfHelpComponent, canActivate: [AuthGuard] },
      // { path: 'UR_MemList_Sum', component: MemberListSummaryComponent, canActivate: [AuthGuard] },
      { path: 'UR_MemberList', component: MemberListComponent, canActivate: [AuthGuard] },
      { path: 'FT_Voucher', component: VoucherComponent, canActivate: [AuthGuard] },
      { path: 'FT_ApproveTrns', component: VoucherapprovalComponent, canActivate: [AuthGuard] },
      { path: 'FT_PrintVoucher', component: VoucherprintComponent, canActivate: [AuthGuard] },
      { path: 'FT_YearlyVoucher', component:YearlyadjustmentvoucherComponent, canActivate: [AuthGuard] },
      { path: 'FT_BackdateVoucher', component: BakdatevoucherComponent, canActivate: [AuthGuard] },
      { path: 'FR_DayBook', component: DailybookComponent, canActivate: [AuthGuard] },
      { path: 'FR_GL_Vou_Dtls', component: GlWiseVoucherDtlsComponent, canActivate: [AuthGuard] },
      { path: 'FT_CreateGlHead', component: CreateGLHeadComponent, canActivate: [AuthGuard] },
      { path: 'FR_CashAccount', component: CashaccountComponent, canActivate: [AuthGuard] },
      { path: 'FR_CashAccount2', component: Cashaccount2Component, canActivate: [AuthGuard] },
      { path: 'FR_ConsoCashAccount2', component: ConsoleCashaccount2Component, canActivate: [AuthGuard] },
      { path: 'FR_CdDayBook', component: ConsolidatedDayBookComponent, canActivate: [AuthGuard] },
      { path: 'FR_DayBookNew', component: DailybookNewComponent, canActivate: [AuthGuard] },
      { path: 'FR_consoDayBookNew', component: ConsolidatedDailybookNewComponent, canActivate: [AuthGuard] },
       
      { path: 'DR_DLFDMIS_CONSO', component: ConsoDtlListFdMisComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLSBCA_CONSO', component: ConsoDtlListSbcaComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLRD_CONSO', component: ConsoDtlListRdComponent, canActivate: [AuthGuard] },
      
      { path: 'FR_CdCashAccount', component: ConsolidatedCashAccComponent, canActivate: [AuthGuard] },
      { path: 'FR_CdTrialBalance', component: ConsolidatedTrialBalanceComponent, canActivate: [AuthGuard] },
      { path: 'FR_CdCashCumTrial', component: ConsolidatedCashCumTrialComponent, canActivate: [AuthGuard] },
      { path: 'FR_CdCCTrial', component: ConsoCCTrialComponent, canActivate: [AuthGuard] },
      { path: 'FR_CashCumTrial', component: CashcumtrialComponent, canActivate: [AuthGuard] },
      { path: 'FR_TrialBalance', component: TrialbalanceComponent, canActivate: [AuthGuard] },
      { path: 'FR_GeneralLadger', component: GenLedgerComponent, canActivate: [AuthGuard] },
      { path: 'FR_GeneralLadger_conso', component: ConsoGenLedgerComponent, canActivate: [AuthGuard] },
      { path: 'FR_DayScrollBook', component: ScrollbookComponent, canActivate: [AuthGuard] },
      { path: 'FR_allGLHead', component: AllGLDetailsComponent, canActivate: [AuthGuard] },
      { path: 'FR_CdBalanceSheet', component: ConsoBalSheetComponent, canActivate: [AuthGuard] },
      { path: 'FR_CdCashAccNew', component: ConsoCashAccNewComponent, canActivate: [AuthGuard] },
      // { path: 'DM_Agent', component: AgentMasterComponent, canActivate: [AuthGuard] },
      
      { path: 'UM_UTransfer', component: UserTransferComponent, canActivate: [AuthGuard] },
      
      { path: 'FR_GLTD', component: GenLedger2Component, canActivate: [AuthGuard] },
      { path: 'FR_CdGlTrns', component: ConsoGLTrnsComponent, canActivate: [AuthGuard] },
      { path: 'DT_ApproveTran', component: TransactionapprovalComponent, canActivate: [AuthGuard] },
      { path: 'DT_AccTrans', component: AccounTransactionsComponent, canActivate: [AuthGuard] },
      { path: 'DT_CloseAccDtls', component: CloseAccDtlsComponent, canActivate: [AuthGuard] },
      { path: 'DT_OpenAcc', component: AccOpeningComponent, canActivate: [AuthGuard] },
      // { path: 'DT_Agent_Coll_Post', component: AgentCollectionPostingComponent, canActivate: [AuthGuard] },
      { path: 'DA_DayInit', component: DayinitializationComponent, canActivate: [AuthGuard] },
      { path: 'DA_DayCmpl', component: DaycomplitionComponent, canActivate: [AuthGuard] },
      { path: 'UM_AddUsr', component: AdduserComponent, canActivate: [AuthGuard] },
      { path: 'UM_UpLogStatus', component: UserLoginStatusComponent, canActivate: [AuthGuard] },
      { path: 'UM_UPermission', component: UserPermissionComponent, canActivate: [AuthGuard] },
      
      { path: 'LT_demandSMS', component: SendSmsFromDemandComponent, canActivate: [AuthGuard] },
      { path: 'LT_GoldTest', component: GoldTestAndValuationReportComponent, canActivate: [AuthGuard] },
      { path: 'LT_OpenLoanAccNew', component: OpenLoanAccountComponent, canActivate: [AuthGuard] },
      // { path: 'LT_OpenLoanAccNew', component: LoanOpenNewComponent, canActivate: [AuthGuard] },
      { path: 'LT_LoanTrans', component: LoanaccountTransactionComponent, canActivate: [AuthGuard] },
      { path: 'LT_CalcIntt', component: LoanAccwiseinttcalcComponent, canActivate: [AuthGuard] },
      { path: 'LT_Subsidy', component: SubsidyEntryComponent, canActivate: [AuthGuard] },
      { path: 'LT_OTS', component: OnetimesettlementComponent, canActivate: [AuthGuard] },
      { path: 'LT_YDR', component: YearendDemandRecoveryComponent, canActivate: [AuthGuard] },
      { path: 'LT_LoanAprv', component: LoanTransactionApprovalComponent, canActivate: [AuthGuard] },
      { path: 'LT_RECOV_EXPORT', component: RecoveryExportComponent, canActivate: [AuthGuard] },
      { path: 'LT_RECOV_IMPORT', component: RecoveryImportComponent, canActivate: [AuthGuard] },
      { path: 'LT_RECOV_INDPOST', component: RecoveryIndiPostComponent, canActivate: [AuthGuard] },
      { path: 'LM_Kccmember', component: KccmemberdtlsComponent, canActivate: [AuthGuard] },
      { path: 'DT_AccLockUnlock', component: LienAccLockUnlockComponent, canActivate: [AuthGuard] },
      { path: 'UR_Networth', component: NetworthStatementComponent, canActivate: [AuthGuard] },
      { path: 'DR_SubCashBook', component: SubCashBookComponent, canActivate: [AuthGuard] },
      { path: 'DR_UserWiseTrans', component: UserWiseTransactionComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLS', component: DetailListSBCAComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLR', component: DetailListRDComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLF', component: DetailListFDMISComponent, canActivate: [AuthGuard] },
      { path: 'DR_DLF_CONST', component: DetailListFdmisConstWiseComponent, canActivate: [AuthGuard] },
      { path: 'DR_DL_SBCA_CONST', component: DetailListSbcaConstWiseComponent, canActivate: [AuthGuard] },
      { path: 'DR_ASS', component: AccStmtSBCAComponent, canActivate: [AuthGuard] },
      { path: 'DR_ASR', component: AccStmtRDComponent, canActivate: [AuthGuard] },
      { path: 'DR_ASF', component: AccStmtTDComponent, canActivate: [AuthGuard] },
      { path: 'DM_Int_Mst', component: InterestMasterComponent, canActivate: [AuthGuard] },
      // { path: 'LM_IntRT_Mst', component: InterestRateMasterComponent, canActivate: [AuthGuard] },
      { path: 'DR_NearMatReport', component: NearMaturityReportComponent, canActivate: [AuthGuard] },
      { path: 'DR_OpenCloseReg', component: OpenClosingRegisterComponent, canActivate: [AuthGuard] },
      { path: 'DR_ACCSTMTDDS', component: DdsAccStmtComponent, canActivate: [AuthGuard] },
      { path: 'LR_BMLoanStmt', component: BMLoanStatementComponent, canActivate: [AuthGuard] },
      { path: 'LR_LoanStmt', component: LoanStatementComponent, canActivate: [AuthGuard] },
      { path: 'LR_DtlLst', component: DetailListComponent, canActivate: [AuthGuard] },
      { path: 'LR_UserWiseTrans', component: UserWiseTransactionLoanComponent, canActivate: [AuthGuard] },
      { path: 'LR_DlistAll', component: DetaillistAllComponent, canActivate: [AuthGuard] },
      { path: 'LR_DflLst', component: DefaulterListComponent, canActivate: [AuthGuard] },
      { path: 'LR_DMLst', component: DemandListComponent, canActivate: [AuthGuard] },
      { path: 'LR_DMLstUpdated', component: UpdatedDemandListComponent, canActivate: [AuthGuard] },
      { path: 'LR_AMLst', component: ActwiseLstComponent, canActivate: [AuthGuard] },
      { path: 'LR_BMLst', component: BlockwiseLstComponent, canActivate: [AuthGuard] },
      { path: 'LR_DCBR_P', component: DcbrPrintComponent, canActivate: [AuthGuard] },
      { path: 'LR_DCBR_VILL_WISE', component: DcbrVillWiseComponent, canActivate: [AuthGuard] },
      { path: 'LR_DCBR_GROUP_WISE', component: DcbrGroupWiseComponent, canActivate: [AuthGuard] },
      { path: 'LR_RELst', component: RecovListComponent, canActivate: [AuthGuard] },
      { path: 'LR_DisReg', component: LoanDisbursementRegisterComponent, canActivate: [AuthGuard] },
      { path: 'LR_DisNorm', component: LoanDisburseNormalComponent, canActivate: [AuthGuard] },
      { path: 'LR_DisConso', component: LoanDisburseConsoComponent, canActivate: [AuthGuard] },
      { path: 'LR_DisAll', component: LoanDisburseActWiseComponent, canActivate: [AuthGuard] },
      { path: 'LR_DisSum', component: LoanDisburseSummaryComponent, canActivate: [AuthGuard] },
      { path: 'LR_AWISECol', component: ActWiseColLstComponent, canActivate: [AuthGuard] },
      { path: 'LR_BWISECol', component: BlockWiseColLstComponent, canActivate: [AuthGuard] },
      { path: 'LR_AdvRec', component: AdRecStmtComponent, canActivate: [AuthGuard] },
      { path: 'LR_intRec', component: IntRecStmtComponent, canActivate: [AuthGuard] },
      { path: 'DM_Cert_Print_U', component: BlockMasterComponent, canActivate: [AuthGuard] },
      { path: 'LM_PoEntry', component: ServiceareamasterComponent, canActivate: [AuthGuard] },
      { path: 'LM_Villentry', component: VillageMasterComponent, canActivate: [AuthGuard] },
      { path: 'LM_Villentry_contai', component: VillMasterContaiComponent, canActivate: [AuthGuard] },
      { path: 'LR_NPA', component: NpaComponent, canActivate: [AuthGuard] },
      { path: 'LR_Int_Subsidy', component: InterestSubsidyComponent, canActivate: [AuthGuard] },
      { path: 'LR_Int_Subsidy_Sum', component: InterestSubsidySummaryComponent, canActivate: [AuthGuard] },
      { path: 'LR_GM_Int_Subsidy', component: GmLoanSubsidyComponent, canActivate: [AuthGuard] },
      { path: 'LR_Disb_Cert', component: LoanDisbCertificateComponent, canActivate: [AuthGuard] },
      { path: 'LR_GM_DC', component: GMloanDCComponent, canActivate: [AuthGuard] },
      { path: 'LR_Conso_DC', component: ConsoLoanDCComponent, canActivate: [AuthGuard] },
      { path: 'LR_SHG_Conso_DC', component: ConsoLoanDcSHGComponent, canActivate: [AuthGuard] },
      { path: 'LR_RH_Conso_DC', component: ConsoLoanDcRHComponent, canActivate: [AuthGuard] },
      { path: 'LR_CT_DC', component: CTloanDCComponent, canActivate: [AuthGuard] },
      { path: 'LR_NPA_Sum', component: NpaSummaryComponent, canActivate: [AuthGuard] },
      { path: 'LR_FN_Return', component: FortnightlyReturnComponent, canActivate: [AuthGuard] },
      { path: 'LR_Conso_FN_Return', component: ConsoFortnightlyReturnComponent, canActivate: [AuthGuard] },
      { path: 'LR_NPA_ALL', component: NpaALLComponent, canActivate: [AuthGuard] },
      { path: 'LR_Risk_Fund', component: RiskFundComponent, canActivate: [AuthGuard] },
      { path: 'LR_NPA_ALL_GROUP', component: NpaAllWithGroupComponent, canActivate: [AuthGuard] },
      { path: 'LR_GOLD_REP', component: GoldLoanReportComponent, canActivate: [AuthGuard] },
      { path: 'LR_GOLD_REP_ASON', component: GoldLoanAsOnDateComponent, canActivate: [AuthGuard] },
      { path: 'LR_GOLD_REP_CURR', component: GoldLoanCurrDateComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecReg', component: RecoveryRegisterComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecRegACCTYPE', component: RecovRegAccTypeWiseComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecRegConso', component: LoanRecoveryConsoComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecRegFund', component: RecovFundComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecRegGP', component: GroupWiseComponent },
      { path: 'LR_RecRegVill', component: RecovVillageComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecRegBlock', component: RecovBlockComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecRegNorm', component: RecovNormalComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecRegSumm', component: RecovSummaryComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecAdvPrnBlock', component: RecovAdvPrnComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecAdvPrnVill', component: RecovAdvPrnVillComponent, canActivate: [AuthGuard] },
      { path: 'LR_RecInterest', component: RecovInterestComponent, canActivate: [AuthGuard] },
      { path: 'LR_openClose', component: OpenCloseregComponent, canActivate: [AuthGuard] },
      { path: 'LR_SubCashBk', component: LoanSubCashBookComponent, canActivate: [AuthGuard] },
      { path: 'LR_Int_Subsidy_SHG', component: InterestSubsidySHGComponent, canActivate: [AuthGuard] },
      { path: 'DT_OpenAccView', component: AccOpeningViewComponent, canActivate: [AuthGuard] },
      { path: 'DT_NEFTPayment', component: NeftOutwardComponent, canActivate: [AuthGuard] },
      { path: 'DT_DDEXPORT', component: DdsExportComponent, canActivate: [AuthGuard] },
      { path: 'DT_DDIMPORT', component: DdsImportComponent, canActivate: [AuthGuard] },
      { path: 'DR_DDS_COL_REP', component: DdsAgentTransReportComponent, canActivate: [AuthGuard] },
      { path: 'DT_DDINDPOST', component: DdsIndividualPostingComponent, canActivate: [AuthGuard] },
      { path: 'DT_AndroidPOST', component: AndroidPostingComponent, canActivate: [AuthGuard] },
      { path: 'DT_SavingInttPost', component: SavingIntPostComponent, canActivate: [AuthGuard] },
      { path: 'DT_SMSchargeDed', component: SmsChargeDeductionComponent, canActivate: [AuthGuard] },
      { path: 'DT_AgentComPost', component: AgentCommissionComponent, canActivate: [AuthGuard] },
      { path: 'DR_NeftIn', component: NeftInwardReportComponent, canActivate: [AuthGuard] },
      { path: 'DR_NeftOut', component: NeftOutwardReportComponent, canActivate: [AuthGuard] },
      { path: 'DR_PCertificate', component: PrintCertificateComponent, canActivate: [AuthGuard] },
      { path: 'DR_InttCertificate', component: InterestCertificateComponent, canActivate: [AuthGuard] },
      // { path: 'LR_GOLD_OPEN_REP', component: GoldLoanOpeningRepComponent, canActivate: [AuthGuard] },
      // { path: 'LR_GOLD_CLOSE_REP', component: GoldLoanClosingRepComponent, canActivate: [AuthGuard] },
      // { path: 'LR_GOLD_DEFAULTER_REP', component: GoldLoanDefaulterRepComponent, canActivate: [AuthGuard] },
      
      { path: 'DR_PbkPrn', component: PassBookPrintingComponent,
        children: [{ path: 'DR_PassBookFastPage', component: PassBookFastPageComponent},], canActivate: [AuthGuard] },
      { path: 'DR_contai_PbkPrn', component: ContaiComponent,
        children: [{ path: 'DR_contai_PassBookFastPage', component: ContaiFastPageComponent},], canActivate: [AuthGuard] },
      
      { path: 'DR_tamluk_PbkPrn', component: TamlukComponent,
        children: [{ path: 'DR_tamluk_PassBookFastPage', component: TamlukFastPageComponent},], canActivate: [AuthGuard] },
        
      { path: 'DR_bankura_PbkPrn', component: BankuraComponent,
        children: [{ path: 'DR_bankura_PassBookFastPage', component: BankuraFastPageComponent},], canActivate: [AuthGuard] },
      
      { path: 'DR_ghatal_PbkPrn', component: GhatalComponent,
          children: [{ path: 'DR_ghatal_PassBookFastPage', component: GhatalFastPageComponent},], canActivate: [AuthGuard] },
      
      
      { path: 'DR_UpbkPrnSts', component: UpdatePassbookComponent, canActivate: [AuthGuard]},


      { path: 'DR_LoanPbkPrn', component: LoanPassBookPrintingComponent,
      children: [
      { path: 'DR_LoanPassBookFastPage', component: LoanPassBookFastPageComponent},], canActivate: [AuthGuard] },

      { path: 'DR_LoanUpbkPrnSts', component: LoanUpdatePassbookComponent, canActivate: [AuthGuard]},

      { path: 'DR_Act_SI_List', component: StandingInsActiveSIListComponent, canActivate: [AuthGuard] },
      { path: 'DR_Today_SI_Exec', component: StandingInsTodaySIExecutedComponent, canActivate: [AuthGuard] },
      { path: 'DR_DDS', component: DetailDDSComponent, canActivate: [AuthGuard] },
      { path: 'DR_SlbWisDeposit', component: SlabwiseDepositComponent, canActivate: [AuthGuard] },
      { path: 'SYS_PARAM', component: SystemParameterUpdateComponent, canActivate: [AuthGuard] },
      { path: 'DA_YearOpn', component: YearopenComponent, canActivate: [AuthGuard] },
      { path: 'DA_YearCls', component: YearcloseComponent, canActivate: [AuthGuard] },
      { path: 'TT_TransEntry', component: TransTransactionComponent, canActivate: [AuthGuard] },
      { path: 'TT_TransApprove', component: TransApproveComponent, canActivate: [AuthGuard] },
      { path: 'FR_BalanceSheet', component: BalanaceSheetComponent, canActivate: [AuthGuard] },
      { path: 'FR_BalanceSheetNew', component: BalanaceSheetNewComponent, canActivate: [AuthGuard] },
      { path: 'FR_PL_New', component: ProfitAndLossNewComponent, canActivate: [AuthGuard] },
      { path: 'FR_Conso_PL_New', component: ConsoProfitAndLossNewComponent, canActivate: [AuthGuard] },
      { path: 'FR_ConsoBalanceSheetNew', component: ConsoBalanaceSheetNewComponent, canActivate: [AuthGuard] },
      { path: 'LR_DemandNotice', component: DemandNoticeComponent, canActivate: [AuthGuard] },
      { path: 'LR_CT_DemandNotice', component: DemandNoticeContaiComponent, canActivate: [AuthGuard] },
      { path: 'LR_DN_Block', component: DemandNoticeBlockWiseComponent, canActivate: [AuthGuard] },
      { path: 'LR_OverdueNotice', component: OverdueNoticeComponent, canActivate: [AuthGuard] },
      { path: 'LR_OverdueTransfer', component: OverdueTransferComponent, canActivate: [AuthGuard] },
      { path: 'FR_ProfitLoss', component: ProfitLossAccComponent},
      { path: 'FR_ConsoProfitLoss', component: ConsoProfitLossComponent, canActivate: [AuthGuard] },
      { path: 'FR_Trading', component: TradingAccComponent, canActivate: [AuthGuard] },
      { path: 'FR_WeeklyReturn', component: WeeklyReturnComponent, canActivate: [AuthGuard] },
      { path: 'FR_WeeklyReturn_New', component: WeeklyReturnNewComponent, canActivate: [AuthGuard] },
      { path: 'FR_WR_New_conso', component: WeeklyReturnNewConsoComponent, canActivate: [AuthGuard] },
      { path: 'I_BankEntry', component: BankEntryComponent, canActivate: [AuthGuard] },
      { path: 'I_BranchEntry', component: BranchEntryComponent, canActivate: [AuthGuard] },
      { path: 'I_Open', component: OpenInvestComponent, canActivate: [AuthGuard] },
      { path: 'I_ViewDtls', component: VewInvestmentDtlsComponent, canActivate: [AuthGuard] },
      { path: 'I_TrnsApprov', component: InvTransactionApprovalComponent, canActivate: [AuthGuard] },
      { path: 'I_Trns', component: InvestmentTransactionsComponent, canActivate: [AuthGuard] },
      { path: 'IR_Detail_list', component: IDetailListComponent, canActivate: [AuthGuard] },
      { path: 'IR_Near_maturity', component: INearMaturityComponent, canActivate: [AuthGuard] },
      { path: 'LR_FortNightNew', component: CtFortnightNewComponent, canActivate: [AuthGuard] },
      { path: 'LR_FortNightNewConso', component: CtFortnightNewConsoComponent, canActivate: [AuthGuard] },
      { path: 'LR_letterMst', component: GoldRateMasterComponent, canActivate: [AuthGuard] },
      { path: 'LR_goldItem', component: GoldItemMasterComponent, canActivate: [AuthGuard] },
      { path: 'LR_goldSafe', component: GoldSafeMasterComponent, canActivate: [AuthGuard] },
      { path: 'LR_goldLoanMst', component: GoldLoanMasterComponent, canActivate: [AuthGuard] },
      { path: 'LR_goldSlab', component: GoldLoanSlabMasterComponent, canActivate: [AuthGuard] },
      // { path: 'FT_PrintTrans', component: TransactionPrintComponent, canActivate: [AuthGuard] },
      
      {
        path: 'locker', component: LockerComponent,
        children: [
          {
            path: 'loc_dtls',component: LoakerDetailMasterComponent,
            loadChildren: () => import('./locker/locker.module').then(m => m.LockerModule)
          },
          {
            path: 'loc_rent',component: LoakerRentMasterComponent,
            loadChildren: () => import('./locker/locker.module').then(m => m.LockerModule)
          },
          {
            path: 'lock_access',component: LockerINOUTComponent,
            loadChildren: () => import('./locker/locker.module').then(m => m.LockerModule)
          },
          {
            path: 'lock_access_rep',component: LockerAccessComponent,
            loadChildren: () => import('./locker/locker.module').then(m => m.LockerModule)
          },
          {
            path: 'lock_open',component: LockerOpeningComponent,
            loadChildren: () => import('./locker/locker.module').then(m => m.LockerModule)
          },
          {
            path: 'lock_trans',component: LockerTransactionComponent,
            loadChildren: () => import('./locker/locker.module').then(m => m.LockerModule)
          },
          {
            path: 'lock_approve',component: LockerApproveComponent,
            loadChildren: () => import('./locker/locker.module').then(m => m.LockerModule)
          },
          {
            path: 'lock_view',component: LockerViewComponent,
            loadChildren: () => import('./locker/locker.module').then(m => m.LockerModule)
          }
          ,
          {
            path: 'lock_dtls',component: LockerDetailsComponent,
            loadChildren: () => import('./locker/locker.module').then(m => m.LockerModule)
          },
          {
            path: 'lock_r_dtls',component: LockerRenewDetailsComponent,
            loadChildren: () => import('./locker/locker.module').then(m => m.LockerModule)
          },
          {
            path: 'lock_sb_renew',component: LockerShouldbeRenewComponent,
            loadChildren: () => import('./locker/locker.module').then(m => m.LockerModule)
          }
        ]
      },
      {
        path: 'borrowing', component: BorrowingComponent,
        children: [
          {
            path: 'borr_open',component: OpenBorrowingComponent,
            loadChildren: () => import('./borrowing/borrowing.module').then(m => m.BorrowingModule)
          },
          {
            path: 'borr_trans',component: TransBorrowingComponent,
            loadChildren: () => import('./borrowing/borrowing.module').then(m => m.BorrowingModule)
          },
          {
            path: 'borr_appr',component: ApproveBorrowingComponent,
            loadChildren: () => import('./borrowing/borrowing.module').then(m => m.BorrowingModule)
          },
          {
            path: 'borr_view',component: ViewBorrowingComponent,
            loadChildren: () => import('./borrowing/borrowing.module').then(m => m.BorrowingModule)
          },
          {
            path: 'borr_intt_cal',component: CalculateBorrInttComponent,
            loadChildren: () => import('./borrowing/borrowing.module').then(m => m.BorrowingModule)
          },
          {
            path: 'report/borr_dtl_list',component: BorroDetailListComponent,
            loadChildren: () => import('./borrowing/borrowing.module').then(m => m.BorrowingModule)
          }
        ]
      },
      {
        path: 'assets_manage', component: AssetsManagementComponent,
        children: [
          {
            path: 'anex_entry',component: AnextureEntryComponent,
            loadChildren: () => import('./assets-management/assets-management.module').then(m => m.AssetsManagementModule)
          },
          {
            path: 'sub_anex_entry',component: SubAnextureEntryComponent,
            loadChildren: () => import('./assets-management/assets-management.module').then(m => m.AssetsManagementModule)
          },
          {
            path: 'transaction',component: TransAssetsComponent,
            loadChildren: () => import('./assets-management/assets-management.module').then(m => m.AssetsManagementModule)
          },
          {
            path: 'cal_dep',component: CalDepPostComponent,
            loadChildren: () => import('./assets-management/assets-management.module').then(m => m.AssetsManagementModule)

          },
          // {
          //   path: 'borr_intt_cal',component: CalculateBorrInttComponent,
          //   loadChildren: () => import('./borrowing/borrowing.module').then(m => m.BorrowingModule)
          // },
          // {
          //   path: 'report/borr_dtl_list',component: BorroDetailListComponent,
          //   loadChildren: () => import('./borrowing/borrowing.module').then(m => m.BorrowingModule)
          // }
        ]
      },
      {
        path: 'finance', component: FinanceComponent,
        children: [
          { path: 'voucher', component: VoucherComponent },
          // { path: 'voucherNew', component: VoucherNewComponent },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),LockerRoutingModule],
  exports: [RouterModule],
  providers:[CommonServiceService]
})

export class BankResolverRouting { }
