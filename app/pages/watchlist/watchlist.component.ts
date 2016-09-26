import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ModalController } from 'ionic-angular';

import { StorageService } from '../../services/storage.service'
import { SearchService } from '../../services/search.service'
import { BookDetailsComponent } from '../bookdetails/bookdetails.component'
import { ProgressModalComponent } from '../progressmodal/progressmodal.component'

@Component({
  templateUrl: 'build/pages/watchlist/watchlist.html',
  providers: [StorageService, SearchService ],

})

export class WatchListPageComponent {

  items = [];
  itemsFavorite = [];
  itemsRead = [];
  filterNumber : number;
  book : string;
  searchTerm : string;
  once : boolean = false;
  sortTypeTitle : boolean = true;
  sortTypeAuthor: boolean = true;


  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private alertCtrl : AlertController, private modalCtrl: ModalController,
                   private storageService: StorageService, private searchService: SearchService) {
    //init value for segment button
    this.book = 'watchlist';
  }

  ionViewDidEnter() {
    this.loadToReadList();
    this.loadFavoriteList();
    this.loadReadList();
  }

  loadToReadList(){
    this.storageService.getBooks().then(
        data => {
              this.items = data.res.rows;
              if(!this.once){
                this.once = true;
                this.filterNumber = this.items.length;
              }
            }
      )
  }

  loadFavoriteList(){
    this.storageService.getFavoriteBooks().then(
        data => {this.itemsFavorite = data.res.rows 
               } 
      )
  }

  loadReadList(){
    this.storageService.getReadBooks().then(
        data =>  this.itemsRead = data.res.rows
      )
  }

  //delete //
  deleteBook(book){
    this.storageService.deleteBook('watchlist',book, book.id).then(
        data => this.loadToReadList()
      )
  }

  deleteFavoriteBook(book){
    this.storageService.deleteBook('favorites',book, book.id).then(
        data => this.loadFavoriteList()
      )
  }

  deleteReadBook(book){
    this.storageService.deleteBook('read', book, book.id).then(
        data => this.loadReadList()
      )
  }

  showBook(selectedBook){

      let book = {}; 
      this.createLoading()
      this.searchTerm = '';

      this.searchService.searchSpecificItem(selectedBook.link)
          .subscribe(data =>  book = this.searchService.getSpecificAttribute(data), 
                     error => console.log(error),
                      () => this.navCtrl.push(BookDetailsComponent,{book, selectedBook})) 

    }

    createLoading(){
        let loading = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange : true
        })

        loading.present();
    }

    showSortAlert(){

        let alert = this.alertCtrl.create();

        alert.setTitle('Sort By');

        alert.addInput({
          type: 'radio',
          label: 'Title',
          value: 'title',
          checked: false
        });

        alert.addInput({
          type: 'radio',
          label: 'Author',
          value: 'authors',
          checked: false
        });

        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: data => 
            {
              this.sort(this.book, data)
            }

        });

        alert.present();

     }

  sort(table, column){
     // check what was selected
       if( column == 'title') {
            if(this.sortTypeTitle){
                  this.storageService.sortBooks(table, column, 'ASC').then(
                    data => {this.switchSort(table, data)
                             this.storageService.showSortToast(column, 'Ascending')}     
                  )
                  this.sortTypeTitle = false; 
                }else {
                  this.storageService.sortBooks(this.book, column, 'DESC').then(
                    data => {
                             this.switchSort(table, data);
                             this.storageService.showSortToast(column, 'Descending')
                           }        
                  )
                  this.sortTypeTitle = true; 
                } 
       }else{
             if(this.sortTypeAuthor){
                  this.storageService.sortBooks(table, column, 'ASC').then(
                    data =>  {
                            this.switchSort(table, data);
                            this.storageService.showSortToast(column, 'Ascending')
                            }        
                  )
                  this.sortTypeAuthor = false; 
                }else {
                  this.storageService.sortBooks(this.book, column, 'DESC').then(
                    data => {
                           this.switchSort(table, data)
                           this.storageService.showSortToast(column, 'Descending')  
                         }      
                  )
                  this.sortTypeAuthor = true; 
                } 
        }   
   }


  switchSort(table, values){
    // based on table append to proper array
     switch (table) {
        case "watchlist":
            this.items = values.res.rows;  
            break;

        case "favorites":
            this.itemsFavorite = values.res.rows; 
            break;

         case "read":
            this.itemsRead = values.res.rows; 
            break;
          }
  }

  tabChange(ev){
    //reset values on segment tab change
    this.setFilterNumber(ev.value);
    this.sortTypeAuthor = true;
    this.sortTypeTitle = true;
    this.searchTerm = '';
    this.onClear();
  }

  setFilterNumber(value){

    switch (value) {
      case "watchlist":
        this.filterNumber = this.items.length;
        break;
      case "favorites":
        this.filterNumber = this.itemsFavorite.length;
        break;
      case "read":
        this.filterNumber = this.itemsRead.length;
        break;
    }
  } 

  setProgress(book){
    if(book.pages != 'undefined'){
      let progressModal = this.modalCtrl.create(ProgressModalComponent, {book});
      progressModal.present();
    } else alert('no page info for this book');
  }

  setFilteredItems(event){
        let atm = [];
        this.searchTerm = event.target.value;

       if(this.searchTerm){
          for( let item of this.items){
            if ( item.title.toLowerCase().indexOf( this.searchTerm.toLowerCase()) > -1 ||  item.authors.toLowerCase().indexOf( this.searchTerm.toLowerCase()) > -1){
                atm.push(item)
            }
          }
          this.items = atm;

          atm = [];
          for( let item of this.itemsFavorite){
            if ( item.title.toLowerCase().indexOf( this.searchTerm.toLowerCase()) > -1 ||  item.authors.toLowerCase().indexOf( this.searchTerm.toLowerCase()) > -1){
                atm.push(item)
            }
          }
          this.itemsFavorite = atm;

          atm = []; 
          for( let item of this.itemsRead){
            if ( item.title.toLowerCase().indexOf( this.searchTerm.toLowerCase()) > -1 ||  item.authors.toLowerCase().indexOf( this.searchTerm.toLowerCase()) > -1){
                atm.push(item)
            }
          }
          this.itemsRead = atm;

      }else{
        this.loadToReadList();
      }
    }

    onClear(){
      this.loadToReadList();
      this.loadFavoriteList();
      this.loadReadList();
    }


}
