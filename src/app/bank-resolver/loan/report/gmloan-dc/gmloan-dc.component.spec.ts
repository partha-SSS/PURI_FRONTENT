import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GMloanDCComponent } from './gmloan-dc.component';

describe('GMloanDCComponent', () => {
  let component: GMloanDCComponent;
  let fixture: ComponentFixture<GMloanDCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GMloanDCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GMloanDCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
