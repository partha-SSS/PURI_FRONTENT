import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendSmsFromDemandComponent } from './send-sms-from-demand.component';

describe('SendSmsFromDemandComponent', () => {
  let component: SendSmsFromDemandComponent;
  let fixture: ComponentFixture<SendSmsFromDemandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendSmsFromDemandComponent]
    });
    fixture = TestBed.createComponent(SendSmsFromDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
