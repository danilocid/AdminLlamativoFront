import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, ProductCart } from 'src/app/shared/models/product.model';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})
export class ProductoComponent implements OnInit {
  productForm: FormGroup;
  products: Product[] = [];
  private apiService!: ApiService;
  productsCart: ProductCart[] = [];
  @Output() productChange = new EventEmitter<ProductCart>();
  @Input() type = 'venta';
  params = '?stock=true';
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      id: ['Buscar producto', Validators.required],
      quantity: [1, Validators.required],
      price: [0, Validators.required],
    });
    if (this.type != 'venta') {
      this.params = '';
    }
    this.getProducts();
  }

  getProducts() {
    this.spinner.show();
    this.apiService = new ApiService(this.http);

    this.apiService
      .getService(ApiRequest.getArticulos + this.params)
      .subscribe({
        next: (resp) => {
          this.products = resp.result;
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
        },
      });
  }

  addProduct() {
    const product = this.products.find(
      (p) => p.id.toString() === this.productForm.value.id.toString()
    );
    if (this.type === 'venta') {
      if (product) {
        let quantity = this.productForm.value.quantity;
        if (quantity > product.stock) {
          quantity = product.stock;
        }
        //get the price with tax, from the form, and split it on two variables, netSale and taxSale (taxSale = 19% of price)
        const price = this.productForm.value.price;
        const taxSale = price * 0.19;
        const netSale = price - taxSale;

        const productCart = {
          ...product,
          venta_neto: netSale,
          venta_imp: taxSale,
          quantity: quantity,
        };
        this.productChange.emit(productCart);
      }
    } else {
      if (product) {
        const quantity = this.productForm.value.quantity;
        //get the price with tax, from the form, and split it on two variables, netSale and taxSale (taxSale = 19% of price)
        const price = this.productForm.value.price;
        const taxCost = price * 0.19;
        const netCost = price - taxCost;

        const productCart = {
          ...product,
          costo_neto: netCost,
          costo_imp: taxCost,
          quantity: quantity,
        };
        this.productChange.emit(productCart);
      }
    }
    this.productForm.controls['quantity'].setValue(1);
    this.productForm.controls['id'].setValue('Buscar producto');
    this.productForm.controls['price'].setValue(0);
  }
  onChangeProduct() {
    const product = this.products.find(
      (p) =>
        p.id.toString() === this.productForm.controls['id'].value.toString()
    );
    if (product) {
      if (this.type === 'venta') {
        this.productForm.controls['price'].setValue(
          product.venta_imp + product.venta_neto
        );
      } else {
        this.productForm.controls['price'].setValue(
          product.costo_imp + product.costo_neto
        );
      }
    }
  }
  addProductEnter(event: any) {
    if (event.keyCode === 13) {
      this.addProduct();
    }
  }
}
