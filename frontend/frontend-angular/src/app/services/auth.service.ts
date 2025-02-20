import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  registrazione(
    nome: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      nome,
      email,
      password,
    });
  }

  saveToken(token: string): void {
    console.log('Salvataggio token:', token);
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem('token');
    console.log('👋 Logout effettuato');
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload?.userId || null;
    } catch (error) {
      console.error('❌ Errore nella decodifica del token:', error);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expiry = tokenPayload?.exp;
      if (!expiry) return true;

      const now = Math.floor(Date.now() / 1000);
      if (now > expiry) {
        console.warn('⚠️ Token scaduto, logout automatico.');
        this.logout();
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Errore nel controllo del token:', error);
      return true;
    }
  }
  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.roles || [];
    } catch (error) {
      console.error('❌ Errore nella decodifica del token:', error);
      return [];
    }
  }
  isAdmin(): boolean {
    return this.getUserRoles().includes('ADMIN');
  }
}
