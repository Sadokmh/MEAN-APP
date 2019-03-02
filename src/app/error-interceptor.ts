import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from 
'./../../node_modules/@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from '../../node_modules/rxjs/operators';
import { throwError } from '../../node_modules/rxjs';
import { NotifyService } from './Services/notify.service';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    

    constructor(
        private notifyService: NotifyService
    ){}


    intercept(req: HttpRequest<any>, next: HttpHandler) {
        
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) =>  {
                console.log(err);
                //alert(err.error.message);
                this.notifyService.notify(err.error.message,'error');
                return throwError(err);
            })
        );
    }
}