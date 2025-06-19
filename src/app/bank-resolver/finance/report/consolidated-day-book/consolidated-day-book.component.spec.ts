import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedDayBookComponent } from './consolidated-day-book.component';

describe('ConsolidatedDayBookComponent', () => {
  let component: ConsolidatedDayBookComponent;
  let fixture: ComponentFixture<ConsolidatedDayBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedDayBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedDayBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
