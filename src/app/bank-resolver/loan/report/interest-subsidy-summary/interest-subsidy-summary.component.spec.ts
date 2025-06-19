import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestSubsidySummaryComponent } from './interest-subsidy-summary.component';

describe('InterestSubsidySummaryComponent', () => {
  let component: InterestSubsidySummaryComponent;
  let fixture: ComponentFixture<InterestSubsidySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestSubsidySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestSubsidySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
