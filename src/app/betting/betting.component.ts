import { Component, OnInit, AfterContentInit, AfterContentChecked, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BettingService } from '../services/betting.service';
import { Subscription } from 'rxjs/Subscription';

import { Klinst } from '../models/klinst';
import { Rparam } from '../models/rparam';
import { Bticket } from '../models/bticket'
import { ModalService } from '../services/modal.service';

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
  closeText: string = "Zatvori";
  printText: string = "Ispisi";
  disabled: boolean = true;
  nrComb: number[] = [1, 7, 28, 84, 210];
  nrNumbers: number = 0;
  numbers: number[];
  stakeAmount: string = "0.00";
  stakePerComb: string = "0.00";
  oldValue: string;
  betButtons: any[] = [];
  colors: string[] = ["red", "yellow", "blue", "orange", "green", "rose", "purple"];
  border: string[] = ["brd-red", "brd-yellow", "brd-blue", "brd-orange", "brd-green", "brd-rose", "brd-purple"];
  doResize: boolean;
  nrResize: number;
  loginSub: Subscription;
  dataSub: Subscription;
  data1Sub: Subscription;
  nextDrawSub: Subscription
  osobaID: number;
  posl: Klinst;
  param: Rparam;
  drawNr: number;
  serDrawTime: string;
  drawTotSec: number;
  drawMin: number;
  drawSec: string;
  drawTime: number;
  ticket: Bticket;
  errorText: string;

  // property za ispis listica
  ticketNrText: string = "Broj listića";
  pinText: string = "Kontrolni broj";
  betType: string = "Vrsta oklade";
  gameText: string = "BeSix";
  extractionText: string = "Izvlačenje";
  atText: string = "u";
  kombText: string = "kombinacija";
  stakeText: string = "ULOG";
  totalStakeText: string = "UKUPNI ULOG";
  footerText1: string = "Svi dobici prikazani na ekranu";
  footerText2: string = "odnose se na ulog od 1.00";
  footerText3: string = "** Decimalna vrijednost u dobitku **";
  footerText4: string = "** dodaje se u Jackpot **";
  officeName: string;
  ticketNr: string;
  bettingDate: string;
  bettingTime: string;
  betComb: number;
  pin: string;
  offerNr: string;

  constructor(private bettingService: BettingService, private modalService: ModalService) { }

  ngOnInit() {
    this.ticket = new Bticket();
    this.bettingService.logout();
    for (var i = 0; i < 49; i++) {
      this.betButtons.push({ checked: false, color: this.colors[i % 7], border: this.border[i % 7], value: i + 1 });
    }
    this.loginSub = this.bettingService.login().subscribe(
      () => {
        
        this.osobaID = this.bettingService.getOsobaID();

        this.dataSub = this.bettingService.getPosl().subscribe(
          data => {
            this.posl = data;
            // console.log(JSON.stringify(this.posl));

            if (this.posl != undefined) {
              this.officeName = this.posl.Poslovnica;
              this.data1Sub = this.bettingService.getParam(this.posl.Sifposl).subscribe(
                data => {
                  this.param = data[0];
                  this.data1Sub.unsubscribe();
                  // console.log(JSON.stringify(this.param));
                },
                (error) => {
                  this.data1Sub.unsubscribe();
                  this.errorText = error;
                  this.openModal('modal-error');
                }
              );
            }
            this.dataSub.unsubscribe();
          },
          (error) => {
            this.dataSub.unsubscribe();
            this.errorText = error;
            this.openModal('modal-error');
          }
        );
        this.nextDraw();
        this.loginSub.unsubscribe();
      },
      error => {
        this.loginSub.unsubscribe();
        this.errorText = error;
        this.openModal('modal-error');
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
  }

  setMinSec() {
    this.drawMin = Math.floor(this.drawTotSec / 60);
    if ((this.drawTotSec % 60) < 10) {
      this.drawSec = `0${this.drawTotSec % 60}`;
    }
    else {
      this.drawSec = `${this.drawTotSec % 60}`;
    }
    this.canSave();
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
        // var date = new Date();        console.log(`nula sekundi ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
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
          this.nextDraw();
        }, Math.random()*50000)
      }
    },950);
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

  betButtonChecked(event: any) {
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

  colorButtonChecked(index: number, event: any) {
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

  rowButtonChecked(index: number, event: any) {
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

  autoPick(event: any) {
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
    this.stakePerComb += '0';
    this.clacStakeAmount();
    event.target.style.outline = "none";
  }

  private clacStakeAmount() {
    this.stakeAmount = "0.00";
    if (this.nrNumbers < 6 || this.nrNumbers > 10) {
      this.canSave();
      return;
    }
    if (parseFloat(this.stakePerComb) < 0.01) {
      this.canSave();
      return;
    }
    this.stakeAmount = (Math.round(this.nrComb[this.nrNumbers - 6] * parseFloat(this.stakePerComb) * 100) / 100).toFixed(2);
    this.betComb = this.nrComb[this.nrNumbers - 6];
    this.canSave();
  }

  private clacStakePerComb() {
    this.stakePerComb = "0.00";
    this.canSave();
    if (this.nrNumbers < 6 || this.nrNumbers > 10) {
      return;
    }
    if (parseFloat(this.stakeAmount) < 0.01) {
      return;
    }
    this.stakePerComb = (Math.round(parseFloat(this.stakeAmount) / this.nrComb[this.nrNumbers - 6] * 100) / 100).toFixed(2);
    this.betComb = this.nrComb[this.nrNumbers - 6];
  }

  cancel(event: any) {
    for (var i = 0; i < this.betButtons.length; i++) {
      if (this.betButtons[i].checked == true) {
        this.betButtons[i].checked = false;
      }
    }
    this.nrNumbers = 0;
    this.stakePerComb = "0.00";
    this.stakeAmount = "0.00";
    event.target.style.outline = "none";
    this.disabled = true;
  }

  canSave() {
    var canNotSave: boolean = true;
    if (this.nrNumbers < 6 || this.nrNumbers > 10) { canNotSave = true; }
    else if (parseFloat(this.stakeAmount) < this.param.Bminupl) { canNotSave = true; }
    else if (parseFloat(this.stakeAmount) > this.param.Bmaxupl) { canNotSave = true; }
    else if (this.drawTotSec < 2) { canNotSave = true; }
    else if (this.drawTotSec > 285) { canNotSave = true; }    
    else { canNotSave = false }
    this.disabled = canNotSave;
  }

  save(event: any) {
    var odigrano = [];
    this.ticket.Odigrano = [];
    var date = new Date();
    event.target.style.outline = "none";
    this.ticket.Sifposl = this.posl.Sifposl;
    this.ticket.Godina = date.getFullYear() % 100;
    this.ticket.Tjedan = this.getWeek(date);
    this.ticket.Osoprim = this.osobaID;
    this.ticket.Brtik = 0;
    this.ticket.Datprim = date;
    this.ticket.Uplata = parseFloat(this.stakeAmount);
    if (this.param.Mantr >= 0.01) {
      this.ticket.Ulog = Math.round(this.ticket.Uplata * 100 / ((100 + this.param.Mantr) / 100)) / 100;
    }
    else {
      this.ticket.Ulog = parseFloat(this.stakeAmount);
    }
    this.ticket.Mtros = Math.round((this.ticket.Uplata - this.ticket.Ulog) * 100) / 100;
    this.ticket.Indik = 'N';
    this.ticket.Krugova = 1;
    this.ticket.Brpon = this.drawNr;
    for (var i = 0; i < this.betButtons.length; i++) {
      if (this.betButtons[i].checked == true) {
        odigrano.push(this.betButtons[i].value);
      }
    }
    this.ticket.Odigrano.push(odigrano);
    this.dataSub = this.bettingService.saveTicket(this.ticket).subscribe(
      data => {
        console.log(data);
        this.ticket = data;
        if ( this.ticket != undefined && this.ticket.Brtik > 0) {
          this.numbers = this.ticket.Odigrano[0].slice();
          let date = new Date(this.ticket.Datprim);
          this.bettingDate = `${(date.getDate()).toString().padStart(2,"0")}.${(date.getMonth()+1).toString().padStart(2,"0")}.${date.getFullYear()}`;
          this.bettingTime = `${(date.getHours()).toString().padStart(2,"0")}:${(date.getMinutes()).toString().padStart(2,"0")}:${(date.getSeconds()).toString().padStart(2,"0")}`;
          this.ticketNr = `${(this.ticket.Sifposl).toString().padStart(3,"0")}${this.ticket.Godina}${(this.ticket.Tjedan).toString().padStart(2,"0")}${(this.ticket.Osoprim).toString().padStart(3,"0")}${(this.ticket.Brtik).toString().padStart(5,"0")}`;
          this.pin = `${(this.ticket.Pin).toString().padStart(4,"0")}`;
          this.offerNr = `${(this.ticket.Brpon).toString().padStart(6,"0")}`
          this.openModal('modal-ticket');
          this.dataSub.unsubscribe();
        }
      },
      error => {
        this.dataSub.unsubscribe();
        this.errorText = error;
        this.openModal('modal-error');
      });
  }

  private nextDraw() {
    this.nextDrawSub = this.bettingService.getNextDraw().subscribe(data => {
      // console.log(data);
      if (data) {
        this.drawNr = data.ID;
        this.serDrawTime = data.Vrijeme;
      }
      if (data.Sekunde) {
        this.drawTotSec = data.Sekunde;
        this.drawTime = Date.now() + this.drawTotSec * 1000;
        this.setMinSec();
        this.showTime();
        // console.log(`vrijeme izvlacenja ${new Date(this.drawTime).getHours()}:${new Date(this.drawTime).getMinutes()}:${new Date(this.drawTime).getSeconds()}`);
      }
      this.nextDrawSub.unsubscribe();
    }, error => {
      this.nextDrawSub.unsubscribe();
      this.errorText = error;
      this.openModal('modal-error');
    });
  }
  private getWeek( d: Date ): number { 

    // Create a copy of this date object  
    var target  = new Date(d.valueOf());  
    
    // ISO week date weeks start on monday  
    // so correct the day number  
    var dayNr   = (d.getDay() + 6) % 7;  
  
    // Set the target to the thursday of this week so the  
    // target date is in the right year  
    target.setDate(target.getDate() - dayNr + 3);  
  
    // ISO 8601 states that week 1 is the week  
    // with january 4th in it  
    var jan4    = new Date(target.getFullYear(), 0, 4);  
  
    // Number of days between target date and january 4th  
    var dayDiff = (target.valueOf() - jan4.valueOf()) / 86400000;
  
    // Calculate week number: Week 1 (january 4th) plus the    
    // number of weeks between target date and january 4th    
    var weekNr = Math.ceil(dayDiff / 7);    
  
    return weekNr;    
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
  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string, event: any) {
    this.modalService.close(id);
    this.cancel(event);
  }
 
  printModal(divName,event: any){
  //   this.closeModal('modal-ticket',event);
  //   var printContents = document.getElementById(divName).innerHTML;
  //   var originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
    window.print();
  //   document.body.innerHTML = originalContents;
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