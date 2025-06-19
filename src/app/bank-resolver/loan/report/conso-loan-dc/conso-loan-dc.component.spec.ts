import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoLoanDCComponent } from './conso-loan-dc.component';

describe('ConsoLoanDCComponent', () => {
  let component: ConsoLoanDCComponent;
  let fixture: ComponentFixture<ConsoLoanDCComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsoLoanDCComponent]
    });
    fixture = TestBed.createComponent(ConsoLoanDCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
