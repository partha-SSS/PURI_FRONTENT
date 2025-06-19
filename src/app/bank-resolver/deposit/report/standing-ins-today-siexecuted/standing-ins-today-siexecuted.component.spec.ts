import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingInsTodaySIExecutedComponent } from './standing-ins-today-siexecuted.component';

describe('StandingInsTodaySIExecutedComponent', () => {
  let component: StandingInsTodaySIExecutedComponent;
  let fixture: ComponentFixture<StandingInsTodaySIExecutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandingInsTodaySIExecutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandingInsTodaySIExecutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
