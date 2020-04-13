import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
  curDrills: []; // a lesson drill set
  curDrill: []; // a current drill shown
  taskDone: []; // hieroglyphs typed (drill OUTPUT list)
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
    this.taskDone = [];
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
          // console.log('txtInput: ', txtInput);
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
              // console.log('uaContSubs-storageContent: ', cont);

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
    this.taskDone = []; // also clean the output list
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
    // console.log('showInfoNxt-buttonTitleID (after): ', this.buttonTitleID);
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
    // console.log('curDrillId:', this.curDrillId);
    this.taskDone = []; // also clean the output list
    // @ts-ignore
    // console.log('showDrillById[id]:', this.curDrills[id].task);
    // @ts-ignore
    this.curDrill = [...this.curDrills[id].task];
    // console.log('this.curDrill:', this.curDrill);
  }

  toggleDrill(): void {
    this.contStates = {
      content: false,
      infoBlock: false
    };
    this.showDrillById(this.curDrillId);
  }

  getUserInput(txtInput: string): void {

    // console.log('txtInput:', txtInput);
    const sanitized = txtInput.replace(/[^a-z]/ig, '');
    // console.log('sanitized:', sanitized);
    this.userInputChanged.next(sanitized);
    // @ts-ignore
    if ( sanitized.toUpperCase() === this.curDrill[0].en.toUpperCase() ) {

      const curDone = this.curDrill.splice(0, 1)[0];
      // @ts-ignore
      this.taskDone.push(curDone);
      setTimeout(() => {
        this.userInputChanged.next('');
        this.userInput = '';
      }, 333);

    }

  }

  ngOnDestroy(): void {
    this.curDrillSubs.unsubscribe();
    this.uaContSubs.unsubscribe();
    this.curLessnSubs.unsubscribe();
    this.usrInputChangedSubs.unsubscribe();
  }

}
