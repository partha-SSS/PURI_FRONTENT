import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvTransactionApprovalComponent } from './inv-transaction-approval.component';

describe('InvTransactionApprovalComponent', () => {
  let component: InvTransactionApprovalComponent;
  let fixture: ComponentFixture<InvTransactionApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvTransactionApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvTransactionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
