import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoCCTrialComponent } from './conso-cctrial.component';

describe('ConsoCCTrialComponent', () => {
  let component: ConsoCCTrialComponent;
  let fixture: ComponentFixture<ConsoCCTrialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoCCTrialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoCCTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
