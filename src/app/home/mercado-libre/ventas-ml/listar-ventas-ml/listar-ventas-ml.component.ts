import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';

@Component({
  standalone: false,
  selector: 'app-listar-ventas-ml',
  templateUrl: './listar-ventas-ml.component.html',
  styleUrls: [],
})
export class ListarVentasMlComponent implements OnInit {
  ventas: any[] = [];
  loading = false;
  syncing = false;
  currentPage = 1;
  limit = 10;
  totalPages = 1;
  total = 0;
  filtroAsociada = '';

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly api: ApiService,
  ) {
    this.titleService.setTitle('Ventas MercadoLibre');
  }

  ngOnInit(): void {
    this.loadVentas();
  }

  loadVentas(): void {
    this.loading = true;
    this.spinner.show();

    let url = `${ApiRequest.getVentasMl}?page=${this.currentPage}&limit=${this.limit}`;
    if (this.filtroAsociada) {
      url += `&asociada=${this.filtroAsociada}`;
    }

    this.api.get(url).subscribe({
      next: (resp: any) => {
        this.spinner.hide();
        this.loading = false;
        if (resp.serverResponseCode === 200) {
          this.ventas = resp.data;
          this.total = resp.total;
          this.totalPages = resp.totalPages;
        } else {
          this.alertSV.alertBasic('Error', resp.serverResponseMessage, 'error');
        }
      },
      error: () => {
        this.spinner.hide();
        this.loading = false;
        this.alertSV.alertBasic('Error', 'No se pudieron cargar las ventas ML', 'error');
      },
    });
  }

  syncSales(): void {
    this.syncing = true;
    this.spinner.show();

    this.api.get(ApiRequest.syncSalesMl).subscribe({
      next: (resp: any) => {
        this.spinner.hide();
        this.syncing = false;
        if (resp.serverResponseCode === 200) {
          this.alertSV.alertBasic(
            'Sincronización completada',
            `Total: ${resp.data.total}, Nuevas: ${resp.data.nuevas}, Actualizadas: ${resp.data.actualizadas}`,
            'success',
          );
          this.loadVentas();
        } else {
          this.alertSV.alertBasic('Error', resp.serverResponseMessage, 'error');
        }
      },
      error: () => {
        this.spinner.hide();
        this.syncing = false;
        this.alertSV.alertBasic('Error', 'No se pudieron sincronizar las ventas', 'error');
      },
    });
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'paid': return 'badge-success';
      case 'delivered': return 'badge-primary';
      case 'cancelled': return 'badge-danger';
      case 'confirmed': return 'badge-info';
      case 'not_delivered': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'paid': return 'Pagada';
      case 'delivered': return 'Entregada';
      case 'cancelled': return 'Cancelada';
      case 'confirmed': return 'Confirmada';
      case 'not_delivered': return 'No entregada';
      default: return estado;
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(value);
  }

  formatDate(date: Date): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadVentas();
  }

  onFiltroChange(): void {
    this.currentPage = 1;
    this.loadVentas();
  }
}
