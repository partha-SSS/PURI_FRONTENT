import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAccwiseinttcalcComponent } from './loan-accwiseinttcalc.component';

describe('LoanAccwiseinttcalcComponent', () => {
  let component: LoanAccwiseinttcalcComponent;
  let fixture: ComponentFixture<LoanAccwiseinttcalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanAccwiseinttcalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanAccwiseinttcalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
