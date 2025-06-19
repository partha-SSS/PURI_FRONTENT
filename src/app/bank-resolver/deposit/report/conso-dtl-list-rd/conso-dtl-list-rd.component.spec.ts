import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoDtlListRdComponent } from './conso-dtl-list-rd.component';

describe('ConsoDtlListRdComponent', () => {
  let component: ConsoDtlListRdComponent;
  let fixture: ComponentFixture<ConsoDtlListRdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsoDtlListRdComponent]
    });
    fixture = TestBed.createComponent(ConsoDtlListRdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
