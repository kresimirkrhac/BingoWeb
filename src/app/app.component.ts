import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BettingService } from './services/betting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private bettingService: BettingService) {}
  ngOnInit() {
    if (this.login() == false) {
      this.tryLogin();
    }
  }

  ngOnDestroy() {
    this.bettingService.logout();
  }

  private tryLogin() {
    let token = this.bettingService.getToken();
    if (token != undefined && token.length < 1) {
      setTimeout(() => {
        if (this.login() == false) {
          this.tryLogin();
        }
        else {
          this.setPosl();
        }
      }, 5000);
    }
  }

  private login(): boolean {
    let ret: boolean;
    let loginSub: Subscription = this.bettingService.login().subscribe(() => {
      loginSub.unsubscribe();
      this.setPosl();
      ret = true;
    }, error => {
      loginSub.unsubscribe();
      ret = false;
    });
    return ret;
  }

  private setPosl() {
    let token = this.bettingService.getToken();
    if (token != undefined && token.length > 0) {
      let poslSub: Subscription = this.bettingService.setPosl().subscribe(data => {
        poslSub.unsubscribe();
      }, (error) => {
        poslSub.unsubscribe();
      });
    }
    else {
      setTimeout(() => {
        this.setPosl();
      }, 500);
    }
  }
}
