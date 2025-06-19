import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldSafeMasterComponent } from './gold-safe-master.component';

describe('GoldSafeMasterComponent', () => {
  let component: GoldSafeMasterComponent;
  let fixture: ComponentFixture<GoldSafeMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoldSafeMasterComponent]
    });
    fixture = TestBed.createComponent(GoldSafeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
