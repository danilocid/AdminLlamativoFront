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
    console.log(this.tipoDatoForm.value);
    if (this.tipoDatoForm.invalid) {
      return;
    }
    this.spinner.show();
    this.apiService = new ApiService(this.http);
    //trim values from form
    this.tipoDatoForm.value.dato = this.tipoDatoForm.value.dato.trim();
    if (this.idTipoDato != 0) {
      this.tipoDatoForm.value.id = this.idTipoDato;
      this.apiService
        .postService(ApiRequest.updateTipoDatoReporte, this.tipoDatoForm.value)
        .subscribe({
          next: (result: any) => {
            this.as.alertBasic('Exito', result.msg, 'success');
            this.spinner.hide();
            this.cerrarModal();
          },
          error: (error: any) => {
            console.log(error);
            this.as.alertBasic('Error', error.error.msg, 'error');
            this.spinner.hide();
          },
        });
    } else {
      this.apiService
        .postService(ApiRequest.createTipoDatoReporte, this.tipoDatoForm.value)
        .subscribe({
          next: (result: any) => {
            this.as.alertBasic('Exito', result.msg, 'success');
            this.spinner.hide();
            this.cerrarModal();
          },
          error: (error: any) => {
            console.log(error);
            this.as.alertBasic('Error', error.error.msg, 'error');
            this.spinner.hide();
          },
        });
    }
  }
}
