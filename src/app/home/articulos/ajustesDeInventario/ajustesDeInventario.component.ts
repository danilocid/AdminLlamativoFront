import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, TableSettings } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Inventory } from '../../../shared/models/inventory.model';

@Component({
  selector: 'app-ajustes-de-inventario',
  templateUrl: './ajustesDeInventario.component.html',
  styleUrls: [],
})
export class AjustesDeInventarioComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  inventories: Inventory[] = [];
  date = new Date();

  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService,
    private http: HttpClient,
    private tableOptions: TableSettings
  ) {
    this.titleService.setTitle('Ajustes de Inventario');
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngOnInit() {
    this.spinner.show();

    this.getInventories();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }
  getInventories() {
    this.apiService = new ApiService(this.http);
    this.dtOptions = {
      ...this.tableOptions.getGlobalDataTableFormat(),
      serverSide: true,
      order: [[0, 'asc']],
      processing: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        this.apiService
          .getServiceWithParams(ApiRequest.getAllInventory, {
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
            this.inventories = response.data;
            callback({
              _TOTAL_: response.count,
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
          orderable: false,
        },
        {
          //tipo movimiento
          data: 'tipo_movimiento.tipo_movimiento',
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
        },

        {
          //observacion
          data: 'observaciones',
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
        },
        {
          //entradas
          data: 'entradas',
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
        },
        {
          //salidas
          data: 'salidas',
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
        },
        {
          //costo
          data: null,
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
          render: function (data: any, type: any, row: any) {
            // suma de costo_imp y costo_neto
            let costo = row.costo_imp + row.costo_neto;
            // agregar signo de dolar y punto separador de miles
            costo = costo.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            return `$${costo}`;
          },
        },

        {
          //actions
          data: 'id',
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
          render: function (data: number) {
            return `<div class="d-flex justify-content-center">
            <a href="articulos/ajustes/ver/${data}" class="btn btn-sm btn-primary mr-2">
              <i class="fas fa-eye
              "></i>
            </a>
           
           
          </div>`;
          },
        },
      ],
    };
    this.rerender();
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
