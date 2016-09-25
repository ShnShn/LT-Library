import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';

import { TruncatePipe } from '../../pipes/truncate.pipe'
import  { PopOverComponent } from '../popover/popover.component'


@Component({
  templateUrl: 'build/pages/bookdetails/bookdetails.html',
  pipes : [TruncatePipe]
})

export class BookDetailsComponent {
   book : any= [];

  constructor(public navCtrl: NavController, private navParams : NavParams, private popoverCtrl: PopoverController) {
  	this.book = this.navParams.data.book;
  }

  openPopUp(myEvent){
    let popover = this.popoverCtrl.create(PopOverComponent,{
      book: this.book
    });

    popover.present({
      ev : myEvent
    });

  }
}