import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/prodotti';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getAllAdminProducts(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/api/admin/prodotti');
  }

  createProduct(prodotto: any): Observable<any> {
    return this.http.post<any>(
      'http://localhost:8080/api/admin/prodotti',
      prodotto
    );
  }

  updateProduct(id: number, prodotto: any): Observable<any> {
    return this.http.put<any>(
      `http://localhost:8080/api/admin/prodotti/${id}`,
      prodotto
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(
      `http://localhost:8080/api/admin/prodotti/${id}`
    );
  }
  uploadImage(prodottoId: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/${prodottoId}/upload`, formData);
  }
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
