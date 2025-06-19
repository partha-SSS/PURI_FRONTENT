import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecovBlockComponent } from './recov-block.component';

describe('RecovBlockComponent', () => {
  let component: RecovBlockComponent;
  let fixture: ComponentFixture<RecovBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecovBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecovBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
