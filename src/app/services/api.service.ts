import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getContentsUA(zh: string): Observable<any> {
    return this.http.get('http://localhost:18181/cjtut/contents/ua')
      .pipe(
        catchError( e => of(e) )
      );
  }
}
