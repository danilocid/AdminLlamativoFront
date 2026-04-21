import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(readonly authSV: AuthService) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.hasToken();
  }

  canMatch(): Observable<boolean> | Promise<boolean> | boolean {
    return this.hasToken();
  }

  private async hasToken(): Promise<boolean> {
    const currenToken = await this.authSV.authVerification();
    if (currenToken !== null) {
      return true;
    }
    return false;
  }
}
