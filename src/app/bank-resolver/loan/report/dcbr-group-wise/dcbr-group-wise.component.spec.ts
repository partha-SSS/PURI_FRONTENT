import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcbrGroupWiseComponent } from './dcbr-group-wise.component';

describe('DcbrGroupWiseComponent', () => {
  let component: DcbrGroupWiseComponent;
  let fixture: ComponentFixture<DcbrGroupWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcbrGroupWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcbrGroupWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
