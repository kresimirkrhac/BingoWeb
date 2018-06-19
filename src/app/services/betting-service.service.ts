import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
// import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of'; 
import { Klinst } from '../models/klinst';
import { Rparam } from '../models/rparam';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };


@Injectable()
export class BettingServiceService {
  private prodUrl: string = "https://clabck.dyndns.org:8443/nodeapi";
  // private prodUrl: string = "http://ds9a.clab.hr:8443/nodeapi";

  // token: string = "";
  //prodUrl: string = "http://192.168.1.101:8443/nodeapi";
  // actionUrl: string = "http://localhost:5013";
  username: string = "Pero";
  encryptedPassword: string = "A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=";

  constructor(private http: HttpClient) { }

  // async getToken(): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     this.http.post<any>(this.actionUrl + '/token', {Username: this.username, Password: this.encryptedPassword}, httpOptions)
  //       .toPromise()
  //       .then(
  //         (res => { return resolve(res); }),
  //         (err => { return reject(err); })
  //       );
  //   });
  // }

  login() {
    try {
    return this.http.post<any>(this.prodUrl + '/token', { Username: this.username, Password: this.encryptedPassword }).pipe(
      tap(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('token', user.token);
          // this.token = user.token;
        }
        return user;
      }),
      catchError(this.handleError<any>('Login'))
    );
  }
  catch(err) {
    console.log(err);
  }
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    // this.token = "";
  }

  getToken() {
    return localStorage.getItem('token');
    // return this.token;
  }

  getPosl(): Observable<Klinst> {
    return this.http.get<Klinst>(this.prodUrl + '/klinst?Guid=e0b9a40a-1900-11e7-93ae-92361f002671').pipe(
      tap(data => {
        if (data) {
          return data;
        }
      }),
      catchError( this.handleError<Klinst>('getPosl') )
    );
  }

  getParam(posl: number): Observable<Rparam> {
    return this.http.get<Rparam>(this.prodUrl + `/rparam?Sifposl=${posl}`).pipe(
      tap(data => {
        if (data) {
          return data;
        }
      }),
      catchError( this.handleError<Rparam>('getParam') )
    );
  }

  getNextDraw(): Observable<any> {
    return this.http.get<any>(this.prodUrl + `/nextdraw`).pipe(
      tap(data => {
        if (data) {
          console.log(`stigli podaci ${JSON.stringify(data)}`);
          return data;
        }
      }),
      catchError( this.handleError<any>('getNextDraw') )
    );
  }
 
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      console.error(`${operation} failed: ${error.message}`);
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
