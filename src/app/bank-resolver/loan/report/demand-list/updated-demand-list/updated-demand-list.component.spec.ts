import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedDemandListComponent } from './updated-demand-list.component';

describe('UpdatedDemandListComponent', () => {
  let component: UpdatedDemandListComponent;
  let fixture: ComponentFixture<UpdatedDemandListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatedDemandListComponent]
    });
    fixture = TestBed.createComponent(UpdatedDemandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
