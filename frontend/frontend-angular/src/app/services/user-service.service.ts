import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/utenti';

  constructor(private http: HttpClient) {}

  getUserInfo(utenteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${utenteId}`);
  }

  updateUser(utenteId: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${utenteId}`, userData);
  }
}
