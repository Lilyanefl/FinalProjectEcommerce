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
export class CartService {
  private apiUrl = 'http://localhost:8080/api/carrello';

  constructor(private http: HttpClient, private authService: AuthService) {}

  creaCarrello(utenteId: number): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/${utenteId}/crea`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  getCarrello(utenteId: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${utenteId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  aggiungiAlCarrello(
    utenteId: number,
    prodottoId: number,
    quantita: number,
    taglia: string,
    colore: string
  ): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/${utenteId}/aggiungi`,
        { prodottoId, quantita, taglia, colore },
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  rimuoviDalCarrello(
    utenteId: number,
    prodottoId: number,
    taglia: string,
    colore: string
  ): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${utenteId}/rimuovi/${prodottoId}`, {
        body: { taglia, colore },
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  rimuoviQuantitaDalCarrello(
    utenteId: number,
    prodottoId: number,
    taglia: string,
    colore: string,
    quantita: number
  ): Observable<any> {
    return this.http
      .patch<any>(
        `${
          this.apiUrl
        }/${utenteId}/rimuovi/${prodottoId}?taglia=${encodeURIComponent(
          taglia
        )}&colore=${encodeURIComponent(colore)}&quantita=${quantita}`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  aumentaQuantita(
    utenteId: number,
    prodottoId: number,
    taglia: string,
    colore: string,
    quantita: number = 1
  ): Observable<any> {
    return this.http
      .patch<any>(
        `${
          this.apiUrl
        }/${utenteId}/aggiungi/${prodottoId}?taglia=${encodeURIComponent(
          taglia
        )}&colore=${encodeURIComponent(colore)}&quantita=${quantita}`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  svuotaCarrello(utenteId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${utenteId}/svuota`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Errore durante la comunicazione con il server.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Errore: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = '❌ Richiesta non valida. Controlla i dati.';
          break;
        case 401:
          errorMessage = '🔒 Accesso negato. Effettua il login.';
          break;
        case 404:
          errorMessage = '🔍 Risorsa non trovata.';
          break;
        case 500:
          errorMessage = '🔥 Errore interno del server.';
          break;
      }
    }

    errorMessage += ` (Status: ${error.status})`;

    return throwError(() => new Error(errorMessage));
  }
}
