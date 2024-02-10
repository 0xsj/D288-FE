import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {}

  getById(countryId: string): Observable<any> {
    return this.http
      .get<any[]>(
        `https://api.worldbank.org/V2/country/${countryId}?format=json`
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occured', error);
    return throwError('invalid');
  }
}
