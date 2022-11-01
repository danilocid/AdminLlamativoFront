import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authSV: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.hasToken();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
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
