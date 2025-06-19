import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueTransferComponent } from './overdue-transfer.component';

describe('OverdueTransferComponent', () => {
  let component: OverdueTransferComponent;
  let fixture: ComponentFixture<OverdueTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdueTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
