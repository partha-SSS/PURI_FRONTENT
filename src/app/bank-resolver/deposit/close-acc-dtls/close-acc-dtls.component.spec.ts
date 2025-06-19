import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseAccDtlsComponent } from './close-acc-dtls.component';

describe('CloseAccDtlsComponent', () => {
  let component: CloseAccDtlsComponent;
  let fixture: ComponentFixture<CloseAccDtlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseAccDtlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseAccDtlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
