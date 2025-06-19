import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockerApproveComponent } from './locker-approve.component';

describe('LockerApproveComponent', () => {
  let component: LockerApproveComponent;
  let fixture: ComponentFixture<LockerApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockerApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockerApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
