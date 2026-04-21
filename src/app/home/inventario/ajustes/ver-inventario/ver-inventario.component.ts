import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Inventory,
  InventoryDetail,
} from 'src/app/shared/models/inventory.model';
import { TableColumn } from 'src/app/shared/components/simple-table/simple-table.component';

@Component({
  standalone: false,
  selector: 'app-ver-inventario',
  templateUrl: './ver-inventario.component.html',
  styleUrls: [],
})
export class VerInventarioComponent implements OnInit {
  idInventario = '';
  movimiento: Inventory = {
    id: 0,
    costo_neto: 0,
    costo_imp: 0,
    entradas: 0,
    salidas: 0,
    tipo_movimiento: '',
    createdAt: '',
    name: '',
    observaciones: '',
  };
  articulos: InventoryDetail[] = [];
  date = new Date();

  columns: TableColumn[] = [
    { key: 'producto.cod_interno', label: 'Codigo', sortable: true },
    { key: 'producto.descripcion', label: 'Articulo', sortable: true },
    { key: 'entradas', label: 'IN', sortable: true, type: 'number' },
    { key: 'salidas', label: 'OUT', sortable: true, type: 'number' },
    {
      key: 'costo_total',
      label: 'Costo total',
      sortable: true,
      format: (value: any, row: InventoryDetail) =>
        '$' +
        new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(
          (row.costo_neto + row.costo_imp) * (row.entradas + row.salidas),
        ),
    },
  ];

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly api: ApiService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) {
    this.titleService.setTitle('Inventario - Ver');
    this.spinner.show();
    this.idInventario = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.api
      .get(ApiRequest.getAllInventory + '/' + this.idInventario)
      .subscribe({
        next: (resp) => {
          if (resp.status) {
            this.spinner.hide();
            this.alertSV.alertBasic('Error', resp.message, 'error');
            setTimeout(() => {
              this.router.navigate(['/inventario/ajustes']);
            }, 3000);
          }
          this.movimiento = resp.data;
          this.articulos = resp.inventoryDetails;
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
        },
      });
  }
}
