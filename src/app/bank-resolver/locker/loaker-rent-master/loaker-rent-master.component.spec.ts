import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoakerRentMasterComponent } from './loaker-rent-master.component';

describe('LoakerRentMasterComponent', () => {
  let component: LoakerRentMasterComponent;
  let fixture: ComponentFixture<LoakerRentMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoakerRentMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoakerRentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
