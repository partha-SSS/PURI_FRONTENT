import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DdsIndividualPostingComponent } from './dds-individual-posting.component';

describe('DdsIndividualPostingComponent', () => {
  let component: DdsIndividualPostingComponent;
  let fixture: ComponentFixture<DdsIndividualPostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DdsIndividualPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdsIndividualPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
