import { Component, OnDestroy, OnInit } from '@angular/core';
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

  contStates: {content: boolean; infoBlock: boolean; };
  curInfoBlock: Observable<{ OK: boolean; cjInfo: string; }>;
  UAcont: Observable<any>;
  curInfoBlockId: number;
  drillNumber: number;
  curDrills: [];

  curDrillSubs: Subscription;
  uaContSubs: Subscription;
  curLessnSubs: Subscription;

  buttonTitleID: {prv: number; cur: number; nxt: number}; // nav bar button title IDs
  buttonTitles: {prv: string; cur: string; nxt: string};  // nav bar button title
  storageContent: any; // copy of localstorage contents

  constructor(private api: ApiService, private lessn: LessnByIdService) {
    this.buttonTitleID = {prv: 1, cur: 1, nxt: 2};
    this.buttonTitles = {prv: '', cur: '', nxt: ''};
    this.drillNumber = 0;
    this.curDrills = [];
    this.curInfoBlockId = 1; // 1st time load info block
  }

  ngOnInit(): void {
    this.contStates = {
      content: false,
      infoBlock: true
    };
    this.curLessnSubs = this.lessn.getCurLessnID()
      .subscribe( (curVals: CurVals) => {

        this.curInfoBlockId = curVals.curLessonID;
        this.contStates.content = curVals.content;
        this.contStates.infoBlock = curVals.infoBlock;

        if ( localStorage.getItem('contentUA') === null ) {
          this.UAcont = this.api.getContentsUA();
          this.uaContSubs = this.UAcont
            .subscribe( cont => {
              console.log('uaContSubs-storageContent: ', cont);

              this.buttonTitles.prv = cont.contents[0].ua;
              this.buttonTitles.cur = cont.contents[0].ua;
              this.buttonTitles.nxt = cont.contents[1].ua;

              this.buttonTitleID.prv = this.curInfoBlockId;
              this.buttonTitleID.nxt = this.curInfoBlockId + 1;
              this.buttonTitleID.cur = this.curInfoBlockId;

              localStorage.setItem('contentUA', JSON.stringify(cont));
              this.curInfoBlock = this.api.getContentByIdUA(this.curInfoBlockId);
            });

        } else {
          this.storageContent = JSON.parse( localStorage.getItem('contentUA'));
          this.curInfoBlock = this.api.getContentByIdUA(this.curInfoBlockId);
          this.setButtonTitleIDs(this.curInfoBlockId);
        }

      });
  }

  setButtonTitleIDs(curInfoBlockId: number): void {

    if ( curInfoBlockId > 1 && curInfoBlockId < 99 ) { // 99 lessons
      this.buttonTitleID.prv = curInfoBlockId - 1;
      this.buttonTitleID.nxt = curInfoBlockId + 1;
      this.buttonTitleID.cur = curInfoBlockId;
    } else if ( this.curInfoBlockId === 1) {
      this.buttonTitleID.prv = curInfoBlockId;
      this.buttonTitleID.nxt = curInfoBlockId + 1;
      this.buttonTitleID.cur = curInfoBlockId;
    } else if ( this.curInfoBlockId === 99 ) {
      this.buttonTitleID.prv = curInfoBlockId - 1;
      this.buttonTitleID.nxt = 1;
      this.buttonTitleID.cur = curInfoBlockId;
    }

    this.buttonTitles.prv = this.storageContent.contents[this.buttonTitleID.prv - 1].ua;
    this.buttonTitles.cur = this.storageContent.contents[this.buttonTitleID.cur - 1].ua;
    this.buttonTitles.nxt = this.storageContent.contents[this.buttonTitleID.nxt - 1].ua;
    this.getCurInfoDrill(this.buttonTitleID.cur);
  }

  showContent(): void {
    this.contStates = {
      content: true,
      infoBlock: false
    };
  }

  showInfoNxt(): void {
    this.curInfoBlock = this.api.getContentByIdUA(this.buttonTitleID.nxt);
    this.contStates = {
      content: false,
      infoBlock: true
    };
    this.setButtonTitleIDs(this.buttonTitleID.nxt);
    this.getCurInfoDrill(this.buttonTitleID.cur);
  }

  showInfoPrv(): void {
    this.curInfoBlock = this.api.getContentByIdUA(this.buttonTitleID.prv);
    this.contStates = {
      content: false,
      infoBlock: true
    };
    this.setButtonTitleIDs(this.buttonTitleID.prv);
    this.getCurInfoDrill(this.buttonTitleID.cur);
  }

  showInfo(): void {
    this.contStates = {
      content: false,
      infoBlock: true
    };
    this.setButtonTitleIDs(this.buttonTitleID.cur);
    this.getCurInfoDrill(this.buttonTitleID.cur);
  }

  getCurInfoDrill(curInfoBlockId: number): void {
    const curDrillIndex = (curInfoBlockId - 1); // it's zero based
    this.drillNumber = 0;
    if ( curDrillIndex > 0 && curDrillIndex < 99 ) {
      this.curDrillSubs = this.api.getDrillByIdUA(curDrillIndex)
        .subscribe( drill => {
          console.log( 'DRILLz: ', drill);
          if ( typeof drill.drills !== 'undefined' && drill.drills.length > 0 ) {
            this.curDrills = drill.drills;
            this.drillNumber = this.curDrills.length;
          } else {
            this.drillNumber = 0;
            this.curDrills = [];
          }
        });
    }
  }

  toggleDrill(): void {
    this.contStates = {
      content: false,
      infoBlock: false
    };
  }

  ngOnDestroy(): void {
    this.curDrillSubs.unsubscribe();
    this.uaContSubs.unsubscribe();
    this.curLessnSubs.unsubscribe();
  }

}
