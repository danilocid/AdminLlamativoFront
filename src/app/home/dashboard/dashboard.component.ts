import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
})
export class DashboardComponent implements OnInit {
  dasboardReport: any = {
    totalUnits: 0,
    totalCost: 0,
    totalSale: 0,
    totalProfit: 0,
    boleta: null,
  };
  private apiService!: ApiService;

  constructor(readonly titleService: Title, readonly http: HttpClient) {
    this.titleService.setTitle('Dashboard');
  }
  ngOnInit() {
    this.getDashboardReport();
  }

  getDashboardReport() {
    this.apiService = new ApiService(this.http);
    this.apiService.get(ApiRequest.dashboardReport).subscribe({
      next: (resp) => {
        this.dasboardReport = resp.data;
      },
    });
  }

  /** Fecha estimada para emitir la boleta 1000, o el motivo de no tenerla. */
  get fechaBoleta1000(): string {
    const boleta = this.dasboardReport?.boleta;
    if (!boleta) return '—';
    if (boleta.reached) return 'Alcanzada';
    if (!boleta.estimatedDate) return 'Sin datos';

    return new Date(boleta.estimatedDate).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /** Contexto que acompaña a la fecha: numero actual, faltantes y dias. */
  get detalleBoleta1000(): string {
    const boleta = this.dasboardReport?.boleta;
    if (!boleta) return 'Cargando...';
    if (boleta.reached) return `Boleta ${boleta.current} emitida`;

    const base = `Boleta ${boleta.current} de ${boleta.target} · faltan ${boleta.remaining}`;
    if (boleta.daysRemaining === null) return `${base} · sin historial`;

    return `${base} · ~${Math.round(boleta.daysRemaining)} días`;
  }
}
