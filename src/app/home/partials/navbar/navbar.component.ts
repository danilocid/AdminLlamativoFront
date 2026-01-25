import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { Notification } from 'src/app/shared/models/notification.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    readonly http: HttpClient,
    private router: Router,
  ) {}

  apiService = new ApiService(this.http);
  notifications: Notification[] = [];
  unReadedNotifications: number = 0;
  ngOnInit() {
    this.getNotifications();
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }

  getNotifications() {
    this.apiService.getService(ApiRequest.getNotificaciones).subscribe({
      next: (resp) => {
        this.notifications = resp.data;
        this.unReadedNotifications = this.notifications.filter(
          (x) => !x.readed,
        ).length;
      },
    });
  }

  markAsReaded(notification: Notification) {
    this.apiService
      .postService(ApiRequest.markAsReaded + '/' + notification.id, {})
      .subscribe({
        next: () => {
          this.getNotifications();
        },
      });
  }

  onNotificationClick(event: Event, notification: Notification) {
    event.preventDefault();

    // Marcar como leída si no lo está
    if (!notification.readed) {
      this.apiService
        .postService(ApiRequest.markAsReaded + '/' + notification.id, {})
        .subscribe({
          next: () => {
            // Navegar después de marcar como leída
            this.navigateToUrl(notification.url);
          },
        });
    } else {
      // Si ya está leída, simplemente navegar
      this.navigateToUrl(notification.url);
    }
  }

  private navigateToUrl(url: string) {
    if (url && url !== 'null') {
      this.router.navigateByUrl(url);
    }
  }
}
