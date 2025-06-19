import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCommissionComponent } from './agent-commission.component';

describe('AgentCommissionComponent', () => {
  let component: AgentCommissionComponent;
  let fixture: ComponentFixture<AgentCommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
