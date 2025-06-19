import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecovAdvPrnVillComponent } from './recov-adv-prn-vill.component';

describe('RecovAdvPrnVillComponent', () => {
  let component: RecovAdvPrnVillComponent;
  let fixture: ComponentFixture<RecovAdvPrnVillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecovAdvPrnVillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecovAdvPrnVillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
