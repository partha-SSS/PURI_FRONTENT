import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDDSComponent } from './detail-dds.component';

describe('DetailDDSComponent', () => {
  let component: DetailDDSComponent;
  let fixture: ComponentFixture<DetailDDSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailDDSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDDSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
