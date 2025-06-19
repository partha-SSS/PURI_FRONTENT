import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveBorrowingComponent } from './approve-borrowing.component';

describe('ApproveBorrowingComponent', () => {
  let component: ApproveBorrowingComponent;
  let fixture: ComponentFixture<ApproveBorrowingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveBorrowingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveBorrowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
