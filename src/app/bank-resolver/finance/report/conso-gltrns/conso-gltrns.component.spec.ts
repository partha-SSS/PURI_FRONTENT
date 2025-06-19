import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoGLTrnsComponent } from './conso-gltrns.component';

describe('ConsoGLTrnsComponent', () => {
  let component: ConsoGLTrnsComponent;
  let fixture: ComponentFixture<ConsoGLTrnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoGLTrnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoGLTrnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
