import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcTransComponent } from './cc-trans.component';

describe('CcTransComponent', () => {
  let component: CcTransComponent;
  let fixture: ComponentFixture<CcTransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcTransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
