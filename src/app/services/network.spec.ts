import { TestBed } from '@angular/core/testing';
import { Network } from './network'; // ※実際のファイルパスに合わせて調整してください

describe('Network Service', () => {
  let service: Network;

  beforeEach(() => {
    // TestBedを使ってサービスをセットアップ
    TestBed.configureTestingModule({
      providers: [Network]
    });
    // サービスをインジェクト（生成）
    service = TestBed.inject(Network);
  });

  it('サービスが正常に生成されること', () => {
    expect(service).toBeTruthy();
  });

  it('初期値がブラウザの navigator.onLine の状態と一致すること', () => {
    // テスト実行時のブラウザ本来のオンライン状態と比較する
    expect(service.isOnline()).toBe(navigator.onLine);
  });

  it('windowの offline イベントが発生したときに isOnline() が false になること', () => {
    // offline イベントをシミュレートして発火させる
    window.dispatchEvent(new Event('offline'));
    
    // RxJS経由でSignalの値が即座に同期され、false になっていることを確認
    expect(service.isOnline()).toBeFalse();
  });

  it('windowの online イベントが発生したときに isOnline() が true になること', () => {
    // 一度確実にオフライン状態にする
    window.dispatchEvent(new Event('offline'));
    expect(service.isOnline()).toBeFalse(); // （確認用）

    // online イベントをシミュレートして発火させる
    window.dispatchEvent(new Event('online'));
    
    // Signalの値が true に戻っていることを確認
    expect(service.isOnline()).toBeTrue();
  });
});
