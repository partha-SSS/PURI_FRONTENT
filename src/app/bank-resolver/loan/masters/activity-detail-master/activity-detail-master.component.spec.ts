import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDetailMasterComponent } from './activity-detail-master.component';

describe('ActivityDetailMasterComponent', () => {
  let component: ActivityDetailMasterComponent;
  let fixture: ComponentFixture<ActivityDetailMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityDetailMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDetailMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
