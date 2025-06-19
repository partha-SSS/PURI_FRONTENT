import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabwiseDepositComponent } from './slabwise-deposit.component';

describe('SlabwiseDepositComponent', () => {
  let component: SlabwiseDepositComponent;
  let fixture: ComponentFixture<SlabwiseDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlabwiseDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlabwiseDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
