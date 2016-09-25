import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { HomePageComponent } from './pages/home/home.component';
import { SearchPageComponent } from './pages/search/search.component';
import { WatchListPageComponent } from './pages/watchlist/watchlist.component';
import { ScanPageComponent } from './pages/scan/scan.component';
import { AboutPageComponent } from './pages/about/about.component';

@Component({
  templateUrl: 'build/app.html'
})


class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePageComponent;

  navigatePages: Array<{title: string, icon: string, component: any}>;
  otherPages: Array<{title: string, icon: string, component: any}>;

  constructor(private platform: Platform) {

    this.platform = platform;
    this.initializeApp();

    //init pages
    this.navigatePages = [
      { title: 'Home Page', icon: 'home',  component: HomePageComponent },
      { title: 'Search Library', icon: 'search',  component: SearchPageComponent },
      { title: 'Read List', icon: 'list',  component: WatchListPageComponent },
      { title: 'Scan Code', icon: 'qr-scanner',  component: ScanPageComponent },
     // { title: 'Brightness', icon: 'qr-scanner',  component: BrightPageComponent },
    ];

    this.otherPages =[
      { title: 'About', icon: 'information-circle',  component: AboutPageComponent },
    ] 
  }
   
  openPage(page) {
    // Reset the content nav to have just this page
    this.nav.setRoot(page.component);
  }

  initializeApp() {
      this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
      });
    }
}

ionicBootstrap(MyApp);