import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedTrialBalanceComponent } from './consolidated-trial-balance.component';

describe('ConsolidatedTrialBalanceComponent', () => {
  let component: ConsolidatedTrialBalanceComponent;
  let fixture: ComponentFixture<ConsolidatedTrialBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedTrialBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedTrialBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
