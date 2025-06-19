import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestMasterComponent } from './interest-master.component';

describe('InterestMasterComponent', () => {
  let component: InterestMasterComponent;
  let fixture: ComponentFixture<InterestMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterestMasterComponent]
    });
    fixture = TestBed.createComponent(InterestMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
