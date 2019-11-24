import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient, private router: Router){}

  private token: string;
  private userId: string;
  private authStatusListener =  new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  autoAuthUser(){
    const authInfo = this.getAuthData();
    if(!authInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expiraion.getTime() - now.getTime();
    if(expiresIn > 0){
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post('http://localhost:3000/api/user/signup', authData)
        .subscribe(res => {
           this.router.navigate(['/']);
        }, error => {
          this.authStatusListener.next(false);
        });
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', authData)
        .subscribe(res => {
           this.token = res.token;
           const timeout = res.expiresIn;
           if(this.token){
             this.setAuthTimer(timeout);
             const now = new Date();
             const expirationDate = new Date(now.getTime() + timeout * 1000);
             this.isAuthenticated = true;
             this.userId = res.userId;
             this.authStatusListener.next(true);
             this.saveAuthData(this.token, expirationDate, this.userId);
             this.router.navigate(['/']);
           }
        }, error => {
          this.authStatusListener.next(false);
        });
  }

  private setAuthTimer(duration: number){
    console.log('seeting timer '+ duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expiresInDate: Date, userId: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expires', expiresInDate.toISOString());
    localStorage.setItem('userid', userId);
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expires');
    const userId = localStorage.getItem('userId');
    if(!token || !expiration){
      return;
    }
    return {
      token: token,
      expiraion: new Date(expiration),
      userId: userId
    }
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    localStorage.removeItem('userid');
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
}
