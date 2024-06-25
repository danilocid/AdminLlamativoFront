import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest, FormatDataTableGlobal } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Inventory } from '../../../shared/models/inventory.model';

@Component({
  selector: 'app-ajustes-de-inventario',
  templateUrl: './ajustesDeInventario.component.html',
  styleUrls: [],
})
export class AjustesDeInventarioComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  private apiService!: ApiService;
  inventories: Inventory[] = [];
  date = new Date();

  constructor(
    private titleService: Title,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService,
    private http: HttpClient
  ) {
    this.titleService.setTitle('Ajustes de Inventario');
    this.spinner.show();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngOnInit() {
    this.dtOptions = FormatDataTableGlobal();
    this.apiService = new ApiService(this.http);
    this.apiService.getService(ApiRequest.getAllInventory).subscribe({
      next: (resp) => {
        this.inventories = resp.result;
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
