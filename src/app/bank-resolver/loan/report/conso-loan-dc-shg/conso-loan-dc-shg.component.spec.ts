import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoLoanDcSHGComponent } from './conso-loan-dc-shg.component';

describe('ConsoLoanDcSHGComponent', () => {
  let component: ConsoLoanDcSHGComponent;
  let fixture: ComponentFixture<ConsoLoanDcSHGComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsoLoanDcSHGComponent]
    });
    fixture = TestBed.createComponent(ConsoLoanDcSHGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
