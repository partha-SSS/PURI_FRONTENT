import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldLoanReportComponent } from './gold-loan-report.component';

describe('GoldLoanReportComponent', () => {
  let component: GoldLoanReportComponent;
  let fixture: ComponentFixture<GoldLoanReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldLoanReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldLoanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
