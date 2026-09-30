import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DocumentType } from 'src/app/shared/models/documentType.model';
import { PaymentMethod } from 'src/app/shared/models/paymentMethod.model';
import { Entidad } from 'src/app/shared/models/entidad.model';

@Component({
  standalone: false,
  selector: 'app-asociar-venta-ml',
  templateUrl: './asociar-venta-ml.component.html',
  styleUrls: [],
})
export class AsociarVentaMlComponent implements OnInit {
  @Input() ventaMl: any;
  @Output() onClose = new EventEmitter<void>();
  @Output() onAsociada = new EventEmitter<void>();

  form: FormGroup;
  documentTypes: DocumentType[] = [];
  clients: Entidad[] = [];
  medioDePago: PaymentMethod[] = [];
  systemProducts: any[] = [];
  allProducts: any[] = [];
  productosSinSku: any[] = [];
  productoMapping: { [key: string]: number } = {};
  procesando = false;

  constructor(
    private readonly fb: FormBuilder,
    readonly spinner: NgxSpinnerService,
    readonly api: ApiService,
    readonly alertSV: AlertService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id_cliente: [null, Validators.required],
      id_medio_pago: [null, Validators.required],
      id_tipo_documento: [null, Validators.required],
      numero_documento: [1, Validators.required],
    });
    this.identificarProductosSinSku();
    this.loadData();
  }

  identificarProductosSinSku(): void {
    if (!this.ventaMl?.detalles) return;
    const seen = new Set();
    for (const detalle of this.ventaMl.detalles) {
      if (Array.isArray(detalle.productos)) {
        for (const prod of detalle.productos) {
          if (!prod.sku && !seen.has(prod.titulo)) {
            seen.add(prod.titulo);
            this.productosSinSku.push(prod);
          }
        }
      }
    }
  }

  loadData(): void {
    this.spinner.show();
    let loaded = 0;
    const total = 4;

    const checkDone = () => {
      loaded++;
      if (loaded === total) {
        this.spinner.hide();
      }
    };

    this.api.get(ApiRequest.getEntities + '?t=c').subscribe({
      next: (resp: any) => {
        this.clients = resp.data?.entities || resp.data || [];
        checkDone();
      },
      error: () => checkDone(),
    });

    this.api.get(ApiRequest.getTipoDocumento).subscribe({
      next: (resp: any) => {
        this.documentTypes = resp.data || [];
        this.documentTypes.forEach((docType) => {
          docType.lastEmited =
            resp.lastDocumentType?.find(
              (ld: any) => ld.documentType === docType.id,
            )?.lastDocument || 0;
        });
        checkDone();
      },
      error: () => checkDone(),
    });

    this.api.get(ApiRequest.getMedioPago).subscribe({
      next: (resp: any) => {
        this.medioDePago = resp.data || [];
        const mp = this.medioDePago.find((m: any) =>
          m.medio_de_pago?.toLowerCase().includes('mercado pago'),
        );
        if (mp) {
          this.form.controls['id_medio_pago'].setValue(mp.id);
        }
        checkDone();
      },
      error: () => checkDone(),
    });

    this.api.get(ApiRequest.getArticulos + '?all=true').subscribe({
      next: (resp: any) => {
        this.allProducts = resp.data?.products || resp.data || [];
        this.systemProducts = this.allProducts;
        checkDone();
      },
      error: () => checkDone(),
    });
  }

  filterProducts(term: string): void {
    if (!term) {
      this.systemProducts = this.allProducts;
      return;
    }
    const lower = term.toLowerCase();
    this.systemProducts = this.allProducts.filter(
      (p) =>
        p.descripcion?.toLowerCase().includes(lower) ||
        p.cod_interno?.toLowerCase().includes(lower) ||
        p.cod_barras?.toLowerCase().includes(lower),
    );
  }

  onProductSelect(titulo: string, productId: number): void {
    this.productoMapping[titulo] = productId;
  }

  changeDocumentType(): void {
    const docTypeId = this.form.value.id_tipo_documento;
    const docType = this.documentTypes.find((d) => d.id === +docTypeId);
    if (docType) {
      this.form.controls['numero_documento'].setValue(docType.lastEmited + 1);
    }
  }

  asociar(): void {
    if (!this.form.value.id_tipo_documento) {
      this.alertSV.alertBasic('Aviso', 'Debe seleccionar un tipo de documento', 'info');
      return;
    }
    if (!this.form.value.numero_documento) {
      this.alertSV.alertBasic('Aviso', 'Debe ingresar el número de documento', 'info');
      return;
    }
    if (!this.form.value.id_cliente) {
      this.alertSV.alertBasic('Aviso', 'Debe seleccionar un cliente', 'info');
      return;
    }
    if (!this.form.value.id_medio_pago) {
      this.alertSV.alertBasic('Aviso', 'Debe seleccionar un medio de pago', 'info');
      return;
    }

    for (const prod of this.productosSinSku) {
      if (!this.productoMapping[prod.titulo]) {
        this.alertSV.alertBasic(
          'Aviso',
          `Debe seleccionar el producto para "${prod.titulo}" (no tiene SKU)`,
          'info',
        );
        return;
      }
    }

    this.procesando = true;
    this.spinner.show();

    const dto = {
      venta_ml_id: this.ventaMl.id,
      tipo_documento: +this.form.value.id_tipo_documento,
      documento: +this.form.value.numero_documento,
      cliente: this.form.value.id_cliente,
      medio_pago: +this.form.value.id_medio_pago,
      producto_mapping: this.productosSinSku.length > 0 ? this.productoMapping : undefined,
    };

    this.api.post(ApiRequest.asociarVentaMl, dto).subscribe({
      next: (resp: any) => {
        this.spinner.hide();
        this.procesando = false;
        if (resp.serverResponseCode === 200) {
          this.alertSV.alertBasic(
            'Asociada',
            `Venta ML asociada a la venta #${resp.data.venta_id} del sistema`,
            'success',
          );
          this.onAsociada.emit();
          this.cerrar();
        } else {
          this.alertSV.alertBasic('Error', resp.serverResponseMessage, 'error');
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.procesando = false;
        const msg = err.error?.serverResponseMessage || 'Error al asociar la venta';
        this.alertSV.alertBasic('Error', msg, 'error');
      },
    });
  }

  cerrar(): void {
    this.onClose.emit();
  }

  formatCurrency(value: number): string {
    if (!value) return '$0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(value);
  }
}
