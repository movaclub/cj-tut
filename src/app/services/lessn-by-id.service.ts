import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { CurVals } from '../interfaces/curvals';


@Injectable({
  providedIn: 'root'
})
export class LessnByIdService { // send picked lesson ID to parent component

  currentVals = {
    content: false,
    infoBlock: true,
    curLessonID: 1
  };

  private curLessnSource = new BehaviorSubject<CurVals>(this.currentVals);

  constructor() { }

  changeCurLessnID(id: number): void {
    console.log('changeCurLessnID-id: ', id);
    this.currentVals.curLessonID = id;
    this.currentVals.content = false;
    this.currentVals.infoBlock = true;
    this.curLessnSource.next(this.currentVals);
  }

  getCurLessnID(): Observable<CurVals> {
    return this.curLessnSource.asObservable();
  }

}
