import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { UtilService } from 'src/app/shared/services/util.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
})
export class DashboardComponent implements OnInit {
  dasboardReport: any = {
    totalUnits: 0,
    totalCost: 0,
    totalSale: 0,
    totalProfit: 0,
  };
  private apiService!: ApiService;

  constructor(
    private titleService: Title,
    private http: HttpClient,
    private as: AuthService
  ) {
    this.titleService.setTitle('Dashboard');
  }
  ngOnInit() {
    this.getDashboardReport();
  }

  getDashboardReport() {
    this.apiService = new ApiService(this.http);
    this.apiService.getService(ApiRequest.dashboardReport).subscribe({
      next: (resp) => {
        this.dasboardReport = resp;
      },
      error: (err) => {
        if (err.status == 401 || err.status == 403) {
          //logout
          this.as.logout();
        }
      },
    });
  }
}
