import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedCashCumTrialComponent } from './consolidated-cash-cum-trial.component';

describe('ConsolidatedCashCumTrialComponent', () => {
  let component: ConsolidatedCashCumTrialComponent;
  let fixture: ComponentFixture<ConsolidatedCashCumTrialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedCashCumTrialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedCashCumTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
