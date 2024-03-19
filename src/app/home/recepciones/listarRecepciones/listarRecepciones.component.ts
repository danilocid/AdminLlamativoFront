import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-listar-recepciones',
  templateUrl: './listarRecepciones.component.html',
  styleUrls: ['./listarRecepciones.component.css'],
})
export class ListarRecepcionesComponent implements OnInit {
  recepciones: any[] = [];
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private alertSV: AlertService,
    private http: HttpClient,
    private titleService: Title
  ) {
    this.titleService.setTitle('Recepciones');
  }

  ngOnInit() {
    this.spinner.show();
    this.dtOptions = FormatDataTableGlobal();
    this.getRecepciones();
  }

  getRecepciones() {
    this.apiService = new ApiService(this.http);
    this.apiService.getService(ApiRequest.getRecepciones).subscribe({
      next: (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.recepciones = resp.recepciones;
        this.dtTrigger.next(this.dtOptions);
        this.spinner.hide();
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      },
    });
  }
}
