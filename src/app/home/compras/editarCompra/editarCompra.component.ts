import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  standalone: false,
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
  today = new Date();
  private apiService!: ApiService;

  constructor(
    readonly fb: FormBuilder,
    readonly http: HttpClient,
    readonly spinner: NgxSpinnerService,
    readonly as: AlertService
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
      .get(ApiRequest.getComprasTipo)
      .subscribe((res: any) => {
        this.tiposCompra = res.data;
        this.spinner.hide();
      });
  }

  cerrarModal() {
    this.show = false;
    window.location.reload();
  }

  printSummary() {
    this.today = new Date();
    const printContent = document.getElementById('resumen-compra-print');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Resumen de Compra - ${this.compra?.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; height: 100vh; margin: 0; position: relative; }
            .summary-container { position: absolute; bottom: 80px; right: 40px; width: 320px; border: 1px solid #ccc; padding: 15px; background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .summary-header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #1a73e8; padding-bottom: 10px; background: #1a73e8; color: white; border-radius: 4px 4px 0 0; margin: -15px -15px 15px -15px; padding: 12px 15px; }
            .summary-header h4 { margin: 0; font-size: 16px; font-weight: bold; }
            .summary-table { width: 100%; border-collapse: collapse; }
            .summary-table tr { border-bottom: 1px solid #e0e0e0; }
            .summary-table tr:last-child { border-bottom: none; }
            .summary-label { font-weight: bold; padding: 8px 10px; width: 40%; background-color: #f0f4f8; color: #333; }
            .summary-value { padding: 8px 10px; color: #555; }
            .print-date { text-align: right; font-size: 10px; color: #888; margin-top: 10px; border-top: 1px solid #e0e0e0; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="summary-container">
            ${printContent.innerHTML}
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
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
        .post(ApiRequest.updateCompra + '/' + this.compra.id, compra)
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
