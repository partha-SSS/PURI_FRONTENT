import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedCashAccComponent } from './consolidated-cash-acc.component';

describe('ConsolidatedCashAccComponent', () => {
  let component: ConsolidatedCashAccComponent;
  let fixture: ComponentFixture<ConsolidatedCashAccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedCashAccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedCashAccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
