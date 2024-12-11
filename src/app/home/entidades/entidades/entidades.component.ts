import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, TableSettings } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Entidad } from 'src/app/shared/models/entidad.model';
@Component({
  selector: 'app-entidades',
  templateUrl: './entidades.component.html',
  styleUrls: [],
})
export class EntidadesComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  entidades: Entidad[] = [];
  searchTerm;

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly http: HttpClient,
    readonly tableOptions: TableSettings
  ) {
    this.titleService.setTitle('Entidades');
    this.spinner.show();
  }

  ngOnInit(): void {
    this.getAll();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }
  private getAll() {
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
          .getServiceWithParams(ApiRequest.getEntities, {
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
            this.entidades = response.data;
            callback({
              _total_: response.count,
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
          data: 'rut',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //nombre
          data: 'nombre',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //giro
          data: 'giro',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //direccion
          data: 'direccion',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //Comuna
          data: 'comuna.comuna',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //Region
          data: 'comuna.region.region',
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
        },
        {
          //Telefono
          data: 'telefono',
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
        },
        {
          //mail
          data: 'mail',
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
        },
        {
          //tipo
          data: 'tipo',
          className: 'fs-12',
          defaultContent: '',
          render: function (data: string) {
            // can be Cliente (C), Proveedor (P) o Ambos (B)
            let tipo = '';
            switch (data) {
              case 'C':
                tipo = 'Cliente';
                break;
              case 'P':
                tipo = 'Proveedor';
                break;
              case 'B':
                tipo = 'Ambos';
                break;
            }
            return tipo;
          },
        },

        {
          //actions
          data: 'rut',
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
          render: function (data: number) {
            return `<div class="d-flex justify-content-center">
            <a href="entidades/ver/${data}" class="btn btn-sm btn-primary mr-2">
              <i class="fas fa-eye
              "></i>
            </a>
            <a href="entidades/editar/${data}" class="btn btn-sm btn-success mr-2">
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
        /*         $('#worksites-table').DataTable().destroy()
                $('#properties-table').DataTable().destroy() */
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    }
  }
  search(): void {
    this.getAll();
  }
}
