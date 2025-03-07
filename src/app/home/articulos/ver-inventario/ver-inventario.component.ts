import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {
  Inventory,
  InventoryDetail,
} from 'src/app/shared/models/inventory.model';

@Component({
  selector: 'app-ver-inventario',
  templateUrl: './ver-inventario.component.html',
  styleUrls: [],
})
export class VerInventarioComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  idInventario = '';
  movimiento: Inventory = {
    id: 0,
    costo_neto: 0,
    costo_imp: 0,
    entradas: 0,
    salidas: 0,
    tipo_movimiento: '',
    created_at: '',
    name: '',
    observaciones: '',
  };
  articulos: InventoryDetail[] = [];
  date = new Date();
  constructor(
    readonly titleService: Title,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService,
    readonly http: HttpClient,
    readonly route: ActivatedRoute,
    readonly router: Router
  ) {
    this.titleService.setTitle('Invetario - Ver');
    this.spinner.show();
    this.idInventario = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.dtOptions = FormatDataTableGlobal();
    this.apiService = new ApiService(this.http);
    this.apiService
      .getService(ApiRequest.getAllInventory + '/' + this.idInventario)
      .subscribe({
        next: (resp) => {
          if (resp.status) {
            this.spinner.hide();
            this.alertSV.alertBasic('Error', resp.message, 'error');
            //set time out of 3 seconds
            setTimeout(() => {
              this.router.navigate(['/articulos/ajustes']);
            }, 3000);
          }
          this.movimiento = resp.data;
          this.articulos = resp.inventoryDetails;
          this.dtTrigger.next(this.dtOptions);

          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          this.alertSV.alertBasic('Error', error.error.msg, 'error');
        },
      });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
