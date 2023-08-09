import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.productForm = this.fb.group({
      id: ['Buscar producto', Validators.required],
      quantity: [1, Validators.required],
    });
    this.apiService = new ApiService(this.http);

    this.apiService.getService(ApiRequest.getArticulosConStock).subscribe({
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
    if (product) {
      var quantity = this.productForm.value.quantity;
      if (quantity > product.stock) {
        quantity = product.stock;
      }
      this.productChange.emit({
        ...product,
        quantity: quantity,
      });
      /* const productCart = this.productsCart.find(
        (p) => p.id.toString() === this.productForm.value.id.toString()
      );
      if (productCart) {
        productCart.quantity += this.productForm.value.quantity;
      } else {
        this.productsCart.push({
          ...product,
          quantity: this.productForm.value.quantity,
        });
      } */
    }
    this.productForm.controls['quantity'].setValue(1);
    this.productForm.controls['id'].setValue('Buscar producto');
  }
  addProductEnter(event: any) {
    if (event.keyCode === 13) {
      this.addProduct();
    }
  }
}