import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Title } from '@angular/platform-browser';
import { Sale, SaleDetail } from 'src/app/shared/models/sale.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TableColumn } from 'src/app/shared/components/simple-table/simple-table.component';
@Component({
  selector: 'app-ver-venta',
  templateUrl: './verVenta.component.html',
})
export class VerVentaComponent implements OnInit {
  venta: Sale;
  detalleVenta: SaleDetail[] = [];
  date = new Date();
  idVenta: any;

  formatCurrency = (value: number) =>
    '$' +
    new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(value);

  columns: TableColumn[] = [
    {
      key: 'articulo.descripcion',
      label: 'Descripcion',
      sortable: true,
    },
    { key: 'cantidad', label: 'Cantidad', sortable: true, type: 'number' },
    {
      key: 'precio_neto',
      label: 'Precio neto',
      sortable: true,
      format: (value: any) => this.formatCurrency(value),
    },
    {
      key: 'precio_imp',
      label: 'Precio I.V.A.',
      sortable: true,
      format: (value: any) => this.formatCurrency(value),
    },
    {
      key: 'precio_total',
      label: 'Precio',
      sortable: true,
      format: (value: any, row: SaleDetail) =>
        this.formatCurrency(row.precio_neto + row.precio_imp),
    },
    {
      key: 'costo_neto',
      label: 'Costo neto',
      sortable: true,
      format: (value: any) => this.formatCurrency(value),
    },
    {
      key: 'costo_imp',
      label: 'Costo I.V.A.',
      sortable: true,
      format: (value: any) => this.formatCurrency(value),
    },
    {
      key: 'costo_total',
      label: 'Costo',
      sortable: true,
      format: (value: any, row: SaleDetail) =>
        this.formatCurrency(row.costo_neto + row.costo_imp),
    },
    {
      key: 'ganancia',
      label: 'Ganancia',
      sortable: true,
      format: (value: any, row: SaleDetail) => {
        const ganancia =
          row.precio_neto + row.precio_imp - (row.costo_neto + row.costo_imp);
        return this.formatCurrency(ganancia);
      },
    },
    {
      key: 'porcentaje_ganancia',
      label: '% Ganancia',
      sortable: true,
      format: (value: any, row: SaleDetail) => {
        const precio = row.precio_neto + row.precio_imp;
        const costo = row.costo_neto + row.costo_imp;
        const porcentaje = precio > 0 ? ((precio - costo) / precio) * 100 : 0;
        return porcentaje.toFixed(2);
      },
    },
  ];

  constructor(
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly titleService: Title,
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly api: ApiService,
  ) {
    this.titleService.setTitle('Ver venta');
    this.spinner.show();
    this.idVenta = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.api.get(ApiRequest.getSales + '/' + this.idVenta).subscribe({
      next: (resp) => {
        this.venta = resp.data.sale;
        this.venta.extraCosts = resp.data.extraCosts;
        this.detalleVenta = resp.data.details;
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      },
    });
  }

  getTotalExtraCosts() {
    return this.venta.extraCosts.reduce((acc, extraCost) => {
      return acc + extraCost.monto;
    }, 0);
  }

  onViewArticulo(detalle: SaleDetail) {
    window.open('/articulos/ver/' + detalle.articulo.id, '_blank');
  }
}
