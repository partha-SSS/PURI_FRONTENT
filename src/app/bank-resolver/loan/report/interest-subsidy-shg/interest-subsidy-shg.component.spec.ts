import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestSubsidySHGComponent } from './interest-subsidy-shg.component';

describe('InterestSubsidySHGComponent', () => {
  let component: InterestSubsidySHGComponent;
  let fixture: ComponentFixture<InterestSubsidySHGComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterestSubsidySHGComponent]
    });
    fixture = TestBed.createComponent(InterestSubsidySHGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
