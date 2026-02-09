import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ApiRequest } from 'src/app/shared/constants';
import { AuthResponse } from '../models/user.model';
import { UtilService } from './util.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  iat?: number;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: AuthResponse | undefined;

  get user() {
    return { ...this._user };
  }

  constructor(
    readonly http: HttpClient,
    readonly utSV: UtilService,
  ) {}

  /**
   * Verifica si el token JWT ha expirado
   * @param token - Token JWT a verificar
   * @returns true si el token es válido y no ha expirado
   */
  isTokenValid(token: string | null): boolean {
    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) {
        return false;
      }

      // exp está en segundos, Date.now() en milisegundos
      const currentTime = Date.now() / 1000;
      // Agregar margen de 60 segundos para evitar problemas de timing
      return decoded.exp > currentTime + 60;
    } catch {
      return false;
    }
  }

  async authVerification(): Promise<Observable<boolean>> {
    const token = localStorage.getItem('token');

    if (!this.isTokenValid(token)) {
      this.clearStorage();
      this.utSV.navigateToPath('/login');
      return of(false);
    }

    return of(true);
  }

  async authVerificationCheck() {
    const token = localStorage.getItem('token');

    if (!this.isTokenValid(token)) {
      // Token inválido o expirado, limpiar y quedarse en login
      this.clearStorage();
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
        }),
      );
  }

  private clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.clear();
    sessionStorage.clear();
  }

  logout() {
    this.clearStorage();
    this.utSV.navigateToPath('/login');
  }
}
