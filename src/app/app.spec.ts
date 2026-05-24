import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Auth } from '@angular/fire/auth';
import { provideRouter } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    const mockAuth = {};
    await TestBed.configureTestingModule({
      imports: [App],
      providers:[
        // Auth が要求されたら、ダミーの mockAuth を渡すように設定
        { provide: Auth, useValue: mockAuth },        
        // <router-outlet> がエラーにならないように空のルーティング情報を提供
        provideRouter([]) 
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});





// import { TestBed } from '@angular/core/testing';
// import { App } from './app';

// describe('App', () => {
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [App],
//     }).compileComponents();
//   });

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(App);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });  
// });
