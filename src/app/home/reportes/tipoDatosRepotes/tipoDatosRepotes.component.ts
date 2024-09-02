import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-tipo-datos-repotes',
  templateUrl: './tipoDatosRepotes.component.html',
  styleUrls: ['./tipoDatosRepotes.component.css'],
})
export class TipoDatosRepotesComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  tiposDatos: any[] = [];
  private apiService!: ApiService;
  showModal = false;
  tipoDato: any;
  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService,
    private http: HttpClient
  ) {
    this.titleService.setTitle('Tipos de datos reportes');
  }

  showModalCreate() {
    this.showModal = true;
  }
  showModalEdit(tipoDato: any) {
    this.tipoDato = tipoDato;
    this.showModal = true;
  }

  ngOnInit() {
    this.dtOptions = FormatDataTableGlobal();
    this.dtOptions.order = [[2, 'asc']];
    this.spinner.show();
    this.getData();
  }

  private getData() {
    this.apiService = new ApiService(this.http);
    this.apiService.getService(ApiRequest.getTipoDatosReportes).subscribe({
      next: (result: any) => {
        this.tiposDatos = result.data;
        this.dtTrigger.next(this.dtOptions);
        this.spinner.hide();
        //console.table(result.result);
      },
      error: (error: any) => {
        console.warn(error);
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
        this.spinner.hide();
      },
    });
  }
}
