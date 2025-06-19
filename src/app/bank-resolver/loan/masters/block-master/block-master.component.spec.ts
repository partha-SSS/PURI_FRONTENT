import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockMasterComponent } from './block-master.component';

describe('BlockMasterComponent', () => {
  let component: BlockMasterComponent;
  let fixture: ComponentFixture<BlockMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
