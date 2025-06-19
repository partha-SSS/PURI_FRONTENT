import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransBorrowingComponent } from './trans-borrowing.component';

describe('TransBorrowingComponent', () => {
  let component: TransBorrowingComponent;
  let fixture: ComponentFixture<TransBorrowingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransBorrowingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransBorrowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
