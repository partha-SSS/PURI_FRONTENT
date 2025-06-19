import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseTransactionComponent } from './user-wise-transaction.component';

describe('UserWiseTransactionComponent', () => {
  let component: UserWiseTransactionComponent;
  let fixture: ComponentFixture<UserWiseTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserWiseTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWiseTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
