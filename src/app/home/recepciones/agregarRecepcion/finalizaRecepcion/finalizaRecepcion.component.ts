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
  selector: 'app-finaliza-recepcion',
  templateUrl: './finalizaRecepcion.component.html',
  styleUrls: ['./finalizaRecepcion.component.css'],
})
export class FinalizaRecepcionComponent implements OnInit {
  clientForm: FormGroup;
  private apiService!: ApiService;
  clients: Entidad[] = [];
  documentTypes: DocumentType[] = [];
  medioDePago: PaymentMethod[] = [];

  @Input() productsCart: ProductCart[] = [];

  constructor(
    readonly fb: FormBuilder,
    readonly http: HttpClient,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly router: Router
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.clientForm = this.fb.group({
      id_cliente: ['Buscar proveedor', Validators.required],
      id_medio_pago: ['Medio de pago', Validators.required],
      id_tipo_documento: ['Tipo documento', Validators.required],
      numero_documento: ['1', Validators.required],
    });
    this.apiService = new ApiService(this.http);

    this.apiService.getService(ApiRequest.getEntities + '?t=p').subscribe({
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
    if (this.clientForm.value.id_cliente === 'Buscar cliente') {
      this.alertSV.alertBasic('Aviso', 'Debe seleccionar un cliente', 'info');
      return;
    } else if (this.clientForm.value.id_medio_pago === 'Medio de pago') {
      this.alertSV.alertBasic(
        'Aviso',
        'Debe seleccionar un medio de pago',
        'info'
      );
      return;
    } else if (this.clientForm.value.id_tipo_documento === 'Tipo documento') {
      this.alertSV.alertBasic(
        'Aviso',
        'Debe seleccionar un tipo de documento',
        'info'
      );
      return;
    } else {
      let costo_neto = 0;
      let costo_imp = 0;
      let totalUnits = 0;
      //calculo de montos
      this.productsCart.forEach((element) => {
        costo_neto += Math.round(element.costo_neto) * element.quantity;
        costo_imp += Math.round(element.costo_imp) * element.quantity;
        totalUnits += element.quantity;
      });
      const saleDetail = [];
      this.productsCart.forEach((element) => {
        saleDetail.push({
          id: element.id,
          unidades: element.quantity,
          costo_neto: Math.round(element.costo_neto),
          costo_imp: Math.round(element.costo_imp),
        });
      });
      this.apiService
        .postService(ApiRequest.getRecepciones, {
          rut: this.clientForm.value.id_cliente,
          medioDePagoId: +this.clientForm.value.id_medio_pago,
          tipoDocumento: +this.clientForm.value.id_tipo_documento,
          documento: +this.clientForm.value.numero_documento,
          products: saleDetail,
          totalCostoNeto: costo_neto,
          totalCostoImp: costo_imp,
          totalUnidades: totalUnits,
        })
        .subscribe({
          next: () => {
            this.spinner.hide();
            this.alertSV.alertBasic(
              'Aviso',
              'Recepcion generada correctamente',
              'success'
            );
            //this.router.navigate(['/recepciones']);
          },
          error: (error) => {
            this.spinner.hide();
            this.alertSV.alertBasic(
              'Error al generar la recepcion',
              error.error.msg,
              'error'
            );
          },
        });
    }
    //this.spinner.show();
  }
}
