import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoakerDetailMasterComponent } from './loaker-detail-master.component';

describe('LoakerDetailMasterComponent', () => {
  let component: LoakerDetailMasterComponent;
  let fixture: ComponentFixture<LoakerDetailMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoakerDetailMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoakerDetailMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
