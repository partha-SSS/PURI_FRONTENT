import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnetimesettlementComponent } from './onetimesettlement.component';

describe('OnetimesettlementComponent', () => {
  let component: OnetimesettlementComponent;
  let fixture: ComponentFixture<OnetimesettlementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnetimesettlementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnetimesettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
