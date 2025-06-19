import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingInsActiveSIListComponent } from './standing-ins-active-silist.component';

describe('StandingInsActiveSIListComponent', () => {
  let component: StandingInsActiveSIListComponent;
  let fixture: ComponentFixture<StandingInsActiveSIListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandingInsActiveSIListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandingInsActiveSIListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
