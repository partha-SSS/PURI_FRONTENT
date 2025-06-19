import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KccmemberdtlsComponent } from './kccmemberdtls.component';

describe('KccmemberdtlsComponent', () => {
  let component: KccmemberdtlsComponent;
  let fixture: ComponentFixture<KccmemberdtlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KccmemberdtlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KccmemberdtlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
