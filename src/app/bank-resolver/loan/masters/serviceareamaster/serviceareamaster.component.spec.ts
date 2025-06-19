import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceareamasterComponent } from './serviceareamaster.component';

describe('ServiceareamasterComponent', () => {
  let component: ServiceareamasterComponent;
  let fixture: ComponentFixture<ServiceareamasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceareamasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceareamasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
