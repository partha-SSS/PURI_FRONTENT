import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdsAgentTransReportComponent } from './dds-agent-trans-report.component';

describe('DdsAgentTransReportComponent', () => {
  let component: DdsAgentTransReportComponent;
  let fixture: ComponentFixture<DdsAgentTransReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdsAgentTransReportComponent]
    });
    fixture = TestBed.createComponent(DdsAgentTransReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
