import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { debounceTime, Subject } from 'rxjs';
import { ProductInventory } from '../../../shared/models/productInventory.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/shared/models/product.model';
import { MovementType } from 'src/app/shared/models/inventory.model';

@Component({
  selector: 'app-new-inventory',
  templateUrl: './newInventory.component.html',
  styleUrls: [],
})
export class NewInventoryComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  productsInventory: ProductInventory[] = [];
  products: Product[] = [];
  movementTypes: MovementType[] = [];
  date = new Date();
  productForm: FormGroup;
  movementForm: FormGroup;

  newProduct: ProductInventory = {
    id: 0,
    entradas: 0,
    salidas: 0,
    costo_neto: 0,
    costo_imp: 0,
    descripcion: '',
  };
  params = {};
  searchTerm: Subject<string> = new Subject<string>();

  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly router: Router,
    readonly alertSV: AlertService,
    readonly http: HttpClient,
    readonly fb: FormBuilder
  ) {
    this.titleService.setTitle('Articulos');
    this.spinner.show();
    this.initializeSearch();
  }
  ngAfterViewInit() {
    this.dtTrigger.next(this.dtOptions);
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
    this.dtOptions = FormatDataTableGlobal();
    this.apiService = new ApiService(this.http);

    this.apiService.getService(ApiRequest.getMovimientos).subscribe({
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
    this.apiService = new ApiService(this.http);
    this.params = {
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
  saveInventory() {
    if (this.productsInventory.length === 0) {
      this.alertSV.alertBasic(
        'Error',
        'No hay productos para guardar',
        'warning'
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
    this.apiService.postService(ApiRequest.getAllInventory, body).subscribe({
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
        'warning'
      );
      return;
    } else {
      //add to array

      //if product exist in array
      if (
        this.productsInventory.find(
          (x) => x.id.toString() === this.productForm.value.id.toString()
        )
      ) {
        //if type is 1
        if (this.productForm.value.type === '1') {
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          ).entradas =
            this.productsInventory.find(
              (x) => x.id.toString() === this.productForm.value.id.toString()
            ).entradas + this.productForm.value.quantity;
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          ).salidas = 0;
        } else {
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          ).salidas =
            this.productsInventory.find(
              (x) => x.id.toString() === this.productForm.value.id.toString()
            ).salidas + this.productForm.value.quantity;
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          ).entradas = 0;
        }
        this.rerender();
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

        this.rerender();
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
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }
  deleteCount(id: number) {
    this.productsInventory = this.productsInventory.filter((x) => x.id !== id);
    this.rerender();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onChangeProduct() {
    this.newProduct = {
      id: +this.productForm.value.id,

      costo_neto: this.products.find(
        (x) => x.id.toString() === this.productForm.value.id.toString()
      )?.costo_neto,
      costo_imp: this.products.find(
        (x) => x.id.toString() === this.productForm.value.id.toString()
      )?.costo_imp,
      descripcion: this.products.find(
        (x) => x.id.toString() === this.productForm.value.id.toString()
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
