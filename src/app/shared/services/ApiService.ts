/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  baseURL = environment.urlBackend;

  private httpHeaders = {
    token: '',
    Authorization: localStorage.getItem('token') || '',
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'content-type, authorization, accept',
    'Access-Control-Allow-Methods': '',
    'access-token': '',
  };

  //add token to header

  constructor(private http: HttpClient) {}

  postService(infoUrl: string, json: object): Observable<any> {
    const token = localStorage.getItem('token') || '';

    this.httpHeaders['token'] = token;
    // add bearer token
    this.httpHeaders['Authorization'] = `Bearer ${token}`;
    this.httpHeaders['Access-Control-Allow-Methods'] = 'POST';
    const info = this.http.post(infoUrl, json, {
      headers: this.httpHeaders,
    });
    /*  info.subscribe({
      next: (resp: any) => {
        if (resp.error) {
          if (resp.error.serverResponseCode === 401) {
            AuthService.prototype.logout();
          }
        }
      },
      error: (error) => {
        if (error.error.serverResponseCode === 401) {
          AuthService.prototype.logout();
        }
      },
    }); */
    return info;
  }

  patchService(infoUrl: string, json: any): Observable<any> {
    const token = localStorage.getItem('token') || '';

    this.httpHeaders['token'] = token;
    // add bearer token
    this.httpHeaders['Authorization'] = `Bearer ${token}`;
    this.httpHeaders['Access-Control-Allow-Methods'] = 'POST';
    const info = this.http.patch(infoUrl, json, {
      headers: this.httpHeaders,
    });
    /* info.subscribe({
      next: (resp: any) => {
        if (resp.error) {
          if (resp.error.serverResponseCode === 401) {
            AuthService.prototype.logout();
          }
        }
      },
      error: (error) => {
        if (error.error.serverResponseCode === 401) {
          AuthService.prototype.logout();
        }
      },
    }); */
    return info;
  }

  putService(infoUrl: string, json: any): Observable<any> {
    const token = localStorage.getItem('token') || '';

    this.httpHeaders['token'] = token;
    // add bearer token
    this.httpHeaders['Authorization'] = `Bearer ${token}`;
    this.httpHeaders['Access-Control-Allow-Methods'] = 'POST';
    const info = this.http.put(infoUrl, json, {
      headers: this.httpHeaders,
    });
    /*  info.subscribe({
      next: (resp: any) => {
        if (resp.error) {
          if (resp.error.serverResponseCode === 401) {
            AuthService.prototype.logout();
          }
        }
      },
      error: (error) => {
        if (error.error.serverResponseCode === 401) {
          AuthService.prototype.logout();
        }
      },
    }); */
    return info;
  }

  getService(infoUrl: string): Observable<any> {
    const token = localStorage.getItem('token') || '';

    this.httpHeaders['token'] = token;
    // add bearer token
    this.httpHeaders['Authorization'] = `Bearer ${token}`;
    this.httpHeaders['Access-Control-Allow-Methods'] = 'POST';
    const info = this.http.get(infoUrl, {
      headers: this.httpHeaders,
    });
    /* info.subscribe({
      next: (resp: any) => {
        if (resp.error) {
          if (resp.error.serverResponseCode === 401) {
            AuthService.prototype.logout();
          }
        }
      },
      error: (error) => {
        if (error.error.serverResponseCode === 401) {
          AuthService.prototype.logout();
        }
      },
    }); */
    return info;
  }
  getServiceWithParams(infoUrl: string, params: any): Observable<any> {
    const token = localStorage.getItem('token') || '';

    this.httpHeaders['token'] = token;
    // add bearer token
    this.httpHeaders['Authorization'] = `Bearer ${token}`;
    this.httpHeaders['Access-Control-Allow-Methods'] = 'POST';
    const info = this.http.get(infoUrl, {
      params: params,
      headers: this.httpHeaders,
    });
    /* info.subscribe({
      next: (resp: any) => {
        if (resp.error) {
          if (resp.error.serverResponseCode === 401) {
            AuthService.prototype.logout();
          }
        }
      },
      error: (error) => {
        if (error.error.serverResponseCode === 401) {
          AuthService.prototype.logout();
        }
      },
    }); */
    return info;
  }
}
