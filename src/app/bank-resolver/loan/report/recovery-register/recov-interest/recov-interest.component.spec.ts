import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecovInterestComponent } from './recov-interest.component';

describe('RecovInterestComponent', () => {
  let component: RecovInterestComponent;
  let fixture: ComponentFixture<RecovInterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecovInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecovInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
