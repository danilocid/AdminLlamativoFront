import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../../shared/models/product.model';
import {
  TableColumn,
  DataRequestEvent,
} from 'src/app/shared/components/simple-table/simple-table.component';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css'],
})
export class ArticulosComponent implements OnInit {
  products: Product[] = [];
  totalRecords = 0;
  loading = false;
  active = false;
  stock = true;
  includeDeprecated = false;
  searchTerm = '';
  private apiService!: ApiService;
  private lastEvent: DataRequestEvent | null = null;

  formatCurrency = (value: number) =>
    '$' + value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  columns: TableColumn[] = [
    { key: 'id', label: 'Id' },
    { key: 'cod_interno', label: 'Interno' },
    { key: 'cod_barras', label: 'Barra' },
    { key: 'descripcion', label: 'Descripcion' },
    { key: 'stock', label: 'Stock' },
    {
      key: 'costo',
      label: 'Costo',
      sortable: false,
      valueGetter: (row: Product) =>
        this.formatCurrency((row.costo_imp || 0) + (row.costo_neto || 0)),
    },
    {
      key: 'pvp',
      label: 'PVP',
      sortable: false,
      valueGetter: (row: Product) =>
        this.formatCurrency((row.venta_imp || 0) + (row.venta_neto || 0)),
    },
    {
      key: 'activo',
      label: 'Activo',
      sortable: false,
      valueGetter: (row: Product) => (row.activo ? 'Activo' : 'Inactivo'),
    },
    {
      key: 'deprecado',
      label: 'Deprecado',
      sortable: false,
      valueGetter: (row: Product) =>
        row.deprecado ? '⚠️ Deprecado' : '✅ Vigente',
    },
    {
      key: 'publicado',
      label: 'Publicado',
      valueGetter: (row: Product) => (row.publicado ? 'Si' : 'No'),
    },
  ];

  constructor(
    readonly titleService: Title,
    readonly http: HttpClient,
    readonly router: Router,
  ) {
    this.titleService.setTitle('Articulos');
  }

  ngOnInit() {
    this.apiService = new ApiService(this.http);
  }

  onDataRequest(event: DataRequestEvent): void {
    this.loading = true;
    this.lastEvent = event;

    const columnMap: Record<string, string> = {
      id: 'id',
      cod_interno: 'cod_interno',
      cod_barras: 'cod_barras',
      descripcion: 'descripcion',
      stock: 'stock',
      publicado: 'publicado',
    };

    const params: any = {
      page: event.page,
      param: this.searchTerm || '',
      order: columnMap[event.sortColumn] || 'id',
      sort: event.sortDirection?.toUpperCase() || 'ASC',
      stock: this.stock,
      active: this.active,
      includeDeprecated: this.includeDeprecated,
    };

    this.apiService
      .getWithParams(ApiRequest.getArticulos, params)
      .subscribe((response) => {
        this.products = response.data;
        this.totalRecords = +response.count;
        this.loading = false;
      });
  }

  search(): void {
    this.onDataRequest(
      this.lastEvent || {
        page: 1,
        pageSize: 10,
        sortColumn: 'id',
        sortDirection: 'asc',
        searchTerm: this.searchTerm,
      },
    );
  }

  changeStock(): void {
    this.stock = !this.stock;
    this.search();
  }

  changeActive(): void {
    this.active = !this.active;
    this.search();
  }

  changeDeprecated(): void {
    this.includeDeprecated = !this.includeDeprecated;
    this.search();
  }

  onView(row: Product): void {
    this.router.navigate(['/articulos/ver', row.id]);
  }

  rowLink = (row: Product): string => '/articulos/ver/' + row.id;

  onEdit(row: Product): void {
    this.router.navigate(['/articulos/editar', row.id]);
  }
}
