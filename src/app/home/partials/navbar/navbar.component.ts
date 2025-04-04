import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { Notification } from 'src/app/shared/models/notification.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(readonly http: HttpClient) {}

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
          (x) => !x.readed
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
}
