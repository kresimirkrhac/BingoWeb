import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TicketListComponent } from './ticketList/ticket-list.component';
import { BettingComponent } from './betting/betting.component';

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forRoot([
      { path: 'ticket-list', component: TicketListComponent },
      { path: '', component: BettingComponent },
      { path: '**', redirectTo: '' }
    ])
  ],
  exports: [
    RouterModule,
  ],
  providers: [],

})
export class AppRoutingModule {}