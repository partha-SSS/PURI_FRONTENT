import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldLoanCurrDateComponent } from './gold-loan-curr-date.component';

describe('GoldLoanCurrDateComponent', () => {
  let component: GoldLoanCurrDateComponent;
  let fixture: ComponentFixture<GoldLoanCurrDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldLoanCurrDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldLoanCurrDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
