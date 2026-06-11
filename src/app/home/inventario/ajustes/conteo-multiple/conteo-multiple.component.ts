import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { Product } from 'src/app/shared/models/product.model';

export interface BulkCountItem {
  product: Product;
  stockCounted: number;
}

@Component({
  standalone: false,
  selector: 'app-conteo-multiple',
  templateUrl: './conteo-multiple.component.html',
  styleUrls: [],
})
export class ConteoMultipleComponent implements OnInit {
  @ViewChild('skuInput') skuInput: ElementRef<HTMLInputElement>;

  items: BulkCountItem[] = [];
  skuValue = '';
  searching = false;
  submitting = false;
  lastResult: {
    adjustmentCreated: boolean;
    message: string;
    inventoryId: number | null;
  } | null = null;

  readonly MAX_ITEMS = 10;

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly api: ApiService,
  ) {
    this.titleService.setTitle('Conteo Múltiple');
  }

  ngOnInit(): void {}

  get canAddMore(): boolean {
    return this.items.length < this.MAX_ITEMS;
  }

  get canSubmit(): boolean {
    return (
      this.items.length > 0 && this.items.every((i) => i.stockCounted >= 0)
    );
  }

  onSkuKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.lookupSku();
    }
  }

  lookupSku(): void {
    const sku = this.skuValue.trim();
    if (!sku) return;

    if (!this.canAddMore) {
      this.alertSV.alertBasic(
        'Límite alcanzado',
        `Solo se pueden agregar hasta ${this.MAX_ITEMS} productos por conteo.`,
        'warning',
      );
      return;
    }

    // Si el producto ya está en la lista, incrementar su stock contado en 1
    const existing = this.items.find(
      (i) => i.product.cod_interno === sku || i.product.cod_barras === sku,
    );
    if (existing) {
      existing.stockCounted = (existing.stockCounted ?? 0) + 1;
      this.skuValue = '';
      setTimeout(() => this.skuInput?.nativeElement.focus(), 50);
      return;
    }

    this.searching = true;
    this.spinner.show();

    this.api
      .get(`${ApiRequest.lookupSku}?sku=${encodeURIComponent(sku)}`)
      .subscribe({
        next: (resp: any) => {
          this.spinner.hide();
          this.searching = false;
          if (resp.serverResponseCode === 200) {
            this.items.push({ product: resp.data, stockCounted: 1 });
            this.skuValue = '';
            setTimeout(() => this.skuInput?.nativeElement.focus(), 50);
          } else {
            this.alertSV.alertBasic(
              'No encontrado',
              resp.serverResponseMessage,
              'warning',
            );
            setTimeout(() => this.skuInput?.nativeElement.focus(), 50);
          }
        },
        error: () => {
          this.spinner.hide();
          this.searching = false;
          this.alertSV.alertBasic(
            'Error',
            'No se pudo buscar el producto.',
            'error',
          );
        },
      });
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  resetConteo(): void {
    this.items = [];
    this.skuValue = '';
    this.lastResult = null;
    setTimeout(() => this.skuInput?.nativeElement.focus(), 50);
  }

  submitCount(): void {
    if (!this.canSubmit) return;

    const payload = {
      items: this.items.map((i) => ({
        product_id: i.product.id,
        stock_counted: Number(i.stockCounted),
      })),
    };

    this.submitting = true;
    this.spinner.show();

    this.api.post(ApiRequest.postBulkCount, payload).subscribe({
      next: (resp: any) => {
        this.spinner.hide();
        this.submitting = false;
        this.lastResult = {
          adjustmentCreated: resp.data?.adjustmentCreated ?? false,
          message: resp.serverResponseMessage,
          inventoryId: resp.data?.inventoryId ?? null,
        };
        this.items = [];
        this.skuValue = '';
      },
      error: () => {
        this.spinner.hide();
        this.submitting = false;
        this.alertSV.alertBasic(
          'Error',
          'No se pudo procesar el conteo.',
          'error',
        );
      },
    });
  }
}
