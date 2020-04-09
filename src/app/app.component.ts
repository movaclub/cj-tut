import { Component, OnDestroy, OnInit } from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
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
  curDrillId: number; // show a selected drill
  userInput: string; // user drill code input
  userInputChanged: Subject<string> = new Subject<string>();

  curDrillSubs: Subscription;
  uaContSubs: Subscription;
  curLessnSubs: Subscription;
  usrInputChangedSubs: Subscription;

  buttonTitleID: {prv: number; cur: number; nxt: number}; // nav bar button title IDs
  buttonTitles: {prv: string; cur: string; nxt: string};  // nav bar button title
  storageContent: any; // copy of localstorage contents

  constructor(private api: ApiService, private lessn: LessnByIdService) {
    this.buttonTitleID = {prv: 1, cur: 1, nxt: 2};
    this.buttonTitles = {prv: '', cur: '', nxt: ''};
    this.drillNumber = 0;
    this.curDrills = [];
    this.curInfoBlockId = 1; // 1st time load info block
    this.curDrillId = 0; // 1st time load drill number -> showDrillById(id: number)
    this.userInput = '';
    this.usrInputChangedSubs = this.userInputChanged
      .pipe(
        debounceTime(444),
        distinctUntilChanged()
      )
      .subscribe(
        txtInput => {
          console.log('txtInput: ', txtInput);
          this.userInput = txtInput.toUpperCase();
        }
      );

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
    } else if ( curInfoBlockId === 1) {
      this.buttonTitleID.prv = curInfoBlockId;
      this.buttonTitleID.nxt = curInfoBlockId + 1;
      this.buttonTitleID.cur = curInfoBlockId;
    } else if ( curInfoBlockId === 99 ) {
      this.buttonTitleID.prv = curInfoBlockId - 1;
      this.buttonTitleID.nxt = 1;
      this.buttonTitleID.cur = curInfoBlockId;
    }

    this.buttonTitles.prv = this.storageContent.contents[this.buttonTitleID.prv - 1].ua;
    this.buttonTitles.cur = this.storageContent.contents[this.buttonTitleID.cur - 1].ua;
    this.buttonTitles.nxt = this.storageContent.contents[this.buttonTitleID.nxt - 1].ua;
    this.getCurInfoDrill(this.buttonTitleID.cur);
    this.curDrillId = 0; // if we change a lesson
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
    console.log('showInfoNxt-buttonTitleID (after): ', this.buttonTitleID);
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
          // console.log( 'DRILLz: ', drill);
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

  showDrillById(id: number): void {
    this.curDrillId = id;
  }

  toggleDrill(): void {
    this.contStates = {
      content: false,
      infoBlock: false
    };
  }

  getUserInput(txtInput: string): void {
    if ( /[a-zA-Z]{1,5}/.test(txtInput) ) {
      this.userInputChanged.next(txtInput);
      console.log('usrINPUT: ', this.userInput);
    } else {
      this.userInput = '';
      this.userInputChanged.next('');
    }
  }

  ngOnDestroy(): void {
    this.curDrillSubs.unsubscribe();
    this.uaContSubs.unsubscribe();
    this.curLessnSubs.unsubscribe();
    this.usrInputChangedSubs.unsubscribe();
  }

}
