import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecovVillageComponent } from './recov-village.component';

describe('RecovVillageComponent', () => {
  let component: RecovVillageComponent;
  let fixture: ComponentFixture<RecovVillageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecovVillageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecovVillageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
