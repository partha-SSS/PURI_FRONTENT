import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BMLoanStatementComponent } from './bmloan-statement.component';

describe('BMLoanStatementComponent', () => {
  let component: BMLoanStatementComponent;
  let fixture: ComponentFixture<BMLoanStatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BMLoanStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BMLoanStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
