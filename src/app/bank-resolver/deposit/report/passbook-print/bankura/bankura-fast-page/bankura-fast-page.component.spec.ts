import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankuraFastPageComponent } from './bankura-fast-page.component';

describe('BankuraFastPageComponent', () => {
  let component: BankuraFastPageComponent;
  let fixture: ComponentFixture<BankuraFastPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankuraFastPageComponent]
    });
    fixture = TestBed.createComponent(BankuraFastPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
