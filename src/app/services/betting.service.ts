import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
// import 'rxjs/add/operator/map';
import { of } from 'rxjs/observable/of'; 
import { Klinst } from '../models/klinst';
import { Rparam } from '../models/rparam';
import { Bticket } from '../models/bticket';
import { tick } from '@angular/core/testing';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };


@Injectable()
export class BettingService {
  // private prodUrl: string = "http://ds9a.clab.hr:8443/nodeapi";
  //prodUrl: string = "http://192.168.1.101:8443/nodeapi";
  // private prodUrl: string = "https://clabck.dyndns.org:8443/nodeapi";
  // private prodUrl: string = "http://clabck.dyndns.org:8443/nodeapi";
  private prodUrl: string = "http://192.168.1.56:8443/nodeapi";

  // token: string = "";
  username: string = "Pero";
  encryptedPassword: string = "A6xnQhbz4Vx2HuGl4lXwZ5U2I8iziLRFnhP5eNfIRvQ=";
  // poslID: number = 0;
  // osobaID: number = 0;

  constructor(private http: HttpClient) { }

  // async getToken(): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     this.http.post<any>(this.prodUrl + '/token', {Username: this.username, Password: this.encryptedPassword}, httpOptions)
  //       .toPromise()
  //       .then(
  //         (res => { return resolve(res); }),
  //         (err => { return reject(err); })
  //       );
  //   });
  // }

  login() {
    // try {
      return this.http.post<any>(this.prodUrl + '/token', { Username: this.username, Password: this.encryptedPassword }).pipe(
        tap(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            sessionStorage.setItem('token', user.token);
            // localStorage.setItem('token', user.token);
            // this.token = user.token;
            var person = this.decodeToken(user.token);
            if (person != undefined) {
              // this.osobaID = person['osobaid'];
              sessionStorage.setItem('osoba',person['osobaid']);
            }
          }
          return user;
        }),
        catchError(this.handleError<any>('Login'))
      );
    // }
    // catch (err) {
    //   console.log(err);
    // }
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('token');
    // localStorage.removeItem('token');
    // this.token = "";
  }

  getPoslID() {
    return sessionStorage.getItem('posl');
  }

  getOsobaID() {
    return sessionStorage.getItem('osoba');
  }

  getToken() {
    return sessionStorage.getItem('token');
    // return localStorage.getItem('token');
    // return this.token;
  }

  setPosl(): Observable<Klinst> {
    return this.http.get<Klinst>(this.prodUrl + '/klinst?Guid=e0b9a40a-1900-11e7-93ae-92361f002671').pipe(
      tap(data => {
        if (data) {
          sessionStorage.setItem('poslAll',JSON.stringify(data));
          return data;
        }
      }),
      catchError( this.handleError<Klinst>('setPosl') )
    );
  }

  getPosl(): Observable<Klinst> {
    return this.http.get<Klinst>(this.prodUrl + '/klinst?Guid=e0b9a40a-1900-11e7-93ae-92361f002671').pipe(
      tap(data => {
        if (data) {
          // this.poslID = data.Sifposl;
          sessionStorage.setItem('posl',data.Sifposl.toString());
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
          // var date = new Date();          console.log(`stigli podaci ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${JSON.stringify(data)}`);
          return data;
        }
      }),
      catchError( this.handleError<any>('getNextDraw') )
    );
  }

  saveTicket(ticket: Bticket): Observable<Bticket> {
      return this.http.post<Bticket>(this.prodUrl + '/Bticket', { 
        Sifposl:  ticket.Sifposl,
        Godina:   ticket.Godina,
        Tjedan:   ticket.Tjedan,
        Osoprim:  ticket.Osoprim, 
        Datprim:  ticket.Datprim, 
        Uplata:   ticket.Uplata,
        Ulog:     ticket.Ulog,
        Mtros:    ticket.Mtros,
        Indik:    ticket.Indik,
        Krugova:  ticket.Krugova,
        Brpon:    ticket.Brpon,
        Odigrano: ticket.Odigrano
       }).pipe(
        tap(ticket => {
          return ticket;
        }),
        catchError(this.handleError<Bticket>('saveTicket'))
      );
  }

  getTicketCount(): Observable<number> {
    let posl = this.getPoslID();
    let osoba = this.getOsobaID();
    return this.http.get<any>(this.prodUrl + `/bticket/osocount?Sifposl=${posl}&Osoprim=${osoba}`).pipe(
      tap(data => {
        if (data) {
          var date = new Date();          console.log(`stigli podaci ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${JSON.stringify(data)}`);
          return data;
        }
      }),
      catchError( this.handleError<any>('getTicketCount') )
    );
  }
  getTickets(ind: number): Observable<Bticket[]> {
    let ticket: Bticket[] = [];
    let odigrano: number[][];
    odigrano = [];
    odigrano.push([1,2,3,4,5,6]);
    odigrano.push([7,8,9,10,11,12,13,14]);

    ticket.push({ Sifposl: 999, Godina: 18, Tjedan: 28, Osoprim: 123, Brtik: 121, 
      Datprim: new Date(), Osoispl: 0, Datispl: new Date(), Osostrn: 0,
      Datstrn: new Date(), Ulog: 1.9, Mtros: 0.1, Uplata: 2.0, 
      Evdobsp: 12.0, Evporez: 0.0, Evdobbezp: 12.0, Isplaceno: 0.0,
      Datpromj: new Date(), Osopromj: 123, Indik: 'N', Pin: 1234,
      Brpon: 123122, Datodig: new Date(), Krugova: 1,
      Odigrano: odigrano, Jack1: 0 }
    );
    ticket.push({ Sifposl: 999, Godina: 18, Tjedan: 28, Osoprim: 123, Brtik: 122, 
      Datprim: new Date(), Osoispl: 0, Datispl: new Date(), Osostrn: 0,
      Datstrn: new Date(), Ulog: 2.8, Mtros: 0.2, Uplata: 3.0, 
      Evdobsp: 14.0, Evporez: 0.0, Evdobbezp: 14.0, Isplaceno: 0.0,
      Datpromj: new Date(), Osopromj: 123, Indik: 'N', Pin: 1234,
      Brpon: 123122, Datodig: new Date(), Krugova: 1,
      Odigrano: odigrano, Jack1: 0 }
    );
    return of(ticket);
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
      // console.error(error); // log to console instead

      console.error(`${operation} failed: code => ${error.status} text => ${error.statusText}`);
 
      // Let the app keep running by returning an empty result.
      // return of(result as T);
      throw new Error(`${error.status} ${error.statusText}`);
    };
  }

  private urlBase64Decode(str: string) {
    var output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: { break; }
      case 2: { output += '=='; break; }
      case 3: { output += '='; break; }
      default: {
        throw 'Illegal base64url string!';
      }
    }
    return decodeURIComponent(escape(window.atob(output)));
  }
      
  public decodeToken(token: string) {
    var parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }
    var decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }
    return JSON.parse(decoded);
  }
}