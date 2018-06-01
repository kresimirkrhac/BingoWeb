import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BettingComponent } from './betting/betting.component';
import { AnimationComponent } from './animation/animation.component';


@NgModule({
  declarations: [
    AppComponent,
    BettingComponent,
    AnimationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
