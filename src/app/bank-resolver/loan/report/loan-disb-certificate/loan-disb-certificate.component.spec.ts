import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDisbCertificateComponent } from './loan-disb-certificate.component';

describe('LoanDisbCertificateComponent', () => {
  let component: LoanDisbCertificateComponent;
  let fixture: ComponentFixture<LoanDisbCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDisbCertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDisbCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
