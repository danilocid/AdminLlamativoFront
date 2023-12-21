import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import * as csv from 'csvtojson';

@Component({
  selector: 'app-importFileCompra',
  templateUrl: './importFileCompra.component.html',
  styleUrls: ['./importFileCompra.component.css'],
})
export class ImportFileCompraComponent implements OnInit {
  @Input() show: boolean = false;
  fileForm!: FormGroup;
  private apiService!: ApiService;
  data: any;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private as: AlertService
  ) {}
  cerrarModal() {
    //reset form
    //this.commentForm.reset();
    //
    this.show = false;
    window.location.reload();
  }
  ngOnInit() {
    this.fileForm = this.fb.group({
      file: ['', Validators.required],
      type: ['R', Validators.required],
    });
  }

  submit() {
    //mark all fields as touched
    this.fileForm.markAllAsTouched();
    if (this.fileForm.invalid) {
      return;
    } else {
      this.spinner.show();
      let data = this.data;
      this.apiService = new ApiService(this.http);
      this.apiService
        .postService(ApiRequest.importFileCompra, {
          data: data,
          type: this.fileForm.value.type,
        })
        .subscribe({
          next: (data: any) => {
            this.spinner.hide();
            this.as.alertBasic('Importación de datos', data.msg, 'success');
            setTimeout(() => {
              this.cerrarModal();
            }, 2000);
          },
          error: (error: any) => {
            this.spinner.hide();
            if (error.status === 400) {
              this.as.alertBasic('Error', error.error.msg, 'error');
            } else {
              this.as.alertBasic(
                'Error',
                'Ocurrio un error al cargar el archivo',
                'error'
              );
            }

            console.log(error);
          },
        });
    }
  }
  onFileChange(event: any) {
    const reader: FileReader = new FileReader();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      //if filename contains PENDIENTE, set type to P, else set type to R
      if (file.name.includes('PENDIENTE')) {
        this.fileForm.get('type')?.setValue('P');
      } else {
        this.fileForm.get('type')?.setValue('R');
      }
      reader.onload = (e: any) => {
        //take the file content and convert to json
        const csvData: string = e.target.result;
        csv({
          delimiter: ';',
        })
          .fromString(csvData)
          .then((jsonObj: any) => {
            this.data = jsonObj;
          });
      };
      reader.readAsText(file);
    }
  }
  isValidField(controlName: string) {
    return (
      this.fileForm.get(controlName)?.invalid &&
      this.fileForm.get(controlName)?.touched
    );
  }
}
