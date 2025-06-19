import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCommitionFSSComponent } from './agent-commition-fss.component';

describe('AgentCommitionFSSComponent', () => {
  let component: AgentCommitionFSSComponent;
  let fixture: ComponentFixture<AgentCommitionFSSComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentCommitionFSSComponent]
    });
    fixture = TestBed.createComponent(AgentCommitionFSSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
