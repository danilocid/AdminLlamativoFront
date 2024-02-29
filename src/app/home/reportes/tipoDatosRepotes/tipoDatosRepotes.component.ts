import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tipoDatosRepotes',
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
  showModal: boolean = false;
  tipoDato: any;
  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private router: Router,
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
        this.tiposDatos = result.result;
        this.dtTrigger.next(this.dtOptions);
        this.spinner.hide();
        //console.table(result.result);
      },
      error: (error: any) => {
        console.log(error);
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
        this.spinner.hide();
      },
    });
  }
}
