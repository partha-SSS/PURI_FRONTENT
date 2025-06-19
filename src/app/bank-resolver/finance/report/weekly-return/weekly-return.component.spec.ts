import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReturnComponent } from './weekly-return.component';

describe('WeeklyReturnComponent', () => {
  let component: WeeklyReturnComponent;
  let fixture: ComponentFixture<WeeklyReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
