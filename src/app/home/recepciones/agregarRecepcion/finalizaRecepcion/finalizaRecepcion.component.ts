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
  selector: 'app-finalizaRecepcion',
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
    private fb: FormBuilder,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService,
    private router: Router
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
        console.log(resp);
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
        console.log(resp);
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
        console.log(resp);
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
      var costo_neto = 0;
      var costo_imp = 0;
      var totalUnits = 0;
      //calculo de montos
      this.productsCart.forEach((element) => {
        costo_neto += element.costo_neto * element.quantity;
        costo_imp += element.costo_imp * element.quantity;
        totalUnits += element.quantity;
      });
      let saleDetail = [];
      this.productsCart.forEach((element) => {
        saleDetail.push({
          productId: element.id,
          quantity: element.quantity,
          netCost: element.costo_neto,
          taxCost: element.costo_imp,
        });
      });
      this.apiService
        .postService(ApiRequest.createRecepcion, {
          rut: this.clientForm.value.id_cliente,
          paymentMethodId: +this.clientForm.value.id_medio_pago,
          documentTypeId: +this.clientForm.value.id_tipo_documento,
          documentNumber: +this.clientForm.value.numero_documento,
          saleDetails: saleDetail,
          totalNetCost: costo_neto,
          totalTaxCost: costo_imp,
          totalUnits: totalUnits,
        })
        .subscribe({
          next: (resp) => {
            this.spinner.hide();
            this.alertSV.alertBasic(
              'Aviso',
              'Recepcion generada correctamente',
              'success'
            );
            this.router.navigate(['/recepciones']);
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
