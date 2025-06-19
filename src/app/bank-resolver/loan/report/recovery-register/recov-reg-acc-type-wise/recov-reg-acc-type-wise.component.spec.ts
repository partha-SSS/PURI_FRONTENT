import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecovRegAccTypeWiseComponent } from './recov-reg-acc-type-wise.component';

describe('RecovRegAccTypeWiseComponent', () => {
  let component: RecovRegAccTypeWiseComponent;
  let fixture: ComponentFixture<RecovRegAccTypeWiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecovRegAccTypeWiseComponent]
    });
    fixture = TestBed.createComponent(RecovRegAccTypeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
