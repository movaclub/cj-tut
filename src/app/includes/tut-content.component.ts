import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LessnByIdService } from '../services/lessn-by-id.service';

@Component({
  selector: 'app-tut-content',
  templateUrl: './tut-content.component.html',
  styleUrls: ['./tut-content.component.css']
})
export class TutContentComponent implements OnInit {

  contentUA: Observable<{OK: boolean; contents: []}>;

  constructor(private lessn: LessnByIdService) { }

  ngOnInit() {
    this.contentUA = of(JSON.parse( localStorage.getItem('contentUA')));
  }

  showInfoByContent(id: number): void { // update current lesson ID for parent via svc
    this.lessn.changeCurLessnID(id);
  }

}
