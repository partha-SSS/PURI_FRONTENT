import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentTransactionsComponent } from './investment-transactions.component';

describe('InvestmentTransactionsComponent', () => {
  let component: InvestmentTransactionsComponent;
  let fixture: ComponentFixture<InvestmentTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
