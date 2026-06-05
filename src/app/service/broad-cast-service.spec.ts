import { TestBed } from '@angular/core/testing';

import { BroadCastService } from './broad-cast-service';

describe('BroadCastService', () => {
  let service: BroadCastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BroadCastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
