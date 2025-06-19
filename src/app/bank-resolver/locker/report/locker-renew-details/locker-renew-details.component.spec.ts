import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockerRenewDetailsComponent } from './locker-renew-details.component';

describe('LockerRenewDetailsComponent', () => {
  let component: LockerRenewDetailsComponent;
  let fixture: ComponentFixture<LockerRenewDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockerRenewDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockerRenewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
