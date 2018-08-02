import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { BettingComponent } from './betting/betting.component';
import { BettingService } from './services/betting.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ModalComponent } from './modal/modal.component';
import { TicketListComponent } from './ticketList/ticket-list.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { AppRoutingModule } from './app.routing.module';
import { ModalService } from './services/modal.service';
import {PaginatorModule} from 'primeng/paginator';

@NgModule({
  declarations: [
    AppComponent,
    BettingComponent,
    TicketListComponent,
    TicketDetailComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PaginatorModule
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
