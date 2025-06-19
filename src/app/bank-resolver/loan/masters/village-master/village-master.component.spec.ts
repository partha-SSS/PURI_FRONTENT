import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VillageMasterComponent } from './village-master.component';

describe('VillageMasterComponent', () => {
  let component: VillageMasterComponent;
  let fixture: ComponentFixture<VillageMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VillageMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VillageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
