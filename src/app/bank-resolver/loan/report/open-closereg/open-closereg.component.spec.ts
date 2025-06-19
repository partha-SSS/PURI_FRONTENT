import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenCloseregComponent } from './open-closereg.component';

describe('OpenCloseregComponent', () => {
  let component: OpenCloseregComponent;
  let fixture: ComponentFixture<OpenCloseregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenCloseregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenCloseregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
