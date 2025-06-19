import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockWiseColLstComponent } from './block-wise-col-lst.component';

describe('BlockWiseColLstComponent', () => {
  let component: BlockWiseColLstComponent;
  let fixture: ComponentFixture<BlockWiseColLstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockWiseColLstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockWiseColLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
