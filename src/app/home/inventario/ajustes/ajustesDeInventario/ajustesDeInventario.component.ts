import { Component, OnInit } from '@angular/core';
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

@Component({
  standalone: false,
  selector: 'app-ajustes-de-inventario',
  templateUrl: './ajustesDeInventario.component.html',
  styleUrls: [],
})
export class AjustesDeInventarioComponent implements OnInit {
  inventories: Inventory[] = [];
  totalRecords = 0;
  loading = false;
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
  ) {
    this.titleService.setTitle('Ajustes de Inventario');
  }

  ngOnInit() {
    this.apiService = new ApiService(this.http);
  }

  onDataRequest(event: DataRequestEvent): void {
    this.loading = true;

    const params: any = {
      page: event.page,
      order: event.sortColumn || 'id',
      sort: event.sortDirection?.toUpperCase() || 'ASC',
    };

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
