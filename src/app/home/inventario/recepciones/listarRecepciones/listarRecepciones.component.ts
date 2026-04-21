import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiRequest } from 'src/app/shared/constants';
import { Reception } from 'src/app/shared/models/receptions.model';
import { ApiService } from 'src/app/shared/services/ApiService';
import {
  TableColumn,
  DataRequestEvent,
} from 'src/app/shared/components/simple-table/simple-table.component';

@Component({
  standalone: false,
  selector: 'app-listar-recepciones',
  templateUrl: './listarRecepciones.component.html',
  styleUrls: ['./listarRecepciones.component.css'],
})
export class ListarRecepcionesComponent implements OnInit {
  recepciones: Reception[] = [];
  totalRecords = 0;
  loading = false;
  searchTerm = '';
  private apiService!: ApiService;

  formatCurrency = (value: number) =>
    '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  columns: TableColumn[] = [
    { key: 'id', label: 'Id' },
    {
      key: 'proveedor',
      label: 'Proveedor',
      valueGetter: (row: Reception) =>
        `${row.proveedor?.nombre || ''} (${row.proveedor?.rut || ''})`,
    },
    {
      key: 'documento',
      label: 'Documento',
      valueGetter: (row: Reception) =>
        `${row.documento} (${row.tipo_documento?.tipo || ''})`,
    },
    { key: 'unidades', label: 'Unidades' },
    {
      key: 'total',
      label: 'Total',
      sortable: false,
      valueGetter: (row: Reception) =>
        this.formatCurrency((row.costo_neto || 0) + (row.costo_imp || 0)),
    },
    {
      key: 'fecha',
      label: 'Fecha',
      valueGetter: (row: Reception) =>
        new Date(row.fecha).toLocaleDateString('es-CL', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          minute: '2-digit',
          hour: '2-digit',
        }),
    },
  ];

  constructor(
    readonly http: HttpClient,
    readonly titleService: Title,
    readonly router: Router,
  ) {
    this.titleService.setTitle('Recepciones');
  }

  ngOnInit() {
    this.apiService = new ApiService(this.http);
  }

  onDataRequest(event: DataRequestEvent): void {
    this.loading = true;

    const columnMap: Record<string, string> = {
      id: 'id',
      fecha: 'fecha',
    };

    const params: any = {
      page: event.page,
      param: this.searchTerm || '',
      order: columnMap[event.sortColumn] || 'id',
      sort: event.sortDirection || 'asc',
    };

    this.apiService
      .getWithParams(ApiRequest.getRecepciones, params)
      .subscribe((response) => {
        this.recepciones = response.data;
        this.totalRecords = +response.total;
        this.loading = false;
      });
  }

  search(): void {
    this.onDataRequest({
      page: 1,
      pageSize: 10,
      sortColumn: 'id',
      sortDirection: 'asc',
      searchTerm: this.searchTerm,
    });
  }

  onView(row: Reception): void {
    this.router.navigate(['/inventario/recepciones/ver', row.id]);
  }
}
