import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/shared/models/product.model';

@Component({
  selector: 'app-conteo-aleatorio',
  templateUrl: './conteo-aleatorio.component.html',
  styleUrls: [],
})
export class ConteoAleatorioComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  submitting = false;
  countForm: FormGroup;
  lastResult: {
    adjustmentCreated: boolean;
    diff: number;
    message: string;
  } | null = null;

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly api: ApiService,
    readonly fb: FormBuilder,
  ) {
    this.titleService.setTitle('Conteo Aleatorio');
  }

  ngOnInit(): void {
    this.countForm = this.fb.group({
      stock_counted: [null, [Validators.required, Validators.min(0)]],
    });
    this.loadNextProduct();
  }

  loadNextProduct(): void {
    this.loading = true;
    this.lastResult = null;
    this.countForm.reset();
    this.spinner.show();

    this.api.get(ApiRequest.getRandomCount).subscribe({
      next: (resp: any) => {
        this.spinner.hide();
        this.loading = false;
        if (resp.serverResponseCode === 200) {
          this.product = resp.data;
        } else {
          this.product = null;
          this.alertSV.alertBasic(
            'Sin productos',
            resp.serverResponseMessage,
            'info',
          );
        }
      },
      error: () => {
        this.spinner.hide();
        this.loading = false;
        this.alertSV.alertBasic(
          'Error',
          'No se pudo obtener el producto',
          'error',
        );
      },
    });
  }

  submit(): void {
    if (this.countForm.invalid || !this.product) return;

    const stockCounted: number = +this.countForm.value.stock_counted;
    const diff = stockCounted - this.product.stock;

    this.submitting = true;
    this.spinner.show();

    this.api
      .post(ApiRequest.postRandomCount, {
        product_id: this.product.id,
        stock_counted: stockCounted,
      })
      .subscribe({
        next: (resp: any) => {
          this.spinner.hide();
          this.submitting = false;
          if (resp.serverResponseCode === 200) {
            this.lastResult = {
              adjustmentCreated: resp.adjustmentCreated,
              diff,
              message: resp.serverResponseMessage,
            };
            this.product = null;
            this.countForm.reset();
          } else {
            this.alertSV.alertBasic(
              'Error',
              resp.serverResponseMessage,
              'error',
            );
          }
        },
        error: () => {
          this.spinner.hide();
          this.submitting = false;
          this.alertSV.alertBasic(
            'Error',
            'No se pudo registrar el conteo',
            'error',
          );
        },
      });
  }

  skip(): void {
    this.loadNextProduct();
  }
}
