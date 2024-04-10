import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-issues',
  templateUrl: './allIssues.component.html',
  styleUrls: [],
})
export class AllIssuesComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<object> = new Subject<object>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  issues = [];
  status = [];
  type = [];
  section = [];
  date = new Date();
  statusSelected = 'pending';
  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private router: Router,
    private alertSV: AlertService,
    private http: HttpClient
  ) {
    this.titleService.setTitle('Issues');
    this.spinner.show();
  }

  ngOnInit() {
    this.dtOptions = FormatDataTableGlobal();
    //permite ordenar por fecha
    this.dtOptions.columnDefs = [
      {
        targets: [4],
        searchable: false,
      },
      {
        targets: [3],
        searchable: false,
      },
    ];
    this.dtOptions.order = [
      [5, 'desc'],
      [4, 'desc'],
    ];
    this.apiService = new ApiService(this.http);

    this.apiService.getService(ApiRequest.reportIssue).subscribe({
      next: (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.status = resp.data.status;
        this.type = resp.data.type;
        this.section = resp.data.section;
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      },
    });
    this.getIssues();
  }

  private getIssues() {
    this.apiService
      .getService(ApiRequest.getIssues + `?type=${this.statusSelected}`)
      .subscribe({
        next: (resp) => {
          if (resp.status === 401 || resp.status === 403) {
            this.router.navigate(['/login']);
            return;
          }
          this.issues = resp.data;
          this.dtTrigger.next(this.dtOptions);

          this.spinner.hide();
        },
        error: (error) => {
          if (error.status === 401 || error.status === 403) {
            this.router.navigate(['/login']);
            return;
          }
          this.spinner.hide();
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
        },
      });
  }

  changeStatus() {
    this.spinner.show();
    this.statusSelected = (<HTMLInputElement>(
      document.getElementById('statusSelect')
    )).value;
    //destroy table
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
    });
    this.getIssues();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }
}
