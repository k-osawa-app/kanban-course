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
        
        { provide: Auth, useValue: mockAuth },        
       
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
