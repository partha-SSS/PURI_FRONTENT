import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcbrVillWiseComponent } from './dcbr-vill-wise.component';

describe('DcbrVillWiseComponent', () => {
  let component: DcbrVillWiseComponent;
  let fixture: ComponentFixture<DcbrVillWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcbrVillWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcbrVillWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
