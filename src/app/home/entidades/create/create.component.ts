import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest, ServerResponse } from 'src/app/shared/constants';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { Entidad } from 'src/app/shared/models/entidad.model';
import { validarRut } from 'src/app/shared/utils/validaRut';
import { Region } from 'src/app/shared/models/region.model';
import { Commune } from 'src/app/shared/models/commun.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: [],
})
export class CreateComponent implements OnInit {
  private apiService!: ApiService;
  clientForm: FormGroup;
  rutCliente = '';
  cliente: Entidad = {} as Entidad;
  title = '';
  regions: Region[] = [];
  comunas: Commune[] = [];
  constructor(
    readonly titleService: Title,
    readonly router: Router,
    readonly spinner: NgxSpinnerService,
    readonly fb: FormBuilder,
    readonly http: HttpClient,
    readonly route: ActivatedRoute,
    readonly alertSV: AlertService
  ) {
    this.spinner.show();
    this.rutCliente = this.route.snapshot.paramMap.get('id');

    if (this.rutCliente != null) {
      this.titleService.setTitle('Editar Cliente');
      this.title = 'Editar Cliente';
    } else {
      this.titleService.setTitle('Crear Cliente');
      this.title = 'Crear Cliente';
    }
  }

  async ngOnInit(): Promise<void> {
    this.apiService = new ApiService(this.http);
    this.clientForm = this.fb.group({
      rut: ['', [Validators.required, validarRut]],
      nombre: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      comuna: ['Seleccione', [Validators.required]],
      region: ['Seleccione', [Validators.required]],
      mail: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(8)]],
      giro: ['', [Validators.required]],
      tipo: ['B'],
    });
    this.getRegions();
    if (this.rutCliente != null) {
      this.getClientData();
    } else {
      this.spinner.hide();
    }
  }
  getRegions() {
    this.apiService.getService(ApiRequest.getRegiones).subscribe({
      next: (response: ServerResponse) => {
        this.regions = response.data as Region[];
        if (this.rutCliente == null) {
          this.spinner.hide;
        }
      },
      error: (error: ServerResponse) => {
        this.spinner.hide();
        if (
          error.serverResponseMessage != null ||
          error.serverResponseMessage != '' ||
          error.serverResponseMessage != undefined
        ) {
          this.alertSV.alertBasic(
            'Error',
            error.serverResponseMessage,
            'error'
          );
        } else {
          this.alertSV.alertBasic(
            'Error',
            'Error al cargar las regiones',
            'error'
          );
        }
      },
    });
  }
  getComunas(idRegion: string) {
    this.apiService
      .getService(ApiRequest.getComunasByIdRegion + idRegion)
      .subscribe({
        next: (response: ServerResponse) => {
          this.comunas = response.data as Commune[];
          this.spinner.hide();
        },
        error: (error: ServerResponse) => {
          this.spinner.hide();
          if (
            error.serverResponseMessage != null ||
            error.serverResponseMessage != '' ||
            error.serverResponseMessage != undefined
          ) {
            this.alertSV.alertBasic(
              'Error',
              error.serverResponseMessage,
              'error'
            );
          } else {
            this.alertSV.alertBasic(
              'Error',
              'Error al cargar las regiones',
              'error'
            );
          }
        },
      });
    this.spinner.hide();
  }

  getClientData() {
    //remove validation from rut
    this.clientForm.get('rut')?.clearValidators();
    this.apiService
      .getService(ApiRequest.getEntities + '/' + this.rutCliente)
      .subscribe({
        next: (response: any) => {
          this.cliente = response.data as Entidad;
          this.clientForm.patchValue({
            rut: this.cliente.rut,
            nombre: this.cliente.nombre,
            direccion: this.cliente.direccion,
            comuna: this.cliente.comuna.id.toString(),
            region: this.cliente.comuna.region.id.toString(),
            mail: this.cliente.mail,
            telefono: this.cliente.telefono,
            giro: this.cliente.giro,
            tipo: this.cliente.tipo,
          });
          //set the rut to readonly
          this.getComunas(this.cliente.comuna.region.id.toString());
        },
        error: (error: any) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', error.error.message, 'error');
        },
      });
  }
  onChangeRegion() {
    this.spinner.show();
    this.clientForm.get('comuna')?.setValue('');
    this.getComunas(this.clientForm.get('region')?.value);
  }
  isValidField(field: string) {
    return (
      this.clientForm.controls[field].errors &&
      this.clientForm.controls[field].touched
    );
  }
  isEditable() {
    return this.rutCliente != null;
  }
  onSubmit() {
    //check if the form is valid
    this.clientForm.markAllAsTouched();
    if (this.clientForm.invalid) {
      return Object.values(this.clientForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
    this.spinner.show();
    if (this.rutCliente == '' || this.rutCliente == null) {
      //reescribe el rut para que sea valido
      this.clientForm
        .get('rut')
        ?.setValue(this.clientForm.get('rut')?.value.replace(/\./g, ''));
      const body = {
        rut: this.clientForm.get('rut')?.value,
        nombre: this.clientForm.get('nombre')?.value,
        giro: this.clientForm.get('giro')?.value,
        direccion: this.clientForm.get('direccion')?.value,
        id_comuna: +this.clientForm.get('comuna')?.value,
        mail: this.clientForm.get('mail')?.value,
        telefono: +this.clientForm.get('telefono')?.value.toString(),
        tipo: this.clientForm.get('tipo')?.value,
      };
      //se crea el cliente
      this.apiService.postService(ApiRequest.getEntities, body).subscribe({
        next: () => {
          this.spinner.hide();

          this.spinner.hide();
          this.alertSV.alertBasic('Exito', 'Cliente creado', 'success');
          this.router.navigate(['/clientes']);
        },
        error: (error: ServerResponse) => {
          this.spinner.hide();
          console.warn(error);
          this.alertSV.alertBasic(
            'Error',
            error.serverResponseMessage,
            'error'
          );
        },
      });
    } else {
      //reescribe el rut para que sea valido
      this.clientForm
        .get('rut')
        ?.setValue(this.clientForm.get('rut')?.value.replace(/\./g, ''));
      //se edita el cliente
      const body = {
        rut: this.clientForm.get('rut')?.value,
        nombre: this.clientForm.get('nombre')?.value,
        giro: this.clientForm.get('giro')?.value,
        direccion: this.clientForm.get('direccion')?.value,
        id_comuna: +this.clientForm.get('comuna')?.value,
        mail: this.clientForm.get('mail')?.value,
        telefono: +this.clientForm.get('telefono')?.value.toString(),
        tipo: this.clientForm.get('tipo')?.value,
      };
      this.apiService.patchService(ApiRequest.getEntities, body).subscribe({
        next: () => {
          this.spinner.hide();

          this.spinner.hide();
          this.alertSV.alertBasic('Exito', 'Cliente editado', 'success');
        },
        error: (error: HttpErrorResponse) => {
          this.spinner.hide();
          console.warn(error.error);
          this.alertSV.alertBasic(
            'Error',
            error.error.serverResponseMessage,
            'error'
          );
        },
      });
    }
  }
}
