import { Injectable } from '@angular/core'
import { en, zh } from '../json/keyboard'

@Injectable()
export class MyKeyboardService {
  getKeyboards(){
    return {
      en: en,
      zh: zh
    };
  }
}
