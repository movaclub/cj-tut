import {Component, OnInit} from '@angular/core';
import { ApiService } from './services/api.service';
import {EMPTY, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  showContents: boolean;
  contentUA: Observable<{OK: boolean; contents: []}>;
  content: object[];
  subsc: Subscription;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.showContents = false;
    this.contentUA = this.api.getContentsUA();
  }

  contentShow(): void {
    this.showContents = true;
    this.subsc = this.contentUA
      .subscribe(
        riz => {
          this.content = riz.contents;
        }
      );
  }

  contentHide(): void {

    this.subsc.unsubscribe();

    setTimeout( () => {
    this.content = [...[]]; }, 1234);

    setTimeout( () => {
      this.showContents = false; }, 1678);
  }

}
