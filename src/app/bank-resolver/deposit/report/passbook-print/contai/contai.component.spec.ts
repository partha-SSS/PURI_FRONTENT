import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaiComponent } from './contai.component';

describe('ContaiComponent', () => {
  let component: ContaiComponent;
  let fixture: ComponentFixture<ContaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
