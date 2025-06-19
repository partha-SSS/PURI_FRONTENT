import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdsExportComponent } from './dds-export.component';

describe('DdsExportComponent', () => {
  let component: DdsExportComponent;
  let fixture: ComponentFixture<DdsExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdsExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdsExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
