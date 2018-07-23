import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"

import { AppComponent } from './app.component';
import { BettingComponent } from './betting/betting.component';
import { BettingService } from './services/betting.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ModalComponent } from './modal/modal.component';
import { ModalService } from './services/modal.service';
import { TicketListComponent } from './ticketList/ticket-list.component';
import { AppRoutingModule } from './app.routing.module';

@NgModule({
  declarations: [
    AppComponent,
    BettingComponent,
    TicketListComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    BettingService,
    ModalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
