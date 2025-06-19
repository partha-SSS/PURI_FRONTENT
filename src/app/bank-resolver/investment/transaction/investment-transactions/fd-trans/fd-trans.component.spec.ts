import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FdTransComponent } from './fd-trans.component';

describe('FdTransComponent', () => {
  let component: FdTransComponent;
  let fixture: ComponentFixture<FdTransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FdTransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
