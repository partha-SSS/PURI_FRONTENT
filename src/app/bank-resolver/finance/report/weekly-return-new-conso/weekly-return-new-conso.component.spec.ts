import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReturnNewConsoComponent } from './weekly-return-new-conso.component';

describe('WeeklyReturnNewConsoComponent', () => {
  let component: WeeklyReturnNewConsoComponent;
  let fixture: ComponentFixture<WeeklyReturnNewConsoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeeklyReturnNewConsoComponent]
    });
    fixture = TestBed.createComponent(WeeklyReturnNewConsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
