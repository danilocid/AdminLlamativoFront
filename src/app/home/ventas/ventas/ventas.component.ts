import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { TableSettings, ApiRequest } from 'src/app/shared/constants';
import { Sale } from 'src/app/shared/models/sale.model';
import { ApiService } from 'src/app/shared/services/ApiService';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
})
export class VentasComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  ventas: Sale[] = [];
  date = new Date();
  private apiService!: ApiService;

  constructor(
    readonly http: HttpClient,
    readonly spinner: NgxSpinnerService,
    readonly titleService: Title,
    readonly tableOptions: TableSettings
  ) {
    this.titleService.setTitle('Ventas');
  }

  ngOnInit() {
    this.getSales();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  getSales() {
    this.apiService = new ApiService(this.http);
    this.dtOptions = {
      ...this.tableOptions.getGlobalDataTableFormat(),
      serverSide: true,
      order: [[0, 'DESC']],
      processing: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        this.apiService
          .getServiceWithParams(ApiRequest.getSales, {
            page: dataTablesParameters.start / dataTablesParameters.length + 1,

            order:
              dataTablesParameters.order.length > 0
                ? dataTablesParameters.columns[
                    dataTablesParameters.order[0].column
                  ].data
                : '',
            sort:
              dataTablesParameters.order.length > 0
                ? dataTablesParameters.order[0].dir.toUpperCase()
                : 'DESC',
          })
          .subscribe((response) => {
            callback({
              _TOTAL_: +response.count,
              _START_: dataTablesParameters.start,
              _END_: dataTablesParameters.start + dataTablesParameters.length,
              data: response.data,
              recordsTotal: +response.count,
              recordsFiltered: +response.count,
            });
          });
        this.spinner.hide();
      },
      columns: [
        {
          //id
          data: 'id',
          className: 'fs-12',
          defaultContent: '',
        },

        {
          //cliente
          data: 'cliente.nombre',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //Monto
          data: null,
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
          render: function (data: any, type: any, row: any) {
            // suma de costo_imp y costo_neto
            let costo = row.monto_neto + row.monto_imp;
            // agregar signo de dolar y punto separador de miles
            costo = costo.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            return `$${costo}`;
          },
        },

        {
          //Documento
          data: 'documento',
          className: 'fs-12',
          defaultContent: '',
          orderable: true,
          orderData: [3],
          render: function (data: any, type: any, row: any) {
            return `${row.tipo_documento.tipo} ${row.documento}`;
          },
        },
        {
          //medio de pago
          data: 'medio_pago.medio_de_pago',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //fecha
          data: 'fecha',
          className: 'fs-12',
          defaultContent: '',
          render: function (data: any) {
            return new Date(data).toLocaleDateString('es-CL', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              minute: '2-digit',
              hour: '2-digit',
            });
          },
        },

        {
          //actions
          data: 'id',
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
          render: function (data: number) {
            return `
            <a href="ventas/ver/${data}" class="me-1 text-warning pointer">
              <i class="fas fa-eye
              "></i>
            </a>
            
           
          `;
          },
        },
      ],
    };
    this.rerender();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    }
  }
}
