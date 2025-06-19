import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandNoticeBlockWiseComponent } from './demand-notice-block-wise.component';

describe('DemandNoticeBlockWiseComponent', () => {
  let component: DemandNoticeBlockWiseComponent;
  let fixture: ComponentFixture<DemandNoticeBlockWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandNoticeBlockWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandNoticeBlockWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
