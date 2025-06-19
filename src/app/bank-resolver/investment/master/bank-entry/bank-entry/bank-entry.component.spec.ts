import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankEntryComponent } from './bank-entry.component';

describe('BankEntryComponent', () => {
  let component: BankEntryComponent;
  let fixture: ComponentFixture<BankEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
