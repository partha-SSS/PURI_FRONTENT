import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdsImportComponent } from './dds-import.component';

describe('DdsImportComponent', () => {
  let component: DdsImportComponent;
  let fixture: ComponentFixture<DdsImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdsImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdsImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
