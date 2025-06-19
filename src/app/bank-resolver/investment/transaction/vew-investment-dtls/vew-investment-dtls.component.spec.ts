import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VewInvestmentDtlsComponent } from './vew-investment-dtls.component';

describe('VewInvestmentDtlsComponent', () => {
  let component: VewInvestmentDtlsComponent;
  let fixture: ComponentFixture<VewInvestmentDtlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VewInvestmentDtlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VewInvestmentDtlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
