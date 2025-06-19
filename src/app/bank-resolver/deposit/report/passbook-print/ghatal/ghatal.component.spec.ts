import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhatalComponent } from './ghatal.component';

describe('GhatalComponent', () => {
  let component: GhatalComponent;
  let fixture: ComponentFixture<GhatalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhatalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhatalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
