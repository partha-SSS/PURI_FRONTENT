import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecovListComponent } from './recov-list.component';

describe('RecovListComponent', () => {
  let component: RecovListComponent;
  let fixture: ComponentFixture<RecovListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecovListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecovListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
