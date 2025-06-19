import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankuraComponent } from './bankura.component';

describe('BankuraComponent', () => {
  let component: BankuraComponent;
  let fixture: ComponentFixture<BankuraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankuraComponent]
    });
    fixture = TestBed.createComponent(BankuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
