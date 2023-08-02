import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-createIssue',
  templateUrl: './createIssue.component.html',
  styleUrls: [],
})
export class CreateIssueComponent implements OnInit {
  private apiService!: ApiService;
  idIssue = '';
  issueStatus = [];
  issueSection = [];
  issueType = [];
  issueForm: FormGroup;
  title = '';
  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private uS: UtilService,
    private alertSV: AlertService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.spinner.show();
    this.idIssue = this.route.snapshot.paramMap.get('id')!;
    if (this.idIssue) {
      this.titleService.setTitle('Issues - Editar');
      this.title = 'Editar Issue';
    } else {
      this.titleService.setTitle('Issues - Crear');
      this.title = 'Crear Issue';
    }
  }

  ngOnInit() {
    this.issueForm = this.fb.group({
      id: [''],
      id_status: ['', [Validators.required, Validators.min(1)]],
      id_section: ['', [Validators.required, Validators.min(1)]],
      id_type: ['', [Validators.required, Validators.min(1)]],
      issue: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.apiService = new ApiService(this.http);
    this.apiService.getService(ApiRequest.statusIssue).subscribe((resp) => {
      this.issueStatus = resp;
    });
    this.apiService.getService(ApiRequest.secctionsIssue).subscribe((resp) => {
      this.issueSection = resp;
    });
    this.apiService.getService(ApiRequest.typeIssue).subscribe((resp) => {
      this.issueType = resp;
    });
    if (this.idIssue) {
      this.apiService
        .getService(ApiRequest.getIssues + '/' + this.idIssue)
        .subscribe({
          next: (resp) => {
            this.issueForm.setValue({
              id: resp.id,
              id_status: resp.issueStatus.id,
              id_section: resp.issueSection.id,
              id_type: resp.issueType.id,
              issue: resp.title,
              description: resp.description,
            });
            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
            this.alertSV.alertBasic(
              'Error',
              'Error al obtener el issue',
              'error'
            );
          },
        });
    } else {
      this.spinner.hide();
    }
  }
  onSubmit() {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();

      return;
    }
    if (this.idIssue != null) {
      this.updateIssue();
    } else {
      this.createIssue();
    }
  }
  isValidField(field: string) {
    return (
      this.issueForm.controls[field].errors &&
      this.issueForm.controls[field].touched
    );
  }
  createIssue() {
    this.spinner.show();
    let body = {
      status: this.issueForm.value.id_status,
      description: '-',
      section: this.issueForm.value.id_section,
      type: this.issueForm.value.id_type,
      title: this.issueForm.value.issue,
    };
    this.apiService.postService(ApiRequest.getIssues, body).subscribe({
      next: (resp) => {
        this.spinner.hide();
        this.alertSV.alertBasic(
          'Creación',
          'Issue creado correctamente',
          'success'
        );
        this.uS.navigateToPath('home/configuracion/issues');
      },
      error: (err) => {
        this.spinner.hide();
        this.alertSV.alertBasic('Error', 'Error al crear el issue', 'error');
      },
    });
  }

  updateIssue() {
    this.spinner.show();
    let body = {
      status: this.issueForm.value.id_status,
      section: this.issueForm.value.id_section,
      type: this.issueForm.value.id_type,
      title: this.issueForm.value.issue,
      description: this.issueForm.value.description,
    };
    this.apiService
      .patchService(ApiRequest.getIssues + '/' + this.idIssue, body)
      .subscribe({
        next: (resp) => {
          this.spinner.hide();
          this.alertSV.alertBasic(
            'Actualización',
            'Issue actualizado correctamente',
            'success'
          );
          this.uS.navigateToPath('home/configuracion/issues');
        },
        error: (err) => {
          this.spinner.hide();
          this.alertSV.alertBasic(
            'Error',
            'Error al actualizar el issue',
            'error'
          );
        },
      });
  }
}
