import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BettingService } from '../services/betting.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private bettingService: BettingService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let token = this.bettingService.getToken();
        
        if (token && token != "") {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request);
    }
}