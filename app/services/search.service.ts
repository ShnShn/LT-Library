import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class SearchService {

   apiKey : string = 'AIzaSyBXmWlSrXAQGM3AwFmbF95Ox7CanEkVPJg'

 
  constructor(private _http: Http) {}

  searchItems(input, startIndex){
  		if(input){
	  		return this._http.get('https://www.googleapis.com/books/v1/volumes?q=' + input + '&startIndex=' + startIndex + '&maxResults=5&key=' + this.apiKey)
	  			  .map(res => res.json())
	    }else{
	    	return Observable.never();
	    }
  }

  searchSpecificItem(input){
      if(input){
        return this._http.get(input)
            .map(res => res.json())
      }else{
        return Observable.never();
        }}


  mapBooks(books){
  	let mappedData = [];
  	//console.log(books);
  	books.forEach(book =>{
  		mappedData.push(this.getSpecificAttribute(book))
  	})

  	return mappedData;
  }

  getSpecificAttribute(book){
    // todo : implement check for every attribute
  	return {
  	 	title : book.volumeInfo.title,
      subtitle : book.volumeInfo.subtitle,
  	 	image : book.volumeInfo.imageLinks,
  	 	description : book.volumeInfo.description,
  	 	authors : book.volumeInfo.authors,
  	 	category : book.volumeInfo.categories,
  	 	publishedDate : book.volumeInfo.publishedDate,
  	 	averageRating : book.volumeInfo.averageRating,
      maturityRating : book.volumeInfo.maturityRating,
      isbn: book.volumeInfo.industryIdentifiers ? book.volumeInfo.industryIdentifiers[0].identifier : '',
      link :  book.selfLink,
      pages: book.volumeInfo.pageCount
	  }
	}


}