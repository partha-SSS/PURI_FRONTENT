import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldRateMasterComponent } from './gold-rate-master.component';

describe('GoldRateMasterComponent', () => {
  let component: GoldRateMasterComponent;
  let fixture: ComponentFixture<GoldRateMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoldRateMasterComponent]
    });
    fixture = TestBed.createComponent(GoldRateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
