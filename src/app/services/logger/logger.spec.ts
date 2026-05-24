import { TestBed } from '@angular/core/testing';
import { Logger } from './logger';

describe('Logger', () => {
  let service: Logger;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Logger]
    });
    service = TestBed.inject(Logger);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('log method', () => {
    it('プレフィックス(KanBan-Course)と時刻、メッセージを含んで console.log に出力されること', () => {
      // 1. 準備：本物の console.log が呼ばれるのを監視（傍受）するスパイを作成
      spyOn(console, 'log');

      const testMessage = 'テストメッセージです';

      // 2. 実行：Loggerサービスのlogメソッドを呼び出す
      service.log(testMessage);

      // 3. 検証：console.log が期待通りの文字を含んで呼び出されたか確認
      // 時刻部分は実行するたびに変わるため、正規表現（特定の文字の並び）でチェックします
      expect(console.log).toHaveBeenCalledWith(
        jasmine.stringMatching(/\[KanBan-Course .*\]: テストメッセージです/)
      );
    });
  });
});



// import { TestBed } from '@angular/core/testing';

// import { Logger } from './logger';

// describe('Logger', () => {
//   let service: Logger;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(Logger);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });
