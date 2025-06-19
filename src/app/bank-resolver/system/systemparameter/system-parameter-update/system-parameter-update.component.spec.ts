import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParameterUpdateComponent } from './system-parameter-update.component';

describe('SystemParameterUpdateComponent', () => {
  let component: SystemParameterUpdateComponent;
  let fixture: ComponentFixture<SystemParameterUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemParameterUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemParameterUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
