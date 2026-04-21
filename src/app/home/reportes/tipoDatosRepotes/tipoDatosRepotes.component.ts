import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TableColumn } from 'src/app/shared/components/simple-table/simple-table.component';

@Component({
  standalone: false,
  selector: 'app-tipo-datos-repotes',
  templateUrl: './tipoDatosRepotes.component.html',
  styleUrls: ['./tipoDatosRepotes.component.css'],
})
export class TipoDatosRepotesComponent implements OnInit {
  tiposDatos: any[] = [];
  private apiService!: ApiService;
  showModal = false;
  tipoDato: any;

  // Configuración de columnas para la tabla Angular pura
  tableColumns: TableColumn[] = [
    { key: 'id', label: 'Id', sortable: true },
    { key: 'dato', label: 'Dato', sortable: true },
    { key: 'orden', label: 'Orden', sortable: true },
    {
      key: 'isNumber',
      label: 'Numero',
      sortable: true,
      format: (value: boolean) => (value ? 'Si' : 'No'),
    },
    {
      key: 'isMoney',
      label: 'Moneda',
      sortable: true,
      format: (value: boolean) => (value ? 'Si' : 'No'),
    },
    {
      key: 'activo',
      label: 'Activo',
      sortable: true,
      format: (value: boolean) => (value ? 'Activo' : 'Inactivo'),
    },
  ];

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly http: HttpClient,
  ) {
    this.titleService.setTitle('Tipos de datos reportes');
  }

  showModalCreate() {
    this.showModal = true;
  }

  showModalEdit(tipoDato: any) {
    this.tipoDato = tipoDato;
    this.showModal = true;
  }

  ngOnInit() {
    this.spinner.show();
    this.getData();
  }

  private getData() {
    this.apiService = new ApiService(this.http);
    this.apiService.get(ApiRequest.getTipoDatosReportes).subscribe({
      next: (result: any) => {
        this.tiposDatos = result.data;
        this.spinner.hide();
      },
      error: (error: any) => {
        console.warn(error);
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
        this.spinner.hide();
      },
    });
  }
}
