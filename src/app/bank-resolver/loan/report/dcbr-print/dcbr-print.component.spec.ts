import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcbrPrintComponent } from './dcbr-print.component';

describe('DcbrPrintComponent', () => {
  let component: DcbrPrintComponent;
  let fixture: ComponentFixture<DcbrPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcbrPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcbrPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
