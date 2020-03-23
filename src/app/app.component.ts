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
  noItems: any;
  subsc: Subscription;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.showContents = false;
    this.contentUA = this.api.getContentsUA();
  }
// { "id": 0, "ua": "Вступ" }
// { "id": 1, "ua": "Першорядні радикали" }
// { "id": 2, "ua": "Ієрогліфи з однією та декількома частинами" }
// { "id": 3, "ua": "Основні правила" }
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
