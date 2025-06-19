import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailListSbcaConstWiseComponent } from './detail-list-sbca-const-wise.component';

describe('DetailListSbcaConstWiseComponent', () => {
  let component: DetailListSbcaConstWiseComponent;
  let fixture: ComponentFixture<DetailListSbcaConstWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailListSbcaConstWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailListSbcaConstWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
