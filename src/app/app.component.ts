import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { ApiService } from './services/api.service';
import {EMPTY, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  // showContents: boolean;
  contStates: {content: boolean; infoBlock: boolean; drillBlock: boolean; kBoard: boolean; };
  contentUA: Observable<{OK: boolean; contents: []}>;
  curInfoBlock: Observable<any>;
  curInfoBlockId: number;
  content: object[];
  infoBlock: string;
  subsCont: Subscription;
  subsInfo: Subscription;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.contStates = {
      content: false,
      infoBlock: true,
      drillBlock: false,
      kBoard: false,
    };
    this.curInfoBlockId = 1; // 1st time load info block
    this.contentUA = this.api.getContentsUA();
    this.curInfoBlock = this.api.getContentByIdUA(this.curInfoBlockId);
  }

  showContent(): void {
    console.log('showContent');
    this.contStates = {
      content: true,
      infoBlock: false,
      drillBlock: false,
      kBoard: false,
    };
  }

  showInfo(): void {
    console.log('showInfo');
    this.contStates = {
      content: false,
      infoBlock: true,
      drillBlock: false,
      kBoard: false,
    };
  }

  toggleDrill(): void {
    console.log('toggleDrill');
    this.contStates.drillBlock = !this.contStates.drillBlock;
  }

  toggleKB(): void {
    console.log('toggleKB');
    this.contStates.kBoard = !this.contStates.kBoard;
  }

  ngOnDestroy(): void {
    this.subsInfo.unsubscribe();
    this.subsCont.unsubscribe();
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
