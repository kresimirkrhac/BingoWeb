import { Component, OnInit } from '@angular/core';
import { Subscription } from '../../node_modules/rxjs/Subscription';
import { BettingService } from './services/betting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private bettingService: BettingService) {}
  ngOnInit() {
    if (this.login() == false) {
      this.tryLogin();
    }
  }

  private tryLogin() {
    if (this.bettingService.getToken().length < 1) {
      setTimeout(() => {
        if (this.login() == false) {
          this.tryLogin();
        }
      }, 5000);
    }
  }

  private login(): boolean {
    let ret: boolean;
    let loginSub: Subscription = this.bettingService.login().subscribe(() => {
      loginSub.unsubscribe();
      ret = true;
    }, error => {
      loginSub.unsubscribe();
      ret = false;
    });
    return ret;
  }

  private setPosl() {
    if (this.bettingService.getToken().length > 0) {
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
