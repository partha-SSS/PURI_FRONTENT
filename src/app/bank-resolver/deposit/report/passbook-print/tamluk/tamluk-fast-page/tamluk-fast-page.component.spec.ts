import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TamlukFastPageComponent } from './tamluk-fast-page.component';

describe('TamlukFastPageComponent', () => {
  let component: TamlukFastPageComponent;
  let fixture: ComponentFixture<TamlukFastPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TamlukFastPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TamlukFastPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
