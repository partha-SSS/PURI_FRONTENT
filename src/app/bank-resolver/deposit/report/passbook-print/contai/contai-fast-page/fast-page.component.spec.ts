import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaiFastPageComponent } from './fast-page.component';

describe('ContaiFastPageComponent', () => {
  let component: ContaiFastPageComponent;
  let fixture: ComponentFixture<ContaiFastPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContaiFastPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaiFastPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
