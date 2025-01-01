import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-agregar-datos-reporte',
  templateUrl: './agregarDatosReporte.component.html',
  styleUrls: ['./agregarDatosReporte.component.css'],
})
export class AgregarDatosReporteComponent implements OnInit {
  @Input() show = false;
  @Input() month = 0;
  @Input() year = 2024;

  tipoDatoForm!: FormGroup;
  results: any[] = [];
  private apiService!: ApiService;

  constructor(
    readonly fb: FormBuilder,
    readonly http: HttpClient,
    readonly spinner: NgxSpinnerService,
    readonly as: AlertService
  ) {}

  monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  ngOnInit() {
    this.getReportDataTypes();
    this.tipoDatoForm = this.fb.group({});
  }
  cerrarModal() {
    this.show = false;
    window.location.reload();
  }
  isValidField(field: any) {
    return (
      this.tipoDatoForm.get(field)?.touched &&
      this.tipoDatoForm.get(field)?.invalid
    );
  }
  submit() {
    //marcar campos como tocados
    Object.values(this.tipoDatoForm.controls).forEach((control) => {
      control.markAsTouched();
    });
    //create report data body
    // transformar el objeto a un array de objetos, con id y valor
    const data = [];
    for (const key in this.tipoDatoForm.value) {
      data.push({ id: key, valor: this.tipoDatoForm.value[key] });
    }

    const body = {
      mes: +this.month + 1,
      año: +this.year,
      data: data,
    };
    if (this.tipoDatoForm.valid) {
      this.spinner.show();
      this.apiService = new ApiService(this.http);
      this.apiService.postService(ApiRequest.getReportData, body).subscribe({
        next: (result: any) => {
          this.spinner.hide();
          this.as.alertBasic('Exito', result.msg, 'success');
          setTimeout(() => {
            this.cerrarModal();
          }, 3000);
        },
        error: (error: any) => {
          console.warn(error);
          this.as.alertBasic('Error', error.error.msg, 'error');
          this.spinner.hide();
        },
      });
    }
  }
  formDataType(item: any) {
    if (item.isNumber) {
      return 'number';
    } else {
      return 'text';
    }
  }
  getReportDataTypes() {
    this.apiService = new ApiService(this.http);
    this.apiService
      .getServiceWithParams(ApiRequest.getTipoDatosReportes, {
        activo: 1,
      })
      .subscribe({
        next: (result: any) => {
          this.results = result.data;
          //console.table(this.results);
          if (this.results.length != 0) {
            this.results.forEach((element: any) => {
              // console.log(element);
              if (element.isNumber) {
                this.tipoDatoForm.addControl(
                  element.id,
                  this.fb.control('', [Validators.required, Validators.min(0)])
                );
              } else {
                this.tipoDatoForm.addControl(
                  element.id,
                  this.fb.control('', [Validators.required])
                );
              }
            });
          }
        },
        error: (error: any) => {
          console.warn(error);
          this.as.alertBasic('Error', error.error.msg, 'error');
          this.spinner.hide();
        },
      });
  }
}
