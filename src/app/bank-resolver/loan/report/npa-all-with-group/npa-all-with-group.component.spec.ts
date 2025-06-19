import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpaAllWithGroupComponent } from './npa-all-with-group.component';

describe('NpaAllWithGroupComponent', () => {
  let component: NpaAllWithGroupComponent;
  let fixture: ComponentFixture<NpaAllWithGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpaAllWithGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpaAllWithGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
