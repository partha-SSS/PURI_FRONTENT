import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchEntryComponent } from './branch-entry.component';

describe('BranchEntryComponent', () => {
  let component: BranchEntryComponent;
  let fixture: ComponentFixture<BranchEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
