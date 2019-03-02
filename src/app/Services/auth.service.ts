import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { AuthData } from '../auth/auth-data.model';
import { Subject } from '../../../node_modules/rxjs';
import { Router } from '../../../node_modules/@angular/router';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userId: string; //the connected user's id 
  private isAuthenticated:boolean = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListenner = new Subject<boolean>() ;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notifyService: NotifyService
  ) { }



  createUser(email:string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password  
    };

    this.http.post('http://localhost:3000/api/users/signup',authData)
             .subscribe(resp => {
               this.notifyService.notify('Account successfully created !' , 'success');
               this.router.navigate(['/']);
             }, error => {
               this.authStatusListenner.next(false);
             });
  }



  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{token:string , userId:string, expiresIn:string}>('http://localhost:3000/api/users/login',authData)
             .subscribe( resp => {
               this.token = resp.token;
               if (this.token) {
                const expiresInDuration = resp.expiresIn;
                this.setAuthTimer(+expiresInDuration);
                this.isAuthenticated = true;
                this.userId = resp.userId;
                this.authStatusListenner.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + (+expiresInDuration) * 1000);
                this.saveAuthData(this.token,this.userId,expirationDate);
                this.notifyService.notify('Logged in successfully !', 'success');
                this.router.navigate(['/']);
               }
             }, error => {
               this.authStatusListenner.next(false);
             })
  }


  
  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListenner.next(false);   
    this.userId = null; 
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.notifyService.notify('Logged out .. good bye !', 'error');
    this.router.navigate(['/']);
  }


  getUserId(){
    return this.userId;
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



  private saveAuthData(token: string, id: string, expirationDate: Date){
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration',expirationDate.toISOString());
  }


  private clearAuthData(){
    localStorage.removeItem('id');
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
      this.userId = authInformation.id;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListenner.next(true);

    }
  }


  getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const id = localStorage.getItem('id');
    if (!token || !expirationDate || !id) {
      return ;
    }
    return {
      id: id,
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }


  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => { this.logout() }, duration * 1000) 
    //setTime works with ms ,logout after 1h of logging in because the token is valid just for 1 hour
  }


}
