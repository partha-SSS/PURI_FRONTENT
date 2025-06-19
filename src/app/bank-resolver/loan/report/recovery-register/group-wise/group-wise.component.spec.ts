import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWiseComponent } from './group-wise.component';

describe('GroupWiseComponent', () => {
  let component: GroupWiseComponent;
  let fixture: ComponentFixture<GroupWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
