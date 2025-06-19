import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandNoticeContaiComponent } from './demand-notice-contai.component';

describe('DemandNoticeContaiComponent', () => {
  let component: DemandNoticeContaiComponent;
  let fixture: ComponentFixture<DemandNoticeContaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandNoticeContaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandNoticeContaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
