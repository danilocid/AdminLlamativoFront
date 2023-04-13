import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { Client } from 'src/app/shared/models/client.model';
import { validarRut } from 'src/app/shared/utils/validaRut';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: [],
})
export class CreateComponent implements OnInit {
  private apiService!: ApiService;
  clientForm: FormGroup;
  rutCliente = '';
  cliente: Client = {} as Client;
  title: string = '';
  regions: any[] = [];
  comunas: any[] = [];
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
    this.rutCliente = this.route.snapshot.paramMap.get('id')!;

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
      comuna: ['', [Validators.required]],
      region: ['', [Validators.required]],
      mail: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(8)]],
      giro: ['', [Validators.required]],
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
      next: (response: any) => {
        console.log(response);
        this.regions = response.data;

        this.spinner.hide();
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log(error);
        this.alertSV.alertBasic('Error', error.error.message, 'error');
      },
    });
  }
  getComunas(idRegion: string) {
    this.apiService
      .postService(ApiRequest.getComunasByIdRegion, { regionid: idRegion })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.comunas = response.data;
          this.spinner.hide();
        },
        error: (error: any) => {
          this.spinner.hide();
          console.log(error);
          this.alertSV.alertBasic('Error', error.error.message, 'error');
        },
      });
    this.spinner.hide();
  }

  getClientData() {
    //remove validation from rut
    this.clientForm.get('rut')?.clearValidators();
    this.apiService
      .postService(ApiRequest.getClientsByRut, { rut: this.rutCliente })
      .subscribe({
        next: (response: any) => {
          this.cliente = response.data[0];
          this.clientForm.patchValue({
            rut: this.cliente.rut,
            nombre: this.cliente.nombre,
            direccion: this.cliente.direccion,
            comuna: this.cliente.id_comuna.toString(),
            region: this.cliente.id_region.toString(),
            mail: this.cliente.mail,
            telefono: this.cliente.telefono,
            giro: this.cliente.giro,
          });
          console.log(this.cliente);
          //set the rut to readonly
          this.getComunas(this.cliente.id_region.toString());
          this.spinner.hide();
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
    console.log(this.clientForm.value);
    if (this.clientForm.invalid) {
      return Object.values(this.clientForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }

    this.spinner.show();
    console.log(this.rutCliente);
    if (this.rutCliente == '' || this.rutCliente == null) {
      //reescribe el rut para que sea valido
      this.clientForm
        .get('rut')
        ?.setValue(this.clientForm.get('rut')?.value.replace(/\./g, ''));
      //se crea el cliente
      this.apiService
        .postService(ApiRequest.createClient, this.clientForm.value)
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.spinner.hide();
            if (response.status == 401) {
              this.router.navigate(['/login']);
              return;
            }
            this.spinner.hide();
            this.alertSV.alertBasic('Exito', 'Cliente creado', 'success');
            this.router.navigate(['/home/clientes']);
          },
          error: (error: any) => {
            this.spinner.hide();
            console.log(error);
            this.alertSV.alertBasic('Error', error.error.msg, 'error');
          },
        });
    } else {
      //reescribe el rut para que sea valido
      this.clientForm
        .get('rut')
        ?.setValue(this.clientForm.get('rut')?.value.replace(/\./g, ''));
      //se edita el cliente
      this.apiService
        .postService(ApiRequest.updateClient, this.clientForm.value)
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.spinner.hide();
            if (response.status == 401) {
              this.router.navigate(['/login']);
              return;
            }
            this.spinner.hide();
            this.alertSV.alertBasic('Exito', 'Cliente editado', 'success');
            this.router.navigate(['/home/clientes']);
          },
          error: (error: any) => {
            this.spinner.hide();
            console.log(error);
            this.alertSV.alertBasic('Error', error.error.msg, 'error');
          },
        });
    }
  }
}
