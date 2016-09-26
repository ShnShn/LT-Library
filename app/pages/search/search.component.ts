import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TruncatePipe } from '../../pipes/truncate.pipe'
import { SearchService } from '../../services/search.service'
import { StorageService } from '../../services/storage.service'
import { BookDetailsComponent } from '../bookdetails/bookdetails.component'

@Component({
  templateUrl: 'build/pages/search/search.html',
  providers: [ SearchService, StorageService ],
  pipes : [TruncatePipe]
})

export class SearchPageComponent {
  items:any = [] ;
  count : number = 1;
  searchString : string;

  constructor(public navCtrl: NavController, private searchService : SearchService, private storageService: StorageService) {}

  getItems(ev) {
    this.searchString = ev.target.value;
  	this.searchService.searchItems(ev.target.value, 0)
  			.distinctUntilChanged()
  			.subscribe(data =>	{
                    console.log(data);
                    if (data.items)
                     this.items = this.searchService.mapBooks(data.items)
                    else return;
                  },
  					       error => console.log(error))
   }

  onClear(){
    this.items = [];
  }

  doInfinite(infiniteScroll){

    this.count++
    this.searchService.searchItems(this.searchString, this.count*5)
        .distinctUntilChanged()
        .subscribe(data => 
                  { 
                    if(data.items){
                        let tempData = this.searchService.mapBooks(data.items)
                        tempData.forEach(book => {
                          this.items.push(book);
                        })
                        infiniteScroll.complete();
                    }
                    else{
                      infiniteScroll.complete();
                    }
                 },
                 error => console.log(error))
  }

  viewDetails(book){
    this.navCtrl.push(BookDetailsComponent, {book})
  }

  addTo(book){
     this.storageService.showActionSheet(book)
  }

}
