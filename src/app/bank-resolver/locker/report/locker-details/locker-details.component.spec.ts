import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockerDetailsComponent } from './locker-details.component';

describe('LockerDetailsComponent', () => {
  let component: LockerDetailsComponent;
  let fixture: ComponentFixture<LockerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
