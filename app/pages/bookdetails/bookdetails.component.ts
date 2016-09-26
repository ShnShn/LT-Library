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
   selectedBookId : string;

  constructor(public navCtrl: NavController, private navParams : NavParams, private popoverCtrl: PopoverController) {
  	this.book = this.navParams.data.book;

    if(this.navParams.data.selectedBook)
      this.selectedBookId = this.navParams.data.selectedBook.id
    
    // filter the html tags
    this.book.description = this.book.description ? String(this.book.description).replace(/<[^>]+>/gm, '') : '';
  }

  openPopUp(myEvent){
    let popover = this.popoverCtrl.create(PopOverComponent,{
      book: this.book,
      selectedBookId : this.selectedBookId
    });

    popover.present({
      ev : myEvent
    });

  }
}