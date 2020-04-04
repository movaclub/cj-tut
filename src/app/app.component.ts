import {Component, OnDestroy, OnInit} from '@angular/core';
import { Observable, Subscription} from 'rxjs';
import { ApiService } from './services/api.service';
import { LessnByIdService } from './services/lessn-by-id.service';
import { CurVals } from './interfaces/curvals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  contStates: {content: boolean; infoBlock: boolean; drillBlock: boolean; };
  curInfoBlock: Observable<{ OK: boolean; cjInfo: string; }>;
  UAcont: Observable<any>;
  curInfoBlockId: number;
  drillNumber: number;
  curDrills: [];

  curDrillSubs: Subscription;
  uaContSubs: Subscription;

  buttonTitleID: {prv: number; cur: number; nxt: number}; // nav bar button title IDs
  buttonTitles: {prv: string; cur: string; nxt: string};  // nav bar button title
  storageContent: any; // copy of localstorage contents

  constructor(private api: ApiService, private lessn: LessnByIdService) {
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
      drillBlock: false
    };
    this.lessn.getCurLessnID()
      .subscribe( (curVals: CurVals) => {
        this.curInfoBlockId = curVals.curLessonID;
        this.contStates.content = curVals.content;
        this.contStates.infoBlock = curVals.infoBlock;
        this.contStates.drillBlock = curVals.drillBlock;
        this.curInfoBlock = this.api.getContentByIdUA(this.curInfoBlockId);
        if ( localStorage.getItem('contentUA') === null ) {
          this.UAcont = this.api.getContentsUA();
          this.uaContSubs = this.UAcont
            .subscribe( cont => {
              this.storageContent = cont;
              localStorage.setItem('contentUA', JSON.stringify(cont));
            });
        } else {
          this.storageContent = JSON.parse( localStorage.getItem('contentUA')).contents;
        }
        // this.storageContent = JSON.parse( localStorage.getItem('contentUA')).contents;
        this.setButtonTitleIDs(this.curInfoBlockId);
        this.setButtonTitles();
      });
    // this.curInfoBlock = this.api.getContentByIdUA(this.curInfoBlockId);
    // this.storageContent = JSON.parse( localStorage.getItem('contentUA')).contents;
    // this.setButtonTitleIDs(this.curInfoBlockId);
    // this.setButtonTitles();
  }

  setButtonTitles(): void {
    // console.log('buttonTitleID: ', this.buttonTitleID);
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

  showContent(): void {
    this.contStates = {
      content: true,
      infoBlock: false,
      drillBlock: false
    };
  }

  showInfoNxt(): void {
    this.curInfoBlock = this.api.getContentByIdUA(this.buttonTitleID.nxt);
    this.contStates = {
      content: false,
      infoBlock: true,
      drillBlock: false
    };
    this.setButtonTitleIDs(this.buttonTitleID.nxt);
    this.setButtonTitles();
  }

  showInfoPrv(): void {
    this.curInfoBlock = this.api.getContentByIdUA(this.buttonTitleID.prv);
    this.contStates = {
      content: false,
      infoBlock: true,
      drillBlock: false
    };
    this.setButtonTitleIDs(this.buttonTitleID.prv);
    this.setButtonTitles();
  }

  showInfo(): void {
    this.contStates = {
      content: false,
      infoBlock: true,
      drillBlock: false
    };
    this.setButtonTitleIDs(this.buttonTitleID.cur);
  }

  getCurInfoDrill(curInfoBlockID: number): void {
    const curDrillIndex = curInfoBlockID - 1; // it's zero based
    if ( curDrillIndex > 0 && curDrillIndex < 99 ) {
      this.curDrillSubs = this.api.getDrillByIdUA(curDrillIndex)
        .subscribe( drill => {
          console.log( 'DRILLz: ', drill);
          if ( typeof drill.drills !== 'undefined' && drill.drills.length > 0 ) {
            this.curDrills = drill.drills;
            this.drillNumber = this.curDrills.length;
            localStorage.setItem('curDrillIndex', curDrillIndex.toString());
            localStorage.setItem('drillNumber', this.drillNumber.toString());
            localStorage.setItem('curDrills', JSON.stringify(this.curDrills));
          } else {
            this.drillNumber = 0;
          }
        });
    } else {
      this.drillNumber = 0;
    }
  }

  toggleDrill(): void {
    this.contStates = {
      content: false,
      infoBlock: false,
      drillBlock: true
    };
  }

  ngOnDestroy(): void {
    this.curDrillSubs.unsubscribe();
    this.uaContSubs.unsubscribe();
  }

}
