import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseTransactionLoanComponent } from './user-wise-transaction-loan.component';

describe('UserWiseTransactionLoanComponent', () => {
  let component: UserWiseTransactionLoanComponent;
  let fixture: ComponentFixture<UserWiseTransactionLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserWiseTransactionLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWiseTransactionLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
