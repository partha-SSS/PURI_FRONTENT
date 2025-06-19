import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BakdatevoucherComponent } from './bakdatevoucher.component';

describe('BakdatevoucherComponent', () => {
  let component: BakdatevoucherComponent;
  let fixture: ComponentFixture<BakdatevoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BakdatevoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BakdatevoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
