import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-tipo-de-datos-form',
  templateUrl: './tipoDeDatosForm.component.html',
  styleUrls: ['./tipoDeDatosForm.component.css'],
})
export class TipoDeDatosFormComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() tipoDato: any;
  idTipoDato = 0;
  tipoDatoForm!: FormGroup;
  private apiService!: ApiService;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private as: AlertService
  ) {}

  ngOnInit() {
    this.tipoDatoForm = this.fb.group({
      dato: ['', [Validators.required, Validators.minLength(3)]],
      orden: [1, [Validators.required, Validators.min(1)]],
      isNumber: [0, [Validators.required]],
      isMoney: [0, [Validators.required]],
      activo: [1, [Validators.required]],
    });
  }
  cerrarModal() {
    this.show = false;
    window.location.reload();
  }

  isValidField(field: string) {
    return (
      this.tipoDatoForm.get(field)?.touched &&
      this.tipoDatoForm.get(field)?.invalid
    );
  }
  ngOnChanges() {
    if (this.tipoDato) {
      this.idTipoDato = this.tipoDato.id;
      this.tipoDatoForm.patchValue({
        dato: this.tipoDato.dato,
        orden: this.tipoDato.orden,
        isNumber: this.tipoDato.isNumber,
        isMoney: this.tipoDato.isMoney,
        activo: this.tipoDato.activo,
      });
    }
  }
  submit() {
    this.tipoDatoForm.markAllAsTouched();
    if (this.tipoDatoForm.invalid) {
      return;
    }
    this.spinner.show();
    this.apiService = new ApiService(this.http);
    //trim values from form
    this.tipoDatoForm.value.dato = this.tipoDatoForm.value.dato.trim();
    const body = {
      dato: this.tipoDatoForm.value.dato,
      orden: +this.tipoDatoForm.value.orden,
      isNumber: +this.tipoDatoForm.value.isNumber,
      isMoney: +this.tipoDatoForm.value.isMoney,
      activo: +this.tipoDatoForm.value.activo,
    };
    if (this.idTipoDato != 0) {
      this.apiService
        .patchService(
          ApiRequest.getTipoDatosReportes + '/' + this.idTipoDato,
          body
        )
        .subscribe({
          next: (result: any) => {
            this.as.alertBasic('Exito', result.msg, 'success');
            this.spinner.hide();
            setTimeout(() => {
              this.cerrarModal();
            }, 2000);
          },
          error: (error: any) => {
            console.warn(error);
            this.as.alertBasic('Error', error.error.msg, 'error');
            this.spinner.hide();
          },
        });
    } else {
      this.apiService
        .postService(ApiRequest.getTipoDatosReportes, body)
        .subscribe({
          next: (result: any) => {
            this.as.alertBasic('Exito', result.msg, 'success');
            this.spinner.hide();
            setTimeout(() => {
              this.cerrarModal();
            }, 2000);
          },
          error: (error: any) => {
            console.warn(error);
            this.as.alertBasic(
              'Error',
              error.error.serverResponseMessage,
              'error'
            );
            this.spinner.hide();
          },
        });
    }
  }
}
