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
import { MovementType } from 'src/app/shared/models/inventory.model';

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
  movementTypes: MovementType[] = [];
  date = new Date();
  productForm: FormGroup;
  movementForm: FormGroup;
  newProduct: ProductInventory = {
    id: 0,
    entries: 0,
    exits: 0,
    netCost: 0,
    taxCost: 0,
    description: '',
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
      id: [, [Validators.required]],
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
        this.products = resp;

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
        this.movementTypes = resp;
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
      return;
    }
    let entradas = 0;
    let salidas = 0;
    let costo_neto = 0;
    let costo_imp = 0;
    this.productsInventory.forEach((element) => {
      if (element.entries > 0) {
        entradas += element.entries;
      }
      if (element.exits > 0) {
        salidas += element.exits;
      }
      costo_neto += element.netCost;
      costo_imp += element.taxCost;
    });

    this.apiService
      .postService(ApiRequest.getAllInventory, {
        products: this.productsInventory,
        movementType: +this.movementForm.value.movementType,
        observations: this.movementForm.value.obs,
        entries: entradas,
        exits: salidas,
        totalNetCost: costo_neto,
        totalTaxCost: costo_imp,
      })
      .subscribe({
        next: (resp) => {
          if (resp.status === 401 || resp.status === 403) {
            this.router.navigate(['/login']);
            return;
          }
          this.spinner.hide();
          this.alertSV.alertBasic('Exito', 'Ajuste creado', 'success');
          window.location.reload();
          //this.router.navigate(['/home/articulos/ajustes']);
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
          )!.entries =
            this.productsInventory.find(
              (x) => x.id.toString() === this.productForm.value.id.toString()
            )!.entries + this.productForm.value.quantity;
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )!.exits = 0;
        } else {
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )!.entries =
            this.productsInventory.find(
              (x) => x.id.toString() === this.productForm.value.id.toString()
            )!.exits + this.productForm.value.quantity;
          this.productsInventory.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )!.entries = 0;
        }
        this.rerender();
        return;
      } else {
        this.productsInventory.push({
          id: +this.productForm.value.id,

          netCost: this.products.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )?.netCost,
          taxCost: this.products.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )?.taxCost,
          description: this.products.find(
            (x) => x.id.toString() === this.productForm.value.id.toString()
          )?.description,
          entries:
            this.productForm.value.type === '1'
              ? this.productForm.value.quantity
              : 0,
          exits:
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
