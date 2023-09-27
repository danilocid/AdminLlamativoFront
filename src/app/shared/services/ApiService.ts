import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

  postService(infoUrl: string, json: any): Observable<any> {
    let token = localStorage.getItem('token') || '';

    this.httpHeaders['token'] = token;
    this.httpHeaders['Access-Control-Allow-Methods'] = 'POST';
    let info = this.http.post(infoUrl, json, {
      headers: this.httpHeaders,
    });
    return info;
  }

  patchService(infoUrl: string, json: any): Observable<any> {
    let token = localStorage.getItem('token') || '';

    this.httpHeaders['token'] = token;
    this.httpHeaders['Access-Control-Allow-Methods'] = 'POST';
    let info = this.http.patch(infoUrl, json, {
      headers: this.httpHeaders,
    });
    return info;
  }

  getService(infoUrl: string): Observable<any> {
    let token = localStorage.getItem('token') || '';

    this.httpHeaders['token'] = token;
    this.httpHeaders['Access-Control-Allow-Methods'] = 'POST';
    let info = this.http.get(infoUrl, {
      headers: this.httpHeaders,
    });

    return info;
  }
}
