import { Component, OnInit } from '@angular/core';
import { BettingService } from '../services/betting.service';
import { Bticket } from '../models/bticket';
import { Subscription } from '../../../node_modules/rxjs/Subscription';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  count: number;
  tickets: Bticket[];
  dataSub: Subscription;
  errorText: string;

  constructor(private bettingService: BettingService, private modalService: ModalService) { }

  ngOnInit() {
    if (this.bettingService.getToken().length < 1) {
      console.log('Nema tokena');
      this.login();
    }
    console.log(this.bettingService.getOsobaID(), this.bettingService.getPoslID());
    this.bettingService.getTicketCount().subscribe(
      count => this.count = count,
      (error) => {
        this.dataSub.unsubscribe();
        this.errorText = error;
        this.openModal('modal-error');
      }
    );
    this.bettingService.getTickets(0).subscribe(
      (tickets) => { this.tickets = tickets; }
    );
    console.log(this.bettingService.getToken());
  }
  private openModal(id: string) {
    this.modalService.open(id);
  }

  private closeModal(id: string, event: any) {
    this.modalService.close(id);
  }

  private login() {
    let loginSub: Subscription = this.bettingService.login().subscribe(() => {
      loginSub.unsubscribe();
    }, error => {
      loginSub.unsubscribe();
      this.errorText = error;
      this.openModal('modal-error');
    });
  }
}
