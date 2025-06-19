import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoGenLedgerComponent } from './conso-gen-ledger.component';

describe('ConsoGenLedgerComponent', () => {
  let component: ConsoGenLedgerComponent;
  let fixture: ComponentFixture<ConsoGenLedgerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsoGenLedgerComponent]
    });
    fixture = TestBed.createComponent(ConsoGenLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
