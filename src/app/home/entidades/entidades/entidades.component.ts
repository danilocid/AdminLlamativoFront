import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Entidad } from 'src/app/shared/models/entidad.model';
@Component({
  selector: 'app-entidades',
  templateUrl: './entidades.component.html',
  styleUrls: [],
})
export class EntidadesComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  entidades: Entidad[] = [];

  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private uS: UtilService,
    private router: Router,
    private alertSV: AlertService,
    private http: HttpClient
  ) {
    this.titleService.setTitle('Entidades');
    this.spinner.show();
  }

  ngOnInit(): void {
    this.dtOptions = FormatDataTableGlobal();
    this.apiService = new ApiService(this.http);
    this.apiService.getService(ApiRequest.getEntities + '?t=b').subscribe({
      next: (resp) => {
        if (resp.status === 401 || resp.status === 403) {
          this.router.navigate(['/login']);
          return;
        }
        this.entidades = resp.data;
        this.dtTrigger.next(this.dtOptions);
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
        this.alertSV.alertBasic('Error', error.message, 'error');
      },
    });
  }
}
