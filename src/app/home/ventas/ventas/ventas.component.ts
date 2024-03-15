import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormatDataTableGlobal } from 'src/app/shared/constants';
import { Sale } from 'src/app/shared/models/sale.model';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  ventas: Sale[] = [];
  date = new Date();
  private apiService!: ApiService;

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Ventas');
    this.spinner.show();
  }

  ngOnInit(): void {
    this.dtOptions = FormatDataTableGlobal();
    this.apiService = new ApiService(this.http);
    this.apiService.getService(ApiRequest.getSales).subscribe({
      next: (resp) => {
        this.ventas = resp.sales;
        this.dtTrigger.next(this.dtOptions);
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        this.alertSV.alertBasic('Error', error.error.msg, 'error');
      },
    });

    /* this.ventas = [
      {
        id: 1,
        monto_neto: 1000,
        monto_imp: 190,
        tipo_documento: 'Factura',
        n_documento: 1,
        cliente: 'Juan Perez',
        medio_pago: 'Efectivo',
        fecha: '2018-01-01',
        usuario: 'admin',
      },
      {
        id: 2,
        monto_neto: 2000,
        monto_imp: 380,
        tipo_documento: 'Factura',
        n_documento: 2,
        cliente: 'Maria Lopez',
        medio_pago: 'Efectivo',
        fecha: '2018-01-02',
        usuario: 'admin',
      },
    ]; */
    //this.dtTrigger.next(this.dtOptions);
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(null);
    });
  }
}
