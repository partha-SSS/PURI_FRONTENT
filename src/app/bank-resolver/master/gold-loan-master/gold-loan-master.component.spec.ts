import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldLoanMasterComponent } from './gold-loan-master.component';

describe('GoldLoanMasterComponent', () => {
  let component: GoldLoanMasterComponent;
  let fixture: ComponentFixture<GoldLoanMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoldLoanMasterComponent]
    });
    fixture = TestBed.createComponent(GoldLoanMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
