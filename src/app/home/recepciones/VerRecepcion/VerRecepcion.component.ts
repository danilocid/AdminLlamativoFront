import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import {
  Reception,
  ReceptionProduct,
} from 'src/app/shared/models/receptions.model';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TableColumn } from 'src/app/shared/components/simple-table/simple-table.component';

@Component({
  selector: 'app-ver-recepcion',
  templateUrl: './VerRecepcion.component.html',
  styleUrls: ['./VerRecepcion.component.css'],
})
export class VerRecepcionComponent implements OnInit {
  idRecepcion = '';
  dataRecepcion: Reception = {
    id: 0,
    costo_neto: 0,
    costo_imp: 0,
    unidades: 0,
    documento: '',
    proveedor: {
      nombre: '',
      rut: '',
      direccion: '',
      telefono: '',
      mail: '',
      comuna: {
        id: 0,
        region: {
          id: 0,
          region: '',
        },
        comuna: '',
      },
      giro: '',
      tipo: '',
    },
    fecha: new Date(),
    tipo_documento: {
      id: 0,

      tipo: '',
    },
  };
  productsRecepcion: ReceptionProduct[] = [];

  columns: TableColumn[] = [
    { key: 'producto.cod_interno', label: 'Codigo interno', sortable: true },
    { key: 'producto.descripcion', label: 'Descripcion', sortable: true },
    { key: 'unidades', label: 'Cantidad', sortable: true, type: 'number' },
    {
      key: 'costo_total',
      label: 'Costo total',
      sortable: true,
      format: (value: any, row: ReceptionProduct) =>
        new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          maximumFractionDigits: 0,
        }).format(row.costo_neto + row.costo_imp),
    },
  ];

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly api: ApiService,
    readonly route: ActivatedRoute,
  ) {
    this.titleService.setTitle('Recepciones - Ver');
    this.spinner.show();
    this.idRecepcion = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getRecepcionData();
  }

  getRecepcionData() {
    this.api.get(ApiRequest.getRecepciones + '/' + this.idRecepcion).subscribe({
      next: (resp) => {
        this.dataRecepcion = resp.reception;
        this.productsRecepcion = resp.details;
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      },
    });
  }
}
