import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmLoanSubsidyComponent } from './gm-loan-subsidy.component';

describe('GmLoanSubsidyComponent', () => {
  let component: GmLoanSubsidyComponent;
  let fixture: ComponentFixture<GmLoanSubsidyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmLoanSubsidyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmLoanSubsidyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
