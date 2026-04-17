import { TestBed } from '@angular/core/testing';

import { Boardservicen } from './boardservicen';

describe('Boardservicen', () => {
  let service: Boardservicen;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Boardservicen);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
