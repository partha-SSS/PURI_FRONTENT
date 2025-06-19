import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoBalSheetComponent } from './conso-bal-sheet.component';

describe('ConsoBalSheetComponent', () => {
  let component: ConsoBalSheetComponent;
  let fixture: ComponentFixture<ConsoBalSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoBalSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoBalSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
