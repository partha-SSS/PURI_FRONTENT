import { TestBed } from '@angular/core/testing';

import { InvTranServService } from './inv-tran-serv.service';

describe('InvTranServService', () => {
  let service: InvTranServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvTranServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
