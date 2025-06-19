import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoDtlListSbcaComponent } from './conso-dtl-list-sbca.component';

describe('ConsoDtlListSbcaComponent', () => {
  let component: ConsoDtlListSbcaComponent;
  let fixture: ComponentFixture<ConsoDtlListSbcaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsoDtlListSbcaComponent]
    });
    fixture = TestBed.createComponent(ConsoDtlListSbcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
