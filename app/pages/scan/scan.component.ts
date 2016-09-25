import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

import { SearchService } from '../../services/search.service'
import { BookDetailsComponent } from '../bookdetails/bookdetails.component'


@Component({
  templateUrl: 'build/pages/scan/scan.html',
  providers: [ SearchService ]
})

export class ScanPageComponent {

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private searchService : SearchService) {}

  scan(){
    BarcodeScanner.scan().then((barcodeData) =>
       {
         this.showSuccessLoading();
         this.searchBook(barcodeData.text);
       },
       (err) => this.showErrorLoading(err));
  }

  searchBook(isbn){
    let bookResult : any = []; 
    this.searchService.searchItems(isbn, 0)
          .subscribe(data =>
                      {                                  
                        bookResult = this.searchService.mapBooks(data.items)
                        let book = bookResult[0]
                        this.navCtrl.push(BookDetailsComponent, {book})
                      }, 
                     error => console.log(error))
  }

 showSuccessLoading(){

  let loading = this.loadingCtrl.create({
    content: 'Please wait...',
    dismissOnPageChange: true
  });

  loading.present();
 }


 showErrorLoading(error){

     let alert = this.alertCtrl.create({
             title: "Attention!",
             subTitle: error,
             buttons: ["Close"]
        });
        alert.present();
      }
}
