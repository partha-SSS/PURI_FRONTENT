import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TamlukComponent } from './tamluk.component';

describe('TamlukComponent', () => {
  let component: TamlukComponent;
  let fixture: ComponentFixture<TamlukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TamlukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TamlukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
