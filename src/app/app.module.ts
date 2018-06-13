import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http"

import { AppComponent } from './app.component';
import { BettingComponent } from './betting/betting.component';
import { AnimationComponent } from './animation/animation.component';
import { BettingServiceService } from './services/betting-service.service';

@NgModule({
  declarations: [
    AppComponent,
    BettingComponent,
    AnimationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [BettingServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
