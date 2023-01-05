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
  styleUrls: ['./create.component.css'],
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
    // this.titleService.setTitle('Articulos - Ver');
    this.spinner.show();
    this.idProducto = this.route.snapshot.paramMap.get('id')!;
    console.log(this.idProducto + ' idProducto');
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
      id: [''],
      cod_interno: ['', [Validators.required]],
      cod_barras: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      costo_neto: ['', [Validators.required]],
      costo_imp: ['', [Validators.required]],
      costo_total: ['', [Validators.required]],
      venta_neto: ['', [Validators.required]],
      venta_imp: ['', [Validators.required]],
      venta_total: ['', [Validators.required]],
      stock_critico: ['', [Validators.required]],
      activo: ['', [Validators.required]],
    });

    if (this.idProducto != null) {
      this.getProduct();
    } else {
      this.spinner.hide();
    }
  }

  getProduct() {
    this.apiService
      .postService(ApiRequest.getArticulosById, { id: this.idProducto })
      .subscribe(
        (resp) => {
          if (resp.status == 401) {
            this.router.navigate(['/login']);
            return;
          }
          console.table(resp.result);
          this.producto = resp.result[0];
          this.productForm.patchValue({
            id: this.producto.id,
            cod_interno: this.producto.cod_interno,
            cod_barras: this.producto.cod_barras,
            descripcion: this.producto.descripcion,
            costo_neto: this.producto.costo_neto,
            costo_imp: this.producto.costo_imp,
            costo_total: this.producto.costo_imp + this.producto.costo_neto,
            venta_neto: this.producto.venta_neto,
            venta_imp: this.producto.venta_imp,
            venta_total: this.producto.venta_neto + this.producto.venta_imp,
            stock_critico: this.producto.stock_critico,
            activo: this.producto.activo,
          });
          this.spinner.hide();
        },
        (err) => {
          console.log(err);
          this.spinner.hide();
        }
      );
  }
  onSubmit() {
    console.log(this.productForm.value);
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

    /*
    this.createUser();
    this.spinner.show(); */
  }
  createProduct() {
    this.spinner.show();
    this.apiService
      .postService(ApiRequest.createArticulo, this.productForm.value)
      .subscribe(
        (resp) => {
          if (resp.status == 401) {
            this.router.navigate(['/login']);
            return;
          }
          console.log(resp);
          this.alertSV.alertBasic('Exito', 'Articulo creado', 'success');
          this.spinner.hide();
          this.router.navigate(['/home/articulos']);
        },
        (err) => {
          console.log(err);
          this.alertSV.alertBasic('Error', err.error.msg, 'error');
          this.spinner.hide();
        }
      );
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
        this.apiService
          .postService(ApiRequest.updateArticulo, this.productForm.value)
          .subscribe(
            (resp) => {
              if (resp.status == 401) {
                this.router.navigate(['/login']);
                return;
              }
              console.log(resp);
              this.spinner.hide();
              this.alertSV.alertBasic(
                'Exito',
                'Articulo editado correctamente',
                'success'
              );
              this.router.navigate(['/home/articulos']);
            },
            (err) => {
              console.log(err);
              this.spinner.hide();
            }
          );
        console.log('editar');
      }
    );
  }

  createUser() {
    const { name, userName, email, password } = this.productForm.value;
    this.apiService.postService('users', {
      name,
      userName,
      email,
      password,
    });
  }

  isValidField(field: string) {
    return (
      this.productForm.controls[field].errors &&
      this.productForm.controls[field].touched
    );
  }

  updateCostoTotal() {
    const costoNeto = this.productForm.controls['costo_neto'].value;
    const costoImp = costoNeto * 1.19 - costoNeto;
    this.productForm.controls['costo_imp'].setValue(Math.round(costoImp));
    this.productForm.controls['costo_total'].setValue(
      Math.round(costoNeto * 1.19)
    );
  }
  updateCostoNeto() {
    const costoTotal = this.productForm.controls['costo_total'].value;
    const costoImp =
      costoTotal - this.productForm.controls['costo_total'].value / 1.19;
    this.productForm.controls['costo_imp'].setValue(Math.round(costoImp));
    this.productForm.controls['costo_neto'].setValue(
      Math.round(costoTotal - costoImp)
    );
  }
  updateVentaTotal() {
    const ventaNeto = this.productForm.controls['venta_neto'].value;
    const ventaImp = ventaNeto * 1.19 - ventaNeto;
    this.productForm.controls['venta_imp'].setValue(Math.round(ventaImp));
    this.productForm.controls['venta_total'].setValue(
      Math.round(ventaNeto * 1.19)
    );
  }
  updateVentaNeto() {
    const ventaTotal = this.productForm.controls['venta_total'].value;
    const ventaImp = ventaTotal - ventaTotal / 1.19;
    this.productForm.controls['venta_imp'].setValue(Math.round(ventaImp));
    this.productForm.controls['venta_neto'].setValue(
      Math.round(ventaTotal - ventaImp)
    );
  }
}
