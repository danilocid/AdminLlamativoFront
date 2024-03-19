import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Product, ProductCart } from 'src/app/shared/models/product.model';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css'],
})
export class CrearComponent implements OnInit {
  productForm: FormGroup;
  products: Product[] = [];
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
    this.titleService.setTitle('Agregar venta');
  }

  ngOnInit() {
    this.titleService.setTitle('Agregar venta');
  }
  addProduct(product: ProductCart) {
    let quantity = product.quantity;
    if (quantity > product.stock) {
      quantity = product.stock;
    }
    const productCart = this.productsCart.find(
      (p) => p.id.toString() === product.id.toString()
    );
    if (productCart) {
      if (productCart.quantity + product.quantity <= product.stock) {
        productCart.quantity += product.quantity;
      } else {
        productCart.quantity = product.stock;
      }
    } else {
      this.productsCart.push({
        ...product,
        quantity: quantity,
      });
    }
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
      '¿Está seguro que desea cancelar la venta?',
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
      this.total += (p.venta_neto + p.venta_imp) * p.quantity;
    });
  }

  changeFunctionalityToPayment() {
    if (this.productsCart.length > 0) {
      this.sidePanel = 'Pago';
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
