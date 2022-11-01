import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  baseURL = environment.urlBackend;
  header = new HttpHeaders();

  constructor(private http: HttpClient) {}

  postService(infoUrl: string, json: any): Observable<any> {
    let info = this.http.post(infoUrl, json, {
      headers: this.header,
    });
    return info;
  }

  getService(infoUrl: string): Observable<any> {
    let info = this.http.get(infoUrl, { headers: this.header });
    return info;
  }
}
