import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, TableSettings } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: [],
})
export class ArticulosComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  products: Product[] = [];
  date = new Date();
  active = false;
  stock = true;
  searchTerm;

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly http: HttpClient,
    readonly tableOptions: TableSettings
  ) {
    this.titleService.setTitle('Articulos');
    this.spinner.show();
  }

  ngOnInit() {
    this.spinner.show();
    this.getProducts();
  }
  search(): void {
    this.getProducts();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }
  private getProducts() {
    this.apiService = new ApiService(this.http);
    this.dtOptions = {
      ...this.tableOptions.getGlobalDataTableFormat(),
      serverSide: true,
      order: [[0, 'asc']],
      processing: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        this.apiService
          .getServiceWithParams(ApiRequest.getArticulos, {
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
                ? dataTablesParameters.order[0].dir.toUpperCase()
                : 'DESC',
            stock: this.stock,
            active: this.active,
          })
          .subscribe((response) => {
            this.products = response.data;
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
        },
        {
          //codigo interno
          data: 'cod_interno',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //codigo de barra
          data: 'cod_barras',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //descripcion
          data: 'descripcion',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //stock
          data: 'stock',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //Costo
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
          //PVP
          data: null,
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
          render: function (data: any, type: any, row: any) {
            // suma de venta_imp y venta_neto
            let pvp = row.venta_imp + row.venta_neto;
            // agregar signo de dolar y punto separador de miles
            pvp = pvp.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            // agregar signo de dolar y punto separador de miles

            return `$${pvp}`;
          },
        },
        {
          //activo
          data: 'activo',
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
          render: function (data: boolean) {
            return data ? 'Activo' : 'Inactivo';
          },
        },
        {
          //publicado
          data: 'publicado',
          className: 'fs-12',
          defaultContent: '',
          render: function (data: boolean) {
            return data ? 'Si' : 'No';
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
            <a href="articulos/ver/${data}" class="btn btn-sm btn-primary mr-2">
              <i class="fas fa-eye
              "></i>
            </a>
            <a href="articulos/editar/${data}" class="btn btn-sm btn-success mr-2">
              <i class="fas fa-edit
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

  changeStock() {
    this.spinner.show();
    this.stock = !this.stock;
    this.getProducts();
  }
  changeActive() {
    this.spinner.show();
    this.active = !this.active;
    this.getProducts();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
