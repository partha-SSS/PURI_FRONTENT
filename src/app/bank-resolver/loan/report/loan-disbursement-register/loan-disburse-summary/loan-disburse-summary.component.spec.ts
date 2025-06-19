import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDisburseSummaryComponent } from './loan-disburse-summary.component';

describe('LoanDisburseSummaryComponent', () => {
  let component: LoanDisburseSummaryComponent;
  let fixture: ComponentFixture<LoanDisburseSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanDisburseSummaryComponent]
    });
    fixture = TestBed.createComponent(LoanDisburseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
