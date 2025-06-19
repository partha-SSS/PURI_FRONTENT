import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransApproveComponent } from './trans-approve.component';

describe('TransApproveComponent', () => {
  let component: TransApproveComponent;
  let fixture: ComponentFixture<TransApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
