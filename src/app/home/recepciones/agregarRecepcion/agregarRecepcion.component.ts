import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Product, ProductCart } from 'src/app/shared/models/product.model';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-agregar-recepcion',
  templateUrl: './agregarRecepcion.component.html',
  styleUrls: ['./agregarRecepcion.component.css'],
})
export class AgregarRecepcionComponent {
  productForm: FormGroup;
  products: Product[] = [];
  private apiService!: ApiService;
  productsCart: ProductCart[] = [];
  sidePanel = 'Productos';
  total = 0;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService
  ) {
    this.titleService.setTitle('Agregar recepcion');
  }

  addProduct(product: ProductCart) {
    const quantity = product.quantity;

    this.productsCart.push({
      ...product,
      quantity: quantity,
    });

    this.calcTotal();
  }
  removeProduct(product: ProductCart) {
    this.productsCart = this.productsCart.filter(
      (p) => p.id.toString() !== product.id.toString()
    );
    this.calcTotal();
  }

  cancel() {
    this.alertSV.verificationAlertWithFunction(
      'Cancelar venta',
      '¿Está seguro que desea cancelar la recepcion?',
      'Si',
      'No',
      'warning',
      () => {
        window.location.reload();
      }
    );
  }
  calcTotal() {
    this.total = 0;
    this.productsCart.forEach((p) => {
      this.total += (p.costo_neto + p.costo_imp) * p.quantity;
    });
  }

  changeFunctionalityToPayment() {
    if (this.productsCart.length > 0) {
      this.sidePanel = 'Finalizar';
    } else {
      this.alertSV.alertBasic(
        'Alerta',
        'Debe agregar un producto al menos',
        'info'
      );
    }
  }
  canSell() {
    if (this.productsCart.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
