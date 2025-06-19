import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorroDetailListComponent } from './borro-detail-list.component';

describe('BorroDetailListComponent', () => {
  let component: BorroDetailListComponent;
  let fixture: ComponentFixture<BorroDetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorroDetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorroDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
