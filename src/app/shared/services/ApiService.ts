/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio centralizado para peticiones HTTP.
 * Los headers de autenticación son manejados automáticamente por AuthInterceptor.
 * Los errores son manejados automáticamente por ErrorInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(readonly http: HttpClient) {}

  post<T = any>(url: string, body: object): Observable<T> {
    return this.http.post<T>(url, body);
  }

  patch<T = any>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(url, body);
  }

  put<T = any>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body);
  }

  get<T = any>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  getWithParams<T = any>(url: string, params: any): Observable<T> {
    return this.http.get<T>(url, { params });
  }
}
