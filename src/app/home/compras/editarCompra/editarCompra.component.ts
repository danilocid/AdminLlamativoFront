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
  styleUrls: ['./editarCompra.component.css'],
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
    this.getTipoCompra();
  }

  ngOnChanges() {
    if (this.compra) {
      this.compraForm.patchValue({
        tipo: this.compra.tipo_compra,
        monto_total:
          this.compra.monto_imp_documento + this.compra.monto_neto_documento,
        costo_total:
          this.compra.costo_imp_documento + this.compra.costo_neto_documento,
        observaciones: this.compra.observaciones,
      });
      this.proveedor = this.compra.nombre;
      this.tipoDocumento = this.compra.tipo;
      this.numeroDocumento = this.compra.documento;
    }
  }
  getTipoCompra() {
    this.apiService = new ApiService(this.http);
    this.apiService
      .getService(ApiRequest.getComprasTipo)
      .subscribe((res: any) => {
        this.tiposCompra = res.tipos;
        //console.log(this.tiposCompra);
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
        id: this.compra.id,
        tipo: +this.compraForm.get('tipo')?.value,
        monto_total: this.compraForm.get('monto_total')?.value,
        costo_total: this.compraForm.get('costo_total')?.value,
        observaciones: this.compraForm.get('observaciones')?.value,
      };
      //console.log(compra);

      this.apiService = new ApiService(this.http);
      this.apiService
        .postService(ApiRequest.updateCompra, compra)
        .subscribe((res: any) => {
          //console.log(res);
          if (res.ok === true) {
            this.spinner.hide();
            this.as.alertBasic('Exito', res.msg, 'success');
            setTimeout(() => {
              this.cerrarModal();
            }, 2000);
          } else {
            this.spinner.hide();
            this.as.alertBasic('Error', res.msg, 'error');
          }
        });
    }
  }
}
