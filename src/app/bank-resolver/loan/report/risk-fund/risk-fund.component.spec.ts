import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskFundComponent } from './risk-fund.component';

describe('RiskFundComponent', () => {
  let component: RiskFundComponent;
  let fixture: ComponentFixture<RiskFundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiskFundComponent]
    });
    fixture = TestBed.createComponent(RiskFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
