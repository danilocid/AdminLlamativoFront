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
import { Product } from '../../../shared/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css'],
})
export class ArticulosComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  //dtTrigger = new Subject();
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  products: Product[] = [];
  date = new Date();

  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private uS: UtilService,
    private router: Router,
    private alertSV: AlertService,
    private http: HttpClient
  ) {
    this.titleService.setTitle('Articulos');
    this.spinner.show();
  }

  ngOnInit() {
    this.dtOptions = FormatDataTableGlobal();
    //this.dtOptions.order = [0, 'asc'];
    this.apiService = new ApiService(this.http);
    /* this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
    }; */
    /* this.apiService.getService(ApiRequest.getArticulos).subscribe(
      (resp) => {
        console.table(resp.result);
        this.users = resp.result;
        this.rerender();
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        console.log('error ' + error.status);
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      }
    ); */
    this.apiService.getService(ApiRequest.getArticulos).subscribe({
      next: (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        //console.table(resp.result);
        this.products = resp.result;
        this.dtTrigger.next(this.dtOptions);
        this.spinner.hide();
      },
      error: (error) => {
        console.log(error);
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        console.log('error ' + error.status);
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      },
    });
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
