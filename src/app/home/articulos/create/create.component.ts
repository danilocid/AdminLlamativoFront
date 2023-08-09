import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { Product } from 'src/app/shared/models/product.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: [],
})
export class CreateComponent implements OnInit {
  private apiService!: ApiService;
  productForm: FormGroup;
  idProducto = '';
  producto: Product = {} as Product;
  title: string = '';
  constructor(
    private titleService: Title,
    private router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private alertSV: AlertService
  ) {
    this.spinner.show();
    this.idProducto = this.route.snapshot.paramMap.get('id')!;
    //if idProducto is not null, then the title should be "Editar Articulo"

    if (this.idProducto != null) {
      this.titleService.setTitle('Editar Articulo');
      this.title = 'Editar Articulo';
    } else {
      this.titleService.setTitle('Crear Articulo');
      this.title = 'Crear Articulo';
    }
  }

  ngOnInit() {
    this.apiService = new ApiService(this.http);
    this.productForm = this.fb.group({
      internalCode: ['', [Validators.required]],
      barCode: [''],
      description: ['', [Validators.required]],
      netCost: ['', [Validators.required]],
      taxCost: ['', [Validators.required]],
      costo_total: ['', [Validators.required]],
      netSale: ['', [Validators.required]],
      taxSale: ['', [Validators.required]],
      venta_total: ['', [Validators.required]],
      stockMin: ['', [Validators.required]],
      active: ['true', [Validators.required]],
    });

    if (this.idProducto != null) {
      this.getProduct();
    } else {
      this.spinner.hide();
    }
  }

  getProduct() {
    this.apiService
      .getService(ApiRequest.getArticulos + '/' + this.idProducto)
      .subscribe({
        next: (resp) => {
          if (resp.status == 401) {
            this.router.navigate(['/login']);
            return;
          }
          this.producto = resp;
          this.productForm.patchValue({
            internalCode: this.producto.internalCode,
            barCode: this.producto.barCode,
            description: this.producto.description,
            netCost: this.producto.netCost,
            taxCost: this.producto.taxCost,
            costo_total: this.producto.taxCost + this.producto.netCost,
            netSale: this.producto.netSale,
            taxSale: this.producto.taxSale,
            venta_total: this.producto.netCost + this.producto.netSale,
            stockMin: this.producto.stockMin,
            active: this.producto.active,
          });
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
        },
      });
  }
  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.alertSV.alertBasic(
        'Error',
        'Todos los campos son obligatorios',
        'warning'
      );
      return;
    }
    if (this.idProducto != null) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }
  createProduct() {
    this.spinner.show();
    let product = this.productForm.value;
    //remove the costo_total, venta_total fields
    delete product.costo_total;
    delete product.venta_total;

    //if barCode is empty, then delete it
    if (product.barCode == '') {
      delete product.barCode;
    }
    this.apiService.postService(ApiRequest.getArticulos, product).subscribe({
      next: (resp) => {
        if (resp.status == 401) {
          this.router.navigate(['/login']);
          return;
        }
        this.spinner.hide();
        this.alertSV.alertBasic('Exito', 'Articulo creado', 'success');

        this.router.navigate(['/home/articulos']);
      },
      error: (err) => {
        this.spinner.hide();
        this.alertSV.alertBasic('Error', err.error.message, 'error');
      },
    });
  }
  updateProduct() {
    this.alertSV.verificationAlertWithFunction(
      'Editar Articulo',
      '¿Estas seguro de editar este articulo?',
      'Si, editar',
      'No, cancelar',
      'warning',
      () => {
        this.spinner.show();
        let product = this.productForm.value;
        //remove the costo_total, venta_total fields
        delete product.costo_total;
        delete product.venta_total;

        this.apiService
          .patchService(
            ApiRequest.getArticulos + '/' + this.idProducto,
            product
          )
          .subscribe({
            next: (resp) => {
              if (resp.status == 401) {
                this.router.navigate(['/login']);
                return;
              }
              this.spinner.hide();
              this.alertSV.alertBasic(
                'Exito',
                'Articulo editado correctamente',
                'success'
              );
              this.router.navigate(['/home/articulos']);
            },
            error: (err) => {
              this.spinner.hide();
              this.alertSV.alertBasic('Error', err.error.message, 'error');
            },
          });
      }
    );
  }

  isValidField(field: string) {
    return (
      this.productForm.controls[field].errors &&
      this.productForm.controls[field].touched
    );
  }

  updateCostoTotal() {
    const costoNeto = this.productForm.controls['netCost'].value;
    const costoImp = costoNeto * 1.19 - costoNeto;
    this.productForm.controls['taxCost'].setValue(Math.round(costoImp));
    this.productForm.controls['costo_total'].setValue(
      Math.round(costoNeto * 1.19)
    );
  }
  updateCostoNeto() {
    const costoTotal = this.productForm.controls['costo_total'].value;
    const costoImp =
      costoTotal - this.productForm.controls['costo_total'].value / 1.19;
    this.productForm.controls['taxCost'].setValue(Math.round(costoImp));
    this.productForm.controls['netCost'].setValue(
      Math.round(costoTotal - costoImp)
    );
  }
  updateVentaTotal() {
    const ventaNeto = this.productForm.controls['netSale'].value;
    const ventaImp = ventaNeto * 1.19 - ventaNeto;
    this.productForm.controls['taxSale'].setValue(Math.round(ventaImp));
    this.productForm.controls['venta_total'].setValue(
      Math.round(ventaNeto * 1.19)
    );
  }
  updateVentaNeto() {
    const ventaTotal = this.productForm.controls['venta_total'].value;
    const ventaImp = ventaTotal - ventaTotal / 1.19;
    this.productForm.controls['taxSale'].setValue(Math.round(ventaImp));
    this.productForm.controls['netSale'].setValue(
      Math.round(ventaTotal - ventaImp)
    );
  }
}
