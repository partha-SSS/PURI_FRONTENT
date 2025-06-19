import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldLoanAsOnDateComponent } from './gold-loan-as-on-date.component';

describe('GoldLoanAsOnDateComponent', () => {
  let component: GoldLoanAsOnDateComponent;
  let fixture: ComponentFixture<GoldLoanAsOnDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldLoanAsOnDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldLoanAsOnDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
