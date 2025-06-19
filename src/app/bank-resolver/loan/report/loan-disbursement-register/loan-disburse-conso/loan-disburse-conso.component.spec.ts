import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDisburseConsoComponent } from './loan-disburse-conso.component';

describe('LoanDisburseConsoComponent', () => {
  let component: LoanDisburseConsoComponent;
  let fixture: ComponentFixture<LoanDisburseConsoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanDisburseConsoComponent]
    });
    fixture = TestBed.createComponent(LoanDisburseConsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
