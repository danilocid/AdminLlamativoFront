import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { Inventory } from '../../../../shared/models/inventory.model';
import {
  TableColumn,
  DataRequestEvent,
} from 'src/app/shared/components/simple-table/simple-table.component';
import {
  ListState,
  ListStateService,
} from 'src/app/shared/services/list-state.service';

@Component({
  standalone: false,
  selector: 'app-ajustes-de-inventario',
  templateUrl: './ajustesDeInventario.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: [],
})
export class AjustesDeInventarioComponent implements OnInit {
  /** Clave en localStorage donde se guarda el estado de este listado */
  static readonly LIST_STATE_KEY = 'ajustes-inventario';

  inventories: Inventory[] = [];
  totalRecords = 0;
  loading = false;
  /** Estado anterior del listado, restaurado al volver desde el detalle */
  initialState: ListState | null = null;
  private apiService!: ApiService;

  formatCurrency = (value: number) =>
    '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  columns: TableColumn[] = [
    { key: 'id', label: 'Id', sortable: false },
    {
      key: 'tipo_movimiento.tipo_movimiento',
      label: 'Tipo movimiento',
      sortable: false,
    },
    { key: 'observaciones', label: 'Obs', sortable: false },
    {
      key: 'createdAt',
      label: 'Fecha',
      sortable: false,
      valueGetter: (row: Inventory) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString('es-CL')
          : '-',
    },
    { key: 'entradas', label: 'Entradas', sortable: false },
    { key: 'salidas', label: 'Salidas', sortable: false },
    {
      key: 'costo',
      label: 'Costo',
      sortable: false,
      valueGetter: (row: Inventory) =>
        this.formatCurrency((row.costo_imp || 0) + (row.costo_neto || 0)),
    },
  ];

  constructor(
    readonly titleService: Title,
    readonly http: HttpClient,
    readonly router: Router,
    readonly listStateSV: ListStateService,
  ) {
    this.titleService.setTitle('Ajustes de Inventario');
  }

  ngOnInit() {
    this.apiService = new ApiService(this.http);
    this.initialState = this.listStateSV.load(
      AjustesDeInventarioComponent.LIST_STATE_KEY,
    );
  }

  onDataRequest(event: DataRequestEvent): void {
    this.loading = true;

    const params: any = {
      page: event.page,
      order: event.sortColumn || 'id',
      sort: event.sortDirection?.toUpperCase() || 'ASC',
    };

    // Se persiste el estado para restaurarlo al volver desde el detalle
    this.listStateSV.save(AjustesDeInventarioComponent.LIST_STATE_KEY, {
      page: event.page,
      pageSize: event.pageSize,
      sortColumn: event.sortColumn,
      sortDirection: event.sortDirection,
      searchTerm: event.searchTerm,
    });

    this.apiService
      .getWithParams(ApiRequest.getAllInventory, params)
      .subscribe((response) => {
        this.inventories = response.data;
        this.totalRecords = +response.count;
        this.loading = false;
      });
  }

  onView(row: Inventory): void {
    this.router.navigate(['/inventario/ajustes/ver', row.id]);
  }
}
