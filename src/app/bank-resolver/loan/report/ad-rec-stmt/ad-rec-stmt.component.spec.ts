import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdRecStmtComponent } from './ad-rec-stmt.component';

describe('AdRecStmtComponent', () => {
  let component: AdRecStmtComponent;
  let fixture: ComponentFixture<AdRecStmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdRecStmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdRecStmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
