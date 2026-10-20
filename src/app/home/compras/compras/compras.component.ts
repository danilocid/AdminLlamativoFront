import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TableColumn } from 'src/app/shared/components/simple-table/simple-table.component';
import {
  ListState,
  ListStateService,
} from 'src/app/shared/services/list-state.service';

@Component({
  standalone: false,
  selector: 'app-compras',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './compras.component.html',
})
export class ComprasComponent implements OnInit {
  /** Clave en localStorage donde se guarda el estado de este listado */
  static readonly LIST_STATE_KEY = 'compras';

  compras: any[] = [];
  compra: any;
  month: any;
  year: any;
  yearList = [];
  dateForm: FormGroup;
  showModal = false;
  showModalCrear = false;
  showModalImport = false;
  /** Estado anterior de la tabla, restaurado al volver a la lista */
  initialState: ListState | null = null;
  /** Último estado emitido por la tabla (página, orden, búsqueda) */
  private tableState: ListState | null = null;

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
    readonly listStateSV: ListStateService,
  ) {
    this.titleService.setTitle('Compras');
  }

  ngOnInit() {
    this.spinner.show();

    const state = this.listStateSV.load(ComprasComponent.LIST_STATE_KEY);
    const date = new Date();
    this.month = state?.extra?.['month'] ?? date.getMonth() + 1;
    this.year = state?.extra?.['year'] ?? date.getFullYear();
    this.initialState = state;
    this.tableState = state;

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
    this.saveState();
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

  abrirCrearCompra() {
    this.showModalCrear = true;
  }

  onCloseCrear(reload: boolean) {
    this.showModalCrear = false;
    if (reload) {
      this.compras = [];
      this.getCompras();
    }
  }

  /** Guarda el estado de la tabla + filtros de período en localStorage */
  private saveState(): void {
    this.listStateSV.save(ComprasComponent.LIST_STATE_KEY, {
      page: this.tableState?.page ?? 1,
      pageSize: this.tableState?.pageSize ?? 10,
      sortColumn: this.tableState?.sortColumn ?? '',
      sortDirection: this.tableState?.sortDirection ?? '',
      searchTerm: this.tableState?.searchTerm ?? '',
      extra: { month: this.month, year: this.year },
    });
  }

  /** Se dispara ante cada cambio de página, orden o búsqueda de la tabla */
  onStateChange(state: ListState): void {
    this.tableState = state;
    this.saveState();
  }

  submit() {
    this.spinner.show();
    this.month = +this.dateForm.get('month')?.value;
    this.year = +this.dateForm.get('year')?.value;
    this.compras = [];
    this.getCompras();
  }
}
