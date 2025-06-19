import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoProfitLossComponent } from './conso-profit-loss.component';

describe('ConsoProfitLossComponent', () => {
  let component: ConsoProfitLossComponent;
  let fixture: ComponentFixture<ConsoProfitLossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoProfitLossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoProfitLossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
