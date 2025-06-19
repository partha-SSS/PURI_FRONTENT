import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldLoanSlabMasterComponent } from './gold-loan-slab-master.component';

describe('GoldLoanSlabMasterComponent', () => {
  let component: GoldLoanSlabMasterComponent;
  let fixture: ComponentFixture<GoldLoanSlabMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoldLoanSlabMasterComponent]
    });
    fixture = TestBed.createComponent(GoldLoanSlabMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
