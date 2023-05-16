import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Product } from '../../../shared/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: [],
})
export class ArticulosComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  products: Product[] = [];
  date = new Date();
  active: boolean = false;
  stock: boolean = false;

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
    this.getProducts();
  }

  private getProducts() {
    this.apiService = new ApiService(this.http);

    this.apiService
      .getService(
        ApiRequest.getArticulos +
          '?stock=' +
          this.stock +
          '&active=' +
          this.active
      )
      .subscribe({
        next: (resp) => {
          if (resp.status === 401 || resp.status === 403) {
            this.router.navigate(['/login']);
            return;
          }
          this.products = resp.result;
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  changeStock() {
    this.spinner.show();
    this.products = [];
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
    });
    this.stock = !this.stock;
    this.getProducts();
  }
  changeActive() {
    this.spinner.show();
    this.products = [];
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
    });
    this.active = !this.active;
    this.getProducts();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
