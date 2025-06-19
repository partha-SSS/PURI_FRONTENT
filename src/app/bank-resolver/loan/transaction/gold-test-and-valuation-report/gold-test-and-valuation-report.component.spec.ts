import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldTestAndValuationReportComponent } from './gold-test-and-valuation-report.component';

describe('GoldTestAndValuationReportComponent', () => {
  let component: GoldTestAndValuationReportComponent;
  let fixture: ComponentFixture<GoldTestAndValuationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldTestAndValuationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldTestAndValuationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
