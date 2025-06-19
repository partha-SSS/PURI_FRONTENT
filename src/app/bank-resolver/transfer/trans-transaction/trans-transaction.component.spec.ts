import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransTransactionComponent } from './trans-transaction.component';

describe('TransTransactionComponent', () => {
  let component: TransTransactionComponent;
  let fixture: ComponentFixture<TransTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
