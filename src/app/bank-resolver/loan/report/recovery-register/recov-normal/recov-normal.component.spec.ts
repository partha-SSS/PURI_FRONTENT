import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecovNormalComponent } from './recov-normal.component';

describe('RecovNormalComponent', () => {
  let component: RecovNormalComponent;
  let fixture: ComponentFixture<RecovNormalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecovNormalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecovNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
