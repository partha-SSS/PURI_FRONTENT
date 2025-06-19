import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearendDemandRecoveryComponent } from './yearend-demand-recovery.component';

describe('YearendDemandRecoveryComponent', () => {
  let component: YearendDemandRecoveryComponent;
  let fixture: ComponentFixture<YearendDemandRecoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearendDemandRecoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearendDemandRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
