import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ApiRequest } from 'src/app/shared/constants';
import { AuthResponse } from '../models/user.model';
import { UtilService } from './util.service';
import { ApiService } from './ApiService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: AuthResponse | undefined;

  get user() {
    return { ...this._user };
  }
  private apiService!: ApiService;
  constructor(private http: HttpClient, private utSV: UtilService) {}

  async authVerification(): Promise<Observable<boolean>> {
    if (!localStorage.getItem('token') || '') {
      this.utSV.navigateToPath('/login');

      return of(false);
    } else {
      return of(true);
    }
  }
  async authVerificationCheck() {
    if (!localStorage.getItem('token')) {
      //this.utSV.navigateToPath('/login');
    } else {
      this.utSV.navigateToPath('/');
    }
  }

  login(user: string, password: string) {
    return this.http
      .post<AuthResponse>(ApiRequest.postLogin, { user, password })
      .pipe(
        tap((resp) => {
          if (resp.serverResponseCode === 200) {
            localStorage.setItem('token', resp.data);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }
}
