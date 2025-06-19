import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActwiseLstComponent } from './actwise-lst.component';

describe('ActwiseLstComponent', () => {
  let component: ActwiseLstComponent;
  let fixture: ComponentFixture<ActwiseLstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActwiseLstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActwiseLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
