import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecovSummaryComponent } from './recov-summary.component';

describe('RecovSummaryComponent', () => {
  let component: RecovSummaryComponent;
  let fixture: ComponentFixture<RecovSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecovSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecovSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
