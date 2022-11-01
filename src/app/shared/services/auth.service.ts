import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ApiRequest } from 'src/app/shared/constants';
import { AuthResponse } from '../models/user.model';
import { UtilService } from './util.service';
import { ApiService } from './ApiService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  [x: string]: any;
  private _user: AuthResponse | undefined;

  get user() {
    return { ...this._user };
  }
  private apiService!: ApiService;
  constructor(private http: HttpClient, private utSV: UtilService) {}

  async authVerification(): Promise<Observable<boolean>> {
    var token = '';

    if (!localStorage.getItem('token') || '') {
      this.utSV.navigateToPath('/login');

      return of(false);
    } else {
      token = localStorage.getItem('token') || '';

      this.apiService = new ApiService(this.http);
      await this.apiService
        .postService(ApiRequest.postLoginRenewToken, {
          token: token,
        })
        .subscribe((resp) => {
          console.log(resp.ok);
          if (resp.ok == true) {
            localStorage.setItem('token', resp.token!);
            return of(true);
          } else {
            this.logout();
            return of(false);
          }
        });
    }
    return of(false);
  }
  async authVerificationCheck() {
    var token = '';
    var bool = null;

    if (!localStorage.getItem('token') || '') {
      this.utSV.navigateToPath('/login');
      return false;
    } else {
      token = localStorage.getItem('token') || '';

      this.apiService = new ApiService(this.http);
      await this.apiService
        .postService(ApiRequest.postLoginRenewToken, {
          token: token,
        })
        .subscribe((resp) => {
          console.log(resp.ok);
          if (resp.ok == true) {
            localStorage.setItem('token', resp.token!);
            this.utSV.navigateToPath('/home');
            return true;
          } else {
            this.logout();
            return false;
          }
        });
      return null;
    }
  }

  login(user: any, password: any) {
    return this.http
      .post<AuthResponse>(ApiRequest.postLogin, { user, password })
      .pipe(
        tap((resp) => {
          if (resp.ok == true) {
            localStorage.setItem('token', resp.token!);
          }
          catchError((err) => of(err));
        })
      );
  }

  renewToken() {
    const token = localStorage.getItem('token') || '';
    this.apiService = new ApiService(this.http);
    this.apiService
      .postService(ApiRequest.postLoginRenewToken, {
        token: token,
      })
      .subscribe((resp) => {
        if (resp.ok == true) {
          localStorage.setItem('token', resp.token!);
          return true;
        } else {
          this.logout();
          return false;
        }
      });
  }

  logout() {
    console.log('logout');
    localStorage.removeItem('token');
    localStorage.clear();
    sessionStorage.clear();
    this.utSV.navigateToPath('/login');
  }
}
