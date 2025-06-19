import { ComponentFixture, TestBed } from '@angular/core/testing';

import { flexiAgentWiseReportComponent } from './flexi-small-agent-wise-report.component';

describe('flexiAgentWiseReportComponent', () => {
  let component: flexiAgentWiseReportComponent;
  let fixture: ComponentFixture<flexiAgentWiseReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [flexiAgentWiseReportComponent]
    });
    fixture = TestBed.createComponent(flexiAgentWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
