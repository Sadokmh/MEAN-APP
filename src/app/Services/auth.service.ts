import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { AuthData } from '../auth/auth-data.model';
import { Subject } from '../../../node_modules/rxjs';
import { Router } from '../../../node_modules/@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated:boolean = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListenner = new Subject<boolean>() ;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }



  createUser(email:string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post('http://localhost:3000/api/users/signup',authData)
             .subscribe(resp => {
               console.log(resp);
             })
  }



  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{token:string , expiresIn:string}>('http://localhost:3000/api/users/login',authData)
             .subscribe( resp => {
               this.token = resp.token;
               if (this.token) {
                const expiresInDuration = resp.expiresIn;
                this.setAuthTimer(+expiresInDuration);
                this.isAuthenticated = true;
                this.authStatusListenner.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + (+expiresInDuration) * 1000);
                this.saveAuthData(this.token,expirationDate);
                this.router.navigate(['/']);
               }
             })
  }


  
  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListenner.next(false);    
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }



  getIsAuth(){
    return this.isAuthenticated;
  }


  getToken(){
    return this.token;
  }


  getAuthStatusListenner(){
    return this.authStatusListenner.asObservable();
  }



  private saveAuthData(token: string, expirationDate: Date){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration',expirationDate.toISOString());
  }


  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }


  autoAuthUser(){
    const authInformation = this.getAuthData()
    console.log(authInformation);
    if (!authInformation) {
      return ;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime(); 
    if ( expiresIn > 0 ){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListenner.next(true);

    }
  }


  getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return ;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }


  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => { this.logout() }, duration * 1000) 
    //setTime works with ms ,logout after 1h of logging in because the token is valid just for 1 hour
  }


}
