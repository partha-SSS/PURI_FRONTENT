import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherprintComponent } from './voucherprint.component';

describe('VoucherprintComponent', () => {
  let component: VoucherprintComponent;
  let fixture: ComponentFixture<VoucherprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
