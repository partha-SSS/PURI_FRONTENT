import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGLDetailsComponent } from './all-gldetails.component';

describe('AllGLDetailsComponent', () => {
  let component: AllGLDetailsComponent;
  let fixture: ComponentFixture<AllGLDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllGLDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllGLDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
