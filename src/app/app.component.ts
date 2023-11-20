import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent implements OnInit {
  isLogin = false;
  title = 'front';
  constructor(private router: Router, private as: AuthService) {
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

    //this.as.authVerificationCheck();
  }
}
