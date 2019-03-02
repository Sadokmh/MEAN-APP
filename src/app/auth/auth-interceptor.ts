import { HttpInterceptor, HttpRequest, HttpHandler } from '../../../node_modules/@angular/common/http';
import { Injectable } from '../../../node_modules/@angular/core';
import { AuthService } from '../Services/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService
    ){}


    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        const authRequest = req.clone({
            headers: req.headers.set('authorization','Bearer ' + authToken) //authorization must be the same                                                               //in server side req.authorization 
                                                                        // file: check-auth.js line 8 
                                                                        // (the line number may changes later)
        }); 
        return next.handle(authRequest);
    }
}