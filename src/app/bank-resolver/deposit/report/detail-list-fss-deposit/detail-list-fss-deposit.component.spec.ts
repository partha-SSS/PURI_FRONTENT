import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailListFssDepositComponent } from './detail-list-fss-deposit.component';

describe('DetailListFssDepositComponent', () => {
  let component: DetailListFssDepositComponent;
  let fixture: ComponentFixture<DetailListFssDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailListFssDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailListFssDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
