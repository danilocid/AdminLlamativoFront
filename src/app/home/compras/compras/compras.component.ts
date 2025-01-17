import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FormatDataTableGlobal } from 'src/app/shared/services/util.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
})
export class ComprasComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  compras: any[] = [];
  compra: any;
  month: any;
  year: any;
  yearList = [];
  dateForm: FormGroup;
  private apiService!: ApiService;
  showModal = false;
  showModalImport = false;
  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly router: Router,
    readonly alertSV: AlertService,
    readonly fb: FormBuilder,
    readonly http: HttpClient
  ) {
    this.titleService.setTitle('Compras');
  }

  ngOnInit() {
    this.spinner.show();
    //get current month and year
    const date = new Date();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
    this.dtOptions = FormatDataTableGlobal();
    for (let i = 2023; i <= this.year; i++) {
      this.yearList.push(i);
    }
    this.dateForm = this.fb.group({
      month: [this.month],
      year: [this.year],
    });
    this.getCompras();
  }
  getCompras() {
    this.apiService = new ApiService(this.http);
    this.apiService
      .getServiceWithParams(ApiRequest.getComprasFromDb, {
        month: this.month,
        year: this.year,
      })
      .subscribe({
        next: (resp) => {
          if (resp.status === 401 || resp.status === 403) {
            this.router.navigateByUrl('/login');
          }
          this.compras = resp.data;
          this.dtTrigger.next(this.dtOptions);
          this.spinner.hide();
          //console.log(this.compras);
          //this.compra = this.compras[0];
        },
        error: (err) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', err.error.msg, 'error');
        },
      });
  }

  editCompra(compra: any) {
    // console.log(compra);
    this.showModal = true;
    this.compra = compra;
  }
  submit() {
    this.spinner.show();
    this.month = +this.dateForm.get('month')?.value;
    this.year = +this.dateForm.get('year')?.value;
    this.compras = [];
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.getCompras();
  }

  getDataFromApi() {
    this.spinner.show();
    this.apiService = new ApiService(this.http);
    this.month = +this.dateForm.get('month')?.value;
    this.year = +this.dateForm.get('year')?.value;
    this.apiService
      .getServiceWithParams(ApiRequest.getComprasFromApi, {
        month: this.month,
        year: this.year,
      })
      .subscribe({
        next: (resp) => {
          if (resp.status === 401 || resp.status === 403) {
            this.router.navigateByUrl('/login');
          }
          this.spinner.hide();
          this.alertSV.alertVerification(
            'Compras',
            resp.msg,
            'Ok',
            'success',
            () => {
              this.compras = [];
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
              });
              this.getCompras();
            }
          );
        },
        error: (err) => {
          this.spinner.hide();
          console.warn(err);
          this.alertSV.alertBasic('Error', err.error.msg, 'error');
        },
      });
  }
}
