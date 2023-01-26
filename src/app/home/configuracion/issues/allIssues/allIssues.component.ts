import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allIssues',
  templateUrl: './allIssues.component.html',
  styleUrls: ['./allIssues.component.css'],
})
export class AllIssuesComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  //dtTrigger = new Subject();
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  issues = [];
  date = new Date();
  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private uS: UtilService,
    private router: Router,
    private alertSV: AlertService,
    private http: HttpClient
  ) {
    this.titleService.setTitle('Issues');
    this.spinner.show();
  }

  ngOnInit() {
    this.dtOptions = FormatDataTableGlobal();
    this.dtOptions.order = [0, 'desc'];
    this.apiService = new ApiService(this.http);
    this.apiService.getService(ApiRequest.getIssues).subscribe(
      (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        //console.table(resp.issues);
        //console.log(resp.issues);
        //this.rerender();
        this.issues = resp.issues;
        this.dtTrigger.next(this.dtOptions);

        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        console.log('error ' + error.status);
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      }
    );
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
