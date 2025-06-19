import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdsAccStmtComponent } from './dds-acc-stmt.component';

describe('DdsAccStmtComponent', () => {
  let component: DdsAccStmtComponent;
  let fixture: ComponentFixture<DdsAccStmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdsAccStmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdsAccStmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
