import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntRecStmtComponent } from './int-rec-stmt.component';

describe('IntRecStmtComponent', () => {
  let component: IntRecStmtComponent;
  let fixture: ComponentFixture<IntRecStmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntRecStmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntRecStmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
