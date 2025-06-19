import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearcloseComponent } from './yearclose.component';

describe('YearcloseComponent', () => {
  let component: YearcloseComponent;
  let fixture: ComponentFixture<YearcloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearcloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearcloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
