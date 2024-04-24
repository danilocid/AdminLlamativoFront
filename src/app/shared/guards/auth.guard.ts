import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(private authSV: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.hasToken();
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.hasToken();
    /*     return this.authSV.authVerification()
      .pipe(
        tap(isAuth => {
          if (!isAuth) {
            this.router.navigate(['/login']);
          }
        })
      )  */
  }

  private async hasToken(): Promise<boolean> {
    const currenToken = await this.authSV.authVerification();
    if (currenToken !== null) {
      return true;
    }
    return false;
  }
}
