import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestSubsidyComponent } from './interest-subsidy.component';

describe('InterestSubsidyComponent', () => {
  let component: InterestSubsidyComponent;
  let fixture: ComponentFixture<InterestSubsidyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestSubsidyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestSubsidyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
