import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, ProductCart } from 'src/app/shared/models/product.model';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Subject, debounceTime } from 'rxjs';
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
  params = {};
  stock = false;
  searchTerm: Subject<string> = new Subject<string>();
  productTmp: ProductCart;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService
  ) {
    this.initializeSearch();
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      // eslint-disable-next-line no-sparse-arrays
      id: [, Validators.required],
      quantity: [1, Validators.required],
      price: [0, Validators.required],
    });
    if (this.type === 'venta') {
      this.stock = true;
    }
    this.params = this.params + '&all=true';
    this.getProducts('');
  }
  initializeSearch() {
    this.searchTerm.pipe(debounceTime(500)).subscribe((term) => {
      this.getProducts(term);
    });
  }
  getProducts(term: string) {
    this.spinner.show();
    this.apiService = new ApiService(this.http);
    this.params = {
      stock: this.stock,
      param: term ? term : '',
    };
    this.apiService
      .getServiceWithParams(ApiRequest.getArticulos, this.params)
      .subscribe({
        next: (resp) => {
          this.products = resp.data;
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
        },
      });
  }
  onSearch(term: string): void {
    this.searchTerm.next(term);
  }

  addProduct() {
    if (this.type === 'venta') {
      if (this.productTmp) {
        let quantity = this.productForm.value.quantity;
        if (quantity > this.productTmp.stock) {
          quantity = this.productTmp.stock;
        }
        //get the price with tax, from the form, and split it on two variables, netSale and taxSale (taxSale = 19% of price)
        const price = this.productForm.value.price;
        const taxSale = price * 0.19;
        const netSale = price - taxSale;

        const productCart = {
          ...this.productTmp,
          venta_neto: netSale,
          venta_imp: taxSale,
          quantity: quantity,
        };
        this.productChange.emit(productCart);
      }
    } else {
      if (this.productTmp) {
        const quantity = this.productForm.value.quantity;
        //get the price with tax, from the form, and split it on two variables, netSale and taxSale (taxSale = 19% of price)
        const price = this.productForm.value.price;
        const netCost = price / 1.19;
        const taxCost = price - netCost;

        const productCart = {
          ...this.productTmp,
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
    this.productTmp = {
      ...this.products.find(
        (product) => product.id === this.productForm.value.id
      ),
      quantity: this.productForm.value.quantity,
    };

    if (this.productTmp) {
      if (this.type === 'venta') {
        this.productForm.controls['price'].setValue(
          this.productTmp.venta_imp + this.productTmp.venta_neto
        );
      } else {
        this.productForm.controls['price'].setValue(
          this.productTmp.costo_imp + this.productTmp.costo_neto
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
