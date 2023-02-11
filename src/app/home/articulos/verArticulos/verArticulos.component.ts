import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { UtilService } from 'src/app/shared/services/util.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/models/product.model';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-verArticulos',
  templateUrl: './verArticulos.component.html',
  styleUrls: ['./verArticulos.component.css'],
})
export class VerArticulosComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  //dtTrigger = new Subject();
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  idProducto = '';
  producto: Product = {} as Product;
  movimientos: any[] = [];
  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private uS: UtilService,
    private alertSV: AlertService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.titleService.setTitle('Articulos - Ver');
    this.spinner.show();
    this.idProducto = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.dtOptions = FormatDataTableGlobal();
    this.apiService = new ApiService(this.http);
    this.apiService
      .postService(ApiRequest.getMovimientosArticulosById, {
        id: this.idProducto,
      })
      .subscribe(
        (resp) => {
          this.producto = resp.result[0];
          this.movimientos = resp.movements;
          console.table(this.movimientos);
          this.dtTrigger.next(this.dtOptions);

          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
        }
      );
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
