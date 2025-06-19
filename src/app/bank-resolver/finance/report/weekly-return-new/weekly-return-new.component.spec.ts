import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReturnNewComponent } from './weekly-return-new.component';

describe('WeeklyReturnNewComponent', () => {
  let component: WeeklyReturnNewComponent;
  let fixture: ComponentFixture<WeeklyReturnNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeeklyReturnNewComponent]
    });
    fixture = TestBed.createComponent(WeeklyReturnNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
