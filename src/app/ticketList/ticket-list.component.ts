import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { BettingService } from '../services/betting.service';
import { ModalService } from '../services/modal.service';

import { Bticket } from '../models/bticket';
import { rowInOutTriger, detailInOutTriger } from './animations';

interface Iitems {
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
}

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css', 'ticket-list.layout.css'],
  animations: [rowInOutTriger, detailInOutTriger]
})
export class TicketListComponent implements OnInit {
  count: number;
  private tickets: Bticket[];
  errorText: string;
  open: boolean[] = [];
  detailOpen: boolean[] = [];

  /**** JwPagination propertys ****/
  // array of all items to be paged
  items: Array<Iitems> = [];
  // current page of items
  pageOfItems: Array<Iitems> = [];
  // the number of items displayed on each page (defaults to 10)
  pageSize = 10;
  // the initial page to display (defaults to 1)
  currentPage: number = 0;

  ticketNrText = "Broj listića";
  saveTimeText = "Vrijeme nastanka listića";
  stakeText = "Ulog";
  extrNrText = "Broj izvlačenja";
  extrTimeText = "Vrijeme izvlačenja";
  winText = "Dobitak";
  payoutText = "Isplaćeno";
  playNrText = "Odigrani brojevi";

  private ticketNr: string;
  private bettingDate: string;
  private bettingTime: string;
  private stake: string;
  private win: string;
  private paid: string;
  private status: string;
  private offerNr: string;
  private drawDate: string;
  private drawTime: string;
  private played: number[];
  private pin: number;

  constructor(private bettingService: BettingService, private modalService: ModalService) { }

  ngOnInit() {
    for (let i = 0; i < this.pageSize; i++) {
      this.open[i] = true;
      this.detailOpen[i] = false;
    }
    this.setCount();
  }
  
  private setCount() {
    let dataSub: Subscription = this.bettingService.getTicketCount().subscribe(
      (count) => {
        this.count = count['Count'];
        if (this.count > 0) {
          if (this.count > 1000) {
            this.count = 1000;
          }
          let item: Iitems = { ticketNr: "", bettingDate: "", bettingTime: "", stake: "", win: "",
            paid: "", status: "", offerNr: "", drawDate: "", drawTime: "", played: [], pin: 0 }
          for (let i = 0; i < this.count; i++) {
            this.items.push(item);
          }
          this.setpageOfItems();
        }
        dataSub.unsubscribe();
      },
      (error) => {
        dataSub.unsubscribe();
        this.errorText = error;
        this.openModal('modal-error');
      }
    );
  }

  private setpageOfItems() {
    if ( this.items[this.currentPage*this.pageSize].ticketNr === "") {
      let dataSub: Subscription = this.bettingService.getTickets(this.currentPage*this.pageSize, this.pageSize).subscribe(
        (tickets) => {
          this.tickets = tickets;
          this.fillItems()
          this.fillpageOfItems();
          dataSub.unsubscribe();
        },
        (error) => {
          dataSub.unsubscribe();
          this.errorText = error;
          this.openModal('modal-error');
        }
      );
    }
    else {
      this.fillpageOfItems();
    }

  }

  fillItems() {
    let date;
    let ddate;
    for (var i = 0; i < this.tickets.length; i++) {
      date = new Date(this.tickets[i].Datprim);
      ddate = new Date(this.tickets[i].Datodig);
      this.ticketNr = `${(this.tickets[i].Sifposl).toString().padStart(3, "0")}${this.tickets[i].Godina}${(this.tickets[i].Tjedan).toString().padStart(2, "0")}${(this.tickets[i].Osoprim).toString().padStart(3, "0")}${(this.tickets[i].Brtik).toString().padStart(5, "0")}`;
      this.bettingDate = `${(date.getDate()).toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`;
      this.bettingTime = `${(date.getHours()).toString().padStart(2, "0")}:${(date.getMinutes()).toString().padStart(2, "0")}:${(date.getSeconds()).toString().padStart(2, "0")}`;
      this.stake = this.tickets[i].Ulog.toFixed(2);
      this.win = this.tickets[i].Evdobbezp.toFixed(2);
      this.paid = this.tickets[i].Isplaceno.toFixed(2);
      this.status = this.tickets[i].Indik;
      this.offerNr = this.tickets[i].Brpon.toString().padStart(6, "0");
      this.drawDate = `${(ddate.getDate()).toString().padStart(2, "0")}.${(ddate.getMonth() + 1).toString().padStart(2, "0")}.${ddate.getFullYear()}`;
      this.drawTime = `${(ddate.getHours()).toString().padStart(2, "0")}:${(ddate.getMinutes()).toString().padStart(2, "0")}:${(ddate.getSeconds()).toString().padStart(2, "0")}`;
      this.played = JSON.parse(this.tickets[i].Odigrano.toString());
      this.pin = this.tickets[i].Pin;
      let item: Iitems = {ticketNr:this.ticketNr, bettingDate:this.bettingDate, bettingTime:this.bettingTime, stake:this.stake, win:this.win, paid:this.paid, status:this.status, offerNr:this.offerNr, drawDate:this.drawDate, drawTime:this.drawTime, played:this.played, pin:this.pin};
      this.items.splice(this.currentPage*this.pageSize+i,1,item);
    }
    // console.log(this.items);
  }

  fillpageOfItems() {
    this.pageOfItems = [];
    for (var i = 0; i < this.pageSize; i++) {
      this.pageOfItems.push(this.items[this.currentPage*this.pageSize+i]);
      // console.log(`items[${this.currentPage*this.pageSize+i}] = ${this.items[this.currentPage*this.pageSize+i]}`);
      
    }
    // console.log(this.pageOfItems);
  }

  closeIfDetailOpened(): number {
    let ret = 0;
    for (let i = 0; i < this.open.length; i++) {
      if (this.detailOpen[i] == true) {
        ret = this.closeDetail(i);
      }
    }
    return ret;
  }

  onChangePage(clicked: any) {
    this.closeIfDetailOpened();
    this.currentPage = clicked.page;
    this.setpageOfItems();
    // console.log(this.currentPage);
  }

  openDetail(index: number) {
    var msecWait = this.closeIfDetailOpened();
    setTimeout(() => {
      this.open[index] = false;
      this.detailOpen[index] = true;
    }, msecWait);
  }

  closeDetail(index: number): number {
    this.detailOpen[index] = false;
    setTimeout(() => {
      this.open[index] = true;
    }, 180);
    return 200;
  }

  private openModal(id: string) {
    this.modalService.open(id);
  }

  private closeModal(id: string, event: any) {
    this.modalService.close(id);
  }
}

  // primjer kako dodati style
  // setStyle(i: number) {
  //   let styles = {
  //     'background-image': this.status[i][0] == 'G' ? 'linear-gradient(rgb(255, 15, 15) 0, rgb(219, 0, 0) 10%, rgb(168, 0, 0) 90%, rgb(143, 0, 0) 100%)' :
  //                         this.status[i][0] == 'I' ? 'linear-gradient(rgb(0, 179, 18) 0, rgb(0, 128, 13) 10%, rgb(0, 77, 8) 90%, rgb(0, 51, 5) 100%)' :
  //                         this.status[i][0] == 'D' ? 'linear-gradient(rgb(0, 179, 18) 0, rgb(0, 128, 13) 10%, rgb(0, 77, 8) 90%, rgb(0, 51, 5) 100%)' :
  //                                                     'linear-gradient(rgb(0, 99, 204) 0, rgb(0, 74, 153) 10%, rgb(0, 49, 102) 90%, rgb(0, 37, 77) 100%)'

  //   };
  //   return styles;
  // }

  // ticketNr: string[] = [];
  // bettingDate: string[] = [];
  // bettingTime: string[] = [];
  // stake: string[] = [];
  // win: string[] = [];
  // paid: string[] = [];
  // status: string[] = [];
  // offerNr: string[] = [];
  // drawDate: string[] = [];
  // drawTime: string[] = [];
  // played: number[][] = [];
  // pin: number[] = [];

// fillpageOfItems() {
  // // console.log(this.tickets[0]);
  // for (var i = 0; i < this.tickets.length; i++) {
  //   let date = new Date(this.tickets[i].Datprim);
  //   this.ticketNr[i] = `${(this.tickets[i].Sifposl).toString().padStart(3, "0")}${this.tickets[i].Godina}${(this.tickets[i].Tjedan).toString().padStart(2, "0")}${(this.tickets[i].Osoprim).toString().padStart(3, "0")}${(this.tickets[i].Brtik).toString().padStart(5, "0")}`;
  //   this.bettingDate[i] = `${(date.getDate()).toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`;
  //   this.bettingTime[i] = `${(date.getHours()).toString().padStart(2, "0")}:${(date.getMinutes()).toString().padStart(2, "0")}:${(date.getSeconds()).toString().padStart(2, "0")}`;
  //   this.stake[i] = this.tickets[i].Ulog.toFixed(2);
  //   this.win[i] = this.tickets[i].Evdobbezp.toFixed(2);
  //   this.paid[i] = this.tickets[i].Isplaceno.toFixed(2);
  //   this.status[i] = this.tickets[i].Indik;
  //   this.offerNr[i] = this.tickets[i].Brpon.toString().padStart(6, "0");
  //   let ddate = new Date(this.tickets[i].Datodig);
  //   this.drawDate[i] = `${(ddate.getDate()).toString().padStart(2, "0")}.${(ddate.getMonth() + 1).toString().padStart(2, "0")}.${ddate.getFullYear()}`;
  //   this.drawTime[i] = `${(ddate.getHours()).toString().padStart(2, "0")}:${(ddate.getMinutes()).toString().padStart(2, "0")}:${(ddate.getSeconds()).toString().padStart(2, "0")}`;
  //   this.played[i] = JSON.parse(this.tickets[i].Odigrano.toString());
  //   this.pin[i] = this.tickets[i].Pin;
  //   // console.log(JSON.parse(this.tickets[i].Odigrano.toString()));
  // }
// }