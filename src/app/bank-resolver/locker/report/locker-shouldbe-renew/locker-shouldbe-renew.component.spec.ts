import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockerShouldbeRenewComponent } from './locker-shouldbe-renew.component';

describe('LockerShouldbeRenewComponent', () => {
  let component: LockerShouldbeRenewComponent;
  let fixture: ComponentFixture<LockerShouldbeRenewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockerShouldbeRenewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockerShouldbeRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
