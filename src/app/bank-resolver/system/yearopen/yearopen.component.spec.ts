import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearopenComponent } from './yearopen.component';

describe('YearopenComponent', () => {
  let component: YearopenComponent;
  let fixture: ComponentFixture<YearopenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearopenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearopenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
