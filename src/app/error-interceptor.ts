import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from 
'@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
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