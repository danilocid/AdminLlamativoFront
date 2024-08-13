import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-editar-compra',
  templateUrl: './editarCompra.component.html',
})
export class EditarCompraComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() compra: any;
  tipoDocumento: any = '';
  proveedor: any = '';
  numeroDocumento: any = '';
  compraForm!: FormGroup;
  tiposCompra: any[] = [];
  private apiService!: ApiService;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private as: AlertService
  ) {}

  ngOnInit() {
    //console.log(this.compra);
    this.spinner.show();
    this.compraForm = this.fb.group({
      tipo: [0],
      monto_total: [22990, [Validators.required, Validators.min(1)]],
      costo_total: ['', [Validators.required, Validators.min(0)]],
      observaciones: ['', [Validators.required, Validators.minLength(3)]],
    });
    //this.getTipoCompra();
  }

  ngOnChanges() {
    if (this.compra) {
      this.spinner.show();
      this.getTipoCompra();
      this.compraForm.patchValue({
        tipo: this.compra.tipo_compra.id,
        monto_total:
          this.compra.monto_imp_documento + this.compra.monto_neto_documento,
        costo_total:
          this.compra.costo_imp_documento + this.compra.costo_neto_documento,
        observaciones: this.compra.observaciones,
      });
      this.proveedor = this.compra.proveedor.nombre;
      this.tipoDocumento = this.compra.tipo_documento.tipo;
      this.numeroDocumento = this.compra.documento;
    }
  }
  getTipoCompra() {
    this.apiService = new ApiService(this.http);
    this.apiService
      .getService(ApiRequest.getComprasTipo)
      .subscribe((res: any) => {
        this.tiposCompra = res.data;
        this.spinner.hide();
      });
  }

  cerrarModal() {
    this.show = false;
    window.location.reload();
  }

  isValidField(field: string) {
    return (
      this.compraForm.get(field)?.touched && this.compraForm.get(field)?.invalid
    );
  }

  submit() {
    //marcar como tocados todos los campos
    this.compraForm.markAllAsTouched();
    if (this.compraForm.invalid) {
      return;
    } else {
      this.spinner.show();
      //console.log(this.compraForm.value);
      const compra = {
        TipoCompra: +this.compraForm.get('tipo')?.value,
        CostoTotal: this.compraForm.get('costo_total')?.value,
        Observaciones: this.compraForm.get('observaciones')?.value,
      };
      //console.log(compra);

      this.apiService = new ApiService(this.http);
      this.apiService
        .postService(ApiRequest.updateCompra + '/' + this.compra.id, compra)
        .subscribe({
          next: (resp) => {
            if (resp.status === 401 || resp.status === 403) {
              this.as.alertBasic('Error', 'No tienes permisos', 'error');
            }
            this.spinner.hide();
            this.as.alertBasic('Exito', 'Compra actualizada', 'success');
            setTimeout(() => {
              this.cerrarModal();
            }, 2500);
          },
          error: (err) => {
            this.as.alertBasic('Error', err.error.msg, 'error');
            this.spinner.hide();
          },
        });
    }
  }
}
