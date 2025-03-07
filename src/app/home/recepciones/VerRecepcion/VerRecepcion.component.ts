import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import {
  Reception,
  ReceptionProduct,
} from 'src/app/shared/models/receptions.model';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-ver-recepcion',
  templateUrl: './VerRecepcion.component.html',
  styleUrls: ['./VerRecepcion.component.css'],
})
export class VerRecepcionComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  idRecepcion = '';
  private apiService!: ApiService;
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
      tipo: 1,
    },
    fecha: new Date(),
    tipo_documento: {
      id: 0,

      tipo: '',
    },
  };
  productsRecepcion: ReceptionProduct[] = [];

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly http: HttpClient,
    readonly route: ActivatedRoute
  ) {
    this.titleService.setTitle('Recepciones - Ver');
    this.spinner.show();
    this.idRecepcion = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.dtOptions = FormatDataTableGlobal();
    this.getRecepcionData();
  }

  getRecepcionData() {
    this.apiService = new ApiService(this.http);
    this.apiService
      .getService(ApiRequest.getRecepciones + '/' + this.idRecepcion)
      .subscribe({
        next: (resp) => {
          this.dataRecepcion = resp.reception;
          this.productsRecepcion = resp.details;
          this.dtTrigger.next(this.dtOptions);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
        },
      });
  }
}
