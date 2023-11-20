import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { ApiService } from 'src/app/shared/services/ApiService';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-VerRecepcion',
  templateUrl: './VerRecepcion.component.html',
  styleUrls: ['./VerRecepcion.component.css'],
})
export class VerRecepcionComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  idRecepcion = '';
  private apiService!: ApiService;
  dataRecepcion: any = {};
  productsRecepcion: any[] = [];

  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.titleService.setTitle('Recepciones - Ver');
    this.spinner.show();
    this.idRecepcion = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.dtOptions = FormatDataTableGlobal();
    this.getRecepcionData();
  }

  getRecepcionData() {
    this.apiService = new ApiService(this.http);
    this.apiService
      .postService(ApiRequest.getOneRecepcion, { id: this.idRecepcion })
      .subscribe({
        next: (resp) => {
          this.dataRecepcion = resp.recepcion;
          this.productsRecepcion = resp.articles;
          this.dtTrigger.next(this.dtOptions);
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
        },
      });
  }
}
