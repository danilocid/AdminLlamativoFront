import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ProductInventory } from '../../../shared/models/productInventory.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/shared/models/product.model';

@Component({
  selector: 'app-new-inventory',
  templateUrl: './newInventory.component.html',
  styleUrls: [],
})
export class NewInventoryComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  productsInventory: ProductInventory[] = [];
  products: Product[] = [];
  movementTypes: any[] = [];
  date = new Date();
  productForm: FormGroup;
  movementForm: FormGroup;
  newProduct: ProductInventory = {
    id: 0,
    descripcion: '',
    costo_neto: 0,
    costo_imp: 0,
    stock: 0,
    entradas: 0,
    salidas: 0,
  };
  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private uS: UtilService,
    private router: Router,
    private alertSV: AlertService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.titleService.setTitle('Articulos');
    this.spinner.show();
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      id: ['', [Validators.required]],
      type: ['1', [Validators.required]],
      quantity: [1, [Validators.required]],
    });
    this.movementForm = this.fb.group({
      movementType: ['4', [Validators.required]],
      obs: ['', [Validators.required]],
    });
    this.dtOptions = FormatDataTableGlobal();
    this.apiService = new ApiService(this.http);

    this.apiService.getService(ApiRequest.getArticulos).subscribe({
      next: (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.products = resp.result;

        this.dtTrigger.next(this.dtOptions);
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
    this.apiService.getService(ApiRequest.getMovimientos).subscribe({
      next: (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.movementTypes = resp.result;
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
  saveInventory() {
    if (this.productsInventory.length === 0) {
      this.alertSV.alertBasic(
        'Error',
        'No hay productos para guardar',
        'warning'
      );
      //return;
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

    this.apiService
      .postService(ApiRequest.saveInventory, {
        articulos: this.productsInventory,
        tipo_movimiento: this.movementForm.value.movementType,
        obs: this.movementForm.value.obs,
        entradas: entradas,
        salidas: salidas,
        costo_neto: costo_neto,
        costo_imp: costo_imp,
      })
      .subscribe({
        next: (resp) => {
          if (resp.status === 401 || resp.status === 403) {
            this.router.navigate(['/login']);
            return;
          }
          this.spinner.hide().then(() => {
            this.alertSV.alertBasic('Exito', resp.msg, 'success');
            this.router.navigate(['/home/articulos/ajustes']);
          });
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
          )!.entradas =
            this.productsInventory.find(
              (x) => x.id.toString() === this.productForm.value.id.toString()
            )!.entradas + this.productForm.value.quantity;
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )!.salidas = 0;
        } else {
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )!.salidas =
            this.productsInventory.find(
              (x) => x.id.toString() === this.productForm.value.id.toString()
            )!.salidas + this.productForm.value.quantity;
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )!.entradas = 0;
        }
        this.rerender();
        return;
      } else {
        this.productsInventory.push({
          id: this.productForm.value.id,
          descripcion: this.products.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )?.descripcion,
          costo_neto: this.products.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )?.costo_neto,
          costo_imp: this.products.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )?.costo_imp,
          stock: this.products.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )?.stock,
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
    this.productForm.controls['id'].setValue('');
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
}
