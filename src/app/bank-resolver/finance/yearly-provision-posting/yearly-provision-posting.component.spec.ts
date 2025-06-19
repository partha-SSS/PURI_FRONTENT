import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyProvisionPostingComponent } from './yearly-provision-posting.component';

describe('YearlyProvisionPostingComponent', () => {
  let component: YearlyProvisionPostingComponent;
  let fixture: ComponentFixture<YearlyProvisionPostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearlyProvisionPostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyProvisionPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
