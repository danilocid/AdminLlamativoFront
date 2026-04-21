import { Component, OnInit } from '@angular/core';
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

@Component({
  standalone: false,
  selector: 'app-entidades',
  templateUrl: './entidades.component.html',
  styleUrls: [],
})
export class EntidadesComponent implements OnInit {
  entidades: Entidad[] = [];
  totalRecords = 0;
  loading = false;
  searchTerm = '';
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
  ) {
    this.titleService.setTitle('Entidades');
  }

  ngOnInit(): void {
    this.apiService = new ApiService(this.http);
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
