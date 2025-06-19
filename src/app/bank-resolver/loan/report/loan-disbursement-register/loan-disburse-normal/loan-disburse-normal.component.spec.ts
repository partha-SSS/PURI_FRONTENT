import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDisburseNormalComponent } from './loan-disburse-normal.component';

describe('LoanDisburseNormalComponent', () => {
  let component: LoanDisburseNormalComponent;
  let fixture: ComponentFixture<LoanDisburseNormalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDisburseNormalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDisburseNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
