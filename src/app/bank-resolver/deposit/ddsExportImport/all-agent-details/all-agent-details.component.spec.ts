import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAgentDetailsComponent } from './all-agent-details.component';

describe('AllAgentDetailsComponent', () => {
  let component: AllAgentDetailsComponent;
  let fixture: ComponentFixture<AllAgentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllAgentDetailsComponent]
    });
    fixture = TestBed.createComponent(AllAgentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
