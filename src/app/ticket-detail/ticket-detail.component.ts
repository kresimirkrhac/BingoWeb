import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BettingService } from '../services/betting.service';
import { Subscription } from 'rxjs';
import { Bponude } from '../models/bponude';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css','./ticket-detail.layout.css'],
})
export class TicketDetailComponent implements OnInit {

  dataSub: Subscription;
  bponude: Bponude;
  brWin: boolean[] = [];
  numbers: number[] = [];
  
  saveTimeText = "Vrijeme nastanka";
  stakeText = "Ulog";
  extrNrText = "Broj izvlačenja";
  extrTimeText = "Vrijeme izvlačenja";
  winText = "Dobitak";
  payoutText = "Isplaćeno";
  playNrText = "Odigrani brojevi";
  drawNrText = "Izvučeni brojevi";
  
  @Input() item;
  ticketNr: string;
  bettingDate: string;
  bettingTime: string;
  stake: string;
  win: string;
  paid: string;
  status: string;
  offerNr: string;
  drawDate: string;
  drawTime: string;
  played: number[];
  pin: number;

  @Output() close = new EventEmitter<void>();

  constructor(private bettingService: BettingService) { }

  ngOnInit() {
    this.ticketNr = this.item.ticketNr;
    this.bettingDate = this.item.bettingDate;
    this.bettingTime = this.item.bettingTime;
    this.stake = this.item.stake;
    this.win = this.item.win;
    this.paid = this.item.paid;
    this.status = this.item.status;
    this.offerNr = this.item.offerNr;
    this.drawDate = this.item.drawDate;
    this.drawTime = this.item.drawTime;
    this.played = this.item.played;
    this.pin = this.item.pin;
      this.dataSub = this.bettingService.getDrawnNumbers(this.ticketNr,this.pin).subscribe(
        (data) => {
          if (data) {
            this.bponude = data[0];
            this.fillNumbers();
            for (let i = 0; i < this.played.length; i++) {
              if (this.numbers.indexOf(this.played[i]) > -1) {
                this.brWin.push(true);
              }
              else {
                this.brWin.push(false);
              }
            }
          }
          this.dataSub.unsubscribe();
        },
        (error) => {
          this.dataSub.unsubscribe();
          console.error(error);
        }
      );
  }

  fillNumbers() {
    let props = Object.keys(this.bponude);
    for (let i = 0; i < props.length; i++) {
      if (props[i].includes("Broj")) {
        if (props[i].includes("Brojpon"))
          continue;
        this.numbers.push(this.bponude[props[i]]);
      }
    }
  }

  onClose() { this.close.emit(); };

  setStyle() {
    let styles = {
      'border-bottom':  this.status[0] == 'G' ? '2rem solid rgb(196, 0, 0)' :
                        this.status[0] == 'I' ? '2rem solid rgb(0, 100, 10)' :
                        this.status[0] == 'D' ? '2rem solid darkgreen' :
                        this.status[0] == 'N' ? '2rem solid rgb(0,60,125)' : 
                        this.status[0] == 'S' ? '2rem solid brown' : 
                                                '2rem solid rgb(0,60,125)'

    };
    return styles;
  }
}
