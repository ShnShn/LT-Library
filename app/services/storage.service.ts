import { Injectable } from '@angular/core';
import { Storage, SqlStorage, ToastController, ActionSheetController } from 'ionic-angular';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class StorageService {
  storage: Storage = null;

  constructor(private _http: Http, private toastCtrl: ToastController, private actionsheetCtrl: ActionSheetController) { 
     this.storage = new Storage(SqlStorage);

     //this.storage.query('DROP TABLE watchlist');
     //this.storage.query('DROP TABLE favorites');
     //this.storage.query('DROP TABLE read');  

     this.storage.query('CREATE TABLE IF NOT EXISTS watchlist (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, link TEXT, image TEXT, authors TEXT, currentpage TEXT, pages TEXT)');
     this.storage.query('CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, link TEXT, image TEXT, authors TEXT, currentpage TEXT, pages TEXT)');
     this.storage.query('CREATE TABLE IF NOT EXISTS read (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, link TEXT, image TEXT, authors TEXT, currentpage TEXT, pages TEXT)');
  }

  //select
  getBooks(){
     return this.storage.query('SELECT * FROM watchlist');
  }

  getFavoriteBooks(){
     return this.storage.query('SELECT * FROM favorites');
  }

  getReadBooks(){
     return this.storage.query('SELECT * FROM read');
  }

  // Save a new book to the DB Insert
  saveBook(book, database) {
   
    let sql = 'INSERT INTO ' + database +  '(title, link, image, authors, currentpage, pages) VALUES (?,?,?,?,?,?)';
    // validation
    if (!book.image) {
        book.image = 'http://www.kober.com/images/nobook.gif'
        return this.storage.query(sql, [book.title, book.link, book.image, book.authors, '0']);
      }
    //console.log(book)
    else return this.storage.query(sql, [book.title, book.link, book.image.smallThumbnail, book.authors, '0', book.pages]);
  }

  //delete books
  deleteBook(book){
    let sql = 'DELETE FROM watchlist WHERE id = \"' + book.id + '\"';
    return this.storage.query(sql);
  }  

  deleteFavoriteBook(book){
    let sql = 'DELETE FROM favorites WHERE id = \"' + book.id + '\"';
    return this.storage.query(sql);
  }  

   deleteReadBook(book){
    let sql = 'DELETE FROM read WHERE id = \"' + book.id + '\"';
    return this.storage.query(sql);
  }

  updatePage(value, id){
     let sql = 'UPDATE watchlist SET currentpage = \"' + value + '\" WHERE id = \"' + id + '\"';
     return this.storage.query(sql);
  }

  checkExistsToRead(book, database) : any{
        //console.log(book);     
        let exists = false;

        return new Promise( resolve => this.storage.query('SELECT * FROM ' + database).then(
              data =>{
                   let tempData = data.res.rows; 
                   for (let entry of tempData){
                       if (entry.title == book.title){
                         exists = true;
                         break;
                       }
                   }
           console.log('In storage: '+ exists);
           resolve(exists)
        })
       )    
  }

 actionHandler(book, database, category){
     let exist = false;
     this.checkExistsToRead(book, database).then(data => {
              exist = data
              if (!exist) 
                  this.saveBook(book, database)
                                .then(data => this.showToast(book.title, category))   
              
              else
                 this.showExistToast(book.title, category) 

              })
  }

 showActionSheet(book){
   let actionSheet = this.actionsheetCtrl.create({
      title: 'Add To', 
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Read list',
          icon: 'list',
          handler: () => this.actionHandler(book, 'watchlist', 'To Read List')
            
        },

        {
          text: 'Reading',
          icon: 'bookmark',         
          handler: () =>   this.actionHandler(book, 'favorites', 'Favorites')  
        },

        {
          text: 'Read',
          icon: 'book',           
          handler: () => this.actionHandler(book, 'read', 'Read')  
        },

        {
          text: 'Cancel',
          icon : 'close',
          role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present()
  }

   showToast(title, list){
     let toast = this.toastCtrl.create({
              message:  title + ' added to ' + list,
              duration: 1500,
              position: 'bottom'
        });

      toast.present();
  }

   showPageProgressToast(){

       let toast = this.toastCtrl.create({
                message: 'Progress saved !',
                duration: 500,
                position: 'bottom'
          });

        toast.present();
  }

  showExistToast(title, category){

    let toast = this.toastCtrl.create({
        message: 'The book '  + "'" + title + "' is already added to the " + category + " category"  ,
        duration: 1500,
        position: 'bottom'
      });

      toast.present();
  } 

  sortBooks(table, column, mode){ 
     return this.storage.query('SELECT * FROM '+ table +' ORDER BY ' + column + ' ' + mode);
  }

}