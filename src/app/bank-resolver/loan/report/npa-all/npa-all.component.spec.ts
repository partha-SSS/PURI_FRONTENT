import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpaALLComponent } from './npa-all.component';

describe('NpaALLComponent', () => {
  let component: NpaALLComponent;
  let fixture: ComponentFixture<NpaALLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpaALLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpaALLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
