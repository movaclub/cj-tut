import {Injectable } from '@angular/core';
import {c2l, l2c} from '../json/keys';
import { default as cjset } from '../json/cj';
// import {HttpClient} from '@angular/common/http';
interface KeyInterface { c2k: {}; l2c: {}; cjset: []; }
// {"zh":"慌", "pin":"huāng", "str":"13", "cj":"PTYU"}
@Injectable({
  providedIn: 'root'
})
export class MyKeyMaps {

    private keyInterface: KeyInterface;

  getKeyMaps() {
      this.keyInterface = {
          c2k: c2l,
          l2c: l2c,
        cjset: cjset
        };
      // console.log('this.KEYINTERFACE: ', this.keyInterface);
      return this.keyInterface;
    }
}
