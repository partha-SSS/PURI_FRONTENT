import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateBorrInttComponent } from './calculate-borr-intt.component';

describe('CalculateBorrInttComponent', () => {
  let component: CalculateBorrInttComponent;
  let fixture: ComponentFixture<CalculateBorrInttComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculateBorrInttComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateBorrInttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
