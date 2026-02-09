import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TableColumn } from 'src/app/shared/components/simple-table/simple-table.component';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
})
export class ComprasComponent implements OnInit {
  compras: any[] = [];
  compra: any;
  month: any;
  year: any;
  yearList = [];
  dateForm: FormGroup;
  showModal = false;
  showModalImport = false;

  columns: TableColumn[] = [
    { key: 'id', label: 'Id', sortable: true },
    {
      key: 'proveedor.nombre',
      label: 'Proveedor',
      sortable: true,
      format: (value: any, row: any) =>
        `${row.proveedor.nombre} (${row.proveedor.rut})`,
    },
    {
      key: 'documento',
      label: 'Documento',
      sortable: true,
      format: (value: any, row: any) =>
        `${row.tipo_documento.tipo} - ${row.documento}`,
    },
    {
      key: 'fecha_documento',
      label: 'Fecha',
      sortable: true,
      type: 'date',
    },
    {
      key: 'monto',
      label: 'Monto',
      sortable: true,
      format: (value: any, row: any) =>
        '$' +
        new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(
          row.monto_neto_documento + row.monto_imp_documento,
        ),
    },
    {
      key: 'costo',
      label: 'Costo',
      sortable: true,
      format: (value: any, row: any) =>
        '$' +
        new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(
          row.costo_neto_documento + row.costo_imp_documento,
        ),
    },
    { key: 'tipo_compra.tipo_compra', label: 'Tipo', sortable: true },
    { key: 'observaciones', label: 'Observaciones', sortable: false },
  ];

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly router: Router,
    readonly alertSV: AlertService,
    readonly fb: FormBuilder,
    readonly api: ApiService,
  ) {
    this.titleService.setTitle('Compras');
  }

  ngOnInit() {
    this.spinner.show();
    const date = new Date();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
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
    this.api
      .getWithParams(ApiRequest.getComprasFromDb, {
        month: this.month,
        year: this.year,
      })
      .subscribe({
        next: (resp) => {
          if (resp.status === 401 || resp.status === 403) {
            this.router.navigateByUrl('/login');
          }
          this.compras = resp.data;
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.alertSV.alertBasic(
            'Error',
            err.error.msg || 'Error desconocido',
            'error',
          );
        },
      });
  }

  editCompra(compra: any) {
    this.showModal = true;
    this.compra = compra;
  }

  submit() {
    this.spinner.show();
    this.month = +this.dateForm.get('month')?.value;
    this.year = +this.dateForm.get('year')?.value;
    this.compras = [];
    this.getCompras();
  }

  getDataFromApi() {
    this.spinner.show();
    this.month = +this.dateForm.get('month')?.value;
    this.year = +this.dateForm.get('year')?.value;
    this.api
      .getWithParams(ApiRequest.getComprasFromApi, {
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
            'Solicitud procesada correctamente.',
            'Ok',
            'success',
            () => {
              this.compras = [];
              this.getCompras();
            },
          );
        },
        error: (err) => {
          this.spinner.hide();
          console.warn(err);
          this.alertSV.alertBasic(
            'Error',
            err.error.msg || 'Error desconocido',
            'error',
          );
        },
      });
  }
}
