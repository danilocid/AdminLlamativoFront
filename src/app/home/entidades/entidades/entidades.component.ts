import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { Entidad } from 'src/app/shared/models/entidad.model';
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
  selector: 'app-entidades',
  templateUrl: './entidades.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: [],
})
export class EntidadesComponent implements OnInit {
  /** Clave en localStorage donde se guarda el estado de este listado */
  static readonly LIST_STATE_KEY = 'entidades';

  entidades: Entidad[] = [];
  totalRecords = 0;
  loading = false;
  searchTerm = '';
  /** Estado anterior del listado, restaurado al volver desde el detalle */
  initialState: ListState | null = null;
  private apiService!: ApiService;

  columns: TableColumn[] = [
    { key: 'rut', label: 'RUT' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'giro', label: 'Giro' },
    { key: 'direccion', label: 'Direccion' },
    { key: 'comuna.comuna', label: 'Comuna' },
    { key: 'comuna.region.region', label: 'Region', sortable: false },
    { key: 'telefono', label: 'Telefono', sortable: false },
    { key: 'mail', label: 'Mail', sortable: false },
    {
      key: 'tipo',
      label: 'Tipo',
      valueGetter: (row: Entidad) => {
        switch (row.tipo) {
          case 'C':
            return 'Cliente';
          case 'P':
            return 'Proveedor';
          case 'B':
            return 'Ambos';
          default:
            return '';
        }
      },
    },
  ];

  constructor(
    readonly titleService: Title,
    readonly http: HttpClient,
    readonly router: Router,
    readonly listStateSV: ListStateService,
  ) {
    this.titleService.setTitle('Entidades');
  }

  ngOnInit(): void {
    this.apiService = new ApiService(this.http);

    const state = this.listStateSV.load(EntidadesComponent.LIST_STATE_KEY);
    this.searchTerm = state?.extra?.['searchTerm'] ?? '';
    this.initialState = state;
  }

  onDataRequest(event: DataRequestEvent): void {
    this.loading = true;

    const columnMap: Record<string, string> = {
      rut: 'rut',
      nombre: 'nombre',
      giro: 'giro',
      direccion: 'direccion',
      'comuna.comuna': 'comuna.comuna',
    };

    const params: any = {
      page: event.page,
      param: this.searchTerm || '',
      order: columnMap[event.sortColumn] || 'rut',
      sort: event.sortDirection || 'asc',
    };

    // Se persiste el estado para restaurarlo al volver desde el detalle
    this.listStateSV.save(EntidadesComponent.LIST_STATE_KEY, {
      page: event.page,
      pageSize: event.pageSize,
      sortColumn: event.sortColumn,
      sortDirection: event.sortDirection,
      searchTerm: event.searchTerm,
      extra: { searchTerm: this.searchTerm },
    });

    this.apiService
      .getWithParams(ApiRequest.getEntities, params)
      .subscribe((response) => {
        this.entidades = response.data;
        this.totalRecords = +response.count;
        this.loading = false;
      });
  }

  search(): void {
    this.onDataRequest({
      page: 1,
      pageSize: 10,
      sortColumn: 'rut',
      sortDirection: 'asc',
      searchTerm: this.searchTerm,
    });
  }

  onView(row: Entidad): void {
    this.router.navigate(['/entidades/ver', row.rut]);
  }

  onEdit(row: Entidad): void {
    this.router.navigate(['/entidades/editar', row.rut]);
  }
}
