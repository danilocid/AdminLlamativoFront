import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/ApiService';
import { ApiRequest } from 'src/app/shared/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Title } from '@angular/platform-browser';
import { Sale, SaleDetail } from 'src/app/shared/models/sale.model';
import { FormatDataTableGlobal } from 'src/app/shared/constants';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-verVenta',
  templateUrl: './verVenta.component.html',
  styleUrls: ['./verVenta.component.css'],
})
export class VerVentaComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  venta: Sale = {
    id: 0,
    TotalNet: 0,
    TotalTax: 0,
    TotalNetCost: 0,
    TotalTaxCost: 0,
    documentNumber: 0,
    createdAt: '',
    client: {
      name: '',
      activity: '',
      address: '',
      commune: {
        id: 0,
        comuns: '',
      },
      email: '',
      phone: 0,
      rut: '',
      region: {
        id: 0,
        region: '',
      },
    },
    documentType: {
      id: 0,
      documentType: '',
    },
    paymentMethod: {
      id: 0,
      paymentMethod: '',
    },
  };

  detalleVenta: SaleDetail[] = [];
  date = new Date();
  private apiService!: ApiService;
  idVenta: any;
  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private alertSV: AlertService,
    private titleService: Title,
    private route: ActivatedRoute
  ) {
    this.titleService.setTitle('Ver venta');
    this.spinner.show();
    this.idVenta = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    //console.log(this.idVenta);
    this.dtOptions = FormatDataTableGlobal();
    this.apiService = new ApiService(this.http);
    this.apiService
      .getService(ApiRequest.getSales + '/' + this.idVenta)
      .subscribe({
        next: (resp) => {
          //console.log(resp);
          //console.table(resp.sale[0]);
          this.venta = resp.sale;
          //console.table(this.venta);
          this.detalleVenta = resp.saleDetails;
          //console.table(this.detalleVenta);
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
