import { TestBed } from '@angular/core/testing';
import { Logger } from './logger';

describe('Logger', () => {
  let service: Logger;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Logger],
    });
    service = TestBed.inject(Logger);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('log method', () => {
    it('プレフィックス(KanBan-Course)と時刻、メッセージを含んで console.log に出力されること', () => {
      
      vi.spyOn(console, 'log').mockReturnValue(undefined); 

      const testMessage = 'テストメッセージです';

      service.log(testMessage);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringMatching(/\[KanBan-Course .*\]: テストメッセージです/),
      );
    });
  });
});
