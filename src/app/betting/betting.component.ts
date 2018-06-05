import { Component, OnInit, AfterContentInit, AfterContentChecked, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-betting',
  templateUrl: './betting.component.html',
  styleUrls: ['./betting.component.css', './betting.layout.css']
})
export class BettingComponent implements OnInit, AfterContentInit, AfterContentChecked {
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
  nrComb: number[] = [1,7,28,84,210];
  nrNumbers: number = 0;
  stakeAmount: number;
  stakePerComb: number = 0.00;
  betButtons: any[] = [];
  colors: string[] = ["red", "yellow", "blue", "orange", "green", "rose", "purple" ];
  border: string[] = ["brd-red", "brd-yellow", "brd-blue", "brd-orange", "brd-green", "brd-rose", "brd-purple" ];
  doResize: boolean;
  nrResize: number;
  
  constructor() {  }

  ngOnInit() {
    for(var i = 0; i < 49; i++) {
      this.betButtons.push({ checked: false, color: this.colors[i%7], border: this.border[i%7], value: i+1});
    }
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

  private betButtonChecked(event: any) {
    var index = event.path["0"].innerHTML;
    if (this.betButtons[index-1].checked == false && this.nrNumbers == 10) {
      return;
    }
    if (this.betButtons[index-1].checked == false) {
      this.nrNumbers++;
    }
    else {
      this.nrNumbers--;
    }
    this.betButtons[index-1].checked = !this.betButtons[index-1].checked;
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

  private colorButtonChecked(index: number) {
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
  }

  private rowButtonChecked(index: number ) {
    for (var i = 0; i < this.betButtons.length; i++) {
      if (i >= index * 7 && i < (index+1) * 7) {
        this.betButtons[i].checked = true;
      }
      else {
        this.betButtons[i].checked = false;        
      }
    }
    this.nrNumbers = 7;
    this.clacStakeAmount();
  }

  private autoPick(event: any) {
    var nrToPick = event.path["0"].innerHTML;
    var nrPicked = 0;
    var picked : number;
    for (var i = 0; i < this.betButtons.length; i++) {
      if (this.betButtons[i].checked == true) {
        this.betButtons[i].checked = false;
      }
    }
    while(nrPicked < nrToPick) {
      picked = Math.floor(Math.random() * this.betButtons.length);
      if (this.betButtons[picked].checked != true) {
        this.betButtons[picked].checked = true;
        nrPicked++;
      }
    }
    this.nrNumbers = nrPicked;
    this.clacStakeAmount();
  }

  stakeClicked(event: any) {
    this.stakePerComb = event.path["0"].innerHTML;
    this.clacStakeAmount();
  }

  private clacStakeAmount() {
    this.stakeAmount = 0.00;
    if (this.nrNumbers < 6 || this.nrNumbers > 10) {
      return;
    }
    if (this.stakePerComb < 0.01) {
      return;
    }
    this.stakeAmount = Math.round(this.nrComb[this.nrNumbers-6] * this.stakePerComb * 100) / 100;
  }
  private cancel() {
    for (var i = 0; i < this.betButtons.length; i++) {
      if (this.betButtons[i].checked == true) {
        this.betButtons[i].checked = false;
      }
    }
    this.nrNumbers = 0;
    this.stakePerComb = 0.00;
    this.stakeAmount = 0.00;
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