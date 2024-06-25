import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  title = '';
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
    this.idProducto = this.route.snapshot.paramMap.get('id');
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
      description: ['', [Validators.required]],
      barCode: [],
      netCost: ['', [Validators.required]],
      taxCost: ['', [Validators.required]],
      costo_total: ['', [Validators.required]],
      netSale: ['', [Validators.required]],
      taxSale: ['', [Validators.required]],
      venta_total: ['', [Validators.required]],
      stockMin: ['', [Validators.required]],
      active: ['1', [Validators.required]],
      publicado: ['0', [Validators.required]],
      enlace_ml: [],
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
          this.producto = resp.data;
          this.productForm.patchValue({
            internalCode: this.producto.cod_interno,
            barCode: this.producto.cod_barras,
            description: this.producto.descripcion,
            netCost: this.producto.costo_neto,
            taxCost: this.producto.costo_imp,
            costo_total: this.producto.costo_neto + this.producto.costo_imp,
            netSale: this.producto.venta_neto,
            taxSale: this.producto.venta_imp,
            venta_total: this.producto.venta_imp + this.producto.venta_neto,
            stockMin: this.producto.stock_critico,
            enlace_ml: this.producto.enlace_ml ? this.producto.enlace_ml : '',
          });
          //if the product is not active, then set active to 0
          if (!this.producto.activo) {
            this.productForm.controls['active'].setValue('0');
          }

          //if the product is published, then set publicado to 1
          if (this.producto.publicado) {
            this.productForm.controls['publicado'].setValue('1');
          }
          this.spinner.hide();
        },
        error: () => {
          this.spinner.hide();
          this.alertSV.alertBasic(
            'Error',
            'No se pudo obtener la informacion del articulo',
            'error'
          );
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
    const product = {
      cod_interno: this.productForm.controls['internalCode'].value,
      cod_barras: this.productForm.controls['barCode'].value,
      descripcion: this.productForm.controls['description'].value,
      costo_neto: this.productForm.controls['netCost'].value,
      costo_imp: this.productForm.controls['taxCost'].value,
      venta_neto: this.productForm.controls['netSale'].value,
      venta_imp: this.productForm.controls['taxSale'].value,
      stock_critico: this.productForm.controls['stockMin'].value,
      publicado:
        this.productForm.controls['publicado'].value === '1' ? true : false,
      enlace_ml: this.productForm.controls['enlace_ml'].value,
    };

    //

    //if barCode is empty, then delete it
    if (product.cod_barras == '' || product.cod_barras == null) {
      delete product.cod_barras;
    }

    //if enlace_ml is empty, then delete it
    if (product.enlace_ml == '' || product.enlace_ml == null) {
      delete product.enlace_ml;
    }
    this.apiService.postService(ApiRequest.getArticulos, product).subscribe({
      next: (resp) => {
        if (resp.serverResponseCode == 200 || resp.serverResponseCode == 201) {
          this.spinner.hide();
          this.alertSV.alertBasic('Exito', 'Articulo creado', 'success');

          this.router.navigate(['/articulos']);
        } else {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', resp.serverResponseMessage, 'error');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.spinner.hide();
        this.alertSV.alertBasic(
          'Error',
          err.error.serverResponseMessage,
          'error'
        );
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
        const product = {
          id: +this.idProducto,
          cod_interno: this.productForm.controls['internalCode'].value,
          cod_barras: this.productForm.controls['barCode'].value,
          descripcion: this.productForm.controls['description'].value,
          costo_neto: this.productForm.controls['netCost'].value,
          costo_imp: this.productForm.controls['taxCost'].value,
          venta_neto: this.productForm.controls['netSale'].value,
          venta_imp: this.productForm.controls['taxSale'].value,
          stock_critico: this.productForm.controls['stockMin'].value,
          activo:
            this.productForm.controls['active'].value === '1' ? true : false,
          publicado:
            this.productForm.controls['publicado'].value === '1' ? true : false,
          enlace_ml: this.productForm.controls['enlace_ml'].value,
        };

        //if enlace_ml is empty, then delete it
        if (product.enlace_ml == '' || product.enlace_ml == null) {
          delete product.enlace_ml;
        }
        this.apiService.putService(ApiRequest.getArticulos, product).subscribe({
          next: (resp) => {
            if (
              resp.serverResponseCode == 200 ||
              resp.serverResponseCode == 201
            ) {
              this.spinner.hide();
              this.alertSV.alertBasic(
                'Exito',
                'Articulo editado correctamente',
                'success'
              );

              this.router.navigate(['/articulos']);
            } else {
              this.spinner.hide();
              this.alertSV.alertBasic(
                'Error',
                resp.serverResponseMessage,
                'error'
              );
            }
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
