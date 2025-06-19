import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingIntPostComponent } from './saving-int-post.component';

describe('SavingIntPostComponent', () => {
  let component: SavingIntPostComponent;
  let fixture: ComponentFixture<SavingIntPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingIntPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingIntPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
