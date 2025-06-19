import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryIndiPostComponent } from './recovery-indi-post.component';

describe('RecoveryIndiPostComponent', () => {
  let component: RecoveryIndiPostComponent;
  let fixture: ComponentFixture<RecoveryIndiPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryIndiPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryIndiPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
