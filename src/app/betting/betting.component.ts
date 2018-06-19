import { Component, OnInit, AfterContentInit, AfterContentChecked, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BettingServiceService } from '../services/betting-service.service';
// import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Klinst } from '../models/klinst';
import { Rparam } from '../models/rparam';
import { Time } from '@angular/common';

@Component({
  selector: 'app-betting',
  templateUrl: './betting.component.html',
  styleUrls: ['./betting.component.css', './betting.layout.css']
})
export class BettingComponent implements OnInit, AfterContentInit, AfterContentChecked, OnDestroy {
  @ViewChild('colorButton') colorButton: ElementRef;
  @ViewChild('colorButtonInner') colorButtonInner: ElementRef;
  @ViewChild('rowButton') rowButton: ElementRef;
  @ViewChild('rowButtonInner') rowButtonInner: ElementRef;
  @ViewChild('betButton') betButton: ElementRef;
  @ViewChild('horStake') horStake: ElementRef;
  @ViewChild('verStake') verStake: ElementRef;
  horMaxWidth: number;
  verMaxWidth: number;
  colMarginTop: number;
  rowMarginTop: number;
  butMarginTop: number;
  butMarginLeft: number;
  butSize: number;
  stakeInfoText: string = "Uplata";
  stakeBtnText: string = "Ulog po kombinaciji";
  autoPickText: string = "Automatski odabir";
  drawInfoText: string = "Izvlačenje";
  cancelText: string = "Poništi";
  saveText: string = "Spremi";
  nrComb: number[] = [1, 7, 28, 84, 210];
  nrNumbers: number = 0;
  stakeAmount: string = "0.00";
  stakePerComb: string = "0.00";
  oldValue: string;
  betButtons: any[] = [];
  colors: string[] = ["red", "yellow", "blue", "orange", "green", "rose", "purple"];
  border: string[] = ["brd-red", "brd-yellow", "brd-blue", "brd-orange", "brd-green", "brd-rose", "brd-purple"];
  doResize: boolean;
  nrResize: number;
  loginSub: Subscription;
  poslSub: Subscription;
  paramSub: Subscription;
  nextDrawSub: Subscription
  posl: Klinst;
  param: Rparam;
  drawNr: number;
  drawTotSec: number;
  drawMin: number;
  drawSec: string;
  drawTime: number;

  constructor(private bettingService: BettingServiceService) { }

  ngOnInit() {
    this.bettingService.logout();
    for (var i = 0; i < 49; i++) {
      this.betButtons.push({ checked: false, color: this.colors[i % 7], border: this.border[i % 7], value: i + 1 });
    }
    this.loginSub = this.bettingService.login().subscribe(
      () => {

        this.poslSub = this.bettingService.getPosl().subscribe(
          data => {
            this.posl = data;
            console.log(JSON.stringify(this.posl));
            if (this.posl != undefined) {
              this.paramSub = this.bettingService.getParam(this.posl.Sifposl).subscribe(
                data => {
                  this.param = data;
                  console.log(JSON.stringify(this.param));
                },
                (error) => {
                  console.log(`greska ${JSON.stringify(error)}`)
                }
              );
            }
          },
          (error) => {
            console.log(`greska ${JSON.stringify(error)}`)
          }
        );

        this.nextDrawSub = this.bettingService.getNextDraw().subscribe(
          data => {
            if (data.ID) {
              this.drawNr = data.ID;
            }
            if (data.Sekunde) {
              this.drawTotSec = data.Sekunde;
              this.drawTime = Date.now() + this.drawTotSec * 1000;
              this.setMinSec();
              this.showTime();
            }
            this.nextDrawSub.unsubscribe();
          },
          error => {
            console.log(`greska ${JSON.stringify(error)}`);
            this.nextDrawSub.unsubscribe();
          }
        );

      },
      error => {
        console.log(`greska ${JSON.stringify(error)}`);
      }
    );
  }

  ngAfterContentInit() {
    this.doResize = true;
    this.nrResize = 0;
  }

  ngAfterContentChecked() {
    if (this.doResize && this.nrResize < 2) {
      // if (this.nrResize == 1) {
      this.Resize();
      // }
      this.nrResize++;
    }
    else {
      this.doResize = false;
      this.nrResize = 0;
    }
  }

  ngOnDestroy() {
    this.bettingService.logout();
    this.loginSub.unsubscribe();
    this.paramSub.unsubscribe();
  }

  setMinSec() {
    this.drawMin = Math.floor(this.drawTotSec / 60);
    if ((this.drawTotSec % 60) < 10) {
      this.drawSec = `0${this.drawTotSec % 60}`;
    }
    else {
      this.drawSec = `${this.drawTotSec % 60}`;
    }
  }
  showTime() {
    setTimeout(() => {
      var now = Date.now();
      this.drawTotSec = Math.floor((this.drawTime - now) / 1000);
      if (this.drawTotSec > 0) {
        this.setMinSec();
        this.showTime();
      }
      else {
        if (this.drawNr == 288) {
          var day = this.drawNr / 1000;
          this.drawNr = (day + 1) * 1000 + 1;
        }
        else {
          this.drawNr += 1;
        }
        this.drawTime += 300000;
        this.drawTotSec = 300;
        this.setMinSec();
        this.showTime();
        setTimeout(() => {
          this.nextDrawSub = this.bettingService.getNextDraw().subscribe(
            data => {
              if (data.ID) {
                this.drawNr = data.ID;
              }
              if (data.Sekunde) {
                this.drawTime = Date.now() + this.drawTotSec * 1000;
                this.drawTotSec = data.Sekunde;
                this.setMinSec();
                this.showTime();
              }
              this.nextDrawSub.unsubscribe();
            },
            error => {
              this.nextDrawSub.unsubscribe();
              console.log(`greska ${JSON.stringify(error)}`);
            }
          );
        }, Math.random()*50000)
      }
    },990);
  }
  // async getToken() {
  //   try {
  //     await this.bettingService.getToken()
  //       .then((data: any) => {
  //         console.log(`data ${JSON.stringify(data)}`);
  //       });
  //   } catch (err) {
  //     console.log(`greska ${JSON.stringify(err)}`);
  //   }
  // }

  // login() {
  //   this.loginSub = this.bettingService.login()
  //     // .first()
  //     .subscribe(
  //       data => {
  //         console.log(`data ${JSON.stringify(data)}`);
  //         // this.token = JSON.stringify(data);
  //       },
  //       error => {
  //         console.log(`greska ${JSON.stringify(error)}`);
  //       }
  //     );
  // }

  private stakePerCombIn() {
    this.oldValue = this.stakePerComb;
  }
  private stakePerCombOut() {
    if (this.oldValue !== this.stakePerComb) {
      this.clacStakeAmount();
      this.stakePerComb = parseFloat(this.stakePerComb).toFixed(2);
    }
  }
  private stakeAmountIn() {
    this.oldValue = this.stakeAmount;
  }
  private stakeAmountOut() {
    if (this.oldValue !== this.stakeAmount) {
      this.clacStakePerComb();
      this.stakeAmount = parseFloat(this.stakeAmount).toFixed(2);

    }
  }

  private betButtonChecked(event: any) {
    var index = event.path["0"].innerHTML;
    if (this.betButtons[index - 1].checked == false && this.nrNumbers == 10) {
      return;
    }
    if (this.betButtons[index - 1].checked == false) {
      this.nrNumbers++;
    }
    else {
      this.nrNumbers--;
    }
    this.betButtons[index - 1].checked = !this.betButtons[index - 1].checked;
    this.clacStakeAmount();
  }

  // getNrNumbers(): number {
  //   var nrChecked = 0;
  //   for (var i = 0; i < this.betButtons.length; i++) {
  //     if (this.betButtons[i].checked == true) {
  //       nrChecked++;
  //     }
  //   }
  //   return nrChecked;
  // }

  private colorButtonChecked(index: number, event: any) {
    for (var i = 0; i < this.betButtons.length; i++) {
      if ((i % 7) == index) {
        this.betButtons[i].checked = true;
      }
      else {
        this.betButtons[i].checked = false;
      }
    }
    this.nrNumbers = 7;
    this.clacStakeAmount();
    event.target.style.outline = "none";
  }

  private rowButtonChecked(index: number, event: any) {
    for (var i = 0; i < this.betButtons.length; i++) {
      if (i >= index * 7 && i < (index + 1) * 7) {
        this.betButtons[i].checked = true;
      }
      else {
        this.betButtons[i].checked = false;
      }
    }
    this.nrNumbers = 7;
    this.clacStakeAmount();
    event.target.style.outline = "none";
  }

  private autoPick(event: any) {
    var nrToPick = event.path["0"].innerHTML;
    var nrPicked = 0;
    var picked: number;
    for (var i = 0; i < this.betButtons.length; i++) {
      if (this.betButtons[i].checked == true) {
        this.betButtons[i].checked = false;
      }
    }
    while (nrPicked < nrToPick) {
      picked = Math.floor(Math.random() * this.betButtons.length);
      if (this.betButtons[picked].checked != true) {
        this.betButtons[picked].checked = true;
        nrPicked++;
      }
    }
    this.nrNumbers = nrPicked;
    this.clacStakeAmount();
    event.target.style.outline = "none";
  }

  stakeClicked(event: any) {
    this.stakePerComb = event.path["0"].innerHTML;
    this.clacStakeAmount();
    event.target.style.outline = "none";
  }

  private clacStakeAmount() {
    this.stakeAmount = "0.00";
    if (this.nrNumbers < 6 || this.nrNumbers > 10) {
      return;
    }
    if (parseFloat(this.stakePerComb) < 0.01) {
      return;
    }
    this.stakeAmount = (Math.round(this.nrComb[this.nrNumbers - 6] * parseFloat(this.stakePerComb) * 100) / 100).toFixed(2);
  }

  private clacStakePerComb() {
    this.stakePerComb = "0.00";
    if (this.nrNumbers < 6 || this.nrNumbers > 10) {
      return;
    }
    if (parseFloat(this.stakeAmount) < 0.01) {
      return;
    }
    this.stakePerComb = (Math.round(parseFloat(this.stakeAmount) / this.nrComb[this.nrNumbers - 6] * 100) / 100).toFixed(2);
  }

  private cancel(event: any) {
    for (var i = 0; i < this.betButtons.length; i++) {
      if (this.betButtons[i].checked == true) {
        this.betButtons[i].checked = false;
      }
    }
    this.nrNumbers = 0;
    this.stakePerComb = "0.00";
    this.stakeAmount = "0.00";
    event.target.style.outline = "none";
    console.log(`stakePerComb => ${this.stakePerComb}`);
  }
  private canSave(): boolean {
    var canNotSave: boolean = true;
    if (this.nrNumbers < 6 || this.nrNumbers > 10) { canNotSave = true; }
    else if (parseFloat(this.stakeAmount) < this.param.Bminupl) { canNotSave = true; }
    else if (parseFloat(this.stakeAmount) > this.param.Bmaxupl) { canNotSave = true; }
    else { canNotSave = false }
    return canNotSave;
  }

  private Resize() {
    this.butMarginTop = this.butMarginLeft = this.colMarginTop = this.rowMarginTop = 0;
    // var betButtons = document.querySelectorAll('.bet-button');
    // var element = betButtons[0];
    if (this.betButton.nativeElement.clientHeight < this.betButton.nativeElement.clientWidth) {
      // console.log(`(s < w) clientHeight ${this.betButton.nativeElement.clientHeight} clientWidth ${this.betButton.nativeElement.clientWidth} scrollWidth ${this.betButton.nativeElement.scrollWidth}`);
      this.butSize = this.betButton.nativeElement.clientHeight;
      this.butMarginLeft = (this.betButton.nativeElement.clientWidth - this.betButton.nativeElement.clientHeight) / 2;
    }
    else {
      this.butSize = this.betButton.nativeElement.clientWidth;
      // console.log(`(s >= w) clientHeight ${this.betButton.nativeElement.clientHeight} clientWidth ${this.betButton.nativeElement.clientWidth}`);
      this.butMarginTop = (this.betButton.nativeElement.clientHeight - this.betButton.nativeElement.clientWidth) / 2;
    }
    this.horMaxWidth = this.horStake.nativeElement.clientWidth;
    this.verMaxWidth = this.verStake.nativeElement.clientWidth;

    // var colButtons = document.querySelectorAll('.color-button');
    // var colButtonsInner = document.querySelectorAll('.color-button-inner');
    // var colElemHorisontal = colButtons[0];
    // var colElemHorInner = colButtonsInner[0];
    if (this.colorButton.nativeElement.clientHeight > this.colorButtonInner.nativeElement.clientHeight) {
      this.colMarginTop = (this.colorButton.nativeElement.clientHeight - this.colorButtonInner.nativeElement.clientHeight) / 2;
    }
    // var rowButtons = document.querySelectorAll('.row-button');
    // var rowButtonsInner = document.querySelectorAll('.row-button-inner');
    // var rowElemHorisontal = rowButtons[0];
    // var rowElemHorInner = rowButtonsInner[0];
    if (this.rowButton.nativeElement.clientHeight > this.rowButtonInner.nativeElement.clientHeight) {
      this.rowMarginTop = (this.rowButton.nativeElement.clientHeight - this.rowButtonInner.nativeElement.clientHeight) / 2;
    }
  }

  private pickKeyPressed(event: any) {
    // Check to see if space or enter were pressed
    if (event.key === " " || event.key === "Enter") {
      // Prevent the default action to stop scrolling when space is pressed
      event.preventDefault();
      this.autoPick(event);
    }
  }

  private stakeKeyPressed(event: any) {
    // Check to see if space or enter were pressed
    if (event.key === " " || event.key === "Enter") {
      // Prevent the default action to stop scrolling when space is pressed
      event.preventDefault();
      this.stakeClicked(event);
    }
  }
}