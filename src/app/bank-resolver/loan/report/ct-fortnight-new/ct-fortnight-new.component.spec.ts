import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtFortnightNewComponent } from './ct-fortnight-new.component';

describe('CtFortnightNewComponent', () => {
  let component: CtFortnightNewComponent;
  let fixture: ComponentFixture<CtFortnightNewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CtFortnightNewComponent]
    });
    fixture = TestBed.createComponent(CtFortnightNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
