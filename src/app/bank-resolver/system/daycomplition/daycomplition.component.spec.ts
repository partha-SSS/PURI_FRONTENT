import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaycomplitionComponent } from './daycomplition.component';

describe('DaycomplitionComponent', () => {
  let component: DaycomplitionComponent;
  let fixture: ComponentFixture<DaycomplitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaycomplitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaycomplitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
