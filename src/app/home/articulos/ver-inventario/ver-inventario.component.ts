import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-ver-inventario',
  templateUrl: './ver-inventario.component.html',
  styleUrls: ['./ver-inventario.component.scss'],
})
export class VerInventarioComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  //dtTrigger = new Subject();
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  idInventario = '';
  movimiento: any = {};
  articulos: any[] = [];
  date = new Date();
  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private uS: UtilService,
    private alertSV: AlertService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.titleService.setTitle('Invetario - Ver');
    this.spinner.show();
    this.idInventario = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    console.log(this.idInventario);
    this.dtOptions = FormatDataTableGlobal();
    this.apiService = new ApiService(this.http);
    this.apiService
      .postService(ApiRequest.getInventoryById, {
        id: this.idInventario,
      })
      .subscribe(
        (resp) => {
          this.movimiento = resp.movimiento[0];
          this.articulos = resp.productos;
          console.table(this.movimiento);
          console.table(this.articulos);
          this.dtTrigger.next(this.dtOptions);

          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
        }
      );
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
