import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RdTransComponent } from './rd-trans.component';

describe('RdTransComponent', () => {
  let component: RdTransComponent;
  let fixture: ComponentFixture<RdTransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RdTransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RdTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
