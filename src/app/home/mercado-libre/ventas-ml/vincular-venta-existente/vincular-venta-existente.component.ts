import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  standalone: false,
  selector: 'app-vincular-venta-existente',
  templateUrl: './vincular-venta-existente.component.html',
  styleUrls: [],
})
export class VincularVentaExistenteComponent implements OnInit {
  @Input() ventaMl: any;
  @Output() onClose = new EventEmitter<void>();
  @Output() onVinculada = new EventEmitter<void>();

  ventas: any[] = [];
  ventaSeleccionada: number | null = null;
  search = '';
  searching = false;
  procesando = false;

  constructor(
    readonly spinner: NgxSpinnerService,
    readonly api: ApiService,
    readonly alertSV: AlertService,
  ) {}

  ngOnInit(): void {
    this.loadVentas();
  }

  loadVentas(): void {
    this.searching = true;
    this.spinner.show();

    let url = `${ApiRequest.getSales}?page=1&order=fecha&sort=DESC&filtro=sin_ml`;
    if (this.search) {
      url += `&param=${this.search}`;
    }

    this.api.get(url).subscribe({
      next: (resp: any) => {
        this.spinner.hide();
        this.searching = false;
        if (resp.serverResponseCode === 200) {
          this.ventas = resp.data || [];
        }
      },
      error: () => {
        this.spinner.hide();
        this.searching = false;
      },
    });
  }

  onSearch(): void {
    this.loadVentas();
  }

  seleccionar(ventaId: number): void {
    this.ventaSeleccionada = ventaId;
  }

  vincular(): void {
    if (!this.ventaSeleccionada) {
      this.alertSV.alertBasic('Aviso', 'Debe seleccionar una venta', 'info');
      return;
    }

    this.procesando = true;
    this.spinner.show();

    const dto = {
      venta_ml_id: this.ventaMl.id,
      venta_id: this.ventaSeleccionada,
    };

    this.api.post(ApiRequest.vincularVentaExistente, dto).subscribe({
      next: (resp: any) => {
        this.spinner.hide();
        this.procesando = false;
        if (resp.serverResponseCode === 200) {
          this.alertSV.alertBasic(
            'Vinculada',
            `Venta ML vinculada a la venta #${resp.data.venta_id}`,
            'success',
          );
          this.onVinculada.emit();
          this.cerrar();
        } else {
          this.alertSV.alertBasic('Error', resp.serverResponseMessage, 'error');
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.procesando = false;
        const msg = err.error?.serverResponseMessage || 'Error al vincular la venta';
        this.alertSV.alertBasic('Error', msg, 'error');
      },
    });
  }

  cerrar(): void {
    this.onClose.emit();
  }

  formatCurrency(value: number): string {
    if (!value && value !== 0) return '$0';
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
}
