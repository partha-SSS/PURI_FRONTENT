import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailListConsolidatedComponent } from './detail-list-consolidated.component';

describe('DetailListConsolidatedComponent', () => {
  let component: DetailListConsolidatedComponent;
  let fixture: ComponentFixture<DetailListConsolidatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailListConsolidatedComponent]
    });
    fixture = TestBed.createComponent(DetailListConsolidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
