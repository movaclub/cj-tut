import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiURL: string;

  constructor(private http: HttpClient) {
    this.apiURL = 'http://api.cj26.club';
  }

  getContentsUA(): Observable<any> {
    return this.http.get(`${this.apiURL}/cjtut/contents/ua`)
      .pipe(
        map( el => JSON.parse(JSON.stringify(el))),
        catchError( e => of(e) )
      );
  }

  getContentByIdUA(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/cjtut/${id}`)
      .pipe(
        map( el => JSON.parse(JSON.stringify(el))),
        catchError( e => of(e) )
      );
  }

  getDrillByIdUA(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/cjtut/drill/ua/${id}`)
      .pipe(
        map( el => JSON.parse(JSON.stringify(el))),
        catchError( e => of(e) )
      );

  }

}
