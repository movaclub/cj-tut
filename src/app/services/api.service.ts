import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getContentsUA(): Observable<any> {
    return this.http.get('http://localhost:18181/cjtut/contents/ua')
      .pipe(
        map( el => JSON.parse(JSON.stringify(el))),
        catchError( e => of(e) )
      );
  }
}
