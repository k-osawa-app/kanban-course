import { TestBed } from '@angular/core/testing';
import { Network } from './network'; 

describe('Network Service', () => {
  let service: Network;

  beforeEach(() => {
   
    TestBed.configureTestingModule({
      providers: [Network],
    });
    
    service = TestBed.inject(Network);
  });

  it('サービスが正常に生成されること', () => {
    expect(service).toBeTruthy();
  });

  it('初期値がブラウザの navigator.onLine の状態と一致すること', () => {
  
    expect(service.isOnline()).toBe(navigator.onLine);
  });

  it('windowの offline イベントが発生したときに isOnline() が false になること', () => {
    
    window.dispatchEvent(new Event('offline'));

    expect(service.isOnline()).toBe(false);
  });

  it('windowの online イベントが発生したときに isOnline() が true になること', () => {
    
    window.dispatchEvent(new Event('offline'));
    expect(service.isOnline()).toBe(false); 

    window.dispatchEvent(new Event('online'));

    expect(service.isOnline()).toBe(true);
  });
});
