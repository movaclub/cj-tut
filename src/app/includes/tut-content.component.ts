import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import {ApiService} from '../services/api.service';
import { LessnByIdService } from '../services/lessn-by-id.service';

@Component({
  selector: 'app-tut-content',
  templateUrl: './tut-content.component.html',
  styleUrls: ['./tut-content.component.css']
})
export class TutContentComponent implements OnInit {


  UAcont: Observable<{OK: boolean; contents: []}>; // copy of contentUA for localstorage
  // uaContSubs: Subscription;
  contentUA: Observable<{OK: boolean; contents: []}>;

  constructor(private api: ApiService, private lessn: LessnByIdService) { }

  ngOnInit() {

    if ( localStorage.getItem('contentUA') === null ) {
      this.UAcont = this.contentUA = this.api.getContentsUA();
      // this.uaContSubs =
      this.UAcont
        .subscribe( cont => {
          localStorage.setItem('contentUA', JSON.stringify(cont));
        });
    } else {
      this.contentUA = of(JSON.parse( localStorage.getItem('contentUA')));
    }

  }

  showInfoByContent(id: number): void { // update current lesson ID for parent via svc
    this.lessn.changeCurLessnID(id);
    // const curInfoBlock = this.api.getContentByIdUA(id);
    // this.contStates = {
    //   content: false,
    //   infoBlock: true,
    //   drillBlock: false
    // };
    // this.setButtonTitleIDs(id);
    // this.setButtonTitles();
  }

  // ngOnDestroy(): void {
  //   this.uaContSubs.unsubscribe();
  // }

}
