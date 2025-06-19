import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlWiseVoucherDtlsComponent } from './gl-wise-voucher-dtls.component';

describe('GlWiseVoucherDtlsComponent', () => {
  let component: GlWiseVoucherDtlsComponent;
  let fixture: ComponentFixture<GlWiseVoucherDtlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlWiseVoucherDtlsComponent]
    });
    fixture = TestBed.createComponent(GlWiseVoucherDtlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
