import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoCashAccNewComponent } from './conso-cash-acc-new.component';

describe('ConsoCashAccNewComponent', () => {
  let component: ConsoCashAccNewComponent;
  let fixture: ComponentFixture<ConsoCashAccNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoCashAccNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoCashAccNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
