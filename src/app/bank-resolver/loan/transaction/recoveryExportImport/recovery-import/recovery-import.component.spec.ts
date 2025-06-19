import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryImportComponent } from './recovery-import.component';

describe('RecoveryImportComponent', () => {
  let component: RecoveryImportComponent;
  let fixture: ComponentFixture<RecoveryImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
