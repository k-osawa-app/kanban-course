import { TestBed } from '@angular/core/testing';

import { BoardService } from './boardservice';

describe('Boardservice', () => {
  let service: BoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
