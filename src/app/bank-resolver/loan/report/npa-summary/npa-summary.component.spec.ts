import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpaSummaryComponent } from './npa-summary.component';

describe('NpaSummaryComponent', () => {
  let component: NpaSummaryComponent;
  let fixture: ComponentFixture<NpaSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpaSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpaSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
