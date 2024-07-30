import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Entidad } from '../../../../shared/models/entidad.model';
import { Router } from '@angular/router';
import { ProductCart } from 'src/app/shared/models/product.model';
import { DocumentType } from 'src/app/shared/models/documentType.model';
import { PaymentMethod } from 'src/app/shared/models/paymentMethod.model';

@Component({
  selector: 'app-finaliza-venta',
  templateUrl: './finaliza-venta.component.html',
  styleUrls: ['./finaliza-venta.component.css'],
})
export class FinalizaVentaComponent implements OnInit {
  clientForm: FormGroup;
  private apiService!: ApiService;
  clients: Entidad[] = [];
  documentTypes: DocumentType[] = [];
  medioDePago: PaymentMethod[] = [];

  @Input() productsCart: ProductCart[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.clientForm = this.fb.group({
      id_cliente: ['Buscar cliente', Validators.required],
      id_medio_pago: ['Medio de pago', Validators.required],
      id_tipo_documento: ['Tipo documento', Validators.required],
      numero_documento: ['1', Validators.required],
    });
    this.loadData();
  }

  changeDocumentType() {
    const documentType = this.clientForm.value.id_tipo_documento;
    const lastEmited = this.documentTypes.find(
      (document) => document.id === +documentType
    )?.lastEmited;
    this.clientForm.controls['numero_documento'].setValue(lastEmited + 1);
  }

  loadData() {
    this.spinner.show();
    this.apiService = new ApiService(this.http);

    this.apiService.getService(ApiRequest.getEntities + '?t=c').subscribe({
      next: (resp) => {
        this.clients = resp.data;
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      },
    });

    this.apiService.getService(ApiRequest.getTipoDocumento).subscribe({
      next: (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.documentTypes = resp.data;
        // get the last emitted number for each document type from lastDocumentType on the response
        this.documentTypes.forEach((documentType) => {
          documentType.lastEmited =
            resp.lastDocumentType.find(
              (lastDocumentType) =>
                lastDocumentType.documentType === documentType.id
            )?.lastDocument || 0;
        });
        this.spinner.hide();
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      },
    });
    this.apiService.getService(ApiRequest.getMedioPago).subscribe({
      next: (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.medioDePago = resp.data;
        this.spinner.hide();
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      },
    });
  }

  generarVenta() {
    this.spinner.show();

    if (this.clientForm.value.id_cliente === 'Buscar cliente') {
      this.spinner.hide();
      this.alertSV.alertBasic('Aviso', 'Debe seleccionar un cliente', 'info');
      return;
    } else if (this.clientForm.value.id_medio_pago === 'Medio de pago') {
      this.spinner.hide();
      this.alertSV.alertBasic(
        'Aviso',
        'Debe seleccionar un medio de pago',
        'info'
      );
      return;
    } else if (this.clientForm.value.id_tipo_documento === 'Tipo documento') {
      this.spinner.hide();
      this.alertSV.alertBasic(
        'Aviso',
        'Debe seleccionar un tipo de documento',
        'info'
      );
      return;
    } else {
      let monto_neto = 0;
      let monto_imp = 0;
      let costo_neto = 0;
      let costo_imp = 0;
      //calculo de montos
      this.productsCart.forEach((element) => {
        monto_neto += element.venta_neto * element.quantity;
        monto_imp += element.venta_imp * element.quantity;
        costo_neto += element.costo_neto * element.quantity;
        costo_imp += element.costo_imp * element.quantity;
      });
      const saleDetail = [];
      this.productsCart.forEach((element) => {
        saleDetail.push({
          articulo: element.id,
          cantidad: element.quantity,
          precio_neto: element.venta_neto,
          precio_imp: element.venta_imp,
          costo_neto: element.costo_neto,
          costo_imp: element.costo_imp,
        });
      });
      this.apiService
        .postService(ApiRequest.getSales, {
          cliente: this.clientForm.value.id_cliente,
          medio_pago: +this.clientForm.value.id_medio_pago,
          tipo_documento: +this.clientForm.value.id_tipo_documento,
          documento: +this.clientForm.value.numero_documento,
          productos: saleDetail,
          monto_neto,
          monto_imp,
          costo_neto,
          costo_imp,
        })
        .subscribe({
          next: () => {
            this.spinner.hide();
            this.alertSV.alertBasic(
              'Aviso',
              'Venta generada correctamente',
              'success'
            );
            this.router.navigate(['/ventas']);
          },
          error: (error) => {
            this.spinner.hide();
            this.alertSV.alertBasic(
              'Error al generar la venta',
              error.error.msg,
              'error'
            );
          },
        });
    }
    //this.spinner.show();
  }
}
