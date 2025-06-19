import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexiSmallSavingPostingComponent } from './flexi-small-saving-posting.component';

describe('FlexiSmallSavingPostingComponent', () => {
  let component: FlexiSmallSavingPostingComponent;
  let fixture: ComponentFixture<FlexiSmallSavingPostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexiSmallSavingPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexiSmallSavingPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
