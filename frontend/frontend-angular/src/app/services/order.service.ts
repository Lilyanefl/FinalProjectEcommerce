import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/ordini';

  constructor(private http: HttpClient, private authService: AuthService) {}

  checkout(utenteId: number): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/checkout/${utenteId}`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  getOrdiniUtente(utenteId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/utente/${utenteId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getDettagliOrdine(ordineId: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${ordineId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  aggiornaStatoOrdine(ordineId: number, stato: string): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/${ordineId}/stato`,
        { stato },
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('❌ Errore HTTP:', error);
    return throwError(
      () => new Error('Errore durante la comunicazione con il server.')
    );
  }
}
