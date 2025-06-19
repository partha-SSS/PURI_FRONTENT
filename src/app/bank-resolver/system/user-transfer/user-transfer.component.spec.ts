import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTransferComponent } from './user-transfer.component';

describe('UserTransferComponent', () => {
  let component: UserTransferComponent;
  let fixture: ComponentFixture<UserTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
