import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ApiRequest, TableSettings } from 'src/app/shared/constants';
import { Entidad } from 'src/app/shared/models/entidad.model';
import { Reception } from 'src/app/shared/models/receptions.model';
import { ApiService } from 'src/app/shared/services/ApiService';

@Component({
  selector: 'app-listar-recepciones',
  templateUrl: './listarRecepciones.component.html',
  styleUrls: ['./listarRecepciones.component.css'],
})
export class ListarRecepcionesComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  recepciones: Reception[] = [];
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  searchTerm;

  constructor(
    private spinner: NgxSpinnerService,
    private tableOptions: TableSettings,

    private http: HttpClient,
    private titleService: Title
  ) {
    this.titleService.setTitle('Recepciones');
  }

  ngOnInit() {
    this.getRecepciones();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }
  getRecepciones() {
    this.apiService = new ApiService(this.http);
    this.spinner.show();

    this.dtOptions = {
      ...this.tableOptions.getGlobalDataTableFormat(),
      serverSide: true,
      order: [[0, 'asc']],
      info: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        this.apiService
          .getServiceWithParams(ApiRequest.getRecepciones, {
            page: dataTablesParameters.start / dataTablesParameters.length + 1,
            param: this.searchTerm ? this.searchTerm : '',
            order:
              dataTablesParameters.order.length > 0
                ? dataTablesParameters.columns[
                    dataTablesParameters.order[0].column
                  ].data
                : '',
            sort:
              dataTablesParameters.order.length > 0
                ? dataTablesParameters.order[0].dir
                : '',
          })
          .subscribe((response) => {
            this.recepciones = response.data;
            callback({
              _total_: response.total,
              data: response.data,
              recordsTotal: +response.total,
              recordsFiltered: +response.total,
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
          //nombre
          data: 'proveedor',
          className: 'fs-12',
          defaultContent: '',
          render: function (data: Entidad) {
            return data.nombre + ' (' + data.rut + ')';
          },
        },
        {
          //giro

          className: 'fs-12',
          defaultContent: '',
          render: function (data: any, type: any, row: any) {
            return row.documento + ' (' + row.tipo_documento.tipo + ')';
          },
        },
        {
          //direccion
          data: 'unidades',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //Comuna

          className: 'fs-12',
          defaultContent: '',
          render: function (data: any, type: any, row: any) {
            // suma de costo_imp y costo_neto
            let costo = row.costo_neto + row.costo_imp;
            // agregar signo de dolar y punto separador de miles
            costo = costo.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            return `$${costo}`;
          },
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
            return `<a href="recepciones/ver/${data}" class="me-1 text-warning pointer">
              <i class="fas fa-eye
              "></i>
            </a>`;
          },
        },
      ],
    };
    this.rerender();
  }

  search() {
    this.getRecepciones();
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
