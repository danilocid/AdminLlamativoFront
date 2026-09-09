import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';

@Component({
  standalone: false,
  selector: 'app-ver-ventas-ml',
  templateUrl: './ver-ventas-ml.component.html',
  styleUrls: [],
})
export class VerVentasMlComponent implements OnInit {
  venta: any = null;
  loading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly api: ApiService,
  ) {
    this.titleService.setTitle('Detalle Venta ML');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVenta(+id);
    }
  }

  loadVenta(id: number): void {
    this.loading = true;
    this.spinner.show();

    this.api.get(`${ApiRequest.getVentaMlById}/${id}`).subscribe({
      next: (resp: any) => {
        this.spinner.hide();
        this.loading = false;
        if (resp.serverResponseCode === 200) {
          this.venta = resp.data;
        } else {
          this.router.navigate(['/home/mercado-libre/ventas-ml']);
        }
      },
      error: () => {
        this.spinner.hide();
        this.loading = false;
        this.router.navigate(['/home/mercado-libre/ventas-ml']);
      },
    });
  }

  countProductos(): number {
    if (!this.venta?.detalles || !Array.isArray(this.venta.detalles)) return 0;
    return this.venta.detalles.reduce((sum: number, d: any) => {
      return sum + (Array.isArray(d.productos) ? d.productos.length : 0);
    }, 0);
  }

  countOrdenes(): number {
    return this.venta?.detalles?.length || 0;
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

  volver(): void {
    this.router.navigate(['/home/mercado-libre/ventas-ml']);
  }
}
