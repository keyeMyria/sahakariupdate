import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/do';
import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from '../services/Storage_Service';
import { tap } from 'rxjs/operators'
import { NavController, Events } from "ionic-angular";
import { RegisterService } from "../services/app-data.service";
import { BehaviorSubject } from "rxjs";
import { AuthService } from "./AuthService";
import { TokenService } from "./service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    currentToken: any;
    refreshTokenNeeded: boolean;
    refreshToken: string;
    constructor(private authService: AuthService, private tokenService:TokenService) {
        this.authService.getAuthToken().subscribe((data:any)=>{
            this.currentToken = data.AccessToken;
        });
    }
    sendToken(token: string) {
        this.tokenService.SetToken(token);
    }
    addToken(req: HttpRequest<any>, token: any): HttpRequest<any> {
        return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }})
    }
    DonotaddToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({ setHeaders: { Authorization: 'Bearer ' }})
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        if (req.headers.get('No-Auth') == "True") {
            return next.handle(req.clone());
        }

        if (req.url.indexOf("/token") > 0) {
            var headersforTokenAPI = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded' })
            return next.handle(req);
        }
        if (this.tokenService.AccessToken != null) {
            if (this.tokenService.refreshTokenNeeded == true) {
                const clonedreq = req.clone({
                    setHeaders: { Authorization: 'Bearer ' }
                });
                return next.handle(clonedreq)
                    .do(
                        succ => { },
                        err => {
                            if (err.status === 401) {

                            }
                        }
                    );
            }
            else {
                this.refreshToken = localStorage.getItem('refreshToken');
                const clonedreq = req.clone({
                    setHeaders: { Authorization: 'Bearer ' + this.tokenService.AccessToken }
                });
                return next.handle(clonedreq)
                    .do(
                        succ => { },
                        err => {
                            if (err.status === 401) {
                            }
                        }
                    );
            }
        }
        else if (this.tokenService.AccessToken == null) {
            //this.refreshToken = StorageService.GetItem('refreshToken');
            this.refreshToken = localStorage.getItem('refreshToken');
            if (this.refreshToken == null) {
                const clonedreq = req.clone({
                    setHeaders: { Authorization: 'Bearer ' }
                });
                return next.handle(clonedreq)
                    .do(
                        succ => { },
                        err => {
                            if (err.status === 401){

                            }
                        }
                    );
            }
            else if (this.tokenService.RefreshToken != null) {
                const clonedreq = req.clone({
                    setHeaders: { Authorization: 'Bearer ' }
                });
                return next.handle(clonedreq)
                    // .pipe(tap((data: any) => {

                    // }, error => {
                    //     console.error('NICE ERROR', error);
                    // })
                    .do(
                        succ => { },
                        err => {
                            if (err.status === 401){
                                
                            }
                        }
                    );
            }
            else if (this.refreshToken != null && this.tokenService.AccessToken == null) {
                this.tokenService.GetToken(this.refreshToken).subscribe((data: any) => {
                    this.sendToken(data.AccessToken);
                    this.refreshToken = data.RefreshToken;
                    localStorage.setItem('refreshToken', this.refreshToken);
                    const clonedreq = req.clone({
                        setHeaders: { Authorization: 'Bearer ' + this.refreshToken }
                    });
                    return next.handle(clonedreq)
                        .do(
                            succ => { },
                            err => {
                                if (err.status === 401)
                                    //this.event.publish('UNAUTHORIZED');
                                    this.refreshToken = localStorage.getItem('refreshToken');
                                this.tokenService.GetToken(this.refreshToken).subscribe((data: any) => {
                                    this.sendToken(data.AccessToken);
                                    this.refreshToken = data.RefreshToken;
                                    localStorage.setItem('refreshToken', this.refreshToken);
                                });
                            }
                        );
                });
            }
            else if (this.refreshToken != null && this.tokenService.AccessToken != null) {
                const clonedreq = req.clone({
                    setHeaders: { Authorization: 'Bearer ' + this.tokenService.AccessToken }
                });
                return next.handle(clonedreq)
                    .do(
                        succ => { },
                        err => {
                            if (err.status === 401){

                            }
                        }
                    );
            }
            else {
                const clonedreq = req.clone({
                    setHeaders: { Authorization: 'Bearer ' }
                });
                return next.handle(clonedreq)
                    .do(
                        succ => { },
                        err => {
                            if (err.status === 401){

                            }
                        }
                    );
            }
        }
        else {
            //this.router.navigateByUrl('/login');
            // this.navCtrl.push(LoginPage); 
        }
        return next.handle(this.addToken(req, this.currentToken))
        .catch(error => {
                if (error instanceof HttpErrorResponse) {
                    // switch ((<HttpErrorResponse>error).status) {
                    //     case 400:
                    //         return this.handle400Error(error);
                    //     case 401:
                    //         return this.handle401Error(req, next);
                    // }
                } else {
                    return Observable.throw(error);
                }
            });
        //return next.handle(null).catch(error=>{return Observable.throw(error);});
    }
}