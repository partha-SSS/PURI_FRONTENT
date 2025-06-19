import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecovAdvPrnComponent } from './recov-adv-prn.component';

describe('RecovAdvPrnComponent', () => {
  let component: RecovAdvPrnComponent;
  let fixture: ComponentFixture<RecovAdvPrnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecovAdvPrnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecovAdvPrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
