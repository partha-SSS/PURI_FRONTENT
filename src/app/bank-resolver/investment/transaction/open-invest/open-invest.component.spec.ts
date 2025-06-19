import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenInvestComponent } from './open-invest.component';

describe('OpenInvestComponent', () => {
  let component: OpenInvestComponent;
  let fixture: ComponentFixture<OpenInvestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenInvestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenInvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
