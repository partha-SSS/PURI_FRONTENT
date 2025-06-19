import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoFortnightlyReturnComponent } from './conso-fortnightly-return.component';

describe('ConsoFortnightlyReturnComponent', () => {
  let component: ConsoFortnightlyReturnComponent;
  let fixture: ComponentFixture<ConsoFortnightlyReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoFortnightlyReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoFortnightlyReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
