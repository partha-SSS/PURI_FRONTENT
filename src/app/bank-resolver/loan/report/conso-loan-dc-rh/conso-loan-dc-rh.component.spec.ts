import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoLoanDcRHComponent } from './conso-loan-dc-rh.component';

describe('ConsoLoanDcRHComponent', () => {
  let component: ConsoLoanDcRHComponent;
  let fixture: ComponentFixture<ConsoLoanDcRHComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsoLoanDcRHComponent]
    });
    fixture = TestBed.createComponent(ConsoLoanDcRHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
