import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGLHeadComponent } from './create-glhead.component';

describe('CreateGLHeadComponent', () => {
  let component: CreateGLHeadComponent;
  let fixture: ComponentFixture<CreateGLHeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGLHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGLHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
