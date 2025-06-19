import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UTSelfHelpComponent } from './utself-help.component';

describe('UTSelfHelpComponent', () => {
  let component: UTSelfHelpComponent;
  let fixture: ComponentFixture<UTSelfHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UTSelfHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UTSelfHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
