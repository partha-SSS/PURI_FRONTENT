import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryExportComponent } from './recovery-export.component';

describe('RecoveryExportComponent', () => {
  let component: RecoveryExportComponent;
  let fixture: ComponentFixture<RecoveryExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
