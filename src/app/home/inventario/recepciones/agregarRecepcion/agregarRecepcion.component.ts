import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Product, ProductCart } from 'src/app/shared/models/product.model';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-agregar-recepcion',
  templateUrl: './agregarRecepcion.component.html',
  styleUrls: ['./agregarRecepcion.component.css'],
})
export class AgregarRecepcionComponent {
  products: Product[] = [];
  productsCart: ProductCart[] = [];
  sidePanel = 'Productos';
  total = 0;

  constructor(readonly titleService: Title, readonly alertSV: AlertService) {
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
