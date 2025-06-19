import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyadjustmentvoucherComponent } from './yearlyadjustmentvoucher.component';

describe('YearlyadjustmentvoucherComponent', () => {
  let component: YearlyadjustmentvoucherComponent;
  let fixture: ComponentFixture<YearlyadjustmentvoucherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearlyadjustmentvoucherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyadjustmentvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
