import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://partakable-nonoperatic-jair.ngrok-free.dev/api/';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(product_code: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}${product_code}`, product);
  }

  deleteProduct(product_code: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${product_code}`);
  }
}
