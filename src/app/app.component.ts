import {Component, OnInit} from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  showContents: boolean;


  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.showContents = false;
  }

  contentShow(): void {
    this.showContents = true;
  }
  contentHide(): void {
    setTimeout( () => {this.showContents = false; }, 1567);
  }

}
