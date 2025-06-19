import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockwiseLstComponent } from './blockwise-lst.component';

describe('BlockwiseLstComponent', () => {
  let component: BlockwiseLstComponent;
  let fixture: ComponentFixture<BlockwiseLstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockwiseLstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockwiseLstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
