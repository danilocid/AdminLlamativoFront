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
      barCode: ['', [Validators.required]],
      description: ['', [Validators.required]],
      netCost: ['', [Validators.required]],
      taxCost: ['', [Validators.required]],
      costo_total: ['', [Validators.required]],
      netSale: ['', [Validators.required]],
      taxSale: ['', [Validators.required]],
      venta_total: ['', [Validators.required]],
      stockMin: ['', [Validators.required]],
      active: ['1', [Validators.required]],
    });

    if (this.idProducto != null) {
      this.getProduct();
    } else {
      this.spinner.hide();
    }
  }

  getProduct() {
    this.apiService
      .postService(ApiRequest.getArticulosById, {
        id: this.idProducto,
      })
      .subscribe({
        next: (resp) => {
          if (resp.status == 401) {
            this.router.navigate(['/login']);
            return;
          }
          this.producto = resp.result[0];
          this.productForm.patchValue({
            internalCode: this.producto.cod_interno,
            barCode: this.producto.cod_barras,
            description: this.producto.descripcion,
            netCost: this.producto.costo_neto,
            taxCost: this.producto.costo_imp,
            costo_total: this.producto.costo_neto + this.producto.costo_imp,
            netSale: this.producto.venta_neto,
            taxSale: this.producto.venta_imp,
            venta_total: this.producto.venta_imp + this.producto.venta_imp,
            stockMin: this.producto.stock_critico,
            active: this.producto.activo,
          });
          console.log(this.producto);
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
    let product = {
      id: this.idProducto,
      cod_interno: this.productForm.controls['internalCode'].value,
      cod_barras: this.productForm.controls['barCode'].value,
      descripcion: this.productForm.controls['description'].value,
      costo_neto: this.productForm.controls['netCost'].value,
      costo_imp: this.productForm.controls['taxCost'].value,
      venta_neto: this.productForm.controls['netSale'].value,
      venta_imp: this.productForm.controls['taxSale'].value,
      stock_critico: this.productForm.controls['stockMin'].value,
      activo: this.productForm.controls['active'].value,
    };

    //if barCode is empty, then delete it
    if (product.cod_barras == '') {
      delete product.cod_barras;
    }
    this.apiService.postService(ApiRequest.createArticulo, product).subscribe({
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
        let product = {
          id: this.idProducto,
          cod_interno: this.productForm.controls['internalCode'].value,
          cod_barras: this.productForm.controls['barCode'].value,
          descripcion: this.productForm.controls['description'].value,
          costo_neto: this.productForm.controls['netCost'].value,
          costo_imp: this.productForm.controls['taxCost'].value,
          venta_neto: this.productForm.controls['netSale'].value,
          venta_imp: this.productForm.controls['taxSale'].value,
          stock_critico: this.productForm.controls['stockMin'].value,
          activo: this.productForm.controls['active'].value,
        };
        this.apiService
          .patchService(ApiRequest.updateArticulo, product)
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
