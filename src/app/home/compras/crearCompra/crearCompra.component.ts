import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-crear-compra',
  templateUrl: './crearCompra.component.html',
})
export class CrearCompraComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Output() onClose = new EventEmitter<boolean>();

  compraForm!: FormGroup;
  proveedores: any[] = [];
  tiposCompra: any[] = [];
  tiposDocumento: any[] = [];

  constructor(
    readonly fb: FormBuilder,
    readonly spinner: NgxSpinnerService,
    readonly api: ApiService,
    readonly as: AlertService,
  ) {}

  ngOnInit() {
    this.compraForm = this.fb.group({
      proveedor: ['', [Validators.required]],
      tipo_documento: ['', [Validators.required]],
      documento: ['', [Validators.required, Validators.min(1)]],
      fecha_documento: ['', [Validators.required]],
      monto_neto: [0, [Validators.required, Validators.min(0)]],
      monto_imp: [0, [Validators.required, Validators.min(0)]],
      costo_neto: [0, [Validators.required, Validators.min(0)]],
      costo_imp: [0, [Validators.required, Validators.min(0)]],
      tipo_compra: ['', [Validators.required]],
      observaciones: [''],
    });
  }

  ngOnChanges() {
    if (this.show) {
      this.loadData();
    }
  }

  loadData() {
    this.spinner.show();
    let loaded = 0;
    const total = 3;
    const done = () => {
      loaded++;
      if (loaded >= total) this.spinner.hide();
    };

    this.api.get(ApiRequest.getProveedores).subscribe({
      next: (res: any) => {
        this.proveedores = res.data;
        done();
      },
      error: () => done(),
    });

    this.api.get(ApiRequest.getComprasTipo).subscribe({
      next: (res: any) => {
        this.tiposCompra = res.data;
        done();
      },
      error: () => done(),
    });

    this.api.get(ApiRequest.getTipoDocumento).subscribe({
      next: (res: any) => {
        this.tiposDocumento = res.data;
        done();
      },
      error: () => done(),
    });
  }

  calcularImpuesto(campo: 'monto' | 'costo') {
    const netoField = campo === 'monto' ? 'monto_neto' : 'costo_neto';
    const impField = campo === 'monto' ? 'monto_imp' : 'costo_imp';
    const neto = +this.compraForm.get(netoField)?.value || 0;
    this.compraForm.get(impField)?.setValue(Math.round(neto * 0.19));
  }

  get montoTotal(): number {
    const neto = +this.compraForm.get('monto_neto')?.value || 0;
    const imp = +this.compraForm.get('monto_imp')?.value || 0;
    return neto + imp;
  }

  get costoTotal(): number {
    const neto = +this.compraForm.get('costo_neto')?.value || 0;
    const imp = +this.compraForm.get('costo_imp')?.value || 0;
    return neto + imp;
  }

  isValidField(field: string) {
    return (
      this.compraForm.get(field)?.touched && this.compraForm.get(field)?.invalid
    );
  }

  cerrarModal() {
    this.show = false;
    this.compraForm?.reset();
    this.onClose.emit(true);
  }

  submit() {
    this.compraForm.markAllAsTouched();
    if (this.compraForm.invalid) {
      return;
    }

    this.spinner.show();
    const formValue = this.compraForm.value;
    const body = {
      proveedor: formValue.proveedor,
      tipo_documento: +formValue.tipo_documento,
      documento: +formValue.documento,
      fecha_documento: formValue.fecha_documento,
      monto_neto_documento: +formValue.monto_neto,
      monto_imp_documento: +formValue.monto_imp,
      costo_neto_documento: +formValue.costo_neto,
      costo_imp_documento: +formValue.costo_imp,
      tipo_compra: +formValue.tipo_compra,
      observaciones: formValue.observaciones || '',
    };

    this.api.post(ApiRequest.createCompra, body).subscribe({
      next: () => {
        this.spinner.hide();
        this.as.alertBasic(
          'Éxito',
          'Compra registrada correctamente',
          'success',
        );
        this.cerrarModal();
      },
      error: (err) => {
        this.spinner.hide();
        this.as.alertBasic(
          'Error',
          err.error?.message || 'Error al registrar la compra',
          'error',
        );
      },
    });
  }
}
