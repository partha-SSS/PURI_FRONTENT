import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherapprovalComponent } from './voucherapproval.component';

describe('VoucherapprovalComponent', () => {
  let component: VoucherapprovalComponent;
  let fixture: ComponentFixture<VoucherapprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherapprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
