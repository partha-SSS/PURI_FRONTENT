import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActWiseColLstComponent } from './act-wise-col-lst.component';

describe('ActWiseColLstComponent', () => {
  let component: ActWiseColLstComponent;
  let fixture: ComponentFixture<ActWiseColLstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActWiseColLstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActWiseColLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
