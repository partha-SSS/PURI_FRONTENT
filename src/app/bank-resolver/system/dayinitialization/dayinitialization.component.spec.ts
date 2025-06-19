import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayinitializationComponent } from './dayinitialization.component';

describe('DayinitializationComponent', () => {
  let component: DayinitializationComponent;
  let fixture: ComponentFixture<DayinitializationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayinitializationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayinitializationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
