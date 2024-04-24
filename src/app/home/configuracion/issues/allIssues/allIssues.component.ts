import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, TableSettings } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-issues',
  templateUrl: './allIssues.component.html',
  styleUrls: [],
})
export class AllIssuesComponent implements OnInit, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtTrigger: Subject<object> = new Subject<object>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  issues = [];
  status = [];
  type = [];
  section = [];
  date = new Date();
  statusSelected = 'pending';
  data = [];
  searchTerm;
  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private router: Router,
    private alertSV: AlertService,
    private http: HttpClient,
    private tableOptions: TableSettings
  ) {
    this.titleService.setTitle('Issues');
    this.spinner.show();
  }

  ngOnInit() {
    /*  this.dtOptions = FormatDataTableGlobal();
    //permite ordenar por fecha
    this.dtOptions.columnDefs = [
      {
        targets: [4],
        searchable: false,
      },
      {
        targets: [3],
        searchable: false,
      },
    ];
    this.dtOptions.order = [
      [5, 'desc'],
      [4, 'desc'],
    ]; */
    this.apiService = new ApiService(this.http);

    this.apiService.getService(ApiRequest.reportIssue).subscribe({
      next: (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.status = resp.data.status;
        this.type = resp.data.type;
        this.section = resp.data.section;
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      },
    });
    //this.getIssues();
    this.getAll();
  }

  private getAll() {
    this.apiService = new ApiService(this.http);
    this.spinner.show();

    this.dtOptions = {
      ...this.tableOptions.getGlobalDataTableFormat(),
      serverSide: true,
      language: {
        paginate: {
          first: '<<',
          previous: '<',
          next: '>',
          last: '>>',
        },
        search: '',
        searchPlaceholder: 'Buscar',
        zeroRecords: 'No se encontraron resultados',
        emptyTable: 'No hay datos disponibles',
        loadingRecords: 'Cargando registros...',
        info: 'Mostrando desde _START_ al _END_ de _TOTAL_ elementos',
      },
      info: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback: any) => {
        this.apiService
          .getServiceWithParams(ApiRequest.getIssues, {
            type: this.statusSelected,
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
            this.data = response.data;
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
          data: 'id',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //issue
          data: 'issue',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //section
          data: 'issueSection.name',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //type
          data: 'issueType.issue_type',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //status
          data: 'issueStatus.name',
          className: 'fs-12',
          defaultContent: '',
        },
        {
          //created_at
          data: 'createdAt',
          className: 'fs-12',
          defaultContent: '',
          render: function (data: string) {
            return new Date(data).toLocaleDateString();
          },
        },
        {
          //updated_at
          data: 'updatedAt',
          className: 'fs-12',
          defaultContent: '',
          render: function (data: string) {
            return new Date(data).toLocaleDateString();
          },
        },
        {
          //actions
          data: 'id',
          className: 'fs-12',
          defaultContent: '',
          orderable: false,
          render: function (data: number) {
            return (
              '<a href="/configuracion/issues/editar/' +
              data +
              '" class="me-1 text-success pointer"><i class="fas fa-edit"></i></a>'
            );
          },
        },
      ],
    };
    this.rerender();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  changeStatus() {
    this.spinner.show();
    this.statusSelected = (<HTMLInputElement>(
      document.getElementById('statusSelect')
    )).value;
    //destroy table

    this.getAll();
  }
  search(): void {
    this.statusSelected = 'all';
    (<HTMLInputElement>document.getElementById('statusSelect')).value = 'all';
    this.getAll();
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
}
