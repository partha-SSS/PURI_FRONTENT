import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoginStatusComponent } from './user-login-status.component';

describe('UserLoginStatusComponent', () => {
  let component: UserLoginStatusComponent;
  let fixture: ComponentFixture<UserLoginStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLoginStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
