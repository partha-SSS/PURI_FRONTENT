import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearMaturityComponent } from './near-maturity.component';

describe('NearMaturityComponent', () => {
  let component: NearMaturityComponent;
  let fixture: ComponentFixture<NearMaturityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearMaturityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearMaturityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
