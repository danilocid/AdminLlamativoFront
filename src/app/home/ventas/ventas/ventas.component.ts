import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiRequest } from 'src/app/shared/constants';
import { Sale } from 'src/app/shared/models/sale.model';
import { ApiService } from 'src/app/shared/services/ApiService';
import { Title } from '@angular/platform-browser';
import {
  TableColumn,
  DataRequestEvent,
} from 'src/app/shared/components/simple-table/simple-table.component';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
})
export class VentasComponent implements OnInit {
  ventas: Sale[] = [];
  totalRecords = 0;
  loading = false;
  private apiService!: ApiService;

  columns: TableColumn[] = [
    { key: 'id', label: 'Id' },
    {
      key: 'cliente',
      label: 'Cliente',
      valueGetter: (row: Sale) => row.cliente?.nombre || '',
    },
    {
      key: 'monto',
      label: 'Monto',
      sortable: false,
      valueGetter: (row: Sale) => {
        const costo = (row.monto_neto || 0) + (row.monto_imp || 0);
        return '$' + costo.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      },
    },
    {
      key: 'documento',
      label: 'Documento',
      valueGetter: (row: Sale) =>
        `${row.tipo_documento?.tipo || ''} ${row.documento || ''}`,
    },
    {
      key: 'medio_pago',
      label: 'Medio de pago',
      valueGetter: (row: Sale) => row.medio_pago?.medio_de_pago || '',
    },
    {
      key: 'fecha',
      label: 'Fecha',
      valueGetter: (row: Sale) =>
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
    this.titleService.setTitle('Ventas');
  }

  ngOnInit() {
    this.apiService = new ApiService(this.http);
  }

  onDataRequest(event: DataRequestEvent): void {
    this.loading = true;

    const columnMap: Record<string, string> = {
      id: 'id',
      documento: 'documento',
      fecha: 'fecha',
    };

    const params: any = {
      page: event.page,
      order: columnMap[event.sortColumn] || 'id',
      sort: event.sortDirection?.toUpperCase() || 'DESC',
    };

    this.apiService
      .getWithParams(ApiRequest.getSales, params)
      .subscribe((response) => {
        this.ventas = response.data;
        this.totalRecords = +response.count;
        this.loading = false;
      });
  }

  onView(row: Sale): void {
    this.router.navigate(['/ventas/ver', row.id]);
  }
}
