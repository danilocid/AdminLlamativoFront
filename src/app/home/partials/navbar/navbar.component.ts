import { Component } from '@angular/core';
import { UtilService } from 'src/app/shared/services/util.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private utSV: UtilService) {}

  logout() {
    localStorage.removeItem('token');
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }
}
