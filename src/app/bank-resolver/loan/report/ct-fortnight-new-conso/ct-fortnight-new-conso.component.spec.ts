import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtFortnightNewConsoComponent } from './ct-fortnight-new-conso.component';

describe('CtFortnightNewConsoComponent', () => {
  let component: CtFortnightNewConsoComponent;
  let fixture: ComponentFixture<CtFortnightNewConsoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CtFortnightNewConsoComponent]
    });
    fixture = TestBed.createComponent(CtFortnightNewConsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
