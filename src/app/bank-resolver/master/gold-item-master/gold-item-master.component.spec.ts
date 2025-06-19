import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldItemMasterComponent } from './gold-item-master.component';

describe('GoldItemMasterComponent', () => {
  let component: GoldItemMasterComponent;
  let fixture: ComponentFixture<GoldItemMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoldItemMasterComponent]
    });
    fixture = TestBed.createComponent(GoldItemMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
