import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpaComponent } from './npa.component';

describe('NpaComponent', () => {
  let component: NpaComponent;
  let fixture: ComponentFixture<NpaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
