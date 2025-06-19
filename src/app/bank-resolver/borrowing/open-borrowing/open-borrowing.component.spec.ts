import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenBorrowingComponent } from './open-borrowing.component';

describe('OpenBorrowingComponent', () => {
  let component: OpenBorrowingComponent;
  let fixture: ComponentFixture<OpenBorrowingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenBorrowingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenBorrowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
