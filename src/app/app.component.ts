import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { ApiService } from './services/api.service';
import {EMPTY, Observable, of, Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  contStates: {content: boolean; infoBlock: boolean; drillBlock: boolean; kBoard: boolean; };
  contentUA: Observable<{OK: boolean; contents: []}>;
  curInfoBlock: Observable<{ OK: boolean; cjInfo: string; }>;
  curInfoBlockId: number;
  drillNumber: number;
  curDrills: [];

  UAcont: Observable<{OK: boolean; contents: []}>; // copy of contentUA for localstorage
  uaContSubs: Subscription;
  curDrillSubs: Subscription;

  buttonTitleID: {prv: number; cur: number; nxt: number}; // nav bar button title IDs
  buttonTitles: {prv: string; cur: string; nxt: string};  // nav bar button title
  storageContent: any; // copy of localstorage contents

  constructor(private api: ApiService) {
    this.buttonTitleID = {prv: 1, cur: 1, nxt: 2};
    this.buttonTitles = {prv: '', cur: '', nxt: ''};
    this.drillNumber = 0; // if ( id > 0 && id < 99 ) { // 1st & last entries have no drills (ZERO-BASED!!!)
    this.curDrills = [];
    this.curInfoBlockId = 1; // 1st time load info block
  }

  ngOnInit(): void {
    this.contStates = {
      content: false,
      infoBlock: true,
      drillBlock: false,
      kBoard: false,
    };

    if ( localStorage.getItem('contentUA') === null ) {
      this.UAcont = this.contentUA = this.api.getContentsUA();
      this.uaContSubs = this.UAcont
        .subscribe( cont => {
          localStorage.setItem('contentUA', JSON.stringify(cont));
        });
    } else {
      this.contentUA = of(JSON.parse( localStorage.getItem('contentUA')));
    }
    this.curInfoBlock = this.api.getContentByIdUA(this.curInfoBlockId);
    this.storageContent = JSON.parse( localStorage.getItem('contentUA')).contents;
    this.setButtonTitleIDs(this.curInfoBlockId);
    this.setButtonTitles();
  }

  setButtonTitles(): void {
    console.log('buttonTitleID: ', this.buttonTitleID);
    this.buttonTitles.prv = this.storageContent[this.buttonTitleID.prv - 1].ua;
    this.buttonTitles.cur = this.storageContent[this.buttonTitleID.cur - 1].ua;
    this.buttonTitles.nxt = this.storageContent[this.buttonTitleID.nxt - 1].ua;
  }

  setButtonTitleIDs(curInfoBlockID: number): void {

    if ( curInfoBlockID > 1 && curInfoBlockID < 99 ) { // 99 lessons
      this.buttonTitleID.prv = curInfoBlockID - 1;
      this.buttonTitleID.nxt = curInfoBlockID + 1;
      this.buttonTitleID.cur = curInfoBlockID;
    } else if ( curInfoBlockID === 1) {
      this.buttonTitleID.prv = curInfoBlockID;
      this.buttonTitleID.nxt = curInfoBlockID + 1;
      this.buttonTitleID.cur = curInfoBlockID;
    } else if ( curInfoBlockID === 99 ) {
      this.buttonTitleID.prv = curInfoBlockID - 1;
      this.buttonTitleID.nxt = 1;
      this.buttonTitleID.cur = curInfoBlockID;
    }
    this.getCurInfoDrill(this.buttonTitleID.cur);
  }

  showInfoByContent(id: number): void {
    this.curInfoBlock = this.api.getContentByIdUA(id);
    this.contStates = {
      content: false,
      infoBlock: true,
      drillBlock: false,
      kBoard: false,
    };
    this.setButtonTitleIDs(id);
    this.setButtonTitles();
  }

  showContent(): void {
    this.contStates = {
      content: true,
      infoBlock: false,
      drillBlock: false,
      kBoard: false,
    };
  }

  showInfoNxt(): void {
    this.curInfoBlock = this.api.getContentByIdUA(this.buttonTitleID.nxt);
    this.contStates = {
      content: false,
      infoBlock: true,
      drillBlock: false,
      kBoard: false,
    };
    this.setButtonTitleIDs(this.buttonTitleID.nxt);
    this.setButtonTitles();
  }

  showInfoPrv(): void {
    this.curInfoBlock = this.api.getContentByIdUA(this.buttonTitleID.prv);
    this.contStates = {
      content: false,
      infoBlock: true,
      drillBlock: false,
      kBoard: false,
    };
    this.setButtonTitleIDs(this.buttonTitleID.prv);
    this.setButtonTitles();
  }

  showInfo(): void {
    this.contStates = {
      content: false,
      infoBlock: true,
      drillBlock: false,
      kBoard: false,
    };
    this.setButtonTitleIDs(this.buttonTitleID.cur);
  }

  getCurInfoDrill(curInfoBlockID: number): void {
    console.log('getCurInfoDrill-id: ', curInfoBlockID);
    const curDrillIndex = curInfoBlockID - 1; // it's zero based
    if ( curDrillIndex > 0 && curDrillIndex < 99 ) {
      this.curDrillSubs = this.api.getDrillByIdUA(curDrillIndex)
        .subscribe( drill => {
          console.log( 'DRILLz: ', drill);
          if ( typeof drill.drills !== 'undefined' && drill.drills.length > 0 ) {
            this.curDrills = drill.drills;
            this.drillNumber = this.curDrills.length;
          } else {
            this.drillNumber = 0;
          }
        });
    } else {
      this.drillNumber = 0;
    }
  }

  toggleDrill(): void {
    this.contStates.drillBlock = !this.contStates.drillBlock;
  }

  toggleKB(): void {
    this.contStates.kBoard = !this.contStates.kBoard;
  }

  ngOnDestroy(): void {
    this.uaContSubs.unsubscribe();
    this.curDrillSubs.unsubscribe();
  }

  // winResize(): void {
  //   let myHeight = 0;
  //   let myWidth = 0;
  //   const myCells: any = document.querySelectorAll('div.content-cell');
  //   console.log(myCells);
  //   for (let i = 0, len = myCells.length; i < len; i++) {
  //     // @ts-ignore
  //     if (myHeight < myCells[i].offsetHeight) {
  //       // @ts-ignore
  //       myHeight = myCells[i].offsetHeight;
  //     }
  //     // @ts-ignore
  //     if (myWidth < myCells[i].offsetWidth) {
  //       // @ts-ignore
  //       myWidth = myCells[i].offsetWidth;
  //     }
  //   }
  //   const height = String(myHeight + 'px');
  //   const width = String(myWidth + 'px');
  //
  //   // tslint:disable-next-line:prefer-for-of
  //   for (let i = 0, len = myCells.length; i < len; i++) {
  //     // @ts-ignore
  //     myCells[i].style.maxWidth = width;
  //     // @ts-ignore
  //     myCells[i].style.minWidth = width;
  //     // // @ts-ignore
  //     myCells[i].style.maxHeight = height;
  //     // // @ts-ignore
  //     // myCells[i].style.minHeight = height;
  //   }
  // }

}
