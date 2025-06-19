import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidyEntryComponent } from './subsidy-entry.component';

describe('SubsidyEntryComponent', () => {
  let component: SubsidyEntryComponent;
  let fixture: ComponentFixture<SubsidyEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidyEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidyEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
