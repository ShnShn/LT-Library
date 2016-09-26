import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SocialSharing, InAppBrowser } from 'ionic-native';

import { StorageService } from '../../services/storage.service'

@Component({
  templateUrl: 'build/pages/popover/popover.html',
  providers: [ StorageService ]
})

export class PopOverComponent {
 book : any = {};
 selectedBookId : string;

  constructor(public navCtrl: NavController, private navParams : NavParams, private storageService: StorageService) {}


  ngOnInit() {
    this.book = this.navParams.data.book;

    if (this.navParams.data.selectedBookId)
      this.selectedBookId = this.navParams.data.selectedBookId
  }
  
  share(){
    SocialSharing.share('Hi, check out ' + ' "' + this.book.title +  '" ' + ' by ' +  this.book.authors[0] + '.' + ' You can get it here: ', 'New Book for you', null, this.book.link).then(() => {
        //alert(' Book successfully shared !');
      }).catch(() => {
        console.log();
    }); 
  }

  addTo(){
    this.storageService.globalCheckIfInDB(this.book, this.selectedBookId);
    this.storageService.actionHandler(this.book, 'watchlist', 'To Read List')
  }

  addToFav(){
    this.storageService.globalCheckIfInDB(this.book, this.selectedBookId);
    this.storageService.actionHandler(this.book, 'favorites', 'Reading')
  }

  addToRead(){
    this.storageService.globalCheckIfInDB(this.book, this.selectedBookId);
    this.storageService.actionHandler(this.book, 'read', 'Read')
  }


/*  openElefant(){
    let browser = InAppBrowser.open('https://elefant.ro', '_system');
  }

  openCarturesti(){
     let browser = InAppBrowser.open('https://carturesti.ro', '_system');
  } */

}
