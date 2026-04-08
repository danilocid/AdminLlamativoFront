import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { debounceTime, Subject } from 'rxjs';
import { ProductInventory } from '../../../../shared/models/productInventory.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/shared/models/product.model';
import { MovementType } from 'src/app/shared/models/inventory.model';
import { TableColumn } from 'src/app/shared/components/simple-table/simple-table.component';

@Component({
  selector: 'app-new-inventory',
  templateUrl: './newInventory.component.html',
  styleUrls: [],
})
export class NewInventoryComponent implements OnInit, OnDestroy {
  productsInventory: ProductInventory[] = [];
  products: Product[] = [];
  movementTypes: MovementType[] = [];
  date = new Date();
  productForm: FormGroup;
  movementForm: FormGroup;

  columns: TableColumn[] = [
    { key: 'id', label: 'Id', sortable: true },
    { key: 'descripcion', label: 'Descripcion', sortable: true },
    {
      key: 'costo',
      label: 'Costo',
      sortable: true,
      format: (value: any, row: ProductInventory) =>
        new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          maximumFractionDigits: 0,
        }).format(row.costo_neto + row.costo_imp),
    },
    { key: 'entradas', label: 'Entradas', sortable: true, type: 'number' },
    { key: 'salidas', label: 'Salidas', sortable: true, type: 'number' },
  ];

  newProduct: ProductInventory = {
    id: 0,
    entradas: 0,
    salidas: 0,
    costo_neto: 0,
    costo_imp: 0,
    descripcion: '',
  };
  searchTerm: Subject<string> = new Subject<string>();

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly router: Router,
    readonly alertSV: AlertService,
    readonly api: ApiService,
    readonly fb: FormBuilder,
  ) {
    this.titleService.setTitle('Articulos');
    this.spinner.show();
    this.initializeSearch();
  }

  ngOnInit() {
    this.getProducts('');
    this.productForm = this.fb.group({
      id: ['Buscar producto', [Validators.required]],
      type: ['1', [Validators.required]],
      quantity: [1, [Validators.required]],
    });
    this.movementForm = this.fb.group({
      movementType: ['4', [Validators.required]],
      obs: ['', [Validators.required]],
    });

    this.api.get(ApiRequest.getMovimientos).subscribe({
      next: (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.movementTypes = resp.data;
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
  initializeSearch() {
    this.searchTerm.pipe(debounceTime(500)).subscribe((term) => {
      this.getProducts(term);
    });
  }
  onSearch(term: string): void {
    this.searchTerm.next(term);
  }
  getProducts(term: string) {
    this.spinner.show();
    const params = {
      param: term ? term : '',
    };
    this.api.getWithParams(ApiRequest.getArticulos, params).subscribe({
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
  saveInventory() {
    if (this.productsInventory.length === 0) {
      this.alertSV.alertBasic(
        'Error',
        'No hay productos para guardar',
        'warning',
      );
      return;
    }
    let entradas = 0;
    let salidas = 0;
    let costo_neto = 0;
    let costo_imp = 0;
    this.productsInventory.forEach((element) => {
      if (element.entradas > 0) {
        entradas += element.entradas;
      }
      if (element.salidas > 0) {
        salidas += element.salidas;
      }
      costo_neto += element.costo_neto;
      costo_imp += element.costo_imp;
    });
    const body = {
      articulos: this.productsInventory,
      tipo_movimiento: +this.movementForm.value.movementType,
      obs: this.movementForm.value.obs,
      entradas,
      salidas,
      costo_neto,
      costo_imp,
    };

    this.spinner.hide();
    this.api.post(ApiRequest.getAllInventory, body).subscribe({
      next: (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.spinner.hide();
        this.alertSV.alertBasic('Exito', 'Ajuste creado', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.message, 'error');
      },
    });
  }

  addCount() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.alertSV.alertBasic(
        'Error',
        'Todos los campos son obligatorios',
        'warning',
      );
      return;
    } else {
      //add to array

      //if product exist in array
      if (
        this.productsInventory.find(
          (x) => x.id.toString() === this.productForm.value.id.toString(),
        )
      ) {
        //if type is 1
        if (this.productForm.value.type === '1') {
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString(),
          ).entradas =
            this.productsInventory.find(
              (x) => x.id.toString() === this.productForm.value.id.toString(),
            ).entradas + this.productForm.value.quantity;
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString(),
          ).salidas = 0;
        } else {
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString(),
          ).salidas =
            this.productsInventory.find(
              (x) => x.id.toString() === this.productForm.value.id.toString(),
            ).salidas + this.productForm.value.quantity;
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString(),
          ).entradas = 0;
        }
        this.productsInventory = [...this.productsInventory];
        return;
      } else {
        this.productsInventory.push({
          id: this.newProduct.id,

          costo_neto: this.newProduct.costo_neto,
          costo_imp: this.newProduct.costo_imp,
          descripcion: this.newProduct.descripcion,
          entradas:
            this.productForm.value.type === '1'
              ? this.productForm.value.quantity
              : 0,
          salidas:
            this.productForm.value.type === '2'
              ? this.productForm.value.quantity
              : 0,
        });

        this.productsInventory = [...this.productsInventory];
      }
    }
    this.productForm.controls['id'].setValue('Buscar producto');
    this.productForm.controls['type'].setValue('1');
    this.productForm.controls['quantity'].setValue(1);
  }
  isValidField(field: string) {
    return (
      this.productForm.controls[field].errors &&
      this.productForm.controls[field].touched
    );
  }

  deleteCount(id: number) {
    this.productsInventory = this.productsInventory.filter((x) => x.id !== id);
  }

  ngOnDestroy(): void {
    this.searchTerm.unsubscribe();
  }

  onChangeProduct() {
    this.newProduct = {
      id: +this.productForm.value.id,

      costo_neto: this.products.find(
        (x) => x.id.toString() === this.productForm.value.id.toString(),
      )?.costo_neto,
      costo_imp: this.products.find(
        (x) => x.id.toString() === this.productForm.value.id.toString(),
      )?.costo_imp,
      descripcion: this.products.find(
        (x) => x.id.toString() === this.productForm.value.id.toString(),
      )?.descripcion,
      entradas:
        this.productForm.value.type === '1'
          ? this.productForm.value.quantity
          : 0,
      salidas:
        this.productForm.value.type === '2'
          ? this.productForm.value.quantity
          : 0,
    };
  }
}
