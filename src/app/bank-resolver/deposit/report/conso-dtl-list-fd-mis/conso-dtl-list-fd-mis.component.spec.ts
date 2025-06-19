import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoDtlListFdMisComponent } from './conso-dtl-list-fd-mis.component';

describe('ConsoDtlListFdMisComponent', () => {
  let component: ConsoDtlListFdMisComponent;
  let fixture: ComponentFixture<ConsoDtlListFdMisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsoDtlListFdMisComponent]
    });
    fixture = TestBed.createComponent(ConsoDtlListFdMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
