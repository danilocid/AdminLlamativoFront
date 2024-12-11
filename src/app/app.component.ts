import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent implements OnInit {
  isLogin = false;
  title = 'front';
  constructor(readonly router: Router, readonly as: AuthService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.toString().includes('/login')) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
      }
    });
  }
  ngOnInit() {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.toString().includes('/login')) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
      }
    });
    const token = localStorage.getItem('token');
    // decode token
    if (token) {
      const tokenDecode = jwtDecode(token);
      // check if token is expired
      if (tokenDecode.exp < Date.now() / 1000) {
        this.as.logout();
      }
      //this.as.authVerification
    }
    //this.as.authVerificationCheck();
  }
}
