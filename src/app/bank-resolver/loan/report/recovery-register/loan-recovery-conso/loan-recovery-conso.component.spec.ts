import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRecoveryConsoComponent } from './loan-recovery-conso.component';

describe('LoanRecoveryConsoComponent', () => {
  let component: LoanRecoveryConsoComponent;
  let fixture: ComponentFixture<LoanRecoveryConsoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanRecoveryConsoComponent]
    });
    fixture = TestBed.createComponent(LoanRecoveryConsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
