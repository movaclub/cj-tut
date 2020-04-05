import { Component, OnInit } from '@angular/core';
import { MyKeyMaps } from '../services/keymaps.service';
import { MyKeyboardService } from '../services/keyboard.service';

@Component({
  selector: 'app-tut-kb',
  templateUrl: './tut-kb.component.html',
  styleUrls: ['./tut-kb.component.css']
})
export class TutKbComponent implements OnInit {

  public keyboard: any; // json/keyboard
  public kblayout: string; // to toggle the layout
  public kblayoutshow: string; // kb layout indicator
  public keymap: any; // keyboads only

  constructor( private myKeyMaps: MyKeyMaps, private myKeyboardService: MyKeyboardService ) { }

  ngOnInit() {
    this.keyboard = this.myKeyboardService.getKeyboards();
    this.keyboard = this.myKeyboardService.getKeyboards();
    this.keymap = this.myKeyMaps.getKeyMaps();
    // console.log('keymap: ', this.keymap);

    this.kblayout = 'zh';
    this.kblayoutshow = '漢';
  }

  toggleKeyboard() {
    if ( this.kblayout === 'en' ) {
      this.kblayout = 'zh';
      this.kblayoutshow = '漢';
    } else {
      this.kblayout = 'en';
      this.kblayoutshow = 'En';
    }
  }

}
