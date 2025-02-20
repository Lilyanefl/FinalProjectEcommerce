import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private apiUrl = 'http://localhost:8080/api/wishlist';

  constructor(private http: HttpClient, private authService: AuthService) {}

  aggiungiAllaWishlist(prodottoId: number): Observable<any> {
    const userId = this.getUserId();
    if (!userId) return this.handleUserIdError();

    return this.http
      .post(
        `${this.apiUrl}/${userId}/aggiungi`,
        { prodottoId },
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  rimuoviDallaWishlist(prodottoId: number): Observable<any> {
    const userId = this.getUserId();
    if (!userId) return this.handleUserIdError();

    return this.http
      .delete(`${this.apiUrl}/${userId}/rimuovi/${prodottoId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getWishlist(): Observable<any> {
    const userId = this.getUserId();
    if (!userId) return this.handleUserIdError();

    return this.http
      .get(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  private getUserId(): string | null {
    const userId = this.authService.getUserIdFromToken();
    return userId !== null ? String(userId) : null; //
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private handleUserIdError(): Observable<never> {
    console.error('❌ Errore: User ID non trovato!');
    return throwError(() => new Error('User ID non trovato'));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('❌ Errore HTTP:', error);
    return throwError(
      () => new Error('Errore durante la comunicazione con il server.')
    );
  }
}
