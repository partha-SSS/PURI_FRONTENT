import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockerOpeningComponent } from './locker-opening.component';

describe('LockerOpeningComponent', () => {
  let component: LockerOpeningComponent;
  let fixture: ComponentFixture<LockerOpeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockerOpeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockerOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
