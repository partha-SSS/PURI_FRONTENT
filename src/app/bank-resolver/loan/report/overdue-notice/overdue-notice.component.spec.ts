import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueNoticeComponent } from './overdue-notice.component';

describe('OverdueNoticeComponent', () => {
  let component: OverdueNoticeComponent;
  let fixture: ComponentFixture<OverdueNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdueNoticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
