import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { StorageService } from '../../services/storage.service'

@Component({
  templateUrl: 'build/pages/progressmodal/progressmodal.html',
  providers: [ StorageService ]
})

export class ProgressModalComponent {
  
  pages = 0;
  displayValue : number
  book : any = [];		

  constructor(public navCtrl: NavController, private navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController,
                         private storageService: StorageService){
  	this.book = navParams.data.book;
  	this.pages = this.book.currentpage;
    this.displayValue = parseInt(this.book.pages);
  }

  updateCurrentPage(){
  		this.storageService.updatePage(this.pages, this.book.id)
  				 .then( data => console.log('saved'),
                  error => console.log(error)) //this.storageService.showPageProgressToast())
  }

  checkValue(): boolean{

    if (this.book.pages >=  this.pages){
        this.updateCurrentPage()
        return true;
      }
    else{
      return false;
    }
  }

  showAlert(){

    let alert = this.alertCtrl.create({
      title: 'Warning !',
      subTitle: `<br>` + 'Please add a page number smaller than ' + this.displayValue,
      buttons: ['Dismiss']
    });

    alert.present();

    this.pages = parseInt(this.book.pages);
  }


  dismiss(){
     if(this.checkValue()){
          this.viewCtrl.dismiss();
        }
     else{
         this.showAlert();
     }     
  }

}