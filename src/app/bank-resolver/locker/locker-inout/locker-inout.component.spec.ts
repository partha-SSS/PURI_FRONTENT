import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockerINOUTComponent } from './locker-inout.component';

describe('LockerINOUTComponent', () => {
  let component: LockerINOUTComponent;
  let fixture: ComponentFixture<LockerINOUTComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LockerINOUTComponent]
    });
    fixture = TestBed.createComponent(LockerINOUTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
