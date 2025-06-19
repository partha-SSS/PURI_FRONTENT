import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecovFundComponent } from './recov-fund.component';

describe('RecovFundComponent', () => {
  let component: RecovFundComponent;
  let fixture: ComponentFixture<RecovFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecovFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecovFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
