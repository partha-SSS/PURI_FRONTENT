import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFlexiSmallSavingComponent } from './detail-flexi-small-saving.component';

describe('DetailFlexiSmallSavingComponent', () => {
  let component: DetailFlexiSmallSavingComponent;
  let fixture: ComponentFixture<DetailFlexiSmallSavingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailFlexiSmallSavingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFlexiSmallSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
