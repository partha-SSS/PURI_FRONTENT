import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBorrowingComponent } from './view-borrowing.component';

describe('ViewBorrowingComponent', () => {
  let component: ViewBorrowingComponent;
  let fixture: ComponentFixture<ViewBorrowingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBorrowingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBorrowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
