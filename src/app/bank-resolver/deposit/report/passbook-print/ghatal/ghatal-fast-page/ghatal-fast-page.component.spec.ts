import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GhatalFastPageComponent } from './ghatal-fast-page.component';

describe('GhatalFastPageComponent', () => {
  let component: GhatalFastPageComponent;
  let fixture: ComponentFixture<GhatalFastPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GhatalFastPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GhatalFastPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
