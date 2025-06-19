import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaillistAllComponent } from './detaillist-all.component';

describe('DetaillistAllComponent', () => {
  let component: DetaillistAllComponent;
  let fixture: ComponentFixture<DetaillistAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetaillistAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaillistAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
