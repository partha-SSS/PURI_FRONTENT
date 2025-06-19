import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockerAccessComponent } from './locker-access.component';

describe('LockerAccessComponent', () => {
  let component: LockerAccessComponent;
  let fixture: ComponentFixture<LockerAccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LockerAccessComponent]
    });
    fixture = TestBed.createComponent(LockerAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
