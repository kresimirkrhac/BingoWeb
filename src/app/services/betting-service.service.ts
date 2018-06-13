import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class BettingServiceService {
  // private actionUrl: string = "https://clabck.dyndns.org:8443/nodeapi";
  private actionUrl: string = "http://ds9a.clab.hr:8443/nodeapi";
  username: string = "kreso";
  encryptedPassword: string = "5994471ABB01112AFCC18159F6CC74B4F511B99806DA59B3CAF5A9C173CACFC5";
  constructor(private http: HttpClient) { }

  async getToken(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.post<any>(this.actionUrl + '/token', {Username: this.username, Password: this.encryptedPassword}, httpOptions)
        .toPromise()
        .then(
          (res => { return resolve(res); }),
          (err => { return reject(err); })
        );
    });
  }


}
