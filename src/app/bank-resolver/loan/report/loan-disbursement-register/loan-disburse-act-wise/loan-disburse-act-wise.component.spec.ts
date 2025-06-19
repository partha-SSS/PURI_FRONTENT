import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDisburseActWiseComponent } from './loan-disburse-act-wise.component';

describe('LoanDisburseActWiseComponent', () => {
  let component: LoanDisburseActWiseComponent;
  let fixture: ComponentFixture<LoanDisburseActWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDisburseActWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDisburseActWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
