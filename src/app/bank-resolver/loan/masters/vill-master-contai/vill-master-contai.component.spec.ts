import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VillMasterContaiComponent } from './vill-master-contai.component';

describe('VillMasterContaiComponent', () => {
  let component: VillMasterContaiComponent;
  let fixture: ComponentFixture<VillMasterContaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VillMasterContaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VillMasterContaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
