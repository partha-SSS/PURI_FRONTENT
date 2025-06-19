import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisTransComponent } from './mis-trans.component';

describe('MisTransComponent', () => {
  let component: MisTransComponent;
  let fixture: ComponentFixture<MisTransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisTransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
